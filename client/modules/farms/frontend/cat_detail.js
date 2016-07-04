
Template.FarmCatDetail.onRendered(function(){
    var cat = Template.currentData().cat;
    Meteor.call('updateViewCat', cat._id, function (error, result) {});

    $( document ).ready( function() {
        // delegate calls to data-toggle="lightbox"
        $('*[data-toggle="lightbox"]').click( function(event) {
            event.preventDefault();
            $(this).ekkoLightbox();
        });
    } );
});

Template.FarmCatDetail.helpers({
    dayOfBirth: ( date ) => {
        return moment( date ).format('DD/MM/YYYY');
    },
    price: ( price ) => {
        return price === undefined ? 0 : formatMoney(price);
    },
    catName: ( index ) => {
        var index = parseInt(index) + 2;
        var cat = Cats.find({}).fetch()[0];
        return cat.cat_name + ' ' + index;
    },
    catThumbImage: ( imageId ) => {
        return farmCats.findOne( imageId ).url( { store: 'farmcatthumbs' } );
    },
    catMainImage: ( imageId ) => {
        return farmCats.findOne( imageId ).url();
    },
});

Template.FarmCatDetail.events({
    'click .img-cat-detail-gallery': (event) => {
        event.preventDefault();
        var objMainPic = $("#mainPic");
        var obj = $(event.currentTarget);
        var thisLinkImage = obj.attr('data-image');

        objMainPic.attr('src', thisLinkImage);
        $('html, body').animate({
            scrollTop: objMainPic.offset().top
        }, 200);
    }
})