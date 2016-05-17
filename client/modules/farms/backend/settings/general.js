Template.CatMemberFarmSettingGeneral.onCreated(function(){
    Session.set('memberFarmGeneralEditErrors', {});
});

Template.CatMemberFarmSettingGeneral.onRendered(function() {
    //ไว้ดูเป็นต้นแบบเวลาแก้ไขเรื่องอัพโหลดรูปผ่าน Summernote
    // $('.summernote').summernote({
    //     height: 400,
    //     maxHeight:800,
    //     minHeight:250,
    //     callbacks: {
    //         onImageUpload: function(files, editor, $editable) {
    //             BlogImages.insert(files[0], function(err, fileObj) {
    //                 imagesURL = '/cfs/files/blogimages/' + fileObj._id;
    //                 Meteor.setTimeout(function(){
    //                   $dom = $("<img>").attr('src',imagesURL);
    //                   $("#post_content").summernote("insertNode", $dom[0]);
    //                 }, 100);
    //             });
    //         }
    //     }  
    // });
});


Template.CatMemberFarmSettingGeneral.events({
    'keyup [name=farm_url]': function(e){
        var farmUrl = document.getElementsByName('farm_url')[0].value;
        document.getElementById('exampleUrl').innerHTML = farmUrl;
    },
    'submit form': function(e){
        e.preventDefault();
        return false;        
    }
});