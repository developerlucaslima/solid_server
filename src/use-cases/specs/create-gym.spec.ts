import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { CreateGymUseCase } from '../create-gym'

let inMemoryGymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(inMemoryGymsRepository)
  })

  it('should be able to register', async () => {
    const { gym } = await sut.execute({
      title: 'TypeScript Gym',
      description: null,
      phone: null,
      latitude: -29.3607216,
      longitude: -50.8768549,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
