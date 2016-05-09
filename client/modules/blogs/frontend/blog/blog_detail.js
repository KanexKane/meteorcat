Template.BlogDetail.helpers({
    categoryName: function(){
        // function findArrayData อยู่ที่ collections/blogs เพราะเรียกใช้หลายที่
        return findArrayData(this.categories, this.post.post_category, 'category_name');
    },
    postDate: function(){
        return moment(this.post_date).add(543, 'years').format('DD/MM/YYYY HH:ss');
    },
    postFeaturedImage: function(){
        if(this.post.post_featured_image === ''){
            return "/images/noimage.png"
        }else{
            return this.post.post_featured_image;
        }
    },
    linkToCategory: function(){
        // function findCategorySlug อยู่ที่ collections/blogs เพราะเรียกใช้หลายที่
        var link = "/blogs/categories" + findCategorySlug(this.post.post_category);
        return link;
    }
});