import { useGameState } from './GameState.jsx';
import { chapterData } from '../data_files/chapterData.js'
import '../styles/ChapterTitle.css';

const ChapterTitle = () => {
    const { state } = useGameState();

    const chapter = chapterData[state.currentChapter];

    return (
        <div className="ChapterTitle">
            <p className="label">פרק</p>
            <h1 className="number">{state.currentChapter}</h1>
            <div className="divider" />
            <p className="name">{chapter?.name}</p>
        </div>
    );
};

export default ChapterTitle;