/*
 * -------------------------
 * Different types of data
 * -------------------------
 *
 * Not all text/content in the game needs to use this same data
 * structure.
 *
 * `dialogueData` is specifically for character dialogue and works
 * around a sequence of dialogue entries that can trigger events and
 * control the flow of the game.
 *
 * Other types of content may need their own data files because they
 * work differently.
 *
 * For example, the manual is not a dialogue sequence. It is a larger
 * collection of informational text that the player reads and navigates
 * through, so it should have its own data structure and data file.
 *
 * The same principle can be used for other systems if their data
 * behaves differently from dialogue.
 *
 * Do not try to force every type of game content into `dialogueData`
 * just to keep everything in one file. Each system should have a data
 * structure that fits the way that system actually works.
 *
 * For example:
 *
 *     dialogueData.js
 *         → Character dialogue and dialogue flow
 *
 *     manualData.js
 *         → Manual/instructional content
 *
 *     taskData.js
 *         → Task-specific information and configuration
 *
 * The components that display these systems should then handle the
 * appropriate data format.
 */

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