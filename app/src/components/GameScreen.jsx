import Screen from './Screen.jsx'
import BlueScreen from './BlueScreen.jsx'
import BottomBar from './BottomBar.jsx';
import { useGameState} from './GameState.jsx';
import { useState } from 'react';

import "../styles/GameScreen.css"

/*
 * =========================
 * Game Screen
 * =========================
 *
 * The Game Screen is the main part of the game. This is where the actual
 * gameplay takes place and where the different game UI elements are brought
 * together.
 *
 * It contains the main game Screen, the Bottom Bar, and temporary overlays
 * such as the Blue Screen.
 *
 * The Title Screen and Tutorial are handled separately and are not part of
 * the main gameplay screen.
 *
 * As the game grows, this component will also be responsible for managing
 * which screens, interfaces, and gameplay elements are currently active.
 */

const GameScreen = () => {

    const [blueScreen, setBlueScreen] = useState(true)
    const { state } = useGameState();

    return(
        <div className={`GameScreen ${state.theme}`}>

            {/* 
             * Temporary Blue Screen overlay.
             * This will eventually be replaced by a more general system
             * for managing different game screens and overlays.
             */}
            {blueScreen && (
                <BlueScreen onClose={() => {setBlueScreen(false)}} />
            )}

            <Screen/>
            <BottomBar/>

        </div>
    );

}

export default GameScreen;