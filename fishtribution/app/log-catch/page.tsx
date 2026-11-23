import { getCatchesWithRelations, Session } from '@/lib/db';
import { defaultCatchWithRelationsSearch } from '@/types/CatchWithRelations'
import { auth } from '@/lib/auth/server'
import LogCatchClient from './client';
import { redirect } from 'next/navigation';

export default async function LogCatchPage() {
    const sessionWrapper = await auth.getSession();
    const session: Session | null = !sessionWrapper.error
        ? sessionWrapper.data
        : null;
    
    //if (!session) redirect('/auth/sign-in');

    return <LogCatchClient user_id={session ? session.user.id : null} />;
}