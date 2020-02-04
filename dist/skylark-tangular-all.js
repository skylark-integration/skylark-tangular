/**
 * skylark-tangular - A version of tangular.js that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-tangular/
 * @license MIT
 */
!function(e,r){var n=r.define,require=r.require,t="function"==typeof n&&n.amd,a=!t&&"undefined"!=typeof exports;if(!t&&!n){var l={};n=r.define=function(e,r,n){"function"==typeof n?(l[e]={factory:n,deps:r.map(function(r){return function(e,r){if("."!==e[0])return e;var n=r.split("/"),t=e.split("/");n.pop();for(var a=0;a<t.length;a++)"."!=t[a]&&(".."==t[a]?n.pop():n.push(t[a]));return n.join("/")}(r,e)}),resolved:!1,exports:null},require(e)):l[e]={factory:null,resolved:!0,exports:n}},require=r.require=function(e){if(!l.hasOwnProperty(e))throw new Error("Module "+e+" has not been defined");var module=l[e];if(!module.resolved){var n=[];module.deps.forEach(function(e){n.push(require(e))}),module.exports=module.factory.apply(r,n)||null,module.resolved=!0}return module.exports}}if(!n)throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");if(function(e,require){e("skylark-langx-ns/_attach",[],function(){return function(e,r,n){"string"==typeof r&&(r=r.split("."));for(var t=r.length,a=e,l=0,s=r[l++];l<t;)a=a[s]=a[s]||{},s=r[l++];return a[s]=n}}),e("skylark-langx-ns/ns",["./_attach"],function(e){var r={attach:function(n,t){return e(r,n,t)}};return r}),e("skylark-langx-ns/main",["./ns"],function(e){return e}),e("skylark-langx-ns",["skylark-langx-ns/main"],function(e){return e}),e("skylark-langx/skylark",["skylark-langx-ns"],function(e){return e}),e("skylark-tangular/tangular",["skylark-langx/skylark"],function(e){var r=e.totaljs=e.totaljs||{},n=r.tangular={};n.helpers={};return n.version="v3.0.1",n.cache={},n.debug=!1,n.toArray=function(e){for(var r=Object.keys(e),n=[],t=0,a=r.length;t<a;t++)n.push({key:r[t],value:e[r[t]]});return n},n}),e("skylark-tangular/Template",["./tangular"],function(e){var r={null:!0,undefined:!0,true:!0,false:!0},n=/&&|\|\|/,t=/[a-z0-9._]+/gi,a=/^[a-z0-9_$]+/i,l=/^[0-9]/,s=/'.*?'|".?"/g,i=/\{\{.*?\}\}/g,u=/\{\{|\}\}/g,o=/\n$/g;function c(){this.commands,this.variables,this.builder,this.split="\0"}return c.prototype.compile=function(e){var n,t=this,l=0,s=0,c=[];t.variables={},t.commands=[],t.builder=e.replace(i,function(e){var i,o=e.replace(u,"").trim(),f=null,p=null,g=!1,h=!1,d=!0;if("fi"===o)l--;else if("end"===o)s--,c.pop();else if("if "===o.substring(0,3)){if(l++,(f=t.parseVariables(o.substring(3),c)).length)for(var m=0;m<f.length;m++){var v=f[m];t.variables[v]?t.variables[v]++:t.variables[v]=1}else f=null;g=!0,d=!0}else if("foreach "===o.substring(0,8))s++,n=o.substring(8).split(" "),c.push(n[0].trim()),-1!==(i=n[2].indexOf("."))&&(n[2]=n[2].substring(0,i)),f=n[2].trim(),-1===c.indexOf(f)?(t.variables[f]?t.variables[f]++:t.variables[f]=1,f=[f]):f=null,h=!0;else if("else if "===o.substring(0,8)){if((f=t.parseVariables(o.substring(8),c)).length)for(var m=0;m<f.length;m++){var v=f[m];t.variables[v]?t.variables[v]++:t.variables[v]=1}else f=null;g=!0}else if("continue"!==o&&"break"!==o&&"else"!==o){if((f=o?o.match(a):null)&&(f=f.toString()),f&&r[f]&&(f=null),f&&-1===c.indexOf(f)?(t.variables[f]?t.variables[f]++:t.variables[f]=1,f=[f]):f=null,-1===o.indexOf("|")&&(o+=" | encode"),p=o.split("|"),o=p[0],(p=p.slice(1)).length)for(var m=0;m<p.length;m++){var k=p[m].trim();i=k.indexOf("("),k=-1===i?"Thelpers.$execute(model,'"+k+"',)":"Thelpers.$execute(model,'"+k.substring(0,i)+"',,"+k.substring(i+1),p[m]=k}else p=null;o=t.safe(o.trim()||"model"),d=!1}return t.commands.push({index:t.commands.length,cmd:o,ifcount:l,loopcount:s,variable:f,helpers:p,isloop:h,isif:g,iscode:d}),t.split}).split(t.split);for(var f=0,p=t.builder.length;f<p;f++)t.builder[f]=t.builder[f].replace(o,"");return t.make()},c.prototype.parseVariables=function(e,a){for(var i=[],u=e.split(n),o=0,c=u.length;o<c;o++)for(var f=u[o].replace(s,""),p=f.match(t),g=0;g<p.length;g++)!(f=(f=p[g]).split(".")[0])||l.test(f)||r[f]||-1===i.indexOf(f)&&-1===a.indexOf(f)&&i.push(f);return i},c.prototype.safe=function(e){for(var r=e.split("."),n=[],t=1;t<r.length;t++){var a=r.slice(0,t).join(".");n.push(a+"==null?'':")}return n.join("")+r.join(".")},c.prototype.make=function(){for(var e=["var $output=$text[0];var $tmp;var $index=0;"],r=0,n=this.commands.length;r<n;r++){var t,a=this.commands[r];if(r&&e.push("$output+=$text["+r+"];"),a.iscode)if(a.isloop){var l="$i"+Math.random().toString(16).substring(3,6),s=l+"a";t=a.cmd.substring(a.cmd.lastIndexOf(" in ")+4).trim(),t=s+"="+this.safe(t)+";if(!("+s+" instanceof Array)){if("+s+"&&typeof("+s+")==='object')"+s+"=Tangular.toArray("+s+")}if("+s+" instanceof Array&&"+s+".length){for(var "+l+"=0,"+l+"l="+s+".length;"+l+"<"+l+"l;"+l+"++){$index="+l+";var "+a.cmd.split(" ")[1]+"="+s+"["+l+"];",e.push(t)}else if(a.isif)"else if "===a.cmd.substring(0,8)?e.push("}"+a.cmd.substring(0,8).trim()+"("+a.cmd.substring(8).trim()+"){"):e.push(a.cmd.substring(0,3).trim()+"("+a.cmd.substring(3).trim()+"){");else switch(a.cmd){case"else":e.push("}else{");break;case"end":e.push("}}");break;case"fi":e.push("}");break;case"break":e.push("break;");break;case"continue":e.push("continue;")}else if(a.helpers){for(var i="",u=0;u<a.helpers.length;u++){var o=a.helpers[u];i=0===u?o.replace("",a.cmd.trim()).trim():o.replace("",i.trim())}e.push("$tmp="+i+";if($tmp!=null)$output+=$tmp;")}else e.push("if("+a.cmd+"!=null)$output+="+a.cmd+";")}e.push((n?"$output+=$text["+n+"];":"")+"return $output;"),delete this.variables.$;for(var c=Object.keys(this.variables),f=["$ || {}","model"],r=0;r<c.length;r++)f.push("model."+c[r]);var p="var tangular=function($,model"+(c.length?","+c.join(","):"")+"){"+e.join("")+"};return function(model,$){return tangular("+f.join(",")+");}";return new Function("$text",p)(this.builder)},c}),e("skylark-tangular/compile",["./tangular","./Template"],function(e,r){return e.compile=function(e){return(new r).compile(e)}}),e("skylark-tangular/helpers",["./tangular"],function(e){var r={},n=/[<>&"]/g;return r.$execute=function(e,n,t,a,l,s,i,u,o,c){return null==r[n]?(console&&console.warn("Tangular: missing helper",'"'+n+'"'),t):r[n].call(e,t,a,l,s,i,u,o,c)},r.encode=function(e){return null==e?"":e.toString().replace(n,function(e){switch(e){case"&":return"&amp;";case"<":return"&lt;";case">":return"&gt;";case'"':return"&quot;"}return e})},r.raw=function(e){return e},e.helpers=r}),e("skylark-tangular/register",["./tangular","./helpers"],function(e,r){return e.register=function(e,n){return r[e]=n,this}}),e("skylark-tangular/render",["./tangular","./Template"],function(e,r){return e.render=function(e,n,t){return null==n&&(n={}),(new r).compile(e)(n,t)}}),e("skylark-tangular/globals",["./tangular","./helpers"],function(e){var r=window;return r.Ta=r.Tangular=e,r.Thelpers=e.helpers,r}),e("skylark-tangular/main",["./tangular","./compile","./helpers","./register","./render","./Template","./globals"],function(e){return e}),e("skylark-tangular",["skylark-tangular/main"],function(e){return e})}(n),!t){var s=require("skylark-langx/skylark");a?module.exports=s:r.skylarkjs=s}}(0,this);
//# sourceMappingURL=sourcemaps/skylark-tangular-all.js.map
