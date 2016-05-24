/*global module:false*/
module.exports = function(grunt) {

    //handles plugins
    require('jit-grunt')(grunt);

    var webpack = require('webpack');

    grunt.initConfig({

        webpack: {
            options: require('./webpack.config.js'),
            development: {
                debug: true,
            },
            production: {
                debug: false,
                production: true,
                devtool: 'none',
                output: {
                    pathinfo: false,
                    filename: 'ractive-datatable.min.js',
                },
                plugins: [
                    new webpack.DefinePlugin({
                        DEBUG: false,
                        PRODUCTION: true
                    }),
                    new webpack.optimize.UglifyJsPlugin({
                        output: {
                            comments: false,
                        }
                    }),
                    new webpack.optimize.AggressiveMergingPlugin(),
                    new webpack.optimize.OccurenceOrderPlugin(true),
                ]
            },
        },

    });

    grunt.registerTask('default', ['webpack:development', 'webpack:production']);

};
