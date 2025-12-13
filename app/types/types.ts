import { RatingRecordDTO } from './dto'

export interface EventInfo {
  endDate: string
  id: string
  name: string
}

export interface IEvent {
  info: EventInfo
  performances: IPerformance[]
}

export interface IPerformance {
  playerId: string
  firstName: string
  lastName: string
  eventId: string
  sectionId: string
  sectionName: string
  ratingRecords: RatingRecordDTO[]
}
