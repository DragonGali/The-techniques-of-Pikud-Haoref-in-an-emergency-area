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


import { useEffect, useState } from 'react';
import { useGameState, hasCompleted } from './GameState.jsx';
import '../styles/BlueScreen.css';

import ChapterTitle from './ChapterTitle.jsx';

const BlueScreen = ({ onClose, direction = 'open', type }) => {
    const { state } = useGameState();

    // split=true  -> halves off-screen (game revealed)
    // split=false -> halves covering the screen (blue)
    const [split, setSplit] = useState(direction === 'close');
    const [loading, setLoading] = useState(direction === 'open');

    useEffect(() => {
        if (direction === 'close') {
            // Mounts already "split" (revealed) instantly, then on the next
            // frame we un-split — same transition, reversed.
            const frame = requestAnimationFrame(() => setSplit(false));

            // Closing transition takes 2s; show loading once it's covered
            const loadingTimer = setTimeout(() => setLoading(true), 2000);

            // Total hold before handing back to the parent
            const closeTimer = setTimeout(() => onClose(), 5000);

            return () => {
                cancelAnimationFrame(frame);
                clearTimeout(loadingTimer);
                clearTimeout(closeTimer);
            };
        }

        // Existing 'open' behaviour, unchanged
        const loadingTimer = setTimeout(() => {
            setLoading(false);
            setSplit(true);
        }, 3000);

        const closeTimer = setTimeout(() => onClose(), 5000);

        return () => {
            clearTimeout(loadingTimer);
            clearTimeout(closeTimer);
        };
    }, [onClose, direction]);

    return (
        <div className={`BlueScreen ${split ? 'closing' : ''}`}>
            {!hasCompleted(state, 'missile_sequence') && loading && (
                <div className="loading-circle">
                    <p className="body">טוען סימולציה</p>
                </div>
            )}
            {type=="title" && <ChapterTitle/>}
        </div>
    );
};

export default BlueScreen;