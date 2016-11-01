define(['require', './DAButtonBase'], function (require, DAButtonBase) {


	function DAButton()
	{
		DAButtonBase.call(this);
		this.DAClassInheritance.push("DAButton");

		this.hasHover = false;
	}
	DAButton.prototype = Object.create(DAButtonBase.prototype);
	DAButton.prototype.UpdateDisplay = function()
	{
		if(this.isButtonDown)
		{
			this.SetState("down");
		}else if(this.isButtonOver){
			if(this.hasHover)
			{
				this.SetState("over");	
			}else{
				this.SetState("up");
			}
			
		}else{
			this.SetState("up");
		}
	}
	DAButton.prototype.SetState = function(state)
	{
		for(var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];

			if(child.name != null)
			{
				var parts = child.name.split("_");
				var tag = parts[parts.length - 1];

				if(tag == "down")
				{
					child.visible = (state == "down");
				}else if(tag == "up"){
					child.visible = (state == "up");
				}else if(tag == "over"){
					child.visible = (state == "over");
				}
			}
		}
	}

	return DAButton;

});