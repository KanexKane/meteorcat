

Template.blogCreate.onCreated(function(){
    Session.set('blogCreateErrors', {});
});

Template.blogCreate.onRendered(function() {
    
    $('#post_content').summernote({
        height: 400,
        maxHeight:800,
        minHeight:250,
        callbacks: {
            onImageUpload: function(files, editor, $editable) {
                Images.insert(files[0], function(err, fileObj) {
                    imagesURL = '/cfs/files/images/' + fileObj._id;
                    Meteor.setTimeout(function(){
                      $dom = $("<img>").attr('src',imagesURL);
                      $("#post_content").summernote("insertNode", $dom[0]);
                    }, 100);
                });
            }
        }  
    });
});


Template.blogCreate.helpers({
    errorMessage: function(field){
        return Session.get('blogCreateErrors')[field];
    },
    errorClass: function(field){
        return !!Session.get('blogCreateErrors')[field] ? 'has-error' : '';
    },

});

Template.blogCreate.events({
    'submit form': function(e){
        e.preventDefault();

        var post = {
            post_title: $(e.target).find('[name=post_title]').val(),
            post_slug: $(e.target).find('[name=post_slug]').val(),
            post_content: $(e.target).find('[name=post_content]').val()
        };
        var file = $(e.target).find('[name=post_featured_image]')[0].files[0];

        Images.insert(file, function (err, fileObj) {
            console.log(fileObj);
            // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
        });

        // 2016-05-07 ตอนนี้ได้ _id รูปแล้วสามารถเอาไปโหลดรูปได้ที่ /cfs/files/images/_id


        // FS.Utility.eachFile(event, function(file) {
        //     console.log('file:',file);
        //     Images.insert(file, function (err, fileObj) {
        //         console.log(fileObj._id);
        //     // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
            
        //     });
        // });
        

        console.log('content',post.post_content);
        return;
        //return Session.set('blogCreateErrors', 'it test ' + post.post_content);

        // var errors = validatePost(post);
        // if(errors.title || errors.url){
        //     return Session.set('blogCreateErrors', errors);
        // }

        // Meteor.call('postInsert', post, function(error, result){
        //     //display the error to the user and abort
        //     if(error){
        //         return throwError(error.reason);
        //     }

        //     if(result.postExists){
        //         throwError('This link has already been posted');
        //     }
            
        //     Router.go('postPage', { _id: result._id });
        // });
    }
});