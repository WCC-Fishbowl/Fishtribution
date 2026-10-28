type UserRole = "angler" | "moderator" | "admin"

export type User = {
    user_id: string
    username: string
    email: string
    display_name: string | null
    role: UserRole
    created_at: Date
    updated_at: Date
}