Template.CatAdminBlogCategoryList.events({
    'click .delete-category': function(e){
        var currentId = $(e.currentTarget).attr("data-id");
        if(confirm('แน่ใจนะ?')){
            Meteor.call('blogCategoryDelete', currentId, function(error, result){
                if(error){
                    return throwError(error.reason);
                }
                $(e.currentTarget).parent().parent().fadeOut();
            });
        }
    }
});