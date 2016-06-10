Template.BlogCategoryList.helpers({
    categoryName: function(post_category){
        // function findArrayData อยู่ที่ collections/blogs เพราะเรียกใช้หลายที่
        return findArrayData(Template.instance().data.categories, post_category, 'category_name');
    },
    postDate: function(){
        return moment(this.post_date).add(543, 'years').format('DD-MM-YYYY');
    },
    postUpdate: function(){
        return moment(this.post_update).add(543, 'years').format('DD/MM/YYYY HH:ss');
    },
    postFeaturedImage: function(){
        
        if( !this.post_featured_image || this.post_featured_image.trim() === '' ) {

            return "/images/noimage.png";

        } else if ( this.post_featured_image.indexOf('http://') !== -1 ) {

            return this.post_featured_image;

        } else if ( this.post_featured_image.indexOf('/cfs/files/') !== -1 ) {

            // ถ้าเป็นพวก /cfs/files/ แสดงว่าเป็นลิงค์แบบโดยตรงเหมือนกัน
            return this.post_featured_image;

        }
        else {
            var image = BlogImages.findOne( this.post_featured_image );

            if ( image ) {

                return image.url( { store: 'blogimagethumbs'} );

            } else {

                return "/images/noimage.png";

            }
        }
    },
    linkToPost: function(){
        // function findCategorySlug อยู่ที่ collections/blogs เพราะเรียกใช้หลายที่
        var link = "/blogs/" + findCategorySlug(this.post_category) + "/" + this.post_slug;
        return link
    },
    postTitle: function(){
        var after = "";
        var text = TagStripper.strip(this.post_title);
        return text + after
    },
    postContent: function(){
        var after = "";
        var text = TagStripper.strip(this.post_content).replace('&nbsp;','').substr(0,180);
        if( text.length === 180 ){
            after = "...";
        }
        return text + after
    },
    rowBlog: function(){
        var rows = [];
        _.each(this.posts.fetch(), function(post, i){
            //console.log(i);
            var rowsNumber = Math.floor(i / 4);
            if(rows[rowsNumber] == null){
                rows[rowsNumber] = {rows:[]};
            }
            rows[rowsNumber].rows.push(post);
        });

        return rows;
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
