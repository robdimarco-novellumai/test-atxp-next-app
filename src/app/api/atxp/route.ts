import { NextRequest, NextResponse } from 'next/server';
import { atxpClient, BaseAccount } from "@atxp/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const client = await atxpClient({
      mcpServer: "https://image.mcp.atxp.ai",
      account: new BaseAccount(
        process.env.BASE_RPC!,
        process.env.BASE_PRIVATE_KEY! as `0x${string}`,
      ),
    });

    const { prompt } = body;
    
    const result = await client.callTool({
      name: "image_create_image",
      arguments: {
        prompt: prompt || "Make an image of a RCMP officer as a goose.",
      },
    }, undefined, {
      timeout: 180000,
    });

    return NextResponse.json({ result });
  } catch (error) {
    console.error('ATXP API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}