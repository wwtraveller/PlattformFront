
export interface Role {
  id: number;
  authority: string;
}

export interface IUserData {
  id: number
  username: string
  email: string
  firstName:string
  lastName:string
  photo:string | null
  accessToken: string
  refreshToken: string
  roles: Role[]
  avatar: string
  }
  