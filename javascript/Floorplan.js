/** 
 * Author: Aaron Melocik, github.com/SterlingVix
 * Signed: 28 Nov 2015
 * 
 * This is the main function which instantiates a floorplan instance.
 * It coordinates which .xml data file to download, retrieves the .xml data,
 * parses the data for booth and exhibitor information, downloads additional
 * resources, creates booth elements, populates booth elements, and populates
 * filters and lists.
 * 
 * PARAMETERS:
 *   floorplanAppOptions: @object, contains setup information including:
 *     (TODO: obsolete?) eventDataFilename: OPTIONAL @string, floorplan .xml filename.
 *     availableBoothText: OPTIONAL @string, default available booth text.
 *     boothFontSize: OPTIONAL @string, default font size for floorplan booth overview.
 *     initialZoomLevel: OPTIONAL @int, initial zoom level of floorplan view.
 *     backgroundImageZoomAmount: OPTIONAL @int, amount of zoom on each scroll / click.
 **/
var Floorplan = function (floorplanAppOptions) {
    /**
     * Floorplan object class variables and container elements.
     **/
    this.appContainer = $('.app-container');
    this.aboutContainer = $('#about-page');
    this.contactContainer = $('#contact-page');
    this.containerMaxWidth = floorplanAppOptions.optionalContainerMaxWidth || '1300px';
    this.containerMaxHeight = floorplanAppOptions.optionalContainerMaxHeight || '700px';
    this.measurementUnits = 'px';
    this.eventName = '';

    /**
     * Nav bar elements
     **/
    this.navbarBrandButton = $('.navbar-brand');
    this.navbarHomeButton = $('#navbar-button-home a');
    this.navbarAboutButton = $('#navbar-button-about');
    this.navbarContactButton = $('#navbar-button-contact');

    /**
     * Interface Elements
     **/
    this.backgroundImageElement = $('#background-image');
    this.bodyReference = $('body'); // cache this to avoid frequent DOM parsing (which is expensive).
    this.zoomInElement = $('#zoom-in');
    this.zoomOutElement = $('#zoom-out');

    /**
     * Application data
     **/
    // NOTE: Update this path depending on whether or not the relative path is included in the XML file.
    //    this.pathToLogos = 'images/logos';
    this.pathToLogos = '';
    this.availableBoothText = floorplanAppOptions.availableBoothText;
    this.boothFontSize = floorplanAppOptions.boothFontSize;
    this.backgroundImageElement.left = 0;
    this.backgroundImageElement.top = 0;
    this.backgroundImageScale = 1;
    this.backgroundImageZoomAmount = floorplanAppOptions.backgroundImageZoomAmount || 1.1;
    this.dragging = false;
    this.initialZoomLevel = floorplanAppOptions.initialZoomLevel || 1;
    this.mouseX = 0;
    this.mouseY = 0;
    this.boothElements = {};
    this.modals = {};

    // Get the eventDataFilename from either the floorplanAppOptions parameter or the URL
    this.getEventDataFilename(floorplanAppOptions);

    // Set custom page styles if set during instantiation.
    this.setPageStyles();

    // Create 'available booth' content
    this.createAvailableBoothContent();

    // Get booth data from server - function is in FloorplanAJAX.js
    this.getBoothData();
}; // end Floorplan()


/**
 * Get the eventDataFilename from either the floorplanAppOptions parameter or the URL
 **/
Floorplan.prototype.getEventDataFilename = function (floorplanAppOptions) {
    if (!!floorplanAppOptions.eventDataFilename) {
        this.eventDataFilename = floorplanAppOptions.eventDataFilename;
    } else {
        var thisURL = document.URL.toString();
        var hashLocation = (thisURL.search(new RegExp('#'))) + 1;
        this.eventDataFilename = (thisURL.substring(hashLocation, thisURL.length));

        // Update HOME and eventButton hrefs. Use innerHTML for Home button.
        this.navbarBrandButton.attr('href', ('#' + this.eventDataFilename));
        this.navbarHomeButton.attr('href', ('#' + this.eventDataFilename));
//        this.navbarHomeButton.innerHTML = '<a href="#' + this.eventDataFilename + '">Home</a>';
    }
}; // end getEventDataFilename()


/**
 * Set font size (in <style> tag) of booth text from user input
 **/
Floorplan.prototype.setPageStyles = function () {
    $('head').append($('<style>.booth { font-size: ' + this.boothFontSize + '; }</style>'));
}; // end setPageStyles()


/**
 * Parse 'available booth' text for contact info and add hyperlink
 **/
Floorplan.prototype.createAvailableBoothContent = function () {
    var hasContactOption = this.availableBoothText.search(new RegExp('contact us'));

    if (hasContactOption !== -1) {
        var availableBoothStartText = this.availableBoothText.slice(0, hasContactOption);
        // var availableBoothStartSpan = '<span class="available-booth-text"></span>';
        var contactLink = '<a class="available-booth-text contact-link" href="mailto:info@activeeventtechnology.com?subject=Subject">contact us</a>';
        var availableBoothEndText = this.availableBoothText.slice((hasContactOption + 10), this.availableBoothText.length);
        // var availableBoothEndSpan = '<span class="available-booth-text"></span>';

        this.availableBoothHTML = availableBoothStartText + contactLink + availableBoothEndText;
    } // end if (has contact option)
}; // end createAvailableBoothContent()


/**
 * Set the background image and initial scale of draggable container.
 **/
Floorplan.prototype.setBackgroundImage = function (backgroundImageData, containerMaxWidth, containerMaxHeight, imageContainer, optionalImageWidth, optionalImageHeight) {
    this.backgroundImageElement.naturalWidth = this.backgroundImageData.imageWidth;
    this.backgroundImageElement.naturalHeight = this.backgroundImageData.imageHeight;
    this.imageBackgroundWidth = this.backgroundImageData.imageWidth;
    this.imageBackgroundHeight = this.backgroundImageData.imageHeight;

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

    // Set backgroundImageElement scale to smaller of 2 values
    if (backgroundWidthScale < backgroundHeightScale) {
        this.backgroundImageScale = backgroundWidthScale;
    } else {
        this.backgroundImageScale = backgroundHeightScale;
    }

    // Multiply backgroundImageScale by initial zoom level
    this.backgroundImageScale *= this.initialZoomLevel;

    this.backgroundImageElement[0].style.transform = 'scale(' + this.backgroundImageScale + ')';
    this.backgroundImageElement.removeClass('invisible');
}; // end setBackgroundImage()


/**
 * Position the background image in the center of the screen.
 **/
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
 * A booth object has the following keys:
 * 
 *   boothHeight:       (Int)
 *   boothNumber:       (Int)
 *   boothWidth:        (Int)
 *   coordinatesLeftX:  (Int)
 *   coordinatesTopY:   (Int)
 *   colorBackground:   (Int)?
 *   colorForeground:   (Int)?
 *   email:             (String) // null
 *   id:                (Int)
 *   iframeReference:   (String)
 *   information:       (String)
 *   isAvailable:       (Bool)
 *   logo:              (String)
 *   organizationDesc:  (String)
 *   personell:         (Array of Strings) // null
 *   tooltip:           (String)
 *   website:           (String) // null
 **/
Floorplan.prototype.createBoothElement = function (thisBoothData) {
    //    var boothElement = $('<div class="alert booth no-text-selection" data-company="' + thisBoothData.companyName +
    var boothElement = $('<div class="booth no-text-selection" data-company="' + thisBoothData.organizationDesc +
        '" data-toggle="modal" data-target="#modal-' + thisBoothData.boothNumber +
        '" title="' + thisBoothData.organizationDesc +
        // '" data-content="At this booth: ' + thisBoothData.personell +
        '" data-content="' + thisBoothData.tooltip +
        '"></div>'); // MODAL + POPOVER code

    // Instantiate tooltip and popover events on this element
    this.registerTooltipAndPopoverEvents(boothElement);

    // DEPRECATED - Add colors from Bootstrap's alert models
    //    if (thisBoothData.isAvailable) {
    // boothElement.addClass('alert-info');
    //    } else {
    // boothElement.addClass('alert-warning');
    //    }

    var boothNumberElement = $('<p class="booth-number" data-booth-number="' + thisBoothData.boothNumber + '">' + thisBoothData.boothNumber + '</p>');
    var companyElement = $('<h4 class="company-name">' + thisBoothData.organizationDesc + '</h4>');

    // Set unique CSS styles for this booth (primarily position)
    boothElement.css({
        left: (thisBoothData.coordinatesLeftX + this.measurementUnits),
        top: (thisBoothData.coordinatesTopY + this.measurementUnits),
        width: (thisBoothData.boothWidth + this.measurementUnits),
        height: (thisBoothData.boothHeight + this.measurementUnits),
        // color: thisBoothData.colorForeground,
        'background-color': thisBoothData.colorBackground
    });

    // Add all boothData keys & values to the boothElement DOM Elememt
    for (key in thisBoothData) {
        boothElement[key] = thisBoothData[key];
        // console.log(key, boothElement[key]);
    }

    // Hash this booth element to the 'this.boothElements' object with [[booth-number]] as the key.
    this.boothElements[thisBoothData.boothNumber] = boothElement;

    // Nest elements in one another.
    this.backgroundImageElement.append(this.boothElements[thisBoothData.boothNumber]);
    this.boothElements[thisBoothData.boothNumber].append(boothNumberElement);
    this.boothElements[thisBoothData.boothNumber].append(companyElement);
}; // end createBoothElement()