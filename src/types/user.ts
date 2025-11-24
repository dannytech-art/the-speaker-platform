export type UserRole = "user" | "speaker" | "admin";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

