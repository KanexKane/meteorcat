import '/imports/client/register-helpers-blog.js';

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
            body: $.trim($body.val()),
            post_id: postId,
            author:  $.trim($author.val())
        };
        
        var errors = {};
        if(! comment.body){
            errors.body = "กรุณาใส่ข้อความ";
        }
        if(! comment.author){
            errors.author = "กรุณากรอกชื่อ";
        }
        if ( !_.isEmpty(errors) ) {
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