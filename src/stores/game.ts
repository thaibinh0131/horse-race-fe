import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Horse, Round } from '../types'

const DISTANCES = [1200, 1400, 1600, 1800, 2000, 2200]
interface HorseResult {
  name: string
  color: string
  timeSec: number
}
interface RoundResult {
  round: number
  distance: number
  ranking: HorseResult[]
}

function rndInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function sampleN<T>(arr: T[], n: number) {
  const copy = arr.slice()
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, n)
}

export const useGameStore = defineStore('game', () => {
  const horses = ref<Horse[]>([])
  const schedule = ref<Round[]>([])
  const results = ref<RoundResult[]>([])
  const running = ref(false)
  const currentRoundIndex = ref<number | null>(null)
  const intermission = ref(0)

  // store per-round simulation results
  const roundTimes = ref<
    Record<
      number,
      { id: number; name: string; color: string; condition: number; timeSec: number }[]
    >
  >({})

  function generateHorses(total = 20) {
    horses.value = Array.from({ length: total }).map((_, i) => ({
      id: i + 1,
      name: `Horse ${String(i + 1).padStart(2, '0')}`,
      color: `hsl(${(i * 137.5) % 360} 80% 55%)`,
      condition: rndInt(20, 100),
    }))
  }

  function generateSchedule() {
    schedule.value = DISTANCES.map((d, idx) => ({
      id: idx + 1,
      distance: d,
      horses: sampleN(
        horses.value.map((h) => h.id),
        10,
      ),
    }))
    results.value = []
    roundTimes.value = {}
  }

  function simulateRound(roundIdx: number) {
    const r = schedule.value[roundIdx]
    if (!r) return []

    // calculate raw times
    const raw = r.horses.map((id) => {
      const h = horses.value.find((x) => x.id === id)!
      const baseSpeed = 8 + (h.condition / 100) * 6
      const randomFactor = 0.85 + Math.random() * 0.3
      const speed = baseSpeed * randomFactor
      const timeSec = r.distance / speed
      return { id, name: h.name, color: h.color, condition: h.condition, rawTime: timeSec }
    })

    // scale so the slowest horse = 60s
    const maxRaw = Math.max(...raw.map((r) => r.rawTime))
    const scaled = raw.map((r) => ({
      ...r,
      timeSec: (r.rawTime / maxRaw) * 60, // race duration 60s
    }))

    // rank by raw time (not scaled)
    scaled.sort((a, b) => a.rawTime - b.rawTime)
    roundTimes.value[roundIdx] = scaled
    return scaled
  }

  async function startRaces() {
    if (running.value) return
    if (schedule.value.length === 0) return

    running.value = true
    results.value = []

    for (let i = 0; i < schedule.value.length; i++) {
      currentRoundIndex.value = i
      const ranking = simulateRound(i)
      if (ranking.length === 0) continue

      // wait 60s for race
      await waitSeconds(60)

      results.value.push({
        round: i + 1,
        distance: schedule.value[i].distance,
        ranking: ranking.map((r) => ({
          name: r.name,
          color: r.color,
          timeSec: r.timeSec,
        })),
      })

      // intermission 20s
      if (i < schedule.value.length - 1) {
        intermission.value = 20
        while (intermission.value > 0) {
          await waitSeconds(1)
          intermission.value--
        }
      }
    }

    running.value = false
    currentRoundIndex.value = null
  }

  function waitSeconds(s: number) {
    return new Promise<void>((res) => setTimeout(res, Math.round(s * 1000)))
  }

  function reset() {
    schedule.value = []
    results.value = []
    running.value = false
    currentRoundIndex.value = null
    roundTimes.value = {}
    generateHorses(20)
  }

  return {
    horses,
    schedule,
    results,
    running,
    currentRoundIndex,
    roundTimes,
    intermission,
    generateHorses,
    generateSchedule,
    simulateRound,
    startRaces,
    reset,
  }
})
