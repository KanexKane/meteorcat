Template.CatAdminBlogList.events({
    'click .delete-blog': function(e){
        var currentId = $(e.currentTarget).attr("data-id");
        if(confirm('แน่ใจนะ?')){
            Meteor.call('blogDelete', currentId, function(error, result){
                if(error){
                    return throwError(error.reason);
                }
                $(e.currentTarget).parent().parent().fadeOut();
            });
        }
    }
});