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
import { regionData } from "../data_files/regionData.js";

const RegionSelection = ({ onSelectRegion }) => {

    const { state, dispatch } = useGameState()
    const [chosenRegion, setChosenRegion] = useState();

    return (
        <div className={`RegionSelection ${state.theme}`}>
            {chosenRegion &&
            <img
                className="back-arrow clickable"
                src={`./General/Back Arrow-${state.theme}.png`}
                onClick={() => {setChosenRegion(null)}}
            />
            }

            {!chosenRegion && 
            <div className="title-group">
                <p className={`title H2 ${state.theme}`}>בחר את האזור המבצעי</p>
                <p className={`sub-title body ${state.theme}`}>
                    האזור שתבחר יקבע את מפת הסימולציה, סוג האיומים והכלים
                </p>
            </div>
            }

            {chosenRegion && 
            <div>

            </div>
            }

            {!chosenRegion && 
                <div className="tags">
                    {Object.keys(regionData).reverse().map(region =>
                        <div className="tag-group" key={region}>
                            <p className={`tag-name body-bold ${state.theme}`}>
                                {region}
                            </p>
                            <img
                                className="tag clickable"
                                src={`/Tutorial/${region}.png`}
                                onClick={() => {setChosenRegion(region)}}
                            />
                        </div>
                    )}
                </div>
            }

            {chosenRegion && 
                <div className='chosen-region'>
                    <div className="chosen-tag-group">
                        <p className={`chosen-tag-name body-bold ${state.theme}`}>{chosenRegion}</p>
                        <img
                        className="chosen-tag"
                        src={`/Tutorial/${chosenRegion}.png`}
                        />
                    </div>
                    <div className="region-details">
                        <div className="features">
                            <div className="feature">
                                <img src={`${regionData[chosenRegion].land.imageSrc}`}/>
                                <p className="body-bold feature-name">שטח מאפיין</p>
                                <p className="small feature-details">{regionData[chosenRegion].land.text}</p>
                            </div>
                            <div className="feature">
                                <img src="/Tutorial/Density.png"/>
                                <p className="body-bold feature-name">צפיפות</p>
                                <p className="small feature-details">{regionData[chosenRegion].density.text}</p>
                            </div>
                            <div className="feature">
                                <img src="/Tutorial/City.png"/>
                                <p className="body-bold feature-name">עירים</p>
                                <p className="small feature-details">{regionData[chosenRegion].cities.text}</p>
                            </div>
                        </div>
                    </div>
                </div>}
        </div>
    )
}

export default RegionSelection;