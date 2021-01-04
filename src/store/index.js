import Vue from 'vue'
import Vuex from 'vuex'

import {getInitData} from "../service"

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        initData: {
            userName: "kiner"
        }
    },
    getters: {
        initData: state => state.initData
    },
    mutations: {
        saveInitData(state, initData) {
            console.log('保存数据', initData);
            state.initData = initData;
        }
    },
    actions: {
        async saveInitData({commit}, params) {
            try{
                let res = await getInitData(params)
                console.log('获取接口数据', res);
                commit("saveInitData", res.data);
            }catch (e) {
                console.error("接口请求异常:",e.message);
            }

        }
    }
})
