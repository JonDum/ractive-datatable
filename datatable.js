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

	
	var sortBy = __webpack_require__(2);

	var DataTable = Ractive.extend({

	    template: __webpack_require__(3),

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

	module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":"ractive-datatable"},"f":[{"t":4,"f":[{"t":7,"e":"table","f":[{"t":7,"e":"thead","a":{"class":[{"t":2,"x":{"r":["sortable"],"s":"_0?\"sortable\":\"\""}}]},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"th","a":{"class":[{"t":4,"f":["sort ",{"t":2,"r":"sortMode"}],"n":50,"x":{"r":["sortOn","."],"s":"_0==_1"}}]},"v":{"click":{"m":"setSort","a":{"r":["."],"s":"[_0]"}}},"f":[{"t":2,"r":"."}]}],"n":50,"x":{"r":["can","."],"s":"_0(\"display\",_1)"}}],"r":"_columns"}]}," ",{"t":7,"e":"tbody","f":[{"t":4,"f":[{"t":7,"e":"tr","f":[{"t":4,"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"td","a":{"class":"editing"},"f":[{"t":7,"e":"input","a":{"value":[{"t":2,"rx":{"r":"rows","m":[{"t":30,"n":"i"},{"t":30,"n":"."}]}}],"twoway":"false"},"v":{"blur-keyup":{"m":"fieldedited","a":{"r":[],"s":"[]"}}}}]}],"n":50,"x":{"r":["editable","can","editing","i","."],"s":"_0&&_1(\"edit\",_4)&&_2==_3+_4"}},{"t":4,"n":51,"f":[{"t":7,"e":"td","v":{"dblclick":{"m":"set","a":{"r":["i","."],"s":"[\"editing\",_0+_1]"}}},"f":[{"t":2,"rx":{"r":"rows","m":[{"t":30,"n":"i"},{"t":30,"n":"."}]}}]}],"x":{"r":["editable","can","editing","i","."],"s":"_0&&_1(\"edit\",_4)&&_2==_3+_4"}}],"n":50,"x":{"r":["can","."],"s":"_0(\"display\",_1)"}}],"r":"_columns"}]}],"i":"i","r":"rows"}]}]}," ",{"t":7,"e":"div","f":["Displaying ",{"t":2,"r":"current"}," of ",{"t":2,"r":"total"}," ",{"t":4,"f":[{"t":7,"e":"span","a":{"class":"pagination"},"f":[{"t":4,"f":[{"t":7,"e":"span","a":{"class":"disabled"},"f":["Previous"]}],"n":50,"r":"onFirstPage"},{"t":4,"n":51,"f":[{"t":7,"e":"a","v":{"click":{"m":"previousPage","a":{"r":[],"s":"[]"}}},"f":["Previous"]}],"r":"onFirstPage"}," ",{"t":7,"e":"span","a":{"class":"pages"},"f":[{"t":4,"f":[{"t":7,"e":"a","v":{"click":{"m":"gotoPage","a":{"r":["."],"s":"[_0]"}}},"a":{"class":[{"t":2,"x":{"r":["page","."],"s":"_0==_1?\"active\":\"\""}}]},"f":[{"t":2,"r":"."}]}],"r":"pages"}]}," ",{"t":4,"f":[{"t":7,"e":"span","a":{"class":"disabled"},"f":["Next"]}],"n":50,"r":"onLastPage"},{"t":4,"n":51,"f":[{"t":7,"e":"a","v":{"click":{"m":"nextPage","a":{"r":[],"s":"[]"}}},"f":["Next"]}],"r":"onLastPage"}]}],"n":50,"r":"pages"}]}],"n":50,"r":"data"},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"no-data"},"f":["No data"]}],"r":"data"}]}]};

/***/ }
/******/ ])
});
;