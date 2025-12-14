import { RatingRecordDTO } from './dto'
import { EventInfo, SectionItem } from './uschess'

export type PartialEventInfo = Pick<EventInfo, 'id' | 'name' | 'endDate'>

export interface IEvent {
  info: PartialEventInfo
  performances: IPerformance[]
}

export interface IPerformance {
  playerId: string
  firstName: string
  lastName: string
  eventId: string
  sectionItem: Pick<SectionItem, 'id' | 'sectionNumber' | 'sectionName'>
  ratingRecords: RatingRecordDTO[]
}
