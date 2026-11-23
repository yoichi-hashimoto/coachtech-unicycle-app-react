export type UserType =  {
    id: number;
    name: string;
    is_admin: boolean;
    avatar_path: string | null;
    current_level: number;
    received_likes: number;
    success_score: number;
    skill_name: string | null;
}
