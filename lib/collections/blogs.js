BlogPosts = new Mongo.Collection('blog_posts');
BlogCategories = new Mongo.Collection('blog_categories');

//===============================================
// Collection FS
//===============================================

BlogImages = new FS.Collection("blogimages", {
  	stores: [
	 	new FS.Store.GridFS("blogimages", {
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
	    new FS.Store.GridFS("blogimagethumbs", {
	      transformWrite: function(fileObj, readStream, writeStream) {
	        var size;
	        if (gm.isAvailable) {
	          size = {
	            width: 350,
	            height: 250
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

//===============================================
// Allow & Deny
//===============================================

BlogPosts.allow({
	insert: function() {
		return true;
	},
	update: function() {
		return true;
	},
	remove: function(userId, post){ return ownsDocument(userId, post); }
});

BlogImages.allow({
	insert: function() {
		return true;
	},
	download: function(){
		return true;
	},
	update: function(){
		return true;
	},
	remove: function(){
		return true;
	}
});
