var category_id = "X4HDhZuegTZDsinnu";
var user_id = "LaS6Weu8xTsqpE6Mg";
var username = "kanexkane";

if(BlogCategories.find().count() === 0){
    category_id = BlogCategories.insert({
        category_name: "Other",
        category_slug: "other"
    });
}

if(BlogPosts.find().count() === 0){

    for (var i = 1 ; i <= 5; i++) {
        var post = {
            post_title: "Hello World! " + i,
            post_slug: "hello-world-"+i,
            post_category: category_id,
            post_content: "This is my " + i + " post",
            post_featured_image: "",
            post_author_id: user_id,
            post_author: username,
            post_date: new Date()
        }

        BlogPosts.insert(post);

    }
    
}