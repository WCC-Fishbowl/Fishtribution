export type FishTaxon = {
  taxon_id: string
  common_name: string
  scientific_name: string
  family: string | null
  genus: string | null
  description: string | null
  created_at: Date
}