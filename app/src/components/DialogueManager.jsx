import { useEffect, useState } from 'react';
import { useGameState } from './GameState.jsx';
import { dialogueData } from '../data_files/dialogueData.js';
import TypeWriter from './TypeWriter.jsx';

const DialogueManager = ({ onComplete = () => {},
    className = ''
}) => {

    const { state, dispatch } = useGameState();

    const [textDone, setTextDone] = useState(false);

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
    // ENTER DIALOGUE
    // --------------------------------------------------

    const setDialogue = (dialogueId) => {

        const dialogue = dialogueData[chapterKey]?.[dialogueId];

        if (!dialogue) {
            console.warn(`Dialogue not found: ${dialogueId}`);
            return;
        }


        // Update GameState first
        dispatch({
            type: 'SET_DIALOGUE',
            dialogue: dialogueId
        });


        // Run events immediately
        if (dialogue.onEnter) {

            if (Array.isArray(dialogue.onEnter)) {
                dialogue.onEnter.forEach(action => {
                    dispatch(action);
                });
            } else {
                dispatch(dialogue.onEnter);
            }

        }


        // The new text has not finished typing yet
        setTextDone(false);
    };


    // --------------------------------------------------
    // START DIALOGUE
    // --------------------------------------------------

    useEffect(() => {

        if (!state.currentDialogue) {
            setDialogue('dialogue_1');
        }

    }, [state.currentDialogue]);


    // --------------------------------------------------
    // ADVANCE DIALOGUE
    // --------------------------------------------------

    const advanceDialogue = () => {

        const currentDialogue = getCurrentDialogue();

        if (!currentDialogue) {
            return;
        }


        let nextDialogue = currentDialogue.next;


        // If "next" isn't specified,
        // automatically use the next dialogue number.
        if (nextDialogue === undefined) {

            const currentNumber =
                Number(state.currentDialogue.split('_')[1]);

            const automaticNext =
                `dialogue_${currentNumber + 1}`;


            // Only use it if it exists
            if (dialogueData[chapterKey]?.[automaticNext]) {

                nextDialogue = automaticNext;

            } else {

                nextDialogue = null;

            }

        }


        // No next dialogue means the dialogue sequence is finished
        if (!nextDialogue) {

            console.log('Dialogue finished');
            onComplete();
            console.log(state.completed);
            dispatch({type: 'MARK_COMPLETED', chapter: state.currentChapter});
            console.log(state.completed);
            return;

        }


        // Enter the next dialogue
        setDialogue(nextDialogue);
    };


    const currentDialogue = getCurrentDialogue();


    // Dialogue hasn't been initialized yet
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

                onTypingComplete={() => {
                    setTextDone(true);
                }}

                onComplete={advanceDialogue}

                showTriangle={textDone}
            />

        </div>
    );
};

export default DialogueManager;