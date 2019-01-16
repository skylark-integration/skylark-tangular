define([
	"./tangular",
	"./helpers"
],function(tangular){
	return tangular.globals = function() {
		var W = window;
		W.Ta = W.Tangular = tangular;
		W.Thelpers = tangular.helpers;
		return W;
	};
});