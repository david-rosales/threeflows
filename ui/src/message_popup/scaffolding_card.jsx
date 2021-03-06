import React from "react";
import Toggle from 'material-ui/Toggle';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import TextChangeEvent from '../types/dom_types.js';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Slider from 'material-ui/Slider';
import _ from 'lodash';

import {indicators} from '../data/indicators.js';
import {allQuestions} from './questions.js';
import {withStudents, questionsForIndicator} from './transformations.jsx';

const ALL_INDICATORS = -1;

export default React.createClass({
  displayName: "ScaffoldingCard",
  
  propTypes: {
    scaffolding: React.PropTypes.shape({
      helpType: React.PropTypes.string.isRequired,
      shouldShowStudentCard: React.PropTypes.bool.isRequired,
      shouldShowSummary: React.PropTypes.bool.isRequired
    }).isRequired,
    initialEmail: React.PropTypes.string.isRequired,
    query: React.PropTypes.object.isRequired,
    onSessionConfigured: React.PropTypes.func.isRequired
  },
  
  getInitialState(){
    const isSolutionMode = _.has(this.props.query, 'solution');
    return ({
      email: this.props.initialEmail,
      sessionLength: 10,
      scaffolding: {
        helpType: this.props.scaffolding.helpType,
        shouldShowStudentCard: this.props.scaffolding.shouldShowStudentCard,
        shouldShowSummary: this.props.scaffolding.shouldShowSummary,
      },
      selectedIndicatorId: ALL_INDICATORS,
      isSolutionMode,
      responseModeKey: 'mixed'
    });
  },

  getQuestions(selectedIndicatorId){
    var {isSolutionMode} = this.state;
    const questions = (isSolutionMode || selectedIndicatorId === ALL_INDICATORS)
      ? withStudents(allQuestions)
      : questionsForIndicator(selectedIndicatorId);
    return questions;
  },

  // This is not a pure function, it's not idempotent and can include
  // randomness.  It shouldn't be called within render methods.
  drawResponseMode(question, scaffolding) {
    const {responseModeKey} = this.state;
    if (responseModeKey === 'mixed') return Math.random() > 0.5 ? 'audio' : 'text';
    if (responseModeKey === 'text') return 'text';
    if (responseModeKey === 'audio') return 'audio';
  },

  onResponseModeChanged(event, responseModeKey) {
    this.setState({ responseModeKey });
  },

  onSave(){
    const {scaffolding, email, selectedIndicatorId} = this.state;
    const questions = this.getQuestions(selectedIndicatorId);
    const questionsForSession = _.shuffle(questions.slice(0, this.state.sessionLength));
    this.props.onSessionConfigured({
      scaffolding,
      email,
      questionsForSession,
      drawResponseMode: this.drawResponseMode
    });
  },
  
  onIndicatorChanged(event, selectedIndicatorIdText){
    const selectedIndicatorId = _.toInteger(selectedIndicatorIdText);
    const newLength = this.getQuestions(selectedIndicatorId).length;
    var sessionLength = this.state.sessionLength;
    if(sessionLength > newLength){
      sessionLength = newLength;
    }
    this.setState({sessionLength, selectedIndicatorId});
  },
  
  onSliderChange(event, value){
    this.setState({ sessionLength: value });
  },
  
  onStudentCardsToggled(){
    var scaffolding = {...this.state.scaffolding};
    scaffolding.shouldShowStudentCard = !scaffolding.shouldShowStudentCard;
    this.setState({ scaffolding });
  },
  
  onSummaryToggled(){ 
    var scaffolding = {...this.state.scaffolding};
    scaffolding.shouldShowSummary = !scaffolding.shouldShowSummary;
    this.setState({ scaffolding });
  },
  
  onHelpToggled(event, value){
    var scaffolding = {...this.state.scaffolding};
    if (typeof value === 'boolean'){
      scaffolding.helpType = scaffolding.helpType === 'feedback' ? 'none' : 'feedback';
    }else{
      scaffolding.helpType = value;
    }
    this.setState({scaffolding});
  },

  onTextChanged({target:{value}}:TextChangeEvent) {
    this.setState({email: value});
  },
  
  render(){
    const {query} = this.props;
    const {selectedIndicatorId, sessionLength, scaffolding} = this.state;
    const {shouldShowStudentCard, shouldShowSummary, helpType} = scaffolding;
    const questionsLength = this.getQuestions(selectedIndicatorId).length;

    const showSlider = true;
    const showAll = _.has(query, 'all');
    const showStudentCardsToggle = showAll || _.has(query, 'cards') || _.has(query, 'basic');
    const showSummaryToggle = showAll || _.has(query, 'summary');
    const showHelpToggle = showAll || _.has(query, 'feedback') || _.has(query, 'basic');
    const showOriginalHelp = showAll || _.has(query, 'originalHelp');
    const showChooseResponseMode = showAll || _.has(query, 'modes');

    // This is a workaround for a bug in Slider while we wait for https://github.com/callemall/material-ui/pull/4895 to land
    const sliderKey = [questionsLength, selectedIndicatorId].join('-');
    return (
      <div style={styles.container}>
        {this.renderIndicators()}
        
        <Divider />
      
        {showSlider &&
          <div>
            <div style={styles.optionTitle}>Session Length: {sessionLength} {sessionLength===1 ? "question" : "questions"}</div>
            <Slider key={sliderKey} value={sessionLength} min={0} max={questionsLength} step={1} onChange={this.onSliderChange}/>
          </div>
        }

        {showChooseResponseMode && this.renderResponseModeChoice()}
        
        <Divider />
        
        {(showStudentCardsToggle || showHelpToggle || showSummaryToggle || showOriginalHelp) &&
          <div>
            <div style={styles.optionTitle}>Scaffolding</div>
            <div style={_.merge({ padding: 20 }, styles.option)}>
              {showStudentCardsToggle &&
              <Toggle
              label="With student cards"
              labelPosition="right"
              toggled={shouldShowStudentCard}
              onToggle={this.onStudentCardsToggled} />
              }
              {showSummaryToggle &&
              <Toggle
              label="Show summary after each question"
              labelPosition="right"
              toggled={shouldShowSummary}
              onToggle={this.onSummaryToggled}/>
              }
              {showHelpToggle &&
              <Toggle
              label="With feedback and revision"
              labelPosition="right"
              toggled={helpType==='feedback'}
              onToggle={this.onHelpToggled} />
              }
              {(showStudentCardsToggle || showSummaryToggle || showHelpToggle) && showOriginalHelp &&
              <div style={{margin: 10}}><Divider /></div>
              }
              {showOriginalHelp &&
                <RadioButtonGroup name="helpOptions" valueSelected={helpType} onChange={this.onHelpToggled}>
                  <RadioButton value="feedback" label="With feedback and revision"/>
                  <RadioButton value="hints" label="With hints available"/>
                  <RadioButton value="none" label="With no help available"/>
                </RadioButtonGroup>
              }
            </div>
          </div>
        }
        <Divider />

        <TextField
          style={{width: '100%'}}
          underlineShow={false}
          floatingLabelText="What's your email address?"
          value={this.state.email}
          onChange={this.onTextChanged}
          multiLine={true}
          rows={2}/>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-end'}}>
          <RaisedButton
            disabled={this.state.email === ''}
            onTouchTap={this.onSave}
            style={styles.button}
            secondary={true}
            label="Start" />
        </div>  
      </div>
    );
  },

  renderIndicators() {
    const {selectedIndicatorId} = this.state;
    const possibleIndicators = _.uniq(_.map(allQuestions, 'indicatorId')).map((id) => {
      return _.find(indicators, {id});
    });

    return (
      <div>
        <div style={styles.optionTitle}>Practice scenarios:</div>
        <RadioButtonGroup
          name="indica"
          valueSelected={selectedIndicatorId.toString()}
          onChange={this.onIndicatorChanged}
          style={{...styles.option, padding: 20 }}>
          <RadioButton 
            value={ALL_INDICATORS.toString()}
            label="All" />
          {possibleIndicators.map((indicator) => {
            return <RadioButton
                     key={indicator.id}
                     value={indicator.id.toString()}
                     label={indicator.text} />;
          })}
        </RadioButtonGroup>
      </div>
    );
  },

  renderResponseModeChoice() {
    const {responseModeKey} = this.state;
    return (
      <div>
        <div >Response modes:</div>
        <RadioButtonGroup
          name="responseMode"
          valueSelected={responseModeKey}
          style={{...styles.option, padding: 20 }}
          onChange={this.onResponseModeChanged}
        >
          <RadioButton value="mixed" label="Mixed" />
          <RadioButton value="text" label="Text" />
          <RadioButton value="audio" label="Audio" />
        </RadioButtonGroup>
      </div>
    );
  }
});

const styles = {
  container: {
    padding: 20,
    paddingTop: 0,
  },
  option: {
    fontSize: 14
  },
  optionTitle: {
    paddingTop: 20,
    fontSize: 16,
    paddingBottom: 0
  },
  button: {
    marginTop: 20
  }
};