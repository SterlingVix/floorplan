var Floorplan = function (backgroundImageData, arrayOfBoothData, availableBoothText, bothFontSize, optionalContainerMaxWidth, optionalContainerMaxHeight) {
    /**
     * Floorplan object class variables.
     **/
    this.appContainer = $('.app-container');
    this.containerMaxWidth = optionalContainerMaxWidth || '1300px';
    this.containerMaxHeight = optionalContainerMaxHeight || '700px';
    this.measurementUnits = 'px';
    this.pathToLogos = 'images/logos/';
    this.availableBoothText = availableBoothText;
    this.bothFontSize = bothFontSize;
    this.backgroundImageElement = $('#background-image');
    this.bodyReference = $('body'); // cache this to avoid frequent DOM parsing (which is expensive).
    this.zoomInElement = $('#zoom-in');
    this.zoomOutElement = $('#zoom-out');
    this.backgroundImageElement.naturalWidth = backgroundImageData.imageWidth;
    this.backgroundImageElement.naturalHeight = backgroundImageData.imageHeight;
    this.imageBackgroundWidth = backgroundImageData.imageWidth;
    this.imageBackgroundHeight = backgroundImageData.imageHeight;
    this.backgroundImageElement.left = 0;
    this.backgroundImageElement.top = 0;
    this.backgroundImageScale = 1;
    this.dragging = false;
    this.mouseX = 0;
    this.mouseY = 0;
    this.boothElements = {};
    this.modals = {};
    
    // Assign backgroundImage of app-container
    this.setBackgroundImage(backgroundImageData, this.containerMaxWidth, this.containerMaxHeight, this.appContainer);

    // Create booth elements and populate with data
    this.createBoothElements(arrayOfBoothData);

    // Render modal elements
    this.renderModalElements();

    // Register events on the zoom buttons
    this.registerZoomEvents();

    // Register dragging events
    this.registerDragEvents();

}; // end Floorplan(backgroundImageData, arrayOfBoothData)

Floorplan.prototype.modalTemplate = {
    modalRoot: $('<div class="modal-dialog" role="document">'),
    modalContent: $('<div class="modal-content">'),
    modalHeader: $('<div class="modal-header">'),
    dismissButton: $('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'),
    modalBody: $('<div class="modal-body">'),
    modalCompanyInformation: $(''),
    modalFooter: $('<div class="modal-footer">'),
    buttonClose: $('<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>')
}; // end this.modalTemplate;

Floorplan.prototype.setBackgroundImage = function (backgroundImageData, containerMaxWidth, containerMaxHeight, imageContainer, optionalImageWidth, optionalImageHeight) {
    // Get pixel value of 80% height of container window
    var containedImageWidth = (this.appContainer.width() * 0.8);
    var containedImageHeight = (this.appContainer.height() * 0.8);

    // Set background image URL for element
    //    this.backgroundImageElement[0].style['background-image'] = 'url(' + backgroundImageData.imageURL + ')';
    this.backgroundImageElement.css({
        'width': this.backgroundImageElement.naturalWidth,
        'height': this.backgroundImageElement.naturalHeight,
        'background-image': 'url(' + backgroundImageData.imageURL + ')'
    });

    // Set Top and Left positions to center image
    this.positionBackgroundImage();

    // Calculate 2 possible scale values for 80% of the box size
    var backgroundWidthScale = containedImageWidth / backgroundImageData.imageWidth;
    var backgroundHeightScale = containedImageHeight / backgroundImageData.imageHeight;
    this.backgroundImageScale = backgroundHeightScale;

    // Set backgroundImageElement scale to smaller of 2 values
    if (backgroundWidthScale < backgroundHeightScale) {
        this.backgroundImageScale = backgroundWidthScale;
    }
    this.backgroundImageElement[0].style.transform = 'scale(' + this.backgroundImageScale + ')';
    this.backgroundImageElement.removeClass('invisible');
}; // end setBackgroundImage()

Floorplan.prototype.positionBackgroundImage = function () {
    // Get difference of app container dimension - background image dimension
    this.backgroundImageElement.left = this.appContainer.width() - this.backgroundImageElement.naturalWidth;
    this.backgroundImageElement.top = this.appContainer.height() - this.backgroundImageElement.naturalHeight;

    // if left and top are non-0, divide by 2 for 1/2 the margin space:
    if (this.backgroundImageElement.left) {
        this.backgroundImageElement.left /= 2;
    }
    if (this.backgroundImageElement.top) {
        this.backgroundImageElement.top /= 2;
    }

    this.backgroundImageElement[0].style.top = this.backgroundImageElement.top;
    this.backgroundImageElement[0].style.left = this.backgroundImageElement.left;
}; // end positionBackgroundImage


/**
 * Creates variables for booth data in Floorplan instance,
 * as well as the elements to insert into the DOM and
 * modal popup data.
 * 
 * @param {Object}  boothDataArray    Array of objects with booth data.
 *
 * See `dummyData.js` for an example of booth data.
 * A booth object has the following keys:
 * 
 *   company:                 (String)
 *   information:             (String)
 *   personell:               (Array of Strings)
 *   boothNumber:             (Int)
 *   logo:                    (String)
 *   coordinatesLeftX:        (Int)
 *     &  coordinatesRightX:  (Int)
 *     OR boothWidth:         (Int)
 *   coordinatesTopY:         (Int)
 *     &  coordinatesBottomY: (Int)
 *     OR boothHeight:        (Int)
 *   isAvailable:             (Bool)
 */
Floorplan.prototype.createBoothElements = function (boothDataArray) {
    // Set font size of booth text from user input in <style> tag
    $('head').append($('<style>.booth { font-size: ' + this.bothFontSize + '; }</style>'));
    
    // Check boothDataArray for 'right' or 'width'.
    var useWidthHeightFlag = false;
    if (!!boothDataArray[0].boothWidth) {
        useWidthHeightFlag = true;
    }

    // Parse data from boothDataArray, storing in Floorplan instance, and create DOM element.
    for (var i = 0; i < boothDataArray.length; i++) {
        var thisBoothData = boothDataArray[i];
        var boothElement = $('<div class="alert booth" data-company="' + thisBoothData.company +
//            '" data-toggle="modal" data-target="#modal-' + thisBoothData.boothNumber + '"></div>'); // MODAL code
//            '" data-toggle="tooltip" data-target="#modal-' + thisBoothData.boothNumber + '" title="' + thisBoothData.company + '"></div>'); // TOOLTIP code
            '" data-toggle="modal" data-target="#modal-' + thisBoothData.boothNumber + '" title="' + thisBoothData.company + '" data-content="At this booth:' + (thisBoothData.personell.join(', ')).toString() + '"></div>'); // MODAL + POPOVER code
        
        // Instantiate tooltip on this element
//        boothElement.tooltip({container: 'body'});
        boothElement.popover({container: 'body'});

        
//        boothElement.on('mouseover', function(event) { $(event.target).popover('show'); }); // end on(mouseover)
//        boothElement.on('mouseenter', function(event) { $(event.target).popover('show'); }); // end on(mouseover)
//        
//        boothElement.on('mouseout', function(event) { $(event.target).popover('hide'); }); // end on(mouseover)
//        boothElement.on('mouseleave', function(event) { $(event.target).popover('hide'); }); // end on(mouseover)
        
        
        
        // TODO: Try each of these combos and see which works.
        // Only works on root element, not on text, too. Can be solved with "pointer-events: none" on text elements?
        boothElement.on('mouseover', function(event) { $(event.target).popover('show'); }); boothElement.on('mouseout', function(event) { $(event.target).popover('hide'); }); 

        // boothElement.on('mouseover', function(event) { $(event.target).popover('show'); }); boothElement.on('mouseleave', function(event) { $(event.target).popover('hide'); }); 

        // boothElement.on('mouseenter', function(event) { $(event.target).popover('show'); }); boothElement.on('mouseout', function(event) { $(event.target).popover('hide'); }); 

        // boothElement.on('mouseenter', function(event) { $(event.target).popover('show'); }); boothElement.on('mouseleave', function(event) { $(event.target).popover('hide'); });  
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        // Add colors from Bootstrap's alert models
        if (thisBoothData.isAvailable) {
            //            boothElement.addClass('alert-success');
            boothElement.addClass('alert-info');
        } else {
            boothElement.addClass('alert-warning');
            //            boothElement.addClass('alert-danger');
        }

        var boothNumberElement = $('<p class="booth-number" data-booth-number="' + thisBoothData.boothNumber + '">' + thisBoothData.boothNumber + '</p>');
        var companyElement = $('<h4 class="company-name">' + thisBoothData.company + '</h4>');

        // Set unique CSS styles for this booth (primarily position)
        var boothStyles = {
            left: (thisBoothData.coordinatesLeftX + this.measurementUnits),
            top: (thisBoothData.coordinatesTopY + this.measurementUnits)
        };
        if (useWidthHeightFlag) {
            boothStyles.width = (thisBoothData.boothWidth + this.measurementUnits);
            boothStyles.height = (thisBoothData.boothHeight + this.measurementUnits);
        } else {
            boothStyles.width = (thisBoothData.coordinatesRightX - thisBoothData.coordinatesLeftX) + this.measurementUnits;
            boothStyles.height = (thisBoothData.coordinatesTopY - thisBoothData.coordinatesBottomY) + this.measurementUnits;
        }

        // Create CSS string for booth
        var boothCSSObject = {
            'left': boothStyles.left,
            'top': boothStyles.top,
            'width': boothStyles.width,
            'height': boothStyles.height
        };

        // add CSS styles to booth instance
        boothElement.css(boothCSSObject);

        // Add all boothData keys & values to the DOM Element Object
        for (key in thisBoothData) {
            boothElement[key] = thisBoothData[key];
        }

        // Hash this booth element to the 'this.boothElements' object with [[booth-number]] as the key.
        this.boothElements[thisBoothData.boothNumber] = boothElement;

        // Nest elements in one another.
        this.backgroundImageElement.append(this.boothElements[thisBoothData.boothNumber]);
        this.boothElements[thisBoothData.boothNumber].append(boothNumberElement);
        this.boothElements[thisBoothData.boothNumber].append(companyElement);
    } // end for(boothDataArray)
}; // end createBoothElements()

Floorplan.prototype.registerZoomEvents = function () {
    this.zoomInElement.on('click', function (event) {
        window.floorplan.zoomIn();
    });

    this.zoomOutElement.on('click', function (event) {
        window.floorplan.zoomOut();
    });

    // Mouse wheel functionality
    this.backgroundImageElement.on('wheel', function (event) {
        if (event.originalEvent.deltaY < 0) {
            window.floorplan.zoomIn();
        } else if (event.originalEvent.deltaY > 0) {
            window.floorplan.zoomOut();
        }
    });
}; // end registerZoomEvents()

Floorplan.prototype.zoomIn = function () {
    // TODO: consider refactoring out of the global space
    window.floorplan.backgroundImageElement[0].style.transform =
        'scale(' + (window.floorplan.backgroundImageScale *= 1.1) + ')';
}; // end zoomIn()

Floorplan.prototype.zoomOut = function () {
    // TODO: consider refactoring out of the global space
    window.floorplan.backgroundImageElement[0].style.transform =
        'scale(' + (window.floorplan.backgroundImageScale /= 1.1) + ')';
}; // end zoomOut()

// Register dragging functionality with 'mousedown', 'mouseup' and 'mousemove'
// TODO: Browser testing. This is not working on Firefox?
Floorplan.prototype.registerDragEvents = function () {
    this.backgroundImageElement[0].addEventListener('mousedown', function (event) {
        window.floorplan.mouseX = event.screenX;
        window.floorplan.mouseY = event.screenY;
        window.floorplan.dragging = true;
    });

//    this.backgroundImageElement[0].addEventListener('mouseup', function (event) {
    document.addEventListener('mouseup', function (event) {
        window.floorplan.dragging = false;
    });

    // Let the user drag the image
    this.appContainer[0].addEventListener('mousemove', function (event) {
        // Only move is the mouse is being held down
        if (window.floorplan.dragging) {
            
            // TODO: Try these both out for borwser compatability
            // if (!!event.movementX || !!event.movementY) {
            if (event.movementX !== undefined || event.movementY !== undefined) {
                // TESTING: for browser incompatability with older browsers.
                // Calculate change in distance
                event.movementX = event.screenX - window.floorplan.mouseX;
                event.movementY = event.screenY - window.floorplan.mouseY;

                // Log current (new) mouse position
                window.floorplan.mouseX = event.screenX;
                window.floorplan.mouseY = event.screenY;
            }
            // Update CSS top and left so the image position changes
            window.floorplan.backgroundImageElement[0].style.top = (window.floorplan.backgroundImageElement.top += event.movementY);
            window.floorplan.backgroundImageElement[0].style.left = (window.floorplan.backgroundImageElement.left += event.movementX);
        }
    }); // end mouseMove()
}; // end registerDragEvents()

/**
 * Create modal popup of booth info using
 * Bootstrap's modal: http://getbootstrap.com/javascript/#modals
 * 
 * Creates the DOM element, an object in memory available to
 * Javascript (floorplan.modals), and appends the modal to
 * the end of the <body>. Bootstrap provides the majority of
 * the necessary modal functionality and styling.
 * 
 * Although we could do this operation during the first pass of
 * booth data parsing, we are doing it here (later) so that the
 * DOM can render visible content, even though it won't be
 * interactive for a second or so.
 **/
Floorplan.prototype.renderModalElements = function () {
    for (key in this.boothElements) {
        this.createModal(this.boothElements[key]);
    }
}; // end renderModalElements()


Floorplan.prototype.createModal = function (boothData) {
    // If defined, cast personell array contents to comma-separated string.
    var personellString = ''; 
    if (!!boothData.personell && boothData.personell.length !== 0) {
        personellString = '<span class="exhibitors">Exhibitors: </span>' + boothData.personell.join(', ');        
    }
    
    // Create popup modal element
    var modal = $('<div class="modal fade" id="modal-' + boothData.boothNumber + '" tabindex="-1" role="dialog"></div>');

    // TODO: Update for "available" booths here!
    
    // HTML Strings for specific modal elements
    var modalImageHTML = '';
    var modalTitleHTML = '<h4 class="modal-title booth-available" id="modal-label-' + boothData.boothNumber + '">Available to reserve (Booth ' + boothData.boothNumber + ')</h4>';
    var companyInformationHTML = '<p class="company-information available-booth-information">' + this.availableBoothText + '</p>';
    var favoriteButtonHTML = '';
    
    // Update the placeholder strings if the booth is taken
    if (!boothData.isAvailable) {
        favoriteButtonHTML = '<button type="button" class="btn btn-primary btn-favorite">Favorite <span id="zoom-in" class="glyphicon glyphicon-heart glyphicon-favorite"></span></button>';
//        favoriteButtonHTML = '<button type="button" class="btn btn-primary">Favorite <span id="zoom-in" class="glyphicon glyphicon-star-empty glyphicon-favorite"></span></button>';
        
        if (boothData.logo) {
//            modalImageHTML = ' <div class="modal-image-container"><img class="company-logo" src="' + this.pathToLogos + boothData.logo + '" /></div>';
            modalImageHTML = ' <div class="modal-image-container" style="background-image: url(' + this.pathToLogos + boothData.logo + ')"></div>';
        }
        if (boothData.company) {
            modalTitleHTML = '<h4 class="modal-title" id="modal-label-' + boothData.boothNumber + '">' + boothData.company + ' (Booth ' + boothData.boothNumber + ')</h4>'
        }
        if (boothData.information) {
            companyInformationHTML = '<p class="company-information">' + boothData.information + '</p>';
        }
    }

    // Long text string for innerHTML of modal element
    var modalHTML = '<div class="modal-dialog" role="document">'
    + '    <div class="modal-content">'
    + '        <div class="modal-header">'
    + '            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
    +              modalTitleHTML
    + '        </div>'
    + '        <div class="modal-body">'
    +              modalImageHTML
    + '            <p class="company-personell">' + personellString + '</p>'
    +              companyInformationHTML
    + '        </div>'
    + '        <div class="modal-footer">'
    + '            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'
    +              favoriteButtonHTML
    + '        </div>'
    + '    </div>' 
    + '</div>';

    // Assign innerHTML to modal element
    modal.html(modalHTML);

    // Hash this booth modal to the 'this.modals' object with [[boothNumber]] as the key.
    this.modals[boothData.boothNumber] = modal;
    this.bodyReference.append(this.modals[boothData.boothNumber]);
}; // end createModal()


Floorplan.prototype.createTooltip = function (boothData) {
//    <button type="button" class="btn btn-default" data-toggle="tooltip" data-placement="top" title="Tooltip on top">Tooltip on top</button>
    
    $(function () {
  $('[data-toggle="tooltip"]').tooltip()
})
    
    $('#example').tooltip(options)
    
    
}; // end createTooltip()
/**
Floorplan.prototype.createModal = function (boothData) {    
    // If defined, cast personell array contents to comma-separated string.
    var personellString = ''; 
    if (!!boothData.personell && boothData.personell.length !== 0) {
        personellString = '<span class="exhibitors">Exhibitors: </span>' + boothData.personell.join(', ');        
    }
    
    // Clone the prototype template object for local use
    var thismodalTemplate = Object.create(this.modalTemplate);
    // Create popup modal element
    var modal = $('<div class="modal fade" id="modal-' + boothData.boothNumber + '" tabindex="-1" role="dialog"></div>');
    
    var modalImage = $('<span>');
    var modalTitle = $(('<h4 class="modal-title booth-available" id="modal-label-' + boothData.boothNumber + '">Available to reserve (Booth ' + boothData.boothNumber + ')</h4>'));
    var companyInformation = $('<p class="company-information available-booth-information">' + this.availableBoothText + '</p>');
    var favoriteButton = $('<span>');
    var modalPersonell = $('<span>');
    
    // Update the placeholder strings if the booth is taken
    if (!boothData.isAvailable) {
        modalPersonell = $(('<p class="company-personell">' + personellString + '</p>'));
            
        if (boothData.logo) {
            modalImage = $('<div class="modal-image-container" style="background-image: url(' + this.pathToLogos + boothData.logo + ')"></div>');
        }
        if (boothData.company) {
            modalTitle = $(('<h4 class="modal-title" id="modal-label-' + boothData.boothNumber + '">' + boothData.company + ' (Booth ' + boothData.boothNumber + ')</h4>'));
        }
        if (boothData.information) {
            modalCompanyInformation = $('<p class="company-information">' + boothData.information + '</p>');
        }
        favoriteButton = $('<button type="button" class="btn btn-primary btn-favorite" data-modal-booth-number="' + boothData.boothNumber + '">Favorite <span id="zoom-in" class="glyphicon glyphicon-heart glyphicon-favorite"></span></button>');
        // favoriteButton = $('<button type="button" class="btn btn-primary">Favorite <span id="zoom-in" class="glyphicon glyphicon-star-empty glyphicon-favorite"></span></button>)';
    }

    // Collect modal elements into single modal element
    modal.append(Object.create(thismodalTemplate.modalRoot));
        $(thismodalTemplate.modalRoot).append(Object.create(thismodalTemplate.modalContent));
            $(thismodalTemplate.modalContent).append(Object.create(thismodalTemplate.modalHeader));
                $(thismodalTemplate.modalHeader).append(Object.create(thismodalTemplate.buttonClose));
                $(thismodalTemplate.modalHeader).append(Object.create(modalTitle));
            $(thismodalTemplate.modalContent).append(Object.create(thismodalTemplate.modalBody));
                $(thismodalTemplate.modalBody).append(Object.create(modalImage));
                $(thismodalTemplate.modalBody).append(Object.create(modalPersonell));
                $(thismodalTemplate.modalBody).append(Object.create(modalCompanyInformation));
            $(thismodalTemplate.modalContent).append(Object.create(thismodalTemplate.modalFooter));
                $(thismodalTemplate.modalFooter).append(Object.create(thismodalTemplate.buttonClose));
                $(thismodalTemplate.modalFooter).append(Object.create(favoriteButton));

    // Hash this booth modal to the 'this.modals' object with [[boothNumber]] as the key.
    this.modals[boothData.boothNumber] = modal;
    this.bodyReference.append(this.modals[boothData.boothNumber]);
    
    
    // OBSOLETE:
    // HTML Strings for specific modal elements
    //    var modalImageHTML = '';
    //    var modalTitleHTML = '<h4 class="modal-title booth-available" id="modal-label-' + boothData.boothNumber + '">Available to reserve (Booth ' + boothData.boothNumber + ')</h4>';
    //    var companyInformationHTML = '<p class="company-information available-booth-information">' + this.availableBoothText + '</p>';
    //    var favoriteButtonHTML = '';
    //        favoriteButtonHTML = '<button type="button" class="btn btn-primary btn-favorite">Favorite <span id="zoom-in" class="glyphicon glyphicon-heart glyphicon-favorite"></span></button>';
    //        favoriteButtonHTML = '<button type="button" class="btn btn-primary">Favorite <span id="zoom-in" class="glyphicon glyphicon-star-empty glyphicon-favorite"></span></button>';
    //            modalImageHTML = ' <div class="modal-image-container"><img class="company-logo" src="' + this.pathToLogos + boothData.logo + '" /></div>';
    //            modalTitleHTML = '<h4 class="modal-title" id="modal-label-' + boothData.boothNumber + '">' + boothData.company + ' (Booth ' + boothData.boothNumber + ')</h4>'
    //            companyInformationHTML = '<p class="company-information">' + boothData.information + '</p>';
    
    // Long text string for innerHTML of modal element
    //    var modalHTML = '<div class="modal-dialog" role="document">'
    //    + '    <div class="modal-content">'
    //    + '        <div class="modal-header">' 
    //    + '            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
    //    +              modalTitleHTML
    //    + '        </div>'
    //    + '        <div class="modal-body">'
    //    +              modalImageHTML
    //    + '            <p class="company-personell">' + personellString + '</p>'
    //    +              companyInformationHTML
    //    + '        </div>'
    //    + '        <div class="modal-footer">'
    //    + '            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'
    //    +              favoriteButtonHTML
    //    + '        </div>'
    //    + '    </div>' 
    //    + '</div>';
}; // end createModal()
**/