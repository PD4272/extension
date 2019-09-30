var Creator = (function(){

	
	
	var getWaitingForReviewData = function(){
		
		$.ajax({

			type: "GET",//no i18n
			dataType: 'json',//no i18n

			url: CreatorUrl.WaitingForReviewURL,

			error : function( res ){
				
			},

			success: function ( res ) {
				
				if(!Common.isEmpty(res)){
					convertToWriterDataModule(res)
				}
			}
		});
	};
	var convertToWriterDataModule = function(data){
		
		var modelDataJson = data.MODEL.DATAJSONARRAY
		try{
//			var userEmailID = userdetails.primary_email.toLowerCase();


			for(i = 0; i<modelDataJson.length; i++){
				
				var branch_Info = modelDataJson[i];

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
			}
		}catch(err){
		}
	}
	
	return {
		getWaitingForReviewData:getWaitingForReviewData
	}
})();