/*
 * =========================
 * DialogueManager
 * =========================
 *
 * The main logic component for the game's dialogue system.
 *
 * DialogueManager connects three parts of the game:
 *
 * 1. `dialogueData`
 *    Contains the actual dialogue content and information about
 *    what should happen when a dialogue is entered or completed.
 *
 * 2. `GameState`
 *    Stores which chapter and which dialogue are currently active,
 *    as well as any flags/events triggered by the dialogue.
 *
 * 3. `TypeWriter`
 *    Handles displaying the dialogue text and the typing animation.
 *
 *
 * The basic flow is:
 *
 *     dialogueData
 *          ↓
 *     DialogueManager
 *          ↓
 *     TypeWriter
 *          ↓
 *     Player advances
 *          ↓
 *     DialogueManager enters the next dialogue
 *
 *
 * DialogueManager is responsible for the LOGIC of the dialogue.
 * TypeWriter is responsible for HOW the dialogue is displayed.
 *
 *
 * -------------------------
 * Dialogue structure
 * -------------------------
 *
 * Each chapter has its own section in dialogueData:
 *
 *     chapter_1
 *     chapter_2
 *     chapter_3
 *     ...
 *
 * The current chapter is taken from GameState and converted into
 * the appropriate key:
 *
 *     `chapter_${state.currentChapter}`
 *
 * The current dialogue is then found using `state.currentDialogue`.
 *
 *
 * -------------------------
 * Entering a dialogue
 * -------------------------
 *
 * `setDialogue()` is responsible for entering a new dialogue.
 *
 * When a dialogue is entered:
 *
 * 1. GameState is updated with the new dialogue ID.
 * 2. Any `onEnter` actions defined by that dialogue are dispatched.
 * 3. The typing state is reset so the new text can begin typing.
 *
 * `onEnter` can contain either one action or an array of actions.
 * This allows a dialogue to trigger things such as changing flags
 * or starting an event when it begins.
 *
 *
 * -------------------------
 * Advancing dialogue
 * -------------------------
 *
 * When the player finishes reading the current dialogue,
 * `advanceDialogue()` determines which dialogue should come next.
 *
 * There are two ways to define the next dialogue:
 *
 * 1. Explicit `next`
 *
 *    A dialogue can specify exactly which dialogue should follow it.
 *
 *    Example:
 *
 *        next: "dialogue_5"
 *
 *    This is useful when the dialogue flow branches or does not
 *    follow a simple numerical order.
 *
 * 2. Automatic progression
 *
 *    If `next` is not specified, DialogueManager automatically tries
 *    to use the next dialogue number.
 *
 *        dialogue_1 → dialogue_2 → dialogue_3 → ...
 *
 *    The automatically calculated dialogue is only used if it actually
 *    exists in the current chapter.
 *
 *    If it does not exist, the dialogue sequence is considered finished.
 *
 *
 * -------------------------
 * Completing a dialogue sequence
 * -------------------------
 *
 * When there is no next dialogue:
 *
 * - `onComplete()` is called so the component using DialogueManager
 *   can react to the dialogue sequence finishing.
 * - The current chapter is marked as completed in GameState.
 *
 * This allows a chapter to move from its dialogue section into
 * whatever comes next, such as a manual, task, review, or another
 * chapter component.
 *
 *
 * -------------------------
 * Important design principle
 * -------------------------
 *
 * DialogueManager should handle the FLOW of dialogue, not the
 * visual presentation of the text.
 *
 * If the typing animation, text appearance, or reading indicator
 * needs to change, look at TypeWriter.
 *
 * If the order, branching, events, or conditions of the dialogue
 * need to change, look at DialogueManager and dialogueData.
 * 
 *
 * -------------------------
 * Planned dialogue features
 * -------------------------
 *
 * The dialogue system is intended to be expanded with more advanced
 * control over dialogue flow.
 *
 * `onWait`
 *    A dialogue will be able to specify one or more conditions that
 *    must be satisfied before the player can advance.
 *
 *    For example, a dialogue could wait until a specific game flag
 *    has been set:
 *
 *        onWait: ...
 *
 *    This allows dialogue to pause while the player performs an action
 *    elsewhere in the game, and continue only after that action is done.
 *
 * Multiple events
 *    A single dialogue will be able to trigger multiple events/actions
 *    when it is entered. This is intended to work alongside `onEnter`
 *    rather than limiting a dialogue to a single event.
 *
 * Multiple `onWait` conditions
 *    A dialogue will eventually be able to wait for multiple conditions.
 *    The dialogue should only become advanceable once the required
 *    conditions have been satisfied.
 *
 * Conditional next dialogue
 *    If needed, the next dialogue can also be selected conditionally.
 *
 *    For example:
 *
 *        If the player made a mistake:
 *            → go back to an earlier dialogue
 *
 *        If the player succeeded:
 *            → continue to the next dialogue
 *
 *    This was used in the previous "Protocol Game" project and may
 *    be useful for creating dialogue flows that react to player
 *    performance.
 *
 * These features are NOT fully implemented yet. The current system
 * should be treated as the foundation for this more flexible dialogue
 * flow.
 */

import { useEffect, useState } from 'react';
import { useGameState } from './GameState.jsx';
import { dialogueData } from '../data_files/dialogueData.js';
import TypeWriter from './TypeWriter.jsx';

const DialogueManager = ({
    onComplete = () => {},
    className = ''
}) => {

    const { state, dispatch } = useGameState();

    const [textDone, setTextDone] = useState(false);

    // Build the key used to access this chapter's dialogue data.
    const chapterKey = `chapter_${state.currentChapter}`;


    // --------------------------------------------------
    // GET CURRENT DIALOGUE
    // --------------------------------------------------

    /*
     * Find the dialogue currently stored in GameState.
     *
     * Returns null if there is no active dialogue.
     */
    const getCurrentDialogue = () => {

        if (!state.currentDialogue) {
            return null;
        }

        return dialogueData[chapterKey]?.[state.currentDialogue];
    };


    // --------------------------------------------------
    // ENTER DIALOGUE
    // --------------------------------------------------

    /*
     * Enter a specific dialogue.
     *
     * This updates GameState, runs any actions attached to the
     * dialogue's `onEnter`, and resets the typing state.
     */
    const setDialogue = (dialogueId) => {

        const dialogue = dialogueData[chapterKey]?.[dialogueId];

        if (!dialogue) {
            console.warn(`Dialogue not found: ${dialogueId}`);
            return;
        }


        // Update GameState first so the rest of the application
        // knows which dialogue is currently active.
        dispatch({
            type: 'SET_DIALOGUE',
            dialogue: dialogueId
        });


        /*
         * Run actions that should happen when entering this dialogue.
         *
         * `onEnter` can either be a single action or an array of actions.
         */
        if (dialogue.onEnter) {

            if (Array.isArray(dialogue.onEnter)) {
                dialogue.onEnter.forEach(action => {
                    dispatch(action);
                });
            } else {
                dispatch(dialogue.onEnter);
            }

        }


        // The new dialogue has not finished typing yet.
        setTextDone(false);
    };


    // --------------------------------------------------
    // START DIALOGUE
    // --------------------------------------------------

    /*
     * If there is no dialogue currently selected,
     * automatically start with dialogue_1.
     */
    useEffect(() => {

        if (!state.currentDialogue) {
            setDialogue('dialogue_1');
        }

    }, [state.currentDialogue]);


    // --------------------------------------------------
    // ADVANCE DIALOGUE
    // --------------------------------------------------

    /*
     * Decide what dialogue should be shown next.
     *
     * Explicit `next` values take priority.
     * If no `next` is provided, the system tries to continue
     * numerically (dialogue_1 → dialogue_2 → dialogue_3...).
     */
    const advanceDialogue = () => {

        const currentDialogue = getCurrentDialogue();

        if (!currentDialogue) {
            return;
        }


        let nextDialogue = currentDialogue.next;


        // If "next" isn't specified, automatically try to use
        // the next dialogue number.
        if (nextDialogue === undefined) {

            const currentNumber =
                Number(state.currentDialogue.split('_')[1]);

            const automaticNext =
                `dialogue_${currentNumber + 1}`;


            // Only use the automatically calculated dialogue
            // if it actually exists.
            if (dialogueData[chapterKey]?.[automaticNext]) {

                nextDialogue = automaticNext;

            } else {

                nextDialogue = null;

            }

        }


        /*
         * No next dialogue means the dialogue sequence is finished.
         */
        if (!nextDialogue) {

            console.log('Dialogue finished');

            // Let the parent component react to the dialogue finishing.
            onComplete();

            // Mark the current chapter as completed.
            dispatch({
                type: 'MARK_COMPLETED',
                chapter: state.currentChapter
            });

            return;
        }


        // Enter the next dialogue.
        setDialogue(nextDialogue);
    };


    const currentDialogue = getCurrentDialogue();


    // Dialogue has not been initialized yet.
    if (!currentDialogue) {
        return null;
    }


    // --------------------------------------------------
    // RENDER
    // --------------------------------------------------

    return (
        <div className={`DialogueManager ${className}`}>

            <TypeWriter
                text={currentDialogue.text}

                // TypeWriter tells us when the current text has finished typing.
                onTypingComplete={() => {
                    setTextDone(true);
                }}

                // Called when the player advances past the current dialogue.
                onComplete={advanceDialogue}

                // Only show the advance indicator after the text is fully typed.
                showTriangle={textDone}
            />

        </div>
    );
};

export default DialogueManager;