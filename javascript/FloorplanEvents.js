/** 
 * Author: Aaron Melocik, github.com/SterlingVix
 * Signed: 28 Nov 2015
 *  
 * Floorplan app events:
 *   registerNavButtons
 *   registerZoomEvents
 *     zoomIn
 *     zoomOut
 *   registerDragEvents
 *   registerTooltipAndPopoverEvents
 **/

Floorplan.prototype.registerFloorplanEvents = function () {
    // Register events on the nav bar buttons
    this.registerNavButtons();
    
    // Register events on the zoom buttons
    this.registerZoomEvents();

    // Register dragging events
    this.registerDragEvents();
}; // end registerFloorplanEvents()


/**
 * Handle nav bar buttons:
 *   When the main (brand) button is clicked, defer to
 *   the 'Home' button function.
 **/
Floorplan.prototype.registerNavButtons = function () {
    // Add event listeners
    this.navbarHomeButton.on('click', (function(event) {
        this.updateActiveNavbarButton(event.delegateTarget);
        this.appContainer.removeClass('hidden');
    }).bind(this)); // and addEventListener(click navbar 'home' button)
    
    this.navbarAboutButton.on('click', (function(event) {
        this.updateActiveNavbarButton(event.delegateTarget);
        this.aboutContainer.removeClass('hidden');
    }).bind(this)); // and addEventListener(click navbar 'about' button)
    
    this.navbarContactButton.on('click', (function(event) {
        this.updateActiveNavbarButton(event.delegateTarget);
        this.contactContainer.removeClass('hidden');
    }).bind(this)); // and addEventListener(click navbar 'contact' button)
    
    // Defer the main button to the 'Home' button function
    this.navbarBrandButton.on('click', (function(event) {
        this.updateActiveNavbarButton(this.navbarHomeButton);
        this.appContainer.removeClass('hidden');
    }).bind(this)); // and addEventListener(click navbar main brand button)
    
}; // end registerNavButtons


/**
 * Update values on all navbar buttons.
 **/
Floorplan.prototype.updateActiveNavbarButton = function (clickedButton) {
    // Remove the class 'active' from all buttons
    this.navbarBrandButton.removeClass('active');
    this.navbarHomeButton.removeClass('active');
    this.navbarAboutButton.removeClass('active');
    this.navbarContactButton.removeClass('active');
    
    // Add the class 'active' to the selected button
    $(clickedButton).addClass('active');
    
    // Hide all pages and let the calling function remove the 'hidden' tag
    this.appContainer.addClass('hidden');
    this.aboutContainer.addClass('hidden');
    this.contactContainer.addClass('hidden');
}; // end updateActiveNavbarButton

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
    favoriteButton.on('click', (function(event) {
        console.log('clicked favorite button at', event.delegateTarget);
    }).bind(this)); // end (cick favorite button)
}; // end registerFavoriteButton()
