import { useGameState } from './GameState.jsx';
import '../styles/Tutorial.css';

import DialogueManager from './DialogueManager.jsx';
import SettingsWindow from './SettingsWindow.jsx';

const Tutorial = () => {

  const { state, dispatch } = useGameState();

  const toggleTheme = () => {
    dispatch({
      type: 'SET_THEME',
      theme: state.theme === 'light' ? 'dark' : 'light'
    });
  };

//   const handleEvent = (state.flags.event) => {

//   };

  return (
    <div className={`Tutorial ${state.theme}`}>

      <button
        className="toggle-button"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        <img
          src="/General/Toggle-light.png"
          className={`toggle-image clickable ${state.theme === 'light' ? 'active' : ''}`}
        />

        <img
          src="/General/Toggle-dark.png"
          className={`toggle-image clickable ${state.theme === 'dark' ? 'active' : ''}`}
        />
      </button>

      <div className={`tutorial-card ${state.theme === 'light' ? 'noise' : ''}`}>

        <DialogueManager className={`tutorial-dialogue H3 ${state.flags.event ? 'event_' + state.flags.event.split('_')[1] : ''}`} />
        {state.flags.event === 'tutorial_1' && <img className="chapter-icons" src='/Tutorial/Chapter Icons.png' alt="Chapter Icons" />}
        {/*Animation for opening the map in the settings*/}
        {state.flags.event === 'tutorial_2' && (
          <div className='settings-showcase'>
            <img className="settings-icon" src='/General/Settings Icon.png' alt="Settings Icon" />
            <img className="pointer" src='/Tutorial/BigCursor.png' alt="Pointer" />
            <SettingsWindow className="settings-window" />
          </div>
        )}

      </div>

    </div>
  );
};

export default Tutorial;