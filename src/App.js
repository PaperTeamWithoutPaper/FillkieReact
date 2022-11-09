import Login_browser from "./Login/Login_browser"
import {Routes, Route} from 'react-router-dom'
import MainComponent from "./main/MainComponent"
import Login_api from "./Login/Login_api"
import Appbar from './Appbar/Appbar'
import './App.css'
import Alarm from "./Modal/Alarm"
import InviteComponent from "./Invite/InviteComponent"
import LoaderComponent from "./FileLoader/LoaderComponent"
import InviteErrorComponent from "./Invite/InviteErrorComponent"
import DocLoader from "./Editor"
import Loading from "./Loading/Loading"
import PermissionComponent from "./Permission"
import FileUpload from "./FIleUpload"
import WelcomeComponent from './WelcomeComponent'
//import DocLoader from "./Editor"
const App=()=>
{
  return (
    <div >
    <Routes>
      <Route path="/" element={<WelcomeComponent></WelcomeComponent>}/>
      <Route path="/hello" element={<Login_browser></Login_browser>}/>
      <Route path="/mains" element={<MainComponent></MainComponent>}/>
      <Route path="/loginapi" element={<Login_api></Login_api>}/>
      <Route exact path="/meeting/:docKey" element={<DocLoader></DocLoader>}/>
      <Route exact path="/welcome/:id" element={<InviteComponent></InviteComponent>}/>
      <Route exact path="/welcome/error" element={<InviteErrorComponent></InviteErrorComponent>}/>
      <Route exact path="/board/:id/:pid" element={<LoaderComponent></LoaderComponent>}/>
      <Route exact path="/permission/:teamId" element={<PermissionComponent></PermissionComponent>}/>
      <Route exact path="/load" element={<FileUpload></FileUpload>}/>
    </Routes>
    </div>
  )
}
export default App