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
    },
    paging: function() {
        var perPage = parseInt(Router.current().route.options.perpage);
        var totalPage = Math.floor(Cats.find().count() / perPage);
        var page = Router.current().params.query.page;
        var prevPage = 1;
        var nextPage = 0;
        var searchKeyword = Router.current().params.query.search;

        if( page === undefined || page === NaN ) { page = 1; }

        page = parseInt(page);

        // ถ้าเพจตอนนี้มากกว่า 1 เพจก่อนหน้าก็ต้องเป็น 1
        if( page > 1 ) { prevPage = page - 1; }

        var html = '';
        if( totalPage > 0 && ( nextPage || prevPage ) ) {
            html += '<div class="paging">';
            html += '   <div class="col-xs-12">';
            html += '       <ul class="paging">';

            // หน้าก่อนหน้า ถ้ามากกว่า 1 ถึงจะแสดงและมีลิงค์
            if ( page === 1 ) {
                html += '       <li><a href="#"><<</a></li>';
            } else {
                html += '       <li><a href="'+ Router.current().route.path({ searchKeyword: searchKeyword }) +'?page='+ (page - 1) +'"><<</a></li>';
            }
            
            for (var i = 1; i <= totalPage; i++) {
                if ( i === page ) {
                    html += '   <li><a href="#" class="active">'+ i +'</a></li>';
                } else {
                    html += '   <li><a href="'+ Router.current().route.path({ searchKeyword: searchKeyword }) +'?page='+ i +'">'+ i +'</a></li>';
                }
            }

            if ( page === totalPage ) {
                html += '       <li><a href="#">>></a></li>';
            } else {
                html += '       <li><a href="'+ Router.current().route.path({ searchKeyword: searchKeyword }) +'?page='+ (page + 1) +'">>></a></li>';
            }
            
            html += '       </ul>';
            html += '   </div>';
            html += '   <div class="clearfix"></div>';
            html += '</div>';
        }
        return Spacebars.SafeString(html);
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
