var changeFileDeploy = ["Local","US3","US4","EU1","EU2"],changeFileProperty = {},
ChangeFileName = "",product = "ZOHOWRITER_4_0",b_type = "",filePath,
isAdded,isModified,add=[],modified=[],isMultipleDeployment//,"EU1","EU2","CN2","CN3","IN1","IN2","AU1"]

J("document").ready(function(){	

	J('.ui-groupName').on('click', function() {

		resetChangeFileOptions();

		var val = J(this).attr("value");
		if (!Common.isEmpty(val)) {
			b_type = val;
			getchangefileProperty( Common.getFileName[b_type.split(",")[0]] , function(){});

		}
		

		
	});
	
	J(".ui-valueChange").on('click', function(){

		var val = J(".ui-ChangeFileVal").val();

		J("#"+J(".ui-ChangeFileVal").attr("for")).text(val);

		isModified = true;
        modified.push(val);

		J(".ui-sd").css("background","none");
		J(".ui-sd").css("z-index","9");
		J(".ui-updateChangeFileVal").css("display","none");

	});
	J(".ui-change").on('click', function(){

		if(Common.isEmpty(filePath) || Common.isEmpty(changeFileProperty)){
			return;
		}

		changesFiles();
		
	});

	J( ".field__textbox" ).keypress(function(e) {

	  	if (e.keyCode == 13) {

	  		addNewValue(this.value);
	  	}
	});
});
async function changesFiles () {
	if(J(".ui-changeAllDeployment").is(':checked')){

			isMultipleDeployment = true;

			for(let i = 0; i < changeFileDeploy.length; i++){

				var DeployName = changeFileDeploy[i];
				await getchangefileProperty(Common.getFileName[DeployName] , changeDeploymentFiles);

			}
		}else if (b_type.indexOf(",") != -1 ){

			isMultipleDeployment = true;

			var deployType = b_type.split(",");

			for(let i = 0; i < deployType.length; i++){

				await getchangefileProperty( Common.getFileName[deployType[i]], changeDeploymentFiles);

			}
			
		}else{
			changeDeploymentFiles( Common.getFileName[b_type] , changeFileProperty);

		}
		resetChangeFileOptions();
}
var addNewValue = function (val) {


	  		if (Common.isEmpty(val)) {
	  			return;
	  		}

	  		var changefile_field = J( J('#changefile_field').html() );

            changefile_field.find(".field__text").text(val)
            changefile_field.find(".field__text").attr("id",Common.getRandomId(4))

            J("#ui-changeFilePathVal-MainDiv").append(changefile_field);

            isAdded = true;
            add.push(val)

            bindChangeField(changefile_field)
            $(".field__textbox").val("")
}
var setFileValue =function ( ChangeFileName ,changeFilePropertyes ) {

	var val = "";


	J(".field__text").each(function( index ) {

		var fieldlen = J(".field__text").length-1,
			txt= J( this ).text();

			if(J(".ui-changeDomain").is(':checked') && fieldlen == index){
				

				if (ChangeFileName.startsWith("us")) {

					txt = txt.replace(".com",".com")

				}else if (ChangeFileName.startsWith("eu")) {

					txt = txt.replace(".com",".eu")

				}else if (ChangeFileName.startsWith("in")) {

					txt = txt.replace(".com",".in")

				}else if (ChangeFileName.startsWith("cn")) {

					txt = txt.replace(".com",".com.cn")

				}else if (ChangeFileName.startsWith("au")) {

					txt = txt.replace(".com",".com.au")
				}
			}
			

		val += fieldlen == index ? txt : txt+"###";

	});
	changeFilePropertyes[filePath] = val;
}

function bindChangeField(ChangeField_Dom){

	J(ChangeField_Dom.find(".field__close")).on('click', function(){

		this.parentElement.remove();

	});
	J(ChangeField_Dom.find(".field__text")).on('click', function(){

		J(".ui-sd").css("background-color","#000000ad");
		J(".ui-sd").css("z-index","11");
		J(".ui-updateChangeFileVal").css("display","block");
		J(".ui-ChangeFileVal").attr("for",J(this).attr("id"));
		J(".ui-ChangeFileVal").val(J(this).text());

	});

	J(ChangeField_Dom.find('.select-box__option')).on('click', function() {

		J(".field__token").remove();
		
		filePath  = J(this).text();

		var searchString= changeFileProperty[filePath];

		if (Common.isEmpty(searchString)) {
			return;
		}
		searchString = searchString.split("###");

		for(let i = 0; i < searchString.length; i++){

			var val = searchString[i],
				changefile_field = J( J('#changefile_field').html() );

            changefile_field.find(".field__text").text(val)
            changefile_field.find(".field__text").attr("id",Common.getRandomId(4))

            J("#ui-changeFilePathVal-MainDiv").append(changefile_field);

            bindChangeField(changefile_field)
		}
	});
	}
var resetChangeFileOptions = function () {

	changeFileProperty = {};
	filePath = "";
	J(".field__token").remove();
	$(".field__textbox").val("")
	$(".ui-changeAllDeployment").prop( "checked", false );
	$(".ui-changeDomain").prop( "checked", false );
	J(J("#ui-changeFile_filePath").find(".select-box__list")[0]).find(".ui-default").click();
	isAdded = false;
	isModified = false;
	add = [];
	modified = [];
	isMultipleDeployment = false;

}
var getchangefileProperty = function ( type , callback) {
    return new Promise(function(resolve, reject) {

		J.ajax({

			type: "GET", //No I18N
			url: "https://sd.csez.zohocorpin.com/api/getchangefileinfo?product="+product+"&bType="+type+"&prop_type=7",

			error : function ( ){
				reject();
			},

			success: function ( response ) {

				var files = response.files,
					changeFileObj = {};
					changeFileProperty= {};
				if (Common.isEmpty(files)) {
					return;
				}
	            J.each(files, function() {

	            	//New Value Added 
	            	if (isAdded) {

	            		var fileObj = !Common.isEmpty(this[0]) ? this[0] : "";

		            	if( fileObj.file_name == filePath ){

		            		add.forEach( function(value) {
								changeFileObj[filePath] =value+"###"
							}) 
		            		 
		            	}
	            	}
	            	
	                J.each(this, function(k, v) {

	                    if(typeof(v) == "object"){

	                        var fileName = v.file_name,
	                        propertyvalue = changeFileObj[fileName] != undefined ? changeFileObj[fileName] : "";

	                        var searchStrings = v.search_strings;

	                        if(isModified){
	                        	modified.forEach( function(value) {

	                        		if (searchStrings.match(value)) {
	                        			searchStrings = value;
									}
								});
	                        	
	                        }

	                        if(propertyvalue != "" && !propertyvalue.endsWith("###")){

                                changeFileObj[fileName] = propertyvalue+"###"+searchStrings;
                            }else{

                                changeFileObj[fileName] = propertyvalue+searchStrings;
                            }

                           

	                    }

	                });

	            })
	           
	            changeFileProperty = changeFileObj

	            setFileProperty();

	            callback(type , changeFileObj );
	            resolve()
	        }
		});
		
	});
}
var setFileProperty =function () {
		
		J(".ui-filePath").remove();

		J.each(changeFileProperty, function(k, v) {

			var changefilePath = J( J('#changefile_path').html() ),
				changefilePathLabel = J( J('#changefile_pathLabel').html() ),
				randomId = Common.getRandomId(6);

			changefilePath.find(".select-box__input").attr("id",randomId)
			changefilePath.find(".select-box__input-text").text(k)

			changefilePathLabel.find(".select-box__option").attr("for",randomId)
			changefilePathLabel.find(".select-box__option").text(k)
			
			J("#ui-changeFile_filePath").find(".select-box__current").append(changefilePath);
	        J("#ui-changeFile_filePath").find(".select-box__list").append(changefilePathLabel);
	        J(J("#ui-changeFile_filePath").find(".select-box__list")[0]).find(".ui-default").click();
	        bindChangeField(changefilePathLabel)

	        
	        
	     });
}

var changeDeploymentFiles = function (ChangeFileName , changeFilePropertyes) {

	addNewValue($(".field__textbox").val());

	setFileValue(ChangeFileName , changeFilePropertyes);
	
	var searchString= changeFilePropertyes[filePath];
		searchString = searchString.replaceAll("\1","\\\\1");

	var fileProps = {}

	fileProps["b_type"]= ChangeFileName;
	fileProps["file_name"] = filePath;
	fileProps["peer_dc_addition"] = 0;
	fileProps["prod_name"] = product;
	fileProps["propType"] = 7;
	fileProps["comment"] = "";
	fileProps["search_string"] = searchString;
	
	J.ajax({

		type: "POST", //No I18N
		url: "https://sd.csez.zohocorpin.com/api/updatechangefileinfo",
		data : {"fileProps":fileProps},
		error : function ( response ){
			
		},

		success: function ( response ) {
			J(".ui-changeFile_filePath").empty();
			alert(response.meta.response)
			getchangefileProperty( Common.getFileName[b_type.split(",")[0]] , setFileProperty);
		}
	}); 
}

String.prototype.replaceBetween = function(start, end, what) {
  return this.substring(0, start) + what + this.substring(end);
};