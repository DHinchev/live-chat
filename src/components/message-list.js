import React from 'react';
import ReactDom from 'react-dom';
import Message from './message';

class MessageList extends React.Component {

    componentWillUpdate() {
        const node = ReactDom.findDOMNode(this);
        this.shouldScrillToBottom = node.scrollTop + node.clientHeight +100 >= node.scrollHeight;
    }

    componentDidUpdate() {
        if(this.shouldScrillToBottom) {
            const node = ReactDom.findDOMNode(this);
            node.scrollTop = node.scrollHeight;
        }
    }

    render() {
        if(!this.props.roomId){
            return (
                <div className="message-list">
                    <div className="join-room">
                        &larr; Join a room!
                    </div>
                </div>
            )
        }
        return (
            <div className="message-list">
                {this.props.messages.map((message, index) => {
                    return (
                        <Message key={message.id} username={message.senderId} text={message.text} />
                    )
                })}
            </div>
        )
    }
}

export default MessageList