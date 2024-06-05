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
	constructor(name,input_pins,output_pins,voltage,state){
		this.name = name;
		this.input_pins = input_pins;
		this.output_pins = output_pins;
		this.voltage = voltage;
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

// Cables Vector
const cables = [];
let cables_check = [];

//Pin Lists
const power_supply_pins = ["0V","2N","Ground","24V","2R","2S","2T"];
const power_supply_input_pins = ["0V","2N","Ground"];
const power_supply_output_pins = ["24V","2R","2S","2T"];
const button_pins = ["11","13","21","23","12","14","22","24"];
const button_input_pins = ["11","13","21","23"];
const button_output_pins = ["12","14","22","24"];
const led_pins = ["X1","X2"];
const led_input_pins = ["X1"];
const led_output_pins = ["X2"];
const circuit_breaker_input_pins = ["1","3","5","13","21"];
const circuit_breaker_output_pins = ["2","4","6","14","22"];
const circuit_breaker_pins = ["1","3","5","13","21","2","4","6","14","22"];

// Component Objects
const power_supply =  new Component("power_supply",power_supply_input_pins,power_supply_output_pins,null,"off");
const button_1 =  new Component("button_1",button_input_pins,button_output_pins,null,"off");
const button_2 =  new Component("button_2",button_input_pins,button_output_pins,null,"off");
const led_1 =  new Component("led_1",led_input_pins,led_output_pins,null,"on");
const led_2 =  new Component("led_2",led_input_pins,led_output_pins,null,"on");
const led_3 =  new Component("led_3",led_input_pins,led_output_pins,null,"on");
const circuit_breaker =  new Component("circuit_breaker",circuit_breaker_input_pins,circuit_breaker_output_pins,null,"off");

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

// Cria o cabo independente da interface (Modo teste)
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

// Inicializa as conexões em modo teste
function initializeConnections(){
		//Montagem padrão de nível 3 para testes
		//createCable("power_supply", "24V", "button_1", "11", null);
		createCable("button_1", "11", "power_supply", "24V", null);
		createCable("power_supply", "24V", "button_1", "13", null);
		createCable("button_1", "12", "led_2", "X1", null);
		createCable("button_1", "14", "led_1", "X1", null);
		createCable("led_1", "X2", "power_supply", "0V", null);
		createCable("led_2", "X2", "power_supply", "0V", null);
}
initializeConnections();

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

// Verifica se um terminal é output ou input do component
function checkOutputTerminal(terminal){
	//console.log(terminal);
	for(var i=0; i<power_supply_output_pins.length;i++){
		if(power_supply_output_pins[i] == terminal){
			return true;
		}
	}
	for(var i=0; i<led_output_pins.length;i++){
		if(led_output_pins[i] == terminal){
			return true;
		}
	}
	for(var i=0; i<button_output_pins.length;i++){
		if(button_output_pins[i] == terminal){
			return true;
		}
	}
	for(var i=0; i<circuit_breaker_output_pins.length;i++){
		if(circuit_breaker_output_pins[i] == terminal){
			return true;
		}
	}
	return false;
}

// Reverte os cabos. 
// Utilizado para alinhar a origem e destino do cabo com o caminho da corrente
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

const root = new Node("root", null, null, null, null, [], [], null); 

// Cria a raiz do circuito
function createCircuitRoot(){
	//name, input_component, output_component, input_terminal,output_terminal, childrenList, childrenNodes, previousNode
	for(var i=0; i<cables.length;i++){
		//Acha os cabos conectados ao módulo de alimentação
		if(cables[i].output_component == "power_supply" && checkOutputTerminal(cables[i].output_terminal) || 
			cables[i].input_component == "power_supply" && checkOutputTerminal(cables[i].input_terminal)){
			
			//Reverte os cabos para que o módulo de alimentação seja output
			if(cables[i].input_component == "power_supply"){
				revertCable(cables[i]);
			}

			//Cria um novo nó para o circuito
			//let newNode = new Node("power_supply_" + String(cables[i].output_terminal), cables[i].input_component, "power_supply", cables[i].input_terminal, cables[i].output_terminal, [], [], root);
			let newNode = new Node("power_supply_" + String(cables[i].output_terminal), null, "power_supply", null, cables[i].output_terminal, [], [], root);
			//console.log("Cria Node");
			//console.log(newNode);

			if(cables[i].output_terminal == "24V"){
				newNode.output_component.voltage = "24V";
			}else{
				newNode.output_component.voltage = "380V"
			}

			//Estabelece o novo nó como filho da raiz
			root.childrenList.push(newNode.name);
			root.childrenNodes.push(newNode);
		}
	}
	
	//console.log(root);
	for(var i=0; i<root.childrenNodes.length;i++){
		createCircuitTree(root.childrenNodes[i]);
	}
}

// A partir da entrada do componente retorna qual a saída esperada
function getComponentOutputTerminal(component_name, component_input_terminal){
	switch(component_name){
		case "power_supply": return component_input_terminal;
		case "led_1": return "X2";
		case "led_2": return "X2";
		case "led_3": return "X2";
		case "button_1": switch(component_input_terminal){
								case "11": return "12";
								case "13": return "14";
								case "21": return "22";
								case "23": return "24";
						}
		case "button_2": switch(component_input_terminal){
								case "11": return "12";
								case "13": return "14";
								case "21": return "22";
								case "23": return "24";
						}
		case "circuit_breaker": return circuit_breaker;
		default: return null;
	}
}

function createCircuitTree(currentNode){
	console.log(currentNode);
	for(var i=0; i<cables_check.length;i++){
		/* if(cables_check[i].output_component == currentNode.output_component && checkOutputTerminal(cables_check[i].output_terminal) || 
			cables_check[i].input_component == currentNode.output_component && checkOutputTerminal(cables_check[i].input_terminal)){  */
			if(cables_check[i].output_component == currentNode.output_component && cables_check[i].output_terminal == currentNode.output_terminal || 
			cables_check[i].input_component == currentNode.output_component && cables_check[i].input_terminal == currentNode.output_terminal){
				//console.log(cables_check[i]);
				//console.log(checkOutputTerminal(cables_check[i].output_terminal));
				//console.log(checkOutputTerminal(cables_check[i].input_terminal));
				// Reverte os cabos para que entradas e saídas estejam ordenadas ao caminho da corrente
				if(cables_check[i].input_component == currentNode.output_component){
				 	console.log(cables_check[i]);
				 	revertCable(cables_check[i]);
				 	console.log("reverteu");
				 	console.log(cables_check[i]);
				}


				
				//Atualiza currentNode com o component e terminal de entrada
				currentNode.input_component = cables_check[i].input_component;
				currentNode.input_terminal = cables_check[i].input_terminal;
				//console.log("Atualiza Node");
				//console.log(currentNode);

				//Pega o terminal de saída do novo componente
				//console.log(cables_check[i]);
				let component_output_terminal = getComponentOutputTerminal(cables_check[i].input_component, cables_check[i].input_terminal)
				
				// Cria novo nó filho a partir do cabo
				//name, input_component, output_component, input_terminal,output_terminal, childrenList, childrenNodes, previousNode
				let newNode = new Node(cables_check[i].input_component + "_" + cables_check[i].input_terminal, null,cables_check[i].input_component, 
				null,component_output_terminal, [], [],currentNode);
				//console.log("Cria Node");
				//console.log(newNode);
				

				// Atualiza nós filhos 
				// onsole.log(currentNode);
				//console.log(currentNode.childrenList);
				currentNode.childrenList.push(newNode.name);
				currentNode.childrenNodes.push(newNode);

				// Exclui cabo da check_list
				let new_array = cables_check.filter(function(current_cable){return current_cable !== cables_check[i];});
				cables_check = new_array;
				
				console.log(newNode);
				if(checkOutputTerminal(newNode.output_terminal)){
					createCircuitTree(newNode);
				}
				else{
					//console.log("Componente não possui output");
				}
			}
		//}	
	}

	//console.log(root);
	//getMatrix(root);
	//printCircuit();
}


function printCircuit(){
	createCircuitRoot();
	const circuitDiv = document.getElementById('circuit');

	let nivelAtual = [root];
	//console.log(root);
	while (nivelAtual.length > 0) {
		//console.log(nivelAtual);
		const circuitElement = document.createElement('p');
		const proximoNivel = [];
		let saida = "";

		for (let no of nivelAtual) {
			//console.log(no);
			saida += no.name + "\t";
			proximoNivel.push(...no.childrenNodes);
		}

		console.log(saida.trim());
		circuitElement.textContent = saida.trim();
        circuitDiv.appendChild(circuitElement);
		nivelAtual = proximoNivel;
	}

}