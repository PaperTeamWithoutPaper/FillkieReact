import './Upper.scss'
import CircleCard from './Card/CircleCard'
import RectCard from './Card/RectCard'
import {useMediaQuery} from 'react-responsive'
import Fade from 'react-reveal/Fade';
const Mid=()=>
{
    const resp= useMediaQuery({ query: '(max-width: 1400px)' })
    const resp2= useMediaQuery({ query: '(max-width: 1100px)' })
    return(
        <div className="Mid-container">
        <div className="Mid-bg">
        <Fade down>
            <div className="Mid-title" >
                For
            </div>
            <div className="Mid-desc">

            </div>
        </Fade>
            <div className={!resp2?"Mid-Cardbox-small-1x4":'Mid-Cardbox-small-2x2'}>
                <CircleCard imgsrc="./assets/users.png"  title='Meet' desc='Supports whiteboards for non-face-to-face meetings.' delay={0}></CircleCard>
                <CircleCard imgsrc="./assets/class.png" title='Teach' desc='You can use the bidirectional electronic blackboard for class.'delay={200}></CircleCard>
                <CircleCard imgsrc="./assets/notes.png" title='Note' desc='Edit your personal handwriting with someone else.'delay={400}></CircleCard>
                <CircleCard imgsrc="./assets/team.png" title='Team' desc='Take care of the notes for the team, such as study groups'delay={600}></CircleCard>
            </div>
        </div>
        

        <div className="Mid-bg">
        <Fade down>
            <div className="Mid-title" style={{paddingTop:'100px', paddingBottom:'50px'}}>
                Coded Pages
            </div>
            </Fade>
       
            <div className={!resp?"Mid-Cardbox-2x2":"Mid-Cardbox-4x1"}>
                <RectCard delay={0} title="Main" imgsrc="./assets/main.png"  
                desc='Create your own team and invite other team members to the team. Create a project that works with your Google Drive, and feel free to share handwritten materials and files with your team members.'>
                </RectCard>
                <RectCard delay={200} title="Manage" imgsrc="./assets/permission.png" 
                desc='What team members are in the team and you can set the rank of each team member. You can easily set the permissions for each position to access files or manipulate teams with the toggle bar.'>
                </RectCard>
                <RectCard delay={400} title="Drive" imgsrc="./assets/drive.png" 
                desc="This page is linked to the team creator's Google Drive. Allows team members to read and write files on their drives without setting separate permissions. Edit it together using a note file created within the drive.">
                </RectCard>
                <RectCard delay={600} title="Note" imgsrc="./assets/edit.png" 
                desc='Space where you can edit created note files or external pdf with other team members. Take notes or write a text to communicate with your teammates.'>
                </RectCard>
            </div>
        </div>


    </div>
    )
}
export default Mid