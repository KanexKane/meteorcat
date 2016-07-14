import '/imports/client/register-helpers-farm.js';

Template.FarmCatBreed.helpers({
    farm: function() {
        return Farms.findOne({ farm_url: Router.current().params.farm_url });
    },
    breed: function() {
        return CatBreeds.findOne({ breed_slug: Router.current().params.breed_slug });
    },
    rowData: function(){
        var rows = [];
        var breedSlug = Router.current().params.breed_slug;
        var breedId = CatBreeds.findOne( { breed_slug: breedSlug } )._id;
        var datas = Cats.find({ cat_breed: breedId });

        return datas.fetch();
    },
    paging: function() {
        var perPage = parseInt(Router.current().route.options.perpage);
        var totalPage = Math.floor(BlogPosts.find().count() / perPage);
        var page = Router.current().params.query.page;
        var prevPage = false;
        var nextPage = false;

        if( page === undefined || page === NaN ) { page = 1; }

        page = parseInt(page);

        if( totalPage > page ) { nextPage = true; }
        if( page > 1 ) { prevPage = true; }

        var html = '';
        if( totalPage > 0 && ( nextPage || prevPage ) ) {
            let categorySlug = this.categories.fetch()[0].category_slug;
            let mainUrl = Router.routes.BlogCategoryList.path({ category_slug: categorySlug });
            
            html += '<div class="paging">';
            html += '<div class="col-xs-3 col-sm-2">';
            if( nextPage ) {
                html += '<a href="'+mainUrl+'?page='+ (page + 1) +'"><img src="/images/paging_previous.png"/></a>';
            }
            html += '</div>';
            html += '<div class="col-xs-offset-7 col-xs-3 col-sm-offset-8 col-sm-2">';
            if( prevPage ) {
                html += '<a href="'+mainUrl+'?page='+ (page - 1) +'"><img src="/images/paging_next.png"/></a>';
            }
            html += '</div>';
            html += '<div class="clearfix"></div>';
            html += '</div>';
        }
        return Spacebars.SafeString(html);
    }
});
