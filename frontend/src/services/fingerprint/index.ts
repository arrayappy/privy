import FingerprintJS from '@fingerprintjs/fingerprintjs'

// Initialize an agent at application startup.
const fpPromise = FingerprintJS.load()

export async function getFingerprintId() {
  // Get the visitor identifier when you need it.
  const fp = await fpPromise
  const result = await fp.get()
  return result.visitorId  // Return the visitorId
}