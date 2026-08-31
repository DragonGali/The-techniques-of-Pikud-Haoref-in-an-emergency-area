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


  useEffect(() => {

    setDisplayedText('');
    setCanAdvance(false);

    let index = 0;
    let cancelled = false;

    const typeNext = () => {

      if (cancelled) {
        return;
      }

      if (index >= text.length) {

        setCanAdvance(true);

        if (onTypingComplete) {
          onTypingComplete();
        }

        return;
      }

      setDisplayedText(text.slice(0, index + 1));

      index++;

      setTimeout(typeNext, speed);
    };

    typeNext();


    return () => {
      cancelled = true;
    };

  }, [text, speed]);


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

      <p>
        {displayedText}

        {canAdvance && showTriangle && (
          <span className="continue-triangle">
            ▼
          </span>
        )}
      </p>

    </div>
  );
};

export default TypeWriter;
