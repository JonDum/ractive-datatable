#ractive-datatable

### Demo

[Live Demo](http://jondum.github.com/ractive-datatable/demo/)

### Install

```
npm install ractive-datatable --save
```

### Features

* Minimal but pretty
* Cell Editing
* Pagination (incl. navigation buttons)
* Filtering
* Sorting (wip)


### Usage

Add the datatable to your Ractive instance:

```
Ractive.extend({
    ...
    components: {
        datatable: require('ractive-datatable')
    },
    ...
});
```

Use it

```
<datatable data='{{data}}' on-edit='dataedited' config='{{config}}' filter='{{filter}}'></datatable>
```

Includes minimal styling under the class `.ractive-datatable`. Styles are included in the javascript and added to the page on load. If you don't want these styles in the javascript, `require()` `src/datatable.js` and handle the styles as needed.

### API

##### Properties
`data`: Array of Objects where each key is a column

`columns`: Array specifying which columns to display and order (any keys missing in this array will not be shown). If left `undefined`, the datatable will extract columns from the first item in the data array.

`config`: Object to configure individual columns. Each key represents a column and must be an object with optional `edit` and `display` keys.

```
config: {
    created: {edit: false},
    id: {edit: false},
    hiddenField: {display: false}  // <--- can't edit what isn't displayed yo
}
```

##### Events
`edit`: Dispatched when an edit is made. Sends the entire row and the field that is edited (useful for extracting specific information from the row that changed).

```
this.on('dataedited', function(row, field) {
    
    var change = {};
    change.id = row.id;
    change[field] = row[field];
    
    changes.push(change);
    
});
```



Open to PRs and stuff. I'm around.


