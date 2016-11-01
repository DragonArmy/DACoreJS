requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        app: '../app'
    }
});

// Start the main app logic.
requirejs(['jquery-1.12.0.min', 'pixi.min', 'DACore/DACore'],
function   ($,                  PIXI,        DACore) {

    DACore.AliasFont("Arial-Regular", "Arial");
    // DACore.AliasFont("Cubano-Regular", )


    var renderer = PIXI.autoDetectRenderer(750, 1334, {
        antialias: true
    });

    renderer.backgroundColor = 0xa7dbf1;
    renderer.autoResize = true;
    
    var stage = new PIXI.Container();
    renderer.render(stage);

    document.body.appendChild(renderer.view);


    PIXI.loader
        //ATLASES
        .add("assets/atlas_pixi.json")

        //METADATA
        .add("assets/ui_pipeline_template_iphone6.txt")

        .load(setup);

    function setup()
    {
        console.log("ALL SET UP");


        var screen = new DACore.DAMetaContainer("ui_pipeline_template_iphone6");
        stage.addChild(screen);
        renderer.render(stage);

        console.log(screen);

        //interactivity test
        screen.TabWithName("square").cycle = ["on","off"];

        var positions = ["top","center","bottom"];
        var pindex = 2;

        screen.ButtonWithName("moveDown").onClick.push(function(button){
            pindex = (pindex + 1) % 3;
            screen.SpriteWithName("frame_if_no_scale9").x = screen.PlaceholderWithName(positions[pindex]).x;
            screen.SpriteWithName("frame_if_no_scale9").y = screen.PlaceholderWithName(positions[pindex]).y;
        });
        screen.ButtonWithName("moveUp").onClick.push(function(button){
            pindex = pindex - 1;
            while(pindex < 0)
            {
                pindex += 3;
            }
            screen.SpriteWithName("frame_if_no_scale9").x = screen.PlaceholderWithName(positions[pindex]).x;
            screen.SpriteWithName("frame_if_no_scale9").y = screen.PlaceholderWithName(positions[pindex]).y;
        });

    }

    function update()
    {
        requestAnimationFrame(update);
        renderer.render(stage);
    }
    update();

});