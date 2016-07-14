import '/imports/client/register-helpers-blog.js';

Template.RelatedPosts.onRendered(function () {
    var self = this;
    self.autorun(function (c) {

        if ( Template.currentData() && Template.currentData().post ) {
         
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
             
            c.stop();
        }

    });

});

Template.RelatedPosts.events({
    'click .prev': function () {
        $("#owl").trigger('owl.prev');
    },
    'click .next': function () {
        $("#owl").trigger('owl.next');
    },
    'click .go-to-post': function(e) {
        e.preventDefault();
        var obj = $(e.currentTarget);

        var category = BlogCategories.findOne(obj.attr('data-post-category'));
        var categorySlug = category.category_slug;

        $('html, body').animate({
               scrollTop: $(".page-header").offset().top
        }, 100);
        
        Router.go('BlogDetail', { category_slug: categorySlug, post_slug: obj.attr('data-post-slug') });
    }
});

Template.RelatedPosts.helpers({
    relatedPosts: function () {
     
        var countAllPost = BlogPosts.find().count();
        if ( this.post && countAllPost > 0 ) {

            var category = this.post.post_category;

            var posts = BlogPosts.find({ 
                            post_category: category 
                        }).fetch();

            return _.shuffle(posts);
        }

        
    }
});
