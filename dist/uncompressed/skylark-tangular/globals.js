define([
	"./tangular",
	"./helpers"
],function(tangular){
	function init() {
		var W = window;
		W.Ta = W.Tangular = tangular;
		W.Thelpers = tangular.helpers;		
	}
	return init;
});