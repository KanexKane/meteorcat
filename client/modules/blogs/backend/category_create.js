Template.AdminBlogCategoryCreate.onCreated(function(){
    Session.set('blogCategoryCreateErrors', {});
    Session.set('ALERTMESSAGE', '');
});

Template.AdminBlogCategoryCreate.helpers({
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

Template.AdminBlogCategoryCreate.events({
    'change #category_name': function() {
        var categorySlug = $('#category_slug').val().trim();
        if( categorySlug === '' ) {
            let categoryName = $('#category_name').val();
            categorySlug = categoryName.replace(/\s+/g, '-').toLowerCase();
        }
        Meteor.call( 'duplicateCategorySlugStateCreate', categorySlug, function( error, result ) {
            // if post slug is duplicate
            if( result )
            {
                categorySlug = categorySlug + '-1';
                $( '#category_slug' ).val( categorySlug );
            }

            $('#example_category_slug').html('ตัวอย่าง Url: http://catland.online/blogs/' + categorySlug);
        } );
    },
    'keyup #category_slug': function() {
        var categorySlug = $('#category_slug').val().trim().replace(/\s+/g, '-').toLowerCase();
        Meteor.call( 'duplicateCategorySlugStateCreate', categorySlug, function( error, result ) {
            // if post slug is duplicate
            if( result )
            {
                categorySlug = categorySlug + '-1';
                $( '#category_slug' ).val( categorySlug );
            }

            $('#example_category_slug').html('ตัวอย่าง Url: http://catland.online/blogs/' + categorySlug);
        } );
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
            Bert.alert( 'บันทึกเรียบร้อยแล้ว', 'success', 'fixed-top', 'fa-check' );
            Router.go('AdminBlogCategoryList');
        });
    },
    'click .cancel-process': function(){
        Router.go('AdminBlogCategoryList');
    }
});
