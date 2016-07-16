import '/imports/client/register-helpers-farm';

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
    farmName: function( farmId ) {
        return Farms.findOne( farmId ).farm_name;
    },
    linkToCat: function( farmId, catSlug ) {
        var farm = Farms.findOne( farmId );
        if ( farm ) {
            var farmUrl = farm.farm_url;

            return '/@' + farmUrl + '/cat/' + catSlug;
        }
        
    },
    rowLatestFarms: function() {
        var farms = Farms.find({}, { sort: { created_at: -1 }, limit: 8 }).fetch();
        var chunkSize = 4;
        var row = [];
        for(var i = 0; i < farms.length; i += chunkSize) {
            row.push(farms.slice(i, i + chunkSize));
        }
        return row;
    }
});