 import React, { Component } from 'react';
    class GetUsername extends Component {
     constructor(props) {
       super(props);
       this.state = {
         username: '',
       };

       this.onSubmit = this.onSubmit.bind(this);
       this.onChange = this.onChange.bind(this);
     }
     
     onSubmit(e) {
       e.preventDefault();
       this.props.onSubmit(this.state.username);
     }

     onChange(e) {
        this.setState({ username: e.target.value });
      }

      render() {
        return (
          <div className="signInContent">
            <div>
              <h2 className="signInTitle">What is your username?</h2>
              <form onSubmit={this.onSubmit}>
                <input
                  type="text"
                  className="signInInput"
                  placeholder="Your full name"
                  onChange={this.onChange}
                />
                <input className="signInSubmitButton" type="submit" />
              </form>
            </div>
          </div>
        )
      }
    }
     export default GetUsername;