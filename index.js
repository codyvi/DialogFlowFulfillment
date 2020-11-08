// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  
  function ReservaHandler(agent){
    const sintoma = agent.parameters.Sintoma; 
   	const fecha = agent.parameters.date;
    const doctor = agent.parameters.doctor;
    agent.add(`Su cita con el doctor ${doctor} por el ${sintoma} el ${fecha} ha sido creada y confirmada.`);
   
  }

  function faqsHandler(agent){
    const pregunta = agent.parameters.Preguntas;
    let response = 'Perdón esa pregunta no se encuentra';
    switch(pregunta){
    case '¿Qué doctores hay?':
        response = 'Actualmente estan el doctor José, Benjamin y la doctora Victoria.';
        break;
    case '¿Que tipo de doctores hay?':
        response = 'Hay doctores para consulta general, nutriologia y traumatologia.';
        break;
    case 'A que hora cierran':
        response = 'El horario es de 8 am a 6 pm';
        break;
    case '¿Cuanto sale la consulta?':
        response = 'El precio de la cita depende del tipo de cita';
        break;
    default:
        response = 'Perdón esa pregunta no se encuentra';
}
    agent.add(response);
  }
  
  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('PreguntasFrecuentes', faqsHandler);
  intentMap.set('ReservaCita', ReservaHandler);
  agent.handleRequest(intentMap);
});
