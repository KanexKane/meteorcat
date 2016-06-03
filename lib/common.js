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

ownsDocument = function(userId, doc){
    return doc && doc.userId === userId;
}