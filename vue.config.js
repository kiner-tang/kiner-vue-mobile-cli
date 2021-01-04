/* eslint-disable no-console */
const UglifyPlugin = require("uglifyjs-webpack-plugin");
const webpack = require("webpack");
const ImageProfilePlugin = require("./webpack-plugins/image-profile-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

let isPro = process.env.NODE_ENV === "prod";

module.exports = {
    publicPath: "./",
    indexPath: "index.html",
    css: {
        loaderOptions: {
            stylus: {
                "resolve url": true,
                import: ["./src/theme"]
            }
        },
        // 是否使用css分离插件 ExtractTextPlugin
        // extract: true,
        // // 开启 CSS source maps?
        sourceMap: false,
        // // 启用 CSS modules for all css / pre-processor files.
        modules: false
    },
    transpileDependencies: [],
    pluginOptions: {
        "cube-ui": {
            postCompile: true,
            theme: true
        }
    },
    configureWebpack: () => ({
        optimization: {
            minimize: isPro,
            minimizer: [
                new UglifyPlugin({
                    uglifyOptions: {
                        warnings: false,
                        compress: {
                            drop_console: true,
                            drop_debugger: true,
                            pure_funcs: ["console.log"]
                        }
                    },
                    sourceMap: false
                })
            ]
        },
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "windows.jQuery": "jquery"
            }),
            new ImageProfilePlugin({
                imagePath: "img"
            }),
            new HtmlWebpackPlugin({
                template: "public/index.html",
                BASE_URL: "/",
                version: Date.now()
            })
        ]
    }),
    // cli3 代理是从指定的target后面开始匹配的，不是任意位置；配置pathRewrite可以做替换
    devServer: {
        watchOptions:{
            ignored: [
                "/src/assets/images/\._.*"
            ]
        }
        // publicPath: '/loanApp',
        // proxy: {
        //     "/service": {
        //         target: "http://192.168.2.118:8082/",
        //         // target: 'http://192.168.1.104:3721/',
        //         changeOrigin: true,
        //         pathRewrite: {}
        //     }
        // }
    },
    productionSourceMap: false,
    // 覆盖webpack配置
    chainWebpack(config) {
        config.when(!isPro, config => {
            console.log("开发环境");
            config.devtool("cheap-module-eval-source-map");
        });
        config.when(isPro, config => {
            config.mode = "production";
            config.devtool(false);
            config.output.filename("[name].[hash].js").end();
        });
    }
};
