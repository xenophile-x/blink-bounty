import {
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
} from "@solana/actions";
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  clusterApiUrl,
} from "@solana/web3.js";
import { createHash } from "crypto";

// Deployed blink_bounty program (Anchor) — see Solana Playground src/lib.rs
const PROGRAM_ID = new PublicKey("un11QcnRqrsvVASqN84UgK6yGkxAhkec9cm5AYfLAk2");
const ESCROW_SEED = "escrow";
const MAX_URL_LEN = 200; // must match #[max_len(200)] on EscrowState.work_submission_url

export async function OPTIONS() {
  return new Response(null, { headers: ACTIONS_CORS_HEADERS });
}

/** Anchor 8-byte discriminator: sha256("global:<ix_name>")[0..8] */
function anchorDiscriminator(ixName: string): Buffer {
  return createHash("sha256").update(`global:${ixName}`).digest().subarray(0, 8);
}

/** Borsh-encode submit_work(work_url: String) = disc + u32 LE len + utf8 bytes */
function encodeSubmitWork(workUrl: string): Buffer {
  const urlBytes = Buffer.from(workUrl, "utf8");
  const buf = Buffer.alloc(8 + 4 + urlBytes.length);
  anchorDiscriminator("submit_work").copy(buf, 0);
  buf.writeUInt32LE(urlBytes.length, 8);
  urlBytes.copy(buf, 12);
  return buf;
}

function escrowPda(founder: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(ESCROW_SEED), founder.toBuffer()],
    PROGRAM_ID
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const founderParam = url.searchParams.get("founder");

  let statusLine = "Lock funds into a trustless in-feed escrow bounty.";
  if (founderParam) {
    try {
      const founder = new PublicKey(founderParam);
      const [escrow] = escrowPda(founder);
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const balance = await connection.getBalance(escrow).catch(() => null);
      statusLine =
        balance !== null && balance > 0
          ? `Active bounty from ${founderParam.slice(0, 6)}… — ${(balance / 1_000_000_000).toFixed(4)} SOL locked. Submit work to claim it.`
          : `Submit work to claim the bounty from founder: ${founderParam.slice(0, 6)}…`;
    } catch {
      statusLine = "Lock funds into a trustless in-feed escrow bounty.";
    }
  }

  const payload: ActionGetResponse = {
    icon: `${url.origin}/Light.png`,
    title: "Blinky Escrow",
    description: statusLine,
    label: "Submit Work",
    links: {
      actions: [
        {
          label: "Submit Deliverable",
          href: `/api/actions/bounty?founder={founder}&url={url}`,
          parameters: [
            {
              name: "founder",
              label: "Founder wallet address",
              required: true,
            },
            {
              name: "url",
              label: "Enter GitHub/Figma Link",
              required: true,
            },
          ],
          type: "transaction",
        },
      ],
    },
  };

  return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const founderParam = url.searchParams.get("founder");
    const workUrl = (url.searchParams.get("url") ?? "").trim();

    if (!founderParam) {
      return Response.json(
        { message: "Missing founder address. Open the Blink link generated for a specific founder." },
        { status: 400, headers: ACTIONS_CORS_HEADERS }
      );
    }
    if (!workUrl) {
      return Response.json(
        { message: "Missing deliverable URL. Paste your GitHub or Figma link." },
        { status: 400, headers: ACTIONS_CORS_HEADERS }
      );
    }
    if (Buffer.byteLength(workUrl, "utf8") > MAX_URL_LEN) {
      return Response.json(
        { message: `Deliverable URL too long (max ${MAX_URL_LEN} bytes). Use a shorter link.` },
        { status: 400, headers: ACTIONS_CORS_HEADERS }
      );
    }

    let founder: PublicKey;
    try {
      founder = new PublicKey(founderParam);
    } catch {
      return Response.json(
        { message: "Invalid founder address." },
        { status: 400, headers: ACTIONS_CORS_HEADERS }
      );
    }

    const body: ActionPostRequest = await request.json();
    let worker: PublicKey;
    try {
      worker = new PublicKey(body.account);
    } catch {
      return Response.json(
        { message: "Invalid worker account. Connect a wallet first." },
        { status: 400, headers: ACTIONS_CORS_HEADERS }
      );
    }

    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const [escrow] = escrowPda(founder);

    // The founder must have called initialize_bounty first (via Playground).
    const escrowInfo = await connection.getAccountInfo(escrow);
    if (!escrowInfo) {
      return Response.json(
        { message: "No active bounty for this founder yet — the escrow account is not initialized." },
        { status: 400, headers: ACTIONS_CORS_HEADERS }
      );
    }

    const submitIx = new TransactionInstruction({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: escrow, isSigner: false, isWritable: true },
        { pubkey: worker, isSigner: true, isWritable: false },
      ],
      data: encodeSubmitWork(workUrl),
    });

    const { blockhash } = await connection.getLatestBlockhash();
    const transaction = new Transaction({
      recentBlockhash: blockhash,
      feePayer: worker,
    }).add(submitIx);

    const serializedTx = transaction
      .serialize({ requireAllSignatures: false, verifySignatures: false })
      .toString("base64");

    const response: ActionPostResponse = {
      type: "transaction",
      transaction: serializedTx,
      message: "Work submitted! The founder (or AI auditor) can now review and release the bounty.",
    };

    return Response.json(response, { headers: ACTIONS_CORS_HEADERS });
  } catch (err) {
    console.error("Blinky bounty POST failed:", err);
    return Response.json(
      { message: "Could not build the submit transaction. Check the founder address and try again." },
      { status: 400, headers: ACTIONS_CORS_HEADERS }
    );
  }
}
