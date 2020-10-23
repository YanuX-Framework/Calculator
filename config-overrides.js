module.exports = {
    webpack: function (config, env) {
        config.devtool = 'source-map'
        config.module.rules.push({ enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' })

        return config
    }
}