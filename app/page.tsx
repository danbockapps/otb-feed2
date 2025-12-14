'use client'

import { useCallback, useEffect, useReducer } from 'react'
import EventDisplay from './components/EventDisplay'
import getPlayer from './lib/getPlayer'
import makeEvents from './lib/makeEvents'
import { initialState, reducer } from './reducer'
import { IEvent } from './types/types'

export default function Page() {
  const [state, dispatch] = useReducer(reducer, initialState)
  console.log(state)

  const fetchPlayerData = useCallback(() => {
    state.playerIds.forEach(async (id) => {
      const data = await getPlayer(id)
      dispatch({ type: 'ADD_PERFORMANCES', payload: { playerId: id, dto: data } })
    })
  }, [state.playerIds])

  useEffect(fetchPlayerData, [fetchPlayerData])

  const events = Object.entries(state.dtos)
    .reduce<IEvent[]>(makeEvents, [])
    .sort((a, b) => (a.info.endDate < b.info.endDate ? 1 : -1))

  console.log('events', events)

  return (
    <main>
      {events.map((e) => (
        <EventDisplay key={e.info.id} event={e.info} sections={e.performances} />
      ))}
    </main>
  )
}
