/**
 * Floorplan app events:
 *   registerZoomEvents
 *     zoomIn
 *     zoomOut
 *   registerDragEvents
 *   registerTooltipAndPopoverEvents
 **/
Floorplan.prototype.registerFloorplanEvents = function () {
    // Register events on the zoom buttons
    this.registerZoomEvents();

    // Register dragging events
    this.registerDragEvents();
}; // end registerFloorplanEvents()


/**
 * Zoom events bound to '+' and '-' buttons and mouse wheel scrolling.
 * TODO: mobile pinch?
 **/
Floorplan.prototype.registerZoomEvents = function () {
    this.zoomInElement.on('click', (function (event) {
        this.zoomIn();
    }).bind(this));

    this.zoomOutElement.on('click', (function (event) {
        this.zoomOut();
    }).bind(this));

    // Mouse wheel functionality
    this.backgroundImageElement.on('wheel', (function (event) {
        if (event.originalEvent.deltaY < 0) {
            this.zoomIn();
        } else if (event.originalEvent.deltaY > 0) {
            this.zoomOut();
        }
    }).bind(this));
}; // end registerZoomEvents()

Floorplan.prototype.zoomIn = function () {
    this.backgroundImageElement[0].style.transform =
        'scale(' + (this.backgroundImageScale *= this.backgroundImageZoomAmount) + ')';
}; // end zoomIn()

Floorplan.prototype.zoomOut = function () {
    this.backgroundImageElement[0].style.transform =
        'scale(' + (this.backgroundImageScale /= this.backgroundImageZoomAmount) + ')';
}; // end zoomOut()


/**
 * Register dragging functionality with 'mousedown', 'mouseup' and 'mousemove'
 * TODO: mobile touch?
 * TODO: Browser testing. This is not working on Firefox?
 **/
Floorplan.prototype.registerDragEvents = function () {
    this.backgroundImageElement[0].addEventListener('mousedown', (function (event) {
        this.mouseX = event.screenX;
        this.mouseY = event.screenY;
        this.dragging = true;
    }).bind(this));

    document.addEventListener('mouseup', (function (event) {
        this.dragging = false;
    }).bind(this));

    // Let the user drag the image
    this.appContainer[0].addEventListener('mousemove', (function (event) {
        // Only move is the mouse is being held down
        if (this.dragging) {

            // TODO: Try these both out for borwser compatability
            // if (!!event.movementX || !!event.movementY) {
            if (event.movementX !== undefined || event.movementY !== undefined) {
                // TESTING: for browser incompatability with older browsers.
                // Calculate change in distance
                event.movementX = event.screenX - this.mouseX;
                event.movementY = event.screenY - this.mouseY;

                // Log current (new) mouse position
                this.mouseX = event.screenX;
                this.mouseY = event.screenY;
            }
            // Update CSS top and left so the image position changes
            this.backgroundImageElement[0].style.top = (this.backgroundImageElement.top += event.movementY);
            this.backgroundImageElement[0].style.left = (this.backgroundImageElement.left += event.movementX);
        }
    }).bind(this)); // end mouseMove()
}; // end registerDragEvents()


/**
 * Register popover and tooltip events. Invoked from
 * 'createBoothElement()'.
 **/
Floorplan.prototype.registerTooltipAndPopoverEvents = function (boothElement) {
    boothElement.popover({
        container: 'body'
    });

    boothElement.on('mouseover', function (event) {
        $(event.delegateTarget).popover('show');
    });

    boothElement.on('mouseout', function (event) {
        $(event.delegateTarget).popover('hide');
    });
}; // end registerTooltipAndPopoverEvents(boothElement)
    

/**
 * Register function of "favorite" button in modal
 **/
Floorplan.prototype.registerFavoriteButton = function(favoriteButton) {
    console.log(favoriteButton);
    
    favoriteButton.on('click', (function(event) {
        console.log('clicked favorite button at', event.delegateTarget);
    }).bind(this)); // end (cick favorite button)
}; // end registerFavoriteButton()
