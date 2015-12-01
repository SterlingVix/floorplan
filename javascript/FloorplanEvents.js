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

    // Register clear all highlights event
    this.registerClearAllButton();
}; // end registerFloorplanEvents()


/**
 * Handle nav bar buttons:
 *   When the main (brand) button is clicked, defer to
 *   the 'Home' button function.
 **/
Floorplan.prototype.registerNavButtons = function () {
    // When clicking the main event button, close all drawers
    this.navbarBrandButton.on('click', (function (event) {
        if (!!this.navbarExhibitorListButton[0].isActiveFlag === true) {
            this.navbarExhibitorListButton.click();
        }
        if (!!this.navbarProductFilterListButton[0].isActiveFlag === true) {
            this.navbarProductFilterListButton.click();
        }
    }).bind(this)); // and addEventListener(click navbar main brand button)

    
    // Exhibitor drawer logic
    this.navbarExhibitorListButton.on('click', (function (event) {
        // Flip the active state of this element
        if (!event.delegateTarget.isActiveFlag) {            
            
            // isActiveFlag is false or doesn't exist, so activate
            event.delegateTarget.isActiveFlag = true;
            $(event.delegateTarget).addClass('active');
            // this.exhibitorListContainer.removeClass('hidden');
            this.exhibitorListContainer.removeClass('closed');
        } else {
            // isActiveFlag is true, so deactivate
            event.delegateTarget.isActiveFlag = false;
            $(event.delegateTarget).removeClass('active');
            // this.exhibitorListContainer.addClass('hidden');
            this.exhibitorListContainer.addClass('closed');
        }
    }).bind(this)); // end addEventListener(click navbar 'Exhibitor' button)
    
    
    // Product filter drawer logic
    this.navbarProductFilterListButton.on('click', (function (event) {
        // Flip the active state of this element
        if (!event.delegateTarget.isActiveFlag) {
            
            // isActiveFlag is false or doesn't exist, so activate
            event.delegateTarget.isActiveFlag = true;
            $(event.delegateTarget).addClass('active');
            this.productFilterListContainer.removeClass('closed');
        } else {
            // isActiveFlag is true, so deactivate
            event.delegateTarget.isActiveFlag = false;
            $(event.delegateTarget).removeClass('active');
            this.productFilterListContainer.addClass('closed');
        }
    }).bind(this)); // end addEventListener(click navbar 'Products' button)
    
    
    // OLD and bosolete code, but leaving in case we want to redo pages.
    // this.navbarHomeButton.on('click', (function (event) {
    //     this.updateActiveNavbarButton(event.delegateTarget);
    //     this.appContainer.removeClass('hidden');
    // }).bind(this)); // and addEventListener(click navbar 'home' button)
    //
    // this.navbarAboutButton.on('click', (function (event) {
    //     this.updateActiveNavbarButton(event.delegateTarget);
    //     this.aboutContainer.removeClass('hidden');
    // }).bind(this)); // and addEventListener(click navbar 'about' button)
    //
    // this.navbarContactButton.on('click', (function (event) {
    //     this.updateActiveNavbarButton(event.delegateTarget);
    //     this.contactContainer.removeClass('hidden');
    // }).bind(this)); // and addEventListener(click navbar 'contact' button)
}; // end registerNavButtons


/**
 * Update values on all navbar buttons.
 **/
Floorplan.prototype.updateActiveNavbarButton = function (clickedButton) {
    // Remove the class 'active' from all buttons
    this.navbarBrandButton.removeClass('active');
    this.navbarHomeButton.removeClass('active');
    // this.navbarExhibitorListButton.removeClass('active');
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
 * Register function of "flag" button in modal
 **/
Floorplan.prototype.registerFlagButton = function (flagButton) {
    flagButton.on('click', (function (event) {
        // Get booth number for booth to flag
        var boothNumberToFlag = $(event.delegateTarget).attr('data-booth-number');
        boothNumberToFlag = parseInt(boothNumberToFlag);
        
        // Get reference to booth flag span element
        var thisFlag = this.boothElements[boothNumberToFlag];
        thisFlag = thisFlag.find('.booth-flag');
        
        // Flip the active state of this element
        if (!event.delegateTarget.isActiveFlag) {            
            // isActiveFlag is false or doesn't exist, so activate
            event.delegateTarget.isActiveFlag = true;
            $(event.delegateTarget).addClass('active');
            thisFlag.removeClass('hidden');
        } else {
            // isActiveFlag is true, so deactivate
            event.delegateTarget.isActiveFlag = false;
            $(event.delegateTarget).removeClass('active');
            thisFlag.addClass('hidden');
        }        
    }).bind(this)); // end (click flag button)
}; // end registerFlagButton()


/**
 * Register highlighting function of clicking exhibitor names from list
 **/
Floorplan.prototype.registerExhibitorHighlightButton = function (exhibitorElement) {
    exhibitorElement.on('click', (function (event) {

        // Get booth number from element
        var boothNumber = exhibitorElement.attr('data-booth-number');

        // Convert boothNumber to array to handle multiple booths with same company name
        var boothNumberArray = boothNumber.split(',');

        // Get highlighted value from element
        var isHighlighted = exhibitorElement.attr('data-highlighted');
        
        // If this element is highlighted, 
        if (isHighlighted === 'true') {
            exhibitorElement.attr('data-highlighted', 'false');
            exhibitorElement.attr('data-color-palette', 'color3');
            exhibitorElement.removeClass('highlighted');

            // Un-highlight booths for all booth numbers in the array
            for (var i = 0; i < boothNumberArray.length; i++) {
                var thisBoothNumber = parseInt(boothNumberArray[i]);
                this.boothElements[thisBoothNumber].removeClass('highlighted');
            }
        } else {
            // element is not highlighted
            exhibitorElement.attr('data-highlighted', 'true');
            exhibitorElement.attr('data-color-palette', 'color2');
            exhibitorElement.addClass('highlighted');

            // Highlight booths for all booth numbers in the array
            for (var i = 0; i < boothNumberArray.length; i++) {
                var thisBoothNumber = parseInt(boothNumberArray[i]);
                this.boothElements[thisBoothNumber].addClass('highlighted');
            }
        } // end if-else (exhibitor elements are highlighted)
    }).bind(this)); // end (click flag button)
}; // end registerExhibitorHighlightButton()





/**
 * Register highlighting function of clicking product from list
 **/
Floorplan.prototype.registerProductFilterHighlightButton = function (productFilterElement) {
    productFilterElement.on('click', (function (event) {

        
        // TODO - update with correct logic
        
        
        // Get booth number from element
        var boothNumber = productFilterElement.attr('data-booth-number');

        // Convert boothNumber to array to handle multiple booths with same company name
        var boothNumberArray = boothNumber.split(',');

        // Get highlighted value from element
        var isHighlighted = productFilterElement.attr('data-highlighted');
        
        // If this element is highlighted, 
        if (isHighlighted === 'true') {
            productFilterElement.attr('data-highlighted', 'false');
            productFilterElement.attr('data-color-palette', 'color3');
            productFilterElement.removeClass('highlighted');

            // Un-highlight booths for all booth numbers in the array
            for (var i = 0; i < boothNumberArray.length; i++) {
                var thisBoothNumber = parseInt(boothNumberArray[i]);
                this.boothElements[thisBoothNumber].removeClass('highlighted');
            }
        } else {
            // element is not highlighted
            productFilterElement.attr('data-highlighted', 'true');
            productFilterElement.attr('data-color-palette', 'color2');
            productFilterElement.addClass('highlighted');

            // Highlight booths for all booth numbers in the array
            for (var i = 0; i < boothNumberArray.length; i++) {
                var thisBoothNumber = parseInt(boothNumberArray[i]);
                this.boothElements[thisBoothNumber].addClass('highlighted');
            }
        } // end if-else (product elements are highlighted)
    }).bind(this)); // end (click flag button)
}; // end registerProductFilterHighlightButton()





/**
 * Register function of "Clear All" buttons in drawers
 **/
Floorplan.prototype.registerClearAllButton = function () {
    // Exhibitor drawer clear all button
    this.exhibitorClearAllButton.on('click', (function (event) {
        var highlightedElements = $('.highlighted');

        for (var i = 0; i < highlightedElements.length; i++) {
            $(highlightedElements[i]).removeClass('highlighted');
            if ( ($(highlightedElements[i]).attr('data-highlighted')) === 'true') {
                $(highlightedElements[i]).attr('data-highlighted', 'false');
                $(highlightedElements[i]).attr('data-color-palette', 'color3');
            }
        } // end for (all highlighted elements)
    }).bind(this)); // end (click clear all button)

    
    // Product filter drawer clear all button
    this.productFilterClearAllButton.on('click', (function (event) {
        var fadedElements = $('.booth-faded');

        for (var i = 0; i < fadedElements.length; i++) {
            $(fadedElements[i]).removeClass('booth-faded');
            if ( ($(fadedElements[i]).attr('data-booth-faded')) === 'true') {
                $(fadedElements[i]).attr('data-booth-faded', 'false');
                $(fadedElements[i]).attr('data-color-palette', 'color3');
            }
        } // end for (all booth-faded elements)
    }).bind(this)); // end (click clear all button)
}; // end registerClearAllButton()