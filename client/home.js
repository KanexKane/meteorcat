Template.home.onRendered(function() {
    $('.owl-carousel').owlCarousel({
        loop:true,
        margin:10,
        nav:true,
        autoplay: true,
        autoplayTimeout:3000,
        autoplayHoverPause:true,
        navText: ['<img src="/images/carousel-prev.png" alt="">','<img src="/images/carousel-next.png" alt="">'],
        responsive:{
            0:{
                items:1
            },
            600:{
                items:2
            },
            900: {
                item:3
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
        var image = farmCats.findOne( imageId );
        if( image ) {
            return image.url({store: 'farmcatthumbs'});
        }
    },
    farmName: function( farmId ) {
        return Farms.findOne( farmId ).farm_name;
    },
    linkToCat: function( farmId, catSlug ) {
        var farm = Farms.findOne( farmId );
        if ( farm ) {
            var farmUrl = farm.farm_url;

            return '/@' + farmUrl + '/cat/' + catSlug;
        }
        
    }
});