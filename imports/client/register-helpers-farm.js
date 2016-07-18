// Template.registerHelper('', function() {
// });
Template.registerHelper('farmLogo', function( imageId, isThumbnail = false ) {
    var logo = farmLogos.findOne( imageId );
    if ( !!logo ) {
        if ( isThumbnail ) {
            return logo.url({ store: 'farmlogothumbs' });
        } else {
            return logo.url();
        }
    } else {
        return '/images/farm-cat-nologo.png'; 
    }
});
Template.registerHelper('dayOfBirth', function( date ) {
    return moment( date ).format('DD/MM/YYYY');
});
Template.registerHelper('price', function( price ) {
    return price === undefined ? 0 : formatMoney(price);
});
Template.registerHelper('catFeaturedImage', function( imageId ) {
    if ( !!imageId ) {
        var image = farmCats.findOne( imageId );
        return image.url();
    } else {
        return 'images/no-cat-image.jpg';
    }
});
Template.registerHelper('catFeaturedImageCover', function( imageId, galleryImage ) {
    if ( !!imageId ) {
        var image = farmCats.findOne( imageId );
        return image.url();
    } else if ( !!galleryImage) {
        var image = farmCats.findOne( galleryImage[0].image );
        return image.url();
    }
    else {
        return 'images/no-cat-image-cover.jpg';
    }
});
Template.registerHelper('catThumbImage', function( imageId, galleryImage ) {
    if ( !!imageId ) {
        var image = farmCats.findOne( imageId );
        return image.url( { store: 'farmcatthumbs' } );
    } else if ( !!galleryImage) {
        var image = farmCats.findOne( galleryImage[0].image );
        return image.url({ store: 'farmcatthumbs' });
    } else {
        return 'images/no-cat-image.jpg';
    }
});