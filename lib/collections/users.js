UserImages = new FS.Collection("userimages", {
    stores: [
        new FS.Store.GridFS("userimages", {
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
        }), 
        new FS.Store.GridFS("userimagethumbs", {
          transformWrite: function(fileObj, readStream, writeStream) {
            var size;
            if (gm.isAvailable) {
              size = {
                width: 500,
                height: 500
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

UserImages.allow({
    insert: function(){
        return true;
    },
    update: function(){
        return true;
    },
    remove: function() {
        return true;
    },
    download: () => {
        return true;
    }
});