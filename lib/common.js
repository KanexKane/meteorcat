formatMoney = function( money, c, d, t ){
var n = money, 
    c = isNaN(c = Math.abs(c)) ? 0 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 }

validatePost = function(post){
    var errors = {};

    if(!post.post_title){
        errors.post_title = "กรอกชื่อหัวข้อ";
    }

    return errors;
}

validateCategory = function(category){
    var errors = {};

    if(!category.category_name){
        errors.category_name = "กรอกชื่อหมวดหมู่";
    }

    return errors;
}

validateBreed = function(breed){
    var errors = {};

    if(!breed.breed_name){
        errors.breed_name = "กรอกชื่อสายพันธุ์ (อังกฤษ)";
    }
    if(!breed.breed_thai_name){
        errors.breed_thai_name = "กรอกชื่อสายพันธุ์ (ไทย)";
    }

    return errors;
}

validateColor = function(color){
    var errors = {};

    if(!color.color_name){
        errors.color_name = "กรอกชื่อสี";
    }

    return errors;
}

findArrayData = function(arrays, match, key){
    var name = "";
    arrays.forEach( function(element, index) {
        if(element._id == match){
            name = element[key];
        }
    });
    return name;
}

findCategorySlug = function(post_category){
    return findArrayData(Template.instance().data.categories, post_category, 'category_slug');
}

categorySlugById = function( categoryId ) {
    var slug = '';
    BlogCategories.find().map(function(category){
        if(category._id == categoryId){
            slug = category.category_slug;
            return true;
        }
    });
    return slug;
}

ownsDocument = function(userId, doc){
    return doc && doc.userId === userId;
}

createCommentNotification = function(comment){
    var post = Posts.findOne(comment.postId);
    if(comment.userId !== post.userId){
        Notifications.insert({
            userId: post.userId,
            postId: post._id,
            commentId: comment._id,
            commenterName: comment.author,
            commentDetail: comment.detail,
            read: false
        });
    }
};