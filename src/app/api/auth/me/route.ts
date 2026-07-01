import { getSessionFromCookies } from '@/lib/auth';
import { jsonError, jsonSuccess } from '@/lib/api-utils';

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return jsonError('Unauthorized', 401);
  }
  return jsonSuccess({ username: session.username, id: session.sub });
}
