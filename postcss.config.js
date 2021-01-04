module.exports = {
    plugins: {
        'postcss-px2rem': {
            remUnit: 64
        },
        'postcss-design-convert': {
            multiple: 2,
            units: ['rem'],
            selector: /^\.cube-/
        }
    }
}
