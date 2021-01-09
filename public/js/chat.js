const socket = io()

const $form = document.querySelector('#formwa')
const $input = $form.querySelector('input')
const $button = $form.querySelector('button')
const $message = document.querySelector('#message')
const $mesTemplate = document.querySelector('#message-tempalate').innerHTML
const $locTemplate = document.querySelector('#location-tempalate').innerHTML
const sidebar = document.querySelector('#sidebar').innerHTML

const { username,room} = Qs.parse(location.search,{ ignoreQueryPrefix:true})

const autoscroll = () => {
    const newmessage = $message.lastElementChild
    const newstyle = getComputedStyle(newmessage)
    const newmessageheight = newmessage.offsetHeight + 16

    // console.log(newstyle)
    const visibleheight = $message.offsetHeight
    const containerheight = $message.scrollHeight
    const scroll = $message.scrollTop + visibleheight
    if(containerheight - newmessageheight <= scroll){
        $message.scrollTop = $message.scrollHeight
    }
}

socket.on('message',(message) =>{
    console.log(message)
    const html =  Mustache.render($mesTemplate,{
        username:message.username,
        message: message.text,
        createdAt:moment(message.createdAt).format("ddd - h:mmA")
    })
    $message.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('sendLoca',(message) =>{
     console.log(message)
     const html = Mustache.render($locTemplate,{
         username:message.username,
         message:message.link,
         createdAt:moment(message.createdAt).format("ddd - h:mmA")
     })
     $message.insertAdjacentHTML('beforeend',html)
     autoscroll()
})

document.querySelector('#formwa').addEventListener('submit', (e) => {
    // console.log('clicked')
    e.preventDefault()

    $button.setAttribute('disabled','disabled')

    const message = e.target.elements.message.value
    socket.emit('increment',message,(error) => {
        $button.removeAttribute('disabled')
        $input.value = ''
        $input.focus()
        // console.log($input)
        if(error){
        return console.log(error)
    }
        console.log('message delivered')
    })
})

socket.on('roomData',({room,users}) =>{ 
    const html = Mustache.render(sidebar,{
        room,
        users
    })
    document.querySelector('#sideber').innerHTML = html
})

document.querySelector('#location').addEventListener('click', () => {
    if(!navigator.geolocation){
        alert('geolocation sharing not supported')
    }

    document.querySelector('#location').setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position) =>{
        //console.log(position)
        socket.emit('location',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        },() => {
            console.log('location shared')
            document.querySelector('#location').removeAttribute('disabled')
        })
    })
})

socket.emit('join',{username,room}, (error) => {
    if(error){
        alert(error)
        location.href = '/'
    }
})