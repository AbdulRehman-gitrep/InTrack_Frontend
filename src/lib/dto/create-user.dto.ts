import { Role } from "@/lib/types/role"

export interface CreateUserDto {
  fullName: string
  email: string
  password: string
  role: Role
  department: string
  internshipStart?: string
  internshipEnd?: string
}
