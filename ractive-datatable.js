(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["RactiveDatatable"] = factory();
	else
		root["RactiveDatatable"] = factory();
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

	var sortBy = __webpack_require__(6);
	var uniq = __webpack_require__(7);
	var isUndefined = __webpack_require__(56);
	var isObject= __webpack_require__(18);
	var isNumber = __webpack_require__(57);

	var DataTable = Ractive.extend({

	    template: __webpack_require__(59),

	    data: function() {
	        return {

	            filter: '',

	            perpage: 30,

	            page: 1,

	            editable: true,

	            sortable: true,

	            sortOn: '',

	            _selection: [],

	            selectionMode: '', // "row" or "cell"


	            /**
	             * @name dynamicColumns
	             * @type Boolean
	             * @default true
	             * If `true`, searches the entire `data` array looking for columns. If you have a large number of rows this should be turned off.
	             * If `false`, columns must be explicitly provided through the `columns` property.
	             */
	            dynamicColumns: true,

	            /**
	             *
	             * @name columns
	             * @type Object
	             * @default null
	             *
	             * Determines the ordering of the columns and configuration for specific columns.
	             *
	             * Each key on this object refers to column names. Configurable properties are `edit`,
	             * `display` & `order`. Keys and column names are case-sensitive.
	             *
	             * Example: 
	             *
	             *  ```
	             *  columns: {
	             *      'name': {order: 0}, // `order` "bumps" the column, lowest value is left most. 
	             *      'created': {edit: false},
	             *      'id': {edit: false},
	             *      'hiddenField': {display: false},
	             *      'anotherHidden': false, //shorthand for { display: false }
	             *      'someOtherColumn': {order: 3},
	             *  }
	             *  ```
	             *
	             *  If `dynamicColumns` is `false`, only columns configured here will display.
	             *
	             */
	            columns: null,

	            can: function(action, field) {

	                var config = this.get('columns');

	                if(!config)
	                    return true;

	                if(isUndefined(config[field]))
	                    return true

	                if(config[field] && isUndefined(config[field][action]))
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

	            cellFor: function(column) {

	                if(this.partials[column])
	                    return column;
	                
	                return '__default__';

	            },

	        }
	    },

	    computed: {


	        // `data` set publicly
	        // `_data` is internal, includes any filters, sorted
	        _data: function() {

	            var self = this;

	            var data = self.get('data');

	            var filter = self.get('filter');

	            var sortOn = self.get('sortOn');
	            var sortMode = self.get('sortMode');

	            if(filter && filter.length > 0) {
	                var re = new RegExp(filter, 'i');
	                data = data.filter(function(d) {
	                    for(var p in d)
	                        if(d.hasOwnProperty(p) && re.test(d[p]))
	                            return true;
	                });
	            }

	            if(sortOn) {
	                data = data.slice().sort(sortBy(sortOn, (sortMode == 'desc')));
	            }

	            return data
	                   .map(function(v, i) {
	                       return {item: v, index: i};
	                   });
	        },

	        rows: function() {

	            var self = this;

	            var page = self.get('page') - 1;
	            var _data = self.get('_data');
	            var perpage = self.get('perpage');
	            var total = self.get('total');

	            // the original data, unfiltered
	            var data = self.get('data');

	            return _data.slice(page * perpage, Math.min(page * perpage + perpage, total));
	        },

	        cols: function() {

	            var self = this;

	            var data = self.get('data'); //use data instead of _data
	            var config = self.get('columns');
	            var dynamicColumns = self.get('dynamicColumns');

	            var _columns = [];

	            if(dynamicColumns) {

	                data.forEach( function(row) {
	                    Object.keys(row).forEach(function(key) {
	                        if(_columns.indexOf(key) === -1)
	                            _columns.push(key);
	                    });
	                });

	            } else {

	                _columns = Object.keys(config);
	            }


	            if(isObject(config)) { 

	                var order = [];

	                _columns = _columns.filter( function(col) {

	                    var colConfig = config[col];

	                    if( isUndefined(colConfig) || colConfig === true )
	                        return true;

	                    // if display is undefined we still want to show the col
	                    if( colConfig.display === false )
	                        return;

	                    if( !isUndefined(colConfig.order) && isNumber(colConfig.order) ) {
	                        order.splice(colConfig.order, 0, col);
	                        return;
	                    }

	                    if( colConfig === false )
	                        return;

	                    return true;
	                });

	                var length = order.length;

	                // push to the beginning of _columns
	                if(order && length > 0) {
	                    while(length--)
	                        _columns.unshift(order[length]);
	                }
	            }

	            return _columns;

	        },

	        total: function() {
	            var data = this.get('_data');
	            return data ? this.get('_data').length : 0;
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

	        selection: function() {

	            var _selection = this.get('_selection');
	            var data = this.get('data');

	            return _selection.map(function(v) {
	                return data[v];
	            });

	        }

	    },

	    partials: {
	        __default__: __webpack_require__(60)
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
	        self.observe('perpage filter data', function() {
	            self.set('page', 1);
	        });

	        self.observe('perpage', function(value) {
	            if(typeof value !== 'number') {
	                self.set('perpage', parseInt(value, 10));
	            }
	        });

	        self.observe('page', function(value) {
	            if(typeof value !== 'number') {
	                self.set('perpage', parseInt(value, 10));
	            }
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

	    selectRow: function(details) {

	        var mode = this.get('selectionMode');
	        var event = details.original;
	        var row;

	        if(mode == 'cell')
	            return;

	        var _selection = this.get('_selection');

	        if(details.context)
	            row = details.context.index;
	        else
	            row = details.index.r;

	        // if for some reason the details.context is undef
	        // and we can't the index through other means then prevent
	        // an error and do nothing
	        if(!isNumber(row))
	            return;

	        if(event.shiftKey || event.ctrlKey || event.metaKey) {

	            var index = _selection.indexOf(row);

	            if(index > -1)
	                _selection.splice(index, 1);
	            else
	                _selection.push(row);

	        } else {

	            _selection = [row];

	        }


	        this.set('_selection', _selection);

	    },
	    
	    selectCell: function(details) {
	        var event = details.original;
	        event.stopImmediatePropagation();

	        //TODO
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

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(3);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
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
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, ".ractive-datatable {\n  display: block;\n  max-width: 100%;\n}\n.ractive-datatable .scroll {\n  overflow: auto;\n}\n.ractive-datatable table {\n  border-collapse: collapse;\n  border-spacing: 0;\n  width: 100%;\n}\n.ractive-datatable tbody {\n  border: 0px solid rgba(0,0,0,0.25);\n  border-bottom-width: 1px;\n  border-top-width: 1px;\n}\n.ractive-datatable thead.sortable th {\n  cursor: pointer;\n}\n.ractive-datatable th {\n  padding: 0.5em 1em;\n  font-size: 1.2em;\n  text-align: left;\n  white-space: nowrap;\n}\n.ractive-datatable th.sort:after {\n  content: '';\n  border: 3px solid transparent;\n  display: inline-block;\n  margin-left: 3px;\n  vertical-align: middle;\n}\n.ractive-datatable th.sort.desc:after {\n  border-top-color: currentColor;\n}\n.ractive-datatable th.sort.asc:after {\n  border-bottom-color: currentColor;\n  position: relative;\n  top: -3px;\n}\n.ractive-datatable td {\n  text-align: left;\n  padding: 0.5em 1em;\n  white-space: nowrap;\n}\n.ractive-datatable td.editing {\n  padding: 0;\n}\n.ractive-datatable td.editing input {\n  padding: 0.5em 1em;\n  background: none;\n  border: none;\n  outline: none;\n  width: 100%;\n  font-size: 1em;\n  border-bottom: 1px dotted #333;\n}\n.ractive-datatable .highlight {\n  background: linear-gradient(rgba(107,206,255,0.5), rgba(0,146,219,0.5));\n  color: rgba(0,0,0,0.9);\n  border-radius: 3px;\n  box-shadow: 0 1px rgba(255,255,255,0.5) inset;\n  border: 1px solid #0092db;\n}\n.ractive-datatable tr {\n  background: #fff;\n}\n.ractive-datatable tr:nth-child(even) {\n  background: #fafafa;\n}\n.ractive-datatable tr + tr {\n  border-top: 1px solid #ddd;\n}\n.ractive-datatable tr:hover td {\n  background: rgba(0,0,0,0.05);\n}\n.ractive-datatable tr.selected {\n  background: #5699ff;\n  color: #fff;\n}\n.ractive-datatable .footer {\n  margin-top: 5px;\n}\n.ractive-datatable .pagination {\n  float: right;\n  user-select: none;\n}\n.ractive-datatable .pagination .disabled {\n  opacity: 0.15;\n  cursor: default;\n  user-select: none;\n}\n.ractive-datatable .pagination a {\n  display: inline-block;\n  cursor: pointer;\n}\n.ractive-datatable .pages a {\n  width: 2em;\n  text-align: center;\n}\n.ractive-datatable .pages a.active {\n  font-weight: bold;\n  text-decoration: underline;\n}\n", ""]);

	// exports


/***/ },
/* 4 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
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
			for(i = 0; i < modules.length; i++) {
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
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(true) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

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

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
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
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 6 */
/***/ function(module, exports) {

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
	    a = a[key];
	    b = b[key];
	    // convert to lowercase for case insensitive sorting if items are strings only
	    if ( typeof a === 'string' ) {
	      a = a.toLowerCase();
	    }
	    if ( typeof b === 'string' ) {
	      b = b.toLowerCase();
	    }

	    if (a < b) {
	      return moveSmaller;
	    }
	    if (a > b) {
	      return moveLarger;
	    }
	    return 0;
	  };

	}

	module.exports = sortBy;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var baseUniq = __webpack_require__(8);

	/**
	 * Creates a duplicate-free version of an array, using
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	 * for equality comparisons, in which only the first occurrence of each
	 * element is kept.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Array
	 * @param {Array} array The array to inspect.
	 * @returns {Array} Returns the new duplicate free array.
	 * @example
	 *
	 * _.uniq([2, 1, 2]);
	 * // => [2, 1]
	 */
	function uniq(array) {
	  return (array && array.length)
	    ? baseUniq(array)
	    : [];
	}

	module.exports = uniq;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var SetCache = __webpack_require__(9),
	    arrayIncludes = __webpack_require__(47),
	    arrayIncludesWith = __webpack_require__(50),
	    cacheHas = __webpack_require__(51),
	    createSet = __webpack_require__(52),
	    setToArray = __webpack_require__(55);

	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE = 200;

	/**
	 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {Function} [iteratee] The iteratee invoked per element.
	 * @param {Function} [comparator] The comparator invoked per element.
	 * @returns {Array} Returns the new duplicate free array.
	 */
	function baseUniq(array, iteratee, comparator) {
	  var index = -1,
	      includes = arrayIncludes,
	      length = array.length,
	      isCommon = true,
	      result = [],
	      seen = result;

	  if (comparator) {
	    isCommon = false;
	    includes = arrayIncludesWith;
	  }
	  else if (length >= LARGE_ARRAY_SIZE) {
	    var set = iteratee ? null : createSet(array);
	    if (set) {
	      return setToArray(set);
	    }
	    isCommon = false;
	    includes = cacheHas;
	    seen = new SetCache;
	  }
	  else {
	    seen = iteratee ? [] : result;
	  }
	  outer:
	  while (++index < length) {
	    var value = array[index],
	        computed = iteratee ? iteratee(value) : value;

	    value = (comparator || value !== 0) ? value : 0;
	    if (isCommon && computed === computed) {
	      var seenIndex = seen.length;
	      while (seenIndex--) {
	        if (seen[seenIndex] === computed) {
	          continue outer;
	        }
	      }
	      if (iteratee) {
	        seen.push(computed);
	      }
	      result.push(value);
	    }
	    else if (!includes(seen, computed, comparator)) {
	      if (seen !== result) {
	        seen.push(computed);
	      }
	      result.push(value);
	    }
	  }
	  return result;
	}

	module.exports = baseUniq;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var MapCache = __webpack_require__(10),
	    setCacheAdd = __webpack_require__(45),
	    setCacheHas = __webpack_require__(46);

	/**
	 *
	 * Creates an array cache object to store unique values.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [values] The values to cache.
	 */
	function SetCache(values) {
	  var index = -1,
	      length = values ? values.length : 0;

	  this.__data__ = new MapCache;
	  while (++index < length) {
	    this.add(values[index]);
	  }
	}

	// Add methods to `SetCache`.
	SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
	SetCache.prototype.has = setCacheHas;

	module.exports = SetCache;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var mapCacheClear = __webpack_require__(11),
	    mapCacheDelete = __webpack_require__(39),
	    mapCacheGet = __webpack_require__(42),
	    mapCacheHas = __webpack_require__(43),
	    mapCacheSet = __webpack_require__(44);

	/**
	 * Creates a map cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function MapCache(entries) {
	  var index = -1,
	      length = entries ? entries.length : 0;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `MapCache`.
	MapCache.prototype.clear = mapCacheClear;
	MapCache.prototype['delete'] = mapCacheDelete;
	MapCache.prototype.get = mapCacheGet;
	MapCache.prototype.has = mapCacheHas;
	MapCache.prototype.set = mapCacheSet;

	module.exports = MapCache;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var Hash = __webpack_require__(12),
	    ListCache = __webpack_require__(30),
	    Map = __webpack_require__(38);

	/**
	 * Removes all key-value entries from the map.
	 *
	 * @private
	 * @name clear
	 * @memberOf MapCache
	 */
	function mapCacheClear() {
	  this.__data__ = {
	    'hash': new Hash,
	    'map': new (Map || ListCache),
	    'string': new Hash
	  };
	}

	module.exports = mapCacheClear;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var hashClear = __webpack_require__(13),
	    hashDelete = __webpack_require__(26),
	    hashGet = __webpack_require__(27),
	    hashHas = __webpack_require__(28),
	    hashSet = __webpack_require__(29);

	/**
	 * Creates a hash object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Hash(entries) {
	  var index = -1,
	      length = entries ? entries.length : 0;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `Hash`.
	Hash.prototype.clear = hashClear;
	Hash.prototype['delete'] = hashDelete;
	Hash.prototype.get = hashGet;
	Hash.prototype.has = hashHas;
	Hash.prototype.set = hashSet;

	module.exports = Hash;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var nativeCreate = __webpack_require__(14);

	/**
	 * Removes all key-value entries from the hash.
	 *
	 * @private
	 * @name clear
	 * @memberOf Hash
	 */
	function hashClear() {
	  this.__data__ = nativeCreate ? nativeCreate(null) : {};
	}

	module.exports = hashClear;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(15);

	/* Built-in method references that are verified to be native. */
	var nativeCreate = getNative(Object, 'create');

	module.exports = nativeCreate;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsNative = __webpack_require__(16),
	    getValue = __webpack_require__(25);

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = getValue(object, key);
	  return baseIsNative(value) ? value : undefined;
	}

	module.exports = getNative;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(17),
	    isHostObject = __webpack_require__(19),
	    isMasked = __webpack_require__(20),
	    isObject = __webpack_require__(18),
	    toSource = __webpack_require__(24);

	/**
	 * Used to match `RegExp`
	 * [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns).
	 */
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString = Function.prototype.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/**
	 * The base implementation of `_.isNative` without bad shim checks.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function,
	 *  else `false`.
	 */
	function baseIsNative(value) {
	  if (!isObject(value) || isMasked(value)) {
	    return false;
	  }
	  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
	  return pattern.test(toSource(value));
	}

	module.exports = baseIsNative;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(18);

	/** `Object#toString` result references. */
	var funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 8 which returns 'object' for typed array and weak map constructors,
	  // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
	  var tag = isObject(value) ? objectToString.call(value) : '';
	  return tag == funcTag || tag == genTag;
	}

	module.exports = isFunction;


/***/ },
/* 18 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	module.exports = isObject;


/***/ },
/* 19 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is a host object in IE < 9.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
	 */
	function isHostObject(value) {
	  // Many host objects are `Object` objects that can coerce to strings
	  // despite having improperly defined `toString` methods.
	  var result = false;
	  if (value != null && typeof value.toString != 'function') {
	    try {
	      result = !!(value + '');
	    } catch (e) {}
	  }
	  return result;
	}

	module.exports = isHostObject;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var coreJsData = __webpack_require__(21);

	/** Used to detect methods masquerading as native. */
	var maskSrcKey = (function() {
	  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
	  return uid ? ('Symbol(src)_1.' + uid) : '';
	}());

	/**
	 * Checks if `func` has its source masked.
	 *
	 * @private
	 * @param {Function} func The function to check.
	 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
	 */
	function isMasked(func) {
	  return !!maskSrcKey && (maskSrcKey in func);
	}

	module.exports = isMasked;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var root = __webpack_require__(22);

	/** Used to detect overreaching core-js shims. */
	var coreJsData = root['__core-js_shared__'];

	module.exports = coreJsData;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var checkGlobal = __webpack_require__(23);

	/** Detect free variable `global` from Node.js. */
	var freeGlobal = checkGlobal(typeof global == 'object' && global);

	/** Detect free variable `self`. */
	var freeSelf = checkGlobal(typeof self == 'object' && self);

	/** Detect `this` as the global object. */
	var thisGlobal = checkGlobal(typeof this == 'object' && this);

	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || thisGlobal || Function('return this')();

	module.exports = root;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 23 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is a global object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {null|Object} Returns `value` if it's a global object, else `null`.
	 */
	function checkGlobal(value) {
	  return (value && value.Object === Object) ? value : null;
	}

	module.exports = checkGlobal;


/***/ },
/* 24 */
/***/ function(module, exports) {

	/** Used to resolve the decompiled source of functions. */
	var funcToString = Function.prototype.toString;

	/**
	 * Converts `func` to its source code.
	 *
	 * @private
	 * @param {Function} func The function to process.
	 * @returns {string} Returns the source code.
	 */
	function toSource(func) {
	  if (func != null) {
	    try {
	      return funcToString.call(func);
	    } catch (e) {}
	    try {
	      return (func + '');
	    } catch (e) {}
	  }
	  return '';
	}

	module.exports = toSource;


/***/ },
/* 25 */
/***/ function(module, exports) {

	/**
	 * Gets the value at `key` of `object`.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {string} key The key of the property to get.
	 * @returns {*} Returns the property value.
	 */
	function getValue(object, key) {
	  return object == null ? undefined : object[key];
	}

	module.exports = getValue;


/***/ },
/* 26 */
/***/ function(module, exports) {

	/**
	 * Removes `key` and its value from the hash.
	 *
	 * @private
	 * @name delete
	 * @memberOf Hash
	 * @param {Object} hash The hash to modify.
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function hashDelete(key) {
	  return this.has(key) && delete this.__data__[key];
	}

	module.exports = hashDelete;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var nativeCreate = __webpack_require__(14);

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Gets the hash value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Hash
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function hashGet(key) {
	  var data = this.__data__;
	  if (nativeCreate) {
	    var result = data[key];
	    return result === HASH_UNDEFINED ? undefined : result;
	  }
	  return hasOwnProperty.call(data, key) ? data[key] : undefined;
	}

	module.exports = hashGet;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var nativeCreate = __webpack_require__(14);

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Checks if a hash value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Hash
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function hashHas(key) {
	  var data = this.__data__;
	  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
	}

	module.exports = hashHas;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var nativeCreate = __webpack_require__(14);

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';

	/**
	 * Sets the hash `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Hash
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the hash instance.
	 */
	function hashSet(key, value) {
	  var data = this.__data__;
	  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
	  return this;
	}

	module.exports = hashSet;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var listCacheClear = __webpack_require__(31),
	    listCacheDelete = __webpack_require__(32),
	    listCacheGet = __webpack_require__(35),
	    listCacheHas = __webpack_require__(36),
	    listCacheSet = __webpack_require__(37);

	/**
	 * Creates an list cache object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function ListCache(entries) {
	  var index = -1,
	      length = entries ? entries.length : 0;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `ListCache`.
	ListCache.prototype.clear = listCacheClear;
	ListCache.prototype['delete'] = listCacheDelete;
	ListCache.prototype.get = listCacheGet;
	ListCache.prototype.has = listCacheHas;
	ListCache.prototype.set = listCacheSet;

	module.exports = ListCache;


/***/ },
/* 31 */
/***/ function(module, exports) {

	/**
	 * Removes all key-value entries from the list cache.
	 *
	 * @private
	 * @name clear
	 * @memberOf ListCache
	 */
	function listCacheClear() {
	  this.__data__ = [];
	}

	module.exports = listCacheClear;


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(33);

	/** Used for built-in method references. */
	var arrayProto = Array.prototype;

	/** Built-in value references. */
	var splice = arrayProto.splice;

	/**
	 * Removes `key` and its value from the list cache.
	 *
	 * @private
	 * @name delete
	 * @memberOf ListCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function listCacheDelete(key) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);

	  if (index < 0) {
	    return false;
	  }
	  var lastIndex = data.length - 1;
	  if (index == lastIndex) {
	    data.pop();
	  } else {
	    splice.call(data, index, 1);
	  }
	  return true;
	}

	module.exports = listCacheDelete;


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var eq = __webpack_require__(34);

	/**
	 * Gets the index at which the `key` is found in `array` of key-value pairs.
	 *
	 * @private
	 * @param {Array} array The array to search.
	 * @param {*} key The key to search for.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function assocIndexOf(array, key) {
	  var length = array.length;
	  while (length--) {
	    if (eq(array[length][0], key)) {
	      return length;
	    }
	  }
	  return -1;
	}

	module.exports = assocIndexOf;


/***/ },
/* 34 */
/***/ function(module, exports) {

	/**
	 * Performs a
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	 * comparison between two values to determine if they are equivalent.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 * @example
	 *
	 * var object = { 'user': 'fred' };
	 * var other = { 'user': 'fred' };
	 *
	 * _.eq(object, object);
	 * // => true
	 *
	 * _.eq(object, other);
	 * // => false
	 *
	 * _.eq('a', 'a');
	 * // => true
	 *
	 * _.eq('a', Object('a'));
	 * // => false
	 *
	 * _.eq(NaN, NaN);
	 * // => true
	 */
	function eq(value, other) {
	  return value === other || (value !== value && other !== other);
	}

	module.exports = eq;


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(33);

	/**
	 * Gets the list cache value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf ListCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function listCacheGet(key) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);

	  return index < 0 ? undefined : data[index][1];
	}

	module.exports = listCacheGet;


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(33);

	/**
	 * Checks if a list cache value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf ListCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function listCacheHas(key) {
	  return assocIndexOf(this.__data__, key) > -1;
	}

	module.exports = listCacheHas;


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(33);

	/**
	 * Sets the list cache `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf ListCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the list cache instance.
	 */
	function listCacheSet(key, value) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);

	  if (index < 0) {
	    data.push([key, value]);
	  } else {
	    data[index][1] = value;
	  }
	  return this;
	}

	module.exports = listCacheSet;


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(15),
	    root = __webpack_require__(22);

	/* Built-in method references that are verified to be native. */
	var Map = getNative(root, 'Map');

	module.exports = Map;


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var getMapData = __webpack_require__(40);

	/**
	 * Removes `key` and its value from the map.
	 *
	 * @private
	 * @name delete
	 * @memberOf MapCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function mapCacheDelete(key) {
	  return getMapData(this, key)['delete'](key);
	}

	module.exports = mapCacheDelete;


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var isKeyable = __webpack_require__(41);

	/**
	 * Gets the data for `map`.
	 *
	 * @private
	 * @param {Object} map The map to query.
	 * @param {string} key The reference key.
	 * @returns {*} Returns the map data.
	 */
	function getMapData(map, key) {
	  var data = map.__data__;
	  return isKeyable(key)
	    ? data[typeof key == 'string' ? 'string' : 'hash']
	    : data.map;
	}

	module.exports = getMapData;


/***/ },
/* 41 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is suitable for use as unique object key.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
	 */
	function isKeyable(value) {
	  var type = typeof value;
	  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
	    ? (value !== '__proto__')
	    : (value === null);
	}

	module.exports = isKeyable;


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var getMapData = __webpack_require__(40);

	/**
	 * Gets the map value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf MapCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function mapCacheGet(key) {
	  return getMapData(this, key).get(key);
	}

	module.exports = mapCacheGet;


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var getMapData = __webpack_require__(40);

	/**
	 * Checks if a map value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf MapCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function mapCacheHas(key) {
	  return getMapData(this, key).has(key);
	}

	module.exports = mapCacheHas;


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var getMapData = __webpack_require__(40);

	/**
	 * Sets the map `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf MapCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the map cache instance.
	 */
	function mapCacheSet(key, value) {
	  getMapData(this, key).set(key, value);
	  return this;
	}

	module.exports = mapCacheSet;


/***/ },
/* 45 */
/***/ function(module, exports) {

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';

	/**
	 * Adds `value` to the array cache.
	 *
	 * @private
	 * @name add
	 * @memberOf SetCache
	 * @alias push
	 * @param {*} value The value to cache.
	 * @returns {Object} Returns the cache instance.
	 */
	function setCacheAdd(value) {
	  this.__data__.set(value, HASH_UNDEFINED);
	  return this;
	}

	module.exports = setCacheAdd;


/***/ },
/* 46 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is in the array cache.
	 *
	 * @private
	 * @name has
	 * @memberOf SetCache
	 * @param {*} value The value to search for.
	 * @returns {number} Returns `true` if `value` is found, else `false`.
	 */
	function setCacheHas(value) {
	  return this.__data__.has(value);
	}

	module.exports = setCacheHas;


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var baseIndexOf = __webpack_require__(48);

	/**
	 * A specialized version of `_.includes` for arrays without support for
	 * specifying an index to search from.
	 *
	 * @private
	 * @param {Array} [array] The array to search.
	 * @param {*} target The value to search for.
	 * @returns {boolean} Returns `true` if `target` is found, else `false`.
	 */
	function arrayIncludes(array, value) {
	  var length = array ? array.length : 0;
	  return !!length && baseIndexOf(array, value, 0) > -1;
	}

	module.exports = arrayIncludes;


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var indexOfNaN = __webpack_require__(49);

	/**
	 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
	 *
	 * @private
	 * @param {Array} array The array to search.
	 * @param {*} value The value to search for.
	 * @param {number} fromIndex The index to search from.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function baseIndexOf(array, value, fromIndex) {
	  if (value !== value) {
	    return indexOfNaN(array, fromIndex);
	  }
	  var index = fromIndex - 1,
	      length = array.length;

	  while (++index < length) {
	    if (array[index] === value) {
	      return index;
	    }
	  }
	  return -1;
	}

	module.exports = baseIndexOf;


/***/ },
/* 49 */
/***/ function(module, exports) {

	/**
	 * Gets the index at which the first occurrence of `NaN` is found in `array`.
	 *
	 * @private
	 * @param {Array} array The array to search.
	 * @param {number} fromIndex The index to search from.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {number} Returns the index of the matched `NaN`, else `-1`.
	 */
	function indexOfNaN(array, fromIndex, fromRight) {
	  var length = array.length,
	      index = fromIndex + (fromRight ? 1 : -1);

	  while ((fromRight ? index-- : ++index < length)) {
	    var other = array[index];
	    if (other !== other) {
	      return index;
	    }
	  }
	  return -1;
	}

	module.exports = indexOfNaN;


/***/ },
/* 50 */
/***/ function(module, exports) {

	/**
	 * This function is like `arrayIncludes` except that it accepts a comparator.
	 *
	 * @private
	 * @param {Array} [array] The array to search.
	 * @param {*} target The value to search for.
	 * @param {Function} comparator The comparator invoked per element.
	 * @returns {boolean} Returns `true` if `target` is found, else `false`.
	 */
	function arrayIncludesWith(array, value, comparator) {
	  var index = -1,
	      length = array ? array.length : 0;

	  while (++index < length) {
	    if (comparator(value, array[index])) {
	      return true;
	    }
	  }
	  return false;
	}

	module.exports = arrayIncludesWith;


/***/ },
/* 51 */
/***/ function(module, exports) {

	/**
	 * Checks if a cache value for `key` exists.
	 *
	 * @private
	 * @param {Object} cache The cache to query.
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function cacheHas(cache, key) {
	  return cache.has(key);
	}

	module.exports = cacheHas;


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var Set = __webpack_require__(53),
	    noop = __webpack_require__(54),
	    setToArray = __webpack_require__(55);

	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0;

	/**
	 * Creates a set of `values`.
	 *
	 * @private
	 * @param {Array} values The values to add to the set.
	 * @returns {Object} Returns the new set.
	 */
	var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
	  return new Set(values);
	};

	module.exports = createSet;


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(15),
	    root = __webpack_require__(22);

	/* Built-in method references that are verified to be native. */
	var Set = getNative(root, 'Set');

	module.exports = Set;


/***/ },
/* 54 */
/***/ function(module, exports) {

	/**
	 * A method that returns `undefined`.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.3.0
	 * @category Util
	 * @example
	 *
	 * _.times(2, _.noop);
	 * // => [undefined, undefined]
	 */
	function noop() {
	  // No operation performed.
	}

	module.exports = noop;


/***/ },
/* 55 */
/***/ function(module, exports) {

	/**
	 * Converts `set` to an array of its values.
	 *
	 * @private
	 * @param {Object} set The set to convert.
	 * @returns {Array} Returns the values.
	 */
	function setToArray(set) {
	  var index = -1,
	      result = Array(set.size);

	  set.forEach(function(value) {
	    result[++index] = value;
	  });
	  return result;
	}

	module.exports = setToArray;


/***/ },
/* 56 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is `undefined`.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
	 * @example
	 *
	 * _.isUndefined(void 0);
	 * // => true
	 *
	 * _.isUndefined(null);
	 * // => false
	 */
	function isUndefined(value) {
	  return value === undefined;
	}

	module.exports = isUndefined;


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var isObjectLike = __webpack_require__(58);

	/** `Object#toString` result references. */
	var numberTag = '[object Number]';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/**
	 * Checks if `value` is classified as a `Number` primitive or object.
	 *
	 * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
	 * classified as numbers, use the `_.isFinite` method.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isNumber(3);
	 * // => true
	 *
	 * _.isNumber(Number.MIN_VALUE);
	 * // => true
	 *
	 * _.isNumber(Infinity);
	 * // => true
	 *
	 * _.isNumber('3');
	 * // => false
	 */
	function isNumber(value) {
	  return typeof value == 'number' ||
	    (isObjectLike(value) && objectToString.call(value) == numberTag);
	}

	module.exports = isNumber;


/***/ },
/* 58 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	module.exports = isObjectLike;


/***/ },
/* 59 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":["ractive-datatable ",{"t":2,"r":"class"}],"id":[{"t":2,"r":"id"}],"style":[{"t":2,"r":"style"}]},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"scroll"},"f":[{"t":7,"e":"table","f":[{"t":7,"e":"thead","a":{"class":[{"t":2,"x":{"r":["sortable"],"s":"_0?\"sortable\":\"\""}}]},"f":[{"t":4,"f":[{"t":7,"e":"th","m":[{"t":4,"f":["class='sort ",{"t":2,"r":"sortMode"},"'"],"n":50,"x":{"r":["sortOn","."],"s":"_0===_1"}}],"v":{"click":{"m":"setSort","a":{"r":["."],"s":"[_0]"}}},"f":[{"t":2,"x":{"r":["columns","."],"s":"_0[_1]&&_0[_1].header?_0[_1].header:_1"}}]}],"r":"cols"}]}," ",{"t":7,"e":"tbody","f":[{"t":4,"f":[{"t":7,"e":"tr","m":[{"t":4,"f":["class='selected'"],"n":50,"x":{"r":["selectionMode","_selection","index"],"s":"_0==\"row\"&&_1.indexOf(_2)!==-1"}}],"v":{"click":{"m":"selectRow","a":{"r":["event"],"s":"[_0]"}}},"a":{"index":[{"t":2,"r":"index"}]},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"td","a":{"class":"editing"},"f":[{"t":7,"e":"input","a":{"value":[{"t":2,"rx":{"r":"rows","m":[{"t":30,"n":"r"},"item",{"t":30,"n":"."}]}}],"twoway":"false"},"v":{"blur-keyup":{"m":"fieldedited","a":{"r":["event"],"s":"[_0]"}}}}]}],"n":50,"x":{"r":["editable","can",".","editing","r","c"],"s":"_0&&_1(\"edit\",_2)&&_3==_4+\"-\"+_5"}},{"t":4,"n":51,"f":[{"t":7,"e":"td","a":{"class":[{"t":2,"r":"."}]},"v":{"dblclick":{"m":"set","a":{"r":["r","c"],"s":"[\"editing\",_0+\"-\"+_1]"}}},"m":[{"t":4,"f":["class='selected'"],"n":50,"x":{"r":["selectionMode","c","index","selection"],"s":"_0==\"cell\"&&_3[_2]&&_3[_2][_1]"}}],"f":[" ",{"t":4,"f":[{"t":4,"n":53,"f":[{"t":8,"x":{"r":["cellFor","c","cols"],"s":"_0(_2[_1])"}}],"x":{"r":[".","r","rows"],"s":"_2[_1].item[_0]||_2[_1].item"}}],"n":50,"x":{"r":["r","rows"],"s":"_1[_0]&&_1[_0].item"}}]}],"x":{"r":["editable","can",".","editing","r","c"],"s":"_0&&_1(\"edit\",_2)&&_3==_4+\"-\"+_5"}}],"i":"c","r":"cols"}]}],"i":"r","r":"rows"}]}]}]}," ",{"t":7,"e":"div","a":{"class":"footer"},"f":["Displaying ",{"t":2,"r":"current"}," of ",{"t":2,"r":"total"}," ",{"t":4,"f":[{"t":7,"e":"span","a":{"class":"pagination"},"f":[{"t":4,"f":[{"t":7,"e":"span","a":{"class":"disabled"},"f":["Previous"]}],"n":50,"r":"onFirstPage"},{"t":4,"n":51,"f":[{"t":7,"e":"a","v":{"click":{"m":"previousPage","a":{"r":[],"s":"[]"}}},"f":["Previous"]}],"r":"onFirstPage"}," ",{"t":7,"e":"span","a":{"class":"pages"},"f":[{"t":4,"f":[{"t":7,"e":"a","v":{"click":{"m":"gotoPage","a":{"r":["."],"s":"[_0]"}}},"a":{"class":[{"t":2,"x":{"r":["page","."],"s":"_0==_1?\"active\":\"\""}}]},"f":[{"t":2,"r":"."}]}],"r":"pages"}]}," ",{"t":4,"f":[{"t":7,"e":"span","a":{"class":"disabled"},"f":["Next"]}],"n":50,"r":"onLastPage"},{"t":4,"n":51,"f":[{"t":7,"e":"a","v":{"click":{"m":"nextPage","a":{"r":[],"s":"[]"}}},"f":["Next"]}],"r":"onLastPage"}]}],"n":50,"r":"pages"}]}],"n":50,"r":"data"},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"no-data"},"f":["No data"]}],"r":"data"}]}]};

/***/ },
/* 60 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":3,"x":{"r":["highlight","."],"s":"_0(_1)"}}]};

/***/ }
/******/ ])
});
;