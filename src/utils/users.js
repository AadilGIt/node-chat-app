const users = []

const adduser = ({id,username,room}) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!username || !room){
        return {
            error:'username and room is required'
        }
    }

    const existinguser = users.find((user) => {
        return user.room === room && user.username === username
    })

    if(existinguser){
        return{
            error:'username alreaddy in use'
        }
    }

    const user = { id,username,room}
    users.push(user)
    return{user}
}

const removeuser = (id) => {
    const index = users.findIndex((user) =>{ 
        return user.id === id
    })
    if(index !== -1){
        return users.splice(index,1)[0]
    }
}

const u =  adduser({
    id:22,
    username:'Aadil',
    room:'mumbra'
})

// console.log(u)
const getuser = (id) => {
    return users.find((user) => user.id === id)
}
const getuserinroom = (room) =>{
    return users.filter((user) => user.room ===room)
}

// console.log(getuser(22))
console.log(getuserinroom('mumbra'))

module.exports= {
    adduser,
    removeuser,
    getuser,
    getuserinroom
}