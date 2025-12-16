import { EventDTO, PlayerDTO } from '../types/dto'
import { IEvent, IPerformance } from '../types/types'

const makeEvents = (acc: IEvent[], cur: [string, PlayerDTO]) => {
  const [playerId, dto] = cur

  const performances: IPerformance[] = dto.events.map((e) => ({
    playerId,
    firstName: dto.firstName,
    lastName: dto.lastName,
    eventId: e.eventId,
    sectionItem: {
      id: e.sectionId,
      sectionName: e.sectionName,
      sectionNumber: e.sectionNumber,
    },
    ratingRecords: e.ratingRecords,
  }))

  const accEventIds = new Set(acc.map((e) => e.info.id))

  const newEvents = dto.events
    .filter((e) => !accEventIds.has(e.eventId))
    .reduce<EventDTO[]>( // dedupe
      (acc2, cur2) => (acc2.some((e) => e.eventId === cur2.eventId) ? acc2 : [...acc2, cur2]),
      [],
    )
    .map((e) => ({
      info: { id: e.eventId, name: e.eventName, endDate: e.endDate },
      performances: [],
    }))

  return performances.reduce<IEvent[]>(
    (acc2, cur2) =>
      acc2.map((e) =>
        e.info.id === cur2.eventId ? { info: e.info, performances: [...e.performances, cur2] } : e,
      ),
    [...acc, ...newEvents],
  )
}

export default makeEvents
