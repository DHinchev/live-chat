import React, { Component } from 'react';
import Chatkit from '@pusher/chatkit';
import MessageList from './components/message-list';
import GetUserName from './components/get-user-name';
import RoomList from './components/room-list';
import SendMessageForm from './components/send-message-form';
import NewRoomForm from './components/new-room-form';

import { tokenUrl, instanceLocator } from './config';

class App extends React.Component {
    
  constructor() {
      super();
      this.state = {
          roomId: null,
          messages: [],
          joinableRooms: [],
          joinedRooms: [],
          currentUsername: '',
          visibleScreen: 'getUsernameScreen'
      };

      this.sendMessage = this.sendMessage.bind(this);
      this.subscribeToRoom = this.subscribeToRoom.bind(this);
      this.getRooms = this.getRooms.bind(this);
      this.createRoom = this.createRoom.bind(this);
    //   this.onUsernameSubmitted = this.onUsernameSubmitted.bind(this)
  } 
  
  componentDidMount() {
      const chatManager = new Chatkit.ChatManager({
          instanceLocator,
          userId: 'kalabunga',
          tokenProvider: new Chatkit.TokenProvider({
              url: tokenUrl
          })
      });
      
      chatManager.connect()
      .then(currentUser => {
          this.currentUser = currentUser;
          this.getRooms();
      })
      .catch(err => console.log('error on connecting: ', err));
  }
  
  getRooms() {
      console.log(this.currentUser.rooms);
      this.currentUser.getJoinableRooms()
      .then(joinableRooms => {
          this.setState({
              joinableRooms,
              joinedRooms: this.currentUser.rooms
          });
      })
      .catch(err => console.log('error on joinableRooms: ', err));
  }
  
  subscribeToRoom(roomId) {
      this.setState({ messages: [] });
      this.currentUser.subscribeToRoom({
          roomId: roomId,
          hooks: {
              onNewMessage: message => {
                  this.setState({
                      messages: [...this.state.messages, message]
                  });
              }
          }
      })
      .then(room => {
          this.setState({
              roomId: room.id
          });
          this.getRooms();
      })
      .catch(err => console.log('error on subscribing to room: ', err));
  }
  
  sendMessage(text) {
      this.currentUser.sendMessage({
          text,
          roomId: this.state.roomId
      });
  }

  createRoom(name) {
      console.log(this.currentUser);
    this.currentUser.createRoom({
        name
    })
    .then(room => this.subscribeToRoom(room.id))
    .catch(err => console.log('error with createRoom: ', err));
  }

//   onUsernameSubmitted(username) {
//     fetch('http://localhost:3001/users', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ username }),
//     })
//       .then(response => {
//         this.setState({
//           currentUsername: username,
//           visibleScreen: 'chat'
//         });
//       })
//       .catch(error => console.error('error', error));
//   }
  
  render() {
    // if (this.state.visibleScreen === 'getUsernameScreen') {
    //     return (
    //         <div>
    //             <GetUserName onSubmit={this.onUsernameSubmitted} />
    //         </div>
    //     );
    // }

    // if (this.state.visibleScreen === 'chat') {
        return (
            <div className="app">
                <RoomList
                    roomId={this.state.roomId}
                    subscribeToRoom={this.subscribeToRoom}
                    rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]} />
                <MessageList 
                    messages={this.state.messages}
                    roomId={this.state.roomId} />
                <SendMessageForm 
                  sendMessage={this.sendMessage}
                  disabled={!this.state.roomId} />
                <NewRoomForm createRoom={this.createRoom}/>
            </div>
        );
    }
  }
// }

export default App