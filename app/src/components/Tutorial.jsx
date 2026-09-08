/*
 * ============================================================
 * TUTORIAL CHAPTER
 * ============================================================
 *
 * This component contains the game's tutorial chapter.
 *
 * The tutorial is slightly different from a normal chapter because
 * it is also used to teach the player how the application's interface
 * works. It introduces things such as the chapter structure, settings,
 * pop-ups, and other UI elements that will be used later in the game.
 *
 * The tutorial is driven by GameState and DialogueManager.
 *
 * GameState determines:
 *   - Which chapter is currently active
 *   - Which theme is currently active
 *   - Which tutorial event is currently being shown
 *   - Whether the tutorial has already been completed
 *
 * DialogueManager handles the instructional dialogue. The current
 * tutorial event is stored in state.flags.event, and the component
 * displays the appropriate visual demonstration based on that event.
 *
 * The visual demonstrations are intentionally kept here rather than
 * inside DialogueManager. DialogueManager is the generic dialogue
 * system, while Tutorial decides what additional visual content should
 * appear alongside the dialogue for each tutorial event.
 *
 *
 * -------------------------
 * TUTORIAL EVENTS
 * -------------------------
 *
 * tutorial_1
 *   → Shows the chapter icons.
 *
 * tutorial_2
 *   → Demonstrates opening the settings window.
 *
 * tutorial_3
 *   → Demonstrates a normal pop-up.
 *
 * tutorial_4
 *   → Demonstrates an attention/important pop-up.
 *
 * Additional tutorial events can be added in the same way if needed.
 *
 *
 * -------------------------
 * COMPLETION
 * -------------------------
 *
 * While the tutorial is still in progress, the dialogue and tutorial
 * demonstrations are displayed.
 *
 * Once the current chapter is marked as completed in GameState, the
 * tutorial content is replaced with RegionSelection.
 *
 * This is intended to represent the transition from learning how the
 * application works to selecting/entering the next part of the game.
 *
 *
 * -------------------------
 * THEME
 * -------------------------
 *
 * The Tutorial component receives the current theme from GameState and
 * applies it to the main container.
 *
 * The light/dark versions of individual elements can therefore be
 * styled differently depending on the theme.
 *
 * The noise effect is currently applied to the tutorial card only in
 * light mode. This follows the visual direction of the Figma design.
 *
 *
 * -------------------------
 * DIALOGUE ANIMATION
 * -------------------------
 *
 * The tutorial currently uses DialogueManager, which uses the
 * TypeWriter effect for its text.
 *
 * I'm not completely convinced that the typing effect is the best fit
 * for this particular screen. The tutorial contains a lot of visual
 * demonstrations, so a simple fade-in effect may fit the interface
 * better and feel less like traditional game dialogue.
 *
 * If the TypeWriter effect feels distracting here, consider replacing
 * it with a fade animation specifically for the tutorial.
 *
 * This is a design decision, not a strict implementation requirement.
 * Compare it with the Figma design and use whichever feels more natural.
 *
 *
 * -------------------------
 * IMPORTANT
 * -------------------------
 *
 * This component should mainly control the tutorial's composition.
 * Avoid putting the generic dialogue, pop-up, settings, or game-state
 * logic directly into this component when a reusable system already
 * exists for it.
 *
 * The Tutorial decides WHAT should appear.
 * The reusable components decide HOW those things work.
 */

import { useGameState } from './GameState.jsx';

import '../styles/Tutorial.css';

import DialogueManager from './DialogueManager.jsx';
import SettingsWindow from './SettingsWindow.jsx';
import PopUp from './PopUp.jsx';
import RegionSelection from './RegionSelection.jsx'

const Tutorial = () => {

  const { state, dispatch } = useGameState();

  const toggleTheme = () => {
    dispatch({
      type: 'SET_THEME',
      theme: state.theme === 'light' ? 'dark' : 'light'
    });
  };

  return (
    <div className={`Tutorial ${state.theme}`}>

      <button
        className="toggle-button"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        <img
          src="/General/Toggle-light.png"
          className={`toggle-image clickable ${state.theme === 'light' ? 'active' : ''}`}
        />

        <img
          src="/General/Toggle-dark.png"
          className={`toggle-image clickable ${state.theme === 'dark' ? 'active' : ''}`}
        />
      </button>

      <div className={`tutorial-card ${state.theme === 'light' ? 'noise' : ''}`}>

        {!state.completed.includes(state.currentChapter) && (
          <>

            {/*
             * The tutorial dialogue is controlled by DialogueManager.
             *
             * The event-specific class is used by Tutorial.css to
             * position/style the dialogue differently depending on
             * which tutorial event is currently being displayed.
             *
             * NOTE:
             * The TypeWriter effect may not be the best visual choice
             * for this screen. Consider replacing it with a fade effect
             * if the typing animation feels distracting or too slow.
             */}
            <DialogueManager
              className={`tutorial-dialogue H3 ${
                state.flags.event
                  ? 'event_' + state.flags.event.split('_')[1]
                  : ''
              }`}
            />

            {/*
             * tutorial_1:
             * Introduces the chapter structure of the game.
             */}
            {state.flags.event === 'tutorial_1' && (
              <img
                className="chapter-icons"
                src="/Tutorial/Chapter Icons.png"
                alt="Chapter Icons"
              />
            )}

            {/*
             * tutorial_2:
             * Demonstrates how to open the settings window.
             *
             * The images are shown as part of the tutorial rather than
             * being the actual interactive settings interface.
             */}
            {state.flags.event === 'tutorial_2' && (
              <div className="settings-showcase">
                <img
                  className="settings-icon"
                  src={`/General/Settings Icon-${state.theme}.png`}
                  alt="Settings Icon"
                />
                <img
                  className="pointer"
                  src="/Tutorial/BigCursor.png"
                  alt="Pointer"
                />
                <SettingsWindow className="settings-window" />
              </div>
            )}

            {/*
             * tutorial_3:
             * Demonstrates a normal pop-up window.
             */}
            {state.flags.event === 'tutorial_3' && (
              <div className="popup-showcase">
                <img
                  className="pointer-2"
                  src="/Tutorial/BigCursor.png"
                  alt="Pointer"
                />
                <PopUp
                  content={
                    <div className="body-bold">
                      "אני חלונית נפתחת"
                    </div>
                  }
                />
              </div>
            )}

            {/*
             * tutorial_4:
             * Demonstrates the attention/important version of a pop-up.
             */}
            {state.flags.event === 'tutorial_4' && (
              <PopUp attention={true} />
            )}

          </>
        )}

        {/*
         * Once the tutorial chapter has been completed, the tutorial
         * content is no longer shown and the player is presented with
         * RegionSelection instead.
         */}
        {state.flags.event === 'tutorial_5' && (
          <div>
            <RegionSelection/>
          </div>
        )}

      </div>

    </div>
  );
};

export default Tutorial;
