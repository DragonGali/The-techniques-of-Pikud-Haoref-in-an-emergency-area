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

import Screen from './Screen.jsx'
import BlueScreen from './BlueScreen.jsx'
import BottomBar from './BottomBar.jsx';
import { useGameState, hasCompleted } from './GameState.jsx';
import { useState, useEffect } from 'react';

import "../styles/GameScreen.css"

const GameScreen = () => {

    const [blueScreen, setBlueScreen] = useState(true)
    const [blueScreenDirection, setBlueScreenDirection] = useState('open')
    const [blueScreenType, setBlueScreenType] = useState();
    const { state } = useGameState();

    useEffect(() => {
        if (hasCompleted(state, 'missile_sequence')) {
            setBlueScreenDirection('close');
            setBlueScreenType('title');
            setBlueScreen(true);
        }
    }, [state]);

    return(
        <div className={`GameScreen ${state.theme}`}>

            {blueScreen && (
                <BlueScreen
                    direction={blueScreenDirection}
                    type={blueScreenType}
                    onClose={() => setBlueScreen(false)}
                />
            )}

            <Screen/>
            <BottomBar/>

        </div>
    );

}

export default GameScreen;