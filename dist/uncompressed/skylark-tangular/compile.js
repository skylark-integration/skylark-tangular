define([
	"./tangular",
	"./Template"
],function(tangular,Template){

	return tangular.compile = function(template) {
		return new Template().compile(template);
	};

});