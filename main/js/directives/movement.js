'use strict';

var MovementController = function ($scope,$http) {
    var thisSolrAppUrl = 'http://'+solrHost+':8983/solr/'+getCollection()+'/query?sort=xit_date desc&rows=100&q='
    init();

    console.log("totalMove"+$scope.movetotal)

   function getCollection() {
        return "hismove"
   }

  function init() {
    var query = "expact_id:\""+$scope.expact +"\""
    //var query = "expact_id:\"LU SHAO-CHN-19881202\""
    $http.get(thisSolrAppUrl+query).
      success(function(data) {
      $scope.docs = data.response.docs;
      $scope.movetotal = data.response.numFound;
      //debugger;
      var movedetails = data.response.docs;
      $scope.CreateInoutChart(data.response.docs);
        
    });
  } 

  $scope.getDate = function (data) {
    return moment(data, "YYYYMMDD").format('DD-MM-YYYY');
  }

  $scope.CreateInoutChart = function (_data) {
            var newary = _data;
            var cnt = _data.length;
            var wrg = [];
            var tempwrg = [];
            $scope.hideMisMatchTab = true;
            newary.forEach(function (e, k) {
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
                    e.content = moment.utc(e.xit_date).format('DD-MM-YYYY HH:mm:ss') + ' , ' + e.branch + ' , ' + e.dy_create_id;
                } else {
                    e.title = moment.utc(e.xit_date).format('DD-MM-YYYY HH:mm:ss') + ' , ' + e.branch + ' , ' + e.dy_create_id;
                }

                if (k != 0 && e.dy_action_ind == newary[k - 1].dy_action_ind) {
                    tempwrg = [];
                    tempwrg = {
                        xit_date: e.xit_date,
                        dy_action_ind: '',
                        branch: (e.dy_action_ind.toUpperCase() == 'IN' ? 'Exit' : 'Entry') + ' Record is Missing',
                        mismatch: 'yes',
                        dy_create_id: '',
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
            // var newitems = $.merge(newary, wrg);
            var newitems = newary.concat(wrg);
            // console.log(newitems);
            // console.log(backgrd);
            
            var chart_height = (_data.length < 200 ? "300px" : "450px");
            // console.log("chart_height=" + chart_height);

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
                $scope.hideMisMatchTab = false;
                $scope.MisMatchCnt = wrg.length;
                $('#tblMisMatch').DataTable({
                    order: [[1, "asc"]],
                    data: wrg,
                    // mismatch,                    
                    columns: [{
                        "data": "ind",
                        "render": function (data, type, full, meta) {
                            return (data == 'in' ? 'Exit' : 'Entry');// both in == Exit is missing else Entry is missing
                        }
                    }, {
                        "data": "start",
                        "render": function (data, type, full, meta) {
                            // return data.toString().substr(0, 10) + " " + data.toString().substr(11, 8);
                            return moment.utc(data).format('DD-MM-YYYY');
                        }
                    }, {
                        "data": "end",
                        "render": function (data, type, full, meta) {
                            // return data.toString().substr(0, 10) + " " + data.toString().substr(11, 8);
                            return moment.utc(data).format('DD-MM-YYYY');

                        }
                    }],

                });

            }

            $('#tblinout').DataTable({
                // data: result.response.docs,
                order: [[0, "asc"]],
                data: newary.concat(wrg),
                "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    if (aData['mismatch'] == 'yes') {
                        // $(nRow).css('color', 'red');
                        $(nRow).addClass('missingInd');
                    }
                },
                columns: [{
                    "data": "xit_date",
                    "render": function (data, type, full, meta) {
                        // var strdt = data.toString().substr(0, 10) + " " + data.toString().substr(11, 8);
                        var strdt = moment.utc(data).format('DD-MM-YYYY HH:mm:ss');
                        return strdt;
                    }
                }, {
                    "data": "dy_action_ind",
                    "render": function (data, type, full, meta) {
                        if (data == 'in') {
                            return 'Entry';
                        } else if (data == 'out') {
                            return 'Exit';
                        } else if (data == '') {
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

            document.getElementById('zoomIn').onclick = function () { zoom(-0.2); };
            document.getElementById('zoomOut').onclick = function () { zoom(0.2); };
            document.getElementById('moveLeft').onclick = function () { move(0.2); };
            document.getElementById('moveRight').onclick = function () { move(-0.2); };

            $('.vis-item-content').click(function (e) {
                $('.clkditem').show();
                $('.clkditem').text("Selected item : " + this.parentElement.getAttribute('data-title'));
            });

        }
};

MetronicApp.directive('movement', function ($http) {
    return {
        restrict: 'E', //E = element, A = attribute, C = class, M = comment        
        controller: MovementController, 
        scope: {

            //@ reads the attribute value, = provides two-way binding, & works with functions
            expact: '=expact' ,
            movetotal: "="       },
        templateUrl: 'views/travelertracker/move.html',
        link: function ($scope, element, attrs) {
            
         } //DOM manipulation
    }
});