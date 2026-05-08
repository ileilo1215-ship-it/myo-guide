import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

const MOCK_REACTIONS = {};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('postId');

  if (!postId) {
    return NextResponse.json({ error: 'Missing postId' }, { status: 400 });
  }

  const defaultReactions = { empathize: 0, sad: 0, support: 0, learned: 0, angry: 0 };

  try {
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      return NextResponse.json(MOCK_REACTIONS[postId] || defaultReactions);
    }

    const reactions = await kv.hgetall(`reactions:${postId}`);
    return NextResponse.json(reactions || defaultReactions);
  } catch (error) {
    console.error('Error reading KV:', error);
    return NextResponse.json(defaultReactions);
  }
}

export async function POST(request) {
  try {
    const { postId, type, oldType } = await request.json();

    if (!postId || !type) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const defaultReactions = { empathize: 0, sad: 0, support: 0, learned: 0, angry: 0 };

    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      if (!MOCK_REACTIONS[postId]) {
        MOCK_REACTIONS[postId] = { ...defaultReactions };
      }
      if (oldType && MOCK_REACTIONS[postId][oldType] > 0) {
        MOCK_REACTIONS[postId][oldType] -= 1;
      }
      if (type !== 'remove') {
        MOCK_REACTIONS[postId][type] = (MOCK_REACTIONS[postId][type] || 0) + 1;
      }
      return NextResponse.json({ success: true, reactions: MOCK_REACTIONS[postId] });
    }

    // With Vercel KV
    if (oldType) {
      // Decrement old reaction but don't let it go below 0
      const currentOld = await kv.hget(`reactions:${postId}`, oldType);
      if (currentOld > 0) {
        await kv.hincrby(`reactions:${postId}`, oldType, -1);
      }
    }
    
    if (type !== 'remove') {
      await kv.hincrby(`reactions:${postId}`, type, 1);
    }
    
    const newReactions = await kv.hgetall(`reactions:${postId}`);
    return NextResponse.json({ success: true, reactions: newReactions || defaultReactions });
  } catch (error) {
    console.error('Error writing KV:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
