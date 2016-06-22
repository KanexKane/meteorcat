
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
        return price === undefined ? 0 : price;
    },
    catName: ( index ) => {
        var index = parseInt(index) + 2;
        var cat = Cats.find({}).fetch()[0];
        return cat.cat_name + ' ' + index;
    },
    catThumbImage: ( imageId ) => {
        return farmCats.findOne( imageId ).url( { store: 'farmcatthumbs' } );
    }
});