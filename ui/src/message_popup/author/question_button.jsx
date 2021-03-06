/* @flow weak */
import React from 'react';

import {withIndicator} from '../transformations.jsx';
import * as Routes from '../../routes.js';

import {ListItem} from 'material-ui/List';

import SchoolIcon from 'material-ui/svg-icons/social/school';

export default React.createClass({
  displayName: 'QuestionButton',

  propTypes: {
    question: React.PropTypes.object.isRequired
  }, 

  onItemClicked(){
    Routes.navigate(Routes.messagePopupAuthorQuestionsEditPath(this.props.question.id));
  },

  render(){
    const question = withIndicator(this.props.question);
    return (
      <ListItem
        style={{cursor: 'pointer', fontSize: 14}} 
        leftIcon={<SchoolIcon />}
        primaryText={"#" + question.id + " " + question.indicator.text}
        secondaryText={question.text}
        secondaryTextLines={2}
        onTouchTap={this.onItemClicked}
      />
    );
  }
});