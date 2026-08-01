import type { VercelRequest, VercelResponse } from "@vercel/node";

export function sendJSON(res: VercelResponse, data: any, status = 200) {
  res.status(status).json(data);
}

export function sendError(res: VercelResponse, message: string, status = 400) {
  res.status(status).json({ error: message });
}

export async function getBody(req: VercelRequest): Promise<any> {
  if (req.body) return req.body;
  try {
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(Buffer.from(chunk));
    }
    return JSON.parse(Buffer.concat(chunks).toString());
  } catch {
    return {};
  }
}
