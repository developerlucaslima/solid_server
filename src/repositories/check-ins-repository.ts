import { CheckIn, Prisma } from '@prisma/client'

export interface CheckInsRepository {
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
  findManyByUserId(userId: string): Promise<CheckIn | null>
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
}
