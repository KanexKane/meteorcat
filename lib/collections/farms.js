Farms = new Mongo.Collection('farms'); // รายละเอียดฟาร์ม
FarmCats = new Mongo.Collection('farm_cats'); // รายละเอียดแมว

//=============================================================
// Collection FS
//=============================================================

// เก็บรูปอื่นๆ ของฟาร์ม
farmImages = new FS.Collection("farmimages", {
  stores: [
    new FS.Store.GridFS("farmimages", {
      transformWrite: function(fileObj, readStream, writeStream) {
        // if (gm.isAvailable) {
        //   if (fileObj.original.type.substr(0, 5) === 'image') {
        //     return gm(readStream, fileObj.name()).autoOrient().stream().pipe(writeStream);
        //   } else {
        //     return readStream.pipe(writeStream);
        //   }
        // } else {
          return readStream.pipe(writeStream);
        // }
      }
    })
  ],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
});
// เก็บรูปหน้าปก
farmCovers = new FS.Collection("farmcovers", {
  stores: [
    new FS.Store.GridFS("farmcovers", {
      transformWrite: function(fileObj, readStream, writeStream) {
        // if (gm.isAvailable) {
        //   if (fileObj.original.type.substr(0, 5) === 'image') {
        //     return gm(readStream, fileObj.name()).autoOrient().stream().pipe(writeStream);
        //   } else {
        //     return readStream.pipe(writeStream);
        //   }
        // } else {
          return readStream.pipe(writeStream);
        // }
      }
    })
  ],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
});
// เก็บรูปโลโก้
farmLogos = new FS.Collection("farmlogos", {
  stores: [
    new FS.Store.GridFS("farmlogos", {
      transformWrite: function(fileObj, readStream, writeStream) {
        // if (gm.isAvailable) {
        //   return gm(readStream, fileObj.name()).autoOrient().stream().pipe(writeStream);
        // } else {
          return readStream.pipe(writeStream);
        // }
      }
    }), new FS.Store.GridFS("farmlogothumbs", {
      transformWrite: function(fileObj, readStream, writeStream) {
        var size;
        // if (gm.isAvailable) {
        //   size = {
        //     width: 100,
        //     height: 100
        //   };
        //   return gm(readStream, fileObj.name()).autoOrient().resize(size.width + "^>", size.height + "^>").gravity("Center").extent(size.width, size.height).stream().pipe(writeStream);
        // } else {
          return readStream.pipe(writeStream);
        // }
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

farmImages.allow({
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
        optional: true,
        autoform: {
            type: 'summernote',
            class: 'editor', // optional summernote
            settings: {
              minHeight:250,
              callbacks: {
                onImageUpload: function(files, editor, $editable) {
                  var newFile = new FS.File(files[0]);
                  newFile.metadata = {owner: Meteor.userId()};
                  farmImages.insert(newFile, function(err, fileObj) {
                      imagesURL = '/cfs/files/farmimages/' + fileObj._id;
                      Meteor.setTimeout(function(){
                        $dom = $("<img>").attr('src',imagesURL);
                        $('[name=farm_desc]').summernote("insertNode", $dom[0]);
                      }, 500);
                  });
                }
              }
            }
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
                class: 'editor', // optional summernote
                settings: {
                  minHeight:250,
                  callbacks: {
                      onImageUpload: function(files, editor, $editable) {
                          var newFile = new FS.File(files[0]);
                          newFile.metadata = {owner: Meteor.userId()};
                          farmImages.insert(newFile, function(err, fileObj) {
                              imagesURL = '/cfs/files/farmimages/' + fileObj._id;
                              Meteor.setTimeout(function(){
                                $dom = $("<img>").attr('src',imagesURL);
                                $('[name=farm_editor_header]').summernote("insertNode", $dom[0]);
                              }, 500);
                          });
                      }
                  }
                }
            }
        }
    },
    farm_promotion: {
        type: String,
        label: 'Promotion',
        optional: true,
        autoform: {
            type: 'summernote',
            class: 'editor', // optional summernote
            settings: {
                minHeight:500,
                callbacks: {
                    onImageUpload: function(files, editor, $editable) {
                        var newFile = new FS.File(files[0]);
                        newFile.metadata = {owner: Meteor.userId()};
                        farmImages.insert(newFile, function(err, fileObj) {
                            imagesURL = '/cfs/files/farmimages/' + fileObj._id;
                            Meteor.setTimeout(function(){
                              $dom = $("<img>").attr('src',imagesURL);
                              $('[name=farm_promotion]').summernote("insertNode", $dom[0]);
                            }, 500);
                        });
                    }
                }
            }
        }
    },
    farm_mobilephone: {
      type: String,
      label: "เบอร์มือถือ"
    },
    farm_line: {
      type: String,
      label: "Line ID",
      optional: true
    },
    farm_facebook: {
      type: String,
      label: "Facebook",
      optional: true
    },
    farm_instagram: {
      type: String,
      label: "Instagram",
      optional: true
    },
    farm_line: {
      type: String,
      label: "Line ID",
      optional: true
    },
    farm_map: {
      type: String,
      label: "Google Map Link",
      optional: true,
      autoform: {
        type: 'map',
        afFieldInput: {
          geolocation: true,
          searchBox: true,
          autolocate: true
        }
      }
    },
    farm_editor_contactus: {
        type: String,
        label: 'ข้อมูลติดต่อเพิ่มเติม',
        optional: true,
        autoform: {
            type: 'summernote',
            class: 'editor', // optional summernote
            settings: {
                minHeight:500,
                callbacks: {
                    onImageUpload: function(files, editor, $editable) {
                        var newFile = new FS.File(files[0]);
                        newFile.metadata = {owner: Meteor.userId()};
                        farmImages.insert(newFile, function(err, fileObj) {
                            imagesURL = '/cfs/files/farmimages/' + fileObj._id;
                            Meteor.setTimeout(function(){
                              $dom = $("<img>").attr('src',imagesURL);
                              $('[name=farm_editor_contactus]').summernote("insertNode", $dom[0]);
                            }, 500);
                        });
                    }
                }
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