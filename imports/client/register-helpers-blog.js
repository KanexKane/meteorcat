// Template.registerHelper('', function() {
// });

Template.registerHelper('postFeaturedImage', function( image ) {

    if( !image || image.trim() === '' ) {

        return "/images/noimage.png";

    } else if ( image.indexOf('http://') !== -1 ) {

        return image;

    } else if ( image.indexOf('/cfs/files/') !== -1 ) {

        // ถ้าเป็นพวก /cfs/files/ แสดงว่าเป็นลิงค์แบบโดยตรงเหมือนกัน
        return image;

    }
    else {
        var image = BlogImages.findOne( image );

        if ( image ) {

            return image.url();

        } else {

            return "/images/noimage.png";

        }
    }
});

Template.registerHelper('linkToPost', function(){
   var category = BlogCategories.findOne( this.post_category );
    if (category) {
        return "/blogs/" + category.category_slug + "/" + this.post_slug;
    }
});
