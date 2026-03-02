import axios, { AxiosRequestConfig } from 'axios'
import { NextRequest, NextResponse } from 'next/server'
import memberData from '../../../lib/sampleData/member.json'
import sectionsData from '../../../lib/sampleData/sections.json'
import { PlayerDTO } from '../../../types/dto'
import { Player, PlayerSectionsResponse } from '../../../types/uschess'

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

const nameCase = (name: string) => name.split(' ').map(oneNameCase).join(' ')
const oneNameCase = (name: string) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()

const randomDelay = () => new Promise((resolve) => setTimeout(resolve, Math.random() * 2000))
const config: AxiosRequestConfig = { timeout: 10000 }

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const notFoundResponse = NextResponse.json(
    { success: false, error: { status: 404, message: `Player ${id} not found` } },
    { status: 404 },
  )

  if (id === 'e') return notFoundResponse // Quick hack to test 404 handling
  logWithTimestamp(`Fetching player ${id}...`)

  try {
    const [playerResult, sectionsResult] =
      process.env.USE_DEV_DATA === 'true'
        ? [
            { status: 'fulfilled' as const, value: { data: memberData as Player } },
            {
              status: 'fulfilled' as const,
              value: { data: sectionsData as PlayerSectionsResponse },
            },
          ]
        : await Promise.allSettled([
            axios.get<Player>(`https://ratings-api.uschess.org/api/v1/members/${id}`, config),
            axios.get<PlayerSectionsResponse>(
              `https://ratings-api.uschess.org/api/v1/members/${id}/sections?Offset=0&Size=${
                process.env.NODE_ENV === 'development' ? 5 : 30
              }`,
              config,
            ),
          ])

    if (process.env.USE_DEV_DATA === 'true') {
      await randomDelay()
    }

    if (playerResult.status === 'fulfilled' && sectionsResult.status === 'fulfilled') {
      const playerData = playerResult.value.data
      const playerSectionsData = sectionsResult.value.data

      logWithTimestamp(
        `Player ${playerData.firstName} ${playerData.lastName} fetched successfully.`,
      )

      const dto: PlayerDTO = {
        firstName: nameCase(playerData.firstName),
        lastName: nameCase(playerData.lastName),
        events: playerSectionsData.items.map((section) => ({
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
      }

      return NextResponse.json({ success: true, data: dto })
    } else {
      logWithTimestamp(`Failed to fetch player ${id}. Status: ${playerResult.status}`)

      if (playerResult.status === 'rejected') {
        const error = playerResult.reason

        // Log detailed error information for debugging
        if (axios.isAxiosError(error)) {
          logWithTimestamp(`Axios error details:`)
          logWithTimestamp(`  Code: ${error.code}`)
          logWithTimestamp(`  Message: ${error.message}`)
          logWithTimestamp(`  Response status: ${error.response?.status}`)
          logWithTimestamp(`  Response data: ${JSON.stringify(error.response?.data)}`)
        } else {
          logWithTimestamp(`Non-axios error: ${error}`)
        }

        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return notFoundResponse
        } else {
          return NextResponse.json(
            {
              success: false,
              error: {
                status: error.response?.status || 500,
                message: error.message || 'Unknown error',
              },
            },
            { status: error.response?.status || 500 },
          )
        }
      } else {
        return NextResponse.json(
          { success: false, error: { status: 500, message: 'Unexpected error occurred' } },
          { status: 500 },
        )
      }
    }
  } catch (error) {
    logWithTimestamp(`Unexpected error in API route: ${error}`)
    return NextResponse.json(
      { success: false, error: { status: 500, message: 'Internal server error' } },
      { status: 500 },
    )
  }
}

// https://ratings-api.uschess.org/api/v1/members/12663913/sections?Offset=0&Size=5
// https://ratings-api.uschess.org/api/v1/members/12663913
