/*
 * =========================
 * SettingsWindow
 * =========================
 *
 * A reusable settings menu used throughout the game.
 *
 * This component is intentionally kept simple:
 * it displays the available settings options and tells the
 * parent component which option the player selected.
 *
 * The actual behavior of each option (going back home,
 * selecting a chapter, exiting the game, etc.) is NOT handled here.
 * Instead, the parent passes a `selectOption` function that decides
 * what should happen when an option is clicked.
 *
 * Available options:
 * - 'home'    → Return to the home/title page
 * - 'chapter' → Open chapter selection
 * - 'exit'    → Exit the game
 *
 * Keeping the actions outside this component makes SettingsWindow
 * reusable in different parts of the game.
 */

import '../styles/SettingsWindow.css';

const SettingsWindow = ({ selectOption = () => {} }) => {
    return (
        <div className="SettingsWindow">

            <div className="header">
                <p className="body">הגדרות</p>
            </div>

            <div className="options">

                {/* Return to the home/title page */}
                <div
                    className="option clickable"
                    onClick={() => selectOption('home')}
                >
                    <p className="small">חזרה לעמוד הביית</p>
                </div>

                {/* Open the chapter selection screen */}
                <div
                    className="option clickable"
                    onClick={() => selectOption('chapter')}
                >
                    <p className="small">בחירת פרק</p>
                </div>

                {/* Exit the game */}
                <div
                    className="option clickable"
                    onClick={() => selectOption('exit')}
                >
                    <p className="small option-text">יציאה</p>
                </div>

            </div>
        </div>
    )
}

export default SettingsWindow;