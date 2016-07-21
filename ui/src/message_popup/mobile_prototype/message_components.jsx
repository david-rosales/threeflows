/* @flow weak */
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';

import FaceIcon from 'material-ui/svg-icons/action/face';
import InfoOutlineIcon from 'material-ui/svg-icons/action/info-outline';

const Message = React.createClass({
  propTypes: {
    type: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
    messageStyle: React.PropTypes.object.isRequired,
    messageTextStyle: React.PropTypes.object.isRequired,
    label: React.PropTypes.string,
    onOpenDialog: React.PropTypes.func
  },
  
  componentDidMount(){ 
    ReactDOM.findDOMNode(this).scrollIntoView(); 
  },
  
  render(){
    const {type, messageStyle, messageTextStyle} = this.props;
    
    return (
      <div style={messageStyle}>
        { type === 'student' && 
          <IconButton 
            onTouchTap={this.props.onOpenDialog} 
            style={styles.messageIconButton} 
            iconStyle={styles.messageIcon}>
            <FaceIcon/>
          </IconButton>
        }
        { type === 'info' && 
          <IconButton 
            onTouchTap={this.props.onOpenDialog}
            style={styles.messageIconButton}
            iconStyle={styles.messageIcon}>
            <InfoOutlineIcon/>
          </IconButton>
        }
        <div style={styles.messageTextSection}>
          {this.props.label !== undefined && 
            <div style={_.merge(type === 'user' ? {textAlign: 'right'} : {textAlign: 'left'}, {...messageTextStyle, ...styles.label})}>
              {this.props.label}
            </div>
          }
          <Paper style={messageTextStyle}>{this.props.text}</Paper>
          
        </div>

        { type === 'user' && 
          <FaceIcon  style={styles.messageIcon}/> 
        }
      </div>
    );
  }
});

export const StudentMessage = React.createClass({
  propTypes: {
    text: React.PropTypes.string.isRequired,
    student: React.PropTypes.object.isRequired,
    onOpenStudentDialog: React.PropTypes.func.isRequired
  },
  
  render(){
    const messageStyle = _.merge({justifyContent: 'flex-start'}, styles.message);
    const messageTextStyle = _.merge({backgroundColor: '#f1c889'}, styles.messageText);
    
    return (
      <div>
        <Message 
          type="student"
          text={this.props.text}
          label={this.props.student.name}
          messageStyle={messageStyle}
          messageTextStyle={messageTextStyle}
          onOpenDialog={this.props.onOpenStudentDialog}
          />
      </div>
    );
  }
});

export const UserMessage = React.createClass({
  propTypes: {
    text: React.PropTypes.string.isRequired,
    label: React.PropTypes.string
  },

  
  render(){
    const messageStyle = _.merge({justifyContent: 'flex-end'}, styles.message);
    const messageTextStyle = _.merge({backgroundColor: '#e6f9ff'}, styles.messageText);
    
    return (
      <div>
        <Message 
          type="user"
          text={this.props.text}
          label={this.props.label === undefined ? 'You' : this.props.label}
          messageStyle={messageStyle}
          messageTextStyle={messageTextStyle}
          />
      </div>
    );
  }
});

export const InfoMessage = React.createClass({
  propTypes: {
    text: React.PropTypes.string.isRequired,
    onOpenInfoDialog: React.PropTypes.func.isRequired
  },
  
  render(){
    const messageStyle = _.merge({justifyContent: 'flex-start'}, styles.message);
    const messageTextStyle = styles.messageText;
    
    return (
      <div>
        <Message 
          type="info"
          text={this.props.text}
          messageStyle={messageStyle}
          messageTextStyle={messageTextStyle}
          onOpenDialog={this.props.onOpenInfoDialog}
          />
      </div>
    );
  }
});

const styles = {
  message: {
    display: 'flex',
    padding: 5
  },
  messageIconButton: {
    margin: 0,
    padding: 0,
    flexGrow: 0,
    flexShrink: 0,
    flexBasis:30
  },
  messageIcon: {
    width: 30,
    height: 30,
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 30,
    padding: 0,
    margin: 5
  },
  messageTextSection: {
    //padding: 10,
    margin: 5,
    flexGrow: 0,
    flexShrink: 1
  },
  messageText: {
    padding: 10,
    //margin: 5,
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    wordBreak: 'break-word',
    //flexGrow: 0,
    //flexShrink: 1
  },
  label: {
    margin:5,
    fontSize: 12,
    padding: 0,
    backgroundColor: undefined,
  }
};