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

    return(
        <div className="BottomBar">
            <img className='settings-icon' src={`/General/Settings Icon-${state.theme}.png`}/>
            <img className='toggle' src={`/General/Toggle-${state.theme}.png`}/>
        </div>
    );

}

export default BottomBar;

