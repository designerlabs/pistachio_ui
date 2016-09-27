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
                            var getLastLocation = localStorage.getItem('lastLocation');

                            if(getLastLocation){
                                var splitURL = getLastLocation.split('?');
                                if (splitURL.length > 1) {
                                    if (splitURL[1] == "session=true") {
                                        if (sessionStorage.length > 0) {
                                            window.location = "index.html" + getLastLocation;
                                        } else {
                                            window.location = "index.html#/myprofile.html";
                                        }
                                    }

                                } else {
                                    if (getLastLocation) {
                                        window.location = "index.html" + getLastLocation;
                                    } else {
                                        window.location = "index.html#/myprofile.html";
                                    }

                                };
                                localStorage.removeItem('lastLocation');
                            }else {
                                window.location = "index.html#/myprofile.html";
                            }

                            
                            


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
                $('#msgResetRequir', $('.forget-form')).hide();
                $('#msgResetError', $('.forget-form')).hide();
                $('#msgResetSuccess', $('.forget-form')).hide();
                if (validator.errorList[0].method == "required") {
                    $('#msgResetRequir', $('.forget-form')).show();
                } else {
                    $('#msgResetError', $('.forget-form')).show();
                }
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
                $('#msgResetRequir', $('.forget-form')).hide();
                $('#msgResetError', $('.forget-form')).hide();
                $('#msgResetSuccess', $('.forget-form')).hide();
                $('.forget-form [type=submit] span').addClass('fa fa-spinner fa-spin');

                var icValue = $('.forget-form input[name=ic]').val();
                $.ajax({
                    url: globalURL + 'api/user/' + icValue + '/reset_password',
                    contentType: "application/json",
                    type: 'POST'
                }).done(function (data) {
                    console.log("success");
                    // $('.forget-form :input').prop('disabled',true).addClass("disabled");
                    // $('.forget-form :button').prop('disabled',true).addClass("disabled"); 
                    $('.forget-form [type=submit] span').removeClass('fa fa-spinner fa-spin');
                    $('.forget-form > h3').hide();
                    $('.forget-form > .form-group').hide();
                    $('.forget-form > .form-actions').hide();
                    //$('.forget-form :input').hide();
                    //$('.forget-form :button').hide();
                    $('#ForgetUsrMsg h2', $('.forget-form')).text('Hi ' + icValue+",");
                    $('#msgResetSuccess', $('.forget-form')).show();
                })
                    .fail(function (data) {
                        $('.forget-form [type=submit] span').removeClass('fa fa-spinner fa-spin');
                        console.log("error");
                        $('#msgResetSuccess', $('.forget-form')).hide();
                        // $('#msgResetError span').html(data.responseText);
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
            $('#msgResetError', $('.forget-form')).hide();
            $('.login-form').hide();
            $('.forget-form > h3').show();
            $('.forget-form > .form-group').show();
            $('.forget-form > .form-actions').show();
            //$('.forget-form :input').show();
            //$('.forget-form :button').show();
            $('.forget-form').show();

        });

        jQuery('#back-btn').click(function () {
            jQuery('.login-form').show();
            $('#msgResetError', $('.forget-form')).hide();
            $('#msgResetSuccess', $('.forget-form')).hide();
            $('.forget-form :text').val('');
            jQuery('.forget-form').hide();
        });
        $('.toLogin').click(function () {
            jQuery('.login-form').show();
            $('#msgResetError', $('.forget-form')).hide();
            $('#msgResetSuccess', $('.forget-form')).hide();
            $('.forget-form :text').val('');
            jQuery('.forget-form').hide();
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
                $('#ResetError', $('.resetpswd-form')).hide();
                $('#ResetSuccess', $('.resetpswd-form')).hide();
                $('#ResetRequire', $('.resetpswd-form')).hide();
                $('#ResetEqualto', $('.resetpswd-form')).hide();
                console.log(validator.errorList[0].method);
                if (validator.errorList[0].method == "required") {
                    $('#ResetRequire', $('.resetpswd-form')).show();
                } else if (validator.errorList[0].method == "equalTo") {
                    $('#ResetEqualto', $('.resetpswd-form')).show();
                }
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
                $('#resetSub span', $('.resetpswd-form')).addClass('fa fa-spinner fa-spin');
                $('#ResetEqualto', $('.resetpswd-form')).hide();
                $('#ResetRequire', $('.resetpswd-form')).hide();
                $('#ResetError', $('.resetpswd-form')).hide();

                var newPswdValue = $('.resetpswd-form input[name=newPassword]').val();
                var qStr = window.location.href.split('?')[1];
                var userid = qStr.split('&')[0].split('=')[1];
                var _token = qStr.split('&')[1].split('=')[1];

                $.ajax({
                    url: globalURL + 'api/user/update_password?login=' + userid + '&token=' + _token + '&npass=' + newPswdValue,
                    type: 'GET',
                    contentType: "application/json"
                }).done(function (data) {
                    // console.log("Your Password has been reset successfully");
                    // $('.resetpswd-form :input').prop('disabled',true).addClass("disabled");
                    // $('.resetpswd-form :button').prop('disabled',true).addClass("disabled");
                    $('#resetSub span', $('.resetpswd-form')).removeClass('fa fa-spinner fa-spin');
                    $('.resetpswd-form :input').hide();
                    $('.resetpswd-form :button').hide();
                    $('#ResetUsrMsg h2', $('.resetpswd-form')).text('Hi ' + userid);
                    $('#ResetSuccess', $('.resetpswd-form')).show();
                }).fail(function () {
                    $('#resetSub span', $('.resetpswd-form')).removeClass('fa fa-spinner fa-spin');
                    $('#ResetSuccess', $('.resetpswd-form')).hide();
                    $('#ResetError', $('.resetpswd-form')).show();
                    console.log("error");
                });
            }
        });

        $('.resetpswd-form input').keypress(function (e) {
            if (e.which == 13) {
                $('#ResetEqualto', $('.resetpswd-form')).hide();
                $('#ResetRequire', $('.resetpswd-form')).hide();
                if ($('.resetpswd-form').validate().form()) {
                    $('.resetpswd-form').submit();
                }
                return false;
            }
        });
        $('.toResetLogin').click(function () {
            window.location = "login.html";
            // $('.login-form').show();
            // $('.resetpswd-form').hide();
            // $('#ResetSuccess', $('.resetpswd-form')).hide();
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



} ();

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
