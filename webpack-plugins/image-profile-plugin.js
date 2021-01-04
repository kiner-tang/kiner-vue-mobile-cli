/* eslint-disable no-console */

class ImageProfilePlugin {
    constructor(options) {
        this.options = options;
        this.res = [];
    }
    // compiler包含了webpack的实例与配置信息
    apply(compiler) {
        // console.log("参数：", this.options);
        //在文件输出阶段执行的异步方法
        compiler.hooks.emit.tapAsync("ImageProfilePlugin", (compilation, cb) => {
            let imgs = Object.keys(compilation.assets);

            this.res = [...this.res, ...imgs]
                .map(item => {
                    console.log(item);
                    if (item.includes(this.options.imagePath)) {
                        return item.startsWith("/") ? "." + item : "./" + item;
                    } else {
                        return false;
                    }
                })
                .filter(item => item !== false);

            // console.log("---->", compilation.assets);

            compilation.assets[`imageProfile.js`] = {
                source: () => {
                    return `window.imgPreloadArr = ${JSON.stringify(this.res)};`;
                },
                size: function() {
                    return 20;
                }
            };
            cb();
        });
    }
}

module.exports = ImageProfilePlugin;
