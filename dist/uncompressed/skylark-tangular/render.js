define([
	"./tangular",
	"./Template"
],function(tangular,Template){

	return tangular.render = function(template, model, repository) {
		if (model == null)
			model = {};
		return new Template().compile(template)(model, repository);
	};

});