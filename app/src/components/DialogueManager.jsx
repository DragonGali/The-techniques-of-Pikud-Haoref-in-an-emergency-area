import { useEffect, useState } from 'react';
import { useGameState } from './GameState.jsx';
import { dialogueData } from '../data_files/dialogueData.js';
import TypeWriter from './TypeWriter.jsx';

const DialogueManager = ({
  className = ''
}) => {

  const { state, dispatch } = useGameState();

  const [textDone, setTextDone] = useState(false);

  const chapterKey = `chapter_${state.currentChapter}`;

  // Get the dialogue currently stored in GameState
  const getCurrentDialogue = () => {

    if (!state.currentDialogue) {
      return null;
    }

    return dialogueData[chapterKey]?.[state.currentDialogue];
  };


  // Start the first dialogue when the manager loads
  useEffect(() => {

    if (!state.currentDialogue) {

      dispatch({
        type: 'SET_DIALOGUE',
        dialogue: 'dialogue_1'
      });

    }

  }, [state.currentDialogue, dispatch]);


  // Called when the player clicks the triangle
  const advanceDialogue = () => {

    const currentDialogue = getCurrentDialogue();

    if (!currentDialogue) {
        return;
    }

    let nextDialogue = currentDialogue.next;

    // If next isn't specified, automatically use the next number
    if (nextDialogue === undefined) {

        const currentNumber =
            Number(state.currentDialogue.split('_')[1]);

        const automaticNext = `dialogue_${currentNumber + 1}`;

        // Check whether that dialogue actually exists
        if (dialogueData[chapterKey]?.[automaticNext]) {
            nextDialogue = automaticNext;
        } else {
            nextDialogue = null;
        }
    }

    // No next dialogue = chapter finished
    if (!nextDialogue) {
        console.log('Dialogue finished');
        return;
    }

    setTextDone(false);

    dispatch({
        type: 'SET_DIALOGUE',
        dialogue: nextDialogue
    });
};

  const currentDialogue = getCurrentDialogue();


  // While dialogue_1 is being initialized
  if (!currentDialogue) {
    return null;
  }


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
