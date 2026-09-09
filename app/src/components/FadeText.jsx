import { useEffect } from 'react';

import '../styles/FadeText.css';


const FadeText = ({
    text,
    duration = 1000,
    onTypingComplete,
    onComplete,
    showTriangle = true
}) => {

    useEffect(() => {

        const timer = setTimeout(() => {

            if (onTypingComplete) {
                onTypingComplete();
            }

        }, duration);


        return () => {
            clearTimeout(timer);
        };

    }, [text, duration]);


    return (
        <div
            className="FadeText"
            onClick={onComplete}
        >

            <p
                className="clickable fade-in"
                style={{ animationDuration: `${duration}ms` }}
            >
                {text}
                <span
                    className="continue-triangle"
                    style={{ visibility: showTriangle ? 'visible' : 'hidden' }}
                >
                    ▼
                </span>
            </p>

        </div>
    );
};


export default FadeText;