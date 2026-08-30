import '../styles/Title.css'

const Title = () => {

  return (
    <div className="Title">

      <div className="credits-icon">
        <img
          className="credits-icon-normal"
          src="/Title/Credits Icon.png"
        />

        <img
          className="credits-icon-open"
          src="/Title/Credits Icon-Open.png"
        />
      </div>

      <p className="title-text H2">
        טכניקות פיקוד העורף על זירת אירוע
      </p>

    </div>
  )
}

export default Title;