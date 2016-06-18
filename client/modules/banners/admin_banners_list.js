Template.AdminBannersList.helpers({
    bannerImage: function( imageId ) {
        var image = BannerImages.findOne( imageId );
        if ( image ) {
            return image.url();
        }
        return null;
    },
    bannerStart: function( date ) {
        return moment( date ).format( 'DD/MM/YYYY' );
    },
    bannerEnd: function( date ) {
        return moment( date ).format( 'DD/MM/YYYY' );
    },
    positionEqualsCode: function( ) {
        var code = this.code;
        var position = Router.current().params.query.position;
        if ( position == code ) {
            return true;
        } else {
            return false;
        }
    },
    searchKeyword: function() {
        return Router.current().params.query.search;
    }
});

Template.AdminBannersList.events({
    'click .delete': function(e){
        var currentId = $(e.currentTarget).attr("data-id");
        if(confirm('แน่ใจนะ?')){
            Meteor.call('bannerDelete', currentId, function(error, result){
                if(error){
                    return throwError(error.reason);
                }
                $(e.currentTarget).parent().parent().fadeOut();
            });
        }
    },
    'keypress input#searchKeyword': function(e) {
        if( e.which === 13 )
        {
            var position = $('#bannerPosition').val();
            var keyword = $(e.currentTarget).val();
            Router.go( 'AdminBannersList', {}, { query: 'search=' + keyword + '&position=' + position } );
        }
    },
    'change #bannerPosition': function(e) {
        var position = $(e.currentTarget).val();
        var keyword = $('#searchKeyword').val();
        console.log('aa');
        Router.go( 'AdminBannersList', {}, { query: 'search=' + keyword + '&position=' + position } );
    }
});