const WEATHER_CONDITIONS_MAP: Record<string, string> = {
  sunny: '☀️',
  clear: '☀️',
  ensoleillé: '☀️',

  'partly cloudy': '⛅️',
  'partiellement ensoleillé': '⛅️',

  cloudy: '☁️',
  nuageux: '☁️',

  rain: '🌧️',
  'light rain': '🌦️',
  showers: '🌧️',
  pluie: '🌧️',
  averses: '🌧️',

  storm: '⛈️',
  thunderstorm: '⛈️',
  orage: '⛈️',

  snow: '❄️',
  neige: '❄️',

  fog: '🌫️',
  mist: '🌫️',
  brume: '🌫️',
  brouillard: '🌫️'
}

const WEATHER_CACHE_KEY = 'cachedWeather'
const WEATHER_EXPIRATION_MS = 3600000

const getCachedWeather = (): string | null => {
  const raw = localStorage.getItem(WEATHER_CACHE_KEY)
  if (!raw) return null

  try {
    const { full, timestamp } = JSON.parse(raw)
    if (Date.now() - timestamp > WEATHER_EXPIRATION_MS) return null
    return full
  } catch {
    return null
  }
}

const cacheWeather = (full: string): void => {
  const payload = {
    full,
    timestamp: Date.now()
  }

  localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(payload))
}

export const getWeather = async (): Promise<string> => {
  const cached = getCachedWeather()
  if (cached) return cached

  try {
    const res = await fetch('https://wttr.in/?format=%t+%C')
    const text = await res.text()
    const emoji = getWeatherEmoji(text)
    const full = `${emoji} ${text}`

    cacheWeather(full)
    return full
  } catch {
    return '🌤️ Unknown weather'
  }
}

export const getWeatherEmoji = (condition: string): string => {
  const lower = condition.toLowerCase().trim()

  for (const key in WEATHER_CONDITIONS_MAP) {
    if (lower.includes(key)) {
      return WEATHER_CONDITIONS_MAP[key]
    }
  }

  return '🌤️'
}
