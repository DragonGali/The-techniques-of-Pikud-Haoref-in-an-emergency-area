import { useEffect, useState } from 'react'
import './App.css'

import { GameStateProvider, useGameState } from './components/GameState.jsx'

import Title from './components/Title.jsx'
import Tutorial from './components/Tutorial.jsx'
import GameScreen from './components/GameScreen.jsx'
import ChapterMap from './components/ChapterMap.jsx'

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
  const [page, setPage] = useState(3);// 0

  const loadNextPage = () => {
      dispatch({type: 'RESET_COMPLETED'});
      setPage(page + 1);
  }


  //I want to change this into a "page-system". Chapter system is still relevant.
  //Need to change the logic here so it's based on hasCompleted
  const pages = {
    0: <Title start={() => {state.currentChapter !== "1" ? loadNextPage(): setPage(2)}}/>,
    1: <Tutorial finishTutorial={loadNextPage}/>,
    2: <GameScreen returnToTitle={() => {setPage(0)}} goToMap={() => {setPage(3)}}></GameScreen>,
    3: <ChapterMap chooseChapter={() => {}}/>
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