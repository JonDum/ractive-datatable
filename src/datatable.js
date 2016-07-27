
require('./styles.styl');

var sortBy = require('./util/sortBy');
var uniq = require('lodash/uniq');
var isUndefined = require('lodash/isUndefined');
var isObject= require('lodash/isObject');
var isNumber = require('lodash/isNumber');

var DataTable = Ractive.extend({

    template: require('!ractive!./template.html'),

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

                // columns without a corresponding key on the row get passed the whole row
                // avoids putting in [object Object] casts
                if(typeof text === 'object')
                    return '';

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
        __default__: require('./partials/default.html')
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

        if(event.shiftKey || event.ctrlKey || event.metaKey || 
            (_selection.length === 1 && _selection[0] === row)) {

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
