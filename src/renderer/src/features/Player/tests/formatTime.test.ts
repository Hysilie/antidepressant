import { formatTime } from '../formatTime'

describe('\n🧪 ✨ FormatTime functionality with various time possibility:', () => {
  test('The formatted time to be returned, even if the value is 0', () => {
    expect(formatTime(4.923821)).toBeDefined()
    expect(formatTime(0)).toBeDefined()
  })

  test('The formatted time to be 0:00', () => {
    expect(formatTime(0)).toEqual('0:00')
  })

  test('The formatted time for a whole number of seconds', () => {
    expect(formatTime(75)).toEqual('1:15')
    expect(formatTime(3600)).toEqual('1:00:00')
  })

  test('The formatted time for fractional seconds', () => {
    expect(formatTime(90.5)).toEqual('1:30')
    expect(formatTime(45.9)).toEqual('0:45')
  })

  test('The formatted time for large values', () => {
    expect(formatTime(3661)).toEqual('1:01:01')
    expect(formatTime(7322)).toEqual('2:02:02')
  })

  test('The formatted time for edge cases', () => {
    expect(formatTime(-1)).toEqual('0:00')
    expect(formatTime(Number.MAX_SAFE_INTEGER)).toBeDefined()
  })

  test('The formatted time for hours values', () => {
    expect(formatTime(36000)).toEqual('10:00:00')
    expect(formatTime(86400)).toEqual('24:00:00')
    expect(formatTime(90061)).toEqual('25:01:01')
  })
})
