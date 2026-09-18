import { 
  ActionGetResponse, 
  ActionPostRequest, 
  ActionPostResponse, 
  ACTIONS_CORS_HEADERS 
} from "@solana/actions";
import { 
  Connection, 
  PublicKey, 
  Transaction, 
  TransactionInstruction, 
  clusterApiUrl 
} from "@solana/web3.js";

const PROGRAM_ID = new PublicKey("un11QcnRqrsvVASqN84UgK6yGkxAhkec9cm5AYfLAk2");

export async function OPTIONS() {
  return new Response(null, { headers: ACTIONS_CORS_HEADERS });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const founderParam = url.searchParams.get("founder");

  const payload: ActionGetResponse = {
    icon: "https://solana.com/favicon.ico",
    title: "BlinkBounty Escrow",
    description: founderParam 
      ? `Submit work to claim the active bounty from founder: ${founderParam.slice(0, 6)}...`
      : "Lock funds into a trustless in-feed escrow bounty.",
    label: "Submit Work",
    links: {
      actions: [
        {
            label: "Submit Deliverable",
            href: "/api/actions/bounty?founder={founder}&url={url}",
            parameters: [
                {
                    name: "url",
                    label: "Enter GitHub/Figma Link",
                    required: true
                }
            ],
            type: "transaction"
        }
      ]
    }
  };

  return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });
}
export async function POST(request: Request) {
  try {
    const body: ActionPostRequest = await request.json();
    const workerPublicKey = new PublicKey(body.account);

    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const { blockhash } = await connection.getLatestBlockhash();

    const transaction = new Transaction();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = workerPublicKey;

    const serializedTx = transaction.serialize({ requireAllSignatures: false }).toString("base64");

    const response: ActionPostResponse = {
      type: "transaction", // <--- ADD THIS FIELD
      transaction: serializedTx,
      message: "Work submitted successfully to Escrow Blink!"
    };

    return Response.json(response, { headers: ACTIONS_CORS_HEADERS });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid transaction" }), {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
}