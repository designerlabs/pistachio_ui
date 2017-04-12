'use strict';



var EReportController = function ($scope,$rootScope,$http,Upload,eReportUpdater) {
    
   $scope.reports = $rootScope.reports
   $scope.Savebtn = "Save"
   var getToken = localStorage.getItem("token");
       $scope.login = localStorage.getItem('username')
   formTree();
    $scope.openNodes =[];

   $scope.$on('$viewContentLoaded', function() {

        console.log('ReportEditor'+$scope.report)
    });

   $scope.uploadTemplate = function(file){
                
                    $scope.upload(file);


   }

   $scope.upload = function (file) {
    $scope.clear();
    $scope.report.query="";
        Upload.upload({
            url: globalURL + "api/pistachio/uploadTemplate?",
            data: {file: file}
        }).then(function (resp) {
            $scope.report.reportFileName = resp.data.fileName;
            $scope.report.query = "NA"
            $scope.report.login = $scope.login;
            $scope.report.params = resp.data.params;
            $scope.report.query = resp.data.query;
            console.log($scope.report)
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
            $scope.uploadError = resp.data.error
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ');
        });
    };

   $scope.removeTemplate = function() {
       $scope.report.reportFileName = "";
   }

   $scope.isAllowed = function(option) {
      if(option == "BRANCH") return true;
      if(option == "USERNAME") return true;
      if(option == "STATE") return true;
      if(option == "DEPT") return true;
      if(option == "NATIONALITY") return true;
      if(option == "PASTYPE") return true;
      if(option == "DATETIME") return true;
      if(option == "MIN_DATE") return true;
      if(option == "MAX_DATE") return true;
      if(option == "APPLICATION_TYPE") return true;
      if(option == "APPLICATION_STATUS") return true;
      if(option == "APPLICATION_STEP") return true;
      if(option == "CITY") return true;
      if(option == "APPLICANT") return true;
      if(option == "SECTOR") return true;
      if(option == "SEX") return true;
      if(option == "USER_CREATEID") return true;

      return false;
   }

   $scope.saveReport =function() {
    console.log($scope.report)
    var params = $scope.report.params;
    $scope.report.params = undefined;
    $scope.saveError=""
    if(
        ($scope.report.query ==undefined || $scope.report.query =="NA") &&
        ($scope.report.reportFileName == undefined ||$scope.report.reportFileName.length==0)
     )
         $scope.saveError="Please Upload Template before saving"
    if($scope.report.id == undefined) {
        var selected_nodes =$scope.treeInstance.jstree(true).get_selected();
        if(selected_nodes.length == 0) alert("select system->subsystem")
            else {
                console.log("Adding Report")
                $scope.report.category = selected_nodes[0]
                $http.post(globalURL + queryString + "/",JSON.stringify($scope.report)).
                 then(function(response) {
                        $scope.report.id = response.data.id;
                        $scope.saveSuccess="Report Created"
                        $scope.Savebtn = "Update"
                        $scope.clear();
                },
                 function(error) {
                    $scope.saveError=response.data.error;
                 });

               
            }
        
    }
    else
    {
        console.log("Updating Report")
        $http.put(globalURL + queryString + "/",JSON.stringify($scope.report)).
                 then(function(response) {
       //                 $scope.updatedReport = response.data;
                       $scope.saveSuccess="Report Updated"
                       $scope.clear();

                },
                 function(response) {
                    $scope.saveError=response.data.error;
                 });

    }
    $scope.report.params = params;
   }

   $scope.deleteReport = function() {
      $http.delete(globalURL + queryString + "/" + $scope.report.id).
                 then(function(response) {
                        $scope.report.id = undefined;
                        $scope.report.reportFileName= undefined;
                        $scope.Savebtn = "Save"
                        $scope.clear();
                },
                 function(response) {
                    $scope.saveError=response.data.error;
                 });
   }
    
    $scope.ac = function(){
          return true;
        }

    function formTree() {
        $scope.treeData = [];
        for(var i=0,l=$scope.reports.length;i<l;i++) {
            var obj = {}
            obj.id = $scope.reports[i].name;
            obj.parent = "#"
            obj.text = $scope.reports[i].display;
            $scope.treeData.push(obj)
           
            var child = {}
            child.id ="test"
            child.parent = obj.id
            child.text ="halla"
            child.li_attr = {class:'hidden'};
            $scope.treeData.push(child)
            //addChildNodes(obj.id)
           
        }
        

        
    }


    $scope.$watch('report', function(newValue, oldValue) {
        console.log("report")
        console.log($scope.report)

        if(newValue !=undefined && $scope.treeInstance!=undefined) {
            
            $scope.treeInstance.jstree(true).open_node($scope.report.parent);
        }


        if($scope.report ==undefined || $scope.report.id == undefined)
            $scope.Savebtn = "Save"
        else{
            $scope.Savebtn = "Update"
         
        }

        });

    function isOpened( id) {
        for(var i=0,l=$scope.openNodes.length;i<l;i++) {
            if($scope.openNodes[i] == id) return true;
        }
        return false;
    }



    function addChildNodes(id) {


        console.log($scope.openNodes)
        
    if(!isOpened(id)) {
        $scope.openNodes.push(id)  

        $http.get(globalURL + 'auth/subreports?token=' + getToken + '&parent=' + id).
                    then(function(response) {
                        for(var i=0,l=response.data.length;i<l;i++) {
                           
                                var child = {}
                                child.id =response.data[i].subReports.queryCategory
                                child.parent =id
                                child.icon = "fa fa-wpforms"
                                child.text =response.data[i].subReports.queryCategoryName
                                 if(!response.data[i].add) {
                                    child.state  = {
    
                                                disabled  : true
    
                                        };
                                     }
                                console.log(id)
                                console.log(child)
                                console.log($scope.treeData)
                                $scope.treeData.push(child)    
                           
                            
                        }
                    });
    }


        
    }


        $scope.treeConfig = {
            multiple: false,
            animation: true,
            core : {
                error : function(error) {
                    
                },
                check_callback : true,
        worker : true,
        types : {
            default : {
                icon : 'fa fa-folder'
            },
            subsystem : {
                icon : 'fa fa-wpforms'
            },
            cloud : {
                icon : 'glyphicon glyphicon-cloud'
            }
        },
        "conditionalselect": function (node, event) {
            
            return true;
        },
        plugins : ['types', "conditionalselect"]
            }
        };

        $scope.openNode = function() {
            
        }
        $scope.beforeOpen = function(e, item) {
           addChildNodes(item.node.id)
        }

         $scope.afterOpen = function(e, item) {
            if($scope.report != undefined)
             $scope.treeInstance.jstree(true).select_node($scope.report.category);
        }

        $scope.eventTrigger = {
            "before_open.jstree":"readyCB",
            check_node:"getSelectedCategories"
        }

        $scope.readyCB = function(){
           
        }


        $scope.selectNode = function(e, item) {
            console.log($scope.treeInstance.jstree(true))
            if(item.node.parent == '#') {
                addChildNodes(item.node.id);
                $scope.treeInstance.jstree(true).open_node(item.node.id)
                $scope.treeInstance.jstree(true).deselect_node(item.node.id);

            }

        }

        $scope.closeAll = function() {
          $scope.treeInstance.jstree(true).close_all();
          
        }

        $scope.getSelectedCategories = function() {
            var selected_nodes = $scope.treeInstance.jstree(true).get_checked(true);
            console.log(selected_nodes);
        };

        $scope.clear =function() {
            $scope.uploadError ="";
            $scope.saveError = "";

        }

        $scope.closing = function() {
            $scope.clear();
            $scope.close();
        }


    
   
};

MetronicApp.directive('ereport', function ($http) {
    return {
        restrict: 'E', //E = element, A = attribute, C = class, M = comment        
        controller: EReportController, 
        scope: {

            //@ reads the attribute value, = provides two-way binding, & works with functions
            query: '=' ,
            report: '=',
            close: '&'
        },
        templateUrl: 'views/sqleditor/ereport.html',
        link: function ($scope, element, attrs) {
            
         } //DOM manipulation
    }
});