import '/imports/client/register-helpers-blog.js';


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
     
        if ( this.post && this.post.post_category ) {

            var category = this.post.post_category;

            var posts = BlogPosts.find({ 
                            post_category: category,
                            _id: {
                                $not: this.post._id
                            } 
                        },
                        {
                            limit: 6
                        }).fetch();

            var posts = _.shuffle(posts);
            
            return posts;
        }

        
    },
    initializeCarousel: function() {
        $('.owl-carousel').trigger('destroy.owl.carousel');

        $('.owl-carousel').owlCarousel({
            loop:true,
            margin:10,
            nav:true,
            navText: ['<img src="/images/carousel-prev.png" alt="">','<img src="/images/carousel-next.png" alt="">'],
            responsive:{
                0:{
                    items:1
                },
                600:{
                    items:3
                },
                900: {
                    items:5
                }
            }
        });
        $('.owl-stage > .owl-item').each(function() {
            if ( $.trim($(this).children().html()) === '' ) {
                $(this).remove();
            }
        });
        $('.owl-carousel > .item').each(function() {
            $(this).remove();
        });

    },
    lastIndexSix: function(index) {

        return index == 5;
    }
});
