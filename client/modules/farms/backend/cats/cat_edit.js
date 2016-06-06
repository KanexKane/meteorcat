AutoForm.addHooks('updateCatForm', {
    onSuccess: function() {
        Bert.alert( 'บันทึกเรียบร้อยแล้ว', 'success', 'fixed-top', 'fa-check' );
        Router.go('MemberFarmCats');
    }
});