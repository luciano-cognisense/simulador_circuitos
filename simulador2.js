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
    constructor(name,component,voltage){
        this.name = name;
        this.component = component;
        this.voltage = voltage;
    }
}