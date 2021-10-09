define([
	"./tangular",
	"./helpers"
],function(tangular,helpers){

	return tangular.register = function(name, fn) {
		helpers[name] = fn;
		return this;
	};
});