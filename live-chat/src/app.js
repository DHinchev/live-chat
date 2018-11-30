import React from 'react';
import GetUserName from './components/get-user-name';
import Chat from './components/chat';

class App extends React.Component {
    
  constructor() {
      super();
      this.state = {
          currentUsername: '',
          visibleScreen: 'getUsernameScreen'
      };

      this.onUsernameSubmitted = this.onUsernameSubmitted.bind(this);
  } 


  onUsernameSubmitted(username) {
    const regEx = new RegExp("^(?![A-Za-z]{2}_)[A-Za-z0-9_]{3,16}$");
    if(username && regEx.test(username)) {
    fetch('http://localhost:3001/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    })
      .then(response => {
        this.setState({
          currentUsername: username,
          visibleScreen: 'chat'
        });
      })
      .catch(error => console.error('error', error));
    }
  }
  
  render() {
    if (this.state.visibleScreen === 'getUsernameScreen') {
        return (
            <div className="signIn">
                <GetUserName onSubmit={this.onUsernameSubmitted} />
            </div>
        );
    }

    if (this.state.visibleScreen === 'chat') {
        return (
            <div className='app'>
                <Chat currentUsername={this.state.currentUsername} />
            </div>
        );
    }
  }
}

export default App;