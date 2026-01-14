import defaultPlayerIds from './defaultPlayerIds'

export const getRawStoredIds = () => localStorage.getItem('playerIds')

const getStoredIds = () =>
  getRawStoredIds()
    ?.split(',')
    .filter((id) => id) ?? []

export const getIds = () => {
  const storedIds = getStoredIds()

  // Initialize localStorage with defaults on first load
  if (storedIds.length === 0) {
    localStorage.setItem('playerIds', defaultPlayerIds)
    return defaultPlayerIds.split(',')
  }

  return storedIds
}

export const addId = (id: string) => {
  const storedIds = getStoredIds()

  if (!storedIds.includes(id)) {
    localStorage.setItem('playerIds', [...storedIds, id].join(','))
  }
}

export const removeId = (id: string) => {
  const storedIds = getStoredIds()

  if (storedIds.includes(id)) {
    localStorage.setItem('playerIds', storedIds.filter((storedId) => storedId !== id).join(','))
  }
}
