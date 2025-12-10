export type RatingRecord = {
  eventId: string;
  sectionNumber: number;
  preRating: number;
  preRatingDecimal: number;
  postRating: number;
  postRatingDecimal: number;
  ratingSource: string;
};

export type EventInfo = {
  id: string;
  name: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  stateCode: string;
};

export type SectionItem = {
  id: string;
  sectionNumber: number;
  sectionName: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  format: string;
  ratingSystem: string;
  ratingRecords: RatingRecord[];
  event: EventInfo;
};

export type PlayerSectionsResponse = {
  items: SectionItem[];
  offset: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};
