import { useEffect, useState } from 'react'
import './App.css'

import { GameStateProvider, useGameState } from './components/GameState.jsx'

import Title from './components/Title.jsx'
import Tutorial from './components/Tutorial.jsx'
import GameScreen from './components/GameScreen.jsx'

/*Note: READ INDEX.CSS!!! it's very important
 that you use the sma e structure as me! */


// Game is responsible for deciding which chapter is currently displayed.
//
// Each chapter is represented by a number in GameState.
// When a chapter is completed, the chapter system should update
// GameState so that the next chapter is displayed automatically.
// This will also be the place where chapter transitions can handle
// things such as resetting flags or other chapter-specific state.
const Game = () => {

  const { state, dispatch } = useGameState();
  const [page, setPage] = useState(0);// 0

  const loadNextPage = () => {
      dispatch({type: 'RESET_COMPLETED'});
      setPage(page + 1);
  }

  //I want to change this into a "page-system". Chapter system is still relevant.
  const pages = {
    0: <Title start={loadNextPage}/>,
    1: <Tutorial finishTutorial={loadNextPage}/>,
    2: <GameScreen></GameScreen>
  };

  return pages[page];
}


const App = () => {

  return (
    <GameStateProvider>
      <div className="App">
        <Game />
      </div>
    </GameStateProvider>
  );
}


export default App;