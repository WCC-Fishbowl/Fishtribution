import { Catch } from "./Catch";
import { FishTaxon } from "./FishTaxon";
import { User } from "./User";

export type CatchWithRelations = {
    catchRecord: Catch
    user: User
    fishTaxon: FishTaxon
}

export type CatchWithRelationsSearch = {
    taxon_search: string | null
    user_search: string | null
    bait_lure_select: string | null
    use_location: boolean
    date_select: Date | null
    time_start_select: string | null
    time_end_select: string | null
}

export const defaultCatchWithRelationsSearch: CatchWithRelationsSearch = {
    taxon_search: null,
    user_search: null,
    bait_lure_select: null,
    use_location: false,
    date_select: null,
    time_start_select: null,
    time_end_select: null,
}