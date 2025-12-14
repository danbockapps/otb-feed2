import { PlayerDTO } from '../types/dto'
import { IEvent, IPerformance } from '../types/types'

const makeEvents = (acc: IEvent[], cur: [string, PlayerDTO]) => {
  const [playerId, dto] = cur

  const performances: IPerformance[] = dto.events.map((e) => ({
    playerId,
    firstName: dto.firstName,
    lastName: dto.lastName,
    eventId: e.eventId,
    sectionId: e.sectionId,
    sectionName: e.sectionName,
    sectionNumber: e.sectionNumber,
    ratingRecords: e.ratingRecords,
  }))

  const accEventIds = new Set(acc.map((e) => e.info.id))
  const newEvents = dto.events.filter((e) => !accEventIds.has(e.eventId))
  const unchangedEvents = acc.filter((e) => !dto.events.some((de) => de.eventId === e.info.id))
  const changedEvents = acc.filter((e) => dto.events.some((de) => de.eventId === e.info.id))

  return [
    ...unchangedEvents,
    ...changedEvents.map((e) => ({
      ...e,
      performances: [...e.performances, ...performances.filter((p) => p.eventId === e.info.id)],
    })),
    ...newEvents.map((e) => ({
      info: {
        id: e.eventId,
        name: e.eventName,
        endDate: e.endDate,
      },
      performances: performances.filter((p) => p.sectionId === e.sectionId),
    })),
  ]
}

export default makeEvents
