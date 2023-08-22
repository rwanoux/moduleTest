export default class JourneyDrawer extends PIXI.Application {
    constructor(options, journeyEntity) {
        super(options);
        this.journey = journeyEntity;
        this.edit = false;
        this.drawing = false;
        this.stage.eventMode = 'static';
        this.drawingGraphics = new PIXI.Graphics();
        this.cursor = null;


        this.init();

    }

    init() {
        this.setBackground();
        this.createGraphicLayer()
        // Ajout de la couche de dessin

    }
    createGraphicLayer() {
        this.drawingGraphics.x = this.screen.width / 2;
        this.drawingGraphics.y = this.screen.height / 2;

        // Positionnement de this.drawingGraphics au-dessus de tout
        this.stage.addChild(this.drawingGraphics);
        // Événements de la souris pour le dessin
        this.drawingGraphics.eventMode = 'static';
        this.stage.on('mousedown', this.onMouseDown.bind(this));
        this.stage.on('mouseup', this.onMouseUp.bind(this));
        this.stage.addChild(this.drawingGraphics);
    }
    setBackground() {
        const background = PIXI.Sprite.from(this.journey.img)
        // center the sprite's anchor point
        background.anchor.set(0.5)
        // move the sprite to the center of the screen
        background.x = this.screen.width / 2
        background.y = this.screen.height / 2;
        console.log('_______________', background)
        let ratio = background.width / background.height

        if (background.width > background.height) {
            background.width = this.screen.width;
            background.height = background.width / ratio
        } else {
            background.height = this.screen.height;
            background.width = background.height * ratio
        }
        this.stage.addChild(background)
    }
    toggleEditMode() {
        this.edit = !this.edit;
        this.view.classList.toggle('edit');
        this.edit ? this.createCursor() : this.deleteCursor()
    }
    createCursor() {
        // Create the circle
        this.cursor = this.stage.addChild(new PIXI.Graphics()
            .beginFill(0xff0000)
            .lineStyle({ color: "red", alpha: 0.5, width: 1 })
            .drawCircle(0, 0, 8)
            .endFill());
        this.cursor.name="cursor";
        this.cursor.position.set(this.screen.width / 2, this.screen.height / 2);
        console.log(this.cursor.name)

        // Make sure the whole canvas area is interactive, not just the circle.
        this.stage.hitArea = this.screen;

        // Follow the pointer
        this.stage.addEventListener('pointermove', (e) => {
            this.cursor.position.copyFrom(e.global);
        });
    }
    deleteCursor() {
        console.log(this.stage.children.filter(ch=>ch.name=="cursor"));
        this.stage.removeChildren(1)
            console.log(this.stage.children.filter(ch=>ch.name=="cursor"));

    }
    onMouseDown(event) {
    if (!this.edit){return}
    this.drawing=true;
        this.drawPath(event)
    }

    drawPath(event){
        console.log("drawing")
    }

    onMouseUp() {
        this.drawing = false;
    }
}



