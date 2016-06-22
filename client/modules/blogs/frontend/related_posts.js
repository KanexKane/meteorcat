
Template.RelatedPosts.onRendered(function () {
    
    $(document).ready(function() {

        $('.owl-carousel').owlCarousel({
            loop:true,
            margin:10,
            nav:true,
            stagePadding: 50,
            navText: ['<img src="/images/carousel-prev.png" alt="">','<img src="/images/carousel-next.png" alt="">'],
            responsive:{
                0:{
                    items:1
                },
                600:{
                    items:3
                }
            }
        });
     
    });

});

Template.RelatedPosts.events({
    'click .prev': function () {
        $("#owl").trigger('owl.prev');
    },
    'click .next': function () {
        $("#owl").trigger('owl.next');
    }
});

Template.RelatedPosts.helpers({
    relatedPosts: function () {
        var countAllPost = BlogPosts.find().count();
        var category = this.post.post_category;

        var posts = BlogPosts.find({ 
                        post_category: category 
                    }).fetch();

        return _.shuffle(posts);
    },
    relatedPostImage: function ( image ) {

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
    
    },
    linkToPost: function(){
        var category_slug = BlogCategories.findOne(this.post_category).category_slug;
        var link = "/blogs/" + category_slug + "/" + this.post_slug;
        return link;
    },
});
