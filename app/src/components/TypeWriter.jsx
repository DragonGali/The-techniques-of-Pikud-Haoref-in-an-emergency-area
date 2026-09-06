/*
 * =========================
 * TypeWriter
 * =========================
 *
 * A reusable component responsible for displaying text with a
 * typewriter-style animation.
 *
 * TypeWriter does NOT decide what the dialogue says or what the
 * next dialogue should be. That logic belongs to DialogueManager.
 *
 * Its job is to:
 * - Gradually display the supplied text
 * - Detect when the text has finished typing
 * - Prevent the player from advancing while the text is still typing
 * - Show a continue indicator once the text is finished
 * - Notify the parent component when the player clicks to continue
 *
 *
 * -------------------------
 * Props
 * -------------------------
 *
 * `text`
 *    The text to display.
 *
 * `speed`
 *    The delay between each character, in milliseconds.
 *    Defaults to 40ms.
 *
 * `onTypingComplete`
 *    Called when the entire text has finished typing.
 *    DialogueManager uses this to know when the player is allowed
 *    to advance.
 *
 * `onComplete`
 *    Called when the player clicks after the text has finished.
 *    The parent decides what should happen next.
 *
 * `showTriangle`
 *    Controls whether the continue triangle is displayed once
 *    the text has finished typing.
 *
 *
 * -------------------------
 * Typing flow
 * -------------------------
 *
 * When `text` changes:
 *
 *     Reset displayed text
 *            ↓
 *     Start typing characters
 *            ↓
 *     Text finished
 *            ↓
 *     canAdvance = true
 *            ↓
 *     Show continue triangle
 *            ↓
 *     Player clicks
 *            ↓
 *     onComplete()
 *
 * If the text is still being typed, clicks are ignored.
 *
 *
 * -------------------------
 * Cleanup
 * -------------------------
 *
 * The typing animation uses repeated setTimeout calls.
 * `cancelled` prevents an old animation from continuing after
 * the component is unmounted or the text changes.
 *
 *
 * -------------------------
 * Future changes
 * -------------------------
 *
 * The typewriter effect is currently used for dialogue, but it may
 * not be the best visual effect for every part of the game.
 *
 * For example, the Tutorial may eventually use a fade-in effect
 * instead of character-by-character typing.
 *
 * If the visual effect is changed, the important behavior to preserve
 * is the separation between:
 *
 *     "The text has finished appearing"
 *
 * and
 *
 *     "The player is allowed to advance."
 *
 * This allows the dialogue logic to remain independent from the
 * specific animation used to display the text.
 */

import { useEffect, useState } from 'react';

const TypeWriter = ({
  text,
  speed = 40,
  onTypingComplete,
  onComplete,
  showTriangle = true
}) => {

  const [displayedText, setDisplayedText] = useState('');
  const [canAdvance, setCanAdvance] = useState(false);


  /*
   * Start/restart the typing animation whenever the text or
   * typing speed changes.
   */
  useEffect(() => {

    setDisplayedText('');
    setCanAdvance(false);

    let index = 0;
    let cancelled = false;


    const typeNext = () => {

      // Stop the animation if the effect has been cleaned up.
      if (cancelled) {
        return;
      }


      // The entire text has been displayed.
      if (index >= text.length) {

        setCanAdvance(true);

        if (onTypingComplete) {
          onTypingComplete();
        }

        return;
      }


      // Add the next character to the displayed text.
      setDisplayedText(text.slice(0, index + 1));

      index++;

      setTimeout(typeNext, speed);
    };


    typeNext();


    /*
     * Cancel the current animation when the text changes or
     * the component is removed.
     */
    return () => {
      cancelled = true;
    };

  }, [text, speed]);


  /*
   * Advance only after the text has finished appearing.
   */
  const handleClick = () => {

    if (!canAdvance) {
      return;
    }

    if (onComplete) {
      onComplete();
    }

  };


  return (
    <div
      className="TypeWriter"
      onClick={handleClick}
    >

      <p className="clickable">
        {displayedText}

        {canAdvance && showTriangle && (
          <span className="continue-triangle clickable">
            ▼
          </span>
        )}
      </p>

    </div>
  );
};

export default TypeWriter;