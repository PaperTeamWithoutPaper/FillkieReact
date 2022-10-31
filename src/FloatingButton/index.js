import { useState } from 'react'
import DescComponent from '../DescComponent.js/index.js'
import './FloatingButton.scss'
const FloatingButton=()=>
{
    const onmouseover=()=>
    {
        setDesc(1)
    }
    const onmouseleave=()=>
    {
        setDesc(0)
    }
    const [desc,setDesc]=useState(0)
    return(
        <div>
            {desc?<DescComponent></DescComponent>:null}
            <div onClick={()=>{window.open('https://docs.google.com/forms/d/e/1FAIpQLSeWqW_bzl1nXEISIf-tOxJhMGPlVqAI2nfXfW7fFXcO_Ov2nQ/viewform','_blank')}} onMouseOver={onmouseover} onMouseLeave={onmouseleave} className="FloatingButton-body">
                <img className="FloatingButton-body-icon" src={require('./Icon/form.png')}></img>
            </div>
        </div>
    )
}
export default FloatingButton