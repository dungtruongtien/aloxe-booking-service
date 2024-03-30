interface StartPosition {
  lat: number
  long: number
}

interface EndPosition {
  lat: number
  long: number
}

export const getDistanceFromLatLonInKm = (start: StartPosition, end: EndPosition): number => {
  const { lat: lat1, long: lon1 } = start
  const { lat: lat2, long: lon2 } = end
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1) // deg2rad below
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in km
  return d
}

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180)
}
