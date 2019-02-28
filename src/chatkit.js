import Chatkit from '@pusher/chatkit-client'

const credentials = {
  url: (id, token) =>
    `http://localhost:3001/token?user=${id}&token=${token}`,
  instanceLocator: 'v1:us1:1114c1ef-c7c0-412a-b93b-48e5becc953b',
}

const { instanceLocator, url } = credentials
export default ({ state, actions }, user) =>{
  return(
    new Chatkit.ChatManager({
      tokenProvider: new Chatkit.TokenProvider({ url: 'http://13.95.65.188/api/getauth',
      queryParams: {
        username: user.data.username,
      },
      headers: {
        SomeHeader: 'some-value',
       
      }
    
    
    }),
      instanceLocator,
      userId: user.data.username,
    })
      .connect({
        onUserStartedTyping: actions.isTyping,
        onUserStoppedTyping: actions.notTyping,
        onAddedToRoom: actions.subscribeToRoom,
        onRemovedFromRoom: actions.removeRoom,
        onPresenceChanged: actions.setUserPresence,
      })
      .then(user => {
        // Subscribe to all rooms the user is a member of
        Promise.all(
          user.rooms.map(room =>
            user.subscribeToRoom({
              roomId: room.id,
              hooks: { onMessage: actions.addMessage },
            })
          )
        ).then(rooms => {
          actions.setUser(user)
          // Join the first room in the users room list
          user.rooms.length > 0 && actions.joinRoom(user.rooms[0])
        })
      })
      .catch(error => console.log('Error on connection', error))
  
  )
}
  