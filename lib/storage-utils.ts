export function getStoragePathFromPublicUrl(url: string, bucket: string) {
  try {
    const parsedUrl = new URL(url)
    const marker = `/storage/v1/object/public/${bucket}/`
    const pathIndex = parsedUrl.pathname.indexOf(marker)

    if (pathIndex === -1) {
      return null
    }

    return decodeURIComponent(parsedUrl.pathname.slice(pathIndex + marker.length))
  } catch {
    return null
  }
}
