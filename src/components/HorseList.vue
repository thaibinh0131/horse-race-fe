<template>
  <div class="panel">
    <h3 class="panel-title">Horse List (1 - {{ store.horses.length }})</h3>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Condition</th>
            <th>Color</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="h in store.horses" :key="h.id">
            <td>{{ h.id }}</td>
            <td>{{ h.name }}</td>
            <td>{{ h.condition }}</td>
            <td><span class="color-box" :style="{ background: h.color }"></span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '../stores/game'

const store = useGameStore()
</script>

<style scoped>
.panel {
  background: #fef9c3;
  border: 1px solid #eab308;
  border-radius: 4px;
  padding: 8px;
  font-size: 13px;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  color: #000; /* ensure readable text */
}
.panel-title {
  margin: 0 0 6px;
  font-weight: bold;
}
.table-wrap {
  overflow-y: auto;
  max-height: calc(100% - 100px);
}
table {
  width: 100%;
  border-collapse: collapse;
}
thead {
  background: #fde68a;
  position: sticky;
  top: 0;
}
th,
td {
  border: 1px solid #facc15;
  padding: 4px;
  text-align: center;
}
.color-box {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 1px solid #444;
}
</style>
