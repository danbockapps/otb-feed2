'use server'

import axios, { AxiosResponse } from 'axios'
import { PlayerDTO } from '../types/dto'
import { Player, PlayerSectionsResponse } from '../types/uschess'
import memberData from './sampleData/member.json'
import sectionsData from './sampleData/sections.json'

type PlayerResult =
  | { success: true; data: PlayerDTO }
  | { success: false; error: { status: number; message: string } }

function logWithTimestamp(message: string) {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const year = now.getFullYear()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0')
  const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`
  console.log(`${timestamp} ${message}`)
}

export default async function getPlayer(id: string): Promise<PlayerResult> {
  logWithTimestamp(`Fetching player ${id}...`)

  const result = (
    process.env.USE_DEV_DATA === 'true'
      ? [memberData as Player, sectionsData as PlayerSectionsResponse].map(makeAxiosResponse)
      : await Promise.allSettled([
          axios.get<Player>(`https://ratings-api.uschess.org/api/v1/members/${id}`),
          axios.get<PlayerSectionsResponse>(
            `https://ratings-api.uschess.org/api/v1/members/${id}/sections?Offset=0&Size=5`,
          ),
        ])
  ) as Result

  if (result[0].status === 'fulfilled' && result[1].status === 'fulfilled') {
    const playerData = result[0].value.data
    const sectionsData = result[1].value.data

    logWithTimestamp(`Player ${playerData.firstName} ${playerData.lastName} fetched successfully.`)

    return {
      success: true,
      data: {
        firstName: nameCase(playerData.firstName),
        lastName: nameCase(playerData.lastName),
        events: sectionsData.items.map((section) => ({
          eventId: section.event.id,
          eventName: section.event.name,
          endDate: section.event.endDate,
          sectionId: section.id,
          sectionName: section.sectionName,
          sectionNumber: section.sectionNumber,
          ratingRecords: section.ratingRecords.map((record) => ({
            preRating: record.preRating,
            postRating: record.postRating,
            ratingSource: record.ratingSource,
          })),
        })),
      },
    }
  } else {
    logWithTimestamp(`Failed to fetch player ${id}. Status: ${result[0].status}`)

    if (result[0].status === 'rejected') {
      const error = result[0].reason
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return { success: false, error: { status: 404, message: `Player ${id} not found` } }
      } else {
        return {
          success: false,
          error: {
            status: error.response?.status || 500,
            message: error.message || 'Unknown error',
          },
        }
      }
    } else {
      return { success: false, error: { status: 500, message: 'Unexpected error occurred' } }
    }
  }
}

type Result = [
  PromiseSettledResult<AxiosResponse<Player>>,
  PromiseSettledResult<AxiosResponse<PlayerSectionsResponse>>,
]

const makeAxiosResponse = <T>(obj: T): PromiseSettledResult<{ data: T }> =>
  ({ status: 'fulfilled', value: { data: obj } }) as const

const nameCase = (name: string) => name.split(' ').map(oneNameCase).join(' ')
const oneNameCase = (name: string) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()

// https://ratings-api.uschess.org/api/v1/members/12663913/sections?Offset=0&Size=5
// https://ratings-api.uschess.org/api/v1/members/12663913
