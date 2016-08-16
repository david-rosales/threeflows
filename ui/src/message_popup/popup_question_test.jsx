import React from 'react';
import _ from 'lodash';

import {shallow} from 'enzyme';
import sinon from 'sinon';
import {expect} from 'chai';
import {allQuestions} from './questions.js';
import {withStudents} from './transformations.jsx';

import PopupQuestion from './popup_question.jsx';
import SummaryCard from './summary_card.jsx';
import ScenarioRenderer from './renderers/scenario_renderer.jsx';
import PromptsRenderer from './renderers/prompts_renderer.jsx';
import ResponseRenderer from './renderers/response_renderer.jsx';

const helpers = {
  testQuestion: _.first(withStudents(allQuestions)),
  practiceScaffolding: {
    helpType: 'feedback',
    shouldShowStudentCard: true,
    shouldShowSummary: true
  },
  solutionScaffolding: {
    helpType: 'solution',
    shouldShowStudentCard: true,
    shouldShowSummary: false
  }
};


function testProps(props) {
  const onLogSpy = sinon.spy();
  const onDoneSpy = sinon.spy();

  return {
    question: helpers.testQuestion,
    scaffolding: helpers.practiceScaffolding,
    limitMs: 30000,
    onLog: onLogSpy,
    onDone: onDoneSpy,
    isLastQuestion: false,
    ...props
  };
}


describe('<PopupQuestion />', () => {
  it('renders the question in practice mode', () => {    
    const props = testProps();
    const wrapper = shallow(<PopupQuestion {...props} />);
    expect(wrapper.find(ScenarioRenderer).length).to.equal(1);
    expect(wrapper.find(PromptsRenderer).length).to.equal(1);
    expect(wrapper.find(ResponseRenderer).length).to.equal(1);
    expect(wrapper.find(SummaryCard).length).to.equal(0);
  });

  it('renders the question in solution mode', () => {    
    const props = testProps({ scaffolding: helpers.solutionScaffolding });
    const wrapper = shallow(<PopupQuestion {...props} />);
    expect(wrapper.find(ScenarioRenderer).length).to.equal(1);
    expect(wrapper.find(PromptsRenderer).length).to.equal(1);
    expect(wrapper.find(ResponseRenderer).length).to.equal(1);
    expect(wrapper.find(SummaryCard).length).to.equal(0);
  });
});
