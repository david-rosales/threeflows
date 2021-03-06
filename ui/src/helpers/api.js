/* @flow weak */
import _ from 'lodash';
import superagent from 'superagent';
import * as Routes from '../routes.js';
import SuperagentPromise from 'superagent-promise';
const request = SuperagentPromise(superagent, Promise);


export function logEvaluation(type, record) {
  const app = 'threeflows';
  const version = 1;

  request
    .post(Routes.evaluationPath({
      app: app,
      type: type,
      version: 1
    }))
    .set('Content-Type', 'application/json')
    .send(record)
    .end();

  return {
    app,
    version,
    type,
    json: record
  };
}

// For now, this fires and forgets and does not retry or
// notify the user on success or failure.
export function logEvidence(type, record) {
  request
    .post(Routes.evidencePath({
      app: 'threeflows',
      type: type,
      version: 2
    }))
    .set('Content-Type', 'application/json')
    .send(record)
    .end();
}

export function evidenceQuery() {
  return request
    .get('/server/evidence')
    .set('Content-Type', 'application/json');
}

export function evaluationsQuery() {
  return request
    .get('/server/evaluations')
    .set('Content-Type', 'application/json');
}

// Query both endpoints and join inefficently in the browser
export function evaluationsWithEvidenceQuery() {
  return Promise.all([
    evaluationsQuery(),
    evidenceQuery()
  ]).then(joinEvaluationsWithEvidence);
}

function joinEvaluationsWithEvidence([evaluationsResponse, evidenceResponse]) {
  const evaluations = JSON.parse(evaluationsResponse.text).rows;
  const logs = JSON.parse(evidenceResponse.text).rows;
  return evaluations.map((evaluation) => {
    const log = _.find(logs, log => log.id.toString() === evaluation.json.logId.toString());
    return {...evaluation, log};
  });
}

//Query for questions
export function questionsQuery() {
  return request
    .get('/server/questions')
    .set('Content-Type', 'application/json');
}

export function saveQuestions(questions) {
  request
    .post('/server/questions')
    .set('Content-Type', 'application/json')
    .send(questions)
    .end();
}