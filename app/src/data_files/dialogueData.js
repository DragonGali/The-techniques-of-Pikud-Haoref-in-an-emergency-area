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
        },
        "dialogue_4" : {
            text: 'החלונית הזאתי נפתחת ואוצרת את המשחק ברגעים שצריך להסביר קצת יותר',
            onEnter: {type: 'SET_FLAG', key: 'event', value: 'tutorial_3'},
        },
        "dialogue_5" : {
            text: 'שימו לב, עם מידע כלשהוא הוא מעודכן, אתם תראו את החלונית הזאתי.',
            onEnter: {type: 'SET_FLAG', key: 'event', value: 'tutorial_4'},
        },
        "dialogue_6" : {
            text: 'לפני שנתחיל, צריך לבחור את המחוז שבוא הלומדה תתרחש, זה ישפיע על התנאים באזור.',
            onEnter: {type: 'SET_FLAG', key: 'event', value: null},
            next: null
        }
    } 
}