'use client'

import { useCallback, useEffect, useReducer, useState } from 'react'
import AddPlayerDialog from './components/AddPlayerDialog'
import EventDisplay from './components/EventDisplay'
import PlayerList from './components/PlayerList'
import Toast from './components/Toast'
import makeEvents from './lib/makeEvents'
import { getIds, getRawStoredIds, removeId } from './lib/manageLocalStorage'
import { initialState, reducer } from './reducer'
import { PlayerDTO } from './types/dto'
import { IEvent } from './types/types'

type PlayerResult =
  | { success: true; data: PlayerDTO }
  | { success: false; error: { status: number; message: string } }

async function getPlayer(id: string): Promise<PlayerResult> {
  const response = await fetch(`/api/players/${id}`)
  const data = await response.json()
  return data
}

export default function Page() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: '',
  })
  const [loadingState, setLoadingState] = useState<{
    total: number
    completed: number
    isLoading: boolean
  }>({ total: 0, completed: 0, isLoading: false })

  if (typeof window !== 'undefined') {
    console.log({ state })
    console.log({ storedIds: getRawStoredIds() })
  }

  const addPlayer = useCallback(async (playerId: string) => {
    try {
      const result = await getPlayer(playerId)

      if (result.success) {
        dispatch({
          type: 'ADD_PLAYER',
          payload: {
            id: playerId,
            firstName: result.data.firstName,
            lastName: result.data.lastName,
          },
        })

        dispatch({ type: 'ADD_PERFORMANCES', payload: { playerId, dto: result.data } })
      } else {
        console.error(
          `Failed to add player ${playerId}: ${result.error.status} - ${result.error.message}`,
        )
        setToast({ show: true, message: result.error.message })
        removeId(playerId)
      }
    } finally {
      setLoadingState((prev) => ({ ...prev, completed: prev.completed + 1 }))
    }
  }, [])

  const fetchPlayerData = useCallback(() => {
    // Probably relevant in dev only
    dispatch({ type: 'RESET' })

    const ids = getIds()
    setLoadingState({ total: ids.length, completed: 0, isLoading: true })

    // Run all player fetches concurrently
    Promise.all(ids.map(addPlayer)).then(() => {
      setLoadingState((prev) => ({ ...prev, isLoading: false }))
    })
  }, [addPlayer])

  useEffect(fetchPlayerData, [fetchPlayerData])

  const events = Object.entries(state.dtos)
    .reduce<IEvent[]>(makeEvents, [])
    .sort((a, b) => (a.info.endDate < b.info.endDate ? 1 : -1))

  return (
    <main className="p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-3">♘ OTB Feed ♘</h1>

      <div
        className={`w-full max-w-md mb-4 transition-opacity duration-300 ${
          loadingState.isLoading ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {loadingState.completed === 0 ? (
          <progress className="progress progress-primary w-full"></progress>
        ) : (
          <progress
            className="progress progress-primary w-full"
            value={loadingState.completed}
            max={loadingState.total}
          ></progress>
        )}
      </div>

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
