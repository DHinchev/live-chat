import React from 'react';
import Chatkit from '@pusher/chatkit';
import MessageList from './message-list';
import RoomList from './room-list';
import SendMessageForm from './send-message-form';
import NewRoomForm from './new-room-form';
import TypingIndicator from './typingIndicator';
import WhosOnlineList from './who-is-online';
import Close from '../assets/manu-icon.svg';

import { tokenUrl, instanceLocator } from './config';

class Chat extends React.Component {
    
  constructor() {
      super();
      this.state = {
          roomId: null,
          toggleState: false,
          messages: [],
          joinableRooms: [],
          joinedRooms: [],
          usersWhoAreTyping: [],
          users: []
      };

      this.sendMessage = this.sendMessage.bind(this);
      this.subscribeToRoom = this.subscribeToRoom.bind(this);
      this.getRooms = this.getRooms.bind(this);
      this.createRoom = this.createRoom.bind(this);
      this.sendTypingEvent = this.sendTypingEvent.bind(this);
      this.toggleMenu = this.toggleMenu.bind(this);
  } 
  
  componentDidMount() {
      const chatManager = new Chatkit.ChatManager({
          instanceLocator,
          userId: this.props.currentUsername,
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
              },
              onUserStartedTyping: user => {
                this.setState({
                    usersWhoAreTyping: [...this.state.usersWhoAreTyping, user.name],
                });
              },
              onUserStoppedTyping: user => {
                  this.setState({
                      usersWhoAreTyping: this.state.usersWhoAreTyping.filter(
                          username => username !== user.name
                      )
              });
            }
          }
      })
      .then(room => {
          this.setState({
              roomId: room.id,
              users: room.users
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

  sendTypingEvent(event) {
    this.state.currentUser
    .isTypingIn({ roomId: this.state.currentRoom.id })
    .catch(error => console.error('error', error));

    this.setState({ chatInput: event.target.value });
   }

  createRoom(name) {
    this.currentUser.createRoom({
        name
    })
    .then(room => this.subscribeToRoom(room.id))
    .catch(err => console.log('error with createRoom: ', err));
  }

  toggleMenu() {
    this.setState(prevState => ({
        toggleState: !prevState.toggleState
      }));
  }
  
  render() {
      const toggle = this.state.toggleState ? 'show' : 'hide';
        return (
            <div className="chat">
                <img
                    className="toggle-icon"
                    width="35px"
                    height="35px"
                    alt="menu icon"
                    src={Close}
                    onClick={this.toggleMenu}
                />
                <div className={`mobileSlideRight ${toggle}`}>
                    <WhosOnlineList
                        currentUser={this.currentUser}
                        users={this.state.users} />
                    <RoomList
                        roomId={this.state.roomId}
                        subscribeToRoom={this.subscribeToRoom}
                        rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]} />
                    <NewRoomForm 
                        createRoom={this.createRoom} />
                </div>
                <MessageList 
                    messages={this.state.messages}
                    roomId={this.state.roomId} />
                <TypingIndicator usersWhoAreTyping={this.state.usersWhoAreTyping} />
                <SendMessageForm 
                  sendMessage={this.sendMessage}
                  onChange={this.sendTypingEvent}
                  disabled={!this.state.roomId} />
                
            </div>
        );
  }
}

export default Chat;