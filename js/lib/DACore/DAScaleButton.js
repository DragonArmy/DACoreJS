define(['require', './DAButtonBase'], function (require, DAButtonBase) {

	DAScaleButton.DEFAULT_OVER_SCALE = 1.05;
	DAScaleButton.DEFAULT_DOWN_SCALE = 0.9;

	function DAScaleButton()
	{
		DAButtonBase.call(this);
		this.DAClassInheritance.push("DAScaleButton");

		this.downScale = DAScaleButton.DEFAULT_DOWN_SCALE;
		this.overScale = DAScaleButton.DEFAULT_OVER_SCALE;
	}
	DAScaleButton.prototype = Object.create(DAButtonBase.prototype);
	DAScaleButton.prototype.UpdateDisplay = function()
	{
		if(this.isButtonDown)
		{
			this.scale.x = this.downScale;
			this.scale.y = this.downScale;
		}else if(this.isButtonOver){
			this.scale.x = this.overScale;
			this.scale.y = this.overScale;
		}else{
			this.scale.x = 1;
			this.scale.y = 1;
		}
	}

	

	return DAScaleButton;

});