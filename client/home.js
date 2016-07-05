Template.home.onRendered(function() {
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
                items:4
            }
        }
    });
});

Template.home.helpers({
    popularCats: function() {
        return Cats.find().fetch();
    },
    popularCatImage: function( imageId ) {
        if ( !imageId ) {
            return 'images/no-cat-image.jpg';
        }
        return farmCats.findOne( imageId ).url();
    },
    linkToCat: function( farmId, catSlug ) {
        var farm = Farms.findOne( farmId );
        if ( farm ) {
            var farmUrl = farm.farm_url;

            return '/@' + farmUrl + '/cat/' + catSlug;
        }
        
    }
});