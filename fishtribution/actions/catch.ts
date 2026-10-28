'use server'

import { auth } from '@/lib/auth/server';
import { getCatchesWithRelations, Session } from '@/lib/db'
import type { CatchWithRelationsSearch } from '@/types/CatchWithRelations'
import type { FeedType } from '@/app/(tabs)/home/client'

export async function searchCatches(
    feed: FeedType,
    params: CatchWithRelationsSearch,
) {
    const sessionWrapper = await auth.getSession()
    const session: Session | null = feed === "User" && !sessionWrapper.error
        ? sessionWrapper.data
        : null;
    if (feed !== "Local")
        params.pos = null;
    return getCatchesWithRelations(session, params);
}