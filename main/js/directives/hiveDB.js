'use strict';



var ImpalaController = function ($scope,$http) {


   var getToken = localStorage.getItem("token");
   $scope.login = localStorage.getItem('username')

   var openedItems = {}
   $scope.treeConfig = {
                multiple: false,
                animation: false,
                core : {
                    error : function(error) {
                    },
                    check_callback : true,
                    worker : false
                },
                
                 plugins : ['search'],
                 "search": {
'case_insensitive': true,
'show_only_matches': true
}
                 
        };
   $scope.treeConfig.version++;
   formTree();

   $scope.destroy = function(){

   }
var to = false;
$scope.$watch('searchText', function(newValue, oldValue) {
        if($scope.searchText != undefined && $scope.searchText.length>1)
         {
            $scope.treeInstance.jstree(true).search($scope.searchText);
             $scope.treeConfig.version++;
         }
         else
         {
          $scope.treeInstance.jstree(true).clear_search();
         }
    });

   function formTree() {
        $scope.treeData = [];

        $http.get(globalURL + "api/pistachio/secured/hadoop/db/role")
                .then(function(response) {
                    $scope.databaseLength = response.data.length;
                    $scope.databaseList = response.data;
                    console.log("dblist" + response.data[0]);

                    for(var i=0,l=$scope.databaseList.length-1;i<=l;l--) {
                        var obj = {}
                        obj.id = $scope.databaseList[l];
                        obj.parent = "#"
                        obj.text = $scope.databaseList[l];
                        obj.icon = "fa fa-database"
                        $scope.treeData.push(obj)
                       
                        var child = {}
                        child.id ="test"
                        child.parent = obj.id
                        child.text ="halla"
                        child.li_attr = {class:'hidden'};
                        $scope.treeData.push(child)
                        //addChildNodes(obj.id)
                       
                  }
        
                });

        $scope.treeConfig.version++;

        
    }


    function isOpened( id) {
        for(var i=0,l=$scope.openNodes.length;i<l;i++) {
            if($scope.openNodes[i] == id) return true;
        }
        return false;
    }


    function addChildNodes(node) {
    if(node.parent == '#')
        $scope.database = node.id

    if(openedItems[node.id]) {
    
     }
     else {
         openedItems[node.id] = true;
    if(node.parent == '#') {
          $http.get(globalURL + "api/pistachio/secured/hadoop/tables?db=" + node.id)
                  .then(function(response) {
                      $scope.datatableLength = response.data.length;
                      $scope.datatableList = response.data;
                      console.log("dtlist" + response.data[0]);
                      //autoComplete(seldb)
                         for(var l=response.data.length-1;l>=0;l--) {
                             
                                  var child = {}
                                  child.id =response.data[l]
                                  child.parent =node.id
                                  child.icon = "fa fa-table"
                                  child.text =response.data[l]
                                  $scope.treeData.push(child)    
                                  var obj = {}
                                    obj.id ="test"
                                    obj.parent = child.id
                                    obj.text ="halla"
                                    obj.li_attr = {class:'hidden'};
                                    $scope.treeData.push(obj)
                             
                              
                          }

                  });
    }
    else {
      $http.get(globalURL + "api/pistachio/secured/hadoop/column?db=" + node.parent + "&table=" + node.id)
                .then(function(response) {

                  for(var l=response.data.length-1;l>=0;l--) {
                             
                                  var child = {}
                                  child.id = node.id+response.data[l].column
                                  child.parent =node.id
                                  child.icon = "fa fa-wpforms"
                                  child.text =response.data[l].column + " (" + response.data[l].type +")"
                                  $scope.treeData.push(child)    
                             
                              
                    }
                },
                function(error){

                });

    }
    $scope.treeConfig.version++;
     }
    
        
    


        
    }


 

        $scope.openNode = function() {
            alert("halla")
        }
        $scope.beforeOpen = function(e, item) {
           addChildNodes(item.node)
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
           // if(item.node.parent == '#') {
                addChildNodes(item.node);
                $scope.treeInstance.jstree(true).open_node(item.node.id)
                $scope.treeInstance.jstree(true).deselect_node(item.node.id);

           // }

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

        $scope.$on('$locationChangeStart', function (event, next, current) {
           $scope.treeInstance.tree.jstree('destroy')
        });


    
   
};

MetronicApp.directive('impala', function ($http) {
    return {
        restrict: 'E', //E = element, A = attribute, C = class, M = comment        
        controller: ImpalaController, 
        scope: {

            //@ reads the attribute value, = provides two-way binding, & works with functions
            database: '=' ,
            editor: '='
        },
        templateUrl: 'views/sqleditor/hive.html',
        link: function ($scope, element, attrs) {
            
         } //DOM manipulation
    }
});