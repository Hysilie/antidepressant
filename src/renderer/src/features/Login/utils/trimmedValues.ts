export const trimmedValues = <T extends Record<string, string>>(values: T): T =>
  Object.fromEntries(
    Object.entries(values).map(([key, value]) =>
      typeof value === 'string' ? [key, value.trim()] : [key, value]
    )
  ) as T
