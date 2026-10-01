import { getLlmsIndex } from '@/lib/llms';

// Built once at build time, like the pages
export const dynamic = 'force-static';

export async function GET() {
  return new Response(await getLlmsIndex(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
