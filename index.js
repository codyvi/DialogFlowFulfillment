// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

/* jshint esversion: 8 */

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const fetch = require('node-fetch');
 
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
  
  async function CreateAppointment(doctor, sintoma, fecha, nombre, motivo){
    var id  = nombre;//'5fb5a27610b4214fe4fea919';
    var date = fecha;//'2020-11-16T12:00:00-06:00';
    var tempsint = sintoma;//'Dolor de cabeza';
    var sint = tempsint.toString(); //Convertir arrray de sintoma a string
    var tempdoc = doctor;//'Strange';
    var doc = tempdoc.toString();  //Convertir arrray de doctor a string
    var mot = motivo;//'No aguanto el dolor';

    let url2 = 'https://fastmedexp.herokuapp.com/api/citas/'; //Aqui va la url del metodo post para crear la cita
    let settings2 = {
        method: 'POST',
        body: JSON.stringify({
            paciente: id,
            sintomas: sint,
          	motivoCita: mot,
          	doctor: doc,
          	fecha: date
        }),
        headers: {
            'Content-Type': 'application/json'
        },
    };
	console.log(settings2);
    fetch(url2, settings2)
    .then( response => {
        if ( response.ok ){
            return response.json();
        }

        throw new Error ( response.statusText );
    })
    .then( responseJSON => {

        console.log(responseJSON);
    })
    .catch( err => {
        console.log( err );
    });
}
  

  function ReservaHandler(agent){
    const sintoma = agent.parameters.Sintoma; 
   	const fecha = agent.parameters.date;
    const doctor = agent.parameters.doctor;
    const id = agent.parameters.Id;
    const Motivo = agent.parameters.Motivo;
    agent.add(`Perfecto, la cita para el paciente ${id} con el doctor ${doctor} por el ${sintoma} y el motivo ${Motivo} con fecha ${fecha} ha sido creada y confirmada.`);
    CreateAppointment(doctor, sintoma, fecha, id, Motivo);
   
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
