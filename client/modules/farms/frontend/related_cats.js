
Template.RelatedCats.onRendered(function () {
    
    this.autorun(function (c) {
        if ( Template.currentData() && Template.currentData().cat ) {
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

Template.RelatedCats.events({
    'click .prev': function () {
        $("#owl").trigger('owl.prev');
    },
    'click .next': function () {
        $("#owl").trigger('owl.next');
    }
});

Template.RelatedCats.helpers({
    relatedCats: function () {
        var breedId = this.breed._id;
        var farmId = this.farm._id;
        var catId = this.cat._id;

        var cats = Cats.find({ 
                        cat_breed: breedId,
                        farm_id: farmId,
                        _id: {
                            $not: catId
                        }
                     });

        
        return cats;
    },
    relatedCatImage: function ( image ) {
            var image = farmCats.findOne( image );

            if ( image ) {

                return image.url({ store: 'farmcatthumbs'});

            } else {

                return "/images/noimage.png";

            }

    
    },
    linkToCat: function(){

        var farm = Farms.find().fetch()[0];
        var farmUrl = farm.farm_url;
        var link = "/@" + farmUrl + "/cat/" + this.cat_slug;
        return link;
    },
    notOverSix: ( index ) => {
        index = parseInt(index);

        return index > 5 ? false: true;
    },
    price: ( price ) => {
        return price === undefined ? 0 : formatMoney(price);
    },
});
