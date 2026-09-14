/*
 * =========================
 * Blue Screen
 * =========================
 *
 * The Blue Screen is used as a transition between chapters. It appears
 * when entering a new chapter (showing the chapter title) and when
 * finishing a chapter (showing a summary/conclusion). It covers the game
 * screen, displays the relevant content, holds for a bit, then reveals
 * the game again on its own.
 *
 * -------------------------
 * Two directions, two very different behaviors
 * -------------------------
 * This component has one job (show/hide a blue overlay) but two distinct
 * modes, controlled by the `direction` prop:
 *
 *   direction="open"  -> Used only on the very first mount of BlueScreen
 *                         for the entire game session. Reveals the game
 *                         world for the first time. This is also the ONLY
 *                         time the loading spinner appears (see below) —
 *                         it's a one-time "simulation loading" screen, not
 *                         a generic loader reused elsewhere.
 *
 *   direction="close"  -> Used every other time BlueScreen appears: for
 *                         every chapter's title screen and every chapter's
 *                         conclusion/summary screen. Covers the game with
 *                         blue, shows `type`-specific content, holds, then
 *                         splits open again to reveal the game and calls
 *                         onClose().
 *
 * These two branches share the same CSS/markup but have separate timer
 * logic below because the sequence of events is genuinely different, not
 * just reversed.
 *
 * -------------------------
 * The `type` prop
 * -------------------------
 * Only relevant when direction="close". Determines what content shows
 * once the screen is fully covered — this is how the same component
 * serves both the "new chapter" and "chapter finished" use cases:
 *   "title"      -> Renders <ChapterTitle />, for entering a new chapter.
 *   "conclusion" -> Not implemented yet — for finishing a chapter. Add a
 *                   <ChapterConclusion /> component and a case for it
 *                   below when it's built.
 *
 * The parent component (GameScreen) is responsible for deciding which
 * `type` to pass and for toggling it between chapters — this component
 * doesn't track or alternate that itself.
 */

import { useEffect, useState } from 'react';
import { useGameState, hasCompleted } from './GameState.jsx';
import '../styles/BlueScreen.css';

import ChapterTitle from './ChapterTitle.jsx';

const COVER_DURATION = 2000; //2000;
const REVEAL_DURATION = 2000;

const BlueScreen = ({ onClose, direction = 'open', type, holdDuration = 6000 }) => {//6000
    const { state } = useGameState();

    const [split, setSplit] = useState(direction === 'close');
    const [loading, setLoading] = useState(direction === 'open');
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        if (direction === 'close') {
            // Cover the game with blue
            const frame = requestAnimationFrame(() => setSplit(false));

            // Once fully covered, reveal the title/conclusion content
            const contentTimer = setTimeout(() => {
                setShowContent(true);
            }, COVER_DURATION);

            // After holding, hide content and split back open
            const reopenTimer = setTimeout(() => {
                setShowContent(false);
                setSplit(true);
            }, COVER_DURATION + holdDuration);

            // Only unmount once the reveal has finished, so nothing jumps
            const closeTimer = setTimeout(() => {
                onClose();
            }, COVER_DURATION + holdDuration + REVEAL_DURATION);

            return () => {
                cancelAnimationFrame(frame);
                clearTimeout(contentTimer);
                clearTimeout(reopenTimer);
                clearTimeout(closeTimer);
            };
        }

        // 'open': show loading, then split once to reveal — no re-covering
        const loadingTimer = setTimeout(() => {
            setLoading(false);
            setSplit(true);
        }, 3000);

        const closeTimer = setTimeout(() => onClose(), 5000);

        return () => {
            clearTimeout(loadingTimer);
            clearTimeout(closeTimer);
        };
    }, [onClose, direction, holdDuration]);

    return (
        <div className={`BlueScreen ${split ? 'closing' : ''}`}>
               {/*
              * Loading spinner: shown only during the very first-ever
              * BlueScreen appearance in a play session (direction="open"),
              * gated additionally on the missile sequence not having
              * happened yet — since that sequence is itself part of the
              * game's opening, this spinner is really tied to "has the
              * player ever gotten past the very start of the game." It is
              * NOT shown on chapter title/conclusion screens later on.
              */}
            {!hasCompleted(state, 'missile_sequence') && loading && (
                <div className="loading-circle">
                    <p className="body">טוען סימולציה</p>
                </div>
            )}
            {showContent && type === 'title' && <ChapterTitle />}
        </div>
    );
};

export default BlueScreen;