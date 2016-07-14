import '/imports/client/register-helpers-farm.js';

Template.RelatedCats.onRendered(function () {
    

        
           
 
            


});

Template.RelatedCats.events({
    'click .prev': function () {
        $("#owl").trigger('owl.prev');
    },
    'click .next': function () {
        $("#owl").trigger('owl.next');
    },
    'click .go-to-cat': function(e) {
        e.preventDefault();
        var obj = $(e.currentTarget);

        var farm = Farms.findOne(obj.attr('data-farmid'));
        var farmUrl = farm.farm_url;

        var spliter = obj.attr('data-catslug').split('/');
        var catSlug = spliter[1];
        var breedSlug = spliter[0];

        $('html, body').animate({
               scrollTop: $(".cat-detail-gallery").offset().top
        }, 100);

        
        Router.go('FarmCatDetail', { farm_url: farmUrl, breed_slug: breedSlug, cat_slug: catSlug });
    }
});

Template.RelatedCats.helpers({
    relatedCats: function () {
        var breedId = this.breed._id;
        var farmId = this.farm._id;
        var catId = this.cat._id;
        if ( this.cat ) {

            var cats =  Cats.find({ 
                            cat_breed: breedId,
                            farm_id: farmId,
                            _id: {
                                $not: catId
                            }
                         }).fetch();
            var cats = cats.slice(0, 6);
            var cats = _.shuffle(cats);
            
            return cats;
        }
    },
    linkToCat: function(){

        var farm = Farms.find().fetch()[0];
        var farmUrl = farm.farm_url;
        var link = "/@" + farmUrl + "/cat/" + this.cat_slug;
        return link;
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
                }
            }
        });
        $('.owl-stage > .owl-item').each(function() {
            if ( $.trim($(this).children().html()) === '' ) {
                $(this).remove();
            }
        });
    }
});

Template.RelatedCats.onDestroyed(function() {

});