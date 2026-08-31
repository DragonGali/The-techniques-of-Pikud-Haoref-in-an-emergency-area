import { useGameState } from './GameState.jsx';
import '../styles/Tutorial.css';

import DialogueManager from './DialogueManager.jsx';

const Tutorial = () => {

  const { state, dispatch } = useGameState();

  const toggleTheme = () => {
    dispatch({
      type: 'SET_THEME',
      theme: state.theme === 'light' ? 'dark' : 'light'
    });
  };

  return (
    <div className={`Tutorial ${state.theme}`}>

      <button
        className="toggle-button"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        <img
          src="/General/Toggle-light.png"
          className={`toggle-image ${state.theme === 'light' ? 'active' : ''}`}
        />

        <img
          src="/General/Toggle-dark.png"
          className={`toggle-image ${state.theme === 'dark' ? 'active' : ''}`}
        />
      </button>

      <div className={`tutorial-card ${state.theme === 'light' ? 'noise' : ''}`}>


        <DialogueManager className="tutorial-dialogue H3" />
      </div>

    </div>
  );
};

export default Tutorial;