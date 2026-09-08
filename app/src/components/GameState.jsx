/*
 * =========================
 * GameState
 * =========================
 *
 * This file contains the global state of the game.
 *
 * GameState is used to store information that needs to be accessed
 * by multiple components throughout the game, instead of passing
 * the same information through many layers of props.
 *
 * Components can:
 * - Read the current state using `useGameState()`
 * - Change the state using `dispatch()`
 *
 * The state is changed through actions handled by `gameStateReducer`.
 * Each action describes WHAT should change, while the reducer
 * determines HOW the state should be updated.
 *
 * Current state:
 *
 * `currentChapter`
 *    The chapter currently being displayed.
 *    App.jsx uses this value to decide which chapter component
 *    should be rendered.
 *
 * `theme`
 *    The current visual theme ('light' or 'dark').
 *    Components can use this to change their styling and assets.
 *
 * `currentDialogue`
 *    The dialogue currently being displayed by the dialogue system.
 *
 * `flags`
 *    Stores temporary game flags used to control events and
 *    conditional behavior within chapters.
 *    More flags can be added without changing the overall structure.
 *
 * `completed`
 *    Contains the chapters that have already been completed.
 *    This can be used to determine whether a chapter should display
 *    its normal content or its completed/review state.
 *
 *
 * -------------------------
 * Actions
 * -------------------------
 *
 * `SET_CHAPTER`
 *    Changes the current chapter.
 *
 * `SET_THEME`
 *    Changes between light and dark mode.
 *
 * `SET_DIALOGUE`
 *    Changes the currently active dialogue.
 *
 * `SET_FLAG`
 *    Adds or updates a flag inside the `flags` object.
 *
 * `MARK_COMPLETED`
 *    Adds a chapter to the list of completed chapters.
 *
 *
 * -------------------------
 * Chapter transitions
 * -------------------------
 *
 * When a chapter is completed, the game should eventually use
 * GameState to move to the next chapter and reset/update any
 * chapter-specific state that needs to be cleared.
 *
 * The exact chapter-transition logic has not been fully implemented
 * yet, but GameState is intended to provide the shared state needed
 * for this system.
 *
 *
 * -------------------------
 * Development notes
 * -------------------------
 *
 * Some values in `initialState` are currently temporary development
 * values used while building/testing the game.
 *
 * For example:
 * - `currentChapter: 1`
 * - `currentDialogue: "dialogue_2"`
 * - `completed: [1]`
 *
 * These should be changed to their proper initial values when the
 * full game flow is implemented.
 *
 * Chapter names may also eventually be preferable to plain numbers
 * for readability, as noted below.
 */

import React, { createContext, useContext, useReducer } from 'react';

const GameStateContext = createContext(null);

const initialState = {
  currentChapter: 1,

  theme: 'light',

  currentDialogue: "dialogue_2",
  region: null,

  flags: {
    event: null,
  },

  // TODO: Consider using named chapter IDs instead of plain numbers.
  // This would make the state easier to read and maintain.
  completed: [1] // empty
};


/*
 * =========================
 * Game State Reducer
 * =========================
 *
 * The reducer is the single place where GameState is modified.
 *
 * Components should not directly modify `state`.
 * Instead, they dispatch an action describing the change they want.
 */

function gameStateReducer(state, action) {
  switch (action.type) {

    // Change which chapter is currently displayed.
    case 'SET_CHAPTER':
      return {
        ...state,
        currentChapter: action.chapter,
      };


    // Switch between light and dark mode.
    case 'SET_THEME':
      return {
        ...state,
        theme: action.theme,
      };


    // Change the currently active dialogue.
    case 'SET_DIALOGUE':
      return {
        ...state,
        currentDialogue: action.dialogue,
      };

    case 'SET_REGION':
      return {
        ...state,
        region: action.region
      }


    // Add or update a game flag.
    //
    // The existing flags are preserved so that changing one flag
    // does not remove the others.
    case 'SET_FLAG':
      return {
        ...state,
        flags: {
          ...state.flags,
          [action.key]: action.value
        }
      };


    // Mark a chapter as completed.
    case 'MARK_COMPLETED':
      return {
        ...state,
        completed: [...state.completed, action.chapter]
      };


    // Ignore unknown actions rather than changing the state.
    default:
      return state;
  }
}


/*
 * =========================
 * GameStateProvider
 * =========================
 *
 * Provides GameState to all components inside the application.
 *
 * The Provider owns the actual state and reducer.
 * Components access them through `useGameState()`.
 */

export const GameStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    gameStateReducer,
    initialState
  );

  return (
    <GameStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GameStateContext.Provider>
  );
};


/*
 * =========================
 * useGameState
 * =========================
 *
 * Custom hook used by components that need access to GameState.
 *
 * Example:
 *
 * const { state, dispatch } = useGameState();
 *
 * State can then be read with:
 *     state.theme
 *     state.currentChapter
 *
 * And changed with:
 *     dispatch({ type: 'SET_THEME', theme: 'dark' });
 *
 * The error below helps catch cases where the hook is accidentally
 * used outside of GameStateProvider.
 */

export const useGameState = () => {
  const context = useContext(GameStateContext);

  if (!context) {
    throw new Error(
      'useGameState must be used within GameStateProvider'
    );
  }

  return context;
};