import React, { Component } from 'react';

class WhosOnlineListItem extends Component {
  render() {
    return (
      <li className={this.props.presenceState}>
        {this.props.children} <span>{this.props.presenceState}</span>
      </li>
    )
  }
}

export default WhosOnlineListItem;