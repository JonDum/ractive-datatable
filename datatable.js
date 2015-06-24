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

	
	__webpack_require__(3);

	var sortBy = __webpack_require__(2);

	var DataTable = Ractive.extend({

	    template: __webpack_require__(5),

	    data: {

	        filter: '',

	        perpage: 30,

	        page: 1,

	        editable: true,

	        sortable: true,

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

	        highlight: function(text) {

	            var self = this;
	            var filter = self.get('filter');

	            if(!filter || !text)
	                return text;

	            text = String(text);

	            if(text.indexOf(filter) > -1) {
	                return text.split(filter).join('<span class="highlight">' + filter + '</span>');
	            }

	            return text;
	        },

	    },

	    computed: {

	        rows: function() {
	            
	            var page = this.get('page') - 1;
	            var data = this.get('_data');
	            var perpage = this.get('perpage');
	            var total = this.get('total');

	            return data.slice(page * perpage, Math.min(page * perpage + perpage, total));

	        },

	        // `data` set publicly
	        // `_data` is internal, includes any filters, sorted
	        _data: function() {

	            var self = this;
	            var data = self.get('data');

	            var filter = self.get('filter');

	            if(filter && filter.length > 0) {
	                var re = new RegExp(filter, 'i');
	                data = data.filter(function(d) {
	                    for(var p in d)
	                        if(d.hasOwnProperty(p) && re.test(d[p]))
	                            return true;
	                });
	            }

	            var sortOn = self.get('sortOn');
	            var sortMode = self.get('sortMode');

	            if(sortOn) {
	                data = data.slice().sort(sortBy(sortOn, (sortMode == 'desc')));
	            }

	            return data;
	        },

	        total: function() {
	            var data = this.get('_data');
	            return data ? this.get('_data').length : 0;
	        },

	        //internal -- `columns` without underscore is the public prop
	        _columns: function() {

	            var self = this;

	            var data = self.get('_data'),
	                columns = self.get('columns'),
	                order = self.get('order');

	            if(columns)
	                return columns;

	            var _columns = data && data[0] ? Object.keys(self.get('_data')[0]) : [];

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

	        var self = this;
	        // autofocus editing inputs
	        self.observe('editing', function(value) {
	            if(value) {
	                var node = self.find('td input');
	                if(node)
	                    node.focus();
	            }
	        }, {
	            defer: true
	        });

	        // reset page when perpage changes
	        self.observe('perpage filter', function() {
	            self.set('page', 1);
	        });

	    },

	    fieldedited: function() {

	        var self = this;
	        var event = this.event,
	            e = event.original;

	        if(e.type == 'keyup' && e.keyCode !== 13)
	            return false;

	        var index = event.index.i + (self.get('page') - 1) * self.get('perpage');
	        var row = self.get('_data.' + index);
	        var field = event.context;

	        // don't duplicate
	        if(event.node.value !== row[field]) {

	            // get the real position of index
	            index = self.get('data').indexOf(row);
	            
	            var keypath = 'data.' + index + '.' + field;

	            self.set(keypath, event.node.value);

	            self.fire('edit', row, field);

	        }

	        self.set('editing', null);

	    },

	    setSort: function(column) {

	        var self = this;

	        if(!column || !self.get('sortable'))
	            return

	        var sortMode = self.get('sortMode');
	        var sortOn = self.get('sortOn');
	        
	        // toggle sortMode
	        if(sortOn == column || !sortMode) {

	            if(sortMode == 'asc')
	                self.set('sortMode', 'desc')
	            else
	                self.set('sortMode', 'asc');

	        }

	        self.set('sortOn', column);
	    },

	    previousPage: function() {
	        this.set('page', Math.max(this.get('page') - 1, 1));
	    },

	    nextPage: function() {
	        this.set('page', Math.min(this.get('page') + 1, this.get('lastPage')));
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

	/**
	 * @description 
	 * Returns a function which will sort an
	 * array of objects by the given key.
	 * 
	 * @param  {String}  key
	 * @param  {Boolean} reverse
	 * @return {Function}     
	 */
	function sortBy(key, reverse) {

	  // Move smaller items towards the front
	  // or back of the array depending on if
	  // we want to sort the array in reverse
	  // order or not.
	  var moveSmaller = reverse ? 1 : -1;

	  // Move larger items towards the front
	  // or back of the array depending on if
	  // we want to sort the array in reverse
	  // order or not.
	  var moveLarger = reverse ? -1 : 1;

	  /**
	   * @param  {*} a
	   * @param  {*} b
	   * @return {Number}
	   */
	  return function(a, b) {
	    if (a[key] < b[key]) {
	      return moveSmaller;
	    }
	    if (a[key] > b[key]) {
	      return moveLarger;
	    }
	    return 0;
	  };

	}

	module.exports = sortBy;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(4);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
	if(content.placeholders) module.exports = content.placeholders;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.placeholders) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/stylus-loader/index.js!./styles.styl", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/stylus-loader/index.js!./styles.styl");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(7)();
	exports.push([module.id, ".ractive-datatable {\n  display: block;\n  max-width: 100%;\n}\n.ractive-datatable .scroll {\n  overflow: scroll;\n}\n.ractive-datatable table {\n  border-collapse: collapse;\n  border-spacing: 0;\n  width: 100%;\n}\n.ractive-datatable tbody {\n  border: 0px solid rgba(0,0,0,0.25);\n  border-bottom-width: 1px;\n  border-top-width: 1px;\n}\n.ractive-datatable thead.sortable th {\n  cursor: pointer;\n}\n.ractive-datatable th {\n  padding: 0.5em 1em;\n  font-size: 1.2em;\n  text-align: left;\n  white-space: nowrap;\n}\n.ractive-datatable th.sort:after {\n  content: '';\n  border: 5px solid transparent;\n  display: inline-block;\n  margin-left: 5px;\n}\n.ractive-datatable th.sort.desc:after {\n  border-top-color: currentColor;\n}\n.ractive-datatable th.sort.asc:after {\n  border-bottom-color: currentColor;\n  position: relative;\n  top: -5px;\n}\n.ractive-datatable td {\n  text-align: left;\n  padding: 0.5em 1em;\n  white-space: nowrap;\n}\n.ractive-datatable td.editing {\n  padding: 0;\n}\n.ractive-datatable td.editing input {\n  padding: 0.5em 1em;\n  background: none;\n  border: none;\n  outline: none;\n  width: 100%;\n  font-size: 1em;\n  border-bottom: 1px dotted #333;\n}\n.ractive-datatable .highlight {\n  background: linear-gradient(rgba(107,206,255,0.5), rgba(0,146,219,0.5));\n  color: rgba(0,0,0,0.9);\n  border-radius: 3px;\n  box-shadow: 0 1px rgba(255,255,255,0.5) inset;\n  border: 1px solid #0092db;\n}\n.ractive-datatable tr {\n  background: #fff;\n}\n.ractive-datatable tr:nth-child(even) {\n  background: #fafafa;\n}\n.ractive-datatable tr + tr {\n  border-top: 1px solid #ddd;\n}\n.ractive-datatable tr:hover td {\n  background: rgba(0,0,0,0.05);\n}\n.ractive-datatable > div {\n  margin-top: 5px;\n}\n.ractive-datatable .pagination {\n  float: right;\n  user-select: none;\n}\n.ractive-datatable .pagination .disabled {\n  opacity: 0.15;\n  cursor: default;\n  user-select: none;\n}\n.ractive-datatable .pagination a {\n  display: inline-block;\n  cursor: pointer;\n}\n.ractive-datatable .pages a {\n  width: 2em;\n  text-align: center;\n}\n.ractive-datatable .pages a.active {\n  font-weight: bold;\n  text-decoration: underline;\n}\n", ""]);

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":"ractive-datatable"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"scroll"},"f":[{"t":7,"e":"table","f":[{"t":7,"e":"thead","a":{"class":[{"t":2,"x":{"r":["sortable"],"s":"_0?\"sortable\":\"\""}}]},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"th","a":{"class":[{"t":4,"f":["sort ",{"t":2,"r":"sortMode"}],"n":50,"x":{"r":["sortOn","."],"s":"_0==_1"}}]},"v":{"click":{"m":"setSort","a":{"r":["."],"s":"[_0]"}}},"f":[{"t":2,"r":"."}]}],"n":50,"x":{"r":["can","."],"s":"_0(\"display\",_1)"}}],"r":"_columns"}]}," ",{"t":7,"e":"tbody","f":[{"t":4,"f":[{"t":7,"e":"tr","f":[{"t":4,"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"td","a":{"class":"editing"},"f":[{"t":7,"e":"input","a":{"value":[{"t":2,"rx":{"r":"rows","m":[{"t":30,"n":"i"},{"t":30,"n":"."}]}}],"twoway":"false"},"v":{"blur-keyup":{"m":"fieldedited","a":{"r":[],"s":"[]"}}}}]}],"n":50,"x":{"r":["editable","can","editing","i","."],"s":"_0&&_1(\"edit\",_4)&&_2==_3+_4"}},{"t":4,"n":51,"f":[{"t":7,"e":"td","v":{"dblclick":{"m":"set","a":{"r":["i","."],"s":"[\"editing\",_0+_1]"}}},"f":[{"t":3,"x":{"r":["highlight",".","i","rows"],"s":"_3[_2]?_0(_3[_2][_1]):\"\""}}]}],"x":{"r":["editable","can","editing","i","."],"s":"_0&&_1(\"edit\",_4)&&_2==_3+_4"}}],"n":50,"x":{"r":["can","."],"s":"_0(\"display\",_1)"}}],"r":"_columns"}]}],"i":"i","r":"rows"}]}]}]}," ",{"t":7,"e":"div","f":["Displaying ",{"t":2,"r":"current"}," of ",{"t":2,"r":"total"}," ",{"t":4,"f":[{"t":7,"e":"span","a":{"class":"pagination"},"f":[{"t":4,"f":[{"t":7,"e":"span","a":{"class":"disabled"},"f":["Previous"]}],"n":50,"r":"onFirstPage"},{"t":4,"n":51,"f":[{"t":7,"e":"a","v":{"click":{"m":"previousPage","a":{"r":[],"s":"[]"}}},"f":["Previous"]}],"r":"onFirstPage"}," ",{"t":7,"e":"span","a":{"class":"pages"},"f":[{"t":4,"f":[{"t":7,"e":"a","v":{"click":{"m":"gotoPage","a":{"r":["."],"s":"[_0]"}}},"a":{"class":[{"t":2,"x":{"r":["page","."],"s":"_0==_1?\"active\":\"\""}}]},"f":[{"t":2,"r":"."}]}],"r":"pages"}]}," ",{"t":4,"f":[{"t":7,"e":"span","a":{"class":"disabled"},"f":["Next"]}],"n":50,"r":"onLastPage"},{"t":4,"n":51,"f":[{"t":7,"e":"a","v":{"click":{"m":"nextPage","a":{"r":[],"s":"[]"}}},"f":["Next"]}],"r":"onLastPage"}]}],"n":50,"r":"pages"}]}],"n":50,"r":"data"},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"no-data"},"f":["No data"]}],"r":"data"}]}]};

/***/ },
/* 6 */
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

	function createLinkElement() {
		var linkElement = document.createElement("link");
		var head = getHeadElement();
		linkElement.rel = "stylesheet";
		head.appendChild(linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement();
			update = updateLink.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function() {
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

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
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

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(JSON.stringify(sourceMap)) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 7 */
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