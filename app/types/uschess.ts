export type RatingRecord = {
  eventId: string
  sectionNumber: number
  preRating: number
  preRatingDecimal: number
  postRating: number
  postRatingDecimal: number
  ratingSource: string
}

export type EventInfo = {
  id: string
  name: string
  startDate: string // ISO date string
  endDate: string // ISO date string
  stateCode: string
}

type SectionItem = {
  id: string
  sectionNumber: number
  sectionName: string
  startDate: string // ISO date string
  endDate: string // ISO date string
  format: string
  ratingSystem: string
  ratingRecords: RatingRecord[]
  event: EventInfo
}

export type PlayerSectionsResponse = {
  items: SectionItem[]
  offset: number
  pageSize: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export type Player = {
  id: string
  fideId: string
  fideCountry: string
  firstName: string
  lastName: string
  gender: string
  lastChangedDate: string // ISO date string
  rank: number
  stateRep: string
  jurisdiction: string
  stateRank: number
  ratings: Rating[]
  status: string
  expirationDate: string // ISO date string
}

type Rating = {
  rating: number
  ratingSystem: string
  gamesPlayed: number
  isProvisional: boolean
  floor: number
}
