import { useEffect } from 'react'
import './DescComponent.scss'
const DescComponent=({x,y})=>
{
    useEffect(()=>{console.log(x,y)},[x,y])
    return(
        <div className="DescComponent-body">
            <div className="DescComponent-body-title">
            💡설문조사를 진행중입니다💡
            </div>
            <div className="DescComponent-body-desc">
                버튼을 누르시면 구글폼으로 이동합니다. 추첨을 통해 🎁기프티콘🎁을 드리니 많은 참여 바랍니다! 
            </div>

        </div>
    )
}
export default DescComponent