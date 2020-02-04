define([
	"./tangular",
	"./helpers"
],function(tangular){
	var W = window;
	W.Ta = W.Tangular = tangular;
	W.Thelpers = tangular.helpers;
	return W;
});