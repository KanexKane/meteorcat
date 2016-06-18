AutoForm.addHooks('insertCatForm', {
    onSuccess: function() {
        Bert.alert( 'บันทึกเรียบร้อยแล้ว', 'success', 'fixed-top', 'fa-check' );
        Router.go('MemberFarmCats');
    }//,
    // onError: function (name, error, template) {
    //   console.log(name + " error:", error);
    // }
});