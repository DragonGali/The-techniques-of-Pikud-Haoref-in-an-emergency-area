/*
 * =========================
 * Screen
 * =========================
 *
 * Screen is the main map view — the core gameplay surface. It renders the
 * map image inside a pannable/zoomable layer, and (for now) also owns the
 * one-time missile sequence: a rocket flies in, hits a target, and
 * explodes. Once that sequence completes, GameScreen picks up the
 * `missile_sequence` completion flag and shows a chapter-title BlueScreen
 * on top of this component (see GameScreen.jsx).
 *
 * -------------------------
 * Pan & zoom (drag logic)
 * -------------------------
 * The map itself doesn't move directly — instead, everything the player
 * sees (map image + missile/explosion images) lives inside `.map-layer`,
 * and panning/zooming is done by applying `translate()` and `scale()` to
 * that one wrapper via inline style. `scale` and `position` (the x/y
 * translate offset) are the two pieces of state driving that transform.
 *
 * Two separate input paths update this state:
 *
 *   1. Mouse/pointer drag (desktop + also fires on touch, since pointer
 *      events unify both): handlePointerDown/Move/Up. `dragStart` records
 *      where the pointer was relative to the current `position` when the
 *      drag began, so each subsequent move can compute a new absolute
 *      position without accumulating error.
 *
 *   2. Two-finger touch pinch (mobile zoom): handleTouchMove/End.
 *      `lastDistance` stores the distance between the two touch points
 *      from the previous event, so each new event can tell whether the
 *      fingers moved closer or further apart (`difference`) and adjust
 *      `scale` accordingly. Note this ONLY handles zoom, not pan — pinch
 *      panning would need to also track the midpoint between the two
 *      touches, which isn't implemented here.
 *
 * `clampPosition` is called after every pan/zoom update and prevents the
 * map from being dragged past its own edges — it works by computing how
 * much bigger the (scaled) map image is than the visible `.Screen` box,
 * and clamping the offset so you can never reveal empty space beyond the
 * image's edge. It reads `.Screen`'s actual rendered size via
 * `document.querySelector` rather than a ref — fine for now since there's
 * only ever one `.Screen` on screen at a time, but worth converting to a
 * ref if that assumption ever changes.
 *
 * -------------------------
 * Missile sequence (rocket -> target -> explosion)
 * -------------------------
 * This is a one-time scripted animation, gated by
 * `hasCompleted(state, 'missile_sequence')`:
 *
 *   - While NOT completed: the target and rocket images render (their
 *     flight/appear animations and timing live in Screen.css — see
 *     `.missile-target`, `.missile-rocket`, and their keyframes). The
 *     explosion image is present but has the "playing" class, which
 *     starts invisible and animates in via CSS at a delay timed to match
 *     when the rocket reaches the target (see Screen.css comments there
 *     for the exact delay math).
 *
 *   - The explosion's `onAnimationEnd` fires once its CSS animation
 *     finishes, which is what actually marks `missile_sequence` as
 *     completed in game state via `dispatch`. This is the ONLY place
 *     that dispatch happens — nothing else in the app marks this
 *     sequence complete.
 *
 *   - Once completed: the target/rocket div stops rendering entirely
 *     (removed from the DOM, not just hidden), and the explosion image
 *     switches to the "done" class, which shows it permanently at its
 *     final expanded size with no animation. This is important: without
 *     this split, remounting Screen (e.g. navigating away and back)
 *     would replay the whole animation from scratch, since CSS
 *     animations restart on element mount. The "done" class sidesteps
 *     that by never giving the browser an animation to (re)play once the
 *     sequence is over.
 */

import { useRef, useState } from "react";
import "../styles/Screen.css";
import { useGameState, hasCompleted } from "./GameState.jsx";

const Screen = () => {

    const {state, dispatch} = useGameState();

    // Current zoom level and pan offset applied to `.map-layer`.
    const [scale, setScale] = useState(1.5);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    // Not state — these are just working values used mid-gesture and don't
    // need to trigger re-renders themselves.
    const dragStart = useRef(null);     // pointer offset at drag start
    const lastDistance = useRef(null);  // previous two-finger distance, for pinch zoom

    // Prevents panning/zooming from revealing empty space past the map
    // image's edges. Computes how far `.map-layer` can be offset in each
    // direction given its current scale, then clamps (x, y) into that range.
    const clampPosition = (x, y, newScale) => {
        const screen = document.querySelector(".Screen");

        if (!screen) return { x, y };

        const screenWidth = screen.clientWidth;
        const screenHeight = screen.clientHeight;

        const imageWidth = screenWidth * newScale;
        const imageHeight = screenHeight * newScale;

        const maxX = (imageWidth - screenWidth) / 2;
        const maxY = (imageHeight - screenHeight) / 2;

        return {
            x: Math.min(maxX, Math.max(-maxX, x)),
            y: Math.min(maxY, Math.max(-maxY, y))
        };
    };

    // --- Single-pointer drag (pan) ---

    const handlePointerDown = (e) => {
        // Record the offset between the pointer and the layer's current
        // position, so subsequent moves can compute an absolute position
        // directly instead of accumulating deltas.
        dragStart.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
    };

    const handlePointerMove = (e) => {
        if (!dragStart.current) return;

        const x = e.clientX - dragStart.current.x;
        const y = e.clientY - dragStart.current.y;

        setPosition(clampPosition(x, y, scale));
    };

    const handlePointerUp = () => {
        dragStart.current = null;
    };

    // --- Two-finger pinch (zoom) ---

    const getDistance = (touches) => {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;

        return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchMove = (e) => {
        if (e.touches.length !== 2) return;

        const distance = getDistance(e.touches);

        if (lastDistance.current !== null) {
            // Positive `difference` = fingers moving apart = zoom in.
            const difference = distance - lastDistance.current;

            setScale((oldScale) => {
                const newScale = Math.min(
                    4,
                    Math.max(1, oldScale + difference * 0.005)
                );

                // Re-clamp position too, since zooming changes how far the
                // layer is allowed to be offset.
                setPosition((oldPosition) =>
                    clampPosition(
                        oldPosition.x,
                        oldPosition.y,
                        newScale
                    )
                );

                return newScale;
            });
        }

        lastDistance.current = distance;
    };

    const handleTouchEnd = () => {
        lastDistance.current = null;
    };

    return (
        <div className="Screen"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}>
        <div
            className="map-layer"
            style={{
                transform: `
                    translate(${position.x}px, ${position.y}px)
                    scale(${scale})
                `
            }}
        >
            <img
                className="Screen-map grabbable"
                src="/GameScreen/Screen/rehovot-map.png"
                alt="Rehovot map"
            />

            {/*Rocket flying to the target, rocket should disappear and the red zone would spread out.*/}
            {!hasCompleted(state, 'missile_sequence') && 
                <div>
                    <img className="missile-target" src="/GameScreen/Screen/Missile Sequence/Target.png"/>
                    <img className="missile-rocket" src="/GameScreen/Screen/Missile Sequence/Rocket.png" />
                </div>
            }

            <img
                className={`explosion ${hasCompleted(state, 'missile_sequence') ? 'done' : 'playing'}`}
                src="/GameScreen/Screen/Explosion.png"
                onAnimationEnd={() => dispatch({ type: 'MARK_COMPLETED', id: 'missile_sequence' })}
            />
        </div>
    </div>
    );
};

export default Screen;