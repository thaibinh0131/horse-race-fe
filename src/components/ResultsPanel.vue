<template>
  <div class="panel results">
    <div class="title">Race Results</div>

    <div v-if="store.results.length === 0" class="small">No results yet</div>

    <div v-else class="results-list">
      <div v-for="round in store.results" :key="round.round" class="round-block">
        <div class="round-header">Round {{ round.round }} — Distance: {{ round.distance }}m</div>

        <table class="results-table" v-if="round.ranking && round.ranking.length">
          <thead>
            <tr>
              <th>Pos</th>
              <th>Horse</th>
              <th>Time (s)</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(h, idx) in round.ranking"
              :key="h.name + '-' + idx"
              :class="{ highlight: idx < 3 }"
            >
              <td>{{ idx + 1 }}</td>
              <td>
                <span class="horse-swatch" :style="{ background: h.color }"></span>
                {{ h.name }}
              </td>
              <td>{{ h.timeSec.toFixed(1) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '../stores/game'
const store = useGameStore()
</script>

<style scoped>
.panel.results {
  background: #ffffff;
  border: 1px solid #6b7280;
  border-radius: 6px;
  padding: 10px;
  font-size: 14px;
  flex: 1;
  overflow-y: auto;
  color: #111827;
}

.title {
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 15px;
}

.round-block {
  margin-bottom: 16px;
}

.round-header {
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 6px;
  color: #1f2937;
}

.results-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.results-table th,
.results-table td {
  border: 1px solid #9ca3af;
  padding: 6px 8px;
  text-align: left;
}

.results-table th {
  background: #1f2937;
  color: #ffffff;
  font-weight: 700;
}

.results-table tr:nth-child(even) {
  background: #f3f4f6;
}

.highlight td {
  font-weight: 600;
  background: #d1fae5 !important; /* light green highlight */
}

.horse-swatch {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 6px;
  border: 1px solid #000;
  vertical-align: middle;
}
</style>
