export interface LocationData {
  country: string
  countryCode: string
  region: string
  city: string
  timezone: string
  isp: string
  query: string
}

export interface GeolocationResponse {
  status: string
  country: string
  countryCode: string
  region: string
  regionName: string
  city: string
  zip: string
  lat: number
  lon: number
  timezone: string
  isp: string
  org: string
  as: string
  query: string
}

// Cache location data to avoid repeated API calls
let cachedLocation: LocationData | null = null
let cacheTimestamp: number | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function getUserLocation(): Promise<LocationData> {
  // Return cached data if still valid
  if (cachedLocation && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cachedLocation
  }

  try {
    // Use HTTPS endpoint for better security
    const response = await fetch("https://ipapi.co/json/", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // Handle API error responses
    if (data.error) {
      throw new Error(`API error: ${data.reason || "Unknown error"}`)
    }

    const locationData: LocationData = {
      country: data.country_name || "Unknown",
      countryCode: data.country_code || "XX",
      region: data.region || "Unknown",
      city: data.city || "Unknown",
      timezone: data.timezone || "Unknown",
      isp: data.org || "Unknown",
      query: data.ip || "Unknown",
    }

    // Cache the result
    cachedLocation = locationData
    cacheTimestamp = Date.now()

    return locationData
  } catch (error) {
    console.error("Failed to get user location:", error)

    // Fallback to ip-api.com if primary service fails
    try {
      const fallbackResponse = await fetch("http://ip-api.com/json/", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })

      if (!fallbackResponse.ok) {
        throw new Error(`Fallback API error! status: ${fallbackResponse.status}`)
      }

      const fallbackData: GeolocationResponse = await fallbackResponse.json()

      if (fallbackData.status === "fail") {
        throw new Error("Fallback API returned failure status")
      }

      const locationData: LocationData = {
        country: fallbackData.country || "Unknown",
        countryCode: fallbackData.countryCode || "XX",
        region: fallbackData.regionName || "Unknown",
        city: fallbackData.city || "Unknown",
        timezone: fallbackData.timezone || "Unknown",
        isp: fallbackData.isp || "Unknown",
        query: fallbackData.query || "Unknown",
      }

      // Cache the fallback result
      cachedLocation = locationData
      cacheTimestamp = Date.now()

      return locationData
    } catch (fallbackError) {
      console.error("Fallback geolocation also failed:", fallbackError)

      // Return default location data if all services fail
      const defaultLocation: LocationData = {
        country: "Unknown",
        countryCode: "XX",
        region: "Unknown",
        city: "Unknown",
        timezone: "Unknown",
        isp: "Unknown",
        query: "Unknown",
      }

      return defaultLocation
    }
  }
}

// Utility function to get location data with loading state
export async function getLocationWithLoading(): Promise<{
  location: LocationData
  isFromCache: boolean
}> {
  const isFromCache = cachedLocation !== null && cacheTimestamp !== null && Date.now() - cacheTimestamp < CACHE_DURATION

  const location = await getUserLocation()

  return {
    location,
    isFromCache,
  }
}

// Clear cached location data (useful for testing or privacy)
export function clearLocationCache(): void {
  cachedLocation = null
  cacheTimestamp = null
}
