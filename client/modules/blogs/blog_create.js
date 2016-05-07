Template.blogCreate.onCreated(function(){
    Session.set('blogCreateErrors', {});
});

Template.blogCreate.helpers({
    errorMessage: function(field){
        return Session.get('blogCreateErrors')[field];
    },
    errorClass: function(field){
        return !!Session.get('blogCreateErrors')[field] ? 'has-error' : '';
    }
});

// Template.blogCreate.events({
//     'submit form': function(e){
//         e.preventDefault();

//         var post = {
//             url: $(e.target).find('[name=url]').val(),
//             title: $(e.target).find('[name=title]').val()
//         };

//         var errors = validatePost(post);
//         if(errors.title || errors.url){
//             return Session.set('postSubmitErrors', errors);
//         }

//         Meteor.call('postInsert', post, function(error, result){
//             //display the error to the user and abort
//             if(error){
//                 return throwError(error.reason);
//             }

//             if(result.postExists){
//                 throwError('This link has already been posted');
//             }
            
//             Router.go('postPage', { _id: result._id });
//         });
//     }
// });