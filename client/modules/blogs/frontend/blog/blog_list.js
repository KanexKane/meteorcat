Template.Blogs.helpers({
    categoryName: function(post_category){
        // function findArrayData อยู่ที่ collections/blogs เพราะเรียกใช้หลายที่
        return findArrayData(Template.instance().data.categories, post_category, 'category_name');
    },
    postDate: function(){
        return moment(this.post_date).add(543, 'years').format('DD/MM/YYYY HH:ss');
    },
    postFeaturedImage: function(){
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
    postContent: function(){
        return TagStripper.strip(this.post_content).substr(0,400);
    }
});

