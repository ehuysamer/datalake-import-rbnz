// import path from 'path';
// import nodeExternals from 'webpack-node-externals';
// import slsw from 'serverless-webpack';
// import CopyPlugin from 'copy-webpack-plugin';

const fs = require('fs');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const slsw = require('serverless-webpack');
const CopyPlugin = require('copy-webpack-plugin');

//export default {
module.exports = {
    // entry: {
    //     status: './src/handlers/status.js',
    //     downloadOcr: './src/handlers/downloadOcr.js',
    // },
    entry: slsw.lib.entries,
    target: 'node',
    mode: 'development', //'production',
    externals: [nodeExternals()],
    plugins: [
        new CopyPlugin({
            patterns: [
                'src/config/*.json',
                {
                    from: 'src/config/*.json',
                    to: 'src/config'
                }
            ],
            options: {
                concurrency: 100,
            },
        }),
    ],
    output: {
        libraryTarget: 'commonjs2',
        //path: path.resolve(__dirname, '.webpack'),
        path: path.resolve('./.webpack'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};