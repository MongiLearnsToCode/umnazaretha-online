import { NextResponse } from 'next/server';
import * as jose from 'jose';

export async function POST(request: Request) {
  const { videoId } = await request.json();

  if (!videoId) {
    return NextResponse.json({ error: 'Missing videoId' }, { status: 400 });
  }

  const keyId = process.env.CLOUDFLARE_STREAM_SIGNING_KEY_ID;
  const privateKeyPem = process.env.CLOUDFLARE_STREAM_SIGNING_KEY_PEM;

  if (!keyId || !privateKeyPem) {
    return NextResponse.json({ error: 'Missing Cloudflare Stream signing credentials' }, { status: 500 });
  }

  try {
    const privateKey = await jose.importPKCS8(privateKeyPem, 'RS256');
    
    const payload = {
      sub: videoId,
      kid: keyId,
      exp: Math.floor(Date.now() / 1000) + 3600, // Token expires in 1 hour
      accessRules: [
        {
          type: 'any',
          action: 'allow',
        },
      ],
    };

    const token = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'RS256', kid: keyId })
      .setExpirationTime('1h')
      .sign(privateKey);

    const streamUrl = `https://customer-mhnj3u59da2g04j5.cloudflarestream.com/${videoId}/iframe?token=${token}`;

    return NextResponse.json({ streamUrl });

  } catch (error) {
    console.error('Error signing token:', error);
    return NextResponse.json({ error: 'Failed to generate stream URL' }, { status: 500 });
  }
}