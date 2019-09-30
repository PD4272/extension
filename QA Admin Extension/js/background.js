/* $Id$ */

var Branch_info = {};
var reviewCompleted_BranchInfo = {};
var userdetails = {};
var branchLog = {};
var connection = new WebSocket('ws://127.0.0.1:8080');
var localzohoMap = { "87":"WRITER_ZOHOCORP","142":"WRITERZ","218":"ZOHOWRITER_4_0","239":"ZOHOWRITER_2_0","240":"WRITER_3_REDIS","242":"WRITERDEMO","333":"ZOHOWRITER_WEB","359":"ZOHOPAD", "600":"WRITER_MOBILE","660":"WRITER_PROOFING","854":"WRITER_GRAMMA"}
chrome.browserAction.onClicked.addListener( function (tab) {
	chrome.tabs.create({'url': chrome.extension.getURL("html/zwplugin.html")}, function(tab) {
    // Tab opened.
  })
});
	function startLocalzoho(build_Name , localzohoId , isStatic){

		if(localzohoId == "0" ){

			alert("select localzoho");

		}else if(build_Name == ""){

			alert("Enter Branch Name");

		}else if(build_Name.lastIndexOf(".zip") != -1){

			var buildUrl = build_Name.substring(0 , build_Name.lastIndexOf("/"));
			startSD(buildUrl , localzohoId ,isStatic);

		}else if(build_Name.indexOf('.zip') != -1 ){

			startSD( build_Name , localzohoId ,isStatic);

		}else{
				var branchUrl = getBranchUrl(build_Name , function(){});

				if (branchUrl != null) {
					startSD( branchUrl , localzohoId , isStatic);	
				}
		}

	};
	var getBranchUrl = function( branchName , callback){

		chrome.cookies.get({"url": "https://cmtools.csez.zohocorpin.com","name":"csrf_token"}, function(cookie) {
			
					if( cookie == null ){
						alert("Please login the cmtools")
						window.open("https://cmtools.csez.zohocorpin.com/users/sign_in");
						return;
					}
					var csrf = cookie.value;
					
					
					$.ajax({

						type: "GET", //No I18N
						dataType: 'json', //No I18N

						beforeSend: function(request) {

							request.setRequestHeader("X-CSRF-TOKEN",decodeURIComponent(csrf));//"OfO1Yau5n+3JyCDSFdMZeiUh3h3ilcJexC7Qmz7BQ3Y=");
						},
						
						url: "https://cmtools.csez.zohocorpin.com/api/v1/buildlogs?product_id=315&availability=A&status=Success&per_page=300&started_from=Webhost&checkout_label="+branchName ,

						error : function( res ){

							console.log(res)
						},

						success: function ( res ) {
					
							// console.log(res);
							if(res && res.buildlogs.length != 0){
								var url =res.buildlogs[0].url+"/ZohoWriter.zip" 
								callback( url);
								return url;
								
							}else{
								showNotification("Please check branch name");
								return null;
							}
							
						}
					});

			});
	}
	var startSD = function( url ,localzohoId, isStatic){

		showNotification("Build Started")
		var data = {"buildLog":[{"prod_name":localzohoId,"parallel_products":"[]","build_type":"3","grid_types":"","changeset_value":"","ischangeset_value_avail":0,"build_url":url+"/ZohoWriter.zip","comment":"test","static_needed":false,"checkbox_parallel_prod":false,"parallel_products":null,"success_mail":userdetails.first_name+",","error_mail":userdetails.first_name+",","skip_continue":true,"run_server_needed":true,"alert_enabled":false,"enable_automation":false,"updatescheduleserver":0,"selected_report_type":"pre_main","report_alert_mailid":userdetails.first_name+",","master_server_ip":"","slave_server_ip":"","grid_name":"","checkin_mailId":"","collectivebuildmigration":"","sqaparallel":0,"sync_builds":"","upgrade_type":"select","mig_needed":0,"hotfix":0,"tagName":null,"isHotfix":1,"category_description":"test","build_version":null}]}
		$.ajax({
		    url: "https://sd.csez.zohocorpin.com/api/startBuild",
		    type: "POST",
		    dataType: "json",
		    data: JSON.stringify(data),
			contentType: "application/json",
			success: function ( res ) {
				// if (rep.info && rep.info.status) {
				// 	showNotification(rep.info.status)
				// }else if(rep.meta && rep.meta.response == "failure"){
				// 	showNotification(rep.meta.message )
				// }
			},error: function (res) {
				// $.get("https://accounts.zoho.com/oauth/v2/auth?scope=email,aaaserver.profile.READ&client_id=N1THTWX0J0VW26063W0Y04J2IHTGJU&response_type=code&redirect_uri=https://sd.csez.zohocorpin.com/validateaccess&access_type=online");
				// startSD(url ,localzohoId)
            }
		});
		if (isStatic) {
			startStaticBuild(url , 218)
		}
		// $.get("http://sd/api/startupgrade?authtoken=0d3fe8f126b0fb4ffc4a4ea5ce31752610683f38e17b39aefcef0600ee687c4d&product="+localzohoName+"&bType=local&buildUrl="+res.buildlogs[0].url+"/ZohoWriter.zip").success(function(rep){

		// 	if (rep.info && rep.info.status) {
		// 		showNotification(rep.info.status)
		// 	}else if(rep.meta && rep.meta.response == "failure"){
		// 		showNotification(rep.meta.message )
		// 	}

		// });	
		setTimeout(function( localzohoId){ 
			$.get("https://sd.csez.zohocorpin.com/api/getrunningbuildstatus?prod_id="+localzohoId+"&bType_id=3").success(function(rep){

				currentBuildStatus(rep.info.build_id , localzohoId);

			});	
		}, 2000 , localzohoId );
	}
	var startStaticBuild = function( url ,localzohoId){

		showNotification("Started static build")
		//dev_local_sub_grid  parallel_products parallel_deployment_products
		var data = {"buildLog":[{"prod_name":localzohoId,"parallel_products":"[]","build_type":"8","grid_types":"","changeset_value":"","ischangeset_value_avail":0,"build_url":url+"/writerstatic.zip","comment":"test","static_needed":false,"checkbox_parallel_prod":false,"parallel_products":null,"success_mail":userdetails.first_name+",","error_mail":userdetails.first_name+",","skip_continue":true,"run_server_needed":true,"alert_enabled":false,"enable_automation":false,"updatescheduleserver":0,"selected_report_type":"pre_main","report_alert_mailid":userdetails.first_name+",","master_server_ip":"","slave_server_ip":"","grid_name":"","checkin_mailId":"","collectivebuildmigration":"","sqaparallel":0,"sync_builds":"","upgrade_type":"select","mig_needed":0,"hotfix":0,"tagName":null,"isHotfix":null,"category_description":"test","build_version":null}]}
		$.ajax({
		    url: "https://sd.csez.zohocorpin.com/api/startBuild",
		    type: "POST",
		    dataType: "json",
		    data: JSON.stringify(data),
			contentType: "application/json",
			success: function ( res ) {
				// if (rep.info && rep.info.status) {
				// 	showNotification(rep.info.status)
				// }else if(rep.meta && rep.meta.response == "failure"){
				// 	showNotification(rep.meta.message )
				// }
			},error: function (res) {
				
				startSD(url ,localzohoId)
            }
		}); 

		setTimeout(function( localzohoId){ 
			$.get("https://sd.csez.zohocorpin.com/api/getrunningbuildstatus?prod_id="+localzohoId+"&bType_id=3").success(function(rep){

				currentBuildStatus(rep.info.build_id , localzohoId);

			});	
		}, 2000 , localzohoId );
	}
	var showNotification = function( msg ){

		var notifyObj = {
			type:    "basic",//No I18n
			iconUrl: "/images/writer-logo.png",//No I18n
			title:   "WRITER QA",//No I18n
			message: msg
		};

		chrome.notifications.create("", notifyObj);
	}
	var showProgressNotification = function( msg , progress ){

		var notifyObj = {
			type:    "progress",//No I18n
			iconUrl: "/images/writer-logo.png",//No I18n
			title:   "WRITER QA",//No I18n
			message: msg,
			progress: progress
		};
		var id = Math.floor((Math.random() * 100) + 1)+"";
		chrome.notifications.create(id, notifyObj);
		return id;
	}
	function currentBuildStatus(id , localzohoId) {
		var interval = null;
		var localzohoName = localzohoMap[localzohoId] +" Status";
		var notificationId = showProgressNotification(localzohoName , 0)
	   	interval =  setInterval(function(id ){ 
	    
	    	
	    	// $.get("https://sd.csez.zohocorpin.com/api/currentBuildStatusbyBuildLog?build_id="+id);
	    	
	    	$.get("https://sd.csez.zohocorpin.com/api/getProgressBarDetails?build_id="+id).success(function(rep){
	    		var notifyObj ={}
	    		if(rep.count == 0 ){
	    			notifyObj.progress = 10;
					chrome.notifications.update(notificationId,notifyObj);
	    		}else if(rep.count == 1 ){
					notifyObj.progress = 25;
					chrome.notifications.update(notificationId,notifyObj);
	    		}
	    		else if(rep.count == 2 ){
					notifyObj.progress = 50;
					chrome.notifications.update(notificationId,notifyObj);
	    		}
	    		else if(rep.count == 3 ){
					notifyObj.progress = 75;
					chrome.notifications.update(notificationId,notifyObj);
	    		}
	    		else if(rep.count == 4 ){
	    			
					notifyObj.progress = 100;
					notifyObj.message = "Updated successfully. Machine restarting"
					chrome.notifications.update(notificationId,notifyObj);
					clearInterval(interval);
	    		}else{
	    			 clearInterval(interval);
	    		}

			});	
	    	
	    }, 3000 , id);
	}
	var Commandexecutive = function (executiveCommand ,callback ) {

		


		connection.onmessage = callback,e => {

		  callback(e)
		  
		}

		connection.onopen = e => {
			try{
				connection.send(e)
			}catch(e){
				console.log(e)
				connection = new WebSocket('ws://127.0.0.1:8080');
				Commandexecutive(executiveCommand ,callback);
			}

		}
		connection.onopen(executiveCommand);
	}