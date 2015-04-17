(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["datatable"] = factory();
	else
		root["datatable"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(2);

	var DataTable = Ractive.extend({

	    template: __webpack_require__(4),

	    data: {

	        filter: '',

	        perpage: 30,

	        page: 1,

	        editable: true,

	        /**
	         *
	         * @name columns
	         * @type Array
	         * @default undefined
	         *
	         * Determines the ordering of the columns. If falsey, columns are extracted by
	         * the first object in the data array.
	         *
	         * Omitting a column here will also have the effect of it not being displayed (same as 
	         * setting config[columnName].display = false);
	         *
	         */
	        columns: null,

	        /**
	         *
	         * @name config
	         * @type Object
	         * @default undefined
	         *
	         * Used to change functionaliy of specific columns
	         *
	         * Falsey => Display all fields (default)
	         *
	         * Object => Configure which fields to display/hide/make editable
	         *
	         * i.e. {
	         *       name: {edit: true, display: true},  <-- redundant since this is the default
	         *       created: {edit: false}, <--- still displayed, but can't edit
	         *       id: {display: false}, <--- can't edit what isn't there
	         *      }
	         */
	        config: null,

	        can: function(action, field) {

	            var config = this.get('config');

	            if(!config)
	                return true;

	            if(typeof config[field] === 'undefined')
	                return true

	            if(config[field] && typeof config[field][action] === 'undefined')
	                return true;

	            return config[field][action];
	        },


	    },

	    computed: {

	        rows: function() {
	            //TODO use this for pagination
	            
	            var page = this.get('page') - 1 ;
	            var data = this.get('_data');
	            var perpage = this.get('perpage');
	            var total = this.get('total');

	            return data.slice(page * perpage, Math.min(page * perpage + perpage, total));

	        },

	        // `data` set publicly
	        // `_data` is internal, includes any filters
	        _data: function() {

	            var data = this.get('data');

	            var filter = this.get('filter');
	            if(filter && filter.length > 0) {
	                var re = new RegExp(filter, 'i');
	                return data.filter(function(d) {
	                    for(var p in d)
	                        if(d.hasOwnProperty(p) && re.test(d[p]))
	                            return true;
	                });
	            }

	            return data;
	        },

	        total: function() {
	            var data = this.get('_data');
	            return data ? this.get('_data').length : 0;
	        },

	        //internal -- `columns` without underscore is the public prop
	        _columns: function() {

	            var data = this.get('_data'),
	                columns = this.get('columns'),
	                order = this.get('order');

	            if(columns)
	                return columns;

	            var _columns = data && data[0] ? Object.keys(this.get('_data')[0]) : [];

	            return _columns;
	        },

	        current: function() {
	            var page = this.get('page');
	            var perpage = this.get('perpage');
	            var total = this.get('total');
	            var ppp = (page - 1) * perpage;
	            return (page == 1 ? 1 : ppp) + '-' + Math.min(ppp + perpage, total)
	        },

	        pages: function() {

	            var total = this.get('total');
	            var page = this.get('page');
	            var perpage = this.get('perpage');

	            var onFirstPage = this.get('onFirstPage');
	            var lastPage = this.get('lastPage');

	            if(perpage > total)
	                return null;

	            var ret = [];

	            var n = Math.min(lastPage, 7);
	            var p = page > lastPage - 4 ? lastPage - n : Math.max(page - 4, 0);
	            var c = p + n;
	            while(p++ < c)
	                ret.push(p);

	            //first page
	            if(page > n) {
	                ret[0] = 1;
	            }

	            // last page
	            if(p < lastPage - 4)
	                ret[ret.length - 1] = lastPage;

	            return ret;
	        }, 

	        lastPage: function() {

	            var total = this.get('total');
	            var perpage = this.get('perpage');

	            return Math.ceil(total / perpage);
	        },

	        onFirstPage: function() {
	            return this.get('page') == 1;
	        },


	        onLastPage: function() {

	            var page = this.get('page');
	            var lastPage = this.get('lastPage');

	            return page == lastPage;
	        },

	    },

	    oninit: function() {

	        // autofocus editing inputs
	        this.observe('editing', function(value) {
	            if(value) {
	                var node = this.find('td input');
	                if(node)
	                    node.focus();
	            }
	        }, {
	            defer: true
	        });

	        // reset page when perpage changes
	        this.observe('perpage', function() {
	            this.set('page', 1);
	        });

	    },

	    fieldedited: function() {
	        var event = this.event,
	            e = event.original;

	        if(e.type == 'keyup' && e.keyCode !== 13)
	            return false;

	        var index = event.index.i;
	        var row = this.get('data.' + index);
	        var field = event.context;

	        // don't duplicate
	        if(event.node.value !== row[field]) {
	            var keypath = 'data.' + index + '.' + field;
	            this.set(keypath, event.node.value);

	            this.fire('edit', row, field);
	        }

	        this.set('editing', null);

	    },


	    previousPage: function() {
	        this.set('page', this.get('page') - 1);
	    },

	    nextPage: function() {
	        this.set('page', this.get('page') + 1);
	    },

	    gotoPage: function(page)
	    {
	        this.set('page', page);
	    }



	});

	module.exports = DataTable;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(3);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		module.hot.accept("!!/Users/JD/Dropbox/Creative/Projects/J2/stackhub/stackhub-webapp/src/main/webapp/node_modules/ractive-datatable/node_modules/css-loader/index.js!/Users/JD/Dropbox/Creative/Projects/J2/stackhub/stackhub-webapp/src/main/webapp/node_modules/ractive-datatable/node_modules/stylus-loader/index.js!/Users/JD/Dropbox/Creative/Projects/J2/stackhub/stackhub-webapp/src/main/webapp/node_modules/ractive-datatable/src/styles.styl", function() {
			var newContent = require("!!/Users/JD/Dropbox/Creative/Projects/J2/stackhub/stackhub-webapp/src/main/webapp/node_modules/ractive-datatable/node_modules/css-loader/index.js!/Users/JD/Dropbox/Creative/Projects/J2/stackhub/stackhub-webapp/src/main/webapp/node_modules/ractive-datatable/node_modules/stylus-loader/index.js!/Users/JD/Dropbox/Creative/Projects/J2/stackhub/stackhub-webapp/src/main/webapp/node_modules/ractive-datatable/src/styles.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	exports.push([module.id, ".ractive-datatable {\n  display: block;\n  max-width: 100%;\n  overflow: scroll;\n}\n.ractive-datatable table {\n  border-collapse: collapse;\n  border-spacing: 0;\n}\n.ractive-datatable tbody {\n  border: 0px solid rgba(0,0,0,0.25);\n  border-bottom-width: 1px;\n  border-top-width: 1px;\n}\n.ractive-datatable th {\n  padding: 0.5em 1em;\n  font-size: 1.2em;\n  text-align: left;\n  white-space: nowrap;\n}\n.ractive-datatable td {\n  text-align: left;\n  padding: 0.5em 1em;\n  white-space: nowrap;\n}\n.ractive-datatable td.editing {\n  padding: 0;\n}\n.ractive-datatable td.editing input {\n  padding: 0.5em 1em;\n  background: none;\n  border: none;\n  outline: none;\n  width: 100%;\n  font-size: 1em;\n  border-bottom: 1px dotted #333;\n}\n.ractive-datatable tr {\n  background: #fff;\n}\n.ractive-datatable tr:nth-child(even) {\n  background: #fafafa;\n}\n.ractive-datatable tr + tr {\n  border-top: 1px solid #ddd;\n}\n.ractive-datatable tr:hover td {\n  background: rgba(0,0,0,0.05);\n}\n.ractive-datatable > div {\n  margin-top: 5px;\n}\n.ractive-datatable .pagination {\n  float: right;\n  user-select: none;\n}\n.ractive-datatable .pagination .disabled {\n  opacity: 0.15;\n  cursor: default;\n  user-select: none;\n}\n.ractive-datatable .pagination a {\n  display: inline-block;\n  cursor: pointer;\n}\n.ractive-datatable .pages a {\n  width: 2em;\n  text-align: center;\n}\n.ractive-datatable .pages a.active {\n  font-weight: bold;\n  text-decoration: underline;\n}\n", ""]);

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":"ractive-datatable"},"f":[{"t":4,"f":[{"t":7,"e":"table","f":[{"t":7,"e":"thead","f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"th","f":[{"t":2,"r":"."}]}],"n":50,"x":{"r":["can","."],"s":"_0(\"display\",_1)"}}],"r":"_columns"}]}," ",{"t":7,"e":"tbody","f":[{"t":4,"f":[{"t":7,"e":"tr","f":[{"t":4,"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"td","a":{"class":"editing"},"f":[{"t":7,"e":"input","a":{"value":[{"t":2,"rx":{"r":"rows","m":[{"t":30,"n":"i"},{"t":30,"n":"."}]}}],"twoway":"false"},"v":{"blur-keyup":{"m":"fieldedited","a":{"r":[],"s":"[]"}}}}]}],"n":50,"x":{"r":["editable","can","editing","i","."],"s":"_0&&_1(\"edit\",_4)&&_2==_3+_4"}},{"t":4,"n":51,"f":[{"t":7,"e":"td","v":{"dblclick":{"m":"set","a":{"r":["i","."],"s":"[\"editing\",_0+_1]"}}},"f":[{"t":2,"rx":{"r":"rows","m":[{"t":30,"n":"i"},{"t":30,"n":"."}]}}]}],"x":{"r":["editable","can","editing","i","."],"s":"_0&&_1(\"edit\",_4)&&_2==_3+_4"}}],"n":50,"x":{"r":["can","."],"s":"_0(\"display\",_1)"}}],"r":"_columns"}]}],"i":"i","r":"rows"}]}]}," ",{"t":7,"e":"div","f":["Displaying ",{"t":2,"r":"current"}," of ",{"t":2,"r":"total"}," ",{"t":4,"f":[{"t":7,"e":"span","a":{"class":"pagination"},"f":[{"t":4,"f":[{"t":7,"e":"span","a":{"class":"disabled"},"f":["Previous"]}],"n":50,"r":"onFirstPage"},{"t":4,"n":51,"f":[{"t":7,"e":"a","v":{"click":{"m":"previousPage","a":{"r":[],"s":"[]"}}},"f":["Previous"]}],"r":"onFirstPage"}," ",{"t":7,"e":"span","a":{"class":"pages"},"f":[{"t":4,"f":[{"t":7,"e":"a","v":{"click":{"m":"gotoPage","a":{"r":["."],"s":"[_0]"}}},"a":{"class":[{"t":2,"x":{"r":["page","."],"s":"_0==_1?\"active\":\"\""}}]},"f":[{"t":2,"r":"."}]}],"r":"pages"}]}," ",{"t":4,"f":[{"t":7,"e":"span","a":{"class":"disabled"},"f":["Next"]}],"n":50,"r":"onLastPage"},{"t":4,"n":51,"f":[{"t":7,"e":"a","v":{"click":{"m":"nextPage","a":{"r":[],"s":"[]"}}},"f":["Next"]}],"r":"onLastPage"}]}],"n":50,"r":"pages"}]}],"n":50,"r":"data"},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"no-data"},"f":["No data"]}],"r":"data"}]}]};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function () {
				styleElement.parentNode.removeChild(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	function replaceText(source, id, replacement) {
		var boundaries = ["/** >>" + id + " **/", "/** " + id + "<< **/"];
		var start = source.lastIndexOf(boundaries[0]);
		var wrappedReplacement = replacement
			? (boundaries[0] + replacement + boundaries[1])
			: "";
		if (source.lastIndexOf(boundaries[0]) >= 0) {
			var end = source.lastIndexOf(boundaries[1]) + boundaries[1].length;
			return source.slice(0, start) + wrappedReplacement + source.slice(end);
		} else {
			return source + wrappedReplacement;
		}
	}

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(styleElement.styleSheet.cssText, index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap && typeof btoa === "function") {
			try {
				css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(JSON.stringify(sourceMap)) + " */";
				css = "@import url(\"data:text/css;base64," + btoa(css) + "\")";
			} catch(e) {}
		}

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	// 
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(var i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ }
/******/ ])
});
;