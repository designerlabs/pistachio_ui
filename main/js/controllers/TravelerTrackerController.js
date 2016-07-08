'use strict';
// var solrHost1 = "10.23.124.242";
// var solrHost1 = "10.23.124.220";

var info_personal_loaded = false;

MetronicApp.controller('TravelerTrackerController', function($rootScope, $scope, $http, $timeout) {


    $scope.lock = 'true';
    $scope.res = "result";
    $('.MismatchArea').hide();
    $('.clkditem').hide();
    var chartvisadtls;
    $scope.dob = "";
    $scope.imagetxt = "./assets/admin/layout2/img/avatar3.png";
    $scope.citizen = false;

    $scope.$on('$viewContentLoaded', function() {
        Metronic.initAjax(); // initialize core components
        $scope.database = "default";
        $scope.showVisa = true;
        $scope.showHistory = true;
        info_personal_loaded = false;




        var inoutTbl = undefined;

        /*
         *   Function to update Personal Info
         */
        $scope.fn_personalInfo = function(info) {
            if (!info_personal_loaded) {
                $scope.res = info;
                info_personal_loaded = true;
            }
        }


     

        $scope.fn_getBasicInfo = function() { //mad_pas_typ_cd

            $.get("http://" + solrHost + ":8983/solr/immigration2/query?sort=created desc&json={query :'" + Qparam + "',limit:20000,facet: {visa : {type: terms,field: pass_type},employers : {type: terms,field: employer}}}") //mad_pas_typ_cd - pass_type
                .then(function(data) {
                    chartvisadtls = data.response.docs;
                    if (data.response.docs.length !== 0) {
                        $scope.fn_personalInfo(data.response.docs[0]);
                        if ($scope.dob == "" || $scope.dob == undefined) {
                            var strdob = data.response.docs[0].birth_date.toString();
                            $scope.dob = strdob.substr(6, 2) + " - " + strdob.substr(4, 2) + " - " + strdob.substr(0, 4);

                            var year = Number(strdob.substr(0, 4));
                            var month = Number(strdob.substr(4, 2)) - 1;
                            var day = Number(strdob.substr(6, 2));

                            $scope.age = today.getFullYear() - year;
                        }

                        $scope.passdetails = data.response.docs[0];
                        $scope.totalvisa = data.response.docs.length;
                        $scope.titleDetails = "Visa details"
                        $scope.basicdetailsTbl = data.response.docs;

                        $('#tblvisa').DataTable({
                            data: data.response.docs,
                            columns: [{
                                    "data": "sticker",
                                    "render": function(data, type, full, meta) {
                                        return (data == undefined ? "" : data);
                                    }
                                }, {
                                    "data": "pass_type",
                                    "render": function(data, type, full, meta) {
                                        return (data == undefined ? "" : data);
                                    }
                                },

                                {
                                    "data": "job_en",
                                    "render": function(data, type, full, meta) {
                                        return (data == undefined ? "" : data);
                                    }
                                }, {
                                    "data": "address",
                                    "render": function(data, type, full, meta) {
                                        return (data == undefined ? "" : data);
                                    }
                                },

                                { "data": "created" }, {
                                    "data": "created",
                                    "render": function(data, type, full, meta) {
                                        return (data.toString().substr(0, 10) == undefined ? "" : data.toString().substr(0, 10));
                                    }
                                }
                            ]
                        });
                        $scope.$apply();

                    } else {
                        // alert('No data find in immigration2 table');
                        $scope.showVisa = false;
                    }
                    console.log(data.response.docs);
                    $scope.passdetails = data.response.docs[0];
                    $scope.totalvisa = data.response.docs.length;
                    $scope.titleDetails = "Visa details"
                    $scope.basicdetailsTbl = data.response.docs;
                    $scope.$apply();
                });
        }
        var today = new Date();
        $scope.DOB = function(data) {
            if ($scope.dob == "" || $scope.dob == undefined) {
                //  var strdob = result.response.docs[0].birth_date.toString();
                var strdob = data;
                $scope.dob = strdob.substr(0, 4) + "-" + strdob.substr(4, 2) + "-" + strdob.substr(6, 2);

                var year = Number(strdob.substr(0, 4));
                var month = Number(strdob.substr(4, 2)) - 1;
                var day = Number(strdob.substr(6, 2));

                $scope.age = today.getFullYear() - year;
            }
        }

        $scope.fn_getCitizenInfo = function() {
            $scope.showVisa = false;
            var qry = Qparam.substring(0, Qparam.length - 17);

            $.get("http://" + solrHost + ":8983/solr/cit/query?sort=xit_date desc&json={query:'" + qry + "',limit:100000}")
                .then(function(result) {
                    console.log(result);


                    if (result.response.docs.length !== 0) {

                        $scope.showHistory = true;
                        result.response.docs[0].country = "Malaysia";
                        $scope.DOB(result.response.docs[0].birth_date)
                        $scope.fn_personalInfo(result.response.docs[0]);

                        // $('#tblinout').DataTable({
                        //     data: result.response.docs,
                        //     columns: [{
                        //             "data": "xit_date",
                        //             "render": function(data, type, full, meta) {
                        //                 var strdt = data.toString().substr(0, 10) + " " + data.toString().substr(11, 8);
                        //                 return strdt;
                        //             }
                        //         }, {
                        //             "data": "dy_action_ind",
                        //             "render": function(data, type, full, meta) {
                        //                 return (data == 'in' ? 'Entry' : 'Exit');
                        //             }
                        //         },
                        //         { "data": "branch" },
                        //         { "data": "branch" }
                        //     ]
                        // });
                        $scope.CreateInoutChart(result.response.docs);
                        $scope.$apply();

                    } else {
                        // alert('No date found in himove table');
                        $scope.showHistory = false;
                    }
                    $("#loader .page-spinner-bar").addClass('hide');
                    $("#loader").hide();

                });
        }

        $scope.fn_getPersonalInfo = function() {
            $.get("http://" + solrHost + ":8983/solr/hismove/query?sort=xit_date desc&json={query:'" + Qparam + "',limit:100000}")
                .then(function(result) {
                    console.log(result);
                    $scope.summary = {
                        entry: $.grep(result.response.docs, function(n, i) {
                            return n.dy_action_ind == 'in';
                        }),
                        exit: $.grep(result.response.docs, function(n, i) {
                            return n.dy_action_ind == 'out';
                        })
                    }


                    if (result.response.docs.length !== 0) {

                        $scope.fn_personalInfo(result.response.docs[0]);
                        $scope.DOB(result.response.docs[0].birth_date)


                        // $('#tblinout').DataTable({
                        //     data: result.response.docs,
                        //     columns: [{
                        //             "data": "xit_date",
                        //             "render": function(data, type, full, meta) {
                        //                 var strdt = data.toString().substr(0, 10) + " " + data.toString().substr(11, 8);
                        //                 return strdt;
                        //             }
                        //         }, {
                        //             "data": "dy_action_ind",
                        //             "render": function(data, type, full, meta) {
                        //                 return (data == 'in' ? 'Entry' : 'Exit');
                        //             }
                        //         },
                        //         { "data": "branch" },
                        //         { "data": "dy_create_id" }
                        //     ]
                        // });
                        $scope.CreateInoutChart(result.response.docs);
                        $scope.$apply();

                    } else {
                        // alert('No date found in himove table');
                        $scope.showHistory = false;
                    }
                    $("#loader .page-spinner-bar").addClass('hide');
                    $("#loader").hide();

                });
        }

        $scope.CreateInoutChart = function(_data) {
            var newary = _data;
            var cnt = _data.length;
            var wrg = [];
            var tempwrg = [];

            newary.forEach(function(e, k) {
                e.start = e.xit_date;
                // e.content =(e.in_outs.buckets[0].val == 'in' ? 'IN' : 'OUT');
                // className
                if (e.dy_action_ind == 'in') {
                    // e.content = "IN";
                    e.className = 'green';
                } else if (e.dy_action_ind == 'out') {
                    // e.content = "OUT";
                    e.className = 'red';
                } else if (e.dy_action_ind == 'in0out') {
                    e.className = 'orange';
                }

                if (cnt <= 10) {
                    e.content = e.xit_date.toString().substr(0, 10) + " " + e.xit_date.toString().substr(11, 8) + ' , ' + e.branch + ' , ' + e.dy_create_id;
                } else {
                    e.title = e.xit_date.toString().substr(0, 10) + " " + e.xit_date.toString().substr(11, 8) + ' , ' + e.branch + ' , ' + e.dy_create_id;
                }

                if (k != 0 && e.dy_action_ind == newary[k - 1].dy_action_ind) {
                    tempwrg = [];
                    tempwrg = {
                        xit_date: e.xit_date,
                        dy_action_ind: '',
                        branch: (e.dy_action_ind.toUpperCase()== 'IN' ? 'Exit' : 'Entry') + ' Record is Missing',
                        mismatch:'yes',
                        dy_create_id:'',
                        start: e.xit_date,
                        end: newary[k - 1].xit_date,
                        ind: e.dy_action_ind,
                        content: 'Mismatching ' + e.dy_action_ind.toUpperCase(),
                        className: 'orange'
                    };

                    wrg.push(tempwrg);
                }

            });

            var container = document.getElementById('visualization');
            var newitems = $.merge(newary, wrg);
            var chart_height = (_data.length < 200 ? "300px" : "450px");
            console.log("chart_height=" + chart_height);

            var options = {
                height: chart_height,
                min: new Date(2012, 0, 1), // lower limit of visible range
                max: new Date(2017, 0, 1), // upper limit of visible range
                zoomMin: 1000 * 60 * 60 * 24, // one day in milliseconds
                zoomMax: 1000 * 60 * 60 * 24 * 31 * 12, // about three months in milliseconds
                dataAttributes: ['title']
                    // dataAttributes: 'all'
            };

            var timeline = new vis.Timeline(container, newitems, options);
            if (wrg.length >= 1) {
                // $('.MismatchArea').show();
                $scope.MisMatchCnt = wrg.length;
                $('#tblMisMatch').DataTable({
                    data: wrg,
                    // mismatch,                    
                    columns: [{
                        "data": "ind",
                        "render": function(data, type, full, meta) {
                            return (data == 'in' ? 'Entry' : 'Exit');
                        }
                    }, {
                        "data": "start",
                        "render": function(data, type, full, meta) {
                            return data.toString().substr(0, 10) + " " + data.toString().substr(11, 8);
                        }
                    }, {
                        "data": "end",
                        "render": function(data, type, full, meta) {
                            return data.toString().substr(0, 10) + " " + data.toString().substr(11, 8);
                        }
                    }],
                    
                });                

                $scope.$apply();
            }

            $('#tblinout').DataTable({
                    // data: result.response.docs,
                    data: newitems,
                    "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                                if(aData['mismatch'] == 'yes'){
                                     // $(nRow).css('color', 'red');
                                     $(nRow).addClass('missingInd');
                                }
                    },
                    columns: [{                           
                            "data": "xit_date",
                            "render": function(data, type, full, meta) {
                                var strdt = data.toString().substr(0, 10) + " " + data.toString().substr(11, 8);
                                return strdt;
                            }
                        },{
                            "data": "dy_action_ind",
                            "render": function(data, type, full, meta) {
                                if (data=='in'){
                                    return 'Entry';
                                }else if(data == 'out'){
                                    return 'Exit';
                                }else if(data==''){
                                    return '';
                                }                               
                            }
                        },
                        { "data": "branch" },
                        { "data": "dy_create_id" }
                    ]
                });


            function move(percentage) {
                var range = timeline.getWindow();
                var interval = range.end - range.start;

                timeline.setWindow({
                    start: range.start.valueOf() - interval * percentage,
                    end: range.end.valueOf() - interval * percentage
                });
            }

            function zoom(percentage) {
                var range = timeline.getWindow();
                var interval = range.end - range.start;

                timeline.setWindow({
                    start: range.start.valueOf() - interval * percentage,
                    end: range.end.valueOf() + interval * percentage
                });
            }

            document.getElementById('zoomIn').onclick = function() { zoom(-0.2); };
            document.getElementById('zoomOut').onclick = function() { zoom(0.2); };
            document.getElementById('moveLeft').onclick = function() { move(0.2); };
            document.getElementById('moveRight').onclick = function() { move(-0.2); };

            $('.vis-item-content').click(function(e) {
                $('.clkditem').show();
                $('.clkditem').text("Selected item : " + this.parentElement.getAttribute('data-title'));
            });

        }
        $scope.fn_processInput = function(str) {
            if (str.includes("citizen")) {
                $scope.fn_getCitizenInfo();
            } else {
                $scope.fn_getPersonalInfo();
                $scope.fn_getBasicInfo();
            }
        }

        var Qstring = window.location.href;
        var Qparam = Qstring.replace('=', ':').replace('=', ':').replace('&', ' AND ').split('?')[1];
        $scope.fn_processInput(Qparam);

        $('.tool').tooltip();
        $scope.availHeight = window.screen.availHeight;

        $('.lk').click(function() {
            alert('clicked');
            $scope.lock == 'true' ? 'false' : 'true';
        });

        $('.bck').click(function() {
            $rootScope.fastsearch.load = true;
            parent.history.back();
            return false;
        });

        var docno = Qparam.split('AND')[0].replace("doc_nos:", "").trim();
        $('.loadimg').show();
        $.get(globalURL + "api/image/docno/" + docno)
            .then(function(response) {
                console.log(response);
                $('.loadimg').hide();
            }).fail(function(response) {
                if (response.statusText == "OK") {
                    $scope.imagetxt = "data:image/bmp;base64," + response.responseText;
                    $scope.$apply();
                    var modal = document.getElementById('myModal');
                    var img = document.getElementById('myImg');
                    var modalImg = document.getElementById("img01");
                    var captionText = document.getElementById("caption");
                    img.onclick = function(){
                        modal.style.display = "block";
                        modalImg.src = $scope.imagetxt;
                        //modalImg.alt;
                        //captionText.innerHTML;
                    
                    }

                    // Get the <span> element that closes the modal
                    var span = document.getElementsByClassName("closeBtn")[0];

                    // When the user clicks on <span> (x), close the modal
                    span.onclick = function() { 
                        modal.style.display = "none";
                    }
                }
                $('.loadimg').hide();
            });

        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.skipTitle = false;
        $rootScope.settings.layout.setTitle("");
    });
});
