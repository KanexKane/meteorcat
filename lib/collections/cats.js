Cats = new Mongo.Collection('cats');
CatColors = new Mongo.Collection('cat_colors');

//=================================
// Schema
//=================================

Cats.attachSchema(new SimpleSchema({
    farm_id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        autoform: {
            type: 'hidden'
        }
    },
    cat_name: {
        type: String,
        label: 'ชื่อแมว'
    },
    cat_dayofbirth: {
        type: Date,
        label: 'เกิด'
    },
    cat_color: {
        type: String,
        label: 'สี',
        autoform: {
            type: 'select',
            options: function(){
                return CatColors.find().map(function (c) {
                    return {label: c.color, value: c._id};
                });
            }
        }
    }
}));

CatColors.attachSchema(new SimpleSchema({
    pattern_name: {
        type: String,
        label: 'Pattern'
    },
    color: {
        type: [String],
        label: 'สี'
    }
}));

//=================================
// Allow & Deny
//=================================

CatColors.allow({
    insert: function(){
        return true;
    },
    update: function(){
        return true;
    }
})