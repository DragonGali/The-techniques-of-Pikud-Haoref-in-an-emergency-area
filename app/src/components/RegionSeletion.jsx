import "../styles/RegionSelection.css"
import { useState } from "react";
import { useGameState } from './GameState.jsx';

const RegionSelection = ({ onSelectRegion }) => {

    const { state, dispatch } = useGameState()
    const regions = ["מחוז צפון", "מחוז חיפה", "מחוז דן", "מחוז ירושלים", "מחוז הדרום"]

    const [chosenRegion, setChosenRegion] = useState();

    return (
        <div className={`RegionSelection ${state.theme}`}>
            <img className="back-arrow clickable" src={`./General/Back Arrow-${state.theme}.png`}/>
            <div className="title-group">
                <p className="title H2">בחר את האזור המבצעי</p>
                <p className="sub-title body">האזור שתבחר יקבע את מפת הסימולציה, סוג האיומים והכלים</p>
            </div>
            <div className="tags">
                {regions.reverse().map(region => 
                    <div className="tag-group">
                        <p className="tag-name body-bold ">{region}</p>
                        <img className="tag clickable" src={`/Tutorial/${region}.png`}></img>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RegionSelection;