import { RatingRecordDTO } from './dto'
import { EventInfo, SectionItem } from './uschess'

export type PartialEventInfo = Pick<EventInfo, 'id' | 'name' | 'endDate'>

export interface IEvent {
  info: PartialEventInfo
  performances: IPerformance[]
}

export type PerformanceSection = Pick<SectionItem, 'id' | 'sectionNumber' | 'sectionName'>

export interface IPerformance {
  playerId: string
  firstName: string
  lastName: string
  eventId: string
  sectionItem: PerformanceSection
  ratingRecords: RatingRecordDTO[]
}
