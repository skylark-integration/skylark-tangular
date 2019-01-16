/**
 * skylark-tangular - A version of tangular.js that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-tangular/
 * @license MIT
 */
define(["./tangular"],function(n){var e={},r=/[<>&"]/g;return e.$execute=function(n,r,t,u,c,a,l,o,i,s){return null==e[r]?(console&&console.warn("Tangular: missing helper",'"'+r+'"'),t):e[r].call(n,t,u,c,a,l,o,i,s)},e.encode=function(n){return null==n?"":n.toString().replace(r,function(n){switch(n){case"&":return"&amp;";case"<":return"&lt;";case">":return"&gt;";case'"':return"&quot;"}return n})},e.raw=function(n){return n},n.helpers=e});
//# sourceMappingURL=sourcemaps/helpers.js.map
