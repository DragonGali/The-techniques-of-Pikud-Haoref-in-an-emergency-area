import { useGameState } from './GameState.jsx';

import '../styles/Tutorial.css';

import DialogueManager from './DialogueManager.jsx';
import SettingsWindow from './SettingsWindow.jsx';
import PopUp from './PopUp.jsx';
import RegionSelection from './RegionSeletion.jsx'

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
          className={`toggle-image clickable ${state.theme === 'light' ? 'active' : ''}`}
        />

        <img
          src="/General/Toggle-dark.png"
          className={`toggle-image clickable ${state.theme === 'dark' ? 'active' : ''}`}
        />
      </button>

      <div className={`tutorial-card ${state.theme === 'light' ? 'noise' : ''}`}>

        {!state.completed.includes(state.currentChapter) && (
          <>
            <DialogueManager
              className={`tutorial-dialogue H3 ${
                state.flags.event
                  ? 'event_' + state.flags.event.split('_')[1]
                  : ''
              }`}
            />

            {state.flags.event === 'tutorial_1' && (
              <img
                className="chapter-icons"
                src="/Tutorial/Chapter Icons.png"
                alt="Chapter Icons"
              />
            )}

            {/* Animation for opening the map in the settings */}
            {state.flags.event === 'tutorial_2' && (
              <div className="settings-showcase">
                <img
                  className="settings-icon"
                  src={`/General/Settings Icon-${state.theme}.png`}
                  alt="Settings Icon"
                />
                <img
                  className="pointer"
                  src="/Tutorial/BigCursor.png"
                  alt="Pointer"
                />
                <SettingsWindow className="settings-window" />
              </div>
            )}

            {state.flags.event === 'tutorial_3' && (
              <div className="popup-showcase">
                <img
                  className="pointer-2"
                  src="/Tutorial/BigCursor.png"
                  alt="Pointer"
                />
                <PopUp
                  content={
                    <div className="body-bold">
                      "אני חלונית נפתחת"
                    </div>
                  }
                />
              </div>
            )}

            {state.flags.event === 'tutorial_4' && (
              <PopUp attention={true} />
            )}
          </>
        )}

        {state.completed.includes(state.currentChapter) && (
          <div>
            <RegionSelection/>
          </div>
        )}

      </div>

    </div>
  );
};

export default Tutorial;
