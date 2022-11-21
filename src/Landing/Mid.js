import './Upper.scss'
import CircleCard from './Card/CircleCard'
import RectCard from './Card/RectCard'
import {useMediaQuery} from 'react-responsive'
import Fade from 'react-reveal/Fade';
const Mid=()=>
{
    const resp= useMediaQuery({ query: '(max-width: 1400px)' })
    const resp2= useMediaQuery({ query: '(max-width: 600px)' })
    return(
        <div className="Mid-container">
        <div className="Mid-bg">
        <Fade down>
            <div className="Mid-title" >
                Our Goal
            </div>
            <div className="Mid-desc">
            to develop Fillkie as a personal service, your feedbacks will be operated in no time. your feedbacks will be operated in no time and will be able to use Fillkie like a personal service!
            </div>
        </Fade>
            <div className={!resp2?"Mid-Cardbox-small-1x4":'Mid-Cardbox-small-2x2'}>
                <CircleCard title='Faster' desc='faster' delay={0}></CircleCard>
                <CircleCard title='Easier' desc='easier'delay={200}></CircleCard>
                <CircleCard title='Security' desc='secure'delay={400}></CircleCard>
                <CircleCard title='Free' desc='free'delay={600}></CircleCard>
            </div>
        </div>
        

        <div className="Mid-bg">
        <Fade down>
            <div className="Mid-title" style={{paddingTop:'100px', paddingBottom:'50px'}}>
                Coded Pages
            </div>
            </Fade>
       
            <div className={!resp?"Mid-Cardbox-2x2":"Mid-Cardbox-4x1"}>
                <RectCard delay={0} title="Main" imgsrc="./assets/main.png"  desc='text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset.'>
                </RectCard>
                <RectCard delay={200} title="Manage" imgsrc="./assets/permission.png" desc='text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset.'>
                </RectCard>
                <RectCard delay={400} title="Drive" imgsrc="./assets/drive.png" desc='text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset.'>
                </RectCard>
                <RectCard delay={600} title="Note" imgsrc="./assets/edit.png" desc='text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset.'>
                </RectCard>
            </div>
        </div>


    </div>
    )
}
export default Mid