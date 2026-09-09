import '../styles/Title.css'

import { useState } from 'react';
import { useGameState } from './GameState.jsx';

// Title screen.
//
// This is the starting screen of the game. The player can open the credits
// and start the game, which currently switches GameState to chapter 1.
//
// The transition from the Title screen into the Tutorial should eventually
// be animated: the Title screen should move downward as the Tutorial loads.
// The chapter transition system will need to handle this rather than simply
// replacing the screen immediately.
const Title = ({start}) => {

  const { dispatch } = useGameState();
  const [creditsOpen, setCreditsOpen] = useState(false);

  return (
    <div className="Title">

      <div className={`credits-icon ${creditsOpen ? 'open' : ''}`} onClick={() => setCreditsOpen(!creditsOpen)}>
        <img
          className="credits-icon-normal clickable"
          src="/Title/Credits Icon.png"
        />

        <img
          className="credits-icon-open clickable"
          src="/Title/Credits Icon-Open.png"
        />
      </div>

      <p className="title-text H2">
        טכניקות פיקוד העורף על זירת אירוע
      </p>

      <>{/* Might wanna make an animation for this button later. */}</>
      <img className="broken-glass-button clickable" src="/Title/broken glass button.png" onClick={() => {start()}}/>
    </div>
  
  )
}

export default Title;