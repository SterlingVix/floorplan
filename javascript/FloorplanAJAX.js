/** 
 * Author: Aaron Melocik, github.com/SterlingVix
 * Signed: 28 Nov 2015
 *  
 * Extends "Floorplan" - these are functions related 
 * to getting and parsing booth data on the server.
 **/

/**
 * Get and parse XML booth data
 **/
Floorplan.prototype.getBoothData = function () {
    $.get((this.eventDataFilename + '.xml'), (function (floorPlanXML, status, jqxhr) {
            this.floorPlanXMLDocument = floorPlanXML.documentElement;

            // Cache name of event from XML <floorplan> "eventname" attribute.
            var pageXMLTag = this.floorPlanXMLDocument.querySelector('page');
            this.eventName = pageXMLTag.getAttribute('event');
            this.navbarBrandButton.text(this.eventName);

            /**
             * Set the dimensions of the natural W & H of the
             * background image, as well as the relative URL.
             * For now, set naturalW and naturalH explicitly.
             **/
            this.backgroundImageXMLData = this.floorPlanXMLDocument.querySelector('graphic');

            this.backgroundImageData = {
                imageWidth: Number.parseInt(this.backgroundImageXMLData.getAttribute('naturalw')),
                imageHeight: Number.parseInt(this.backgroundImageXMLData.getAttribute('naturalh')),
                imageURL: this.eventDataFilename + '/images/' + this.backgroundImageXMLData.getAttribute('imagename')
            };

            // Assign backgroundImage of app-container
            this.setBackgroundImage(this.backgroundImageData, this.containerMaxWidth, this.containerMaxHeight, this.appContainer);

            // Parse booth data
            this.boothXMLElements = this.floorPlanXMLDocument.querySelectorAll('booth');

            for (var i = 0; i < this.boothXMLElements.length; i++) {
                /**
                 * Attribute key for thisBooth from XML:
                 * 
                 *   boothHeight:       h
                 *   boothNumber:       number
                 *   boothWidth:        w
                 *   coordinatesLeftX:  x
                 *   coordinatesTopY:   y
                 *   colorBackground:   bc
                 *   colorForeground:   fc
                 *   email:             email      // currently null
                 *   id:                'booth-' + number
                 *   iframeReference:   iframe + '?id=' + number
                 *   information:       desc
                 *   logo:              logo       // currently null
                 *   organizationDescription:  org
                 *   personell:         header     // currently null
                 *   products:          products   // may or may not be present
                 *   tooltip:           tooltip
                 *   website:           website    // currently null
                 **/
                var thisBoothNumber = Number.parseInt(this.boothXMLElements[i].getAttribute('number')); // cache booth number since we use it a few times.
                var thisBooth = {
                    boothHeight: Number.parseInt(this.boothXMLElements[i].getAttribute('h')),
                    boothNumber: thisBoothNumber,
                    boothWidth: Number.parseInt(this.boothXMLElements[i].getAttribute('w')),
                    coordinatesLeftX: Number.parseInt(this.boothXMLElements[i].getAttribute('x')),
                    coordinatesTopY: Number.parseInt(this.boothXMLElements[i].getAttribute('y')),
                    colorBackground: this.boothXMLElements[i].getAttribute('bc'),
                    colorForeground: this.boothXMLElements[i].getAttribute('fc'),
                    description: this.boothXMLElements[i].getAttribute('desc'),
                    email: this.boothXMLElements[i].getAttribute('email'), // currently null
                    id: ('booth-' + thisBoothNumber),
                    // iframeReference: ((this.boothXMLElements[i].getAttribute('iframe')) + '?id=' + thisBoothNumber),
                    // iframeReference: (this.eventDataFilename + '/' + (this.boothXMLElements[i].getAttribute('iframe'))),
                    iframeReference: (this.eventDataFilename + '/' + (this.boothXMLElements[i].getAttribute('iframe')) + '?id=' + thisBoothNumber),
                    information: this.boothXMLElements[i].getAttribute('desc'),
                    logo: this.boothXMLElements[i].getAttribute('logo'), // currently null
                    organizationDescription: this.boothXMLElements[i].getAttribute('org'),
                    personell: this.boothXMLElements[i].getAttribute('header'), // currently null
                    products: this.boothXMLElements[i].getAttribute('products'), // currently null
                    tooltip: this.boothXMLElements[i].getAttribute('tooltip'),
                    website: this.boothXMLElements[i].getAttribute('website'), // currently null
                };

                // TEMPORARY If this condition is met, add a query to the iframe href:
                if (false) {
                    thisBooth.iframeReference += '?id=' + thisBooth.boothNumber;
                }

                /**
                 * Update 'isAvailable' key based on availability. If
                 * booth is occupied, add company name to exhibitor list.
                 **/

                if (thisBooth.description.toLowerCase() === 'available' || thisBooth.description === '') {
                    thisBooth.isAvailable = true;
                } else {
                    thisBooth.isAvailable = false;
                }

                thisBooth.information = this.boothXMLElements[i].getAttribute('desc');
                if (thisBooth.personell === null && thisBooth.organizationDescription.toLowerCase() === 'available') {
                    thisBooth.personell = 'You?';
                }

                this.createBoothElement(thisBooth);
            } // end for (each boothXMLElement)

            /**
             * Now that all the booth data is parsed,
             * update the exhibitor and products lists:
             *
             * Create an array of products;
             * Create the productLiElements;
             * Update the lengths of the productLiElements and exhibitorLiElements;
             * Sort the arrays of products and exhibitor names;
             * Append elements to exhibitorLiElements and productLiElements;
             * Register the highlight function on the element;
             **/

            // Create array of products
            for (var key in this.productsMap) {
                this.productSortedNames.push(key);
                
                // Create new productLiElements
                this.productLiElements[key] = $('<li type="button" class="btn btn-clear product-li" data-product-highlighted="false" data-color-palette="color3">');
                this.productLiElements[key].text(key);
            }

            this.exhibitorLiElements.length = this.exhibitorSortedNames.length;
            this.productLiElements.length = this.productSortedNames.length;
        
            this.exhibitorSortedNames.sort();
            this.productSortedNames.sort();

            /**
             * This name length code is obsolete, but inexpensive, so I'm leaving it for recovery later if desired.
             * var longestExhibitorName = this.exhibitorLiElements[this.exhibitorSortedNames[0]];
             * var longestProductName = this.exhibitorLiElements[this.exhibitorSortedNames[0]];
             **/
            for (var i = 0, length = this.exhibitorSortedNames.length; i < length; i++) {
                /**
                 * var lengthOfThisExhibitorsName = ((this.exhibitorLiElements[this.exhibitorSortedNames[i]]).text().length);
                 * if (lengthOfThisExhibitorsName > (longestExhibitorName.text().length)) {
                 *   longestExhibitorName.removeClass('longest-name');
                 *   longestExhibitorName = this.exhibitorLiElements[this.exhibitorSortedNames[i]];
                 *   longestExhibitorName.addClass('longest-name');
                 * }
                 **/
                this.exhibitorUnorderedListElement.append(this.exhibitorLiElements[this.exhibitorSortedNames[i]]);
                this.registerExhibitorHighlightButton((this.exhibitorLiElements[this.exhibitorSortedNames[i]]));
            }; // end for (exhibitorSortedNames)
        
            for (var i = 0; i < this.productSortedNames.length; i++) {   
                this.productUnorderedListElement.append(this.productLiElements[this.productSortedNames[i]]);
                this.registerProductHighlightButton((this.productLiElements[this.productSortedNames[i]]));
            }; // end for (productSortedNames)
        
        }).bind(this))
        .done((function (floorPlanXML, status, jqxhr) {
            // Register all events
            this.registerFloorplanEvents();

            // Render modal elements
            this.renderModalElements();
        }).bind(this))
        .fail((function (error) {
            console.log("Error in $.get");
            console.log(error);
            debugger;
        }).bind(this));
}; // end getBoothData(URL)




//TODO:
//Get backgroundData Info (<graphic>)
//Get booth data (<booth>)



// Populate arrayOfBoothData with 
// var arrayOfBoothData = [];
// for (var key in window.dummyData) {
//     arrayOfBoothData.push(window.dummyData[key]);
// };