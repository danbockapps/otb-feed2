'use client'

import { useCallback, useEffect, useReducer, useState } from 'react'
import AddPlayerDialog from './components/AddPlayerDialog'
import EventDisplay from './components/EventDisplay'
import PlayerList from './components/PlayerList'
import Toast from './components/Toast'
import getPlayer from './lib/getPlayer'
import makeEvents from './lib/makeEvents'
import { getIds, removeId } from './lib/manageLocalStorage'
import { initialState, reducer } from './reducer'
import { IEvent } from './types/types'

export default function Page() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: '',
  })
  console.log({ state })

  const addPlayer = useCallback(async (playerId: string) => {
    const result = await getPlayer(playerId)

    if (result.success) {
      dispatch({
        type: 'ADD_PLAYER',
        payload: { id: playerId, firstName: result.data.firstName, lastName: result.data.lastName },
      })

      dispatch({ type: 'ADD_PERFORMANCES', payload: { playerId, dto: result.data } })
    } else {
      console.error(
        `Failed to add player ${playerId}: ${result.error.status} - ${result.error.message}`,
      )
      setToast({ show: true, message: result.error.message })
      removeId(playerId)
    }
  }, [])

  const fetchPlayerData = useCallback(() => {
    // Probably relevant in dev only
    dispatch({ type: 'RESET' })

    getIds().forEach(addPlayer)
  }, [addPlayer])

  useEffect(fetchPlayerData, [fetchPlayerData])

  const events = Object.entries(state.dtos)
    .reduce<IEvent[]>(makeEvents, [])
    .sort((a, b) => (a.info.endDate < b.info.endDate ? 1 : -1))

  return (
    <main className="p-6 flex flex-col items-center">
      <PlayerList
        players={state.players}
        onRemovePlayer={(id) => {
          dispatch({ type: 'REMOVE_PLAYER', payload: id })
          removeId(id)
        }}
      />

      <div className="my-8">
        <AddPlayerDialog {...{ addPlayer }} />
      </div>

      <div className="space-y-8">
        {events.map((e) => (
          <EventDisplay key={e.info.id} event={e.info} performances={e.performances} />
        ))}
      </div>

      {toast.show && (
        <Toast message={toast.message} close={() => setToast({ show: false, message: '' })} />
      )}
    </main>
  )
}
