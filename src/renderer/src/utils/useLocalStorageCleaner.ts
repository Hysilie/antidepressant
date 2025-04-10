const RECENT_UPDATE_MILLISECONDS = 300000

const localStorageCleaner = (): void => {
  const latestUpdate = Object.entries(localStorage).reduce((maxUpdate, [key, value]) => {
    if (key.startsWith('firestore_clients_firestore')) {
      try {
        const parsed = JSON.parse(value)
        if (parsed.updateTimeMs && parsed.updateTimeMs > maxUpdate) {
          return parsed.updateTimeMs
        }
      } catch {
        console.warn('Error parsing Firestore client data:', key)
      }
    }
    return maxUpdate
  }, 0)

  const now = Date.now()
  const isRecentUpdate = latestUpdate && now - latestUpdate < RECENT_UPDATE_MILLISECONDS

  if (!isRecentUpdate) return

  Object.keys(localStorage)
    .filter((key) => key.startsWith('draft-') || key.startsWith('image-'))
    .forEach((key) => localStorage.removeItem(key))
}

export default localStorageCleaner
