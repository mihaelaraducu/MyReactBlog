export interface BasicUser {
  id: number,
}
export interface User extends BasicUser {
  name: string,
  email: string,
  password: string,
  role: string,
  created_at?: Date,
  activ: boolean
}
export interface UserWithDetails extends BasicUser, User {
  userId: number,
  user: User,

}

export type PublicUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at?: Date;
  activ: boolean;
};

export const mapToPublicUser=(user: User): PublicUser=>{
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
    activ: Boolean(user.activ),
  };
}