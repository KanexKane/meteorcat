Template.Blogs.helpers({
    categoryName: function(post_category){
        // function findArrayData อยู่ที่ collections/blogs เพราะเรียกใช้หลายที่
        return findArrayData(Template.instance().data.categories, post_category, 'category_name');
    },
    postDate: function(){
        return moment(this.post_date).add(543, 'years').format('DD/MM/YYYY HH:ss');
    },
    postUpdate: function(){
        return moment(this.post_update).add(543, 'years').format('DD/MM/YYYY HH:ss');
    },
    postFeaturedImage: function(){
        console.log(this.post_featured_image);
        if(this.post_featured_image === ''){
            return "/images/noimage.png"
        }else{
            return this.post_featured_image;
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
            var rowsNumber = Math.floor(i / 3);
            if(rows[rowsNumber] == null){
                rows[rowsNumber] = {rows:[]};
            }
            rows[rowsNumber].rows.push(post);
        });

        return rows;
    }
});

