var globalURL = "http://pistachio_server:8080/";
var queryString = "query";
var categoryName = "cat";


var Login = function() {

    var handleLogin = function() {

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
                    required: "Username is required."
                },
                password: {
                    required: "Password is required."
                }
            },

            invalidHandler: function(event, validator) { //display error alert on form submit   
                $('#loginRequire', $('.login-form')).show();
                $('#loginError', $('.login-form')).hide();
            },

            highlight: function(element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
       
            },

            errorPlacement: function(error, element) {
                error.insertAfter(element.closest('.input-icon'));
       
                //return false;
            },

            submitHandler: function(form) {

                console.log($('.login-form input[name=username]').val());
                var usernameValue = $('.login-form input[name=username]').val();
                var passwordValue = $('.login-form input[name=password]').val();
                var token = undefined;
                $.ajax({
                    url: 'http://pistachio_server:8080/auth/login',
                    type: 'GET',
                    data: {login: usernameValue, password: passwordValue},
                }).done(function(data) {
                    console.log("success");
                    token = data.value;
                    

                        localStorage.setItem("username", usernameValue);
                        localStorage.setItem("token", token);

                        //var getToken = localStorage.getItem("token");
                        var authoritiesArray = [];
                        $.ajax({
                            url: globalURL+'auth/token?token='+token,
                            type: 'GET',
                        })
                        .done(function(data) {
                            var displayNames = data.reports;
                            console.log(data.reports);
                            authoritiesValue = data.user.authorities;
                            console.log(authoritiesValue);
                            //localStorage.setItem("authorities",authorities);

                            for(var i=0; i<authoritiesValue.length;i++){
                                console.log(authoritiesValue[i].name);
                                authoritiesArray.push(authoritiesValue[i].name);
                                //alert(authorities[i].name);
                                //return true;
                            }

                            localStorage.setItem("authorities",authoritiesArray);
                           
                            form.submit();
                            console.log("success");
                        })
                        .fail(function() {
                            console.log("error");
                        })
                        .always(function() {
                            console.log("complete");
                        });    


                    console.log(authoritiesArray);
                    //console.log(data);
                    //console.log(data);
                    //return false;
                    
                })
                .fail(function(data) {
                    console.log("error");
                     console.log(data);
                    $('#loginRequire', $('.login-form')).hide();
                    var responseTextData = $.parseJSON(data.responseText);
                    $("#loginError span").html(responseTextData.error);
                    $('#loginError', $('.login-form')).show();
                     return false;
                })
                .always(function(data) {
                    console.log("complete");
                    console.log(data);
                    //$('#loginRequire', $('.login-form')).hide();
                    //$('#loginError', $('.login-form')).show();
                    return false;
                });

               
            }
        });

        $('.login-form input').keypress(function(e) {
            if (e.which == 13) {
                if ($('.login-form').validate().form()) {
                    
                    $('.login-form').submit(); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    }

    var handleForgetPassword = function() {
        $('.forget-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                email: {
                    required: true,
                    email: true
                }
            },

            messages: {
                email: {
                    required: "Email is required."
                }
            },

            invalidHandler: function(event, validator) { //display error alert on form submit   

            },

            highlight: function(element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function(error, element) {
                error.insertAfter(element.closest('.input-icon'));
            },

            submitHandler: function(form) {
                form.submit();
            }
        });

        $('.forget-form input').keypress(function(e) {
            if (e.which == 13) {
                if ($('.forget-form').validate().form()) {
                    $('.forget-form').submit();
                }
                return false;
            }
        });

        jQuery('#forget-password').click(function() {
            jQuery('.login-form').hide();
            jQuery('.forget-form').show();
        });

        jQuery('#back-btn').click(function() {
            jQuery('.login-form').show();
            jQuery('.forget-form').hide();
        });

    }

    var handleRegister = function() {

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
	            escapeMarkup: function(m) {
	                return m;
	            }
	        });


	        $('#select2_sample4').change(function() {
	            $('.register-form').validate().element($(this)); //revalidate the chosen dropdown value and show error or success message for the input
	        });
    	}

        $('.register-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {

                fullname: {
                    required: true
                },
                email: {
                    required: true,
                    email: true
                },
                address: {
                    required: true
                },
                city: {
                    required: true
                },
                country: {
                    required: true
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
                    required: "Please accept TNC first."
                }
            },

            invalidHandler: function(event, validator) { //display error alert on form submit   

            },

            highlight: function(element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function(error, element) {
                if (element.attr("name") == "tnc") { // insert checkbox errors after the container                  
                    error.insertAfter($('#register_tnc_error'));
                } else if (element.closest('.input-icon').size() === 1) {
                    error.insertAfter(element.closest('.input-icon'));
                } else {
                    error.insertAfter(element);
                }
            },

            submitHandler: function(form) {
                var firstnameValue = $('.register-form input[name=firstname]').val();
                var lastnameValue = $('.register-form input[name=lastname]').val();
                var emailValue = $('.register-form input[name=email]').val();
                var departmentValue = $('.register-form input[name=department]').val();
                var usernameValue = $('.register-form input[name=username]').val();
                var passwordValue = $('.register-form input[name=password]').val();

                
                $.ajax({
                    url: 'http://pistachio_server:8080/user',
                    contentType: "application/json",
                    type: 'POST',
                    dataType: "json",
                    data: JSON.stringify({
                        "firstName": firstnameValue,
                        "lastName": lastnameValue,
                        "email":emailValue,
                        "department":departmentValue,
                        "login":usernameValue,
                        "password":passwordValue,
                        "id":"0"
                    }),
                }).done(function(data) {
                    console.log("success");
                  //  localStorage.setItem("username", usernameValue);
                    console.log(data);
                    form.submit();
                    window.location = "login.html";
                })
                .fail(function(data) {
                    console.log("error");
                     console.log(data);
                 //   $('#loginRequire', $('.login-form')).hide();
                 //   $('#loginError', $('.login-form')).show();
                     return false;
                })
                .always(function(data) {
                    console.log("complete");
                    console.log(data);
                    //$('#loginRequire', $('.login-form')).hide();
                    //$('#loginError', $('.login-form')).show();
                    return false;
                });


                //form.submit();
            }
        });

        $('.register-form input').keypress(function(e) {
            if (e.which == 13) {
                if ($('.register-form').validate().form()) {
                    $('.register-form').submit();
                }
                return false;
            }
        });

        jQuery('#register-btn').click(function() {
            jQuery('.login-form').hide();
            jQuery('.register-form').show();
        });

        jQuery('#register-back-btn').click(function() {
            jQuery('.login-form').show();
            jQuery('.register-form').hide();
        });
    }

    return {
        //main function to initiate the module
        init: function() {

            handleLogin();
            handleForgetPassword();
            handleRegister();

        }

    };

}();
