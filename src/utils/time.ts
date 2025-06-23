// utils/time.ts
export const addHours = (hhmm: string, hours = 3): string => {
    const [h, m] = hhmm.split(":").map(Number)
    const d      = new Date()          // gün/ay önemli değil
    d.setHours(h)
    d.setMinutes(m)
    d.setSeconds(0)
  
    d.setHours(d.getHours() + hours)   // +3 saat kaydır
    return d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
  }