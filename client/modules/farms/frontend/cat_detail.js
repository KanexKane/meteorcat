Template.FarmCatDetail.onCreated(function(){
    Session.set('commentSubmitErrors', {});
});

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
    errorMessage: function(field){
        return Session.get('commentSubmitErrors')[field];
    },
    errorClass: function(field){
        return !!Session.get('commentSubmitErrors')[field] ? 'has-error' : '';
    },
    UserProfileImage: function( id ) {
        if ( id != 'not register user' ) {
            var user = Meteor.users.findOne( id );
            if( user ) {
                if ( user.profile.profile_image ) {
                    var image = UserImages.findOne( user.profile.profile_image );
                    if ( image ) {

                        return image.url({store: 'userimagethumbs'})
                    }
                } 
            }
        }
        return '/images/no-image-logo.png';
    },
    created_at: function() {
        return moment(this).format('DD/MM/YYYY');
    },
    numIndex: function( index ) {
        return parseInt(index) + 1;
    }
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
    },
    'submit form': function(e, template){
        e.preventDefault();

        var $body = $(e.target).find('[name=body]');
        var $author = $(e.target).find('[name=commentAuthor]');
        var catSlug = Router.current().params.breed_slug + '/' + Router.current().params.cat_slug;

        var catId = Cats.findOne( { cat_slug: catSlug })._id;

        var comment = {
            body: $body.val(),
            cat_id: catId,
            author:  $author.val()
        };
        
        var errors = {};
        if(! comment.body){
            errors.body = "กรุณาใส่ข้อความ";
            return Session.set('commentSubmitErrors', errors);
        }

        Meteor.call('catCommentInsert', comment, function(error, commentId){
            //display the error to the user and abort
            if(error){
                return throwError(error.reason);
            }else{
                $body.val('');
            }
        });
    }
})