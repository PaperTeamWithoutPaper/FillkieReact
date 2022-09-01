import "./mouse.scss"
const MousePointer=({color,left,top})=>
{
    return(
        <div style={{   
            backgroundColor: color,
            position:'absolute',
            left:left,
            top:top,
            transition: 'all ease 1s'
            }}>
            mouse
        </div>
    )
}
export default MousePointer