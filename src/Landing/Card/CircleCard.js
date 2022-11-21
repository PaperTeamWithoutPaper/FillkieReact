import './Card.scss'
import Fade from 'react-reveal/Fade';
const CircleCard=({imgsrc,title,desc,delay})=>
{
    return(
        <div>
            <Fade down
            delay={delay}>
            <div className="CircleCard-img"></div>
            <div className="CircleCard-title">{title}</div>
            <div className="CircleCard-desc">{desc}</div>
            </Fade>
        </div>
    )
}
export default CircleCard