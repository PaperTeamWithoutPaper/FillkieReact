import Upper from './Upper'
import Mid from './Mid'
import Footbar from './Footbar'
import {useEffect, useState} from 'react'

const Landing=()=>
{

    return(
        <div style={{backgroundColor: 'white'}} >
            
            <Upper></Upper>

            <Mid></Mid>
            <Footbar></Footbar>
        </div>
    )
}
export default Landing