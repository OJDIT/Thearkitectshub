function stripWrappingQuotes(value: string) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1)
  }

  return value
}

export function getRequiredEnvValue(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`)
  }

  return stripWrappingQuotes(value.trim())
}

export function getRequiredEnv(name: string) {
  return getRequiredEnvValue(process.env[name], name)
}
