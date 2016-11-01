define(['require', './DAContainer'], function (require, DAContainer) {

	//this one is kind of virtual so no need to add it to DACore
	function DAButtonBase()
	{
		DAContainer.call(this);
		this.DAClassInheritance.push("DAButtonBase");

		this.onPress = [];
		this.onRelease = [];
		this.onClick = [];

		this.isEnabled = true;
		this.isButtonDown = false;
		this.isButtonOver = false;
		this.isTouching = false;


		this.interactive = true;

		var button = this;
		this.mousedown = this.touchstart = function() {
			this.isTouching = false;
			if(!this.worldVisible)
			{
				return;
			}

			if(this.isEnabled)
			{
				this.FireEvent(this.onPress);

				this.isTouching = true;
				this.isButtonDown = true;
				this.UpdateDisplay();
			}
		}

		this.mouseup = this.touchend = function() {
			if(!this.isTouching)
			{
				return;
			}

			this.isTouching = false;
			if(this.isButtonDown)
			{
				this.isButtonDown = false;
				this.isButtonOver = false;
				this.UpdateDisplay();

				if(this.onRelease != null)
				{
					this.FireEvent(this.onRelease);
				}

				if(this.onClick != null)
				{
					this.FireEvent(this.onClick);
				}
			}
		}

		this.mouseover = function() {
			this.isButtonOver = true;

			if(this.isTouching)
			{
				this.isButtonDown = true;
			}
			this.UpdateDisplay();
		}

		this.mouseout = function() {
			this.isButtonOver = false;
			
			if(this.isTouching)
			{
				this.isButtonDown = false;
			}

			this.UpdateDisplay();
		}
	}
	DAButtonBase.prototype = Object.create(DAContainer.prototype);
	DAButtonBase.prototype.UpdateDisplay = function()
	{
		console.log("UPDATE DISPLAY SUPER");
		//TODO: OVERRIDE ME
	}
	DAButtonBase.prototype.ClearListeners = function()
	{
		this.onPress = [];
		this.onRelease = [];
		this.onClick = [];
	}
	DAButtonBase.prototype.FireEvent = function(callback_list)
	{
		for(var i = 0; i < callback_list.length; i++)
		{
			callback_list[i](this);
		}
	}


	return DAButtonBase;
});