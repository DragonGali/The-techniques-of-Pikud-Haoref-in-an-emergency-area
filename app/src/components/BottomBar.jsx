import {useGameState} from './GameState.jsx'
import SettingsWindow from './SettingsWindow.jsx'

import '../styles/BottomBar.css'

/*
 * =========================
 * Bottom Bar
 * =========================
 *
 * The Bottom Bar is the main navigation and utility area of the Game Screen.
 *
 * It is currently very simple and does not have any functionality yet.
 * More buttons, controls, and game-related options will be added here
 * as development continues.
 *
 * The settings icon and theme toggle are currently displayed here, but
 * their functionality will be implemented later.
 * 
 * You can reuse the ones I made in the "Tutorial".
 */

const BottomBar = () => {

    const { state, dispatch } = useGameState();

    const toggleTheme = () => {
        dispatch({
        type: 'SET_THEME',
        theme: state.theme === 'light' ? 'dark' : 'light'
        });
    };

    return(
        <div className={`BottomBar ${state.theme}`}>
            <img className='settings-icon' src={`/General/Settings Icon-${state.theme}.png`}/>
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

