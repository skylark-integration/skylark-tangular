define([
	"./tangular"
],function(tangular){
	var helpers = {};

	var REG_ENCODE = /[<>&"]/g;


	helpers.$execute = function(model, name, a, b, c, d, e, f, g, h) {

		if (helpers[name] == null) {
			console && console.warn('Tangular: missing helper', '"' + name + '"');
			return a;
		}
		return helpers[name].call(model, a, b, c, d, e, f, g, h);
	};

	helpers.encode = function(value) {
		return value == null ? '' : value.toString().replace(REG_ENCODE, function(c) {
			switch (c) {
				case '&': return '&amp;';
				case '<': return '&lt;';
				case '>': return '&gt;';
				case '"': return '&quot;';
			}
			return c;
		});
	};

	helpers.raw = function(value) {
		return value;
	};

	return tangular.helpers = helpers;
});