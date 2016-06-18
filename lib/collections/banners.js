Banners = new Mongo.Collection('banners');
BannerPositions = new Mongo.Collection('banner_position');

BannerImages = new FS.Collection("bannerimages", {
    stores: [
        new FS.Store.GridFS("bannerimages", {
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
    ],
    filter: {
        allow: {
            contentTypes: ['image/*']
        }
    }
});
BannerImages.allow({
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

BannerDocuments = new FS.Collection("bannerdocuments", {
    stores: [
        new FS.Store.GridFS("bannerdocuments", {
            transformWrite: function(fileObj, readStream, writeStream) {
                return readStream.pipe(writeStream);
            }
        })
    ]
});
BannerDocuments.allow({
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


Banners.attachSchema( new SimpleSchema({

    position: {
        type: String,
        label: 'ตำแหน่ง',
        autoform: {
            type: 'select',
            firstOption: "== ตำแหน่ง ==",
            options: function(){
                return BannerPositions.find().map(function (c) {
                    return {label: c.name, value: c.code};
                });
            }
        }
    },
    name: {
        type: String,
        label: 'ชื่อโฆษณา'
    },
    price: {
        type: Number,
        label: 'ราคา',
        optional: true
    },
    rent_name: {
        type: String,
        label: 'ชื่อผู้เช่า',
        optional: true
    },
    rent_email: {
        type: String,
        label: 'Email ผู้เช่า',
        optional: true
    },
    rent_phone: {
        type: String,
        label: 'เบอร์โทร ผู้เช่า',
        optional: true
    },
    image: {
        type: String,
        label: 'รูปภาพโฆษณา',
        optional: true,
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                accept: 'image/*',
                collection: 'BannerImages'
            }
        }
    },
    url: {
        type: String,
        label: 'ลิงก์โฆษณา',
        optional: true
    },
    payment_document: {
        type: String,
        label: 'เอกสารชำระเงิน',
        optional: true,
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'BannerDocuments',
                previewTemplate: 'myPaymentDocumentPreview'
            }
        }
    },
    start: {
        type: Date,
        label: 'วันที่เริ่มแสดงโฆษณา',
        autoform: {
            type: "bootstrap-datepicker",
            datePickerOptions: {
                format: "dd/mm/yyyy"
            }
        }
    },
    end: {
        type: Date,
        label: 'วันสิ้นสุดการแสดงโฆษณา',
        autoform: {
            type: "bootstrap-datepicker",
            datePickerOptions: {
                format: "dd/mm/yyyy"
            }
        }
    },
    total: {
        type: Number,
        label: 'รวมจำนวนวันที่แสดงโฆษณา',
        autoValue: function() {
            return 0;
        },
        autoform: {
            type: 'hidden'
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
            return new Date();
        },
        autoform: {
            type: 'hidden'
        }
    }
    
}) );
Banners.allow({
    insert: function() {
        return true;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    }
});