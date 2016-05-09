'use strict';

MetronicApp.controller('TravelerTrackerController', function($rootScope,$scope,$http, $timeout) {

var strpic = 'ffd8ffe000104a46494600010200000100010000ffdb004300080606070605080707070909080a0c140d0c0b0b0c1912130f141d1a1f1e1d1a1c1c20242e2720222c231c1c2837292c30313434341f27393d38323c2e333432ffdb0043010909090c0b0c180d0d1832211c213232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232ffc000110800c0009603012200021101031101ffc4001f0000010501010101010100000000000000000102030405060708090a0bffc400b5100002010303020403050504040000017d01020300041105122131410613516107227114328191a1082342b1c11552d1f02433627282090a161718191a25262728292a3435363738393a434445464748494a535455565758595a636465666768696a737475767778797a838485868788898a92939495969798999aa2a3a4a5a6a7a8a9aab2b3b4b5b6b7b8b9bac2c3c4c5c6c7c8c9cad2d3d4d5d6d7d8d9dae1e2e3e4e5e6e7e8e9eaf1f2f3f4f5f6f7f8f9faffc4001f0100030101010101010101010000000000000102030405060708090a0bffc400b51100020102040403040705040400010277000102031104052131061241510761711322328108144291a1b1c109233352f0156272d10a162434e125f11718191a262728292a35363738393a434445464748494a535455565758595a636465666768696a737475767778797a82838485868788898a92939495969798999aa2a3a4a5a6a7a8a9aab2b3b4b5b6b7b8b9bac2c3c4c5c6c7c8c9cad2d3d4d5d6d7d8d9dae2e3e4e5e6e7e8e9eaf2f3f4f5f6f7f8f9faffda000c03010002110311003f00f7fa28a2800a28a2800a28a2800a28a6348880966000f53400fa2b227f136936f26c7bb4cf4e0f19fad3e3f11694ecabf6c8959ba066039f4fad006a515562d46ce7388aea173e8ae09ab59cf4a0028a28a0028a28a0028a28a0028a28a0028a28a0028a28a002b0f5df15e95a044c6eee5449da253963f8571be3ef8969a579ba669326eba1f2c938ff009667d07a9f7ed5e2577a95cdedd3cd24aef231cb31249fc4d033d475bf8b97d312ba74696e9eadf3b7f415c2ea5e31d5afdd9ae3519e5cf182d803f0e95890dbcf74484cb01d4f615657489029765240f5e2a5c92dcb54dbd868d667030cecc3b827a8a5fedb9c2e0bb004f1cd392c1950315c0ce0023ad39ed09fe1ebed4b9d07b3658b6f10c91c8acb23aedc7f111eff00e15e85e1ef88774e9e4cf725638d492dd49f415e6834762d90b838a8a5b0d434e8fce50cf1672597fad1ce84e9c91f54697aa43a85ba18d8b1dbcb11807b67f3cd68d7cab63e37d52da6052e65500007f784e7031f87e15edff0ff00c710f882c8c175301771f5de47cc3d455907774519cd14005145140051451400514514005705f12fc663c3ba59b3b571f6fb952171d635eed8fe5ffd6aeaf5ed66db41d1ee351b93fbb85490b9e58f603eb5f2e78835ab8d6351b9d46edcb4b2be71e9ec3d874a00cbb9b969a62d2316627d735ada268d36a9300015854fcc477acad26c9f53d4a38471939623f8457ae699651d9db048902a28c703a56356a72e88e8a34f9b5652b6d261b64112a011a8e703ad2de5bc5b7e618ed8ad68d3209ee4e6a136e6572c4703819ae3723b52b18a963e6c81d930318031d3daa71a7c61972b855fe75b8969b100039fa77a912d1410c4723a52bb2b43221d3d5583347b7d17d3eb571ec619222850608c74abc60c02719a8d815e29a9344b573cb7c51e1a7b291ee2d97e4eaca3f98ac6d2f55b8d3e74b88242ae98233debd82fad56e6dd94804e38af24d7b4d6d3eed9d1711b9ce3d0d7552a97f759c95a97da47bd7c3ef88b6dae22e9f7a7c9bb006cdcd90fec0ff4af48af8dacee5e170e8e5590e41070457d19f0dbc667c45a7fd8ef1c1be85721b3feb147f51c5741ca77b45145001451450014514500792fc66bf95a1b3d3d1cac5ccb20fd067f5ff38af0bbb7df2e07dd5af66f8bec56fa219f99d7079e8abce3f33fcabc5a54c39efcd033acf03da832c929ea7bd7a3aa662118e371e7e95c0f82c1e9f9d7a14442619881f5ae1abac99dd4b48a2431844381db0315621b64d80b8e7da911118ab1391daada45bb38e40a85134721890a06e3f335208971c0a90c5cfa528420e2aec45cace8bcf6aa33260d694b1b678aa53463d6a25166916507e2b8df15d92cf6b21c7519aec67609c6e15ceeb8bbeca4c8cf1442e984acd33cb606db20ce71d0d75fe09d6a4d0bc4f6736fc279caafeea4ed3fa1fd0572a630b3e3dcd5b84334b195e18918fad7a079a7d860e46696a1b40c2d210ff7846b9fae054d4c90a28a2800a28a2803c53e36ba0d434f01be611b6573ea4735e3f2e19f3d3247f2af66f8d76323476d78912aa2b6c2f8e5891fae00fa0af1b600b707b123f2a0676de098f72bc9d81c0ae96e85f5d5d79702a88d4725bbd60f8000934c661fdf35dcc51ac4d9c633cf4ae297c6d9dd05eea467dbe9775c19276403a6d6ce6addbc3716f2153732b73c126a79f52d3ecffe3eef2187d048e013f8525bea1a7df1cdadd4337bc6e0d3b8ecb634e29432007ae3ad38ce33d38aaa8bb5873c1a7cc9b013bb93473072a22ba9d994aa9c7d2b02e935273fb8248cf3f356ec689b4bb9c01c924d63ea5e2dd334edebf67bb942287768a125554e7049f4383f9534db13b47732e5b4bf50c4e377a8626aadcacb259c914e06ec751deb6e3d66cef591577c4eea1952418241ee3d699736db909033918a97ae85ab2d4f1e9576df4919eaac6ad69c15f5ab6859888da45527d324543a9a98b5db85e9f39fd2934a569b558f6a92c5c6d5033ce462bad6c704b4933ec38432c2818e582804e7be2a4a86d496b588b752833f954d54405145140051451401c37c50d316fbc36d70e405b6cca73df00e07e78af9b36904b7619e715f5778c349b8d6bc3975676b8f3e45c2ee381ef5e0de20f0dcfa3d94b6f24601b6c23103ab1e49cd4ca56348439afe46cfc39b6c680d211d656fd315d85cda99e3d8b23267baf5ac5f05c422f0b59e3abee63f52c6ba48fe6201ae496e75c34473375e0f373622186411ce9309a3ba53fbc0c3d73d78f7a9f4af0ec9a6d835a33acb2c92191a76196dd80011e98007e55d4a2951c0a7edda37639f5ad149dac2d39af6285c1d9b173920727d4d477727ee41cf4a595c3b11dc9a8ee862200f20d62d9aae80b10bbb1683711f303c7719ce3e958fac7852db5db849ef247122a84253e5dea3a038ebf5ad7d3e4fde8553d062b45c0eb8ab84ac889a5739bbad16195a3321dc220046aa368403818ef53a441230a4938e326b4ae016ed81549fe5349bd476d0f1df18599b6f135d6060310e3e840abdf0eec3ed5e32b00e9b9564cb2919e00cd6b78d2c8dd788acd235cbc96e73f831fe99aeabe18787fc9f12b5c2aa3470a7cd9ea0e3e523f515d119ec8e69526d39f63da1400303a0e29681456a73851451400514514001af36f15db47737da942ea312e13ff1d15e926b84f14e9b225fb4a726399b706071835956f84df0f6e7d4e5bc311b5b68d1db3e43c2c5581ec735d0c04641acc82030cf336fde24c1ce31c818abb13918ae66fa9d76350118cd36770b0b9cf41512b1c5457a4983682013c926aae425a956de2663b9bef1e6a4bc8c85191d2b2c5cde0bcdc258c4638111421beb9a5d42fafda228b16c6238794fcbfa7350ad635e5771903341a9273fbb938fa1ae84329515cadbcb35c089582995482cd183b7f5ae8f762256cfd688bb0545b0db823159b2b0ce335666978aa0e72f4af762d918777186f13a5db8052284463ea7afe95dff00c38b70916a93e305a7083e8067fad711716fe6cacfb999b7e767415ea1e10d2e5d3747fdff00fac99bcc2be831c56b4aee7722bb51a56ee74345145759e78514514005145140054177690dec0619d7729fcc1f5153d140276385d67476d2da2292f990c9b8720020f5fc6b3d0715daf882d45c69529c7cf17cebf875fd2b8953c572d58a4f43b294dc96a4e24c7d0542f2b3648e4d2b720d50bbd412c8aab23966385dab9ac91b24dec59588b3ee3d696502585803923d6b0a5d56eddf3e5b81d80e2a1fed3bf9588d92e31df02ab53758793d59ae998d46001daad24d95c67a8ae7bfb6e583e59adddb3d0ae39ad5b7779605731b2772add4543d0894251dc9d9b39aaee70723f4a52d8e2afe856c2f75bb68ca8640db981e981cd1057667376573a2d03c2b6d1c10ddde6e9a7233b186141fa77fc6bab031480606296bba3151d8f3e537277614514551214514500145145001451450036441223230cab0c115e737d6ef617b2db499ca9f94fa8ec6bd22b8df18e0de5be3ef08cff3acab2f76e6d41da563112518a65c4692210ca194f5150061d075ab312e475ae3b9dab42998628930133c74a84b4658e20656ada58032f245466dd455a6ec57b56611b5479376dc915a26511c2173cd3e4400f18aa57242e01acddc1bb91bcb96e2bb6f04e9cd1c326a122e3cd1b23cff0077b9fcff0095700183c9b73907ad7b3daaaa5ac4aa005080003e95bd08dddce7c4cacaddc9a8a28aeb38828a28a0028a28a0028a28a0028a28a002b8cf16b2b6a3128604ac5c807a726b4bc5de268bc35a519b87ba972b0467b9f53ec2bcef40bb9f50b06bbb990c934d348cccdd49ce3fa573d69af84eea1869fb3f6ef6dbd4b53c6d8de9f7bf9d2dbdf0242b7cafdc1ab4578aa3716693751c83d4704572bba36567b9a1f6c4e99c535ae94f42b590fa65e758ae4e0740cb9aabfd9da892019c0fc2ab998722ee6a4d7aa872587ad644d76f752109f77fbd51be9b229fdfc8d27d7a54f0418ed50d96a290b0aedc57ad683add86b3641acae16468b092a746461c723f0af2c64dabc571d65ae5ef87bc737735ab9578e4f336e78911b0769f6ad694f901619625f22767d0fa6a8aa7a5ea10eaba65b5f5b9cc53a075f6cf6fc3a55caee5a9e4b4e2ecc28a28a041451450014514500155af6fadb4fb57b9ba996285064b35636b9e32d2f45575327da2751feaa239c1f73d0578eebfe26bed7af8cf73211183f244a7e541edfe358d4aca1ea7a981caeae25dde91effe449e32d7cf8835c96e1370b741e5c2a7b28ff13cd6a78486dd02dc1eb9627f1626b8a2db989aec7c27286d2820ff00966eca7f3cff005ae1e67295d9efe654152c2c210d91d2e322aab928f8ab71d45711e467bfb56ad687cf27a925b48ad853d7dea79234da49c60566a86c654f2299777b2b42625460c78cd1cd65a8f96ef4295fcead2954a75ac24264f7a8d6dfe603bf726b4301000064e2a16f72e5b5915665e08ae0f5d841f112cc072602adf8118aefa5e73fcab85d6083a9ccdd76809fd4d4b763bb2da7cf888f96a755e0af1dcda02476374be6e9e5ce401f3479ea47afd2bda2cef6dafed92e2d2749a17190e8722be5e47c56ff0086bc4d7fe1ebef3ed5f72371242c4ed71efefef5ad2aee3a4b63af31c9d576ea52d25f99f45515c5e85f11b4bd55552e736731fef1cae7eb5d8c72a4a81e375746e4329c835db19296a8f96ad87ab465cb52361f4514551894f51d4ecf4ab633de4cb1a0e80f563e8077af2ff1178faeafcb43665a0b6e9853f337d4ff004ae7b5ad56eefeea4b8bd99a472c42a93c28cd6286323727815c752b37a23eb70193c29ae7ababfc096f2e1de352e7976e1474159ce78a96ee4dd221ec08c5404e54d72c9dd9f434a168d8457e6b7fc2f7a2defdedd8e126191fef0ffeb57344906a68652922ba9c329c8a94ec678bc3fb6a2e07acc4dd8d4b220753597a45eadfd9248ad96c61b1eb5a8b92b5d2b63e1e7171766578d3048349246a074a9fcb3d7148d167ae4d160b94638b7cd93c28a9261b7a55a58f6a9e39aace0b498a4c7b942e5c436ef2b74519af3dba94cb33bb1e58926bb2f145c0b7b1110382e71fe35c233966ac65b9f499351b41d57d740cd584dc00c5451a127356321473527b56b13231572ca7041e6ba6f0f78b2ff469c793213193f342e728dfe07dc572104b9ba7c720800d5a0483915a464d6a8e4ad878568b84d5cf78d2bc6ba46a51fef2716928196498e07e07a1a2bc51252ca08383de8ae95887d8f9f9e474dbd24d1fffd9';
// Encode the String
$scope.encodedString ="data:image/bmp;base64," + hexToBase64(strpic);
$scope.lock = 'true';
$scope.res = "result";
 $scope.personal12 = "result";
    $scope.$on('$viewContentLoaded', function() {
        Metronic.initAjax(); // initialize core components
        $scope.database = "default"; 
               // fn_LoadAllRequest();          
            
	});

console.log(window.location.href);
var Qstring = window.location.href;
var Qparam = Qstring.replace('=',':').replace('=',':').replace('&',' AND ').split('?')[1];

var inoutTbl = undefined;
function fn_LoadAllRequest(){	  
	 	// Get Basic details of traveler
	 	$rootScope.docno
	 	$rootScope.cntry

		// Get details of visa and in and outs
			//$.get("http://pistachio_server:8983/solr/his/query?rows=2&json={query: 'country:PAKISTAN AND doc_no:AA0929482',limit: 1,sort  : 'xit_date desc',facet: {branch : {type: terms,field: branch},exits: {type: range,field: xit_date,start: '2015-01-01T00:00:00Z',end: '2016-03-23T00:00:00Z',gap: '%2B1DAY'},in_outs: {type: terms,field: dy_action_ind,facet: {branch : {type: terms,field: branch}}},officer :{type: terms,field: dy_create_id}}}}")

	}
	// "+$rootScope.docno+" "+$rootScope.cntry+"
	//http://10.4.104.177:8983/ //immigration2
	console.log(solrHost);
$scope.fn_getBasicInfo = function(){//mad_pas_typ_cd
	$.get("http://"+solrHost+":8983/solr/immigration2/query?sort=created desc&json={query :'"+Qparam+"',limit:20000,facet: {visa : {type: terms,field: pass_typ},employers : {type: terms,field: employer}}}") //mad_pas_typ_cd - pass_typ
	.then(function(data) {
		// debugger;

	 	console.log(data.response.docs);
		$scope.passdetails = data.response.docs[0]; 	
		$scope.totalvisa = data.response.docs.length;
		// $scope.vstartdt = $scope.basicdetails.created.toString().substr(0,10);
		// $scope.vstartdt = $scope.basicdetails.mad_crt_dt.toString().substr(0,10);
		// $scope.venddt = $scope.basicdetails.vend.toString().substr(0,10);
		// $scope.venddt = $scope.basicdetails.vend.toString().substr(0,10); //end date is not avail in immi..
		$scope.titleDetails = "Visa details"

		var strdob = result.response.docs[0].birth_date.toString();
		$scope.dob = strdob.substr(0,4) +"-"+strdob.substr(4,2) +"-"+ strdob.substr(6,2);

		var year=Number(strdob.substr(0,4));
		var month=Number(strdob.substr(4,2))-1;
		var day=Number(strdob.substr(6,2));
		
		$scope.age=today.getFullYear()-year;

		$scope.basicdetailsTbl = data.response.docs;

		$('#tblvisa').DataTable( {
		    data: data.response.docs,
		    columns: [
		    	{ "data": "doc_no" },
		        { "data": "name" },
		        { "data": "pass_typ" },
		        { "data": "visitor_typ" },
		        { "data": "job_en" },
		        { "data": "employer" },
		        { "data": "vstart"},
		        { "data": "vend" }
		        // { "data": "mad_doc_no" },
		        // { "data": "mad_applcnt_nm" },
		        // { "data": "mad_pas_typ_cd" },
		        // // { "data": "visitor_typ" },
		        // { "data": "job_en" },
		        // { "data": "employer" },
		        // { "data": "mad_crt_dt"},
		        // { "data": "mad_crt_dt" }
		    ]
		} );
		$scope.$apply();			
   });
}
	var today = new Date();
	//http://10.4.104.176:8983/
$scope.fn_getPersonalInfo = function(){
	// $("#loader").css('height', $(".page-content").height() + 140 + 'px');
	// $("#loader .page-spinner-bar").removeClass('hide');
	// $("#loader").show();

//http://"+solrHost+":8983/solr/hismove/query?sort=xit_date desc&json={query:'"+Qparam.replace('mad_','')+"',limit:1,facet:%20{exits:%20{type:%20range,field:%20xit_date,mincount:1,sort:'xit_date desc',start:%20%221900-01-01T00:00:00Z%22,end:'"+today.toISOString()+"',gap:%20%22%2B1DAY%22,facet:{in_outs:%20{type:%20terms,field:%20dy_action_ind,facet:%20{branch%20:%20{type:%20terms,field:%20branch,facet%20:{officer%20:{type:%20terms,field:%20dy_create_id}}}}}}}}}}
	$.get("http://"+solrHost+":8983/solr/hismove/query?sort=xit_date desc&json={query:'"+Qparam+"',limit:100000}")
	.then(function(result) {
		console.log(result);
		if(result.response.docs.length !== 0){
			$scope.res = result.response.docs[0];		
			// $scope.inoutTbl = result.facets.exits.buckets;
			$scope.CreateInoutChart(result.response.docs);

			

			
			$('#tblinout').DataTable( {
		    data: result.response.docs,
		    columns: [		    	
		        { "data": "xit_date",
		          "render": function (data, type, full, meta){                      
                            return data.toString().substr(0,10);                       
                    }	
		         },
		        { "data": "dy_action_ind",
		          "render": function (data, type, full, meta){                      
                            // return (data=='in'?'Entry':'Exit');  
                            if(data=='in'){
                            	return 'Entry';
                            }else if(data=='out'){
                            	return 'Exit';	
                            }else if(data=='in0out'){
                            	return 'Entry and Exit';
                            }                     
                    }	 
		         },
		        { "data": "branch" },
		        { "data": "dy_create_id" }		        
		    ]
		} );


			$scope.$apply();

		}else{
			alert('No date found in himove table');
		}
		$("#loader .page-spinner-bar").addClass('hide');
		$("#loader").hide();

   });
}
 
$scope.CreateInoutChart = function(_data){
	var newary = _data;
	newary.forEach(function(e) {
	   e.start = e.xit_date;	   
	   // e.content =(e.in_outs.buckets[0].val == 'in' ? 'IN' : 'OUT');
	   // className 
	   if(e.dy_action_ind == 'in'){
	   	// e.content = "IN";
	   	e.className = 'green';
	   }else if(e.dy_action_ind == 'out'){
	   	// e.content = "OUT";
	   	e.className = 'red';
	   }else if(e.dy_action_ind == 'in0out'){
	   	e.className = 'orange';
	   }	   
	   e.content = e.xit_date.toString().substr(0,10)+ ' , ' +e.branch + ' , ' + e.dy_create_id;
	});

     var container = document.getElementById('visualization');
     var newitems = newary;
     var chart_height = (_data.length < 100 ? "400px" : "800px");
     console.log("chart_height=" + chart_height);

      var options = {
 	    height: chart_height,
 	    min: new Date(2012, 0, 1),                // lower limit of visible range
 	    max: new Date(2017, 0, 1),                // upper limit of visible range
 	    zoomMin: 1000 * 60 * 60 * 24,             // one day in milliseconds
 	    zoomMax: 1000 * 60 * 60 * 24 * 31 * 12     // about three months in milliseconds
 	  };
     var timeline = new vis.Timeline(container, newitems, options);

      function move (percentage) {
         var range = timeline.getWindow();
         var interval = range.end - range.start;

         timeline.setWindow({
             start: range.start.valueOf() - interval * percentage,
             end:   range.end.valueOf()   - interval * percentage
         });
     }

     function zoom (percentage) {
         var range = timeline.getWindow();
         var interval = range.end - range.start;

         timeline.setWindow({
             start: range.start.valueOf() - interval * percentage,
             end:   range.end.valueOf()   + interval * percentage
         });
     }

     document.getElementById('zoomIn').onclick    = function () { zoom(-0.2); };
     document.getElementById('zoomOut').onclick   = function () { zoom( 0.2); };
     document.getElementById('moveLeft').onclick  = function () { move( 0.2); };
     document.getElementById('moveRight').onclick = function () { move(-0.2); };

     // var tblvisabind;
     //     function fn_tblvisabind() {
     //         // alert('add '+ data); 
     //        tblvisabind = $('#tblvisa').DataTable( { 
     //         searching: false, 
     //         // paging: false,
     //         "pageLength":5,
     //            "columns": [
     //            {
     //                "data": "id",
     //                "searchable": false,
     //                className: "hide "
     //            },
     //            {
     //                "data": "parentname",
     //                "searchable": false,
     //                className: "hide "
     //            },


}


      
$scope.fn_getPersonalInfo();
$scope.fn_getBasicInfo();

$('.tool').tooltip();
$scope.availHeight = window.screen.availHeight;

$('.lk').click(function(){
	alert('clicked');
	$scope.lock == 'true'?'false':'true';
});

// Starts --Convert Hex string to Base64----- 
if (!window.atob) {
  var tableStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var table = tableStr.split("");

  window.atob = function (base64) {
    if (/(=[^=]+|={3,})$/.test(base64)) throw new Error("String contains an invalid character");
    base64 = base64.replace(/=/g, "");
    var n = base64.length & 3;
    if (n === 1) throw new Error("String contains an invalid character");
    for (var i = 0, j = 0, len = base64.length / 4, bin = []; i < len; ++i) {
      var a = tableStr.indexOf(base64[j++] || "A"), b = tableStr.indexOf(base64[j++] || "A");
      var c = tableStr.indexOf(base64[j++] || "A"), d = tableStr.indexOf(base64[j++] || "A");
      if ((a | b | c | d) < 0) throw new Error("String contains an invalid character");
      bin[bin.length] = ((a << 2) | (b >> 4)) & 255;
      bin[bin.length] = ((b << 4) | (c >> 2)) & 255;
      bin[bin.length] = ((c << 6) | d) & 255;
    };
    return String.fromCharCode.apply(null, bin).substr(0, bin.length + n - 4);
  };

  window.btoa = function (bin) {
    for (var i = 0, j = 0, len = bin.length / 3, base64 = []; i < len; ++i) {
      var a = bin.charCodeAt(j++), b = bin.charCodeAt(j++), c = bin.charCodeAt(j++);
      if ((a | b | c) > 255) throw new Error("String contains an invalid character");
      base64[base64.length] = table[a >> 2] + table[((a << 4) & 63) | (b >> 4)] +
                              (isNaN(b) ? "=" : table[((b << 2) & 63) | (c >> 6)]) +
                              (isNaN(b + c) ? "=" : table[c & 63]);
    }
    return base64.join("");
  };

}

function hexToBase64(str) {
  return btoa(String.fromCharCode.apply(null,
    str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
  );
}

function base64ToHex(str) {
  for (var i = 0, bin = atob(str.replace(/[ \r\n]+$/, "")), hex = []; i < bin.length; ++i) {
    var tmp = bin.charCodeAt(i).toString(16);
    if (tmp.length === 1) tmp = "0" + tmp;
    hex[hex.length] = tmp;
  }
  return hex.join(" ");
}

// Ends --Convert Hex string to Base64----- 

// $('#topfield').fitText();
// $('#tblvisa').dataTable({
// 	// "paging": true
// });

// //All the function of d3 chart

// var j = [{"id":"FIS","order":"1.1","score":"59","weight":"0.5","color":"#90041","label":"KL INTERNATIONAL AIRPORT"},
// 			{"id":"MAR","order":"1.3","score":"24","weight":"0.5","color":"#C32F4B","label":"LTA BAYAN LEPAS"},
// 			{"id":"AO","order":"2","score":"98","weight":"1","color":"#E1514B","label":"GELANG PATAH LALUAN KEDUA 1"},
// 			{"id":"NP","order":"3","score":"60","weight":"1","color":"#F47245","label":"KL INTERNATIONAL AIRPORT - SERVER 2"}];
// 	var width = 300,
// 	    height = 300,
// 	    radius = Math.min(width, height) / 2,
// 	    innerRadius = 0.3 * radius;

// 	var pie = d3.layout.pie()
// 	    .sort(null)
// 	    .value(function(d) { return d.width; });

// 	var tip = d3.tip()
// 	  .attr('class', 'd3-tip')
// 	  .offset([0, 0])
// 	  .html(function(d) {
// 	    return d.data.label + ": <span style='color:orangered'>" + d.data.score + "</span>";
// 	  });

// 	var arc = d3.svg.arc()
// 	  .innerRadius(innerRadius)
// 	  .outerRadius(function (d) { 
// 	    return (radius - innerRadius) * (d.data.score / 100.0) + innerRadius; 
// 	  });

// 	var outlineArc = d3.svg.arc()
// 	        .innerRadius(innerRadius)
// 	        .outerRadius(radius);

// 	var svg = d3.select("#BranchChart").append("svg")
// 	    .attr("width", width)
// 	    .attr("height", height)
// 	    .append("g")
// 	    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// 	svg.call(tip);
// 	a();

// 	// d3.csv('aster_data.csv', function(error, data) {
// function a(){
// 	var data = j;
// 	  data.forEach(function(d) {
// 	    d.id     =  d.id;
// 	    d.order  = +d.order;
// 	    d.color  =  d.color;
// 	    d.weight = +d.weight;
// 	    d.score  = +d.score;
// 	    d.width  = +d.weight;
// 	    d.label  =  d.label;
// 	  });
// 	  // for (var i = 0; i < data.score; i++) { console.log(data[i].id) }
	  
// 	  var path = svg.selectAll(".solidArc")
// 	      .data(pie(data))
// 	    .enter().append("path")
// 	      .attr("fill", function(d) { return d.data.color; })
// 	      .attr("class", "solidArc")
// 	      .attr("stroke", "gray")
// 	      .attr("d", arc)
// 	      .on('mouseover', tip.show)
// 	      .on('mouseout', tip.hide);

// 	  var outerPath = svg.selectAll(".outlineArc")
// 	      .data(pie(data))
// 	    .enter().append("path")
// 	      .attr("fill", "none")
// 	      .attr("stroke", "gray")
// 	      .attr("class", "outlineArc")
// 	      .attr("d", outlineArc);  


	  // calculate the weighted mean score
	  // var score = 
	  //   data.reduce(function(a, b) {
	  //     //console.log('a:' + a + ', b.score: ' + b.score + ', b.weight: ' + b.weight);
	  //     return a + (b.score * b.weight); 
	  //   }, 0) / 
	  //   data.reduce(function(a, b) { 
	  //     return a + b.weight; 
	  //   }, 0);

	  // svg.append("svg:text")
	  //   .attr("class", "aster-score")
	  //   .attr("dy", ".35em")
	  //   .attr("text-anchor", "middle") // text-align: right
	  //   .text();
		
	// };

	// console.log('hello'+$scope.InOutdetails.count.toString());


});



