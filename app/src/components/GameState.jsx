import React, { createContext, useContext, useReducer } from 'react';

const GameStateContext = createContext(null);

const initialState = {
  currentChapter: 1, //0
  theme: 'light',
  currentDialogue: "dialogue_2",
  flags: {
    event: null,
  } 
};

function gameStateReducer(state, action) {
  switch (action.type) {

    case 'SET_CHAPTER':
      return {
        ...state,
        currentChapter: action.chapter,
      };

    case 'SET_THEME':
      return {
          ...state,
          theme: action.theme,
      };

    case 'SET_DIALOGUE':
      return {
        ...state,
        currentDialogue: action.dialogue,
      };

    case 'SET_FLAG':
            return {
                ...state,
                flags: {
                    ...state.flags,
                    [action.key]: action.value
                }
            };

    default:
      return state;
  }
}

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

export const useGameState = () => {
  const context = useContext(GameStateContext);

  if (!context) {
    throw new Error(
      'useGameState must be used within GameStateProvider'
    );
  }

  return context;
};