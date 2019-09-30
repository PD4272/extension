/* $Id$ */
var J=$

var branchInfo = {};
var reviewCompleted_BranchInfo={}
var allBranch = [];
var tft = "https://app.zohocreator.com/shunmugaraja/update-request-form/report/Taken_For_Testing?urlParams=%7B%7D";
var wfr = "https://app.zohocreator.com/shunmugaraja/update-request-form/report/Waiting_For_Review?urlParams=%7B%7D";
var rc = "https://app.zohocreator.com/shunmugaraja/update-request-form/report/Review_Completed1?urlParams=%7B%7D";
var eu = "https://app.zohocreator.com/shunmugaraja/update-request-form/report/Build_for_Emergency_Update?urlParams=%7B%7D";
var rtp = "https://app.zohocreator.com/shunmugaraja/update-request-form/report/Ready_To_Push?urlParams=%7B%7D";
var branchNames = {
	"qa":"WRITER_4_QA_BRANCH",
	"default":"WRITER_4_DEFAULT_BRANCH",
	"conversion":"WRITER_CONVERSION_QA_BRANCH"
}



// https://cmsuite.csez.zohocorpin.com/writer/show_merge_files/?source=WRITER_CONVERSION_QA_BRANCH&dest=WRITER_SK_FIXES_BRANCH&email_notify=false&sid=0.9781951842228271
// https://cmsuite.csez.zohocorpin.com/writer/processmerge/?source_rev=WRITER_CONVERSION_QA_BRANCH&dest_branch=WRITER_SK_FIXES_BRANCH&merge_msg=Merge%20with%20WRITER_SK_FIXES_BRANCH&sid=0.11912158145069784

J("document").ready(function(){	
		// J(".ui-title").text(J(this).text());
		
	J(".urf").mouseover(function() {
		J(".ui-urf").css("display","block");
	}).mouseout(function() {
    	J(".ui-urf").css("display","none");
  	});

	J(".ui-urf-tft").on('click', function(){
		J(".ui-title").text(J(this).text());
		hideMenu();
		J(".ui-branch-listing").css("display","block");
		J(".ui-mab").css("display","block");
		showUpdateRequestFormData(tft);
		J(".ui-lab").css("display","block");
	});
	J(".ui-urf-wfr").on('click', function(){
		J(".ui-title").text(J(this).text());

		hideMenu();
		J(".ui-branch-listing").css("display","block");
		showUpdateRequestFormData(wfr);
	});
	J(".ui-urf-rc").on('click', function(){
		J(".ui-title").text(J(this).text());
		hideMenu();
		J(".ui-branch-listing").css("display","block");
		showUpdateRequestFormData(rc);
		J(".ui-lab").css("display","block");
	});
	J(".ui-urf-eu").on('click', function(){
		J(".ui-title").text(J(this).text());
		hideMenu();
		J(".ui-branch-listing").css("display","block");
		showUpdateRequestFormData(eu);
		J(".ui-lab").css("display","block");
		
	});
	J(".ui-urf-rtp").on('click', function(){
		J(".ui-title").text(J(this).text());
		hideMenu();
		J(".ui-branch-listing").css("display","block");
		J(".ui-ulab").css("display","block");
		J(".ui-mab").css("display","block");
		showUpdateRequestFormData(rtp);
	});

	J(".cus").on('click', function(){
		J(".ui-title").text(J(this).text());
		hideMenu();
		J(".ui-custome").css("display","block");
		
	});
	J(".changeFile").on('click', function(){
		J(".ui-title").text(J(this).text());
		hideMenu();
		J(".ui-changeFile_MainDiv").css("display","block");
		
	});
	J(".permission").on('click', function(){
		J(".ui-title").text(J(this).text());
		hideMenu();
		J(".ui-permission_MainDiv").css("display","block");
		

	});
	J(".BranchMerge").on('click', function(){
		J(".ui-title").text(J(this).text());
		hideMenu();
		J(".ui-merge_MainDiv").css("display","block");
	});
	J(".ui-console").on('click', function(){
		
		J(".ui-title").text(J(this).text());
		hideMenu();
		J(".ui-console_MainDiv").css("display","block");
		J(".ui-console_msg").focus()

	});
	var hideMenu = function () {
		J(".ui-custome").css("display","none");
		J(".ui-branch-listing").css("display","none");
		J(".ui-changeFile_MainDiv").css("display","none");
		J(".ui-permission_MainDiv").css("display","none");
		J(".ui-lab").css("display","none");
		// J(".ui-mab").css("display","none");
		J(".ui-ulab").css("display","none");
		J(".ui-merge_MainDiv").css("display","none");
		J(".ui-console_MainDiv").css("display","none");
	}
	J(".ui-start-build").on('click', function(){
		var branch_Name = J(".ui-cur-branch-name").val();
		var localzoho = J(this).parent().find(".ui-localzoho-machine").val();
		chrome.extension.getBackgroundPage().startLocalzoho(branch_Name , localzoho);
		
	 });
	J(".ui-ulab").on('click', function(){
		unLockAllBranch();

	});
	J(".ui-mab").on('click', function(){
		mergeAllBranch();

	});
	
	J(".ui-branchMerge").on('click', function(){

		var source_branch = J(".ui-MergeBranch_name").val();
		var dest_branch = "WRITER_CONVERSION_QA_BRANCH";//J(".ui-branchMerge_selectOption").val();
		var url="https://cmsuite.csez.zohocorpin.com/writer/processmerge/?source_rev="+source_branch+"&dest_branch="+branchNames[dest_branch]+"&merge_msg=Merge with "+source_branch+"&sid=0.11912158145069784";
		J.ajax({

				type: "GET", //No I18N
				
				url: url,

				error : function ( response ){
					
				},

				success: function ( response ) {
					
					alert(response);
				}
			});
		

	})
	J(".ui-permissionChanges").on('click', function(){

		var branch_Name = J(".ui-branch_name").val();
		var Branch_Owner = J(".ui-branch_Owner").val();
		if(Branch_Owner.indexOf("@") != -1){
			Branch_Owner=Branch_Owner.split("@")[0];
		}
		var Status = permissionChanges(branch_Name,Branch_Owner);
		if(Status){
			
		}
	 });
	var permissionChanges = function (branch_Name , Branch_Owner) {
			var url = "https://cmsuite.csez.zohocorpin.com/writer/branch/edit/"+branch_Name+"/editbranch/?branchName="+branch_Name+"&branchOwner="+Branch_Owner+"&status=2&reviewOwners=&ciUsers="+Branch_Owner+"&revflg=false&whflg=true&ciflg=true&tpbrStatus=false&tpbasechgset=&sid=0.42548445697989723"
			J.ajax({

				type: "GET", //No I18N
				
				url: url,

				error : function ( response ){
					
				},

				success: function ( response ) {
					
					return JSON.parse(response).Status;
				}
			});
	}
	J(".ui-lab").on('click', function(){

		var len = Object.keys(reviewCompleted_BranchInfo).length
		for(i = 0; i<len; i++){
			var branch_Info = reviewCompleted_BranchInfo[i];
			var branch_Name = branch_Info.branch_Name;
			var Branch_Owner = branch_Info.module_Owner;
		
			permissionChanges(branch_Name,Branch_Owner);
		}
		var len = Object.keys(branchInfo).length
		for(i = 0; i<len; i++){
			var branch_Info = branchInfo[i];
			var branch_Name = branch_Info.branchName;
			var Branch_Owner = branch_Info.module_Owner;
		
			permissionChanges(branch_Name,Branch_Owner);
		}
		J(".ui-lab").css({"pointer-events":"none","background":"#38b95d"});
		J(".ui-lab").text("Branch Locked")
		chrome.extension.getBackgroundPage().reviewCompleted_BranchInfo = reviewCompleted_BranchInfo
		 
	 });
	
	function showUpdateRequestFormData(url) {



		try {
			
			J.ajax({

				type: "GET", //No I18N
				dataType: 'json', //No I18N
				
				url: url ,

				error : function( res ){

					showUpdateRequestFormData(url);
				},

				success: function ( res ) {
					branchInfo = {};
					J(".ui-loading").css("display","none");
					var dataJson = res.MODEL.DATAJSONARRAY
					J(".ui-branc-details").remove();
					for(i = 0; i<dataJson.length; i++){

						var branch_Info = dataJson[i];
						var branchDetails = {};
						var branch_Owner = J(branch_Info.Branch_Owner).text().split("@")[0];	

						branchDetails.module_Owner = branch_Info.Module_Owner;

						branchDetails.branch_Owner = branch_Owner;
						branchDetails.branchName = branch_Info.Branch_Name;
						branchDetails.id = branch_Info.ID;
						branchDetails.usecases = branch_Info.Usecases_to_test;
						branchDetails.tagDiff = J(branch_Info.Code_Diff_File).attr("href");
						branchDetails.Priority = branch_Info.Emergency_Update
						branchDetails.Fixes_Details = branch_Info.Features_Fixes_Details;

						branchInfo[i] = branchDetails;
						
						allBranch[branch_Info.Branch_Name] = branchDetails;
						getProfilePic(branchDetails , function( branchDetails ){
							
							J('.ui-branch-listing').append(createBranchTemp(branchDetails));

						});


						console.log(dataJson[i].Branch_Name)
						J('.ui-branch-owner').append();
						var branchListingDom = J( J('#mult-dmn-usr-clone').html() );
						branchListingDom.find('.ui-branch-name').text(dataJson[i].Branch_Name)
						branchListingDom.find('.ui-branch-owner').append(dataJson[i].Branch_Owner)
						
					}
					
				}
			}); 
			
		} catch(error) {

		}
	}
	
	var unLockAllBranch = function () {
		var bramchlength = Object.keys(branchInfo).length;
		for(var i = 0; i<bramchlength; i++ ){
			permissionChanges(branchInfo[i].branchName , branchInfo[i].module_Owner+","+branchInfo[i].branch_Owner)
		}
		J(".ui-ulab").css({"pointer-events":"none","background":"#38b95d"});
	}
	
	
	var getUserProfile = function ( ) {

		

		J.ajax({

			type: "GET", //No I18N
			global: false,
			dataType: 'json', //No I18N
			url: "https://profile.zoho.com/api/v1/user/self/profile?include=photo" , //No I18N

			error : function ( response ){
				
				//TODO: Use account default API to get profile Name and Email ID
			},

			success: function ( response ) {

				var userdetails = response.profile;
				chrome.extension.getBackgroundPage().userdetails = userdetails;
				J(".ui-name").text(userdetails.display_name);//No I18N
				J(".ui-email-id").text(userdetails.primary_email);//No I18N
				J(".ui-userimage").attr("src", userdetails.photo_url+"?photo_size=thumb");//No I18N

			}
		}); 
	}
	// 
	String.prototype.replaceAll = function(search, replacement) {
	    var target = this;
	    return target.replace(new RegExp(search, 'g'), replacement);
	};
	getUserProfile();
	//------
		hideMenu();
		J(".ui-branch-listing").css("display","block");
		showUpdateRequestFormData(wfr);
	//------
	function doc_keyUp(e) {

	    if (e.keyCode == 27) {
	        J(".ui-toverlay").css("display","none");
		        if(J(".ui-sd").css("display") == "block"){
		        	J(".ui-sd").css("background","none")
					J(".ui-sd").css("z-index","9")
					J(".ui-sdMain").css("display","none");
		        }

	    }
	}
	document.addEventListener('keyup', doc_keyUp, false);

	setPeopleCsrf(function() {})
});

