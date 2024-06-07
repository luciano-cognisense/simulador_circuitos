
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

// Cables Vector
const cables = [];
let cables_check = [];

// Create Terminals
// Power Supply Module
const power_supply_24V =  new Terminal("24V","power_supply","output","24V",null);
const power_supply_0V =  new Terminal("0V","power_supply","input","0V",null);
const power_supply_2R =  new Terminal("2R","power_supply","output","380V",null);
const power_supply_2S =  new Terminal("2S","power_supply","output","380V",null);
const power_supply_2T =  new Terminal("2T","power_supply","output","380V",null);
const power_supply_2N =  new Terminal("2N","power_supply","input","Neutral",null);
const power_supply_Ground =  new Terminal("Ground","power_supply","input","Ground",null);
// Button Module
const button_1_11 = new Terminal("11","button_1","bi-directional",null,null);
const button_1_12 = new Terminal("12","button_1","bi-directional",null,null);
const button_1_13 = new Terminal("13","button_1","bi-directional",null,null);
const button_1_14 = new Terminal("14","button_1","bi-directional",null,null);
const button_1_21 = new Terminal("21","button_1","bi-directional",null,null);
const button_1_22 = new Terminal("22","button_1","bi-directional",null,null);
const button_1_23 = new Terminal("23","button_1","bi-directional",null,null);
const button_1_24 = new Terminal("24","button_1","bi-directional",null,null);
const button_2_11 = new Terminal("11","button_2","bi-directional",null,null);
const button_2_12 = new Terminal("12","button_2","bi-directional",null,null);
const button_2_13 = new Terminal("13","button_2","bi-directional",null,null);
const button_2_14 = new Terminal("14","button_2","bi-directional",null,null);
const button_2_21 = new Terminal("21","button_2","bi-directional",null,null);
const button_2_22 = new Terminal("22","button_2","bi-directional",null,null);
const button_2_23 = new Terminal("23","button_2","bi-directional",null,null);
const button_2_24 = new Terminal("24","button_2","bi-directional",null,null);
// LED Module
const led_1_X1 = new Terminal("X1","led_1","bi-directional",null,null);
const led_1_X2 = new Terminal("X2","led_1","bi-directional",null,null);
const led_2_X1 = new Terminal("X1","led_2","bi-directional",null,null);
const led_2_X2 = new Terminal("X2","led_2","bi-directional",null,null);
const led_3_X1 = new Terminal("X1","led_3","bi-directional",null,null);
const led_3_X2 = new Terminal("X2","led_3","bi-directional",null,null);
// Circuit Breaker Module
const circuit_breaker_1 = new Terminal("1","circuit_breaker","bi-directional",null,null);
const circuit_breaker_2 = new Terminal("2","circuit_breaker","bi-directional",null,null);
const circuit_breaker_3 = new Terminal("3","circuit_breaker","bi-directional",null,null);
const circuit_breaker_4 = new Terminal("4","circuit_breaker","bi-directional",null,null);
const circuit_breaker_5 = new Terminal("5","circuit_breaker","bi-directional",null,null);
const circuit_breaker_6 = new Terminal("6","circuit_breaker","bi-directional",null,null);
const circuit_breaker_13 = new Terminal("13","circuit_breaker","bi-directional",null,null);
const circuit_breaker_14 = new Terminal("14","circuit_breaker","bi-directional",null,null);
const circuit_breaker_21 = new Terminal("21","circuit_breaker","bi-directional",null,null);
const circuit_breaker_22 = new Terminal("22","circuit_breaker","bi-directional",null,null);

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
const button_2 =  new Component("button_2",button_2_input_pins,button_1_output_pins,"off");
const led_1 =  new Component("led_1",led_1_input_pins,led_1_output_pins,"on");
const led_2 =  new Component("led_2",led_2_input_pins,led_2_output_pins,"on");
const led_3 =  new Component("led_3",led_3_input_pins,led_3_output_pins,"on");
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
		case "nivel_1": myImage.src = "nivel_1.png";; break;
		case "nivel_2": myImage.src = "nivel_2.png";; break;
		case "nivel_3": myImage.src = "nivel_3.png";; break;
		case "nivel_4":	myImage.src = "nivel_4.png";; break;
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
		//Montagem padrão de nível 3 para testes
		//createCable("power_supply", "24V", "button_1", "11", null);
		createCable("button_1", "11", "power_supply", "24V", null);
		createCable("button_1", "11", "button_1", "13", null);
		createCable("button_1", "12", "led_2", "X1", null);
		createCable("button_1", "14", "led_1", "X1", null);
		createCable("led_1", "X2", "power_supply", "0V", null);
		createCable("power_supply", "0V", "led_2", "X2", null);
		//createCable("led_2", "X2", "power_supply", "0V", null);
}
initializeConnections();

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
        connectionsDiv.appendChild(connectionElement);
		
		let new_cable = new Cable(component1, terminal1, component2, terminal2, null);
		cables.push(new_cable);
		cables_check.push(new_cable);
	
    } else {
        alert('Por favor, selecione componentes e terminais para ambos os lados.');
    }
}

const root = new Node("root", null, null, null, null, [], [], null);
function printCircuit(){
	createNodeTree();
	const circuitDiv = document.getElementById('circuit');
    console.log(root);
	let nivelAtual = [root];

	while (nivelAtual.length > 0) {
		const circuitElement = document.createElement('p');
		const proximoNivel = [];
		let saida = "";

		for (let no of nivelAtual) {
			saida += no.name + "\t";
			proximoNivel.push(...no.childrenNodes);
		}

		console.log(saida.trim());
		circuitElement.textContent = saida.trim();
        circuitDiv.appendChild(circuitElement);
		nivelAtual = proximoNivel;
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
    console.log(list);
    console.log(element);
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

/*function connectNodes(){
    for(var i=0; i<nodeCheck.length;i++){
        console.log(nodeCheck[i].name)
        nodeCheck[i].childrenList.push();
        nodeCheck[i].childrenNodes.push();
    }
}*/

function updateComponent(component){
	for(var i=0; i<nodeVector.length; i++){
		if(nodeVector[i].output_component == component.name){
			for(var j=0; j<component.input_pins.length;j++){
				console.log("Componente: " + component.input_pins[j].name);
				console.log("Node: " + nodeVector[i].input_terminal);
				if(component.input_pins[j].name == nodeVector[i].input_terminal){
					console.log(component.input_pins[j].name);
				}
			}
		}else if(nodeVector[i].input_component == component.name){
			if(nodeVector[i].output_component == component.name){
				for(var j=0; j<component.input_pins.length;j++){
					console.log("Componente: " + component.input_pins[j].name);
					console.log("Node: " + nodeVector[i].input_terminal);
					if(component.input_pins[j].name == nodeVector[i].output_terminal){
						console.log(component.input_pins[j]);
					}
				}
			}
		}
	}

    /*for(var i=0; i<component.input_pins.length; i++){
		if(component.input_pins[i] == ){
			
		}
		console.log(component.input_pins[i]);
	}

	for(var i=0; i<component.output_pins; i++){
		console.log(component.input_pins[i]);
	}*/
}

function connectNodes(currentNode){
    let aimNode = currentNode.input_component + "_" + currentNode.input_terminal;
    console.log(currentNode.name);
    console.log(aimNode);

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

const nodeVector = [];
let nodeCheck = [];
function createNodeTree(){
	// Component constructor(name,input_pins,output_pins,voltage,state){
	// Node constructor(name, input_component, output_component, input_terminal,output_terminal, childrenList, childrenNodes, previousNode)
	// Cable constructor(output_component, output_terminal, input_component, input_terminal, voltage)

	for(var i=0; i < cables.length;i++){
		let newNode = new Node(cables[i].input_component + "_" + cables[i].input_terminal + "_to_" + cables[i].output_component + "_" + cables[i].output_terminal,
        cables[i].input_component,cables[i].output_component, cables[i].input_terminal, cables[i].output_terminal, [], [],null);
		nodeVector.push(newNode);
        let mirrorNode = new Node(cables[i].output_component + "_" + cables[i].output_terminal + "_to_" + cables[i].input_component + "_" + cables[i].input_terminal, 
        cables[i].input_component,cables[i].output_component, cables[i].input_terminal, cables[i].output_terminal, [], [],null);
		nodeVector.push(mirrorNode);
	}

	testPowerSupply();
    nodeCheck = nodeVector;
    addPowerSupplyToRoot();
	
	updateComponent(power_supply);
	//updateComponent(led_1);
	//updateComponent(led_2);
	//updateComponent(led_3);
	//updateComponent(button_1);
	//updateComponent(button_2);
	//updateComponent(circuit_breaker);
	
	console.log(nodeVector);
}
