const APP_STORAGE_PREFIXES = ["sb-", "thearkitectshub-"]

/**
 * Removes browser data owned by this app after a user signs out. A website
 * cannot clear Chrome's general HTTP cache or data belonging to other sites.
 */
export async function clearAppBrowserData() {
  try {
    for (let index = localStorage.length - 1; index >= 0; index -= 1) {
      const key = localStorage.key(index)
      if (key && APP_STORAGE_PREFIXES.some((prefix) => key.startsWith(prefix))) {
        localStorage.removeItem(key)
      }
    }

    sessionStorage.clear()

    if ("caches" in window) {
      const cacheNames = await caches.keys()
      await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
    }
  } catch (error) {
    // Storage can be unavailable in private browsing or when the browser blocks it.
    console.warn("Unable to clear all app browser data", error)
  }
}
