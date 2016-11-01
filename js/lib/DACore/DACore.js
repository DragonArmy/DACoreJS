


define(['require', 'pixi.min', './DAContainer', './DAScaleButton', './DAButton', './DATab'], function (require, PIXI, DAContainer, DAScaleButton, DAButton, DATab) {

	DACore.assetPath = "assets";
	DACore.LoadedMetadata = {};
	DACore.FontAliases = {};

	DACore.DAContainer = DAContainer;
	DACore.DAButton = DAButton;
	DACore.DAScaleButton = DAScaleButton;


	function DACore()
	{
		
	}

	DACore.setup = function(asset_path)
	{
		DACore.assetPath = asset_path;
	}

	DACore.GetFont = function(metadata_name)
	{
		if(DACore.FontAliases.hasOwnProperty(metadata_name))
		{
			return DACore.FontAliases[metadata_name];
		}

		return metadata_name;
	}

	DACore.AliasFont = function(metadata_name, css_name)
	{
		DACore.FontAliases[metadata_name] = css_name;
	}

	DACore.LoadMetadata = function(file_root)
	{
		if(DACore.LoadedMetadata.hasOwnProperty(file_root))
		{
			console.log("[WARNING] ALREADY PARSED " + file_root);
			return;
		}
		

		var raw_metadata = PIXI.loader.resources[DACore.assetPath + "/" + file_root + ".txt"].data;
		DACore.LoadedMetadata[file_root] = JSON.parse(raw_metadata);
	}


	function DAMetaContainer(file_root, optional_container)
	{
		DAContainer.call(this);
		this.DAClassInheritance.push("DAMetaContainer");

		console.log("CREATE A METACONTAINER FROM " + file_root + "/" + optional_container);

		this.name = "";
		this.fileRoot = file_root;
		this.rootContainer = optional_container;
		this.rootWidth = null;
		this.rootHeight = null;

		this.containers = {};
		this.sprites = {};
		this.placeholders = {};
		this.buttons = {};
		this.labels = {};
		this.progressBars = {};
		this.tabs = {};

		if(optional_container == null)
		{
			this.name = file_root;
		}else{
			this.name = optional_container;
		}
		
		if(file_root == null)
		{
			return;
		}


		if(DACore.LoadedMetadata.hasOwnProperty(file_root))
		{
			this.ProcessMetadata(DACore.LoadedMetadata[file_root]);
		}else{
			DACore.LoadMetadata(file_root);

			//check to see if it worked
			if(DACore.LoadedMetadata.hasOwnProperty(file_root))
			{
				this.ProcessMetadata(DACore.LoadedMetadata[file_root]);
			}else{
				console.log(DACore.LoadedMetadata);
			}
		}
	}

	DAMetaContainer.prototype = Object.create(DAContainer.prototype);

	DAMetaContainer.prototype.ProcessMetadata = function(metadata) {
		if(metadata.coordinate_system != "native_ui")
		{
			console.log("[ERROR] YOU USED THE WRONG EXPORT SCRIPT");
			console.log(metadata);
			return;
		}

		this.rootWidth = metadata["root_width"];
		this.rootHeight = metadata["root_height"];

		if(this.rootContainer == "" || this.rootContainer == null)
		{
			var children = this.ProcessChildren(metadata.children);

			for(var i = 0; i < children.length; i++)
			{
				this.addChild(children[i]);
			}
		}else{

			var got_one = false;
			for(var i = 0; i < metadata.children.length; i++)
			{
				var child = metadata.children[i];
				var node_type = child.type;
				var node_name = child.name;

				if(node_type == "container" && node_name == "container_" + this.rootContiner)
				{
					got_one = true;

					var node_child = this.ProcessContainerNode(child);

					//TODO: just set root to the child?
				}
			}

		}


	},

	//children here is an ARRAY of child objects
	DAMetaContainer.prototype.ProcessChildren = function(raw_children) {
		var child_nodes = [];

		for(var i = 0; i < raw_children.length; i++)
		{
			var node = raw_children[i];
			var node_type = node.type;

			switch(node_type)
			{
				case "container":
					child_nodes.push(this.ProcessContainerNode(node));
					break;
				case "text":
					child_nodes.push(this.ProcessTextNode(node));
					break;
				case "image":
					child_nodes.push(this.ProcessImageNode(node));
					break;
				case "placeholder":

					//TODO: MODALS
					this.ProcessPlaceholderNode(node);

					break;
				default:
					console.log("[ERROR] UH OH -- INVALID NODE FOUND: " + node_type);
					break;
			}
		}

		return child_nodes;
	},

	//node here is an OBJECT
	DAMetaContainer.prototype.ProcessContainerNode = function(node) {
		var container = new DAContainer();
		container.name = node.name;

		var container_type = node.name.split("_")[0];

		switch(container_type)
		{
			case "container":
				var container_name = node.name.replace("container_","");
				container.name = container_name;
				this.containers[container_name] = container;
				break;
			case "btn":

				var button = new DAButton();

				var button_name = node.name.replace("btn_","");
				button.name = button_name;
				this.buttons[button_name] = button;

				container = button;

				break;
			case "scalebtn":

				var button = new DAScaleButton();

				var button_name = node.name.replace("scalebtn_","");
				button.name = button_name;
				this.buttons[button_name] = button;	

				container = button;				

				break;
			case "tab":

				var tab = new DATab();

				var tab_name = node.name.replace("tab_","");
				tab.name = tab_name;
				this.tabs[tab_name] = tab;

				container = tab;

				break;

			case "progress":
				console.log("PROGRESS is not implemented yet");
				break;
			case "scale9":
				console.log("SCALE9 is not implemented yet");
				break;
			case "paragraph":
				console.log("PARAGRAPH is not implemented yet");
				break;
			default:
				console.log("[ERROR] Unrecognized container type: " + container_type);
				break;
		}

		container.hitArea = new PIXI.Rectangle(0,0,node.size[0], node.size[1]);

		var children = this.ProcessChildren(node.children);
		for(var i = 0; i < children.length; i++)
		{
			container.addChild(children[i]);
		}

		if(container.IsDAClass("DAButtonBase"))
		{
			container.UpdateDisplay();
		}

		if(container.IsDAClass("DATab"))
		{
			console.log("CREATE TAB STATES");
			container.CreateStates();
		}

		container.x = node.position[0];
		container.y = node.position[1];

		if(node.hasOwnProperty("pivot"))
		{
			container.pivot.x = -1*node.pivot[0];
			container.pivot.y = -1*node.pivot[1];
		}

		container.cachedMetadata = node;
		return container;
	},

	DAMetaContainer.prototype.ProcessTextNode = function(node) {
		
		var text_options = {};

		var font_pieces = node.font.split("-");

		text_options["fontFamily"] = DACore.GetFont(node.font);
		text_options["fontSize"] = node.fontSize;
		text_options["fill"] = parseInt("0x" + node.color);
		text_options["align"] = node.justification;
		//the default is alphabet, which causes our lines to appear "sunken"
		text_options["textBaseline"] = "bottom";
		//this padding corrects for raising the baseline to bottom
		text_options["padding"] = 5;

		var text = new PIXI.Text(node.text, text_options);
		text.name = node.name;

		//with the native exporter, positions are reported differently
		//for different justifications
		switch(node.justification)
		{
			case "left":
				text.anchor.x = 0.0;
				break;
			case "right":
				text.anchor.x = 1.0;
				break;
			case "center":
				text.anchor.x = 0.5;
				break;
		}

		text.x = node.position[0];
		text.y = node.position[1];

		this.labels[text.name] = text;

		return text;
	},

	DAMetaContainer.prototype.ProcessImageNode = function(node) {
		var image_name = node.name;
		var image_type = image_name.split("_")[0];

		var texture = PIXI.TextureCache[image_name + ".png"];
    	var sprite = new PIXI.Sprite(texture);
    	sprite.name = image_name;

    	if(image_type == "flipX")
    	{
    		sprite.anchor.x = 1.0;
    		sprite.scale.x = -1.0;
    	}

    	this.sprites[image_name] = sprite;

    	if(image_type == "scalebtn")
    	{
    		var button = new DAScaleButton();
    		button.addChild(sprite);

			var button_name = node.name.replace("scalebtn_","");
			button.name = button_name;

			this.buttons[button_name] = button;	

			button.x = node.position[0];
			button.y = node.position[1];

			//shift to a center pivot instead of top-left
			button.pivot.x = node.size[0]/2;
			button.pivot.y = node.size[1]/2;

			button.x += node.size[0]/2;
			button.y += node.size[1]/2;
			return button;
    	}

    	sprite.x = node.position[0];
    	sprite.y = node.position[1];

		return sprite;
	},

	DAMetaContainer.prototype.ProcessPlaceholderNode = function(node) {
		var ph = new PIXI.Rectangle(node.position[0],node.position[1],node.size[0], node.size[1]);
		this.placeholders[node.name] = ph;
		console.log("CREATED PLACEHOLDER NAMED " + node.name);
		console.log(ph);
	},

	DAMetaContainer.prototype.ContainerWithName = function(name) {
		if(name.split("_")[0] == "container")
		{
			console.log("[ERROR] ContainerWithName provides the container_, you may omit it from your call!");
		}
		return this.containers[name];
	},

	DAMetaContainer.prototype.TabWithName = function(name) {
		if(name.split("_")[0] == "tab")
		{
			console.log("[ERROR] TabWithName provides the tab_, you may omit it from your call!");
		}
		return this.tabs[name];
	},

	DAMetaContainer.prototype.SpriteWithName = function(name) {
		if(this.sprites.hasOwnProperty(name))
		{
			return this.sprites[name];
		}
		
		console.log("NO SPRITE NAMED " + name);
		return null;
	},

	DAMetaContainer.prototype.LabelWithName = function(name) {
		if(name.split("_")[0] == "txt_")
		{
			console.log("[ERROR] LabelWithName provides the txt_, you may omit it from your call!");
		}
		return this.labels[name];
	},

	DAMetaContainer.prototype.ButtonWithName = function(name) {
		if(name.split("_")[0] == "btn_")
		{
			console.log("[ERROR] ButtonWithName provides the btn_, you may omit it from your call!");
		}

		if(this.buttons.hasOwnProperty(name))
		{
			return this.buttons[name];
		}

		console.log("NO BUTTON NAMED " + name);
		return null;
	},

	DAMetaContainer.prototype.PlaceholderWithName = function(name) {
		if(name.split("_")[0] == "placeholder_")
		{
			console.log("[ERROR] PlaceholderWithName provides the placeholder_, you may omit it from your call!");
		}
		return this.placeholders[name];
	}

	DACore.DAMetaContainer = DAMetaContainer;










	
	






	return DACore;

});