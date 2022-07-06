import Login_browser from "./Login/Login_browser"
import {Routes, Route} from 'react-router-dom'
import MainComponent from "./main/MainComponent"
import Login_api from "./Login/Login_api"
import Appbar from './Appbar/Appbar'
import './App.css'
const App=()=>
{
  return (
    <div style={{backgroundColor:'rgb(248,248,248)'}}>
    <Routes>
      <Route path="/login" element={<Login_browser></Login_browser>}/>
      <Route path="/main" element={<MainComponent></MainComponent>}/>
      <Route path="/loginapi" element={<Login_api></Login_api>}/>

    </Routes>
    
    </div>
  )
}
export default App
const styles={
  container:{
  }
}