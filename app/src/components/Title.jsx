import '../styles/Title.css'

import { useState } from 'react';
import { useGameState } from './GameState.jsx';

const Title = ({finish}) => {

  const { dispatch } = useGameState();
  const [creditsOpen, setCreditsOpen] = useState(false);

  return (
    <div className="Title">

      <div className={`credits-icon ${creditsOpen ? 'open' : ''}`} onClick={() => setCreditsOpen(!creditsOpen)}>
        <img
          className="credits-icon-normal"
          src="/Title/Credits Icon.png"
        />

        <img
          className="credits-icon-open"
          src="/Title/Credits Icon-Open.png"
        />
      </div>

      <p className="title-text H2">
        טכניקות פיקוד העורף על זירת אירוע
      </p>

      <>{/*Might wanna make an animation for this button later.*/}</>
      <img id="broken-glass-button" src="/Title/broken glass button.png" onClick={() => {dispatch({ type: 'SET_CHAPTER', chapter: 1 })}}/>
    </div>
  
  )
}

export default Title;