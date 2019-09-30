/* $Id$ */
jQuery(function($){
	$.extend({
		_isAjaxUploadCompatible: function(){
			if(this._isCompatible == undefined){
				this._isCompatible = (typeof (new XMLHttpRequest()).upload != "undefined");
			}
			return this._isCompatible;
		},
		_isFileParam: function(value){
			if(typeof value === 'object'){
				try{
					var val = $(value)[0];
					if((val.name || val.files) || (val.nodeType && $(val).is('input[type=file]'))){
						return true;
					}
				}catch(e){
				}
			}
			return false;
		},
		_parseFiles: function(dataArr){
			var files = {};
			var base = this;
			dataArr = $.isArray(dataArr)? dataArr: [dataArr];
			if(this._isAjaxUploadCompatible()){
				$.each(dataArr, function(i, data){
					$.each(data, function(param, value){
						var isFileParam = base._isFileParam(value);
						if(isFileParam){
							var fileVal = [];
							if($(value).is('input[type=file]')){	//No i18n
								for(var f=0;f<$(value).length;f++){
									var val = $(value)[f];
									if(val.nodeType && val.files){
										fileVal.push(val.files);
									}
								}
								files[param] = fileVal;
							}
							else{
								files[param] = value;
							}						
							data[param] = undefined;
							delete data[param];
						}
					});
				});
			}
			else{
				$.each(dataArr, function(i, data){
					$.each(data, function(param, value){
						var isFileParam = base._isFileParam(value);					
						if(isFileParam){
	        	        	var val = $(value)[0];
	          		        if((val.nodeType && $(val).is('input[type=file]')) && val.files){	//No i18n
	                   			value = val.files;
		                    }
	        		        files[param] = value;
							data[param] = undefined;
							delete data[param];
						}
					});
				});
			}
			return files;
		},
		ajaxUpload: function(url, data, callbacks, dataType, synchronous, singleUpload){
			var files = this._parseFiles(data);
			return this._getUploader().post(this, url, data, files, callbacks, dataType, synchronous, singleUpload);
		},
		ajaxDownload: function(url, data, callbacks, dataType){
			return this.uploaders.iframeUploader.get(this, url, data, [], callbacks, dataType);
		},
		_getUploader: function(){
			return this.uploaders[this._isAjaxUploadCompatible()? 'ajaxUploader': 'iframeUploader'];
		},
		_getParamFilledURL: function(url, params){
			$.each(params, function(param, value){
				url+=((url.indexOf('?') == -1 )? "?": "&");
				url+=(param+'='+unescape(encodeURIComponent(value)));
			});
			return url;
		},
		uploaders:{
			ajaxUploader: {
				post: function(base, url, data, files, callbacks, dataType, synchronous, singleUpload){
					var self = this;
					files = this._getFiles(files);
					var reqs = [];
					if(singleUpload){
						$(files).each(function(i, file){
							var req = self.upload(base, url, data, file, callbacks, dataType, synchronous);
							reqs.push(req);
						});
					}
					else{
						reqs = self.upload(base,url,data,files,callbacks,dataType,synchronous);
					}
					return this._controller(reqs, files);
				},
				_controller: function(reqs, files){
					return {
						'files': files,
						'abort': function(){
							$.each(reqs, function(index, req){
								req.abort();
							});
						},
						'getFilesDetails': function(){
							var details = [];
							$(files).each(function(i, file){
								details.push({
									'name': file.fileName,
									'size': file.size
								});
							});
							return details;
						}
					}
				},
				_getFiles: function(files){
					var self = this;
					var allFiles = [];
					$.each(files, function(paramName, file){
						if(file.name){
                                                    //This is a single file
							file.pname = paramName;
							allFiles.push(file);
						}
						else{
                            $.each(file,function(i, ifile){
								if(ifile.name){
									ifile.pname = paramName;
									allFiles.push(ifile);
								}
								else{
									var nfile = self._getFiles(ifile);
									for(var i=0;i<nfile.length;i++){
										var fileObj = nfile[i];
										if(fileObj){
											fileObj.pname = paramName;
											allFiles.push(fileObj);
										}
									}
								}
							});                                                          
						}
					});
					if(!allFiles.length){
						allFiles[0] = undefined;
					}
					return allFiles;
				},
				_getFileName: function(file){
					return (file.fileName? file.fileName: file.name);
				},
				_getFileSize: function(file){
					return (file.fileSize? file.fileSize: file.size);
				},
				upload: function(base, url, data, file, callbacks, dataType, synchronous){
					var req = new XMLHttpRequest();
					var customData = callbacks.customData ? callbacks.customData : undefined;
					req.onreadystatechange = function () {
						if (req.readyState == 4){
							var m = (req.status == 200)? callbacks.success: callbacks.fail;
							if(m){
								m(req.responseText, req, customData);
							}
						}
					};
	
					if(callbacks.progress){
						var meter = function(e){
							var percentage = Math.floor((e.loaded/e.total)*100);
							e.file = file;
							if(customData !== undefined){
								customData.percentage = percentage;
								callbacks.progress(e, customData);
							}
							else{
								callbacks.progress(e, percentage);
							}
						};
						req.addEventListener("progress", meter, false);
						req.upload.addEventListener("progress", meter, false);
					}
					if(callbacks.complete){
						req.addEventListener("load", callbacks.complete, false);
						req.upload.addEventListener("load", callbacks.complete, false);
					}
					if(callbacks.beforeSend){
						callbacks.beforeSend();
					}	
					req.open("POST", url, !synchronous);
	
					this[((typeof FormData != "undefined")? "_doFormUpload": "_doBinaryUpload")](req, data, file);
	
					return req;
				},
				_doFormUpload: function(req, params, files){
					var form = new FormData();
					$.each(params, function(param, value){
						form.append(param, value);
					});
	
					$.each(files,function(i,file){
						if(file){
							form.append(file.pname, file);
						}
					});
	
					req.send(form);
				},
				_doBinaryUpload: function(req, params, file){
					var boundaryString = 'zoho';
					var boundary = "---------------"+boundaryString+Math.random();
					var multiStream = "\r\n--"+boundary;
	
					var paramInputStreamStr = "";
	
					var base = this;
	
					$.each(params, function(param, value){
						paramInputStreamStr += '\r\n'+base._getMultiPartParamStr(param, value);
						paramInputStreamStr += '\r\n--'+boundary;
					});
					multiStream += paramInputStreamStr;
					if(file){
						multiStream += '\r\n';
						multiStream += this._getMultiPartFileParamStr(file.pname, file);
						multiStream += "\r\n--"+boundary+"--";
					}else{
						multiStream += '--';//Finishing the Boundary for requests without file
					}
	
					req.setRequestHeader("Content-Length", multiStream.length);
					req.setRequestHeader("Content-Type", "multipart/form-data; charset: UTF-8; accept-charset: UTF-8; boundary="+boundary);
					req.setRequestHeader("Connection", "close");
					req.sendAsBinary(multiStream);
				},
				_getMultiPartFileParamStr: function(pname, file){
					return 'Content-Disposition: form-data; name="'+pname+'"; filename="'
							+ unescape(encodeURIComponent(file.fileName)) + '"' + '\r\n'
							+ 'Content-Type: application/octet-stream' + '\r\n'
							+ '\r\n'
							+ file.getAsBinary();
				},
				_getMultiPartParamStr: function(pname, pvalue){
					return 'Content-Disposition: form-data; name="'+pname+'"\r\n\r\n'+unescape(encodeURIComponent(pvalue));//No I18N
				}
			},
			iframeUploader: {
				post: function(base, url, data, files, callbacks, dataType){

					return this._perform(base, url, data, files, callbacks, dataType);
				},
				get: function(base, url, data, files, callbacks, dataType){
					return this._perform(base, url, data, files, callbacks, dataType, true);
				},
				_perform: function(base, url, data, files, callbacks, dataType, isGet){
					var iframe = this._createIframe();
					var form = this._fillParams(base, url, data, files, iframe.attr('name'), isGet);
					var customData = callbacks.customData ? callbacks.customData : undefined;
					var base = this;
					iframe.load(function(e){
						var response = base.getResponse($(iframe[0].contentWindow.document.body), dataType);
						if(callbacks.success){
							callbacks.success(response, undefined, customData);
						}
						form.remove();
						iframe.remove();
					});
					if(callbacks.beforeSend){
						callbacks.beforeSend();
					}
					form.submit();
					return this._controller(iframe, form, files);
				},
				getResponse: function(ele, dataType){
					switch(dataType){
						case 'json':
						case 'jsonp':
							return $.parseJSON(ele.text());
						case 'html':
							return ele.html();
						case 'text':
						default:
							return ele.text();
					}
				},
				_controller: function(iframe, form, files){
					return {
						'files': [files],
						'abort': function(){
							iframe[0].contentWindow.stop()
						},
						'getFilesDetails': function(){
							var details = [];
							$(files).each(function(i, file){
								file = $(file);
								details.push({
									'name': file.val(),
									'size': ''
								});
							});
							return details;
						}
					}
				},
				_createIframe: function(){
					var frameName = "uploadFrame"+(new Date()).getTime();
					var iframe = $('<iframe name="'+frameName+'">').attr({
						'src': 'about:blank',
						'height': '0',
						'width': '0',
						'frameborder': '0',
						'id': frameName
					});
					this._iframe = iframe;
					$(document.body).append(iframe);
					return iframe;
				},
				_getParamFilledForm: function(form, params, files){
					$.each(params, function(param, value){
						if(value){
							var hidden = $('<input type=hidden name='+param+'>').attr({
								'value': value
							});
							form.append(hidden);
						}
					});
					$.each(files, function(i, file){
						file = $(file);
						file.data('parent', file.parent());
						var clone = file.clone(true);
						clone.insertBefore(file);
						form.append(file);
					});
				},
				//files will be input file
				_fillParams: function(base, url, params, files, frameName, isGet){
					var form = $('<form>').attr({
						'method': isGet? 'get': 'post',
						'target': frameName,
						'action': url
					});
					if(!isGet){
						form.attr('enctype', 'multipart/form-data');
						form[0].encoding = "multipart/form-data";
					}
					$(document.body).append(form.fadeTo(0, 0));
					this._getParamFilledForm(form, params, files)
					return form;
				}
			}
		}
	});
});


