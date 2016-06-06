Template.MemberFarmCats.helpers({
    activeClass: function() {
        var breedId = this._id;
        var routerParamId = Router.current().params.id;
        
        if( breedId === routerParamId )
        {
            return 'list-group-item active';
        }
        else 
        {
            return 'list-group-item';
        }
    },
    cat_breed: function() {
        var thisBreedId = this.cat_breed;
        var allBreeds = Router.current().data().catbreeds.fetch();
        var breedName = '';

        _.each( allBreeds, function( breed, i ) {
            if( breed._id == thisBreedId ) 
            {
                breedName = breed.breed_name + ' - ' + breed.breed_thai_name;
            }
        } );

        return breedName;
    },
    searchKeyword: function() {
        return Router.current().params.query.search;
    }
});

Template.MemberFarmCats.events({
    'keypress input#searchKeyword': function(e) {
        if( e.which === 13 )
        {
            var breedId = Router.current().params.id;
            var keyword = $(e.currentTarget).val();

            Router.go( 'MemberFarmCats', { id: breedId }, { query: 'search=' + keyword } );
        }
    },
    'click .delete-cat': function(e){
        var currentId = $(e.currentTarget).attr("data-id");
        if(confirm('แน่ใจนะ?')){
            Meteor.call('catDelete', currentId, function(error, result){
                if(error){
                    return throwError(error.reason);
                }
                $(e.currentTarget).parent().parent().fadeOut();
            });
        }
    }
});
