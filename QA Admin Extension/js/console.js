J("document").ready(function(){

	J('.ui-console_msg').on('keyup', function (e) {

	  	if (e.keyCode == 13) {

	  		executive(this.value);
	  		J('.ui-console_msg').val("");
	  	}else if (e.keyCode == 50) {

	  		J(".ui-suggestion").removeClass("ui-none");

	  	}else if (e.keyCode == 8) {
	  		J(".ui-suggestion").addClass("ui-none")

	  	}else if(e.keyCode == 40){

	  		J(".ui-option").each(function( index ) {

				if(J( this ).attr("class").indexOf("ui-selected") != -1){

					J( this ).removeClass("ui-selected");

				}else{
					
					J( this ).addClass("ui-selected");
					return false;
				}
			})
	  	}
	});

	J(".ui-console_MainDiv").on('click', function(){
		J(".ui-console_msg").focus()
	});
	J(".ui-option").on('click', function(){
		var val = J(this).attr("value")
		J('.ui-console_msg').val(val);
		J(".ui-suggestion").addClass("ui-none")
	});
});

var executive = function (command) {

	if(command.indexOf("mergeAll") != -1 || command.indexOf("merge All") != -1){
		mergeAllBranch()
	}else{
		var TargetBranch = command.indexOf("default") != -1 ? "default" :"qa";
		var branchName = command.split("merge ")[1];

		var executiveCommand= TargetBranch+"__"+branchName;
		
		chrome.extension.getBackgroundPage().Commandexecutive( executiveCommand,appendConsoleLog );
	}
}
var mergeAllBranch = function () {

	var bramchlength = Object.keys(branchInfo).length;

	for(var i = 0; i<bramchlength; i++ ){
		
		var executiveCommand= "qa__"+branchInfo[i].branchName;
		chrome.extension.getBackgroundPage().Commandexecutive( executiveCommand , appendConsoleLog );
	}
}

var appendConsoleLog = function(log){
	$(".ui-console_responseTxt").append(log.data.replaceAll("\n","</br>"))
}
