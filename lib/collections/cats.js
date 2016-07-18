Cats = new Mongo.Collection('cats');
CatColors = new Mongo.Collection('cat_colors');
CatBreeds = new Mongo.Collection('cat_breeds');
CatComments = new Mongo.Collection('cat_comments')
// SimpleSchema.debug = true
//=================================
// Schema
//=================================
CatGallery = new SimpleSchema({
    image: {
        type: String,
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                accept: 'image/*',
                collection: 'farmCats'
            }
        }
    }
});
Cats.attachSchema(new SimpleSchema({
    farm_id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        autoValue: function(){
            if(this.isInsert){
                var farms = Farms.findOne({ farm_user_id: Meteor.userId() });
                return farms._id;
            }
        },
        autoform: {
            type: 'hidden'
        }
    },
    cat_breed: {
        type: String,
        label: 'สายพันธุ์',
        autoform: {
            type: 'select',
            firstOption: "== สายพันธุ์ ==",
            options: function(){
                return CatBreeds.find({}, { sort: { breed_name: 1 } }).map(function (c) {
                    return {label: c.breed_name + " - " + c.breed_thai_name, value: c._id};
                });
            }
        }
    },
    cat_name: {
        type: String,
        label: 'ชื่อแมว'
    },
    cat_slug: {
        type: String,
        label: 'Url',
        autoValue: function () {
            
            var catName = this.siblingField("cat_name").value.replace(/\s+/g, '-').toLowerCase();
            var breedId = this.siblingField("cat_breed").value;
            var breedSlug = CatBreeds.findOne( { _id: breedId } ).breed_slug;
            return breedSlug+'/'+catName;
        },
        autoform: {
            type: 'hidden'
        }
    },
    cat_dayofbirth: {
        type: Date,
        label: 'เกิด',
        optional: true,
        autoform: {
            type: "bootstrap-datepicker",
            datePickerOptions: {
                format: "dd/mm/yyyy"
            }
        }
    },
    cat_sex: {
        type: String,
        label: 'เพศ',
        optional: true,
        autoform: {
            type: 'select-radio',
            options: function () {
                return [ { 
                    label: 'ชาย',
                    value: 'ชาย'
                }, {
                    label: 'หญิง',
                    value: 'หญิง'
                } ];
            }
        }
    },
    cat_color: {
        type: String,
        optional: true,
        label: 'สี',
        autoform: {
            type: 'select',
            firstOption: "== สี ==",
            options: function(){
                return CatColors.find().map(function (c) {
                    return {label: c.color_name, value: c._id};
                });
            }
        }
    },
    cat_character: {
        type: String,
        label: 'ลักษณะพิเศษ',
        optional: true
    },
    cat_medical_history: {
        type: String,
        label: 'ประวัติทางการแพทย์',
        optional: true
    },
    cat_pedigree_cert: {
        type: String,
        label: 'ใบการันตี',
        optional: true
    },
    cat_featured_image: {
        type: String,
        optional: true,
        label: 'รูปแมว',
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                accept: 'image/*',
                collection: 'farmCats'
            }
        }
    },
    cat_father: {
        type: String,
        optional: true,
        label: 'พ่อ',
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                accept: 'image/*',
                collection: 'farmCats'
            }
        }
    },
    cat_mother: {
        type: String,
        optional: true,
        label: 'แม่',
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                accept: 'image/*',
                collection: 'farmCats'
            }
        }
    },
    cat_price: {
        type: Number,
        label: 'ราคา',
        optional: true
    },
    cat_price_sale: {
        type: Number,
        label: 'ราคาพิเศษ',
        optional: true
    },
    cat_hot: {
        type: Boolean,
        label: 'แมวเด่น',
        optional: true,
        defaultValue: false,
        autoform: {
            type: 'hidden'
        }
    },
    cat_gallery: {
        type: [CatGallery],
        optional: true
    },
    created_at: {
        type: Date,
        autoValue: function(){
            if(this.isInsert){
                return new Date();
            }
        },
        autoform: {
            type: 'hidden'
        }
    },
    updated_at: {
        type: Date,
        autoValue: function(){
            if(this.isUpdate || this.isInsert){
                return new Date();
            }
        },
        autoform: {
            type: 'hidden'
        }
    },
    views: {
        type: Number,
        autoValue: function(){
            if(this.isInsert){
                return 0;
            }
        },
        autoform: {
            type: 'hidden'
        }
    },
    commentsCount: {
        type: Number,
        autoValue: function(){
            if(this.isInsert){
                return 0;
            }
        },
        autoform: {
            type: 'hidden'
        }
    }
}));


//=================================
// Collection FS
//=================================

farmCats = new FS.Collection("farmcats", {
  stores: [
    new FS.Store.GridFS("farmcats", {
      transformWrite: function(fileObj, readStream, writeStream) {
        if ( fileObj.size() > 1000000 ) { // ถ้ารูปมีขนาดเกิน 1MB
            if (gm.isAvailable) {
                var size = {
                    width: 800
                };
                return gm(readStream, fileObj.name()).autoOrient().resize(size.width).stream().pipe(writeStream);
            } else {
                return readStream.pipe(writeStream);
            }
        } else {
            if (gm.isAvailable) {
              return gm(readStream, fileObj.name()).autoOrient().stream().pipe(writeStream);
            } else {
              return readStream.pipe(writeStream);
            }
        }
      }
    }), 
    new FS.Store.GridFS("farmcatthumbs", {
      transformWrite: function(fileObj, readStream, writeStream) {
        var size;
        if (gm.isAvailable) {
          size = {
            width: 500,
            height: 500
          };
          return gm(readStream, fileObj.name()).autoOrient().resize(size.width, size.height).gravity("Center").extent(size.width, size.height).stream().pipe(writeStream);
        } else {
          return readStream.pipe(writeStream);
        }
      }
    })
  ],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
});

//=================================
// Allow & Deny
//=================================

CatColors.allow({
    insert: function(){
        return true;
    },
    update: function(){
        return true;
    },
    remove: function() {
        return true;
    }
});
CatBreeds.allow({
    insert: function(){
        return true;
    },
    update: function(){
        return true;
    },
    remove: function() {
        return true;
    }
});
Cats.allow({
    insert: function(){
        return true;
    },
    update: function(){
        return true;
    },
    remove: function(){
        return true;
    }

});
CatComments.allow({
    insert: function(){
        return true;
    },
    update: function(){
        return true;
    },
    remove: function(){
        return true;
    }

});

farmCats.allow({
    insert: function() {
        return true;
    },
    download: function(userId, fileObj){
        return true;
    },
    update: function(){
        return true;
    },
    remove: function(){
        return true;
    }
});