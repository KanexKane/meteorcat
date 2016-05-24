Template.CatAdminBlogCategoryCreate.onCreated(function(){
    Session.set('blogCategoryCreateErrors', {});
});

Template.CatAdminBlogCategoryCreate.helpers({
    errorMessage: function(field, text){
        if(_.isObject(text)){
            text = '';
        }
        return Session.get('blogCategoryCreateErrors')[field] ? Session.get('blogCategoryCreateErrors')[field] : text;
    },
    errorClass: function(field){
        return !!Session.get('blogCategoryCreateErrors')[field] ? 'has-error' : '';
    }
});

Template.CatAdminBlogCategoryCreate.events({
    'change #category_name': function(e) {
        var objCategorySlug = $('#category_slug');
        var categorySlug = '';
        if( objCategorySlug.val().trim() === '' ) {
            let categoryName = $('#category_name').val();
            categorySlug = categoryName.replace(/\s+/g, '-').toLowerCase();
        }
        $('#example_category_slug').html( 'http://catland.online/blogs/' + categorySlug );
    },
    'keyup #category_slug': function() {
        var categorySlug = $('#category_slug').val();
        $('#example_category_slug').html( 'http://catland.online/blogs/' + categorySlug );
    },
    'submit form': function(e){
        e.preventDefault();

        var category = {
            category_name: $(e.target).find('[name=category_name]').val(),
            category_slug: $(e.target).find('[name=category_slug]').val()
        };

        var errors = validateCategory(category);
        // use package underscore to check is empty
        if(!_.isEmpty(errors)){
            return Session.set('blogCategoryCreateErrors', errors);
        }

        // check post_slug
        if(category.category_slug.trim() === ''){
            category.category_slug = category.category_name.replace(/\s+/g, '-').toLowerCase();
        }

        Meteor.call('blogCategoryCreate', category, function(error, result){
            //display the error to the user and abort
            if(error){
                return throwError(error.reason);
            }

            Router.go('CatAdminBlogCategoryList');
        });
    },
    'click .cancel-process': function(e){
        Router.go('CatAdminBlogCategoryList');
    }
});
