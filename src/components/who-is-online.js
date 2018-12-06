import React, { Component } from 'react';
import WhosOnlineListItem from './who-is-online-list';

class WhosOnlineList extends Component {
  renderUsers() {
    return (
        <ul>
          {this.props.users.map((user, index) => {
            if (user.id === this.props.currentUser.id) {
              return (
                <WhosOnlineListItem key={index} presenceState="online">
                  {user.name} (You)
                </WhosOnlineListItem>
              )
            }
            return (
              <WhosOnlineListItem key={index} presenceState={user.presence.state}>
                {user.name}
              </WhosOnlineListItem>
            )
          })}
        </ul>
    )
  }

  render() {
    if (this.props.users) {
      return (
        <div className="people-online-list">
          <h3>People online:</h3>
          {this.renderUsers()}
        </div>);
    } else {
      return <p>Loading...</p>
    }
  }
}

export default WhosOnlineList;