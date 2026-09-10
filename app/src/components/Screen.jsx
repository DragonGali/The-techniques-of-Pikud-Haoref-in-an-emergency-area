import { useRef, useState } from "react";
import "../styles/Screen.css";
import { useGameState, hasCompleted } from "./GameState.jsx"

const Screen = () => {

    const {state, dispatch} = useGameState();

    const [scale, setScale] = useState(1.5);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const dragStart = useRef(null);
    const lastDistance = useRef(null);

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

    const handlePointerDown = (e) => {
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

    const getDistance = (touches) => {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;

        return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchMove = (e) => {
        if (e.touches.length !== 2) return;

        const distance = getDistance(e.touches);

        if (lastDistance.current !== null) {
            const difference = distance - lastDistance.current;

            setScale((oldScale) => {
                const newScale = Math.min(
                    4,
                    Math.max(1, oldScale + difference * 0.005)
                );

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

    {/*Grabbable not working :(*/}
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

            {/* <div className={`strike-zone ${}`}></div> */}
        </div>
    </div>
    );
};

export default Screen;