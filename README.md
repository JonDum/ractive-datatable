#ractive-datatable

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

Includes minimal styling under the class `.ractive-datatable`.

Requires some sort of CommonJS module system (Webpack, Browserify) until someone submits a PR for a better way :)

### API

`data`: Array of Objects where each key is a column
`columns`: Array specifying which columns to display and order (any keys missing in this array will not be shown)
`config`: Object to configure individual columns. Each key represents a column and must be an object with optional `edit` and `display` keys.

```
config: {
    created: {edit: false},
    id: {edit: false},
    hiddenField: {display: false}  // <--- can't edit what isn't displayed yo
}
```


Open to PRs and stuff. I'm around.


