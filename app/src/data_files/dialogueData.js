import { useGameState } from '../components/GameState.jsx';

export const dialogueData = {
    "chapter_1": {
        "dialogue_1" : {
            text : "שלום, וברוך הבא ללומדה"
        },
        "dialogue_2" : {
            text : "בלומדה הזאתי נעבור על 9 שלבי טכניקת פיקוד על זירת אירוע",
            onEnter: {type: 'SET_FLAG', key: 'event', value: 'tutorial_1'}
        },
        "dialogue_3" : {
            text : "אפשר יהיה לעבור שוב על השלבים דרך התפריט",
            onEnter: {type: 'SET_FLAG', key: 'event', value: 'tutorial_2'},
        }
    } 
}