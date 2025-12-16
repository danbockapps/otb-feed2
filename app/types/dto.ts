import { RatingRecord } from './uschess'

export interface PlayerDTO {
  firstName: string
  lastName: string
  events: EventDTO[]
}

interface EventDTO {
  eventId: string
  eventName: string
  endDate: string
  sectionId: string
  sectionName: string
  sectionNumber: number
  ratingRecords: RatingRecordDTO[]
}

export type RatingRecordDTO = Pick<RatingRecord, 'preRating' | 'postRating' | 'ratingSource'>
