import '../styles/SettingsWindow.css';

const SettingsWindow = ({ selectOption = () => {} }) => {
    return (
        <div className="SettingsWindow">
            <div className="header">
                <p className="body">הגדרות</p>
            </div>
            <div className="options">
                <div className="option clickable" onClick={() => selectOption('home')}>
                    <p className="small">חזרה לעמוד הביית</p>
                </div>
                <div className="option clickable" onClick={() => selectOption('chapter')}>
                    <p className="small">בחירת פרק</p>
                </div>
                <div className="option clickable" onClick={() => selectOption('exit')}>
                    <p className="small">יציאה</p>
                </div>
            </div>
        </div>
)}

export default SettingsWindow;