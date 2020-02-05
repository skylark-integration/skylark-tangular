/**
 * skylark-tangular - A version of tangular.js that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-tangular/
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx/skylark");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-tangular/tangular',[
	"skylark-langx/skylark"
],function(skylark){
	var tangular = skylark.attach("intg.totaljs.tangular",{}); 
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


define('skylark-tangular/Template',[
	"./tangular"
],function(tangular){

	var SKIP = { 'null': true, 'undefined': true, 'true': true, 'false': true };
	var REG_VARIABLES = /&&|\|\|/;
	var REG_KEY = /[a-z0-9._]+/gi;
	var REG_KEYCLEAN = /^[a-z0-9_$]+/i;
	var REG_NUM = /^[0-9]/;
	var REG_STRING = /'.*?'|".?"/g;
	var REG_CMDFIND = /\{\{.*?\}\}/g;
	var REG_CMDCLEAN = /\{\{|\}\}/g;
	var REG_TRIM = /\n$/g;

	function Template() {
		this.commands;
		this.variables;
		this.builder;
		this.split = '\0';
	}


	Template.prototype.compile = function(template) {

		var self = this;
		var ifcount = 0;
		var loopcount = 0;
		var tmp;
		var loops = [];

		self.variables = {};
		self.commands = [];

		self.builder = template.replace(REG_CMDFIND, function(text) {

			var cmd = text.replace(REG_CMDCLEAN, '').trim();
			var variable = null;
			var helpers = null;
			var index;
			var isif = false;
			var isloop = false;
			var iscode = true;

			if (cmd === 'fi') {
				ifcount--;
				// end of condition
			} else if (cmd === 'end') {
				loopcount--;
				// end of loop
				loops.pop();
			} else if (cmd.substring(0, 3) === 'if ') {
				ifcount++;
				// condition
				variable = self.parseVariables(cmd.substring(3), loops);
				if (variable.length) {
					for (var i = 0; i < variable.length; i++) {
						var name = variable[i];
						if (self.variables[name])
							self.variables[name]++;
						else
							self.variables[name] = 1;
					}
				} else
					variable = null;
				isif = true;
				iscode = true;
			} else if (cmd.substring(0, 8) === 'foreach ') {

				loopcount++;
				// loop

				tmp = cmd.substring(8).split(' ');
				loops.push(tmp[0].trim());

				index = tmp[2].indexOf('.');
				if (index !== -1)
					tmp[2] = tmp[2].substring(0, index);

				variable = tmp[2].trim();

				if (loops.indexOf(variable) === -1) {
					if (self.variables[variable])
						self.variables[variable]++;
					else
						self.variables[variable] = 1;
					variable = [variable];
				}
				else
					variable = null;

				isloop = true;
			} else if (cmd.substring(0, 8) === 'else if ') {
				// else if
				variable = self.parseVariables(cmd.substring(8), loops);
				if (variable.length) {
					for (var i = 0; i < variable.length; i++) {
						var name = variable[i];
						if (self.variables[name])
							self.variables[name]++;
						else
							self.variables[name] = 1;
					}
				} else
					variable = null;
				isif = true;
			} else if (cmd !== 'continue' && cmd !== 'break' && cmd !== 'else') {


				variable = cmd ? cmd.match(REG_KEYCLEAN) : null;

				if (variable)
					variable = variable.toString();

				if (variable && SKIP[variable])
					variable = null;

				if (variable && loops.indexOf(variable) === -1) {
					if (self.variables[variable])
						self.variables[variable]++;
					else
						self.variables[variable] = 1;

					variable = [variable];
				} else
					variable = null;

				if (cmd.indexOf('|') === -1)
					cmd += ' | encode';

				helpers = cmd.split('|');
				cmd = helpers[0];
				helpers = helpers.slice(1);
				if (helpers.length) {
					for (var i = 0; i < helpers.length; i++) {
						var helper = helpers[i].trim();
						index = helper.indexOf('(');
						if (index === -1) {
							helper = 'Thelpers.$execute(model,\'' + helper + '\',\7)';
						} else
							helper = 'Thelpers.$execute(model,\'' + helper.substring(0, index) + '\',\7,' + helper.substring(index + 1);
						helpers[i] = helper;
					}
				} else
					helpers = null;

				cmd = self.safe(cmd.trim() || 'model');
				iscode = false;
			}

			self.commands.push({ index: self.commands.length, cmd: cmd, ifcount: ifcount, loopcount: loopcount, variable: variable, helpers: helpers, isloop: isloop, isif: isif, iscode: iscode });
			return self.split;

		}).split(self.split);


		for (var i = 0, length = self.builder.length; i < length; i++)
			self.builder[i] = self.builder[i].replace(REG_TRIM, '');

		return self.make();
	};

	Template.prototype.parseVariables = function(condition, skip) {

		var variables = [];
		var arr = condition.split(REG_VARIABLES);
		for (var i = 0, length = arr.length; i < length; i++) {

			var key = arr[i].replace(REG_STRING, '');
			var keys = key.match(REG_KEY);

			for (var j = 0; j < keys.length; j++) {
				key = keys[j];
				key = key.split('.')[0];
				if (!key || (REG_NUM).test(key) || SKIP[key])
					continue;
				variables.indexOf(key) === -1 && skip.indexOf(key) === -1 && variables.push(key);
			}
		}
		return variables;
	};

	Template.prototype.safe = function(cmd) {

		var arr = cmd.split('.');
		var output = [];

		for (var i = 1; i < arr.length; i++) {
			var k = arr.slice(0, i).join('.');
			output.push(k + '==null?\'\':');
		}
		return output.join('') + arr.join('.');
	};

	Template.prototype.make = function() {

		var self = this;
		var builder = ['var $output=$text[0];var $tmp;var $index=0;'];

		for (var i = 0, length = self.commands.length; i < length; i++) {

			var cmd = self.commands[i];
			var tmp;

			i && builder.push('$output+=$text[' + i + '];');

			if (cmd.iscode) {

				if (cmd.isloop) {

					var name = '$i' + Math.random().toString(16).substring(3, 6);
					var namea = name + 'a';
					tmp = cmd.cmd.substring(cmd.cmd.lastIndexOf(' in ') + 4).trim();
					tmp = namea + '=' + self.safe(tmp) + ';if(!(' + namea + ' instanceof Array)){if(' + namea + '&&typeof(' + namea + ')===\'object\')' + namea + '=Tangular.toArray(' + namea + ')}if(' + namea + ' instanceof Array&&' + namea + '.length){for(var ' + name + '=0,' + name + 'l=' + namea + '.length;' + name + '<' + name + 'l;' + name + '++){$index=' + name + ';var ' + cmd.cmd.split(' ')[1] + '=' + namea + '[' + name + '];';
					builder.push(tmp);

				} else if (cmd.isif) {
					if (cmd.cmd.substring(0, 8) === 'else if ')
						builder.push('}' + cmd.cmd.substring(0, 8).trim() + '(' + cmd.cmd.substring(8).trim() + '){');
					else
						builder.push(cmd.cmd.substring(0, 3).trim() + '(' + cmd.cmd.substring(3).trim() + '){');
				} else {
					switch (cmd.cmd) {
						case 'else':
							builder.push('}else{');
							break;
						case 'end':
							builder.push('}}');
							break;
						case 'fi':
							builder.push('}');
							break;
						case 'break':
							builder.push('break;');
							break;
						case 'continue':
							builder.push('continue;');
							break;
					}
				}

			} else {
				if (cmd.helpers) {
					var str = '';
					for (var j = 0; j < cmd.helpers.length; j++) {
						var helper = cmd.helpers[j];
						if (j === 0)
							str = helper.replace('\7', cmd.cmd.trim()).trim();
						else
							str = helper.replace('\7', str.trim());
					}
					builder.push('$tmp=' + str + ';if($tmp!=null)$output+=$tmp;');
				} else
					builder.push('if(' + cmd.cmd + '!=null)$output+=' + cmd.cmd + ';');
			}
		}

		builder.push((length ? ('$output+=$text[' + length + '];') : '') + 'return $output;');

		delete self.variables.$;
		var variables = Object.keys(self.variables);
		var names = ['$ || {}', 'model'];

		for (var i = 0; i < variables.length; i++)
			names.push('model.' + variables[i]);

		var code = 'var tangular=function($,model' + (variables.length ? (',' + variables.join(',')) : '') + '){' + builder.join('') + '};return function(model,$){return tangular(' + names.join(',') + ');}';
		return (new Function('$text', code))(self.builder);
	};

	return Template	;

});
define('skylark-tangular/compile',[
	"./tangular",
	"./Template"
],function(tangular,Template){

	return tangular.compile = function(template) {
		return new Template().compile(template);
	};

});
define('skylark-tangular/helpers',[
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
define('skylark-tangular/register',[
	"./tangular",
	"./helpers"
],function(tangular,helpers){

	return tangular.register = function(name, fn) {
		helpers[name] = fn;
		return this;
	};
});
define('skylark-tangular/render',[
	"./tangular",
	"./Template"
],function(tangular,Template){

	return tangular.render = function(template, model, repository) {
		if (model == null)
			model = {};
		return new Template().compile(template)(model, repository);
	};

});
define('skylark-tangular/globals',[
	"./tangular",
	"./helpers"
],function(tangular){
	var W = window;
	W.Ta = W.Tangular = tangular;
	W.Thelpers = tangular.helpers;
	return W;
});
define('skylark-tangular/main',[
	"./tangular",
	"./compile",
	"./helpers",
	"./register",
	"./render",
	"./Template",
	"./globals"
],function(tangular){

	return tangular;
});
define('skylark-tangular', ['skylark-tangular/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-tangular.js.map
