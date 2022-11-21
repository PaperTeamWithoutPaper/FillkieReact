import Fade from 'react-reveal/Fade';
const RectCard=({desc,imgsrc,title,delay})=>
{
    return (
    <div>
        <Fade down
            delay={delay}>
        <div className="RectCard-grid">
            <img src={require(`${imgsrc}`)} className="RectCard-img"></img>
            <div className="RectCard-descbox">
                <div className="RectCard-title">{title}</div>
                <div className="RectCard-desc">{desc}</div>
            </div>
        </div>
        </Fade>
    </div>
    )
}
export default RectCard