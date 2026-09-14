import Screen from './Screen.jsx'
import BlueScreen from './BlueScreen.jsx'
import BottomBar from './BottomBar.jsx';
import SettingsWindow from './SettingsWindow.jsx';
import { useGameState, hasCompleted } from './GameState.jsx';
import { useState, useEffect, useRef } from 'react';

import "../styles/GameScreen.css"

const GameScreen = () => {

    const [blueScreen, setBlueScreen] = useState(true)
    const [blueScreenDirection, setBlueScreenDirection] = useState('open')
    const [blueScreenType, setBlueScreenType] = useState(null);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const { state } = useGameState();

    const missileSequenceHandled = useRef(false);

    useEffect(() => {
        if (hasCompleted(state, 'missile_sequence') && !missileSequenceHandled.current) {
            missileSequenceHandled.current = true;
            setBlueScreenType(prev => (prev === 'title' ? 'conclusion' : 'title'));
            setBlueScreenDirection('close');
            setBlueScreen(true);
        }
    }, [state]);

    const handleSelectOption = (option) => {
        if (option === 'home') {
            // TODO: navigate home
        } else if (option === 'chapter') {
            // TODO: open chapter selection
        } else if (option === 'exit') {
            // TODO: exit game
        }
        setSettingsOpen(false);
    };

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

            <BottomBar
                settingsOpen={settingsOpen}
                onToggleSettings={() => setSettingsOpen(prev => !prev)}
            />

            /* Havent finished this yet, i'd like it to animate by rising from below the BottomBar, that would look really cool*/
            {settingsOpen && <SettingsWindow selectOption={handleSelectOption} />}

        </div>
    );

}

export default GameScreen;