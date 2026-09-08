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
 * DialogueManager is responsible for the FLOW of dialogue.
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
 * The current chapter is taken from GameState and converted into:
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
 * 3. The dialogue's waitFor condition is stored locally.
 * 4. The typing state is reset.
 *
 *
 * -------------------------
 * Advancing dialogue
 * -------------------------
 *
 * Normally, the player advances the dialogue by interacting with
 * the TypeWriter.
 *
 * The next dialogue can be defined in two ways:
 *
 * 1. Explicit `next`
 *
 *        next: "dialogue_5"
 *
 * 2. Automatic numerical progression
 *
 *        dialogue_1 → dialogue_2 → dialogue_3 → ...
 *
 * If `next` is not specified, DialogueManager looks for the next
 * numerical dialogue.
 *
 *
 * -------------------------
 * waitFor
 * -------------------------
 *
 * A dialogue can wait for something elsewhere in the game before
 * continuing.
 *
 * Example:
 *
 *     waitFor: { flag: 'region' }
 *
 * This means the dialogue will not advance until:
 *
 *     state.flags.region
 *
 * becomes truthy.
 *
 * The waitFor condition is stored in `waitingFor`.
 *
 * Whenever the relevant GameState changes, the advancement effect
 * checks the condition again.
 *
 * When the condition becomes satisfied, the dialogue automatically
 * advances.
 *
 *
 * -------------------------
 * Supported wait conditions
 * -------------------------
 *
 * Currently supported:
 *
 *     { flag: 'someFlag' }
 *     { completed: 1 }
 *
 * Additional condition types can be added to evaluateWaitFor()
 * later without changing the rest of DialogueManager.
 *
 *
 * -------------------------
 * Completing a dialogue sequence
 * -------------------------
 *
 * When there is no next dialogue:
 *
 * - `onComplete()` is called.
 * - The current chapter is marked as completed.
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

    /*
     * Store the waitFor condition of the CURRENT dialogue.
     *
     * This is the same approach used in ProtocolGame.
     *
     * Instead of trying to read waitFor directly from dialogueData
     * inside the effect, we explicitly update this state whenever
     * we enter a new dialogue.
     */
    const [waitingFor, setWaitingFor] = useState(null);


    // --------------------------------------------------
    // CHAPTER KEY
    // --------------------------------------------------

    const chapterKey = `chapter_${state.currentChapter}`;


    // --------------------------------------------------
    // GET CURRENT DIALOGUE
    // --------------------------------------------------

    const getCurrentDialogue = () => {

        if (!state.currentDialogue) {
            return null;
        }

        return dialogueData[chapterKey]?.[state.currentDialogue];
    };


    // --------------------------------------------------
    // EVALUATE WAIT FOR
    // --------------------------------------------------

    /*
     * Check whether the current waitFor condition is satisfied.
     *
     * Returns:
     *
     *     null  → there is no wait condition
     *     true  → the condition is satisfied
     *     false → the condition is not satisfied
     */
    const evaluateWaitFor = (wait) => {

        if (!wait) {
            return null;
        }


        // Wait for a GameState flag to become truthy.
        if (wait.flag) {
            return Boolean(state.flags[wait.flag]);
        }


        // Wait for a chapter to be completed.
        if (wait.completed !== undefined) {
            return state.completed.includes(wait.completed);
        }


        // Unknown condition.
        return false;
    };


    // --------------------------------------------------
    // ENTER DIALOGUE
    // --------------------------------------------------

    /*
     * Enter a specific dialogue.
     *
     * This updates GameState, runs the dialogue's onEnter actions,
     * stores its waitFor condition, and resets the TypeWriter.
     */
    const setDialogue = (dialogueId) => {

        const dialogue =
            dialogueData[chapterKey]?.[dialogueId];


        if (!dialogue) {

            console.warn(
                `Dialogue not found: ${dialogueId}`
            );

            return;
        }


        // Tell GameState which dialogue is now active.
        dispatch({
            type: 'SET_DIALOGUE',
            dialogue: dialogueId
        });


        // Run actions that should happen when entering this dialogue.
        if (dialogue.onEnter) {

            if (Array.isArray(dialogue.onEnter)) {

                dialogue.onEnter.forEach(action => {
                    dispatch(action);
                });

            } else {

                dispatch(dialogue.onEnter);

            }
        }


        /*
         * Store the wait condition of this dialogue.
         *
         * For example:
         *
         *     dialogue_7:
         *         waitFor: { flag: 'region' }
         *
         * becomes:
         *
         *     waitingFor = { flag: 'region' }
         */
        setWaitingFor(dialogue.waitFor || null);


        // The new dialogue has not finished typing yet.
        setTextDone(false);
    };


    // --------------------------------------------------
    // START DIALOGUE
    // --------------------------------------------------

    /*
     * If there is no active dialogue, start with dialogue_1.
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
     * Move to the next dialogue.
     */
    const advanceDialogue = () => {

        const currentDialogue = getCurrentDialogue();

        if (!currentDialogue) {
            return;
        }


        // --------------------------------------------------
        // CHECK WAIT FOR
        // --------------------------------------------------

        const waitStatus =
            evaluateWaitFor(waitingFor);


        /*
         * If this dialogue is waiting for something and
         * the condition has not been satisfied, do nothing.
         */
        if (
            waitingFor &&
            waitStatus === false
        ) {
            return;
        }


        // --------------------------------------------------
        // FIND NEXT DIALOGUE
        // --------------------------------------------------

        let nextDialogue =
            currentDialogue.next;


        /*
         * If `next` was not explicitly specified, try to find
         * the next dialogue numerically.
         */
        if (nextDialogue === undefined) {

            const currentNumber =
                Number(
                    state.currentDialogue.split('_')[1]
                );


            const automaticNext =
                `dialogue_${currentNumber + 1}`;


            if (
                dialogueData[chapterKey]?.[automaticNext]
            ) {

                nextDialogue = automaticNext;

            } else {

                nextDialogue = null;
            }
        }


        // --------------------------------------------------
        // DIALOGUE FINISHED
        // --------------------------------------------------

        if (!nextDialogue) {

            console.log('Dialogue finished');


            onComplete();


            dispatch({
                type: 'MARK_COMPLETED',
                chapter: state.currentChapter
            });


            return;
        }


        // --------------------------------------------------
        // ENTER NEXT DIALOGUE
        // --------------------------------------------------

        setDialogue(nextDialogue);
    };


    // --------------------------------------------------
    // ADVANCEMENT LOGIC
    // --------------------------------------------------

    /*
     * This effect is based directly on the ProtocolGame
     * DialogueManager pattern.
     *
     * It runs whenever:
     *
     * - The text finishes typing.
     * - The waitFor condition changes.
     * - GameState flags change.
     * - Completed chapters change.
     *
     * If there is a waitFor condition and it becomes satisfied,
     * the dialogue automatically advances.
     */
    useEffect(() => {

        if (!textDone) {
            return;
        }


        const currentDialogue =
            getCurrentDialogue();


        if (!currentDialogue) {
            return;
        }


        // Check the current waitFor condition.
        const waitConditionStatus =
            evaluateWaitFor(waitingFor);


        /*
         * Automatically advance only when:
         *
         * 1. A waitFor condition exists.
         * 2. The condition has been satisfied.
         */
        if (
            waitingFor &&
            waitConditionStatus === true
        ) {

            advanceDialogue();
        }


    }, [
        textDone,
        waitingFor,
        state.completed,
        state.flags
    ]);


    // --------------------------------------------------
    // CURRENT DIALOGUE
    // --------------------------------------------------

    const currentDialogue =
        getCurrentDialogue();


    if (!currentDialogue) {
        return null;
    }


    // --------------------------------------------------
    // WAIT STATE
    // --------------------------------------------------

    const waitConditionStatus =
        evaluateWaitFor(waitingFor);


    /*
     * A dialogue is blocked when it has a waitFor condition
     * that has not yet been satisfied.
     */
    const isBlocked =
        waitingFor &&
        waitConditionStatus === false;


    // --------------------------------------------------
    // RENDER
    // --------------------------------------------------

    return (
        <div className={`DialogueManager ${className}`}>

            <TypeWriter
                text={currentDialogue.text}

                onTypingComplete={() => {
                    setTextDone(true);
                }}

                onComplete={advanceDialogue}

                /*
                 * Hide the triangle while the dialogue is
                 * waiting for an external game event.
                 */
                showTriangle={
                    textDone &&
                    !isBlocked
                }
            />

        </div>
    );
};


export default DialogueManager;