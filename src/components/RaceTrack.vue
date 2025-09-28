<template>
  <div class="panel track">
    <div class="header-row">
      <div class="title">Race Track</div>
      <div class="small">
        Round: {{ currentRoundDisplay }}
        <span v-if="store.running && roundTimer > 0">
          | Time left: {{ roundTimer.toFixed(0) }}s
        </span>
        <span v-else-if="store.intermission > 0" class="intermission">
          | Next round starts in {{ store.intermission }}s
        </span>
      </div>
    </div>

    <div v-if="!hasSchedule" class="small">Click Generate Program to start</div>

    <div v-else class="lanes">
      <HorseCard
        v-for="(hid, idx) in activeHorseIds"
        :key="hid"
        :horse="horseById(hid)"
        :index="idx"
        :progressPct="progressMap[hid]?.pct ?? 0"
        :elapsed="progressMap[hid]?.elapsed ?? 0"
      />

      <!-- finish line -->
      <div class="finish-line"></div>
      <div class="finish-label">FINISH</div>
    </div>

    <!-- round distance -->
    <div v-if="currentDistance" class="distance-label">Distance: {{ currentDistance }}m</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue'
import { useGameStore } from '../stores/game'
import HorseCard from './HorseCard.vue'

const store = useGameStore()

const activeHorseIds = computed(() =>
  store.currentRoundIndex === null ? [] : store.schedule[store.currentRoundIndex].horses,
)

const currentRoundDisplay = computed(() =>
  store.currentRoundIndex === null ? '-' : store.currentRoundIndex + 1,
)

const currentDistance = computed(() =>
  store.currentRoundIndex === null ? null : store.schedule[store.currentRoundIndex].distance,
)

const progressMap = ref<Record<number, { pct: number; elapsed: number }>>({})
const roundTimer = ref(0)
let tickInterval: number | null = null

watch(
  () => store.currentRoundIndex,
  (idx) => {
    progressMap.value = {}
    clearTick()

    if (idx === null) return
    const race = store.roundTimes[idx]
    if (!race) return

    // init horses at 0
    race.forEach((x) => {
      progressMap.value[x.id] = { pct: 0, elapsed: 0 }
    })

    // 60s race
    roundTimer.value = 60
    let elapsedSec = 0
    tickInterval = window.setInterval(() => {
      elapsedSec++
      roundTimer.value = Math.max(0, 60 - elapsedSec)

      race.forEach((x) => {
        const horseProgress = Math.min(1, elapsedSec / x.timeSec)
        progressMap.value[x.id] = {
          pct: horseProgress * 100,
          elapsed: elapsedSec,
        }
      })

      if (elapsedSec >= 60) {
        clearTick()
      }
    }, 1000)
  },
  { immediate: true },
)

// reset horses during 20s intermission
watch(
  () => store.intermission,
  (val) => {
    if (val > 0 && store.currentRoundIndex !== null) {
      const race = store.roundTimes[store.currentRoundIndex]
      if (race) {
        race.forEach((x) => {
          progressMap.value[x.id] = { pct: 0, elapsed: 0 }
        })
      }
    }
  },
)

function clearTick() {
  if (tickInterval !== null) {
    clearInterval(tickInterval)
    tickInterval = null
  }
}

onUnmounted(() => {
  clearTick()
})

function horseById(id: number) {
  return store.horses.find((h) => h.id === id)!
}

const hasSchedule = computed(() => store.schedule.length > 0)
</script>

<style scoped>
.panel.track {
  background: #f3f4f6;
  border: 1px solid #9ca3af;
  border-radius: 4px;
  padding: 8px;
  font-size: 13px;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.title {
  font-weight: bold;
}

.lanes {
  position: relative;
  flex: 1;
  border-bottom: 1px solid transparent;
}

.finish-line {
  position: absolute;
  right: 40px; /* space for label */
  top: 0;
  bottom: 0;
  width: 2px;
  background: #000;
}

.finish-label {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%) rotate(-90deg);
  font-size: 12px;
  font-weight: bold;
  color: #111;
}

.distance-label {
  margin-top: 6px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}

.intermission {
  color: #b91c1c;
  font-weight: bold;
}
</style>
