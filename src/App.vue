<template>
  <div class="game">
    <!-- Header with action buttons -->
    <header class="app-header">
      <h2>Horse Racing</h2>
      <div class="controls">
        <button class="btn" @click="store.generateSchedule">Generate Program</button>
        <button
          class="btn"
          :disabled="!store.schedule.length || store.running"
          @click="store.startRaces"
        >
          Start
        </button>
        <button class="btn" @click="store.reset">Reset</button>
      </div>
    </header>

    <!-- Main layout -->
    <div class="main-grid">
      <!-- Horse list -->
      <HorseList />

      <!-- Race track -->
      <RaceTrack />

      <!-- Side panel with Program + Results -->
      <div class="side-panel">
        <ProgramPanel />
        <ResultsPanel />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useGameStore } from './stores/game'

import HorseList from './components/HorseList.vue'
import RaceTrack from './components/RaceTrack.vue'
import ProgramPanel from './components/ProgramPanel.vue'
import ResultsPanel from './components/ResultsPanel.vue'

const store = useGameStore()

// initialize horses when app loads
onMounted(() => {
  store.generateHorses(20)
})
</script>

<style scoped>
.game {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* header */
.app-header {
  background: #1f2937;
  color: #fff;
  padding: 10px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.controls {
  display: flex;
  gap: 10px;
}
.btn {
  background: #2563eb;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* grid layout */
.main-grid {
  display: grid;
  grid-template-columns: 300px 1fr 320px;
  gap: 12px;
  flex: 1;
  padding: 12px;
  background: #f9fafb;
}
.side-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: calc(100vh - 113px);
}
.side-panel > div {
  height: 50%;
}
</style>
