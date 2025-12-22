'use client'

import { useCallback, useEffect, useReducer } from 'react'
import AddPlayerDialog from './components/AddPlayerDialog'
import EventDisplay from './components/EventDisplay'
import PlayerList from './components/PlayerList'
import defaultPlayerIds from './lib/defaultPlayerIds'
import getPlayer from './lib/getPlayer'
import makeEvents from './lib/makeEvents'
import { initialState, reducer } from './reducer'
import { IEvent } from './types/types'

export default function Page() {
  const [state, dispatch] = useReducer(reducer, initialState)
  console.log({ state })

  const addPlayer = useCallback(async (playerId: string) => {
    const dto = await getPlayer(playerId)

    dispatch({
      type: 'ADD_PLAYER',
      payload: { id: playerId, firstName: dto.firstName, lastName: dto.lastName },
    })

    dispatch({ type: 'ADD_PERFORMANCES', payload: { playerId, dto } })
  }, [])

  const fetchPlayerData = useCallback(() => {
    let storedPlayerIds = localStorage.getItem('playerIds')

    if (storedPlayerIds === null) {
      // Initial page load. Set default players.
      localStorage.setItem('playerIds', defaultPlayerIds)
      storedPlayerIds = defaultPlayerIds
    }

    // Probably relevant in dev only
    dispatch({ type: 'RESET' })

    storedPlayerIds.split(',').forEach(addPlayer)
  }, [addPlayer])

  useEffect(fetchPlayerData, [fetchPlayerData])

  const events = Object.entries(state.dtos)
    .reduce<IEvent[]>(makeEvents, [])
    .sort((a, b) => (a.info.endDate < b.info.endDate ? 1 : -1))

  return (
    <main className="p-6 flex flex-col items-center">
      <PlayerList
        players={state.players}
        onRemovePlayer={(id) => dispatch({ type: 'REMOVE_PLAYER', payload: id })}
      />
      <div className="my-8">
        <AddPlayerDialog {...{ addPlayer }} />
      </div>
      <div className="space-y-8">
        {events.map((e) => (
          <EventDisplay key={e.info.id} event={e.info} performances={e.performances} />
        ))}
      </div>
    </main>
  )
}
