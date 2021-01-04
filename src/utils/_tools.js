/* eslint-disable no-console */
import axios from "axios";
import config from "./config";
import $ from "jquery";
import qs from "qs";
import * as clipboard from 'clipboard-polyfill';
import {
    Toast
} from 'cube-ui';

const _tools = {
    /**
     * 通用请求方法
     * @param {*} param0
     */
    fetch({
              action,
              type = "get",
              data = {},
              isUrl = false,
              noErrorTip = false
          }) {

        let setting = {
            url: isUrl
                ? action
                : config.mock
                    ? config.baseUrl + action
                    : config.host + config.baseUrl + action,
            method: type.toUpperCase()
        };

        let params = {
            ...data
        };

        if (setting.method === "POST") {
            setting.data = qs.stringify(params);
        } else {
            setting.params = params;
        }

        return new Promise((resolve, reject) => {
            axios
                .request(setting)
                .then(res => {
                    if (res.status === 200) {
                        if (isUrl) {
                            resolve(res.data);
                        } else {
                            let { status, msg, data } = res.data;
                            if (status === 1) {
                                console.info(`${action}请求结果`, data);
                                resolve(data);
                            } else {
                                if (!noErrorTip) {
                                    Toast.$create({
                                            time: 2000,
                                            txt: `${msg}`,
                                            type: "error",
                                            mask: true
                                        })
                                        .show();
                                }

                                console.warn(`${action}请求失败`, res);

                                reject(res.data);
                            }
                        }
                    } else {
                        let { code, msg } = res.data;
                        Toast.$create({
                                time: 2000,
                                txt: `[${code}]:${msg}`,
                                type: "error",
                                mask: true
                            })
                            .show();
                        console.warn(`${action}请求失败`, res);

                        reject(res.data);
                    }
                })
                .catch(res => {
                    Toast.$create({
                            time: 2000,
                            txt: "网络繁忙，请稍后重试",
                            type: "error",
                            mask: true
                        })
                        .show();
                    console.warn(res);
                    reject(res);
                });
        });
    },
    //浏览器类型判断
    borrower: {
        /**
         * 判断是否安卓手机
         * @returns {boolean}
         */
        isAndroid: function() {
            let ua = typeof window === "object" ? window.navigator.userAgent : "";
            return /Android/i.test(ua);
        },
        /**
         * 判断是否ios
         * @returns {boolean}
         */
        isIOS: function() {
            let ua = typeof window === "object" ? window.navigator.userAgent : "";
            return /iPhone|iPod|iPad/i.test(ua);
        },
        /**
         * 判断是否为微信浏览器
         */
        isWeiXin: function() {
            let ua = window.navigator.userAgent.toLowerCase();
            //通过正则表达式匹配ua中是否含有MicroMessenger字符串
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                return true;
            } else {
                return false;
            }
        }
    },

    /**
     * 手机键盘显示与隐藏事件监听
     * @param cb
     */
    keyboardListener: function(cb) {
        console.log("当前系统类型:", _tools.borrower.isAndroid());
        if (_tools.borrower.isAndroid()) {
            let innerHeight = window.innerHeight;
            window.addEventListener("resize", () => {
                let newInnerHeight = window.innerHeight;
                console.log(innerHeight, newInnerHeight);
                if (innerHeight > newInnerHeight) {
                    cb(true);
                } else {
                    // 键盘收起事件处理
                    cb(false);
                }
            });
        } else if (_tools.borrower.isIOS()) {
            window.addEventListener("focusin", () => {
                // 键盘弹出事件处理
                cb(true);
            });
            window.addEventListener("focusout", () => {
                // 键盘收起事件处理
                cb(false);
            });
        }
    },
    /**
     * 获取计算后的样式值
     * @param {*} dom
     * @param {*} styleName
     */
    getComputedStyle: function(dom, styleName) {
        //将名称转换成驼峰标志的形式
        function toCamelCase(name) {
            let result = "";
            let words = name.split("-");
            for (let i = 0; i < words.length; i++) {
                let word = words[i].toLowerCase();
                if (i !== 0) {
                    word = word[0].toUpperCase() + word.slice(1, word.length);
                }
                result += word;
            }
            return result;
        }

        //将变量名称转换成"-"连接符形式
        function toHyphen(name) {
            let result = "";
            for (let i = 0; i < name.length; i++) {
                let c = name[i];
                if (i !== 0) {
                    if (c.match(/[A-Z]/g)) {
                        c = "-" + c.toLowerCase();
                    }
                }
                result += c;
            }
            return result;
        }

        //通过currentStyle得到样式
        function _getStyleforIE(dom, styleName) {
            let result = null;
            if (dom.currentStyle) {
                styleName = toHyphen(styleName);
                result = dom.currentStyle.getAttribute(styleName);
                if (!result) {
                    styleName = toCamelCase(styleName);
                    result = dom.currentStyle.getAttribute(styleName);
                }
            }
            return result;
        }

        //兼容所有浏览器的计算样式的方法
        function getElementComputedStyle(dom, styleName) {
            if (!(dom instanceof HTMLElement)) {
                return null;
            }
            if (typeof styleName !== "string") {
                return null;
            } else {
                styleName = styleName.replace(/\s/, "");
                if (styleName === "") {
                    return null;
                }
            }

            let style = null;

            if (document.defaultView) {
                let domStyles = document.defaultView.getComputedStyle(dom, null);
                styleName = toHyphen(styleName);
                style = domStyles.getPropertyValue(styleName);
                if (!style) {
                    if (dom.currentStyle) {
                        style = _getStyleforIE(dom, styleName);
                    }
                }
            } else if (dom.currentStyle) {
                style = _getStyleforIE(dom, styleName);
            }

            return style;
        }

        return getElementComputedStyle(dom, styleName);
    },

    /**
     * ios内容滚动时阻止默认事件，防止在ios中滑动弹框内部内容时导致页面body也发生滚动
     * eq:
     *      jade:
     *
     *      .drop-wrap
     *          .drop-container
     *
     *      js:
     *
     *          _tools.stopDrop('.drop-wrap');
     *
     *
     *
     * @param target    目标元素选择器
     */
    stopDrop: function(target) {
        let lastY; //最后一次y坐标点
        $(target).on("touchstart", function(event) {
            lastY = event.originalEvent.changedTouches[0].clientY; //点击屏幕时记录最后一次Y度坐标。
        });
        $(target).on("touchmove", function(event) {
            let y = event.originalEvent.changedTouches[0].clientY;
            let st = $(this).scrollTop(); //滚动条高度
            if (y >= lastY && st <= 0) {
                //如果滚动条高度小于0，可以理解为到顶了，且是下拉情况下，阻止touchmove事件。
                lastY = y;
                event.preventDefault();
            }

            //   console.log(st, $(this).height(), sh);

            if (
                y < lastY &&
                st + $(this).height() + 10 >=
                $(this)
                    .find(".drop-container")
                    .height()
            ) {
                // console.log("到底了");
                lastY = y;
                event.preventDefault();
            }

            lastY = y;
        });
    },
    /**
     * 将页面主要内容进行缩放，使得主要内容在任何手机屏幕都可以完全展示
     * @param psdHeight  设计稿的高度
     * @param cb  回调,接受参数：(当前元素，缩放比例，transformOrigin)
     */
    pageFit(psdHeight = 1500, cb) {
        let $scaleBox = $(".scaleBox");
        let winH = $(window).height();
        $scaleBox.each((index, item) => {
            console.log(index, item);
            let $item = $(item);
            let height = $item.data("height");

            let transformOrigin = $item.data("transform");
            transformOrigin = transformOrigin || "center center";
            let rate = height / psdHeight;
            let scaleBoxHeight = $item.height();

            console.log("元素高：", height, psdHeight, scaleBoxHeight);

            let scale = (winH * rate) / scaleBoxHeight;

            console.log(`元素：${$scaleBox}；缩放比例：${scale}`, scaleBoxHeight);

            if (!cb || (cb && cb($item, scale, transformOrigin) !== false)) {
                if (scale > 1) {
                    scale = 1;
                }

                if (scale < 0.8) {
                    scale = 0.8;
                }

                $item.css({
                    transformOrigin: transformOrigin,
                    transform: `scale(${scale})`
                });
            }
        });
    },
    /**
     * 禁用微信分享，隐藏非基础菜单
     */
    noShare: function() {
        // console.log('准备隐藏分享按钮，等待sdk加载完毕', window.WeixinJSBridge);
        let timer = setInterval(function() {
            if (window.WeixinJSBridge) {
                console.log("隐藏分享按钮");
                // 通过下面这个API隐藏右上角按钮
                window.WeixinJSBridge.call("hideOptionMenu");
                clearInterval(timer);
            }
        }, 100);
        document.addEventListener("WeixinJSBridgeReady", function onBridgeReady() {
            console.log("隐藏分享按钮");
            // 通过下面这个API隐藏右上角按钮
            window.WeixinJSBridge.call("hideOptionMenu");
        });
    },
    //微信分享初始化
    initShareFunc: function(successCallback) {
        function configShare(successCallback) {
            window.wx.ready(function() {
                let shareTitle = "学长学姐帮帮忙第四季"; //【微信分享好友的标题
                let shareWord = "学长学姐帮帮忙，帮你由内而外聊大学"; //【微信分享好友的描述
                let shareTitle2 = "学长学姐帮帮忙第四季"; //【微信分享朋友圈的标题
                let link = location.href.split("#")[0]; //【微信分享出去的链接地址
                let imgUrl =
                    link.split("#")[0].substring(0, link.lastIndexOf("/")) +
                    "/images/share-icon.jpeg"; //【微信分享图标路径
                //监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
                window.wx.onMenuShareTimeline({
                    title: shareTitle2,
                    desc: shareTitle2,
                    link: link,
                    imgUrl: imgUrl,
                    success: function() {
                        successCallback && successCallback();
                    }
                });
                //监听“分享给朋友”按钮点击、自定义分享内容及分享结果接口
                window.wx.onMenuShareAppMessage({
                    title: shareTitle,
                    desc: shareWord,
                    link: link,
                    imgUrl: imgUrl,
                    success: function() {
                        successCallback && successCallback();
                    }
                });
            });
            window.wx.error(function() {
                // alert(JSON.stringify(res))
            });
        }

        let url = location.href.split("#")[0];

        this.fetch({
            action:
            "//h5.wufae.com/wxapi/getwxconfig?sn=w05cc497025cdc1db&url=" +
            encodeURIComponent(url),
            isUrl: true
        }).then(result => {
            let config = result.Data;
            config.debug = false;
            config.jsApiList = [
                "onMenuShareTimeline",
                "onMenuShareAppMessage",
                "onMenuShareQQ"
            ];
            window.wx.config(config);
            configShare(successCallback);
        });

        return configShare;
    },
    computeCenterPoint(x, y, w, h) {
        return {
            x: w + x,
            y: h + y
        };
    },
    createWall(x, y, w, h) {
        return {
            x: this.computeCenterPoint(x, y, w, h).x,
            y: this.computeCenterPoint(x, y, w, h).y,
            w: w,
            h: h
        };
    },
    loadImgRes(src) {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.src = src;
            img.onload = function() {
                resolve(img);
            };
            img.onerror = function(...args) {
                reject(...args);
            };
        });
    },
    async createImageBitmap(src, canvas) {
        function computeRem(val) {
            return (val * canvas.width) / 2 / 375;
        }
        let img = await this.loadImgRes(src);
        let imgW = computeRem(img.width);
        let imgH = computeRem(img.height);
        let view = new window.createjs.Bitmap(img);
        console.log(imgW, imgH, img.width, img.height);
        view.scaleX = imgW / img.width;
        view.scaleY = imgH / img.height;
        return {
            bitmap: view,
            imgW: imgW,
            imgH: imgH,
            sourceImgW: img.width,
            sourceImgH: img.height
        };
    },
    /**
     * 根据大转盘中的奖品数量生成每个奖品所在角度区间信息
     * @param {*} awardNum
     */
    createLotteryInfo(awardNum = 6) {
        const awardDeg = {};
        const preAwardDeg = 360 / awardNum;
        const halfDeg = preAwardDeg / 2;

        for (let i = 0; i < awardNum; i++) {
            if (i === 0) {
                awardDeg[i + 1] = [360 - halfDeg, halfDeg];
            } else {
                let preDeg = 0,
                    curDeg = 0;
                if (i === 1) {
                    preDeg = halfDeg;
                    curDeg = preDeg + preAwardDeg;
                } else {
                    preDeg = halfDeg + preAwardDeg * (i - 1);
                    curDeg = preDeg + preAwardDeg;
                }
                awardDeg[i + 1] = [preDeg, curDeg];
            }
        }
        return awardDeg;
    },
    /**
     * 根据奖品角度信息列表和奖品类型获取目标角度
     * @param awardDeg
     * @param type
     * @returns {*|number}
     */
    getAwardDeg(awardDeg, type = 1) {
        let curAwardDegs = awardDeg[type];
        let awardNum = 6;
        let preAwardDeg = 360 / awardNum;
        let offset = preAwardDeg * 0.05;

        let min = curAwardDegs[0];
        let max = curAwardDegs[1];

        let rdDeg = 0;
        let res = 0;

        if (min > max) {
            let rdDeg1 = Math.floor(Math.random() * (360 - min) + min);
            let rdDeg2 = Math.floor(Math.random() * max);
            res = [rdDeg1, rdDeg2][Math.floor(Math.random() * 2)];
        } else {
            rdDeg = Math.floor(
                Math.random() * (curAwardDegs[1] - curAwardDegs[0]) + curAwardDegs[0]
            );

            res = Math.max(curAwardDegs[0] + offset, rdDeg);

            res = Math.min(curAwardDegs[1] - offset, res);
        }

        console.log("转动角度：", res);

        return res;
    },

    optionalChaining(obj, ...rest) {
        let tmp = obj;
        for (let key in rest) {
            let name = rest[key];
            tmp = tmp?.[name];
        }
        return tmp || "";
    },
    clipboard:{
        get(){
            return new Promise(async (resolve, reject) => {
                if(window?.wx?.getClipboardData){
                    window.wx.getClipboardData({
                        success(res) {
                            resolve(res.data);
                        },
                        fail(res) {
                            reject(res);
                        }
                    })
                }else{
                    // try{
                    //     const res = await clipboard.readText();
                    //     resolve(res);
                    // }catch (e) {
                    //     reject(e);
                    // }
                    reject(new Error('暂不支持读取黏贴板的内容'));
                }

            });
        },
        set(text){
            return new Promise((resolve, reject) => {
                if(window?.wx?.getClipboardData){
                    window.wx.setClipboardData({
                        data: text,
                        success(res) {
                            resolve(res);
                        },
                        fail(res) {
                            reject(res);
                        }
                    })
                }else{
                    clipboard.writeText(text).then(() => resolve()).catch(reason => reject(reason));
                }
            });
        }
    },
    groupBy(arr){

        return function (keyHandle) {
            const map = {};
            const provinceList = {};
            arr.forEach(item=>{
                const thisKey = `${keyHandle(item)}`;
                if(map[thisKey]){
                    map[thisKey].push(item);
                }else{
                    map[thisKey] = [item];
                }

                if(provinceList[item.province]){
                    provinceList[item.province].children.push(item);
                }else{
                    provinceList[item.province] = {
                        children: [item]
                    };
                }
            });
            return {
                all: map,
                provinceList
            };
        }
    }
};


export function resetFontSize() {
    (function() {
        if (typeof window.WeixinJSBridge == "object" && typeof window.WeixinJSBridge.invoke == "function") {
            handleFontSize();
        } else {
            if (document.addEventListener) {
                document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
            } else if (document.attachEvent) {
                document.attachEvent("WeixinJSBridgeReady", handleFontSize);
                document.attachEvent("onWeixinJSBridgeReady", handleFontSize);
            }
        }

        function handleFontSize() {
            console.log('微信sdk加载完毕');
            // 设置网页字体为默认大小
            window.WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize' : 0 });
            // 重写设置网页字体大小的事件
            window.WeixinJSBridge.on('menu:setfont', function() {
                console.log('设置字体');
                window.WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize' : 0 });
            });
        }
    })();
}

export default _tools;
