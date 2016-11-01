define(['require', 'pixi.min'], function (require, PIXI) {

	function DAContainer()
	{
		PIXI.Container.call(this);
		this.DAClassInheritance = ["DAContainer"];
	}
	DAContainer.prototype = Object.create(PIXI.Container.prototype);
	DAContainer.prototype.IsDAClass = function(classname)
	{
		if(this.DAClassInheritance.indexOf(classname) >= 0)
		{
			return true;
		}
		return false;
	}
	DAContainer.prototype.ClearListeners = function()
	{
		//override me
	}
	//janky event dispatchers... TODO find a signal lib or use proper event dispatch
	DAContainer.prototype.FireEvent = function(callback_list)
	{
		for(var i = 0; i < callback_list.length; i++)
		{
			callback_list[i](this);
		}
	}



	return DAContainer;

});