export const formatTime = (time: number): string => {
  if (time < 0) return '0:00'
  const hours = Math.floor(time / 3600)
  const minutes = Math.floor((time % 3600) / 60)
  const seconds = Math.floor(time % 60)
  return hours > 0
    ? `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    : `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}
