Farms = new Mongo.Collection('farms'); // รายละเอียดฟาร์ม
FarmCats = new Mongo.Collection('farm_cats'); // รายละเอียดแมว

//=============================================================
// Collection FS
//=============================================================

this.farmCovers = new FS.Collection("farmcovers", {
  stores: [
    new FS.Store.GridFS("farmcovers", {
      transformWrite: function(fileObj, readStream, writeStream) {
        if (gm.isAvailable) {
          if (fileObj.original.type.substr(0, 5) === 'image') {
            return gm(readStream, fileObj.name()).autoOrient().stream().pipe(writeStream);
          } else {
            return readStream.pipe(writeStream);
          }
        } else {
          return readStream.pipe(writeStream);
        }
      }
    })
  ]
});

this.farmLogos = new FS.Collection("farmlogos", {
  stores: [
    new FS.Store.GridFS("farmlogos", {
      transformWrite: function(fileObj, readStream, writeStream) {
        if (gm.isAvailable) {
          return gm(readStream, fileObj.name()).autoOrient().stream().pipe(writeStream);
        } else {
          return readStream.pipe(writeStream);
        }
      }
    }), new FS.Store.GridFS("farmlogothumbs", {
      transformWrite: function(fileObj, readStream, writeStream) {
        var size;
        if (gm.isAvailable) {
          size = {
            width: 100,
            height: 100
          };
          return gm(readStream, fileObj.name()).autoOrient().resize(size.width + "^>", size.height + "^>").gravity("Center").extent(size.width, size.height).stream().pipe(writeStream);
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

//=============================================================
// Allow & deny
//=============================================================
Farms.allow({
    insert: function(){
        return true;
    },
    update: function(){
        return true;
    }
});

farmLogos.allow({
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

farmCovers.allow({
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

//=============================================================
// Schema
//=============================================================

Farms.attachSchema(new SimpleSchema({
    farm_user_id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        autoValue: function(){
            if(this.isInsert){
                return Meteor.userId();
            }
        },
        autoform: {
            type: 'hidden'
        }
    },
    farm_user: {
        type: String,
        label: 'เจ้าของฟาร์ม',
        autoValue: function(){
            if(this.isInsert){
                return Meteor.user().username;
            }
        },
        autoform: {
            type: 'hidden'
        }
    },
    farm_name: {
        type: String,
        label: 'ชื่อฟาร์ม'
    },
    farm_url: {
        type: String,
        unique: true,
        regEx: /^[a-z0-9A-Z_]{3,15}$/,
        label: 'Url ฟาร์ม'
    },
    farm_desc: {
        type: String,
        label: 'รายละเอียดฟาร์ม',
        autoform: {
            type: 'summernote',
            class: 'editor' // optional summernote
            //settings: // summernote options goes here
        }
    },
    farm_logo: {
        type: String,
        optional: true,
        label: 'Logo ฟาร์ม',
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'farmLogos'
            }
        }
    },
    farm_cover: {
        type: String,
        optional: true,
        label: 'Cover ฟาร์ม',
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'farmCovers'
            }
        },
    },
    farm_editor_header: {
        type: String,
        label: 'ข้อมูลส่วนหัว',
        optional: true,
        autoform: {
            afFieldInput: {
                type: 'summernote',
                class: 'editor' // optional
                //settings: // summernote options goes here
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

// FarmCats.attachSchema(new SimpleSchema({

// }));