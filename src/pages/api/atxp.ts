import dotenv from 'dotenv';
dotenv.config();

import { NextApiRequest, NextApiResponse } from 'next';
import { atxpClient, ATXPAccount } from "@atxp/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = await atxpClient({
      mcpServer: "https://browse.mcp.atxp.ai",
      account: new ATXPAccount(process.env.ATXP_CONNECTION_TOKEN || ""),
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
