import "../styles/PopUp.css";

const PopUp = ({ content = null, onClose, attention }) => {
    return (
        <div className={`PopUp ${attention ? 'attention' : ''}`}>
            <img src="/General/closebutton.png" className="close-button clickable" alt="Close"/>
            <span className="PopUpCorner topLeft"></span>
            <span className="PopUpCorner topRight"></span>
            <span className="PopUpCorner bottomLeft"></span>
            <span className="PopUpCorner bottomRight"></span>

            {attention == null && content}
            {attention && (
                <div className="attention-container">
                    <img src="/General/attention-icon.png" className="attention-icon" alt="Attention"/>
                    <p className="attention-text H3">שימו לב זה מידע מעודכן</p>
                </div>
            )}
        </div>
    );
};

export default PopUp;