import { Role } from "./role"

export interface User {
  id: string
  fullName: string
  email: string
  role: Role
  department: string
  isActive: boolean
  managerId: string | null
  managerName: string | null
  buddyId: string | null
  buddyName: string | null
  internshipStart: string | null
  internshipEnd: string | null
  createdAt: string
}

export interface CreateUserPayload {
  fullName: string
  email: string
  password: string
  role: Role
  department: string
  internshipStart?: string
  internshipEnd?: string
  managerId?: string
  buddyId?: string
}

export interface EditUserPayload {
  fullName: string
  email: string
  department: string
  internshipStart?: string
  internshipEnd?: string
  managerId?: string
  buddyId?: string
}
