import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from '../check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check In Use Case', () => {
  beforeEach(() => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(inMemoryCheckInsRepository, gymsRepository)

    gymsRepository.items.push({
      id: 'gym-01',
      title: 'TypeScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-29.3607216),
      longitude: new Decimal(-50.8768549),
    }) // TODO with create method

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -29.3607216,
      userLongitude: -50.8768549,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice per day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -29.3607216,
      userLongitude: -50.8768549,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -29.3607216,
        userLongitude: -50.8768549,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in one time per day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -29.3607216,
      userLongitude: -50.8768549,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -29.3607216,
      userLongitude: -50.8768549,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in at a gym that is far away', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    gymsRepository.items.push({
      id: 'gym-02',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-29.3604598),
      longitude: new Decimal(-50.8217946),
    }) // TODO with create method

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -29.3607216,
        userLongitude: -50.8768549,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
