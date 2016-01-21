var MetronicApp = angular.module("at", [
    // "ui.router",
    // "ui.bootstrap",
    // "oc.lazyLoad",
    // "ngSanitize",
    // "ngResource",
    // "ngTable",
    "pascalprecht.translate"
]);

MetronicApp.config(['$translateProvider',function($translateProvider) {    

    $translateProvider.translations('en', {
      'login.title': 'E-Reporting',
      'login.subtitle': 'Immigration Department Malaysia',
      'login.requiremessage' : 'Enter a username and password',
      'login.errormessag' : 'Please enter a valid username and password',
      'login.username' : 'IC No.',
      'login.password' : 'Password',
      'login.login' : 'Login',
      'login.createacc': 'Sign Up',
      'login.forgetpassword' :'Forget Password',
      'login.registration' : 'Registration',
      'login.back': 'Back',
      'login.submit': 'Submit',
      'login.personaldetails': 'Enter your personal details below',
      'login.firstname' : 'First Name',
      'login.lastname' : 'Last Name',
      'login.email' : 'E-mail',
      'login.department' : 'Department',
      'login.accdetails' : 'Enter your account details below',
      'login.retypepassword' : 'Re-type Your Password',
      'login.iagree' : 'I agree to the',
      'login.termsofservice' : 'Terms of Service',
      'login.privacypolicy' : 'Privacy Policy',      
      'login.error.accepttnc' : 'Please accept TNC first',
      'login.sellanguage' : 'Select Language',


    });
    
    $translateProvider.translations('my', {
      'login.title': 'E-Reporting',
      'login.subtitle': 'Jabatan Imigresen Malaysia',
      'login.requiremessage' : 'Memasukkan nama pengguna dan kata laluan',
      'login.errormessag' : 'Sila masukkan nama pengguna dan kata laluan yang sah',
      'login.username' : 'IC No.',
      'login.password' : 'Kata laluan',
      'login.login' : 'Log masuk',
      'login.createacc': 'Buat akaun',
      'login.forgetpassword' : 'Lupa kata laluan',
      'login.registration' : 'Pendaftaran',
      'login.back' :    'Kembali',
      'login.submit': 'Hantar',
      'login.personaldetails':  'Masukkan butir-butir peribadi anda di bawah',
      'login.firstname' : 'Nama pertama',
      'login.lastname' : 'Nama akhir',
      'login.email' : 'E-mel',
      'login.department' : 'Jabatan',
      'login.accdetails' : 'Masukkan butiran akaun anda di bawah',
      'login.retypepassword' : 'Taip semula kata laluan anda',
      'login.iagree' : 'Saya bersetuju dengan',
      'login.termsofservice' : 'Syarat-syarat Perkhidmatan',
      'login.privacypolicy' : 'Dasar Privasi',      
      'login.error.accepttnc' : 'Sila terima TNC pertama',
      'login.sellanguage' : 'Pilih Bahasa'

    });

    $translateProvider.preferredLanguage('en');
     // $translateProvider.uses('en');
}]);

MetronicApp.controller('loginappController',  ['$translate', '$scope', function ($translate,$scope) {
	// console.log($scope);
	// $translate.use(localStorage.getItem('loginController'));
	// $scope.changeLanguage = function (key) {
 //    $translate.use(key);
 //  };
   // $scope.toggleLang = function () {
   // 	alert('toggleLang');
   // 	// console.log($scope.item.code, $scope.item.name);
   // 	 $scope.sizes = [ {code: 1, name: 'English'}, {code: 2, name: 'Bahasa Malaysia'}];
   //      $translate.uses() === 'en'? $translate.uses('my') : $translate.uses('en');
   //  };
     // $scope.sizes = [ {code: 1, name: 'n1'}, {code: 2, name: 'n2'}];
  $scope.update = function() {
     console.log($scope.item.toString());
     // $translateProvider.preferredLanguage($scope.item.toString());
      $translate.use($scope.item.toString());
  }
}]);
// function MyCtrl($scope) {
//   $scope.sizes = [ {code: 1, name: 'n1'}, {code: 2, name: 'n2'}];
//   $scope.update = function() {
//     console.log($scope.item.code, $scope.item.name)
//   }
// }
 // function loginappController($scope){

 //  // $scope.sizes = [ {code: 1, name: 'n1'}, {code: 2, name: 'n2'}];
 //  $scope.toggleLang = function() {
 //  	alert('toggleLang');
 //    console.log($scope.item.code, $scope.item.name)
 // }
 // }