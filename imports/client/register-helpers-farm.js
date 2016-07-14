// Template.registerHelper('', function() {
// });

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
Template.registerHelper('catFeaturedImageCover', function( imageId ) {
    if ( !!imageId ) {
        var image = farmCats.findOne( imageId );
        return image.url();
    } else {
        return 'images/no-cat-image-cover.jpg';
    }
});
Template.registerHelper('catThumbImage', function( imageId ) {
    if ( !!imageId ) {
        var image = farmCats.findOne( imageId );
        return image.url( { store: 'farmcatthumbs' } );
    } else {
        return 'images/no-cat-image.jpg';
    }
});