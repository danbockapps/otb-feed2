import defaultPlayerIds from './defaultPlayerIds'

const getStoredIds = () => localStorage.getItem('playerIds')?.split(',') ?? []

export const getIds = () => {
  const storedIds = getStoredIds()
  return storedIds.length > 0 ? storedIds : defaultPlayerIds.split(',')
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
