import './App.css'

import { GameStateProvider, useGameState } from './components/GameState.jsx'

import Title from './components/Title.jsx'
import Tutorial from './components/Tutorial.jsx'


const Game = () => {

  const { state } = useGameState();

  const chapters = {
    0: <Title/>,
    1: <Tutorial/>,
  };

  return chapters[state.currentChapter];
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