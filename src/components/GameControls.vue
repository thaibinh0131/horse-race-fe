<template>
  <div class="card controls">
    <div class="btn-group">
      <button class="btn" @click="onGenerate">Generate</button>
      <button class="btn" :disabled="!hasSchedule || running" @click="onStart">Start</button>
      <button class="btn" @click="onReset">Reset</button>
    </div>
    <div class="info">Rounds: 6 — Each round selects 10 random horses</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/game'

const store = useGameStore()

function onGenerate() {
  store.generateSchedule()
}
async function onStart() {
  if (store.schedule.length === 0) return
  await store.startRaces()
}
function onReset() {
  store.reset()
}

const hasSchedule = computed(() => store.schedule.length > 0)
const running = computed(() => store.running)
</script>

<style scoped>
.btn-group {
  display: flex;
  gap: 8px;
  align-items: center;
}
.info {
  margin-left: 12px;
  font-size: 13px;
  color: var(--muted);
}
</style>
