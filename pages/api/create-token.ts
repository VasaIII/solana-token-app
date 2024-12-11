import type { NextApiRequest, NextApiResponse } from 'next';
import { createSPLToken } from '../lib/createToken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = await createSPLToken();
    res.status(200).json({ token: token.toBase58() });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
}