var Common = (function(){
	
	/*
		* Change File Names US,EU,CN,IN,LOCAL
	*/

	var getFileName = {

			"Local":"localdb_changefiles.properties" ,
			"US4":"us4_changefiles.properties" ,
			"US3":"us3_changefiles.properties", 
			"EU1":"eu1_changefiles.properties" , 
			"EU2":"eu2_changefiles.properties" ,
			"CN2":"cn2_changefiles.properties",
			"CN3":"cn3_changefiles.properties",
			"IN1":"in1_changefiles.properties",
			"IN2":"in2_changefiles.properties",
			"AU1":"au1_changefiles.properties"
	}

	/*
		* Create random id 
	*/

	function makeid(length) {

	   var result           = '';
	   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	   var charactersLength = characters.length;
	   for ( var i = 0; i < length; i++ ) {
	      result += characters.charAt(Math.floor(Math.random() * charactersLength));
	   }
	   return result;
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

	return{
		getFileName : getFileName,
		getRandomId : makeid,
		isEmpty 	: isEmpty
	}
})();