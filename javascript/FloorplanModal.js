/** 
 * Author: Aaron Melocik, github.com/SterlingVix
 * Signed: 28 Nov 2015
 * 
 * This handles the Bootstrap modal parsing and rendering.
 **/

/**
 * Modal template to be used during individual modal instantiation
 **/
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


Floorplan.prototype.createModal = function (boothData) {
    // If defined, cast personell array contents to comma-separated string.
    var personellString = '';
    if (!!boothData.personell && boothData.personell.length !== 0) {
        personellString = '<span class="exhibitors">Exhibitors: </span>' + boothData.personell;
    }

    // Create popup modal element
    var modal = $('<div class="modal fade" id="modal-' + boothData.boothNumber + '" tabindex="-1" role="dialog"></div>');

    // TODO: Update for "available" booths here!

    // HTML Strings for specific modal elements
    var modalImageHTML = '';
    var modalTitleHTML = '<h4 class="modal-title booth-available" id="modal-label-' + boothData.boothNumber + '">Available to reserve (Booth ' + boothData.boothNumber + ')</h4>';
    var companyInformationHTML = '<p class="company-information available-booth-information">' + this.availableBoothHTML + '</p>';
    var favoriteButtonHTML = '';

    // Update the placeholder strings if the booth is taken
    if (!boothData.isAvailable) {
        /**
         * Gliphicon icons explored include class="glyphicon...
         *   glyphicon-flag
         *   glyphicon glyphicon-star
         *   glyphicon-heart
         *   glyphicon-ok
         *   glyphicon-pushpin
         *   glyphicon-star-empty
         **/
        // favoriteButtonHTML = '<button data-booth-number="' + boothData.boothNumber + '" type="button" class="btn btn-flag" data-color-palette="color5">Flag <span id="zoom-in" class="glyphicon glyphicon-flag"></span></button>';
        favoriteButtonHTML = '<button data-booth-number="' + boothData.boothNumber + '" type="button" class="btn btn-flag btn-primary">Flag <span id="zoom-in" class="glyphicon glyphicon-flag"></span></button>';

        if (boothData.logo) {
            // modalImageHTML = ' <div class="modal-image-container"><img class="company-logo" src="' + this.pathToLogos + boothData.logo + '" /></div>';
            modalImageHTML = ' <div class="modal-image-container" style="background-image: url(' + this.pathToLogos + boothData.logo + ')"></div>';
        }
        if (boothData.companyName) {
            modalTitleHTML = '<h4 class="modal-title" id="modal-label-' + boothData.boothNumber + '">' + boothData.companyName + ' (Booth ' + boothData.boothNumber + ')</h4>'
        }
        if (boothData.information) {
            companyInformationHTML = '<p class="company-information">' + boothData.information + '</p>';
        }
    }

    // Long text strings for innerHTML of modal element
    var modalHeaderHTML = '<div class="modal-header">' + '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + modalTitleHTML + '</div>';

    /**
     * Old code:
     *
     *   var modalBodyHTML = '<div class="modal-body">'
     *   + modalImageHTML
     *   + '<p class="company-personell">'
     *   + personellString
     *   + '</p>'
     *   + companyInformationHTML
     *   + '</div>';
     **/
    var modalBodyHTML = '<div class="modal-body">' + '<iframe id="booth-iframe-' + boothData.boothNumber + '" class="booth-iframe" href="' + boothData.iframeReference + '"></iframe>' + '</div>';

    var modalFooterHTML = '<div class="modal-footer">' + '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' + favoriteButtonHTML + '</div>';

    var modalHTML = '<div class="modal-dialog" role="document">' + '    <div class="modal-content">' + modalHeaderHTML + modalBodyHTML + modalFooterHTML + '    </div>' + '</div>';

    // Assign innerHTML to modal element
    modal.html(modalHTML);

    // Hash this booth modal to the 'this.modals' object with [[boothNumber]] as the key.
    this.modals[boothData.boothNumber] = modal;
    this.bodyReference.append(this.modals[boothData.boothNumber]);

    // Register button event on Favorite button
    this.registerFavoriteButton((this.modals[boothData.boothNumber]).find('.btn-flag'));
}; // end createModal()


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


/**
 * Capitalize the first letter of strings, from
 * http://codereview.stackexchange.com/questions/77614/capitalize-the-first-character-of-all-words-even-when-following-a
 **/
String.prototype.capitalize = function () {
    return this.toLowerCase().replace(/\b\w/g, function (m) {
        return m.toUpperCase();
    });
};