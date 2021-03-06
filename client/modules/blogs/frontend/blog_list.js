import '/imports/client/register-helpers-blog.js';

Template.Blogs.helpers({
    postDate: function(){
        return moment(this.post_date).add(543, 'years').format('DD/MM/YYYY HH:mm');
    },
    postTitle: function(){
        var after = "";
        var text = TagStripper.strip(this.post_title);
        return text + after;
    },
    postContent: function(){
        var after = "";
        var text = TagStripper.strip(this.post_content).replace('&nbsp;','').substr(0,180);
        if( text.length === 180 ){
            after = "...";
        }
        return text + after;
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
            html += '<div class="paging">';
            html += '<div class="col-xs-3 col-sm-2">';
            if( nextPage ) {
                html += '<a href="/blogs?page='+ (page + 1) +'"><img src="/images/paging_previous.png"/></a>';
            }
            html += '</div>';
            html += '<div class="col-xs-offset-7 col-xs-3 col-sm-offset-8 col-sm-2">';
            if( prevPage ) {
                html += '<a href="/blogs?page='+ (page - 1) +'"><img src="/images/paging_next.png"/></a>';
            }
            html += '</div>';
            html += '<div class="clearfix"></div>';
            html += '</div>';
        }
        return Spacebars.SafeString(html);
    }
});
