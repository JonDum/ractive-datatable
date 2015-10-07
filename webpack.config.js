
var webpack = require('webpack');

module.exports = {
    entry: ['src/datatable'],
    output: {
        path: __dirname + '/',
        filename: 'datatable.min.js',
        library: 'RactiveDatatable',
        libraryTarget: 'umd'
    },
    resolve: {
        root: process.cwd(),
        modulesDirectories: ['node_modules', 'bower_components', 'css', 'js', 'templates'],
        extensions: ['', '.js', '.styl', '.html'],
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],
    module: {
        loaders: [
            {test: /\.styl$/, loader:'style-loader!css-loader!stylus-loader'},
            {test: /\.css$/, loader: 'style-loader!css-loader'},
            {test: /\.html/, loader: 'ractive'}
        ],
    },
}

