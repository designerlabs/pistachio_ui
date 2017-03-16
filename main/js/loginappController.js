var MetronicApp = angular.module("at", [
    // "ui.router",
    // "ui.bootstrap",
    // "oc.lazyLoad",
    // "ngSanitize",
    // "ngResource",
    // "ngTable",
    "pascalprecht.translate"
]);

MetronicApp.controller('loginappController', ['$translate', '$scope', '$http', function ($translate, $scope, $http) {

    $scope.update = function () {
        console.log($scope.item.toString());
        // $translateProvider.preferredLanguage($scope.item.toString());
        $translate.use($scope.item.toString());
    }
    // function ResetPswd(icno){
    //     alert('Password resetted');
    //     $('#msgResetSuccess', $('.forget-form')).show();
    //     $http.post('/someUrl', data, config)
    //     .success(function(res){
    //           $('#msgResetSuccess', $('.forget-form')).show();
    //     })
    //     .fail(function(res){

    //     });
    // }
}]);



MetronicApp.config(['$translateProvider', function ($translateProvider) {

    $translateProvider.translations('en', {
        'login.title': 'HSDAR',
        'login.subtitle': 'High Speed Data Analytics And Reporting',
        'login.requiremessage': 'Enter a username and password',
        'login.errormessag': 'Please enter a valid username and password',
        'login.username': 'IC No.',
        'login.password': 'Password',
        'login.login': 'Login',
        'login.createacc': 'Sign Up',
        'login.forgetpassword': 'Forget Password',
        'login.registration': 'Registration',
        'login.back': 'Back',
        'login.submit': 'Submit',
        'login.personaldetails': 'Enter your personal details below',
        'login.firstname': 'Full Name',
        'login.lastname': 'Last Name',
        'login.email': 'E-mail',

        'login.accdetails': 'Enter your account details below',
        'login.retypepassword': 'Re-type Your Password',
        'login.iagree': 'I agree to the',
        'login.termsofservice': 'Terms of Service',
        'login.privacypolicy': 'Privacy Policy',
        'login.error.accepttnc': 'Please accept TNC first',
        'login.sellanguage': 'Select Language',
        'login.sellanguage.register': 'Select Language',

        'login.rank': 'Position',
        'login.state': 'State',
        'login.branch': 'Branch',
        'login.department': 'Department',
        'login.unit': 'Unit',

        'login.resetpassword' : 'Reset Password',
        'forgetpswd.requiremessage' : 'IC Required',
        'forgetpswd.successful': 'Your details has been submitted successfully. We will send reset password email to your registered email address.',
        'forgetpswd.errormsg' : 'Can not find user records',

        'reset.newpassword' : 'New Password',
        'reset.confirmpswd' : 'Confirm Password',
        'reset.requiremessage': 'Enter New password and Confirm password',
        'reset.notEqualto': 'New password and Confirm password not matching',
        'reset.error': 'Server error. Please try again with correct details',
        'reset.successful': 'Your password has been changed successfully',
        'reset.please' : 'Please',
        'reset.clickhere' : 'Continue to login',
        'reset.loginpage' : 'to go Login page'


    });

    $translateProvider.translations('my', {
        'login.title': 'HSDAR',
        'login.subtitle': 'High Speed ​​Data Analytics Dan Pelaporan',
        'login.requiremessage': 'Memasukkan nama pengguna dan kata laluan',
        'login.errormessag': 'Sila masukkan nama pengguna dan kata laluan yang sah',
        'login.username': 'IC No.',
        'login.password': 'Kata laluan',
        'login.login': 'Log masuk',
        'login.createacc': 'Daftar Akaun',
        'login.forgetpassword': 'Lupa kata laluan',
        'login.registration': 'Pendaftaran',
        'login.back': 'Kembali',
        'login.submit': 'Hantar',
        'login.personaldetails': 'Masukkan butir-butir peribadi anda di bawah',
        'login.firstname': 'Nama',
        'login.lastname': 'Nama akhir',
        'login.email': 'E-mel',
        
        'login.accdetails': 'Masukkan butiran akaun anda di bawah',
        'login.retypepassword': 'Taip semula kata laluan anda',
        'login.iagree': 'Saya bersetuju dengan',
        'login.termsofservice': 'Syarat-syarat Perkhidmatan',
        'login.privacypolicy': 'Dasar Privasi',
        'login.error.accepttnc': 'Sila terima TNC pertama',
        'login.sellanguage': 'Pilih Bahasa',
        'login.sellanguage.register': 'Pilih Bahasa',
        
        'login.rank': 'Jawatan',
        'login.state': 'Negeri',
        'login.branch': 'Cawangan',
        'login.department': 'Bahagian',
        'login.unit': 'Unit',

        'login.resetpassword' : 'Menetapkan semula kata laluan',
        'forgetpswd.requiremessage' : 'IC Diperlukan',
        'forgetpswd.successful' : 'Maklumat anda berjaya dihantar. Kami akan menghantar e-mel kata laluan diset semula kepada alamat e-mel berdaftar anda',
        'forgetpswd.errormsg' : 'Tidak dapat mencari rekod pengguna',

        'reset.newpassword' : 'Kata laluan baru',
        'reset.confirmpswd' : 'Sahkan Kata laluan',
        'reset.requiremessage': 'Masukkan kata laluan baru dan Sahkan kata laluan',
        'reset.notEqualto': 'Baru kata laluan dan Sahkan kata laluan tidak sepadan',
        'reset.error': 'Ralat pelayan. Sila cuba lagi dengan butiran yang betul',
        'reset.successful': 'Kata laluan anda ditukar dengan jayanya',
        'reset.please' : 'Sila',
        'reset.clickhere' : 'Terus login',
        'reset.loginpage' : 'untuk pergi halaman Login'

    });

    $translateProvider.preferredLanguage('my');
    // $translateProvider.uses('en');
}]);

