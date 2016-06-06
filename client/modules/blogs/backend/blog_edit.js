Template.AdminBlogEdit.onCreated(function(){
    Session.set('blogEditErrors', {});
});

Template.AdminBlogEdit.onRendered(function() {
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
                  }, 1000);
                });
            }
        }
    });
});


Template.AdminBlogEdit.helpers({
    errorMessage: function(field){
        return Session.get('blogEditErrors')[field];
    },
    errorClass: function(field){
        return !!Session.get('blogEditErrors')[field] ? 'has-error' : '';
    },
    optionCategories: function(){
        return BlogCategories.find();
    },
    isSelected: function(post_category, category_id){
        return post_category === category_id;
    },
    examplePostSlug: function() {
        var exSlug = 'http://catland.online/blogs/' + categorySlugById(this.post.post_category) + '/' + this.post.post_slug;

        return exSlug;
    },
    categorySlug: function() {
        return categorySlugById(this.post.post_category);
    }
});

Template.AdminBlogEdit.events({
    'change #post_title': function() {
        var currentId = this.post._id;
        var categorySlug = $('#post_category option:selected').attr('data-slug');
        var objPostSlug = $('#post_slug');
        var postSlug = objPostSlug.val().trim();
        if( postSlug === '' ) {
            var postTitle = $('#post_title').val().trim();
            postSlug = postTitle.replace(/\s+/g, '-').toLowerCase();
            objPostSlug.val(postSlug);
        }

        Meteor.call( 'duplicatePostSlugStateEdit', currentId, postSlug, function( error, result ) {
            // if post slug is duplicate
            if( result )
            {
                postSlug = postSlug + '-1';
            }

            $('#example_post_slug').html('ตัวอย่าง Url: http://catland.online/blogs/' + categorySlug + '/' + postSlug);
        } );
    },
    'keyup #post_slug, change #post_category': function() {
        var currentId = this.post._id;
        var postSlug = $('#post_slug').val().trim().replace(/\s+/g, '-').toLowerCase();
        var categorySlug = $('#post_category option:selected').attr('data-slug');
        Meteor.call( 'duplicatePostSlugStateEdit', currentId, postSlug, function( error, result ) {
            // if post slug is duplicate
            if( result )
            {
                postSlug = postSlug + '-1';
            }

            $('#example_post_slug').html('ตัวอย่าง Url: http://catland.online/blogs/' + categorySlug + '/' + postSlug);
        } );
    },
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

        var errors = validatePost(post);
        // use package underscore to check is empty
        if(!_.isEmpty(errors)){
            return Session.set('blogEditErrors', errors);
        }

        // check post_slug
        if(post.post_slug.trim() === ''){
            post.post_slug = post.post_title.replace(/\s+/g, '-').toLowerCase();
        }

        var categorySlug = categorySlugById(post.post_category);

        // check files
        var fileLink = $(e.target).find('[name=post_featured_image_url]').val();
        var file = $(e.target).find('[name=post_featured_image]')[0].files[0];
        if(!fileLink && file){
            BlogImages.insert(file, function(err, fileObj){
                post['post_featured_image'] = '/cfs/files/blogimages/' + fileObj._id;
                Meteor.call('blogEdit', post, currentId, function(error, result){
                    //display the error to the user and abort
                    if(error){
                        return throwError(error.reason);
                    }

                    Bert.alert( 'บันทึกเรียบร้อยแล้ว', 'success', 'fixed-top', 'fa-check' );
                });
            });
        }else if(fileLink){
            post['post_featured_image'] = fileLink;
            Meteor.call('blogEdit', post, currentId, function(error, result){
                //display the error to the user and abort
                if(error){
                    return throwError(error.reason);
                }

                Bert.alert( 'บันทึกเรียบร้อยแล้ว', 'success', 'fixed-top', 'fa-check' );
            });
        } else {
            Meteor.call('blogEdit', post, currentId, function(error, result){
                //display the error to the user and abort
                if(error){
                    return throwError(error.reason);
                }

                Bert.alert( 'บันทึกเรียบร้อยแล้ว', 'success', 'fixed-top', 'fa-check' );

            });
        }
    },
    'click .cancel-process': function(){
        Router.go('AdminBlogList');
    }
});
