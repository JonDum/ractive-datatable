
var webpack = require('webpack');

module.exports = {
    entry: ['src/datatable'],
    output: {
        path: __dirname + '/',
        filename: 'ractive-datatable.js',
        library: 'RactiveDatatable',
        libraryTarget: 'umd'
    },
    resolve: {
        root: process.cwd(),
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js', '.styl', '.html'],
    },
    module: {
        loaders: [
            {test: /\.styl$/, loader:'style!css!stylus'},
            {test: /\.css$/, loader: 'style!css'},
            {test: /\.html/, loader: 'ractive'}
        ],
    },
    stylus: {
        use: [(require('nib')())],
    },
}

