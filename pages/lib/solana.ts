// Description: This file contains the code to establish a connection to the Solana blockchain and create a new wallet.
import { Connection, clusterApiUrl, Keypair } from '@solana/web3.js';

// Establish a connection to the cluster devnet
export const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

// Create a new wallet and return the public key
export const createKeypair = () => {
  return Keypair.generate();
};