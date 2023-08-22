export default class JourneyDrawer extends PIXI.Application {
    constructor(options, journeyEntity) {
        super(options);
        this.journey = journeyEntity;
        this.edit = false;
        this.drawing = false;
        this.stage.eventMode = 'static';
        this.drawingGraphics = new PIXI.Graphics();
        this.cursor = null;
        this.path = this.journey.flags.world?.journeyPath || [];


        this.init();

    }

    init() {
        this.setBackground();
        this.createGraphicLayer()
        if (this.path.length > 0) { this.drawPath() }
    }

    createGraphicLayer() {

        // Positionnement de this.drawingGraphics au-dessus de tout
        this.stage.addChild(this.drawingGraphics);
        // Événements de la souris pour le dessin
        this.drawingGraphics.eventMode = 'static';

        this.stage.on('mousemove', this.onMouseMove.bind(this));
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

        this.stage.addChild(background)
    }
    toggleEditMode() {
        this.edit = !this.edit;
        this.view.classList.toggle('edit');
        this.edit ? this.createCursor() : this.stopEdit()
    }
    async stopEdit() {
        this.deleteCursor();
        await this.journey.setFlag("world", "journeyPath", this.path)

    }
    createCursor() {
        // Create the circle
        this.cursor = this.stage.addChild(new PIXI.Graphics()
            .beginFill(0xff0000)
            .lineStyle({ color: "red", alpha: 0.5, width: 1 })
            .drawCircle(0, 0, 8)
            .endFill());
        this.cursor.name = "cursor";
        this.cursor.position.set(this.screen.width / 2, this.screen.height / 2);

        // Make sure the whole canvas area is interactive, not just the circle.
        this.stage.hitArea = this.screen;

        // Follow the pointer
        this.stage.addEventListener('pointermove', (e) => {
            this.cursor.position.copyFrom(e.global);
        });
    }
    deleteCursor() {
        this.stage.removeChild(this.stage.getChildByName('cursor'))

    }
    onMouseMove(event) {
        if (this.drawing) {
            this.addPathPoint(event);
            this.drawPath();
        }
    }
    onMouseDown(event) {
        if (!this.edit) { return }
        this.drawing = true;

        this.addPathPoint(event);
        this.drawPath()
    }
    addPathPoint(event) {
        let distance = 0;
        let lastPoint = this.path[this.path.length - 1];
        if (lastPoint) {
            let x = Math.sign(event.global.x) * event.global.x - lastPoint.x;
            let y = Math.sign(event.global.y) * event.global.y - lastPoint.y;
            distance = Math.sqrt(x * x + y + y);
            if (distance > 10) {
                this.path.push({ x: event.global.x, y: event.global.y });

            }

        } else {
            this.path.push({ x: event.global.x, y: event.global.y });

        }

    }
    drawPath() {
        this.drawingGraphics.clear();
        this.drawingGraphics.lineStyle(8, 0xFFFFFF, 3);
        this.drawingGraphics.moveTo(this.path[0].x, this.path[0].y);
        for (let coord of this.path) {
            this.drawingGraphics.lineTo(coord.x, coord.y)
        }
        this.stage.addChild(this.drawingGraphics);
    }
    async clearPath() {
        this.path = [];
        this.drawingGraphics.clear();
        await this.journey.setFlag("world", "journeyPath", this.path)

    }
    async undoPath() {
        this.path.pop();
        this.drawPath();
        await this.journey.setFlag("world", "journeyPath", this.path)

    }
    async onMouseUp() {
        this.drawing = false;
    }
}



