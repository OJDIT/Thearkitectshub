export function getSafeFileExtension(filename: string) {
  const parts = filename.split(".")
  const extension = parts.length > 1 ? parts.pop() || "jpg" : "jpg"

  return extension.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg"
}

export function sanitizeStorageBasename(filename: string) {
  const withoutExtension = filename.replace(/\.[^.]+$/, "")

  const sanitized = withoutExtension
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return sanitized || "file"
}

export function createSafeStoragePath(folder: string, filename: string, prefix?: string) {
  const extension = getSafeFileExtension(filename)
  const basename = sanitizeStorageBasename(filename)
  const uniquePart = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const namePrefix = prefix ? `${prefix}-` : ""

  return `${folder}/${namePrefix}${basename}-${uniquePart}.${extension}`
}
