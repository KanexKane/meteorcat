Template.BlogDetail.onRendered( function () {
    var post = Template.currentData().post;
    Meteor.call('updateViewBlog', post._id, function (error, result) {});
});

Template.BlogDetail.helpers({

    postFeaturedImage: function( image ){

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
    }
});