let current_level = null;
const interactions_components = document.getElementById("interactions_components");
const interactive_circuit_breaker = document.getElementById("circuit_breaker");
const interactive_button_1 = document.getElementById("button_1");
const interactive_button_2 = document.getElementById("button_2");
const interactive_led_1 = document.getElementById("img_led_1");
const interactive_led_2 = document.getElementById("img_led_2");
const interactive_led_3 = document.getElementById("img_led_3");
interactions_components.style.visibility = "hidden";

// Adiciona o listener para o evento clique
interactive_circuit_breaker.addEventListener('click', function() {
	toggleCircuitBreak();
	switch(current_level){
		case "level_1": break;
		case "level_2": break;
		case "level_3": if(circuit_breaker.state == "on"){interactive_led_1.src = 'led_off_alpha.png'; interactive_led_2.src = 'led_on_alpha.png'}else{
														interactive_led_1.src = 'led_off_alpha.png'; interactive_led_2.src = 'led_off_alpha.png'}; break;
		case "level_4": if(circuit_breaker.state == "on"){interactive_led_1.src = 'led_off_alpha.png'; interactive_led_2.src = 'led_on_alpha.png'}else{
			interactive_led_1.src = 'led_off_alpha.png'; interactive_led_2.src = 'led_off_alpha.png'}; break;
	}
});

const valores = "-5.13,-0.66,3.33,6.88,10.01,12.74,15.10,17.12,18.81,20.21,21.32,22.17,22.79,23.19,23.40,23.42,23.28,22.99,22.58,22.05,21.42,20.71,19.93,19.10,18.21,17.30,16.36,15.40,14.45,13.50,12.56,11.65,10.76,9.90,9.09,8.32,7.60,6.93,6.31,5.75,5.25,4.80,4.41,4.08,3.80,3.58,3.41,3.28,3.20,3.15,3.14,3.15,3.18,3.23,3.27,3.31,3.33,3.33,3.29,3.20,3.05,2.82,2.51,2.09,1.56";
console.log(valores.length);
//const bufferFromArray = Buffer.from(valores);

// Adiciona o listener para o evento mousedown
interactive_button_1.addEventListener('mousedown', function() {
	//client.publish('bancada', valores);
	client.publish('/25/relay',"relay2_on");
	switch(current_level){
		case "level_1": break;
		case "level_2": button_1.state = "on"; interactive_led_1.src = 'led_on_alpha.png'; interactive_led_2.src = 'led_off_alpha.png'; break;
		case "level_3": if(circuit_breaker.state == "on"){button_1.state = "on"; interactive_led_1.src = 'led_on_alpha.png'; interactive_led_2.src = 'led_off_alpha.png';}else{
						button_1.state = "off"; interactive_led_1.src = 'led_off_alpha.png'; interactive_led_2.src = 'led_off_alpha.png';} break;
		case "level_4": if(circuit_breaker.state == "on"){button_1.state = "on"; interactive_led_1.src = 'led_off_alpha.png'; interactive_led_2.src = 'led_off_alpha.png';
						toggleCircuitBreak()}else{interactive_led_1.src = 'led_off_alpha.png'; interactive_led_2.src = 'led_off_alpha.png';} break;
	}
});

// Adiciona o listener para o evento mousedown
interactive_button_2.addEventListener('mousedown', function() {
	client.publish('/25/relay',"relay3_on");
	button_2.state = "on";
});

// Adiciona o listener para o evento mouseup
interactive_button_1.addEventListener('mouseup', function() {
	//client.publish('bancada', 'button_up');
	client.publish('/25/relay',"relay2_off");
    switch(current_level){
		case "level_1": break;
		case "level_2": button_1.state = "off"; interactive_led_1.src = 'led_off_alpha.png'; interactive_led_2.src = 'led_on_alpha.png'; break;
		case "level_3": if(circuit_breaker.state == "on"){button_1.state = "off"; interactive_led_1.src = 'led_off_alpha.png'; interactive_led_2.src = 'led_on_alpha.png';}else{
			button_1.state = "off"; interactive_led_1.src = 'led_off_alpha.png'; interactive_led_2.src = 'led_off_alpha.png';
		} break;
		case "level_4": break;
	}
});

interactive_button_2.addEventListener('mouseup', function() {
	button_2.state = "off";
	client.publish('/25/relay',"relay3_off");
});

function toggleCircuitBreak(){
	if(interactive_circuit_breaker.textContent == "Disjuntor/On"){
		interactive_circuit_breaker.textContent = "Disjuntor/Off";
		interactive_circuit_breaker.style.backgroundColor = "#DD2244"
		circuit_breaker.state = "off";
		client.publish('/25/relay',"relay1_off");
	}else{
		interactive_circuit_breaker.textContent = "Disjuntor/On";
		interactive_circuit_breaker.style.backgroundColor = "#00DD22"
		circuit_breaker.state = "on";
		client.publish('/25/relay',"relay1_on");
	}
}


class Cable {
	constructor(output_component, output_terminal, input_component, input_terminal, voltage){
		this.output_component = output_component;
		this.output_terminal = output_terminal;
		this.input_component = input_component;
		this.input_terminal = input_terminal;
		this.voltage = voltage;
	};
};

class Component {
	constructor(name,input_pins,output_pins,state){
		this.name = name;
		this.input_pins = input_pins;
		this.output_pins = output_pins;
		this.state = state;
	}
}

class Node {
	constructor(name, input_component, output_component, input_terminal,output_terminal,childrenList, childrenNodes, previousNode){
		this.name = name;
		this.input_component = input_component;
		this.output_component = output_component;
		this.input_terminal = input_terminal;
		this.output_terminal = output_terminal;
		this.childrenList = childrenList;
		this.childrenNodes = childrenNodes;
		this.previousNode = previousNode;
	};
};

class Terminal{
    constructor(name,component,direction,voltage,connectedTo){
        this.name = name;
        this.component = component;
        this.direction = direction;
        this.voltage = voltage;
		this.connectedTo = connectedTo;
    }
}

// Level Correct References
const level_1_reference = [	"power_supply_0V(0V)",
							"power_supply_24V(24V)",
							"led_1_X1(24V)",
							"led_1_X2(0V)"
						];
const level_2_reference = ["power_supply_0V(0V)",
							"power_supply_24V(24V)",
							"led_1_X1(button_1_14)",
							"led_1_X2(0V)",
							"led_2_X1(button_1_12)",
							"led_2_X2(0V)",
							"button_1_11(24V)",
							"button_1_13(24V)",
							"button_1_12(led_2_X1)",
							"button_1_14(led_1_X1)"
						];
const level_3_reference = ["power_supply_0V(0V)",
							"power_supply_24V(24V)",
							"led_1_X1(button_1_14)",
							"led_1_X2(0V)",
							"led_2_X1(button_1_12)",
							"led_2_X2(0V)",
							"button_1_11(button_1_13,circuit_breaker_14)",
							"button_1_13(button_1_11,circuit_breaker_14)",
							"button_1_12(led_2_X1)",
							"button_1_14(led_1_X1)",
							"circuit_breaker_13(24V)",
							"circuit_breaker_14(button_1_11,button_1_13)",
						];

const level_4_reference = ["power_supply_0V(0V)",
							"power_supply_24V(24V)",
							"led_2_X1(button_1_12)",
							"led_2_X2(0V)",
							"button_1_11(button_1_13,circuit_breaker_14)",
							"button_1_13(button_1_11,circuit_breaker_14)",
							"button_1_12(led_2_X1)",
							"button_1_14(0V)",
							"circuit_breaker_13(24V)",
							"circuit_breaker_14(button_1_11,button_1_13)",
						];

// Cables Vector
const cables = [];
let cables_check = [];

// Create Terminals
// Power Supply Module
const power_supply_24V =  new Terminal("24V","power_supply","output","24V",[]);
const power_supply_0V =  new Terminal("0V","power_supply","input","0V",[]);
const power_supply_2R =  new Terminal("2R","power_supply","output","380V",[]);
const power_supply_2S =  new Terminal("2S","power_supply","output","380V",[]);
const power_supply_2T =  new Terminal("2T","power_supply","output","380V",[]);
const power_supply_2N =  new Terminal("2N","power_supply","input","Neutral",[]);
const power_supply_Ground =  new Terminal("Ground","power_supply","input","Ground",[]);
// Button Module
const button_1_11 = new Terminal("11","button_1","bi-directional",null,[]);
const button_1_12 = new Terminal("12","button_1","bi-directional",null,[]);
const button_1_13 = new Terminal("13","button_1","bi-directional",null,[]);
const button_1_14 = new Terminal("14","button_1","bi-directional",null,[]);
const button_1_21 = new Terminal("21","button_1","bi-directional",null,[]);
const button_1_22 = new Terminal("22","button_1","bi-directional",null,[]);
const button_1_23 = new Terminal("23","button_1","bi-directional",null,[]);
const button_1_24 = new Terminal("24","button_1","bi-directional",null,[]);
const button_2_11 = new Terminal("11","button_2","bi-directional",null,[]);
const button_2_12 = new Terminal("12","button_2","bi-directional",null,[]);
const button_2_13 = new Terminal("13","button_2","bi-directional",null,[]);
const button_2_14 = new Terminal("14","button_2","bi-directional",null,[]);
const button_2_21 = new Terminal("21","button_2","bi-directional",null,[]);
const button_2_22 = new Terminal("22","button_2","bi-directional",null,[]);
const button_2_23 = new Terminal("23","button_2","bi-directional",null,[]);
const button_2_24 = new Terminal("24","button_2","bi-directional",null,[]);
// LED Module
const led_1_X1 = new Terminal("X1","led_1","bi-directional",null,[]);
const led_1_X2 = new Terminal("X2","led_1","bi-directional",null,[]);
const led_2_X1 = new Terminal("X1","led_2","bi-directional",null,[]);
const led_2_X2 = new Terminal("X2","led_2","bi-directional",null,[]);
const led_3_X1 = new Terminal("X1","led_3","bi-directional",null,[]);
const led_3_X2 = new Terminal("X2","led_3","bi-directional",null,[]);
// Circuit Breaker Module
const circuit_breaker_1 = new Terminal("1","circuit_breaker","bi-directional",null,[]);
const circuit_breaker_2 = new Terminal("2","circuit_breaker","bi-directional",null,[]);
const circuit_breaker_3 = new Terminal("3","circuit_breaker","bi-directional",null,[]);
const circuit_breaker_4 = new Terminal("4","circuit_breaker","bi-directional",null,[]);
const circuit_breaker_5 = new Terminal("5","circuit_breaker","bi-directional",null,[]);
const circuit_breaker_6 = new Terminal("6","circuit_breaker","bi-directional",null,[]);
const circuit_breaker_13 = new Terminal("13","circuit_breaker","bi-directional",null,[]);
const circuit_breaker_14 = new Terminal("14","circuit_breaker","bi-directional",null,[]);
const circuit_breaker_21 = new Terminal("21","circuit_breaker","bi-directional",null,[]);
const circuit_breaker_22 = new Terminal("22","circuit_breaker","bi-directional",null,[]);

//Pin Lists
const power_supply_pins = ["0V","2N","Ground","24V","2R","2S","2T"];
const power_supply_input_pins = [power_supply_0V,power_supply_2N,power_supply_Ground];
const power_supply_output_pins = [power_supply_24V,power_supply_2R,power_supply_2S,power_supply_2T];
const button_pins = ["11","13","21","23","12","14","22","24"];
const button_1_input_pins = [button_1_11,button_1_13,button_1_21,button_1_23];
const button_1_output_pins = [button_1_12,button_1_14,button_1_22,button_1_24];
const button_2_input_pins = [button_2_11,button_2_13,button_2_21,button_2_23];
const button_2_output_pins = [button_2_12,button_2_14,button_2_22,button_2_24];
const led_pins = ["X1","X2"];
const led_1_input_pins = [led_1_X1];
const led_1_output_pins = [led_1_X2];
const led_2_input_pins = [led_2_X1];
const led_2_output_pins = [led_2_X2];
const led_3_input_pins = [led_3_X1];
const led_3_output_pins = [led_3_X2];
const circuit_breaker_pins = ["1","3","5","13","21","2","4","6","14","22"];
const circuit_breaker_input_pins = [circuit_breaker_1,circuit_breaker_3,circuit_breaker_5,circuit_breaker_13,circuit_breaker_21];
const circuit_breaker_output_pins = [circuit_breaker_2,circuit_breaker_4,circuit_breaker_6,circuit_breaker_14,circuit_breaker_22];

// Component Objects
const power_supply =  new Component("power_supply",power_supply_input_pins,power_supply_output_pins,"off");
const button_1 =  new Component("button_1",button_1_input_pins,button_1_output_pins,"off");
const button_2 =  new Component("button_2",button_2_input_pins,button_2_output_pins,"off");
const led_1 =  new Component("led_1",led_1_input_pins,led_1_output_pins,"off");
const led_2 =  new Component("led_2",led_2_input_pins,led_2_output_pins,"off");
const led_3 =  new Component("led_3",led_3_input_pins,led_3_output_pins,"off");
const circuit_breaker =  new Component("circuit_breaker",circuit_breaker_input_pins,circuit_breaker_output_pins,"off");

// Component Terminals used on the UI
const componentTerminals = {
    power_supply: power_supply_pins,
    led_1: led_pins,
	led_2: led_pins,
	led_3: led_pins,
    button_1: button_pins,
	button_2: button_pins,
	circuit_breaker: circuit_breaker_pins
};

// Atualiza dropdown list na página web em função do componente escolhido
function updateTerminals(componentSelectId, terminalSelectId) {
    const componentSelect = document.getElementById(componentSelectId);
    const terminalSelect = document.getElementById(terminalSelectId);
    const selectedComponent = componentSelect.value;

    // Clear previous options
    terminalSelect.innerHTML = '<option value="">Selecione um terminal</option>';

    // Populate terminals based on selected component
    if (selectedComponent && componentTerminals[selectedComponent]) {
        const terminals = componentTerminals[selectedComponent];
        terminals.forEach(terminal => {
            const option = document.createElement('option');
            option.value = terminal;
            option.textContent = terminal;
            terminalSelect.appendChild(option);
        });
    }
}

// Carrega imagem do esquemático
function loadImage(nivel_select_id){
    const nivelSelect = document.getElementById(nivel_select_id);
	const myImage = document.getElementById("img_esquematico");
	const selectedNivel = nivelSelect.value;

	switch(selectedNivel){
		case "nivel_1": myImage.src = "nivel_1.png"; current_level = "level_1"; break;
		case "nivel_2": myImage.src = "nivel_2.png"; current_level = "level_2"; initializeConnections_2(); break;
		case "nivel_3": myImage.src = "nivel_3.png"; current_level = "level_3"; /*initializeConnections_3();*/ break;
		case "nivel_4":	myImage.src = "nivel_4.png"; current_level = "level_4"; /*initializeConnections_4();*/ break;
	}
}

// Cria o cabo independente da interface (Modo teste)
function createCable(component1, terminal1, component2, terminal2, voltage){
		const connectionsDiv = document.getElementById('connections');
		const connectionElement = document.createElement('p');
		connectionElement.style.fontSize = "12px";

		let new_cable = new Cable(component1, terminal1, component2, terminal2, null);
		cables.push(new_cable);
		cables_check.push(new_cable);
		
		let connectionText = `Conexão: ${component1} (${terminal1}) -> ${component2} (${terminal2})`;
		connectionElement.textContent = connectionText;
		connectionsDiv.appendChild(connectionElement);
}

// Inicializa as conexões em modo teste
function initializeConnections(){
		//Montagem padrão para testes
		createCable("circuit_breaker", "13", "power_supply", "24V", null);
		createCable("circuit_breaker", "14", "button_1", "11", null);
		createCable("circuit_breaker", "14", "button_1", "13", null);
		createCable("button_1", "12", "led_2", "X1", null);
		createCable("button_1", "14", "led_1", "X1", null);
		createCable("led_1", "X2", "power_supply", "0V", null);
		createCable("power_supply", "0V", "led_2", "X2", null);
}

function initializeConnections_2(){
	//Montagem padrão de nível 2 para testes
	createCable("power_supply", "24V", "button_1", "13", null);
	createCable("power_supply", "24V", "button_1", "11", null);
	createCable("button_1", "12", "led_2", "X1", null);
	createCable("button_1", "14", "led_1", "X1", null);
	createCable("led_1", "X2", "led_2", "X2", null);
	createCable("power_supply", "0V", "led_2", "X2",null);
}

function initializeConnections_3(){
	//Montagem padrão de nível 3 para testes
	createCable("power_supply", "24V", "circuit_breaker", "13", null);
	createCable("button_1", "11","circuit_breaker", "14", null);
	createCable("button_1", "11", "button_1", "13", null);
	createCable("button_1", "12", "led_2", "X1", null);
	createCable("button_1", "14", "led_1", "X1", null);
	createCable("led_2", "X2", "led_1", "X2", null);
	createCable("power_supply", "0V", "led_1", "X2", null);
}


function initializeConnections_4(){
	//Montagem padrão de nível 4 para testes
	createCable("circuit_breaker", "13", "power_supply", "24V", null);
	createCable("circuit_breaker", "14", "button_1", "11", null);
	createCable("circuit_breaker", "14", "button_1", "13", null);
	createCable("button_1", "12", "led_2", "X1", null);
	createCable("button_1", "14", "power_supply", "0V", null);
	createCable("led_2", "X2", "power_supply", "0V", null);
}
//initializeConnections_2();

// Verifica se o terminal é output
function checkOutputTerminal(terminal){
	//console.log(terminal);
	for(var i=0; i<power_supply_output_pins.length;i++){
		//console.log(power_supply_output_pins[i].name);
        if(power_supply_output_pins[i].name == terminal){
			return true;
		}
	}
	for(var i=0; i<led_1_output_pins.length;i++){
		if(led_1_output_pins[i].name == terminal){
			return true;
		}
	}
	for(var i=0; i<button_1_output_pins.length;i++){
		if(button_1_output_pins[i].name == terminal){
			return true;
		}
	}
	for(var i=0; i<button_2_output_pins.length;i++){
		if(button_2_output_pins[i].name == terminal){
			return true;
		}
	}
	for(var i=0; i<circuit_breaker_output_pins.length;i++){
		if(circuit_breaker_output_pins[i].name == terminal){
			return true;
		}
	}
	return false;
}

// Cria conexões ao apertar o botão "Criar conexão" na interface web
function createConnection() {
    const component1 = document.getElementById('component-select-1').value;
    const terminal1 = document.getElementById('terminal-select-1').value;
    const component2 = document.getElementById('component-select-2').value;
    const terminal2 = document.getElementById('terminal-select-2').value;
	
    if (component1 && terminal1 && component2 && terminal2) {
        const connectionText = `Conexão: ${component1} (${terminal1}) -> ${component2} (${terminal2})`;
        const connectionsDiv = document.getElementById('connections');
        const connectionElement = document.createElement('p');
        connectionElement.textContent = connectionText;
		connectionElement.style.fontSize = "12px";
        connectionsDiv.appendChild(connectionElement);
		
		let new_cable = new Cable(component1, terminal1, component2, terminal2, null);
		cables.push(new_cable);
		cables_check.push(new_cable);
	
    } else {
        alert('Por favor, selecione componentes e terminais para ambos os lados.');
    }
}

const root = new Node("root", null, null, null, null, [], [], null);

function printReference(referenceArray){
	const referenceDiv = document.getElementById('reference');
	referenceDiv.innerHTML = "component_PIN(Voltage)";
		
	for(var i=0;i<referenceArray.length;i++){
			const referenceElement = document.createElement('p');
			referenceElement.style.fontSize = "12px";
			referenceElement.textContent = referenceArray[i];
			referenceDiv.appendChild(referenceElement);
	}
}

function printCircuit(){
	if(current_level != null){
		let right_answers = 0;
		let referenceArray;
		switch(current_level){
			case "level_1": referenceArray = level_1_reference;break;
			case "level_2": referenceArray = level_2_reference;break;
			case "level_3": referenceArray = level_3_reference;break;
			case "level_4": referenceArray = level_4_reference;break;
		}
		printReference(referenceArray);
		createNodeTree();
		const circuitDiv = document.getElementById('circuit');
		circuitDiv.innerHTML = "component_PIN(Voltage)";

		for(var i=0;i<circuitParameters.length;i++){
			const circuitElement = document.createElement('p');
			circuitElement.style.fontSize = "12px";
			circuitElement.textContent = circuitParameters[i];
			if(checkElementInList(referenceArray, circuitParameters[i])){
				circuitElement.style.color = "#00AA00";
				right_answers++;
			}else{
				circuitElement.style.color = "#AA0000";
			}
			circuitDiv.appendChild(circuitElement);
		}

		if(right_answers == referenceArray.length){
			alert("Você acertou toda a montagem. Parabéns!");
			enableInteraction();
		}else{
			alert("Você acertou " + (100*right_answers/referenceArray.length) + "% do circuito. Continue tentando");
		}
	}
	else{
		alert("Selecione um nível primeiro");

	}
}

function revertNode(node){
	let initial_input_component = node.input_component;
	let initial_input_terminal = node.input_terminal;
	let initial_output_component = node.output_component;
	let initial_output_terminal = node.output_terminal;	
	
	node.input_component = initial_output_component;
	node.input_terminal = initial_output_terminal;
	node.output_component = initial_input_component;
	node.output_terminal = initial_input_terminal;
}

function testPowerSupply(){
	for(var i=0; i<nodeVector.length;i++){
		if(nodeVector[i].input_component == "power_supply" && checkOutputTerminal(nodeVector[i].input_terminal)){
			console.log("component power supply em terminal de saída foi classificado como input. Reverter Node");
			revertNode(nodeVector[i]);
		}
		else if(nodeVector[i].output_component == "power_supply" && !checkOutputTerminal(nodeVector[i].output_terminal)){
			console.log("component power supply em terminal de entrada foi classificado como output. Reverter Node");
			revertNode(nodeVector[i]);
		}
	}
}

function checkElementInList(list, element){
    return list.includes(element);
}

function addPowerSupplyToRoot(){
    for(var i=0; i<nodeCheck.length;i++){
        if(nodeCheck[i].output_component == "power_supply" && nodeCheck[i].name.includes("power_supply")){
            root.childrenNodes.push(nodeCheck[i]);
            root.childrenList.push(nodeCheck[i].name);
            nodeCheck[i].previousNode = root;
            let currentNode = nodeCheck[i];
            let new_array = nodeCheck.filter(function(current_node){return current_node !== nodeCheck[i];});
			nodeCheck = new_array;
            connectNodes(currentNode);
        }
    }
}

function updateComponent(component){
	for(var i=0; i<component.output_pins.length; i++){
		for(var j=0; j<nodeVector.length;j++){
			if(nodeVector[j].output_component == component.name && nodeVector[j].output_terminal == component.output_pins[i].name){
				component.output_pins[i].connectedTo.push(nodeVector[j].input_component+"_"+nodeVector[j].input_terminal);
			}
		}
	}
	for(var i=0; i<component.input_pins.length; i++){
		for(var j=0; j<nodeVector.length;j++){
			if(nodeVector[j].output_component == component.name && nodeVector[j].output_terminal == component.input_pins[i].name){
				component.input_pins[i].connectedTo.push(nodeVector[j].input_component+"_"+nodeVector[j].input_terminal);
			}
		}
	}
}	

function connectNodes(currentNode){
    let aimNode = currentNode.input_component + "_" + currentNode.input_terminal;

    for(var i=0; i<nodeCheck.length;i++){
        if(nodeCheck[i].name == aimNode){
            currentNode.childrenNodes.push(nodeCheck[i]);
            currentNode.childrenList.push(nodeCheck[i].name);
            nodeCheck[i].previousNode = currentNode;
            let thisNode = nodeCheck[i];
            let new_array = nodeCheck.filter(function(current_node){return current_node !== nodeCheck[i];});
			nodeCheck = new_array;
            connectNodes(thisNode);
        }
    }
}

let nodeVector = [];
let nodeCheck = [];
const componentVector = [power_supply,led_1,led_2,led_3,button_1,button_2,circuit_breaker];
let circuitParameters = [];
let terminal_reference = {
	component: "",
	pin: "",
	voltage: []
}

function createNodeTree(){
	// Component constructor(name,input_pins,output_pins,voltage,state){
	// Node constructor(name, input_component, output_component, input_terminal,output_terminal, childrenList, childrenNodes, previousNode)
	// Cable constructor(output_component, output_terminal, input_component, input_terminal, voltage)
	
	nodeVector = [];
	nodeCheck = [];
	circuitParameters = [];

	for(var i=0; i < cables.length;i++){
		let newNode = new Node(cables[i].input_component + "_" + cables[i].input_terminal + "_to_" + cables[i].output_component + "_" + cables[i].output_terminal,
        cables[i].input_component,cables[i].output_component, cables[i].input_terminal, cables[i].output_terminal, [], [],null);
		nodeVector.push(newNode);
        let mirrorNode = new Node(cables[i].output_component + "_" + cables[i].output_terminal + "_to_" + cables[i].input_component + "_" + cables[i].input_terminal, 
        cables[i].output_component,cables[i].input_component, cables[i].output_terminal, cables[i].input_terminal, [], [],null);
		nodeVector.push(mirrorNode);
	}

    nodeCheck = nodeVector;
    addPowerSupplyToRoot();
	
	componentVector.forEach((component) => updateComponent(component));
	componentVector.forEach((component) => transferVoltage(component));
	componentVector.forEach((component) => updateVoltage(component));
	componentVector.forEach((component) => {
		component.input_pins.forEach((pin)=> printVoltage(component,pin));
		component.output_pins.forEach((pin)=> printVoltage(component,pin));
		
	});
	
	console.log(nodeVector);
	console.log(componentVector);
}

// Retorna o objeto componente ao receber o nome (string) dele
function getComponentbyName(name){
	switch(name){
		case "power_supply": return power_supply;
		case "led_1": return led_1;
		case "led_2": return led_2;
		case "led_3": return led_3;
		case "button_1": return button_1;
		case "button_2": return button_2;
		case "circuit_breaker": return circuit_breaker;
		default: return null;
	}
}

function printVoltage(component,pin){
	if(pin.connectedTo.length > 0){
		console.log(component.name+"_"+pin.name+" Voltage: "+ pin.voltage);
		circuitParameters.push(component.name+"_"+pin.name+"("+ pin.voltage+")");
	}
}

function getTerminal(component_name,pin_name){
	let component = getComponentbyName(component_name);
	for(var i=0; i<component.input_pins.length;i++){
		if(component.input_pins[i].name == pin_name){
			return component.input_pins[i];
		}
	}
	for(var i=0; i<component.output_pins.length;i++){
		if(component.output_pins[i].name == pin_name){
			return component.output_pins[i];
		}
	}
}

function getTerminalByCompleteName(complete_name){
	let nameVector = complete_name.split('_');
	let pin_name = nameVector.pop();
	let component_name = nameVector.join('_');


	let terminal = getTerminal(component_name,pin_name);
	return terminal;
}

function getTerminalVoltage(reference,pin){
	if(reference.voltage == null){
		if(pin.voltage != null){
			if(typeof pin.voltage == "object"){
				reference.voltage = [];
				addUniqueElements(reference.voltage,pin.voltage,reference.component+"_"+reference.name);
				reference.voltage.sort();
			}
			else{
				reference.voltage = pin.voltage;
			}
		}else{
			pin.voltage = pin.connectedTo;
			reference.voltage = reference.connectedTo;
		}
	}else if(pin.voltage == null){
			if(reference.voltage != null){
				if(typeof reference.voltage == "object"){
					pin.voltage = [];
					addUniqueElements(pin.voltage,reference.voltage,pin.component+"_"+pin.name);
					pin.voltage.sort();
				}	
				else{
					pin.voltage = reference.voltage;
				}
			}else{
				reference.voltage = reference.connectedTo;
				pin.voltage = pin.connectedTo;
			}
	}else if(typeof reference.voltage == "object" && reference.voltage.length > 1 && typeof pin.voltage == "object"){			
			addUniqueElements(pin.voltage,reference.voltage,pin.component+"_"+pin.name);
			addUniqueElements(reference.voltage,pin.voltage,reference.component+"_"+reference.name);
			pin.voltage.sort();
			reference.voltage.sort();
			
	}
	else if(typeof reference.voltage != "object"){
		pin.voltage = reference.voltage;
	}
	return pin.voltage;
}


function transferVoltage(currentComponent){
	for(var i=0; i<currentComponent.input_pins.length;i++){
		if(currentComponent.input_pins[i].connectedTo.length > 0){
			let terminals = currentComponent.input_pins[i].connectedTo;
			let terminalArray = [];
			terminals.forEach((pin)=> terminalArray.push(getTerminalByCompleteName(pin)));
			terminalArray.forEach((pin)=> getTerminalVoltage(currentComponent.input_pins[i],pin));
		}
	}
	for(var i=0; i<currentComponent.output_pins.length;i++){
		if(currentComponent.output_pins[i].connectedTo.length > 0){
			let terminals = currentComponent.output_pins[i].connectedTo;
			let terminalArray = [];
			terminals.forEach((pin)=> terminalArray.push(getTerminalByCompleteName(pin)));
			terminalArray.forEach((pin)=> getTerminalVoltage(currentComponent.output_pins[i],pin));
		}
	}
}

function updateVoltage(component){
	transferVoltage(component);
	//component.input_pins.forEach((pin)=> printVoltage(component,pin));
	//component.output_pins.forEach((pin)=> printVoltage(component,pin));
}

function addUniqueElements(targetArray, sourceArray, complete_name) {	
	if(targetArray == null){
		//targetArray =[];
		targetArray.push(sourceArray[0])
		console.log(complete_name);
		console.log(targetArray);
		console.log(sourceArray);
	}
	if(sourceArray == null){
		console.log(sourceArray);
		console.log(complete_name);
	}

	sourceArray.forEach(element => {
        if (!targetArray.includes(element)) {
			if(element!= complete_name){
				targetArray.push(element);
			}
        }
    });
}

function removeElement(array, element) {
    const index = array.indexOf(element);
    if (index !== -1) {
        array.splice(index, 1);
		console.log("Remove: " + element);
    }
}

function removeElementByValue(array, value) {
    const index = array.indexOf(value);
    if (index !== -1) {
        array.splice(index, 1);
    }
    return array;
}

function enableInteraction(){
	interactions_components.style.visibility = "visible";
	console.log(current_level);
	switch(current_level){
		case "level_1": interactive_led_1.src = 'led_on_alpha.png'; break;
		case "level_2": interactive_led_2.src = 'led_on_alpha.png'; interactive_led_1.src = 'led_off_alpha.png'; break;
		case "level_3": interactive_led_2.src = 'led_off_alpha.png'; interactive_led_1.src = 'led_off_alpha.png'; break;
		case "level_4": interactive_led_2.src = 'led_off_alpha.png'; interactive_led_1.src = 'led_off_alpha.png'; break;
	}
}

function refresh(){
	if (confirm("Você deseja limpar todas as conexões?")) {
		location.reload();
	  }
}