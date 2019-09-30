var peopleCsrf, myPendReviewBranch = [] ,myPendReviewBranchCount = 0 ,moduleBranch = [],
	moduleBranchCount = 0,myBranch=[],myBranchCount = 0,allBranch=[];

function loadDashBoard() {

	try {
		
		$('.ui-MyReviewPend').css("border-bottom","5px solid #2196F3");
		

		$.ajax({

			type: "GET", //No I18N
			dataType: 'json', //No I18N

			url: 'https://app.zohocreator.com/shunmugaraja/update-request-form/report/Waiting_For_Review?urlParams=%7B%7D' ,

			error : function( res ){
				if( ( res.statusText && res.statusText.indexOf("error") != -1 )|| ( res.responseText && res.responseText.indexOf("Sign in to your Zoho account to view this Report.") != -1 ) ){
					
					$.get("https://app.zohocreator.com/oauthorize?state=https%3A%2F%2Fapp.zohocreator.com%2Fshunmugaraja%2Fupdate-request-form%2F%23Report%3AReview_Completed1");
					  setTimeout(function(){ loadDashBoard(); }, 2000);

				}else{	
					$(".ui-errorMsg").css("display","block");
					$(".loader").css("display","none");
				}
				
			},

			success: function ( res ) {
				
				if(res == null || res.length == 0 ){
					$(".ui-errorMsg").css("display","block");
					return;
				}
				var dataJson = res.MODEL.DATAJSONARRAY
				try{
					var userEmailID = userdetails.primary_email.toLowerCase();

					$(".ui-branch-details").empty();
					
					for(i = 0; i<dataJson.length; i++){
						var branch_Info = dataJson[i];
						
						$(".loader").css("display","none");
						
						var module_Owner = branch_Info.Module_Owner.toLowerCase()+"@zohocorp.com";
						var branch_Owner = $(branch_Info.Branch_Owner).text();	


						var branchName = branch_Info.Branch_Name;
						var Fixes_Details = branch_Info.Features_Fixes_Details;
						
						var branchDetails = {};
						branchDetails.branch_Owner = branch_Owner;
						branchDetails.branchName = branchName;
						branchDetails.id = branch_Info.ID;
						branchDetails.Priority = branch_Info.Emergency_Update
						branchDetails.Fixes_Details = branch_Info.Features_Fixes_Details;
						
						
						
						
						var module_OwnerStatus = module_Owner == userEmailID && branch_Info.Module_Owner_Review_Status == "In Progress";
						var userName =userEmailID.split("@")[0];

						var js_Review = branch_Info.JS_Reviewer && ( branch_Info.JS_Reviewer.toLowerCase() == userName && branch_Info.JS_Review_Status == "Pending");
						var js_Review1 = branch_Info.JS_Reviewer1 && ( branch_Info.JS_Reviewer1.toLowerCase() == userName && branch_Info.JS_Reviewer1_Review_Status == "Pending");
						var js_Review2 = branch_Info.JS_Reviewer2 && ( branch_Info.JS_Reviewer2.toLowerCase() == userName && branch_Info.JS_Reviewer2_Review_Status == "Pending");
						var js_Review3 = branch_Info.JS_Reviewer3 && ( branch_Info.JS_Reviewer3.toLowerCase() == userName && branch_Info.JS_Reviewer3_Review_Status == "Pending");

						var java_Review = branch_Info.Java_Reviewer && ( branch_Info.Java_Reviewer.toLowerCase() == userName && branch_Info.Java_Review_Status == "Pending");
						var java_Review1 = branch_Info.Java_Reviewer1 && ( branch_Info.Java_Reviewer1.toLowerCase() == userName && branch_Info.Java_Reviewer1_Review_Status == "Pending");
						var java_Review2 = branch_Info.Java_Reviewer2 && ( branch_Info.Java_Reviewer2.toLowerCase() == userName && branch_Info.Java_Reviewer2_Review_Status == "Pending");

						var css_Review = branch_Info.CSS_Reviewer && ( branch_Info.CSS_Reviewer.toLowerCase() == userName && branch_Info.CSS_Review_Status == "Pending");
						var i18n_Review = branch_Info.I18n_Reviewer && ( branch_Info.I18n_Reviewer.toLowerCase() == userName && branch_Info.I18n_Review_Status == "Pending");
						var security_Reviewer =  branch_Info.Security_Reviewer && ( branch_Info.Security_Reviewer.toLowerCase() == userName && branch_Info.Security_Review_Status == "Pending");
						
						var reviewStatus = {};
						if(!isEmpty( branch_Info.Module_Owner) && branch_Info.Module_Owner_Review_Status.indexOf("Completed") == -1 && branch_Info.Module_Owner_Review_Status.indexOf("Don&#39;t Want to Review") == -1){
							reviewStatus.Module_Owner = branch_Info.Module_Owner;
							reviewStatus.module_OwnerStatus = branch_Info.Module_Owner_Review_Status;
							
						}
						if(!isEmpty( branch_Info.JS_Reviewer) && branch_Info.JS_Review_Status.indexOf("Completed") == -1 && branch_Info.JS_Review_Status.indexOf("Don&#39;t Want to Review") == -1 ){
							
							reviewStatus.js_Review = branch_Info.JS_Reviewer;
							reviewStatus.JS_Review_Status = branch_Info.JS_Review_Status;
							
						}
						if(!isEmpty( branch_Info.JS_Reviewer1) && branch_Info.JS_Reviewer1_Review_Status.indexOf("Completed") == -1 && branch_Info.JS_Reviewer1_Review_Status.indexOf("Don&#39;t Want to Review") == -1 ){
							reviewStatus.js_Review1 = branch_Info.JS_Reviewer1;
							reviewStatus.JS_Review_Status1 = branch_Info.JS_Reviewer1_Review_Status;
							
						}
						if(!isEmpty( branch_Info.JS_Reviewer2) && branch_Info.JS_Reviewer2_Review_Status.indexOf("Completed") == -1 &&  branch_Info.JS_Reviewer2_Review_Status.indexOf("Don&#39;t Want to Review") == -1){
							reviewStatus.js_Review2 = branch_Info.JS_Reviewer2;
							reviewStatus.JS_Review_Status2 = branch_Info.JS_Reviewer2_Review_Status;
							
						}
						if(!isEmpty( branch_Info.JS_Reviewer3) && branch_Info.JS_Reviewer3_Review_Status.indexOf("Completed") == -1 && branch_Info.JS_Reviewer3_Review_Status.indexOf("Don&#39;t Want to Review") == -1){ 
							reviewStatus.js_Review3 = branch_Info.JS_Reviewer3;
							reviewStatus.JS_Review_Status3 = branch_Info.JS_Reviewer3_Review_Status;
							
						}
						if(!isEmpty( branch_Info.Java_Reviewer) && branch_Info.Java_Review_Status.indexOf("Completed") == -1 && branch_Info.Java_Review_Status.indexOf("Don&#39;t Want to Review") == -1){
							reviewStatus.java_Review = branch_Info.Java_Reviewer;
							reviewStatus.Java_Review_Status = branch_Info.Java_Review_Status;
							
						}
						if(!isEmpty( branch_Info.Java_Reviewer1) && branch_Info.Java_Reviewer1_Review_Status.indexOf("Completed") == -1 && branch_Info.Java_Reviewer1_Review_Status.indexOf("Don&#39;t Want to Review") == -1){
							reviewStatus.java_Review1 = branch_Info.java_Reviewr1;
							reviewStatus.Java_Review_Status1 = branch_Info.Java_Reviewer1_Review_Status;
							
						}
						if(!isEmpty( branch_Info.Java_Reviewer2) && branch_Info.Java_Reviewer2_Review_Status.indexOf("Completed") == -1&& branch_Info.Java_Reviewer2_Review_Status.indexOf("Don&#39;t Want to Review") == -1){
							reviewStatus.java_Review2 = branch_Info.java_Reviewr2;
							reviewStatus.Java_Review_Status2 = branch_Info.Java_Reviewer2_Review_Status;
							
						}
						if(!isEmpty( branch_Info.CSS_Reviewer) && branch_Info.CSS_Review_Status.indexOf("Completed") == -1 && branch_Info.CSS_Review_Status.indexOf("Don&#39;t Want to Review") == -1){
							reviewStatus.CSS_Reviewer = branch_Info.CSS_Reviewer;
							reviewStatus.CSS_Review_Status = branch_Info.CSS_Review_Status;
							
						}
						if(!isEmpty( branch_Info.I18n_Reviewer) && branch_Info.I18n_Review_Status.indexOf("Completed") == -1 && branch_Info.I18n_Review_Status.indexOf("Don&#39;t Want to Review") == -1){
							reviewStatus.I18n_Reviewer = branch_Info.I18n_Reviewer;
							reviewStatus.I18n_Review_Status = branch_Info.I18n_Review_Status;
							
						}
						if(!isEmpty( branch_Info.Security_Reviewer) && branch_Info.Security_Review_Status.indexOf("Completed") == -1 && branch_Info.Security_Review_Status.indexOf("Don&#39;t Want to Review") == -1){
							reviewStatus.Security_Reviewer = branch_Info.Security_Reviewer;
							reviewStatus.Security_Review_Status = branch_Info.Security_Review_Status;
							
						}
						branchDetails.reviewStatus = reviewStatus
						if(module_Owner == userEmailID){
							moduleBranch[moduleBranchCount] = branchDetails;
							moduleBranchCount++;
						}
						if(userEmailID == branch_Owner){	
							myBranch[myBranchCount] = branchDetails;
							myBranchCount++;
						}
						allBranch[branchName] = branchDetails;
						if( module_OwnerStatus || js_Review || js_Review1 || js_Review2 || js_Review3 || java_Review || java_Review1 || java_Review2 || css_Review || i18n_Review || security_Reviewer){

							
							myPendReviewBranch[myPendReviewBranchCount] = branchDetails
							myPendReviewBranchCount++;
							
							getProfilePic(branchDetails , function( branchDetails ){
								
								$('.ui-MyPendReviewRcord').append(createBranchTemp(branchDetails));
							});

						}



					}
					if(myPendReviewBranchCount == 0){
						$(".ui-errorMsg").css("display","block");
					}
				}catch(err){
					$(".ui-errorMsg").css("display","block");
				}
				
			}	
		}); 

	} catch(error) {
		$(".ui-no_rev_pen_brn").css("display","block");
	}
}
var getProfilePic = function ( info , callback) {

	return new Promise(function(resolve, reject) {

		var data = {"mode":"USER_SEARCH","searchStr":info.branch_Owner,"isQuickSearch":true,"conreqcsr":peopleCsrf}
		$.ajax({

			type: "POST", //No I18N
			data : data,
			url: "https://people.zoho.com/zpeoplehr/searchActions.zp" , //No I18N

			error : function ( response ){
				
				$.get("https://people.zoho.com/zpeoplehr/viewPhoto");
				setPeopleCsrf(getProfilePic(info , callback));
				
				//TODO: Use account default API to get profile Name and Email ID
			},

			success: function ( response ) {
				info.ProfileID=response.result[0].eno
				callback(info );
			}
		});
	});

}
var getUserProfile = function ( ) {

	$.ajax({

		type: "GET", //No I18N
		global: false,
		dataType: 'json', //No I18N
		url: "https://profile.zoho.com/api/v1/user/self/profile?include=photo" , //No I18N

		error : function ( response ){

			//TODO: Use account default API to get profile Name and Email ID
		},

		success: function ( response ) {

			userdetails = response.profile;
			$(".ui-userImage").css("background-image", "url("+userdetails.photo_url+"?photo_size=thumb"+")");//No I18N
		}
	}); 
} 
function bindBranchListingDom(branchListing_Dom){
	
	$(branchListing_Dom.find(".ui-edit")).on('click', function(){
		
		var branchName = $(this).closest(".ui-branc-details").find(".ui-branchName").text();
		var id = allBranch[branchName].id;
		window.open("https://app.zohocreator.com/shunmugaraja/update-request-form/New_Update_Request_Form/record-edit/Waiting_For_Review/"+id)
	});
	$(branchListing_Dom.find(".ui-view")).on('click', function(){
		
		var branchName = $(this).closest(".ui-branc-details").find(".ui-branchName").text();
		var id = allBranch[branchName].id;
		window.open("https://app.zohocreator.com/shunmugaraja/update-request-form/record-summary/Waiting_For_Review/"+id)
	});	
	$(branchListing_Dom).on('click', function(){
		
		var branchName = $(this).find(".ui-branchName").text()
		$(".ui-branch-panel").css("display","block");
		$( "#ui-branch-panel" ).toggle( "drop", {}, 500 );
		$(".ui-showBranchname").text(branchName);
		var branchInfo = allBranch[branchName].reviewStatus;
		$(".ui-info").empty();
		$.each(branchInfo, function(k, v) {
		    //display the key and value pair
//		    alert(k + ' is ' + v);
		    var keycell  = $("<th></th>").text(k)
		    var valuecell  = $("<th></th>").text(v)
		    $(".ui-info").append( $("<tr></tr>").append(keycell,valuecell));
		});
		event.stopPropagation();
	});
}
var createBranchTemp = function(branchDetails){
	
	var branchListing_Dom = $( $('#branchDetailTemp').html() );
	branchListing_Dom.find('.ui-branchName').text(branchDetails.branchName);
	branchListing_Dom.find('.ui-branchInfo').append($("<div>"+branchDetails.Fixes_Details+"</div>"));
	branchListing_Dom.find('.ui-userPic').css("background-image","url(https://people.zoho.com/zpeoplehr/viewPhoto?erecno="+branchDetails.ProfileID+"&mode=1&avatarid=731)");
	var priority = branchDetails.Priority
	if(priority == "Emergency"){
		branchListing_Dom.find('.ui-Priority').css("background-image","url('../images/Emergency.png')");
	}else if(priority == "Important"){
		branchListing_Dom.find('.ui-Priority').css("background-image","url('../images/Important.png')");
	}
	
	bindBranchListingDom(branchListing_Dom);
	
	return branchListing_Dom;
}
var isEmpty = function (value){

	var isEmptyObject = function(a) {

		if (typeof a.length === 'undefined') { // it's an Object, not an Array
			var hasNonempty = Object.keys(a).some(function nonEmpty(element){
				return !isEmpty(a[element]);
			});
			return hasNonempty ? false : isEmptyObject(Object.keys(a));
		}

		return !a.some(function nonEmpty(element) { // check if array is really not empty as JS thinks
			return !isEmpty(element); // at least one element should be non-empty
		});
	};

	return (value == false|| typeof value === 'undefined' || value == null|| (typeof value === 'object' && isEmptyObject(value)) );
}
var setPeopleCsrf = function( callback){
	
	chrome.cookies.get({"url": "https://people.zoho.com","name":"CSRF_TOKEN"}, function(cookie) {	
		peopleCsrf = cookie.value;
		callback();
	});	
}
$("document").ready(function(){	

	$(".ui-MyReviewPend").on('click', function(){
		
		$(".loader").css("display","block");
		$(".ui-errorMsg").css("display","none");
		
		$('.ui-MyReviewPend').css("border-bottom","5px solid #2196F3");
		$('.ui-MyModuleReviewPend').css("border-bottom","none");
		$('.ui-MyBranchReviewPend').css("border-bottom","none");
		
		$(".ui-MyPendReviewRcord").css("display","block");
		$(".ui-MyBraPendReviewRecord").css("display","none");
		$(".ui-MyModPendReviewRecord").css("display","none");
		
		$('.ui-MyPendReviewRcord').empty();
		
		var len = Object.keys(myPendReviewBranch).length
		
		
		setTimeout(function(){
			if( len ==0){
				$(".ui-errorMsg").css("display","block");
			}else{
				$(".ui-errorMsg").css("display","none");
			}
			$(".loader").css("display","none"); 
			for(i = 0; i<len; i++){
				try{
					var branch_Info = myPendReviewBranch[i];
					getProfilePic(branch_Info , function( branchDetails ){

						$('.ui-MyPendReviewRcord').append(createBranchTemp(branchDetails));

					});
				}catch(err){
				}
			}
		}, 1000);
	});
	$(".ui-MyModuleReviewPend").on('click', function(){
		
		$(".loader").css("display","block");
		$(".ui-errorMsg").css("display","none");
		
		$('.ui-MyModuleReviewPend').css("border-bottom","5px solid #2196F3");
		$('.ui-MyReviewPend').css("border-bottom","none");
		$('.ui-MyBranchReviewPend').css("border-bottom","none");
		
		$(".ui-MyModPendReviewRecord").css("display","block");
		$(".ui-MyPendReviewRcord").css("display","none");
		$(".ui-MyBraPendReviewRecord").css("display","none");
		
		$('.ui-MyModPendReviewRecord').empty();
		var len = Object.keys(moduleBranch).length
		
		setTimeout(function(){
			if( len ==0){
				$(".ui-errorMsg").css("display","block");
			}else{
				$(".ui-errorMsg").css("display","none");
			}
			$(".loader").css("display","none"); 
			
			for(i = 0; i<len; i++){
				try{
					var branch_Info = moduleBranch[i];
					getProfilePic(branch_Info , function( branchDetails ){
						$('.ui-MyModPendReviewRecord').append(createBranchTemp(branchDetails));
	
					});
				}catch(err){
				}
			}
		}, 1000);
	});
	$(".ui-MyBranchReviewPend").on('click', function(){
		
		$(".loader").css("display","block");
		$(".ui-errorMsg").css("display","none");
		$('.ui-MyBranchReviewPend').css("border-bottom","5px solid #2196F3");
		$('.ui-MyReviewPend').css("border-bottom","none");
		$('.ui-MyModuleReviewPend').css("border-bottom","none");
		
		$(".ui-MyBraPendReviewRecord").css("display","block");
		$(".ui-MyPendReviewRcord").css("display","none");
		$(".ui-MyModPendReviewRecord").css("display","none");
		
		$('.ui-MyBraPendReviewRecord').empty();
		
		var len = Object.keys(myBranch).length
		
		setTimeout(function(){
			if( len ==0){
				$(".ui-errorMsg").css("display","block");
			}else{
				$(".ui-errorMsg").css("display","none");
			}
			
			$(".loader").css("display","none"); 
			
			for(i = 0; i<len; i++){
				try{
					
					var branch_Info = myBranch[i];
					getProfilePic(branch_Info , function( branchDetails ){
						$('.ui-MyBraPendReviewRecord').append(createBranchTemp(branchDetails));

					});
				}catch(err){
				}
			}
		}, 1000);
		
	});
	$(".ui-data_listing, .ui-header, .ui-icon-close").on('click',function(){
		$(".ui-branch-panel").css("display","none");
	});

	setPeopleCsrf(function() {});
	getUserProfile();
	loadDashBoard();
});

function doc_keyUp(e) {

    if (e.keyCode == 27) {
    	$(".ui-branch-panel").css("display","none");
    }
}
document.addEventListener('keyup', doc_keyUp, false);


