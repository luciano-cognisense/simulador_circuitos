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
	constructor(name,pins,voltage,state){
		this.name = name;
		this.pins = pins;
		this.voltage = voltage;
		this.state = state;
	}
}

class Node {
	constructor(name, component, terminal, childrenList, childrenNodes, previousNode){
		this.name = name;
		this.component = component;
		this.terminal = terminal;
		this.childrenList = childrenList;
		this.childrenNodes = childrenNodes;
		this.previousNode = previousNode;
	};
	
};

// Cables Vector
const cables = [];
let cables_check = [];

//Pin Lists
const power_supply_pins = ["24V","0V","2R","2S","2T","2N","Ground"];
const button_pins = ["11","12","13","14","21","22","23","24"];
const led_pins = ["X1","X2"];
const circuit_breaker_pins = ["1","2","3","4","5","6","13","14","21","22"];

// Component Objects
const power_supply =  new Component("power_supply",power_supply_pins,null,null);
const button_1 =  new Component("button_1",button_pins,null,null);
const button_2 =  new Component("button_2",button_pins,null,null);
const led_1 =  new Component("led_1",led_pins,null,null);
const led_2 =  new Component("led_2",led_pins,null,null);
const led_3 =  new Component("led_3",led_pins,null,null);
const circuit_breaker =  new Component("circuit_breaker",circuit_breaker_pins,null,null);

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

function createCable(component1, terminal1, component2, terminal2, voltage){
		const connectionsDiv = document.getElementById('connections');
		const connectionElement = document.createElement('p');
		
		let new_cable = new Cable(component1, terminal1, component2, terminal2, null);
		cables.push(new_cable);
		cables_check.push(new_cable);
		
		let connectionText = `Conexão: ${component1} (${terminal1}) -> ${component2} (${terminal2})`;
		connectionElement.textContent = connectionText;
		connectionsDiv.appendChild(connectionElement);
}

function initializeConnections(){
		//Montagem padrão de nível 3 para testes
		createCable("power_supply", "24V", "button_1", "11", null);
		createCable("power_supply", "24V", "button_1", "13", null);
		createCable("button_1", "12", "led_2", "X1", null);
		createCable("button_1", "14", "led_1", "X1", null);
		createCable("led_1", "X2", "power_supply", "0V", null);
		createCable("led_2", "X2", "power_supply", "0V", null);
}
//initializeConnections();

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
        connectionsDiv.appendChild(connectionElement);
		
		let new_cable = new Cable(component1, terminal1, component2, terminal2, null);
		cables.push(new_cable);
		cables_check.push(new_cable);
	
    } else {
        alert('Por favor, selecione componentes e terminais para ambos os lados.');
    }
	
	console.log(cables);
	console.log(cables_check);
}

const root = new Node("root", null, [], [], [], null); 

function createCircuitRoot(){
	//name, component, terminal, childrenList, childrenNodes, previousNode
	//let root = new Node("root", null, [], [], [], null);
	
	for(var i=0; i<cables.length;i++){
		if(cables[i].output_component == "power_supply" || cables[i].input_component == "power_supply"){
			//console.log(cables[i]);
			if(cables[i].input_terminal != "0V" && cables[i].input_terminal != "2N" && cables[i].input_terminal && "Ground"){
				let newNode = new Node("power_supply_" + String(cables[i].output_terminal), "power_supply", cables[i].output_terminal, [], [], root);
					root.childrenList.push(newNode.name);
					root.childrenNodes.push(newNode);
				}
			}
	}
	
	console.log(root);
	for(var i=0; i<root.childrenNodes.length;i++){
		createCircuitTree(root.childrenNodes[i]);
	}
}

function revertCable(cable){
	let initial_input_component = cable.input_component;
	let initial_input_terminal = cable.input_terminal;
	let initial_output_component = cable.output_component;
	let initial_output_terminal = cable.output_terminal;	
	
	cable.input_component = initial_output_component;
	cable.input_terminal = initial_output_terminal;
	cable.output_component = initial_input_component;
	cable.output_terminal = initial_input_terminal;
}

function createCircuitTree(currentNode){
	console.log(currentNode);
	//console.log(cables_check);
	for(var i=0; i<cables_check.length;i++){
		if(cables_check[i].output_component == currentNode.component && cables_check[i].output_terminal == currentNode.terminal){
			//console.log(cables_check[i]);
			// Cria novo node filho a partir do cabo
			let newNode = new Node(String(cables_check[i].input_component) + "_" + String(cables_check[i].input_terminal), String(cables_check[i].input_component), String(cables_check[i].input_terminal), [], [], currentNode);
			currentNode.childrenList.push(newNode.name);
			currentNode.childrenNodes.push(newNode);
			
			
			// Exclui cabo da check_list
			let new_array = cables_check.filter(function(current_cable){return current_cable !== cables_check[i];});
			cables_check = new_array;
			createCircuitTree(newNode);
		}
	}
	console.log(root);
	//printCircuit();
}

function printCircuit(){
	let current_Node = root;
	
	while(current_Node.childrenNodes != null){
		
	}
}
