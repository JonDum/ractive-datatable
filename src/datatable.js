
require('./styles.styl');

var sortBy = require('./util/sortBy');

var DataTable = Ractive.extend({

    template: require('./template.html'),

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

        cellFor: function(column) {

            if(this.partials[column])
                return column;
            
            return '__default__';

        }

    },

    computed: {

        rows: function() {

            var page = this.get('page') - 1;
            var _data = this.get('_data');
            var perpage = this.get('perpage');
            var total = this.get('total');

            return _data.slice(page * perpage, Math.min(page * perpage + perpage, total));

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
                columns = self.get('columns');

            if(columns)
                return columns;

            return data && data[0] ? Object.keys(self.get('_data')[0]) : [];

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
