import { Connection, Keypair, LAMPORTS_PER_SOL, TransactionSignature, PublicKey } from '@solana/web3.js';
import { createMint, TOKEN_PROGRAM_ID } from '@solana/spl-token';

// Create a new connection to the devnet
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// Function to create a new keypair (wallet)
const createKeypair = (): Keypair => {
  return Keypair.generate();
};

// Function to airdrop SOL with a timeout
const airdropSol = async (publicKey: PublicKey): Promise<TransactionSignature> => {
  const airdropSignature = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);
  const timeout = 30000; // 30 seconds
  const start = Date.now();

  while (true) {
    const status = await connection.getSignatureStatus(airdropSignature);
    if (status.value?.confirmationStatus === 'finalized') {
      return airdropSignature;
    }
    if (Date.now() - start > timeout) {
      throw new Error('Airdrop confirmation timed out');
    }
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
  }
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
  return token;
};