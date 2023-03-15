import { createSlice } from "@reduxjs/toolkit";

type GameData = {
  dragon: number;
  science: number;
};

const initialState: GameData = {
  dragon: 0,
  science: 0,
};

export const gameSlice = createSlice({
  name: "gameSlice",
  initialState,
  reducers: {
    incDragon: (state) => {
      state.dragon++;
    },
    incScience: (state) => {
      state.science++;
    },
    // save to local storage
    save: (state) => {
      localStorage.setItem("game", JSON.stringify(state));
    },
    // load from local storage
    load: (state) => {
      const game = localStorage.getItem("game");
      if (game) {
        return JSON.parse(game) as GameData;
      }
      return state;
    },
    doTick: () => {
      // do something
    },
  },
});

export const { incDragon, incScience, save, load, doTick } = gameSlice.actions;

export default gameSlice.reducer;
