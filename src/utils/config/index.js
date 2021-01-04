import dev from './dev.config';
import test from './test.config';
import prod from './prod.config';

const env = process.env.NODE_ENV;

let config;

if(env==="dev"){
    config = dev;
}else if(env==="test"){
    config = test;
}else{
    config = prod;
}

config.env = env;

export default config;
