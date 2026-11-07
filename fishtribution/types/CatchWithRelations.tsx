import { Catch } from "./Catch";
import { FishTaxon } from "./FishTaxon";
import { User } from "./User";

export type CatchWithRelations = {
    catchRecord: Catch;
    user: User;
    fishTaxon: FishTaxon;
}

export type CatchWithRelationsSearch = {
    searches: string[] | null;
    taxon_searches: string[] | null;
    user_searches: string[] | null;
    bait_lure_select: string | null;
    use_location: boolean;
    date_select: string | null;
    time_start_select: string | null;
    time_end_select: string | null;
    offset: number;
}

export const defaultCatchWithRelationsSearch: CatchWithRelationsSearch = {
    searches: null,
    taxon_searches: null,
    user_searches: null,
    bait_lure_select: null,
    use_location: false,
    date_select: null,
    time_start_select: null,
    time_end_select: null,
    offset: 0,
}