import dotenv from 'dotenv';
dotenv.config();

import { NextApiRequest, NextApiResponse } from 'next';
import { atxpClient, SolanaAccount } from "@atxp/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = await atxpClient({
      mcpServer: "https://browse.mcp.atxp.ai",
      account: new SolanaAccount(
        process.env.SOLANA_ENDPOINT_URL!,
        process.env.SOLANA_PRIVATE_KEY!,
      ),
    });

    const { query } = req.body;
    
    const result = await client.callTool({
      name: "browse_browse",
      arguments: {
        query: query || "Why is the sky blue?",
      },
    });

    res.status(200).json({ result });
  } catch (error) {
    console.error('ATXP API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
