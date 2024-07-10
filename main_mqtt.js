const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8)

//const host = 'wss://broker.hivemq.com:8000/mqtt'
//const host = 'ws://broker.emqx.io:8084/mqtt'
//const host = 'https://2d75d79d48cc400ba998fe8744c40e5d.s2.eu.hivemq.cloud:8884/'
//9b67a3ecbbe64a838c875ebc8bb6e782.s1.eu.hivemq.cloud
//const host = '189.8.205.50:1883';
const host = 'wss://broker.emqx.io:8084/mqtt'
var start = false;

const options = {
  keepalive: 60,
  clientId: clientId,
  protocolId: 'MQTT',
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  will: {
    topic: 'WillMsg',
    payload: 'Connection Closed abnormally..!',
    qos: 0,
    retain: true
  },
  //username: 'smart40',
  //password: 'SmArT40SeNaI@xYz'
  username: 'labremoto',
  password: 'labremoto2023'
}

console.log('Connecting mqtt client')
//document.getElementById("status").innerHTML = "Conectando...";
const client = mqtt.connect(host, options)

client.on('error', (err) => {
  console.log('Connection error: ', err)
  client.end()
})

client.on('reconnect', () => {
  //document.getElementById("status").innerHTML = "Reconectando...";
  console.log('Reconnecting...')
})

// setup the callbacks
client.on('connect', function () {
    //document.getElementById("status").innerHTML = "Conectado";
    console.log('Connected');
});

// messages
client.on('message', function (topic, message, packet) {
  value = message.toString();

  console.log('Received Message:= ' + value + '\nOn topic:= ' + topic)
  //console.log('Mensagem recebida em tópico desconhecido: ' + topic);
  switch (topic) {
      case 'currentGraph': console.log(value); start = true; drawChart(value); break;
      default: console.log('Mensagem recebida em tópico desconhecido: ' + topic);
    }
})

// subscribe to topics
client.subscribe('kits');
//client.subscribe('bancada');
//client.subscribe('current');
/*client.subscribe('labRemoto/stat_peca_disp');
client.subscribe('labRemoto/stat_robo');
client.subscribe('labRemoto/stat_cor');
client.subscribe('labRemoto/stat_separacao');
client.subscribe('labRemoto/status_geral');
client.subscribe('labRemoto/execution_status');
client.subscribe('labRemoto/program_status');*/

// publish to topic 'labRemoto/estoque'
//client.publish('labRemoto/estoque', '50');

