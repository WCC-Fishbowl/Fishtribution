import { Point } from "geojson"

export type Catch = {
    catch_id: string
    user_id: string
    taxon_id: string
    weight_kg: number | null
    length_cm: number | null
    bait_or_lure: string | null
    notes: string | null
    pos: Point | null
    caught_at: Date
    created_at: Date
    updated_at: Date
    deleted_at: Date | null
}