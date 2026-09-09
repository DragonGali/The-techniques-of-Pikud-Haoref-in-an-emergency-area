import { useEffect, useState } from 'react';
import { useGameState, hasCompleted } from './GameState.jsx';
import '../styles/BlueScreen.css';

/*
 * =========================
 * Blue Screen
 * =========================
 *
 * The Blue Screen is used as a transition between chapters.
 *
 * It appears when a new chapter begins and when a chapter ends. It provides
 * a short loading/transition sequence before revealing the next part of
 * the game.
 *
 * The screen first displays the loading animation, then splits apart
 * horizontally and moves off-screen. Once the closing animation finishes,
 * the onClose callback is called so the parent component can continue
 * with the chapter.
 */


const BlueScreen = ({ onClose }) => {
    const { state } = useGameState();

    const [closing, setClosing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Wait 3 seconds, then start closing
        const loadingTimer = setTimeout(() => {
            setLoading(false);
            setClosing(true);
        }, 3000);

        // Wait for the 2 second closing animation to finish
        const closeTimer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => {
            clearTimeout(loadingTimer);
            clearTimeout(closeTimer);
        };
    }, [onClose]);

    return (
        <div className={`BlueScreen ${closing ? 'closing' : ''}`}>
            {!hasCompleted(state, 'missile_sequence') && loading && (
                <div className="loading-circle">
                    <p className="body">טוען סימולציה</p>
                </div>
            )}
        </div>
    );
};

export default BlueScreen;