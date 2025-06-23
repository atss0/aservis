/** Dünya yarıçapı (WGS-84 ortalama, metre) */
const EARTH_RADIUS = 6_371_008.8

/** Derece → radyan  (gereksiz tekrarı azaltır) */
const toRad = (deg: number) => deg * Math.PI / 180

/** İki nokta arası mesafe (metre) */
export const distMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const φ1 = toRad(lat1), φ2 = toRad(lat2)
  const dφ = toRad(lat2 - lat1)
  const dλ = toRad(lon2 - lon1)

  const a = Math.sin(dφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(dλ/2)**2
  return 2 * EARTH_RADIUS * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/** Kilometre cinsinden */
export const distKilometers = (...args: Parameters<typeof distMeters>) =>
  distMeters(...args) / 1_000