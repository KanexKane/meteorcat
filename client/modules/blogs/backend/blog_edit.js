Template.CatAdminBlogEdit.onCreated(function(){
    Session.set('blogEditErrors', {});
});

Template.CatAdminBlogEdit.onRendered(function() {
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


Template.CatAdminBlogEdit.helpers({
    errorMessage: function(field){
        return Session.get('blogEditErrors')[field];
    },
    errorClass: function(field){
        return !!Session.get('blogEditErrors')[field] ? 'has-error' : '';
    },
    optionCategories: function(){
        return BlogCategories.find();
    },
    uploadedImages: function(){
        return BlogImages.find();
    },
    isSelected: function(post_category, category_id){
        return post_category === category_id;
    }
});

Template.CatAdminBlogEdit.events({
    'submit form': function(e){
        e.preventDefault();

        var currentId = this.post._id;

        var post = {
            post_title: $(e.target).find('[name=post_title]').val(),
            post_slug: $(e.target).find('[name=post_slug]').val(),
            post_content: $(e.target).find('[name=post_content]').val(),
            post_category: $(e.target).find('[name=post_category]').val(),
            post_featured_image: ''
        };
        // check files
        var fileLink = $(e.target).find('[name=post_featured_image_url]').val();
        var file = $(e.target).find('[name=post_featured_image]')[0].files[0];
        if(!fileLink && file){
            var fileObj = BlogImages.insert(file);
            post['post_featured_image'] = '/cfs/files/blogimages/' + fileObj._id;
        }else if(fileLink){
            post['post_featured_image'] = fileLink;
        }

        var errors = validatePost(post);
        // use package underscore to check is empty
        if(!_.isEmpty(errors)){
            return Session.set('blogEditErrors', errors);
        }

        // check post_slug
        if(post.post_slug.trim() === ''){
            post.post_slug = post.post_title.replace(/\s+/g, '-').toLowerCase();
        }

        Meteor.call('blogEdit', post, currentId, function(error, result){
            //display the error to the user and abort
            if(error){
                return throwError(error.reason);
            }
            
            Router.go('CatAdminBlogList', { _id: result._id });
        });
    },
    'click .cancel-process': function(e){
        Router.go('CatAdminBlogList');
    }
});