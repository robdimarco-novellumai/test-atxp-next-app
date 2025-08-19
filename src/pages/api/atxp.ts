import dotenv from 'dotenv';
dotenv.config();

import { NextApiRequest, NextApiResponse } from 'next';
import { atxpClient, BaseAccount } from "@atxp/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = await atxpClient({
      mcpServer: "https://image.mcp.atxp.ai",
      account: new BaseAccount(
        process.env.BASE_RPC!,
        process.env.BASE_PRIVATE_KEY! as `0x${string}`,
      ),
    });

    const { prompt } = req.body;
    
    const result = await client.callTool({
      name: "image_create_image",
      arguments: {
        prompt: prompt || "Make an image of a RCMP officer as a goose.",
      },
    }, undefined, {
      timeout: 180000,
    });

    res.status(200).json({ result });
  } catch (error) {
    console.error('ATXP API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
