var path = require('path')
var webpack = require('webpack')
var nodeExternals = require('webpack-node-externals')
var NodemonPlugin = require('nodemon-webpack-plugin')



var browserConfig = {

    entry: './src/browser/index.js',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        rules:[
            {
                oneOf:[
                    { test: /\.js$/, use: 'babel-loader'},
                    { test: /\.css$/,use: ['style-loader', 'css-loader']},
                    { test: /\.scss$/, use: ['style-loader','css-loader','sass-loader']}
                ]
            }
        ]
    }
}


var serverConfig = {
    entry: './src/server/index.js',
    target: 'node',
    externals: [nodeExternals()],
    output: {
        path: __dirname,
        filename: 'server.js',
        publicPath:'/'
    },
    module: {
        rules: [
            { test: /\.js$/, use: 'babel-loader'}
        ]
    },
    plugins: [ new NodemonPlugin() ]
}


module.exports = [browserConfig, serverConfig]