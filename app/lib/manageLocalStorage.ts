import defaultPlayerIds from './defaultPlayerIds'

export const getRawStoredIds = () => localStorage.getItem('playerIds')

const getStoredIds = () =>
  getRawStoredIds()
    ?.split(',')
    .filter((id) => id) ?? []

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
