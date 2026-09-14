/*
 * =========================
 * Chapter Title
 * =========================
 *
 * Displays the chapter number and name shown inside BlueScreen when
 * direction="close" and type="title" (see BlueScreen.jsx). Pulls the
 * chapter name from chapterData using state.currentChapter, and
 * zero-pads the number below 10 (e.g. "03" instead of "3").
 *
 * Known issue: the divider line currently renders slightly off-center —
 * needs a CSS fix in ChapterTitle.css.
 */

import { useGameState } from './GameState.jsx';
import { chapterData } from '../data_files/chapterData.js'
import '../styles/ChapterTitle.css';

const ChapterTitle = () => {
    const { state } = useGameState();

    const chapter = chapterData[`chapter_${state.currentChapter}`];

    return (
        <div className="ChapterTitle">
            <p className="label small">פרק</p>
            <p className="number">{`${state.currentChapter < 10 ? "0" : ''}${state.currentChapter}`}</p>
            <div className="divider" />
            <p className="name H3">{chapter?.name}</p>
        </div>
    );
};

export default ChapterTitle;