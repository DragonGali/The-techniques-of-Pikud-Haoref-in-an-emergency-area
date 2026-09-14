import {useGameState} from './GameState.jsx'

import '../styles/BottomBar.css'

const BottomBar = ({ settingsOpen, onToggleSettings }) => {

    const { state, dispatch } = useGameState();

    const toggleTheme = () => {
        dispatch({
        type: 'SET_THEME',
        theme: state.theme === 'light' ? 'dark' : 'light'
        });
    };

    return(
        <div className={`BottomBar ${state.theme}`}>
            <button
                className="settings-button"
                onClick={onToggleSettings}
                aria-label="Toggle settings"
            >
                <img
                    className={`settings-icon clickable ${settingsOpen ? 'open' : ''}`}
                    src={`/General/Settings Icon-${state.theme}.png`}
                />
            </button>

            <button
                className="toggle-button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
            >
                <img
                src="/General/Toggle-light.png"
                className={`toggle-image clickable ${state.theme === 'dark' ? 'active' : ''}`}
                />

                <img
                src="/General/Toggle-dark.png"
                className={`toggle-image clickable ${state.theme === 'light' ? 'active' : ''}`}
                />
            </button>
        </div>
    );

}

export default BottomBar;