
var peopleCsrf = ""; 
var curentViewData = "";
var getProfilePic = function ( info , callback) {

	return new Promise(function(resolve, reject) {

		var data = {"mode":"USER_SEARCH","searchStr":info.branch_Owner,"isQuickSearch":true,"conreqcsr":peopleCsrf}
		$.ajax({

			type: "POST", //No I18N
			data : data,
			url: "https://people.zoho.com/zpeoplehr/searchActions.zp" , //No I18N

			error : function ( response ){
				
				$.get("https://people.zoho.com/zpeoplehr/viewPhoto");
				callback(info );
				// setPeopleCsrf(getProfilePic(info , callback));
				
				//TODO: Use account default API to get profile Name and Email ID
			},

			success: function ( response ) {
				info.ProfileID=response.result[0].eno
				callback(info );
			}
		});
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
	$(branchListing_Dom.find(".ui-sdIcon")).on('click', function(){

		$(".ui-sd").css("background-color","#000000ad");
		$(".ui-sd").css("z-index","11");
		$(".ui-sdMain").css("display","block");
		var branchName = $(this).closest(".ui-branc-details").find(".ui-branchName").text();
		var branchUrl = chrome.extension.getBackgroundPage().getBranchUrl(branchName , setBranchUrl);
		
		$(".ui-sd-buildName").text(branchName);
		
	});

	$(branchListing_Dom).on('dblclick', function(){
		$(".ui-toverlay").css("display","block");
		$(".ui-branch_info").css("display","block");
		$(".ui-branchLogDiv").css("display","none");

		$(".ui-features_Details").empty();
		$(".ui-branchTagDiff").empty();
		$(".ui-tUsecases").empty();
		$(".ui-tbranchInfo").text("");
		var curBranchName = $(this).find(".ui-branchName").text()
		
		var info = allBranch[curBranchName];
		var features_Details = $("<div>"+info.Fixes_Details+"</div?>")[0]
		var usecases = $("<div>"+info.usecases+"</div?>")[0];
		$(".ui-tbranchInfo").text(curBranchName+" DETAILS")
		$(".ui-features_Details").append(features_Details);
		$(".ui-tUsecases").append(usecases);

		$.ajax({type: "GET",url: info.tagDiff,success: function ( response ) {
					var response = $(response);

					response.find(".download_rev_file").css("display","none");
					response.find("#filename_fltr").css("display","none");
					response.find(".reviewhead").css("display","none");
					response.find(".author").css("display","none");
					response.find(".branch").css("display","none");
					response.find(".files_cnt").css("display","none");
					var links = response.find("a");

					for (var i = 0; i < links.length; i++) {
				            link = links[i].href;
				            spl_link = link.split('/writer/');
				            link_array = [spl_link.shift(), spl_link.join('/writer/')];
				            links[i].href = 'https://cmsuite.csez.zohocorpin.com/writer/' + link_array[1] + '&newPage=True';
				            links[i].target = '_blank';
				        }
					$(".ui-branchTagDiff").append(response);
				}});

	});
}

var setBranchUrl = function (branchUrl) {
	$(".ui-sd-buildUrl").text(branchUrl);
	$(".ui-sd-buildUrl").val(branchUrl);
}
var setPeopleCsrf = function( callback){
	
	chrome.cookies.get({"url": "https://people.zoho.com","name":"CSRF_TOKEN"}, function(cookie) {	
		peopleCsrf = cookie.value;
		callback();
	});	
}

$("document").ready(function(){	

	$(".ui-Submit").on('click', function(){
			
			$(".ui-sd").css("background","none")
			$(".ui-sd").css("z-index","9")
			$(".ui-sdMain").css("display","none");
			var branchName = $(".ui-sd-buildName").text();
			var branchUrl = $(".ui-sd-buildUrl").text();
			var localzoho = $(this).parent().find(".ui-localzoho-machine").val();
			chrome.extension.getBackgroundPage().startLocalzoho(branchUrl , localzoho);
			
	});

});