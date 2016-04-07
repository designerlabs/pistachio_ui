'use strict';

MetronicApp.controller('d2dTrackingController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {
      // initialize core components
      Metronic.initAjax();
      $scope.drawSparkline = 0;

      $scope.changeDt=function(format){ // for display purpose
        var newDate = format.split('T');
        var newDate2 = newDate[0].split('-').reverse().join('/');
        return newDate2;
      };


      $scope.backBtn = function(e){

        var branchN = this.$parent.ele2;
        debugger;
        if(branchN == "Employee"){
          $scope.timelineChart("Inital", "Branch");
          localStorage.stage = "Branch";
        }

        if(branchN == "Country"){
          $scope.timelineChart($scope.getBranchVal.one, "Employee");
          localStorage.stage = "Employee";
        }

        if(branchN == "Visitor"){
          $scope.timelineChart($scope.getCtryName.one, "Country");
          localStorage.stage = "Country";
        }
      };

      var startDt, endDt, triggerOpt, triggerOptRow, branchQry, mainFacet, triggerBt, groupBy; // Global variable
      
      localStorage.removeItem('branchName'); // each time removing the branch and Emp name
      localStorage.removeItem('empName');
      localStorage.removeItem('ctryName'); 
      localStorage.removeItem('countyName'); 

      $scope.timelineChart = function(ele1, ele2) {
        try{
          $scope.getBranchVal = JSON.parse(localStorage.branchName);
          $scope.getEmpName =  JSON.parse(localStorage.empName);
          $scope.getCtryName = JSON.parse(localStorage.ctryName);
          $scope.BranchName = $scope.getBranchVal.two;
          $scope.BranchQueryName = $scope.getBranchVal.one;
          $scope.EmpName = $scope.getEmpName.two;
          $scope.EmpQueryName = $scope.getEmpName.one;
          $scope.CtryName = $scope.getCtryName.two;
          $scope.CtryQueryName = $scope.getCtryName.one;
        }catch(err){
          console.log(err);
        }
        
        $scope.ele1 = ele1;
        $scope.ele2 = ele2;

        if($scope.ele2 == "Branch"){
          
          $scope.column2 = "No. of Exit / Visitor(s)";
          $scope.column3 = "Exit Chart";
          $scope.column4 = "No. of Entry / Visitor(s)";
          $scope.column5 = " Entry Chart";
        }

        if($scope.ele2 == "Employee"){
          $scope.BranchName = $scope.getBranchVal.two;
          $scope.column2 = "No. of Exit / Visitor(s)";
          $scope.column3 = "Exit Chart";
          $scope.column4 = "No. of Entry / Visitor(s)";
          $scope.column5 = " Entry Chart";
        }
        if($scope.ele2 == "Country"){
          $scope.EmpName = $scope.getEmpName.two;
          $scope.column2 = "No. of Exit / Visitor(s)";
          $scope.column3 = "Exit Chart";
          $scope.column4 = "No. of Entry / Visitor(s)";
          $scope.column5 = " Entry Chart";
        }
        if($scope.ele2 == "Visitor"){
          $scope.CtryName = $scope.getCtryName.two;
          $scope.column2 = "Gender";
          $scope.column3 = "Passport No.";
          $scope.column4 = "No. of Exit";
          $scope.column5 = "No. of Entry";
        }
        $scope.seriesOptions = [];

        $scope.seriesCounter = 0;

        $scope.seriesDet = {
          "series": [
              { "name": "1", "title": "Entry", "color": "#B7D8F5" },
              { "name": "2", "title": "Exit", "color": "#F5B7BC" }
          ]
        };

        //Set Extreme function for Highchart timeline selection
        (function(H) {
          H.wrap(H.Axis.prototype, 'setExtremes', function(proceed) {
            var newMin = arguments[1],
              newMax = arguments[2];
            arguments[1] = (newMin + newMax) / 2;
            // Run original proceed method
            proceed.apply(this, [].slice.call(arguments, 1));
          });
        }(Highcharts));

        function afterSetExtremes(e) {
          var chart = $('#container').highcharts();
          chart.showLoading('Loading data from server...');

          //Formatting Date
          var dateFormat = function(ele) {
            var myDate = new Date(ele);

            var yyyy = myDate.getFullYear().toString();

            var mm = (myDate.getMonth() + 1).toString(); // getMonth() is zero-based
            var dd = myDate.getDate().toString();
            return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]) + "T00:00:00Z";
          };

          
          $scope.startDate = dateFormat(Math.round(e.min));
          $scope.endDate = dateFormat(Math.round(e.max));

          $scope.subtitle = $scope.changeDt(dateFormat(Math.round(e.min))) +" - "+$scope.changeDt(dateFormat(Math.round(e.max)));
         
          if($scope.ele1 == "Inital"){
            triggerOpt = "*:*";
            mainFacet = "branches";
            branchQry = 'branch';
            groupBy ="";
          }else if($scope.ele2 == "Country"){
            triggerOpt = "branch:"+$scope.getBranchVal.one+" AND  dy_create_id:"+$scope.getEmpName.one;
            mainFacet = "country";
            branchQry ="country";
            groupBy ="";
          }else if($scope.ele2 == "Visitor"){
            triggerOpt = "branch:"+$scope.getBranchVal.one+" AND  dy_create_id:"+$scope.getEmpName.one+" AND country:"+$scope.getCtryName.one;
            mainFacet = "country";
            branchQry ="country";
            groupBy = "&&group=true&group.field=doc_no";
          }else{
              triggerOpt = "branch:"+$scope.ele1;
              //branchQry = ',facet:{branch:{type : terms,limit : 5,field: dy_create_id,facet : {exits:{ type : range,field : xit_date,start :"'+startDt+'",end: "'+endDt+'",gap:"%2B1DAY"}}}}';
              mainFacet = "branches";
              branchQry = 'dy_create_id';
              groupBy ="";
          }

          var query_c = '{query: "'+triggerOpt+'",filter : "xit_date : ['+dateFormat(Math.round(e.min))+' TO '+dateFormat(Math.round(e.max))+']",limit: 20,'+
            'facet: {in_outs: {type: terms,limit: 10,field: dy_action_ind,'+
            'facet: {exits: {type: range,field: xit_date,start: " ' + dateFormat(Math.round(e.min)) + '",end: "' + dateFormat(Math.round(e.max)) + '",gap: "%2B1DAY"},passport: "unique(doc_no)"}},'+
            mainFacet+': {type: terms,limit: 15,field:'+branchQry+',facet: {in_out: {type: terms,limit: 2,field: dy_action_ind,  sort:{index:asc},'+
            'facet: {exits: {type: range,field: xit_date,start: " ' + dateFormat(Math.round(e.min)) + '",end: "' + dateFormat(Math.round(e.max)) + '",gap: "%2B1DAY"},passport: "unique(doc_no)"}}'+
            '}}}}}'+groupBy;



          var sq_b = "http://" + solrHost + ":8983/solr/his/query?json=";//jsonQ;
          $http.get(sq_b + query_c).success(function(data) {
            //alert('call-1');

            var storeBranchData = [];
            //debugger;
            if($scope.ele2 == "Country"){

                if(data.facets.count == 0){
                  //if empty
                }else{
                  for (var i = 0, l = data.facets.country.buckets.length; i < l; i++) {
                    var bElement = {};
                    var brName = {};
                    var bName = data.facets.country.buckets[i].val;
                    brName.name = bName;
                    bElement.brhName = brName;
                    for (var k = 0, m = data.facets.country.buckets[i].in_out.buckets.length; k < m; k++) {
                    
                    
                      $scope.bIn_out = data.facets.country.buckets[i].in_out.buckets[k].val;
                      $scope.uniqueVisitors = data.facets.country.buckets[i].in_out.buckets[k].passport; 
                      var brStatus = {};
                      var countEle = [];

                      for (var j = 0, n = data.facets.country.buckets[i].in_out.buckets[k].exits.buckets.length; j < n; j++) {
                        var bDate = data.facets.country.buckets[i].in_out.buckets[k].exits.buckets[j].val;
                        var bCount = data.facets.country.buckets[i].in_out.buckets[k].exits.buckets[j].count;
                        countEle.push(bCount);
                      }
                      //bElement.push(brStatus);

                      if($scope.bIn_out == "1"){
                      $scope.bIn_out = "Entry";
                      var entryTotal = eval(countEle.join("+"));
                      brStatus.entry = countEle.toString().replace(/,/g , ", ");
                      brStatus.uniqueVisitor = $scope.uniqueVisitors;
                      brStatus.entryTotal = entryTotal;
                      bElement.entry  = brStatus;
                    }else if($scope.bIn_out == "2"){
                      $scope.bIn_out = "Exit";
                      var exitTotal = eval(countEle.join("+"));
                      brStatus.exit = countEle.toString().replace(/,/g , ", ");
                      brStatus.uniqueVisitor = $scope.uniqueVisitors;
                      brStatus.exitTotal = exitTotal;
                      bElement.exit  = brStatus;
                    }
                    }

                    var total = eval(countEle.join("+"));
                    var getTotal = {};
                    getTotal.total = total;
                    countEle = countEle.join(", ");
                    var getCount = {};
                    getCount.count = countEle;

                    //bElement.push(getCount);
                    //bElement.push(getTotal);
                    storeBranchData.push(bElement);
                  
                  };  
                }
                
                $scope.branchOut = storeBranchData;
                console.log(storeBranchData);

              }else if($scope.ele2 == "Visitor"){
                  debugger;
                   for (var im = 0, lm = data.grouped.doc_no.groups.length; im < lm; im++) {
                    var bElement = {};
                    var brName = {};
                    var bNumFound = data.grouped.doc_no.groups[im].doclist.numFound;
                    var bName = data.grouped.doc_no.groups[im].doclist.docs[0].name;
                    var bAction = data.grouped.doc_no.groups[im].doclist.docs[0].dy_action_ind;
                    var bDoc = data.grouped.doc_no.groups[im].doclist.docs[0].doc_no;
                    var bSex = data.grouped.doc_no.groups[im].doclist.docs[0].sex;
                    var bDob = data.grouped.doc_no.groups[im].doclist.docs[0].dy_birth_date;
                    
                    brName.name = bName;
                    brName.doc = bDoc;
                    brName.sex = bSex;
                    brName.dob = bDob;
                    brName.numFound = bNumFound;
                    if(bAction == "1"){
                      brName.entry = bAction;  
                    }else{
                      brName.exit = bAction;  
                    }
                    


                    bElement.vName = brName;
                    storeBranchData.push(bElement);

                
              };
                $scope.branchOut = storeBranchData;
                console.log(storeBranchData);
              }else{

                if(data.facets.count == 0){
                  //if empty
                }else{
                  for (var i = 0, l = data.facets.branches.buckets.length; i < l; i++) {
                    var bElement = {};
                    var brName = {};
                    var bName = data.facets.branches.buckets[i].val;
                    brName.name = bName;
                    bElement.brhName = brName;
                    for (var k = 0, m = data.facets.branches.buckets[i].in_out.buckets.length; k < m; k++) {
                      $scope.bIn_out = data.facets.branches.buckets[i].in_out.buckets[k].val;
                      $scope.uniqueVisitors = data.facets.branches.buckets[i].in_out.buckets[k].passport; 
                      var brStatus = {};
                      var countEle = [];
                      for (var j = 0, n = data.facets.branches.buckets[i].in_out.buckets[k].exits.buckets.length; j < n; j++) {
                        var bDate = data.facets.branches.buckets[i].in_out.buckets[k].exits.buckets[j].val;
                        var bCount = data.facets.branches.buckets[i].in_out.buckets[k].exits.buckets[j].count;
                        countEle.push(bCount);
                      }
                      //brStatus.status = bIn_out;
                      //bElement.push(brStatus);
                    
                      if($scope.bIn_out == "1"){
                      $scope.bIn_out = "Entry";
                      var entryTotal = eval(countEle.join("+"));
                      brStatus.entry = countEle.toString().replace(/,/g , ", ");
                      brStatus.uniqueVisitor = $scope.uniqueVisitors;
                      brStatus.entryTotal = entryTotal;
                      bElement.entry  = brStatus;
                    }else if($scope.bIn_out == "2"){
                      $scope.bIn_out = "Exit";
                      var exitTotal = eval(countEle.join("+"));
                      brStatus.exit = countEle.toString().replace(/,/g , ", ");
                      brStatus.uniqueVisitor = $scope.uniqueVisitors;
                      brStatus.exitTotal = exitTotal;
                      bElement.exit  = brStatus;
                    }
                    }
                    
                    var total = eval(countEle.join("+"));

                    var getTotal = {};
                    
                    getTotal.total = total;

                    countEle = countEle.join(", ");

                    var getCount = {};
                    getCount.count = countEle;

                    

                    //bElement.push(getCount);
                    //bElement.push(getTotal);
                        
                    storeBranchData.push(bElement);
                  };
                }
                
                $scope.branchOut = storeBranchData;
                console.log(storeBranchData);
              }
          });



          $.each($scope.seriesDet, function(j, valu) {

            $.each(valu, function(m, k) {
              //On load

              if($scope.ele2 == "Branch"){
              triggerOptRow = "rows=2&";
              
              }else if($scope.ele2 == "Employee"){
                triggerOptRow = "rows=2&fq=branch:"+$scope.getBranchVal.one+"&";
              }else if($scope.ele2 == "Country"){
                triggerOptRow = "rows=2&fq=branch:"+$scope.getBranchVal.one+"&fq=dy_create_id:"+$scope.getEmpName.one+"&";
              }else if($scope.ele2 == "Visitor"){
                triggerOptRow = "rows=2&fq=branch:"+$scope.getBranchVal.one+"&fq=dy_create_id:"+$scope.getEmpName.one+"&fq=country:"+$scope.getCtryName.one+"&";
              }else{
                triggerOptRow = "rows=2&fq=branch:"+$scope.getBranchVal.one+"&";
              }

              //var query = 'q=dy_action_ind:' + k.name + '&rows=2&fq=xit_date:[NOW-6MONTH%20TO%20NOW]&json.facet={in_outs:{type : range,field : xit_date,start : "2015-01-01T00:00:00Z",end :"2016-01-23T00:00:00Z",gap:"%2B1DAY"}}' // "q=-mad_crt_dt%3A\"1900-01-01T00%3A00%3A00Z\"&json.facet ={\"min_date\":\"min(mad_crt_dt)\",\"max_date\":\"max(mad_crt_dt)\"}}"
              var query = 'q=dy_action_ind:'+k.name+'&'+triggerOptRow+'json.facet={in_outs:{type : range,field : xit_date,start :"' + dateFormat(Math.round(e.min)) + '",end :"' + dateFormat(Math.round(e.max)) + '",gap:"%2B1DAY"},passport: "unique(doc_no)"}' // "q=-mad_crt_dt%3A\"1900-01-01T00%3A00%3A00Z\"&json.facet ={\"min_date\":\"min(mad_crt_dt)\",\"max_date\":\"max(mad_crt_dt)\"}}"
              var sq = "http://" + solrHost + ":8983/solr/his/query?"
              $http.get(sq + query).
              success(function(data) {
                  console.log(data);
                  var storeData = [];
                  
                  if(data.facets.count == 0){
                    //console.log(data.facets.count.length);
                   }else{
                    for (var i = 0, l = data.facets.in_outs.buckets.length; i < l; i++) {
                      var obj = data.facets.in_outs.buckets[i];
                      var element = [];
                      element.push(new Date(obj.val).getTime());
                      element.push(obj.count);
                      storeData.push(element);
                    }
                   }
                  
                  chart.hideLoading();
                  // As we're loading the data asynchronously, we don't know what order it will arrive. So
                  // we keep a counter and create the chart when all the data is loaded.
                  $scope.seriesCounter += 1;

                  if ($scope.seriesCounter === $scope.seriesDet.series.length) {
                      $scope.createChart();
                  }

              });
            });
          });

        };

        /**
         * Create the chart when all data is loaded
         * @returns {undefined}
         */
        $scope.createChart = function() {

          $('#container').highcharts('StockChart', {

              rangeSelector: {
                  selected: 2
              },

              chart: {
                  zoomType: 'x'

              },

              xAxis: {
                  events: {
                      afterSetExtremes: afterSetExtremes
                  },
                  minRange: 3600 * 1000 // one hour
              },


              plotOptions: {

              },

              tooltip: {

                  pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
                  valueDecimals: 2
              },

              series: $scope.seriesOptions
          });
        }
        $scope.populateChart();
        
      };


      $scope.populateChart = function(){
        
        if($scope.startDate){
          startDt = $scope.startDate;
        }else{
          startDt =  "2015-02-01T00:00:00Z";
        };


        if($scope.endDate){
          endDt = $scope.endDate;
        }else{
          endDt = "2016-02-05T00:00:00Z";
        };

        $.each($scope.seriesDet, function(j, valu) {

          $.each(valu, function(m, k) {
            //On load

            if($scope.ele1 == "Inital"){
              triggerOpt = "*:*";
               mainFacet = "branches";
              triggerOptRow = "rows=2&";
              groupBy ="";
              $scope.subtitle = $scope.changeDt(startDt) +" - "+$scope.changeDt(endDt);
              branchQry = 'branch';

            }else if($scope.ele2 == "Country"){
              triggerOpt = "branch:"+$scope.getBranchVal.one+" AND  dy_create_id:"+$scope.getEmpName.one;
              triggerOptRow = "rows=2&fq=branch:"+$scope.getBranchVal.one+"&fq=dy_create_id:"+$scope.getEmpName.one+"&";
              mainFacet = "country";
              branchQry ="country";
              groupBy ="";
             
            }else if($scope.ele2 == "Visitor"){
              triggerOpt = "branch:"+$scope.getBranchVal.one+" AND  dy_create_id:"+$scope.getEmpName.one+" AND country:"+$scope.getCtryName.one;
              triggerOptRow = "rows=2&fq=branch:"+$scope.getBranchVal.one+"&fq=dy_create_id:"+$scope.getEmpName.one+"&fq=country:"+$scope.getCtryName.one+"&";
              mainFacet = "country";
              branchQry ="country";
              groupBy = "&&group=true&group.field=doc_no";
            }else{
              triggerOpt = "branch:"+$scope.ele1;
              triggerOptRow = "rows=2&fq=branch:"+$scope.ele1+"&";
              groupBy ="";

              $scope.subtitle = $scope.changeDt(startDt) +" - "+$scope.changeDt(endDt);
              //branchQry = ',facet:{branch:{type : terms,limit : 5,field: dy_create_id,facet : {exits:{ type : range,field : xit_date,start :"'+startDt+'",end: "'+endDt+'",gap:"%2B1DAY"}}}}';
              branchQry = 'dy_create_id';
            }
            var query = 'q=dy_action_ind:' + k.name + '&'+triggerOptRow+'json.facet={in_outs:{type : range,field : xit_date,start : "'+startDt+'",end :"'+endDt+'",gap:"%2B1DAY"},passport: "unique(doc_no)"}' // "q=-mad_crt_dt%3A\"1900-01-01T00%3A00%3A00Z\"&json.facet ={\"min_date\":\"min(mad_crt_dt)\",\"max_date\":\"max(mad_crt_dt)\"}}"
            /*var query_spark = '{query: "*:*",limit: 0,'+
            'facet: {in_outs: {type: terms,limit: 10,field: dy_action_ind,'+
            'facet: {exits: {type: range,field: xit_date,start: "'+startDt+'",end: "'+endDt+'",gap: "%2B1DAY"}}},'+
            'branches: {type: terms,limit: 15,field: branch,facet: {in_out: {type: terms,limit: 2,field: dy_action_ind,'+
            'facet: {exits: {type: range,field: xit_date,start: "'+startDt+'",end: "'+endDt+'",gap: "%2B1DAY"}}}'+
            '}}}}}';*/

            var query_spark = '{query: "'+triggerOpt+'",filter : "xit_date : ['+startDt+' TO '+endDt+']", limit: 20,'+
            'facet: {in_outs: {type: terms,limit: 10,field: dy_action_ind,'+
            'facet: {exits: {type: range,field: xit_date,start: "'+startDt+'",end: "'+endDt+'",gap: "%2B1DAY"},passport: "unique(doc_no)"}},'+
            mainFacet+': {type: terms,limit: 15,field: '+branchQry+',facet: {in_out: {type: terms,limit: 2,field: dy_action_ind, sort:{index:asc},'+
            'facet: {exits: {type: range,field: xit_date,start: "'+startDt+'",end: "'+endDt+'",gap: "%2B1DAY"},passport: "unique(doc_no)"}}'+
            '}}}}}'+groupBy;


            var sq_spark = "http://" + solrHost + ":8983/solr/his/query?json=";//jsonQ;
            
            var sq = "http://" + solrHost + ":8983/solr/his/query?"
            $http.get(sq + query).
            success(function(data) {

                console.log(data);
                //alert('call-2');
                var storeData = [];
                   if(data.facets.count == 0){
                    //console.log(data.facets.count.length);
                   }else{
                    for (var i = 0, l = data.facets.in_outs.buckets.length; i < l; i++) {
                      var obj = data.facets.in_outs.buckets[i];
                      var element = [];
                      element.push(new Date(obj.val).getTime());
                      element.push(obj.count);
                      storeData.push(element);
                    }
                   }
                  /*for (var i = 0, l = data.facets.in_outs.buckets.length; i < l; i++) {
                    var obj = data.facets.in_outs.buckets[i];
                    var element = [];
                    element.push(new Date(obj.val).getTime());
                    element.push(obj.count);
                    storeData.push(element);
                  }  
               */
                


                //console.log(storeData);


                $scope.seriesOptions[m] = {
                    name: k.title,
                    color: k.color,
                    data: storeData,
                    type: 'areaspline',
                    threshold: null
                };



                // As we're loading the data asynchronously, we don't know what order it will arrive. So
                // we keep a counter and create the chart when all the data is loaded.
                $scope.seriesCounter += 1;

                if ($scope.seriesCounter === $scope.seriesDet.series.length) {
                    $scope.createChart();
                }

            });


            $http.get(sq_spark + query_spark).success(function(data) {
              console.log(data);
              //$scope.branchData = data.facets.branches.buckets;
              //$scope.branchId = data.facets.branches.buckets;
              var storeBranchData = [];

              if($scope.ele2 == "Country"){
                if(data.facets.count == 0){
                  //if empty
                }else{
                    for (var i = 0, l = data.facets.country.buckets.length; i < l; i++) {
                      var bElement = {};
                      var brName = {};
                      var bName = data.facets.country.buckets[i].val;
                      brName.name = bName;
                      bElement.brhName = brName;
                    for (var k = 0, m = data.facets.country.buckets[i].in_out.buckets.length; k < m; k++) {
                      
                      
                      $scope.bIn_out = data.facets.country.buckets[i].in_out.buckets[k].val;
                      $scope.uniqueVisitors = data.facets.country.buckets[i].in_out.buckets[k].passport; 
                      var brStatus = {};
                       var countEle = [];

                       for (var j = 0, n = data.facets.country.buckets[i].in_out.buckets[k].exits.buckets.length; j < n; j++) {
                        var bDate = data.facets.country.buckets[i].in_out.buckets[k].exits.buckets[j].val;
                        var bCount = data.facets.country.buckets[i].in_out.buckets[k].exits.buckets[j].count;
                        countEle.push(bCount);
                      }
                      //bElement.push(brStatus);

                      if($scope.bIn_out == "1"){
                        $scope.bIn_out = "Entry";
                        var entryTotal = eval(countEle.join("+"));
                        brStatus.entry = countEle.toString().replace(/,/g , ", ");
                        brStatus.uniqueVisitor = $scope.uniqueVisitors;
                        brStatus.entryTotal = entryTotal;
                        bElement.entry  = brStatus;
                      }else if($scope.bIn_out == "2"){
                        $scope.bIn_out = "Exit";
                        var exitTotal = eval(countEle.join("+"));
                        brStatus.exit = countEle.toString().replace(/,/g , ", ");
                        brStatus.uniqueVisitor = $scope.uniqueVisitors;
                        brStatus.exitTotal = exitTotal;
                        bElement.exit  = brStatus;
                      }
                      }


                      var total = eval(countEle.join("+"));

                      var getTotal = {};
                      getTotal.total = total;


                      countEle = countEle.join(", ");

                      var getCount = {};
                      getCount.count = countEle;

                      //bElement.push(getCount);
                      //bElement.push(getTotal);
                          
                      storeBranchData.push(bElement);
                      
                      
                    
                    
                  };
                }
                

              $scope.branchOut = storeBranchData;
                console.log(storeBranchData);
              }else if($scope.ele2 == "Visitor"){
                   for (var im = 0, lm = data.grouped.doc_no.groups.length; im < lm; im++) {
                    var bElement = {};
                    var brName = {};
                    var bNumFound = data.grouped.doc_no.groups[im].doclist.numFound;
                    var bName = data.grouped.doc_no.groups[im].doclist.docs[0].name;
                    var bAction = data.grouped.doc_no.groups[im].doclist.docs[0].dy_action_ind;
                    var bDoc = data.grouped.doc_no.groups[im].doclist.docs[0].doc_no;
                    var bSex = data.grouped.doc_no.groups[im].doclist.docs[0].sex;
                    var bDob = data.grouped.doc_no.groups[im].doclist.docs[0].dy_birth_date;
                    
                    brName.name = bName;
                    brName.doc = bDoc;
                    brName.sex = bSex;
                    brName.dob = bDob;
                    brName.numFound = bNumFound;
                    if(bAction == "1"){
                      brName.entry = bAction;  
                    }else{
                      brName.exit = bAction;  
                    }
                    


                    bElement.vName = brName;
                    storeBranchData.push(bElement);

                
              };
                $scope.branchOut = storeBranchData;
                console.log(storeBranchData);
              }else{
                if(data.facets.count == 0){
                  //if empty
                }else{
                    for (var i = 0, l = data.facets.branches.buckets.length; i < l; i++) {
                      var bElement = {};
                      var brName = {};
                      var bName = data.facets.branches.buckets[i].val;
                      brName.name = bName;
                      bElement.brhName = brName;

                    for (var k = 0, m = data.facets.branches.buckets[i].in_out.buckets.length; k < m; k++) {
                      
                     
                      $scope.bIn_out = data.facets.branches.buckets[i].in_out.buckets[k].val;
                      $scope.uniqueVisitors = data.facets.branches.buckets[i].in_out.buckets[k].passport; 
                      var brStatus = {};
                      
                      var countEle = [];
                      for (var j = 0, n = data.facets.branches.buckets[i].in_out.buckets[k].exits.buckets.length; j < n; j++) {
                        
                        var bDate = data.facets.branches.buckets[i].in_out.buckets[k].exits.buckets[j].val;
                        var bCount = data.facets.branches.buckets[i].in_out.buckets[k].exits.buckets[j].count;
                        countEle.push(bCount);

                      }
                      //brStatus.status = bIn_out;
                      
                      
                      if($scope.bIn_out == "1"){
                        $scope.bIn_out = "Entry";
                        var entryTotal = eval(countEle.join("+"));
                        brStatus.entry = countEle.toString().replace(/,/g , ", ");
                        brStatus.uniqueVisitor = $scope.uniqueVisitors;
                        brStatus.entryTotal = entryTotal;
                        bElement.entry  = brStatus;
                      }else if($scope.bIn_out == "2"){
                        $scope.bIn_out = "Exit";
                        var exitTotal = eval(countEle.join("+"));
                        brStatus.exit = countEle.toString().replace(/,/g , ", ");
                        brStatus.uniqueVisitor = $scope.uniqueVisitors;
                        brStatus.exitTotal = exitTotal;
                        bElement.exit  = brStatus;
                      }
                    }
                      
                      var total = eval(countEle.join("+"));

                      var getTotal = {};
                      
                      getTotal.total = total;

                      countEle = countEle.join(", ");

                      var getCount = {};
                      getCount.count = countEle;

                      

                      //bElement.push(getCount);
                      //bElement.push(getTotal);
                          
                      storeBranchData.push(bElement);
                  };
                }
                
              $scope.branchOut = storeBranchData;
              console.log(storeBranchData);
              }

              
              
            });
          });
        });
      };

     
      localStorage.stage = "Branch";

      $scope.timelineChart("Inital", localStorage.stage);

      $scope.cleanQuery = function(data) {
       data = data.replace(/\(/g,"\\\(");
       data = data.replace(/\)/g,"\\\)");
         data = data.replace(/ /g,"*");
         return(data);
      };

      

      $scope.viewBtn = function(e){

        var getStage = localStorage.stage;
        var branchN = this.$parent.$$watchers[0].last;
        var EmpN = this.$parent.$$watchers[0].last;
        var countryN =  this.$parent.$$watchers[0].last;
        var visitorN = this.$parent.$$watchers[0].last;
        
        branchN = $scope.cleanQuery(branchN);
        EmpN = $scope.cleanQuery(EmpN);
        countryN = $scope.cleanQuery(countryN);
        visitorN = $scope.cleanQuery(visitorN);
        
        var setBranch = { 'one': branchN, 'two': this.$parent.$$watchers[0].last};
        var setEmp = { 'one': EmpN, 'two': this.$parent.$$watchers[0].last};
        var setCountry = { 'one': countryN, 'two': this.$parent.$$watchers[0].last};
        var setVisitor = { 'one': visitorN, 'two': this.$parent.$$watchers[0].last};

        if(getStage == "Branch"){
          localStorage.setItem('branchName', JSON.stringify(setBranch));
          localStorage.stage = "Employee";
        }
        
        if(getStage == "Employee"){
          localStorage.setItem('empName', JSON.stringify(setEmp));
          localStorage.stage = "Country";
        }
        
        if(getStage == "Country"){
          localStorage.setItem('ctryName', JSON.stringify(setCountry));
          localStorage.stage = "Visitor";
        }
    
        $scope.timelineChart(branchN, localStorage.stage);
        //alert(getStage);
      };
    });

// set sidebar closed and body solid layout mode
$rootScope.settings.layout.pageSidebarClosed = false;
});
