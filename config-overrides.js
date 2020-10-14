const FilterWarningsPlugin = require('webpack-filter-warnings-plugin')

module.exports = {
    webpack: function (config, env) {
        //TODO: Check if this is still needed.
        config.devtool = 'source-map'
        config.module.rules.push({ enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' })
        
        //TODO: Remove since it seems to no longer be needed.
        //config.plugins.push(new FilterWarningsPlugin({ exclude: /Failed to parse source map/ }))
        //config.stats = { warningsFilter: [/Failed to parse source map/] }
        
        return config
    }
}