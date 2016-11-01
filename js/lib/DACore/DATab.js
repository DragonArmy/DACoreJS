define(['require', './DAContainer'], function (require, DAContainer) {

	//this one is kind of virtual so no need to add it to DACore
	function DATab()
	{
		DAContainer.call(this);
		this.DAClassInheritance.push("DATab");

		this.stateWillChange = [];
		this.stateDidChange = [];

		this.states = [];
		this.cycle = [];

		//not using a Set here, so need to be super careful
		this.allLinkedNodes = [];
		this.linkedNodes = {};

		this._currentState = "";
	}
	DATab.prototype = Object.create(DAContainer.prototype);

	DATab.prototype.CreateStates = function()
	{
		var tab = this;
		var button_handler = function(button)
		{
			var next_state = tab.NextStateInCycle();
			if(tab._currentState == next_state)
			{
				//already there!
				return;
			}

			tab.FireEvent(tab.stateWillChange);
			tab.CurrentState(next_state);
			tab.FireEvent(tab.stateDidChange);
		}


		var got_one = false;
		for(var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			if(child.IsDAClass != null && child.IsDAClass("DAButtonBase"))
			{
				child.onClick.push(button_handler);
			}

			if(child.name != null)
			{
				var pieces = child.name.split("_");
				var tag = pieces[pieces.length - 1];

				if(this.states.indexOf(tag) < 0)
				{
					this.states.push(tag);
					got_one = true;
					this._currentState = tag;
				}
			}
		}

		if(got_one)
		{
			this.UpdateDisplay();
		}
	}
	DATab.prototype.NextStateInCycle = function()
	{
		if(this.cycle.length == 0)
		{
			return this._currentState;
		}

		var index = this.cycle.indexOf(this._currentState);
		if(index < 0)
		{
			return this._currentState;
		}

		var next_state = (index + 1) % this.cycle.length;
		return this.cycle[next_state];
	}
	DATab.prototype.UpdateDisplay = function()
	{
		//turn off all linked nodes
    	for(var i = 0; i < this.allLinkedNodes.length; i++)
    	{
    		this.allLinkedNodes[i].visible = false;
    	}

    	//turn back on nodes linked to this state
    	if(this.linkedNodes[this._currentState] != null)
    	{
    		for(var i = 0; i < this.linkedNodes[this._currentState].length; i++)
    		{
    			this.linkedNodes[this._currentState][i].visible = true;
    		}
    	}

    	for(var i = 0; i < this.children.length; i++)
    	{
    		var child = this.children[i];
    		if(child.name != null)
    		{
    			var pieces = child.name.split("_");
    			var tag = pieces[pieces.length - 1];

    			if(tag == this._currentState)
    			{
    				child.visible = true;
    			}else{
    				child.visible = false;
    			}
    		}
    	}
	}
	//tab.currentState()  		-- returns current state
	//tab.currentState("foo")	-- sets current state to "foo"
	DATab.prototype.CurrentState = function(state)
	{
		if(typeof state === "undefined") {
        	return this._currentState;
    	}	

    	this._currentState = state;

    	this.UpdateDisplay();
	}
	DATab.prototype.LinkNode = function(node, state) 
	{
		if(this.allLinkedNodes.indexOf(node) < 0)
		{
			this.allLinkedNodes.push(node);
		}

		if(this.linkedNodes[state] == null)
		{
			this.linkedNodes[state] = [];
		}

		if(this.linkedNodes[state].indexOf(node) < 0)
		{
			this.linkedNodes[state].push(node);
		}

		this.UpdateDisplay();
	}
	DATab.prototype.UnlinkNode = function(node, state)
	{
		if(this.linkedNodes[state] == null)
		{
			return;
		}

		var which = this.linkedNodes[state].indexOf(node);
		if(which < 0)
		{
			return;
		}

		this.linkedNodes[state].splice(which, 0, 1);

		var got_one = false;
		for(var key in this.linkedNodes)
		{
			if(this.linkedNodes.indexOf(node) >= 0)
			{
				got_one = true;
				break;
			}
		}


		if(!got_one)
		{
			which = this.allLinkedNodes.indexOf(node);
			if(which >= 0)
			{
				this.allLinkedNodes.splice(which, 0, 1);
			}
		}
		

	}


	return DATab;
});