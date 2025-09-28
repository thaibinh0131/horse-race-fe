// src/types.ts
export interface Horse {
  id: number
  name: string
  color: string
  condition: number // 1..100
}

export interface Round {
  id: number
  distance: number
  horses: number[] // horse ids (10 horses)
}
