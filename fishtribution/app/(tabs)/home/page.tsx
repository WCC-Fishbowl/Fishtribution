
import { getCatchesWithRelations, Session } from '@/lib/db';
import { defaultCatchWithRelationsSearch } from '@/types/CatchWithRelations'
import { auth } from '@/lib/auth/server'
import HomeClient from './client';

export default async function HomePage() {
  const sessionWrapper = await auth.getSession();
  const session: Session | null = !sessionWrapper.error
    ? sessionWrapper.data
    : null;
  const catches = await getCatchesWithRelations(session, null, defaultCatchWithRelationsSearch);
  return <HomeClient catchesParam={catches} />;
}