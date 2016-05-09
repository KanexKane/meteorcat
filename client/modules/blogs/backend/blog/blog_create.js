Template.BlogCreate.onCreated(function(){
    Session.set('blogCreateErrors', {});
});

Template.BlogCreate.onRendered(function() {
    $('#post_content').summernote({
        height: 400,
        maxHeight:800,
        minHeight:250,
        callbacks: {
            onImageUpload: function(files, editor, $editable) {
                BlogImages.insert(files[0], function(err, fileObj) {
                    imagesURL = '/cfs/files/blogimages/' + fileObj._id;
                    Meteor.setTimeout(function(){
                      $dom = $("<img>").attr('src',imagesURL);
                      $("#post_content").summernote("insertNode", $dom[0]);
                    }, 100);
                });
            }
        }  
    });
});


Template.BlogCreate.helpers({
    errorMessage: function(field){
        return Session.get('blogCreateErrors')[field];
    },
    errorClass: function(field){
        return !!Session.get('blogCreateErrors')[field] ? 'has-error' : '';
    },
    optionCategories: function(){
        return BlogCategories.find();
    },
    uploadedImages: function(){
        return BlogImages.find();
    }
});

Template.BlogCreate.events({
    'submit form': function(e){
        e.preventDefault();

        var post = {
            post_title: $(e.target).find('[name=post_title]').val(),
            post_slug: $(e.target).find('[name=post_slug]').val(),
            post_content: $(e.target).find('[name=post_content]').val(),
            post_category: $(e.target).find('[name=post_category]').val(),
            post_featured_image: ''
        };
        // check files
        var file = $(e.target).find('[name=post_featured_image]')[0].files[0];
        if(file){
            var fileObj = BlogImages.insert(file);
            post['post_featured_image'] = '/cfs/files/blogimages/' + fileObj._id;
        }

        var errors = validatePost(post);
        // use package underscore to check is empty
        if(!_.isEmpty(errors)){
            return Session.set('blogCreateErrors', errors);
        }

        // check post_slug
        if(post.post_slug.trim() === ''){
            post.post_slug = post.post_title.replace(/\s+/g, '-').toLowerCase();
        }

        Meteor.call('blogCreate', post, function(error, result){
            //display the error to the user and abort
            if(error){
                return throwError(error.reason);
            }

            if(result.postExists){
                throwError('This link has already been posted');
            }
            
            Router.go('Blogs', { _id: result._id });
        });
    }
});