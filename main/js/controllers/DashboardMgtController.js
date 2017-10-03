'use strict';

MetronicApp.controller('DashboardMgtController', function($rootScope, $scope, $http) {
    $scope.$on('$viewContentLoaded', function() {   
       $scope.records = [];
       $scope.title = "List"
       load()
});
$scope.icons =  ["glass", "music", "search", "envelope-o", "heart", "star", "star-o", "user", "film", "th-large", "th", "th-list", "check", "times", "search-plus", "search-minus", "power-off", "signal", "gear", "cog", "trash-o", "home", "file-o", "clock-o", "road", "download", "arrow-circle-o-down", "arrow-circle-o-up", "inbox", "play-circle-o", "rotate-right", "repeat", "refresh", "list-alt", "lock", "flag", "headphones", "volume-off", "volume-down", "volume-up", "qrcode", "barcode", "tag", "tags", "book", "bookmark", "print", "camera", "font", "bold", "italic", "text-height", "text-width", "align-left", "align-center", "align-right", "align-justify", "list", "dedent", "outdent", "indent", "video-camera", "picture-o", "pencil", "map-marker", "adjust", "tint", "edit", "pencil-square-o", "share-square-o", "check-square-o", "arrows", "step-backward", "fast-backward", "backward", "play", "pause", "stop", "forward", "fast-forward", "step-forward", "eject", "chevron-left", "chevron-right", "plus-circle", "minus-circle", "times-circle", "check-circle", "question-circle", "info-circle", "crosshairs", "times-circle-o", "check-circle-o", "ban", "arrow-left", "arrow-right", "arrow-up", "arrow-down", "mail-forward", "share", "expand", "compress", "plus", "minus", "asterisk", "exclamation-circle", "gift", "leaf", "fire", "eye", "eye-slash", "warning", "exclamation-triangle", "plane", "calendar", "random", "comment", "magnet", "chevron-up", "chevron-down", "retweet", "shopping-cart", "folder", "folder-open", "arrows-v", "arrows-h", "bar-chart-o", "twitter-square", "facebook-square", "camera-retro", "key", "gears", "cogs", "comments", "thumbs-o-up", "thumbs-o-down", "star-half", "heart-o", "sign-out", "linkedin-square", "thumb-tack", "external-link", "sign-in", "trophy", "github-square", "upload", "lemon-o", "phone", "square-o", "bookmark-o", "phone-square", "twitter", "facebook", "github", "unlock", "credit-card", "rss", "hdd-o", "bullhorn", "bell", "certificate", "hand-o-right", "hand-o-left", "hand-o-up", "hand-o-down", "arrow-circle-left", "arrow-circle-right", "arrow-circle-up", "arrow-circle-down", "globe", "wrench", "tasks", "filter", "briefcase", "arrows-alt", "group", "users", "chain", "link", "cloud", "flask", "cut", "scissors", "copy", "files-o", "paperclip", "save", "floppy-o", "square", "bars", "list-ul", "list-ol", "strikethrough", "underline", "table", "magic", "truck", "pinterest", "pinterest-square", "google-plus-square", "google-plus", "money", "caret-down", "caret-up", "caret-left", "caret-right", "columns", "unsorted", "sort", "sort-down", "sort-asc", "sort-up", "sort-desc", "envelope", "linkedin", "rotate-left", "undo", "legal", "gavel", "dashboard", "tachometer", "comment-o", "comments-o", "flash", "bolt", "sitemap", "umbrella", "paste", "clipboard", "lightbulb-o", "exchange", "cloud-download", "cloud-upload", "user-md", "stethoscope", "suitcase", "bell-o", "coffee", "cutlery", "file-text-o", "building-o", "hospital-o", "ambulance", "medkit", "fighter-jet", "beer", "h-square", "plus-square", "angle-double-left", "angle-double-right", "angle-double-up", "angle-double-down", "angle-left", "angle-right", "angle-up", "angle-down", "desktop", "laptop", "tablet", "mobile-phone", "mobile", "circle-o", "quote-left", "quote-right", "spinner", "circle", "mail-reply", "reply", "github-alt", "folder-o", "folder-open-o", "smile-o", "frown-o", "meh-o", "gamepad", "keyboard-o", "flag-o", "flag-checkered", "terminal", "code", "reply-all", "mail-reply-all", "star-half-empty", "star-half-full", "star-half-o", "location-arrow", "crop", "code-fork", "unlink", "chain-broken", "question", "info", "exclamation", "superscript", "subscript", "eraser", "puzzle-piece", "microphone", "microphone-slash", "shield", "calendar-o", "fire-extinguisher", "rocket", "maxcdn", "chevron-circle-left", "chevron-circle-right", "chevron-circle-up", "chevron-circle-down", "html5", "css3", "anchor", "unlock-alt", "bullseye", "ellipsis-h", "ellipsis-v", "rss-square", "play-circle", "ticket", "minus-square", "minus-square-o", "level-up", "level-down", "check-square", "pencil-square", "external-link-square", "share-square", "compass", "toggle-down", "caret-square-o-down", "toggle-up", "caret-square-o-up", "toggle-right", "caret-square-o-right", "euro", "eur", "gbp", "dollar", "usd", "rupee", "inr", "cny", "rmb", "yen", "jpy", "ruble", "rouble", "rub", "won", "krw", "bitcoin", "btc", "file", "file-text", "sort-alpha-asc", "sort-alpha-desc", "sort-amount-asc", "sort-amount-desc", "sort-numeric-asc", "sort-numeric-desc", "thumbs-up", "thumbs-down", "youtube-square", "youtube", "xing", "xing-square", "youtube-play", "dropbox", "stack-overflow", "instagram", "flickr", "adn", "bitbucket", "bitbucket-square", "tumblr", "tumblr-square", "long-arrow-down", "long-arrow-up", "long-arrow-left", "long-arrow-right", "apple", "windows", "android", "linux", "dribbble", "skype", "foursquare", "trello", "female", "male", "gittip", "sun-o", "moon-o", "archive", "bug", "vk", "weibo", "renren", "pagelines", "stack-exchange", "arrow-circle-o-right", "arrow-circle-o-left", "toggle-left", "caret-square-o-left", "dot-circle-o", "wheelchair", "vimeo-square", "turkish-lira", "try", "plus-square-o"];
$scope.colors = ["purple","red","blue","green","green-turquoise","yellow-soft","blue-hoki","grey-gallery","purple-soft","yellow-haze","grey-cararra","tomato"]        //console.log($scope);
    


function load(){
      console.log("reloading the page")
         $http.get(globalURL+"pistachio/dashboard")
            .success(function(response) {
                $scope.dashboards = response;
            });
        $http.get(globalURL+"/api/secured/pistachio/solr/dashboard")
            .success(function(response) {
                $scope.solr_dashboards = response;
            });
        $http.get(globalURL+"/api/secured/pistachio/solr/banana/url")
            .success(function(response) {
                $scope.solr_url = response;
            });
        

    }

    $scope.add = function() {
        $scope.record = {};
         $("#dashboardAddForm").modal('show');
    }

    $scope.solrAdd = function() {
        var solrDash = {}
        solrDash.step = 1;
        solrDash.current_page = 1;
        solrDash.total_page = $scope.solr_dashboards.length
        $scope.solrDash = solrDash;
        
         $("#solrAddForm").modal('show');
    }

    $scope.select = function(row) {
        $scope.record = {};
        $scope.record.title = row.title;
        $scope.record.url = $scope.solr_url + row.id
        $scope.record.icon = "user"
        $scope.record.color = "red"
        $scope.solrDash.step = 2;

    }


    $scope.save = function(row) {
        debugger;
         $http.post(globalURL+"pistachio/dashboard",row)
            .success(function(response) {
                $scope.records = response;
                 $("#dashboardAddForm").modal('hide');
                 load();
            });
        
    }

    $scope.updt = function(row) {
         $http.put(globalURL+"pistachio/dashboard",row)
            .success(function(response) {
                $scope.records = response;
                $("#dashboardAddForm").modal('hide');
                load()
            });
        
    }

    $scope.delete = function(row) {
         $http.delete(globalURL+"pistachio/dashboard/"+row.id)
            .success(function(response) {
                load()
            });
        
    }

    $scope.edits = function(row) {
        console.log(row)
        $scope.record = row
        $("#dashboardAddForm").modal('show');
    }



        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageSidebarClosed = false;
        $rootScope.skipTitle = false;
        $rootScope.settings.layout.setTitle("dashboardmgt");


});
