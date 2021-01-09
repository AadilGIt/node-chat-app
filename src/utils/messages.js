const genrateMessages = (username,text) => {
    return{
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const locationMessages = (username,link) => {
    return{
        username,
        link,
        createdAt:new Date().getTime()
    }
}

module.exports = {
    genrateMessages,
    locationMessages
}