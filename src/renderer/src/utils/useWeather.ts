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

export const getWeather = async (): Promise<string> => {
  try {
    const res = await fetch('https://wttr.in/?format=%t+%C')
    const text = await res.text()
    return text
  } catch {
    return 'Unknown weather'
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
