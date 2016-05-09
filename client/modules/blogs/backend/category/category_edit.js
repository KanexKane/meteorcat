Template.BlogCategoryEdit.onCreated(function(){
    Session.set('blogCategoryEditErrors', {});
});

Template.BlogCategoryEdit.helpers({
    errorMessage: function(field, text){
        if(_.isObject(text)){
            text = '';
        }
        return Session.get('blogCategoryEditErrors')[field] ? Session.get('blogCategoryEditErrors')[field] : text;
    },
    errorClass: function(field){
        return !!Session.get('blogCategoryEditErrors')[field] ? 'has-error' : '';
    }
});

Template.BlogCategoryEdit.events({
    'submit form': function(e){
        e.preventDefault();

        var currentId = this._id;

        var category = {
            category_name: $(e.target).find('[name=category_name]').val(),
            category_slug: $(e.target).find('[name=category_slug]').val()
        };

        var errors = validateCategory(category);
        // use package underscore to check is empty
        if(!_.isEmpty(errors)){
            return Session.set('blogCategoryEditErrors', errors);
        }

        // check post_slug
        if(category.category_slug.trim() === ''){
            category.category_slug = category.category_name.replace(/\s+/g, '-').toLowerCase();
        }

        Meteor.call('blogCategoryEdit', category, currentId,  function(error, result){
            //display the error to the user and abort
            if(error){
                return throwError(error.reason);
            }
            
            Router.go('BlogCategoryList');
        });
    }
});