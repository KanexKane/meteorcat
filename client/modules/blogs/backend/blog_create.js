Template.AdminBlogCreate.onCreated(function(){
    Session.set('blogCreateErrors', {});
    Session.set('ALERTMESSAGE', '');
});

Template.AdminBlogCreate.onRendered(function() {
    $('#post_content').summernote({
        height: 400,
        maxHeight:800,
        minHeight:250,
        callbacks: {
            onImageUpload: function(files, editor, $editable) {
                BlogImages.insert(files[0], function(err, fileObj) {
                    var image = BlogImages.findOne( fileObj._id );
                    Meteor.setTimeout(function(){
                        $dom = $("<img>").attr('src', image.url() );
                        $("#post_content").summernote("insertNode", $dom[0]);
                    }, 2000);
                });
            }
        }
    });
});


Template.AdminBlogCreate.helpers({
    errorMessage: function(field){
        return Session.get('blogCreateErrors')[field];
    },
    errorClass: function(field){
        return !!Session.get('blogCreateErrors')[field] ? 'has-error' : '';
    },
    optionCategories: function(){
        return BlogCategories.find();
    }
});

Template.AdminBlogCreate.events({
    'change #post_title': function() {
        var categorySlug = $('#post_category option:selected').attr('data-slug');
        var objPostSlug = $('#post_slug');
        var postSlug = objPostSlug.val().trim();
        if( postSlug === '' ) {
            var postTitle = $('#post_title').val().trim();
            postSlug = postTitle.replace(/\s+/g, '-').toLowerCase();
            objPostSlug.val(postSlug);
        }

        Meteor.call( 'duplicatePostSlugStateCreate', postSlug, function( error, result ) {
            // if post slug is duplicate
            if( result )
            {
                postSlug = postSlug + '-1';
                objPostSlug.val( postSlug );
            }

            $('#example_post_slug').html('ตัวอย่าง Url: http://catland.online/blogs/' + categorySlug + '/' + postSlug);
        } );

        
    },
    'keyup #post_slug, change #post_category': function() {
        var postSlug = $('#post_slug').val().trim().replace(/\s+/g, '-').toLowerCase();
        var categorySlug = $('#post_category option:selected').attr('data-slug');

        Meteor.call( 'duplicatePostSlugStateCreate', postSlug, function( error, result ) {
            // if post slug is duplicate
            if( result )
            {
                postSlug = postSlug + '-1';
                objPostSlug.val( postSlug );
            }

            $('#example_post_slug').html('ตัวอย่าง Url: http://catland.online/blogs/' + categorySlug + '/' + postSlug);
        } );
    },
    'submit form': function(e){
        e.preventDefault();

        var post = {
            post_title: $(e.target).find('[name=post_title]').val(),
            post_slug: $(e.target).find('[name=post_slug]').val(),
            post_content: $(e.target).find('[name=post_content]').val(),
            post_category: $(e.target).find('[name=post_category]').val(),
            post_featured_image: ''
        };

        var errors = validatePost(post);
        // use package underscore to check is empty
        if(!_.isEmpty(errors)){
            return Session.set('blogCreateErrors', errors);
        }

        // check post_slug
        if(post.post_slug.trim() === ''){
            post.post_slug = post.post_title.replace(/\s+/g, '-').toLowerCase();
        }

        // check files
        var fileLink = $(e.target).find('[name=post_featured_image_url]').val();
        var file = $(e.target).find('[name=post_featured_image]')[0].files[0];
        if(!fileLink && file){
            BlogImages.insert(file, function(err, fileObj){
                post['post_featured_image'] = fileObj._id;
                Meteor.call('blogCreate', post, function(error, result){
                    //display the error to the user and abort
                    if(error){
                        return throwError(error.reason);
                    }

                    if(result.postExists){
                        throwError('This link has already been posted');
                    }

                    Bert.alert( 'บันทึกเรียบร้อยแล้ว', 'success', 'fixed-top', 'fa-check' );
                    Router.go('AdminBlogEdit', { _id: result._id });
                });
            });

        }else if(fileLink){
            post['post_featured_image'] = fileLink;
            Meteor.call('blogCreate', post, function(error, result){
                //display the error to the user and abort
                if(error){
                    return throwError(error.reason);
                }

                if(result.postExists){
                    throwError('This link has already been posted');
                }

                Bert.alert( 'บันทึกเรียบร้อยแล้ว', 'success', 'fixed-top', 'fa-check' );
                Router.go('AdminBlogEdit', { _id: result._id });
            });
        } else {
            Meteor.call('blogCreate', post, function(error, result){
                //display the error to the user and abort
                if(error){
                    return throwError(error.reason);
                }

                if(result.postExists){
                    throwError('This link has already been posted');
                }

                Bert.alert( 'บันทึกเรียบร้อยแล้ว', 'success', 'fixed-top', 'fa-check' );
                Router.go('AdminBlogEdit', { _id: result._id });
            });
        }
    },
    'click .cancel-process': function(){
        Router.go('AdminBlogList');
    }
});
