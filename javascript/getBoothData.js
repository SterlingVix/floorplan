/**
 * Extends "Floorplan" - these are functions related 
 * to getting and parsing booth data on the server.
 **/

/**
 * Get and parse XML booth data
 **/
Floorplan.prototype.getBoothData = function (URL) {
    var URL = URL || this.URL;

    $.get(URL, (function (floorPlanXML, status, jqxhr) {
            this.floorPlanXMLDocument = floorPlanXML.documentElement;

            /**
             * Set the dimensions of the natural W & H of the
             * background image, as well as the relative URL.
             * For now, set naturalW and naturalH explicitly.
             **/
            this.backgroundImageXMLData = this.floorPlanXMLDocument.querySelector('graphic');
        
            this.backgroundImageData = {
                imageWidth: Number.parseInt(this.backgroundImageXMLData.getAttribute('naturalw')),
                imageHeight: Number.parseInt(this.backgroundImageXMLData.getAttribute('naturalh')),
                imageURL: this.backgroundImageXMLData.getAttribute('imagename')
            };
        
            // Assign backgroundImage of app-container
            this.setBackgroundImage(this.backgroundImageData, this.containerMaxWidth, this.containerMaxHeight, this.appContainer);

            // Parse booth data
            this.boothXMLElements = this.floorPlanXMLDocument.querySelectorAll('booth');
        
            for (var i = 0; i < this.boothXMLElements.length; i++) {
                var thisBooth = {
                    id: this.boothXMLElements[i].getAttribute('idx'), // should probably drop, since we need to enforce uniqueness
                    coordinatesLeftX: this.boothXMLElements[i].getAttribute('x'),
                    coordinatesTopY: this.boothXMLElements[i].getAttribute('y'),
                    boothWidth: this.boothXMLElements[i].getAttribute('w'),
                    boothHeight: this.boothXMLElements[i].getAttribute('h'),
                    boothNumber: this.boothXMLElements[i].getAttribute('number'),
                    companyName: this.boothXMLElements[i].getAttribute('display'), // would prefer we rename this tag to something like 'companyname'
                    information: this.boothXMLElements[i].getAttribute('description'), // should lowercase 'display'
                    personell: this.boothXMLElements[i].getAttribute('header'), // would prefer we rename to something like 'personell'.
                    logo: this.boothXMLElements[i].getAttribute('logo'),
                    website: this.boothXMLElements[i].getAttribute('website'),
                    email: this.boothXMLElements[i].getAttribute('email'),
                };
                
                // Based on company name, determine if this booth is available or not.
                if (thisBooth.companyName.toLowerCase() === 'available') {
                    thisBooth.isAvailable = false;
                } else {
                    thisBooth.isAvailable = false;
                }

                // TEMPORARY - backup parsing of data from Alan's XML format
                if (thisBooth.information === null) {
                    thisBooth.information = this.boothXMLElements[i].getAttribute('Description');
                }
                if (thisBooth.personell === null) {
                    thisBooth.personell = this.boothXMLElements[i].getAttribute('Header');
                }

                this.createBoothElement(thisBooth);

            } // end for (each boothXMLElement)
        }).bind(this))
        .done(function (floorPlanXML, status, jqxhr) {
            console.log("in Done");
            console.log(floorPlanXML);
            console.log(status);
            console.log(jqxhr);
        })
        .fail(function (parm1) {
            console.log("error");
            console.log(parm1);
            debugger;
        })
        .always(function (floorPlanXML, status, jqxhr) {
            //            console.log("in Finished");
            //            console.log(floorPlanXML);
            //            console.log(status);
            //            console.log(jqxhr);
        });
}; // end getBoothData(URL)




//TODO:
//Get backgroundData Info (<graphic>)
//Get booth data (<booth>)



// Populate arrayOfBoothData with 
// var arrayOfBoothData = [];
// for (var key in window.dummyData) {
//     arrayOfBoothData.push(window.dummyData[key]);
// };