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

CatColors.attachSchema(new SimpleSchema({
    color_pattern: {
        type: String,
        label: 'Pattern'
    },
    color: {
        type: [String],
        label: 'สี'
    }
}));

CatColors.attachSchema(new SimpleSchema({
    breed_name: {
        type: String,
        label: 'สายพันธุ์'
    },
    breed_thai_name: {
        type: String,
        label: 'สายพันธุ์ภาษาไทย'
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
    }
});
CatBreeds.allow({
    insert: function(){
        return true;
    },
    update: function(){
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

// TabularTablesCat = {};

// Meteor.isClient && Template.registerHelper('TabularTablesCat', TabularTablesCat);
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
        var pathEdit = Router.routes.CatMemberFarmCatEdit.path({_id: this._id});
        var text = '<a href="' + pathEdit + '" class="edit-category btn btn-success"><i class="fa fa-edit"></i></a>';
        text += ' <a href="#" data-id="' + this._id + '" class="delete-category btn btn-danger"><i class="fa fa-remove"></i></a>';
        return text;
    }
});
