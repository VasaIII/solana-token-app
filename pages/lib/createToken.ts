import { Keypair, Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createMint } from '@solana/spl-token';
import { Option, Creator, Collection, Uses } from '@metaplex-foundation/mpl-token-metadata';
import { createMetadata, DataV2 } from '@metaplex-foundation/mpl-token-metadata';

// Create a new connection to the devnet
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// Function to create a new keypair (wallet)
const createKeypair = (): Keypair => {
  return Keypair.generate();
};

// Function to airdrop SOL with a timeout
const airdropSol = async (publicKey: PublicKey): Promise<void> => {
  const airdropSignature = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);
  await connection.confirmTransaction(airdropSignature, 'finalized');
};

// Create a new SPL token and return it
export const createSPLToken = async () => {
  const payer = createKeypair(); // Create a new wallet to pay for the creation of the token
  const mintAuthority = createKeypair(); // Create a new wallet to act as the mint authority
  const freezeAuthority = createKeypair(); // Create a new wallet to act as the freeze authority

  // Airdrop SOL to the payer account
  await airdropSol(payer.publicKey);

  // Create a new token with 9 decimal places and return it to the caller
  const token = await createMint(
    connection,
    payer,
    mintAuthority.publicKey,
    freezeAuthority.publicKey,
    9 // Decimals
  );

  console.log('Token created:', token.toBase58());

  // Define metadata
  const metadata: DataV2 = {
    name: "My Token",
    symbol: "MTK",
    uri: "https://example.com/token-metadata.json", // URL to the token metadata JSON file
    sellerFeeBasisPoints: 0, // Optional: Set to 0 if not used
    creators: null as Option<Array<Creator>>, // Optional: List of creators
    collection: null as Option<Collection>, // Optional: Collection info
    uses: null as Option<Uses> // Optional: Usage info
  };

  // Create metadata for the token
  await createMetadata(
    connection,
    payer,
    mintAuthority.publicKey,
    token,
    mintAuthority.publicKey,
    payer.publicKey,
    metadata
  );

  console.log('Metadata created for token:', token.toBase58());
  return token;
};