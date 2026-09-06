/*
 * =========================
 * RegionSelection
 * =========================
 *
 * This component is intended to display the screen where the player
 * chooses their operational region.
 *
 * The chosen region will determine things such as:
 * - The simulation map
 * - The types of threats
 * - The tools available to the player
 *
 * This component is currently IN PROGRESS and has only been partially
 * implemented.
 *
 * The basic visual structure has been started:
 * - A back button
 * - A title and description
 * - A list of the available regions
 * - Region images/tags
 * - Light/dark theme support
 *
 * `chosenRegion` and `onSelectRegion` are intended for the region
 * selection functionality, but that functionality has not been
 * implemented yet.
 * 
 */

import "../styles/RegionSelection.css"
import { useState } from "react";
import { useGameState } from './GameState.jsx';

const RegionSelection = ({ onSelectRegion }) => {

    const { state, dispatch } = useGameState()
    const regions = ["מחוז צפון", "מחוז חיפה", "מחוז דן", "מחוז ירושלים", "מחוז הדרום"]

    const [chosenRegion, setChosenRegion] = useState();

    return (
        <div className={`RegionSelection ${state.theme}`}>
            <img
                className="back-arrow clickable"
                src={`./General/Back Arrow-${state.theme}.png`}
            />

            <div className="title-group">
                <p className="title H2">בחר את האזור המבצעי</p>
                <p className="sub-title body">
                    האזור שתבחר יקבע את מפת הסימולציה, סוג האיומים והכלים
                </p>
            </div>

            <div className="tags">
                {regions.reverse().map(region =>
                    <div className="tag-group">
                        <p className="tag-name body-bold">{region}</p>
                        <img
                            className="tag clickable"
                            src={`/Tutorial/${region}.png`}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default RegionSelection;