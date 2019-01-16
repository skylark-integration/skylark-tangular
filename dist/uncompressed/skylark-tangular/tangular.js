define([
	"skylark-langx/skylark"
],function(skylark){
	var totaljs = skylark.totaljs = skylark.totaljs  || {};

	var tangular = totaljs.tangular = {};
	var Thelpers = tangular.helpers = {};
	tangular.version = 'v3.0.1';
	tangular.cache = {};
	tangular.debug = false;

	tangular.toArray = function(obj) {
		var keys = Object.keys(obj);
		var arr = [];
		for (var i = 0, length = keys.length; i < length; i++)
			arr.push({ key: keys[i], value: obj[keys[i]] });
		return arr;
	};

	return tangular;
});

