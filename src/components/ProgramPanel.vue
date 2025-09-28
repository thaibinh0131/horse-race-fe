<template>
  <div class="panel">
    <h3 class="panel-title">Program</h3>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Round</th>
            <th>Distance</th>
            <th>Position</th>
            <th>Horse</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="round in store.schedule" :key="round.id">
            <tr v-for="(hid, idx) in round.horses" :key="hid">
              <td>{{ round.id }}</td>
              <td>{{ round.distance }}m</td>
              <td>{{ idx + 1 }}</td>
              <td>{{ horseById(hid).name }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '../stores/game'
const store = useGameStore()

function horseById(id: number) {
  return store.horses.find((h) => h.id === id)!
}
</script>

<style scoped>
.panel {
  background: #dbeafe;
  border: 1px solid #3b82f6;
  border-radius: 4px;
  padding: 8px;
  font-size: 13px;
  flex: 1;
  display: flex;
  flex-direction: column;
  color: #000;
}
.panel-title {
  margin: 0 0 6px;
  font-weight: bold;
}
.table-wrap {
  overflow-y: auto;
  max-height: 100%;
}
table {
  width: 100%;
  border-collapse: collapse;
}
thead {
  background: #bfdbfe;
  position: sticky;
  top: 0;
}
th,
td {
  border: 1px solid #93c5fd;
  padding: 4px;
  text-align: center;
}
</style>
