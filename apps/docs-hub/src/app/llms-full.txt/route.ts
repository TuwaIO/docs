import { getLlmsFull } from '@/lib/llms';

// Built once at build time, like the pages: it reads the MDX sources, which are not deployed
export const dynamic = 'force-static';

export async function GET() {
  return new Response(await getLlmsFull(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
