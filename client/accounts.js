Accounts.ui.config({
    requestPermissions: {},
    extraSignupFields: [
        {
            fieldName: 'Email Address',
            fieldLabel: 'Email Address',
            inputType: 'email',
            visible: true,
        }
    ],
    forceEmailLowercase: true,
    forceUsernameLowercase: true,
});