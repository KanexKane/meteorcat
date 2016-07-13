Template.BlogDetail.onCreated(function(){
    Session.set('commentSubmitErrors', {});
});

Template.BlogDetail.onRendered( function () {
    if ( Template.currentData() ) {
        var post = Template.currentData().post;

        Meteor.call('updateViewBlog', post._id, function (error, result) {});
    }
});

Template.BlogDetail.helpers({

    postFeaturedImage: function( image ){

        if( !image || image.trim() === '' ) {

            return "/images/noimage.png";

        } else if ( image.indexOf('http://') !== -1 ) {

            return image;

        } else if ( image.indexOf('/cfs/files/') !== -1 ) {

            // ถ้าเป็นพวก /cfs/files/ แสดงว่าเป็นลิงค์แบบโดยตรงเหมือนกัน
            return image;

        }
        else {
            var image = BlogImages.findOne( image );

            if ( image ) {

                return image.url();

            } else {

                return "/images/noimage.png";

            }
        }
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
                if ( user.profile.image ) {
                    var image = UserImages.findOne( user.profile.image );
                    if ( image ) {

                        return image.url({store: 'userimagethumbs'})
                    }
                } 
            }
        }
        return '/images/no-image-logo.png';
    },
    createdAt: function( created ) {
        return moment(created).format('DD/MM/YYYY HH:mm');
    },
    numIndex: function( index ) {
        return parseInt(index) + 1;
    }
});

Template.BlogDetail.events({
    'submit form': function(e, template){
        e.preventDefault();

        var $body = $(e.target).find('[name=body]');
        var $author = $(e.target).find('[name=commentAuthor]');
        var postSlug = Router.current().params.post_slug;
        var postId = BlogPosts.findOne( { post_slug: postSlug })._id;

        var comment = {
            body: $body.val(),
            post_id: postId,
            author:  $author.val()
        };
        
        var errors = {};
        if(! comment.body){
            errors.body = "กรุณาใส่ข้อความ";
            return Session.set('commentSubmitErrors', errors);
        }

        Meteor.call('commentInsert', comment, function(error, commentId){
            //display the error to the user and abort
            if(error){
                return throwError(error.reason);
            }else{
                $body.val('');
            }
        });
    }
});