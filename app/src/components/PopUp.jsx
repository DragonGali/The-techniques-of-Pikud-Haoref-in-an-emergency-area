/*
 * =========================
 * PopUp
 * =========================
 *
 * A reusable popup component used to display information to the player.
 *
 * The popup has two possible modes:
 *
 * 1. Normal popup:
 *    Receives content through the `content` prop and displays it
 *    inside the popup.
 *
 * 2. Attention popup:
 *    When `attention` is true, the popup displays a predefined
 *    "pay attention" message and attention icon instead of
 *    the supplied content.
 *
 * The visual styling and decorative corners are handled by PopUp.css.
 *
 * The popup's width, height, and overall placement should generally
 * be controlled by the component that uses it, rather than being
 * fixed inside PopUp itself.
 *
 * This keeps PopUp flexible and allows it to be reused in different
 * contexts with different sizes.
 *
 * For example:
 *    .Tutorial .PopUp { ... }
 *
 * can be used to define how the popup should look specifically
 * when it is used inside the Tutorial.
 *
 * `onClose` is intended to be used for closing the popup, but the
 * close button functionality has not been implemented yet.
 *
 * This component is meant to handle HOW a popup looks and displays
 * its content. The component using PopUp should decide WHEN the popup
 * should appear, where it should be placed, and what should happen
 * when it is closed.
 */

import "../styles/PopUp.css";

const PopUp = ({ content = null, onClose, attention }) => {
    return (
        <div className={`PopUp ${attention ? 'attention' : ''}`}>

            {/* Close button - functionality still needs to be connected to onClose */}
            <img
                src="/General/closebutton.png"
                className="close-button clickable"
                alt="Close"
            />

            {/* Decorative popup corners */}
            <span className="PopUpCorner topLeft"></span>
            <span className="PopUpCorner topRight"></span>
            <span className="PopUpCorner bottomLeft"></span>
            <span className="PopUpCorner bottomRight"></span>

            {/* Normal popup content */}
            {attention == null && content}

            {/* Special attention/information popup */}
            {attention && (
                <div className="attention-container">
                    <img
                        src="/General/attention-icon.png"
                        className="attention-icon"
                        alt="Attention"
                    />
                    <p className="attention-text H3">
                        שימו לב זה מידע מעודכן
                    </p>
                </div>
            )}

        </div>
    );
};

export default PopUp;