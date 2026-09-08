/*
 * =========================
 * Button
 * =========================
 *
 * A flexible and reusable button component used throughout the application.
 *
 * The component separates the button's content and behavior from its visual
 * styling. Colors, text, and the click behavior can all be supplied through
 * props, allowing the same component to be reused in different parts of the
 * game without duplicating the button structure.
 *
 * Props:
 * - baseColor:
 *     The main color of the button's top surface.
 *     Defaults to the application's highlight color.
 *
 * - textColor:
 *     The color of the button's text.
 *     Defaults to white.
 *
 * - text:
 *     The text displayed inside the button.
 *
 * - onClick:
 *     The function that is executed when the button is clicked.
 *
 * The colors are passed to Button.css as CSS custom properties. This allows
 * the CSS to use the same colors for the different parts of the button,
 * including the top surface, underside, right side, and corner.
 *
 * This component is intentionally kept independent of any specific screen
 * or game logic. Individual screens decide what the button says, how it
 * looks, and what happens when it is clicked.
 *
 * The button's 3D appearance is implemented entirely in CSS. The separate
 * top, underside, right side, and corner elements allow the button to have
 * a physical depth and a pressed state rather than behaving like a flat
 * HTML button.
 *
 * Future development:
 * A special animation will be added for this button when it is used inside
 * the command window. The base component is kept flexible so that this
 * animation can be added without making the button dependent on the command
 * window itself.
 *
 */

import '../styles/Button.css';

const Button = ({
    baseColor = 'var(--highlight)',
    textColor = 'var(--white)',
    text,
    onClick
}) => {
    return (
        <button
            className="Button clickable"
            style={{
                '--button-color': baseColor,
                '--button-text-color': textColor
            }}
            onClick={onClick}
        >
            {/* Main visible surface of the button */}
            <span className="button-top body-bold clickable">
                {text}
            </span>

            {/* Bottom-right surface connecting the underside and side */}
            <span className="button-corner" />
        </button>
    );
};

export default Button;
