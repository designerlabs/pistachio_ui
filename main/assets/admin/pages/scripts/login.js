var globalURL = "http://10.1.17.25:8081/";
//var globalURL = "http://10.23.124.243:8080/";
var queryString = "query";
var categoryName = "cat";
var selectedLang = "";


/* initiating the language */
$(function () {
    $("#selLang [name=my").attr('selected', 'selected');
});
var Login = function () {

    var handleLogin = function () {

        $('.login-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                username: {
                    required: true
                },
                password: {
                    required: true
                }
            },

            messages: {
                username: {
                    required: "This field is required"
                },
                password: {
                    required: "Password is required."
                }
            },

            invalidHandler: function (event, validator) { //display error alert on form submit
                $('#loginRequire', $('.login-form')).show();
                $('#loginError', $('.login-form')).hide();
            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();

            },

            errorPlacement: function (error, element) {
                error.insertAfter(element.closest('.input-icon'));

                //return false;
            },

            submitHandler: function (form) {

                console.log($('.login-form input[name=username]').val());
                var usernameValue = $('.login-form input[name=username]').val();
                var passwordValue = $('.login-form input[name=password]').val();
                var token = undefined;
                $.ajax({
                        url: globalURL + 'auth/login?lang=' + selectedLang,
                        type: 'GET',
                        data: {
                            login: usernameValue,
                            password: passwordValue
                        },
                    }).done(function (data) {
                        console.log("success");
                        token = data.value;
                        localStorage.setItem("username", usernameValue);
                        localStorage.setItem("token", token);
                        localStorage.setItem("expireTime", data.expireTime);

                        //var getToken = localStorage.getItem("token");
                        var authoritiesArray = [];
                        $.ajax({
                                url: globalURL + 'auth/token?token=' + token,
                                type: 'GET',
                            })
                            .done(function (data) {
                                var displayNames = data.reports;
                                console.log(data.reports);
                                //authoritiesValue = data.user.authorities;
                                //console.log(authoritiesValue);
                                localStorage.setItem("authorities", data.roles);
                                localStorage.setItem("lang", data.lang);
                                localStorage.setItem("langDB", data.lang);
                                localStorage.setItem("firstName", data.firstName);
                                /*for(var i=0; i<authoritiesValue.length;i++){
                                    console.log(authoritiesValue[i].name);
                                    authoritiesArray.push(authoritiesValue[i].name);
                                    //alert(authorities[i].name);
                                    //return true;
                                }*/

                                // localStorage.setItem("authorities",data.roles);

                                //form.submit();
                                window.location = "index.html#/myprofile.html";
                                console.log("success");
                            })
                            .fail(function () {
                                console.log("error");
                            })
                            .always(function () {
                                console.log("complete");
                            });


                        console.log(authoritiesArray);
                        //console.log(data);
                        //console.log(data);
                        //return false;

                    })
                    .fail(function (data) {
                        console.log("error");
                        console.log(data);
                        $('#loginRequire', $('.login-form')).hide();
                        var responseTextData = $.parseJSON(data.responseText);
                        if (responseTextData.code == "500") {
                            $("#loginError span").html(responseTextData.error);
                        }
                        //$("#loginError span").html(responseTextData.errorMy | errorEn);
                        $('#loginError', $('.login-form')).show();
                        return false;
                    })
                    .always(function (data) {
                        console.log("complete");
                        console.log(data);
                        //$('#loginRequire', $('.login-form')).hide();
                        //$('#loginError', $('.login-form')).show();
                        return false;
                    });

            }
        });

        $('.login-form input').keypress(function (e) {
            if (e.which == 13) {
                if ($('.login-form').validate().form()) {

                    $('.login-form').submit(); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    }

    var handleForgetPassword = function () {
        $('#msgResetError', $('.forget-form')).hide();
        $('#msgResetSuccess', $('.forget-form')).hide();
        $('.forget-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input           
            rules: {
                ic: {
                    required: true                    
                }
            },

            messages: {
                ic: {
                    required: "IC is required."
                }
            },

            invalidHandler: function (event, validator) { //display error alert on form submit
                $('#msgResetError', $('.forget-form')).show();
                $('#msgResetSuccess', $('.forget-form')).hide();
                // $('#loginRequire', $('.forget-form')).show();
                // $('#loginError', $('.forget-form')).hide();
            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function (error, element) {
                error.insertAfter(element.closest('.input-icon'));
            },

            submitHandler: function (form) {
                // form.submit();
                var icValue = $('.forget-form input[name=ic]').val();
                $.ajax({
                        url: globalURL + 'api/user/'+ icValue +'/reset_password',
                        type: 'POST'                        
                    }).done(function (data) {
                        console.log("success");                       
                        $('#msgResetSuccess', $('.forget-form')).show();
                    })
                    .fail(function (data) {
                        console.log("error"); 
                        $('#msgResetSuccess', $('.forget-form')).hide();
                        $('#msgResetError span').html(data.responseText);
                        $('#msgResetError', $('.forget-form')).show();
                    });
            }
        });

        $('.forget-form input').keypress(function (e) {
            if (e.which == 13) {
                if ($('.forget-form').validate().form()) {
                    $('.forget-form').submit();
                }
                return false;
            }
        });

        jQuery('#forget-password').click(function () {
            jQuery('.login-form').hide();
            jQuery('.forget-form').show();
        });

        jQuery('#back-btn').click(function () {
            jQuery('.login-form').show();
            jQuery('.forget-form').hide();
        });
        $('.toLogin').click(function(){
            $('.login-form').show();
            $('.forget-form').hide();
            $('#msgResetSuccess', $('.forget-form')).hide();
        });

    }

    var handleRegister = function () {

        function format(state) {
            if (!state.id) return state.text; // optgroup
            return "<img class='flag' src='../../assets/global/img/flags/" + state.id.toLowerCase() + ".png'/>&nbsp;&nbsp;" + state.text;
        }

        if (jQuery().select2) {
            $("#select2_sample4").select2({
                placeholder: '<i class="fa fa-map-marker"></i>&nbsp;Select a Country',
                allowClear: true,
                formatResult: format,
                formatSelection: format,
                escapeMarkup: function (m) {
                    return m;
                }
            });


            $('#select2_sample4').change(function () {
                $('.register-form').validate().element($(this)); //revalidate the chosen dropdown value and show error or success message for the input
            });
        }

        $('.register-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {

                firstname: {
                    required: true
                },
                email: {
                    required: true,
                    email: true
                },

                username: {
                    required: true
                },
                password: {
                    required: true
                },
                rpassword: {
                    equalTo: "#register_password"
                },

                tnc: {
                    required: true
                }
            },

            messages: { // custom messages for radio buttons and checkboxes
                tnc: {
                    required: $("#erroraccepttnc").text() //"Please accept TNC first." //
                }
            },

            invalidHandler: function (event, validator) { //display error alert on form submit

            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function (error, element) {
                if (element.attr("name") == "tnc") { // insert checkbox errors after the container
                    error.insertAfter($('#register_tnc_error'));
                } else if (element.closest('.input-icon').size() === 1) {
                    error.insertAfter(element.closest('.input-icon'));
                } else {
                    error.insertAfter(element);
                }
            },

            submitHandler: function (form) {
                var firstnameValue = $('.register-form input[name=firstname]').val();
                var lastnameValue = $('.register-form input[name=lastname]').val();
                var emailValue = $('.register-form input[name=email]').val();
                var usernameValue = $('.register-form input[name=username]').val();
                var passwordValue = $('.register-form input[name=password]').val();

                var unitValue = $('.register-form [name=Runit]').val();
                var rankValue = $('.register-form [name=Rrank]').val();
                var stateValue = $('.register-form [name=Rstate]').val();
                var branchValue = $('.register-form [name=Rbranch]').val();
                var departmentValue = $('.register-form [name=Rdepartment]').val();

                var userlangValue = $('.register-form #userselLang').val();

                $.ajax({
                        url: globalURL + 'user',
                        contentType: "application/json",
                        type: 'POST',
                        dataType: "json",
                        data: JSON.stringify({
                            "firstName": firstnameValue,
                            "lastName": lastnameValue,
                            "email": emailValue,
                            "unit": unitValue,
                            "branch": branchValue,
                            "rank": rankValue,
                            "department": departmentValue,
                            "login": usernameValue,
                            "password": passwordValue,
                            "lang": userlangValue,
                            "id": "0"
                        }),
                    }).done(function (data) {
                        console.log("success");
                        //  localStorage.setItem("username", usernameValue);
                        console.log(data);
                        form.submit();
                        window.location = "login.html";
                    })
                    .fail(function (data) {
                        console.log("error");
                        console.log(data);
                        //   $('#loginRequire', $('.login-form')).hide();
                        //   $('#loginError', $('.login-form')).show();
                        return false;
                    })
                    .always(function (data) {
                        console.log("complete");
                        console.log(data);
                        //$('#loginRequire', $('.login-form')).hide();
                        //$('#loginError', $('.login-form')).show();
                        return false;
                    });


                //form.submit();
            }
        });

        $('.register-form input').keypress(function (e) {
            if (e.which == 13) {
                if ($('.register-form').validate().form()) {
                    $('.register-form').submit();
                }
                return false;
            }
        });

        jQuery('#register-btn').click(function () {
            jQuery('.login-form').hide();
            jQuery('.register-form').show();
        });

        jQuery('#register-back-btn').click(function () {
            jQuery('.login-form').show();
            jQuery('.register-form').hide();
        });
    }

    var handleLanguage = function () {
        $('#selLang').change(function () {
            // alert($scope.changeLanguage);
            selectedLang = $('#selLang').val();
            // localStorage.setItem("lang", selectedLang);


            // $translateProvider.preferredLanguage(selectedLang);
        });
    }

    var handleResetPassword = function () {
        $('.resetpswd-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                newPassword: {
                    required: true
                },
                 confirmPassword: {
                    required: true,
                    equalTo: "#newPswd"
                }
            },

            messages: {
                newPassword: {
                    required: "New Password is required"
                },
                confirmPassword: {
                    required: "Confirm Password is required"
                }
            },

            invalidHandler: function (event, validator) { //display error alert on form submit

            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function (error, element) {
                error.insertAfter(element.closest('.input-icon'));
            },

            submitHandler: function (form) {
               var newPswdValue = $('.resetpswd-form input[name=newPassword]').val();
               var qStr = window.location.href.split('?')[1];
               var userid = qStr.split('&')[0].split('=')[1];
               var _token = qStr.split('&')[1].split('=')[1];

               // $.ajax({
               //         url: globalURL + 'auth/login?lang=' + selectedLang,
               //         type: 'POST',
               //         data: {
               //             id: userid,
               //             token: _token,
               //             password:newPswdValue
               //         },
               //     }).done(function (data) {
               //      // console.log("Your Password has been reset successfully");
               //     }).fail(function () {
               //        // console.log("error");
               //  });
            }
        });

        $('.resetpswd-form input').keypress(function (e) {
            if (e.which == 13) {
                if ($('.resetpswd-form').validate().form()) {
                    $('.resetpswd-form').submit();
                }
                return false;
            }
        });

   }

    return {
        //main function to initiate the module
        init: function () {

            handleLogin();
            handleForgetPassword();
            handleRegister();
            handleLanguage();
            handleResetPassword();
        }

    };



}();

// MetronicApp.module('MetronicApplogin').controller(, ['$translate', '$scope', function ($translate, $scope) {
//     $scope.$on('$viewContentLoaded', function() {
//     alert('on scope');
//         // initialize core components
//         // Metronic.initAjax();
//         $('#selLang').change(function(){
//         alert('change');
//                 selectedLang = $('#selLang').val();
//                  $translateProvider.preferredLanguage(selectedLang);
//             });
//     });

//     // // set sidebar closed and body solid layout mode
//     // $rootScope.settings.layout.pageSidebarClosed = false;


// });
