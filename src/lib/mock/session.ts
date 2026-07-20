import type { User } from "@/lib/types/user"
import { Role } from "@/lib/types/role"
import { mockUsers } from "./users"

const mockUser: User = mockUsers.find((u) => u.role === Role.BUDDY) ?? mockUsers[0]

export const mockSession = {
  user: mockUser,
}
