'use server'

import { auth } from '@/lib/auth/server';
import { getCatchesWithRelations, Session } from '@/lib/db';
import type { CatchWithRelationsSearch } from '@/types/CatchWithRelations';
import type { FeedType } from '@/app/(tabs)/home/client';
import { Point } from 'geojson';

export async function searchCatches(
    feed: FeedType,
    user_loc: Point,
    params: CatchWithRelationsSearch,
) {
    const sessionWrapper = await auth.getSession()
    const session: Session | null = feed === "User" && !sessionWrapper.error
        ? sessionWrapper.data
        : null;
    return getCatchesWithRelations(session, feed === "Local" ? user_loc : null, params);
}