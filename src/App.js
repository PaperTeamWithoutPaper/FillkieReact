import Login_browser from "./Login/Login_browser"
import {Routes, Route} from 'react-router-dom'
import MainComponent from "./main/MainComponent"
import Login_api from "./Login/Login_api"
import Appbar from './Appbar/Appbar'
import './App.css'
import MeetingComponent from "./Painting/MeetingComponents/MeetingComponent"
import Alarm from "./Modal/Alarm"
import InviteComponent from "./Invite/InviteComponent"
import LoaderComponent from "./FileLoader/LoaderComponent"
import InviteErrorComponent from "./Invite/InviteErrorComponent"
const App=()=>
{
  return (
    <div>
    <Routes>
      <Route path="/login" element={<Login_browser></Login_browser>}/>
      <Route path="/main" element={<MainComponent></MainComponent>}/>
      <Route path="/loginapi" element={<Login_api></Login_api>}/>
      <Route path="/" element={<MeetingComponent></MeetingComponent>}/>
      <Route exact path="/welcome/:id" element={<InviteComponent></InviteComponent>}/>
      <Route exact path="/welcome/error" element={<InviteErrorComponent></InviteErrorComponent>}/>
      <Route exact path="/board" element={<LoaderComponent></LoaderComponent>}/>
    </Routes>
    </div>
  )
}
export default App