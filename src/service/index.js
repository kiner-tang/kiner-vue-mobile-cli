import _ from "../utils/_tools";

export const getInitData = () => {
    return new Promise(((resolve, reject) => {
        setTimeout(()=>{

            let num = Math.random()*10;

            if(num<=5){
                resolve({
                    status: 0,
                    code: 0,
                    msg: "请求成功",
                    data: {
                        userName: "kanger"
                    }
                });
            }else{
                reject(new Error("接口请求失败"));
            }


        },3000);

    }))
};