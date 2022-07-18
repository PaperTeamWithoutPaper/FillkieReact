export function fetchUser(access)
{
  fetch(`https://api.fillkie.com/user/profile`, {
  method: "GET",
  headers: {
      'Content-Type': 'application/json',
      'Authorization': `${access}`,
  }}).then((response)=>{
      response.json().then((d)=>{   
          return [d.data.userName, d.data.userImage]
      })})}
