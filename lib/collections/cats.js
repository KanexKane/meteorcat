Cats = new Mongo.Collection('cats');
CatColors = new Mongo.Collection('cat_colors');
CatBreeds = new Mongo.Collection('cat_breeds');

//=================================
// Schema
//=================================

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
            firstOption: "== Choose Breed ==",
            options: function(){
                return CatBreeds.find({}).map(function (c) {
                    return {label: c.breed_name + " - " + c.breed_thai_name, value: c._id._str};
                });
            }
        }
    },
    cat_name: {
        type: String,
        label: 'ชื่อแมว'
    },
    cat_dayofbirth: {
        type: Date,
        label: 'เกิด',
        optional: true,
        autoform: {
            format: "dd/mm/yyyy"
        }
    },
    cat_color: {
        type: String,
        optional: true,
        label: 'สี',
        autoform: {
            type: 'select',
            firstOption: "== Choose Color ==",
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
        type: String,
        label: 'ราคา',
        optional: true
    },
    cat_price_sale: {
        type: String,
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
        type: [String],
        optional: true,
        label: 'Gallery'
    },
    "cat_gallery.$": {
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                accept: 'image/*',
                collection: 'farmCats'
            }
        }
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
    }
}));


//=================================
// Collection FS
//=================================

this.farmCats = new FS.Collection("farmcats", {
  stores: [
    new FS.Store.GridFS("farmcats", {
      transformWrite: function(fileObj, readStream, writeStream) {
        // if (gm.isAvailable) {
        //   return gm(readStream, fileObj.name()).autoOrient().stream().pipe(writeStream);
        // } else {
          return readStream.pipe(writeStream);
        // }
      }
    })//, new FS.Store.GridFS("farmcatthumbs", {
    //   transformWrite: function(fileObj, readStream, writeStream) {
    //     var size;
        // if (gm.isAvailable) {
        //   size = {
        //     width: 100,
        //     height: 100
        //   };
        //   return gm(readStream, fileObj.name()).autoOrient().resize(size.width + "^>", size.height + "^>").gravity("Center").extent(size.width, size.height).stream().pipe(writeStream);
        // } else {
          // return readStream.pipe(writeStream);
        // }
    //   }
    // })
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

//===============================================
// Tabular Tables
//===============================================

// use for find breed name
var catBreedList = CatBreeds.find({});

TabularTables.MemberFarmCats = new Tabular.Table({
    name: "MemberFarmCats",
    collection: Cats,
    columns: [
        {data: 'cat_name', title: 'ชื่อแมว'},
        {
          data: "cat_breed",
          title: "สายพันธุ์",
          render: function (val, type, doc) {
            var myBreed = "";

            _.each(catBreedList.fetch(), function(breed, i){
                if(breed._id == val){
                    myBreed = breed.breed_name;
                    return;
                }
            });
            return myBreed;
          }
        },
        {data: 'editDelete()'}
    ]
});

Cats.helpers({
    editDelete: function () {
        var pathEdit = Router.routes.MemberFarmCatEdit.path({_id: this._id});
        var text = '<a href="' + pathEdit + '" class="edit-cat btn btn-success"><i class="fa fa-edit"></i></a>';
        text += ' <a href="#" data-id="' + this._id + '" class="delete-cat btn btn-danger"><i class="fa fa-remove"></i></a>';
        return text;
    }
});

//===============================================
// Methods
//===============================================

Meteor.methods({
    catDelete: function(_id){
        check(_id, String);
        Cats.remove(_id);
    },
    catBreedCreate: function(breedAttributes){
        check(Meteor.userId(), String);
        check(breedAttributes, {
            breed_name: String,
            breed_thai_name: String
        });

        var errors = validateBreed(breedAttributes);
        if(!_.isEmpty(errors)){
            return Session.set('catBreedErrors', errors);
        }

        var user = Meteor.user();
        // _extend() เป็นส่วนหนึ่งของไลบรารี่ Underscore
        // และช่วยให้คุณ “extend” อ็อบเจกต์ตัวนึงด้วยคุณสมบัติของอีกตัวได้
        var breed = _.extend(breedAttributes, {
            create_by_user_id: user._id,
            create_at: new Date(),
            update_by_user_id: user._id,
            update_at: new Date()
        });

        var breedId = CatBreeds.insert(breed);
        return {
            _id: breedId
        };
    },
    catBreedEdit: function(breedAttributes, _id) {
        check(Meteor.userId(), String);
        check(_id, String);
        check(breedAttributes, {
            breed_name: String,
            breed_thai_name: String
        });

        var errors = validateBreed(breedAttributes);
        if (!_.isEmpty(errors)) {
            return Session.set('catBreedErrors', errors);
        }

        var user = Meteor.user();
        // _extend() เป็นส่วนหนึ่งของไลบรารี่ Underscore
        // และช่วยให้คุณ “extend” อ็อบเจกต์ตัวนึงด้วยคุณสมบัติของอีกตัวได้
        var breed = _.extend(breedAttributes, {
            update_by_user_id: user._id,
            update_at: new Date()
        });

        CatBreeds.update(_id, {$set: breed});
        return {
            _id: _id
        };
    },
    catBreedDelete: function(_id){
        check(_id, String);
        CatBreeds.remove(_id);
    },
    catColorCreate: function(colorAttributes){
        check(Meteor.userId(), String);
        check(colorAttributes, {
            color_name: String
        });

        var errors = validateColor(colorAttributes);
        if(!_.isEmpty(errors)){
            return Session.set('catColorErrors', errors);
        }

        var user = Meteor.user();
        // _extend() เป็นส่วนหนึ่งของไลบรารี่ Underscore
        // และช่วยให้คุณ “extend” อ็อบเจกต์ตัวนึงด้วยคุณสมบัติของอีกตัวได้
        var color = _.extend(colorAttributes, {
            create_by_user_id: user._id,
            create_at: new Date(),
            update_by_user_id: user._id,
            update_at: new Date()
        });

        var colorId = CatColors.insert(color);
        return {
            _id: colorId
        };
    },
    catColorEdit: function(colorAttributes, _id){
        check(Meteor.userId(), String);
        check(_id, String);
        check(colorAttributes, {
            color_name: String
        });

        var errors = validateColor(colorAttributes);
        if(!_.isEmpty(errors)){
            return Session.set('catColorErrors', errors);
        }

        var user = Meteor.user();
        // _extend() เป็นส่วนหนึ่งของไลบรารี่ Underscore
        // และช่วยให้คุณ “extend” อ็อบเจกต์ตัวนึงด้วยคุณสมบัติของอีกตัวได้
        var color = _.extend(colorAttributes, {
            update_by_user_id: user._id,
            update_at: new Date()
        });

        CatColors.update(_id, { $set: color });
        return {
            _id: _id
        };
    },
    catColorDelete: function(_id){
        check(_id, String);
        CatColors.remove(_id);
    },
});

validateBreed = function(breed){
    var errors = {};

    if(!breed.breed_name){
        errors.breed_name = "กรอกชื่อสายพันธุ์ (อังกฤษ)";
    }
    if(!breed.breed_thai_name){
        errors.breed_thai_name = "กรอกชื่อสายพันธุ์ (ไทย)";
    }

    return errors;
};
validateColor = function(color){
    var errors = {};

    if(!color.color_name){
        errors.color_name = "กรอกชื่อสี";
    }

    return errors;
};