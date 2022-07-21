
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector("#send-location")
const $messages = document.querySelector("#messages")

//template
const messageTemplate = document.querySelector("#message-template").innerHTML



const socket = io();
socket.on('message',(message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate,{
             message:message
    });
    $messages.insertAdjacentHTML('beforeend',html);


})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    $messageFormButton.setAttribute('disabled','disabled');
    let message = e.target.message.value;


    socket.emit('messagefromclient',message,(error)=>{
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value=''
        $messageFormInput.focus();
        if(error){
           return console.log(error);
        }
     
        console.log("the Message is delievered")
     
    });

})


$sendLocationButton.addEventListener('click',()=>{
     if(!navigator.geolocation){
       window.alert("Browser does not support geolocation")
     }
  navigator.geolocation.getCurrentPosition((position)=>{
     
      let geoData = {
          lat : position.coords.latitude,
          long : position.coords.longitude
      }
      $sendLocationButton.setAttribute('diabled','disabled');
     socket.emit("sendLocation",geoData,()=>{
         $sendLocationButton.removeAttribute('diabled');
         console.log("Loction Shared")
     });
       
  })

  
 

})