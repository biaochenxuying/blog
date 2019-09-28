const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './src/main.ts',
    output: {
        libraryTarget: 'umd',
        library: 'EmployeeQuery'
    },
    externals: [nodeExternals()],
    plugins: [
        new CleanWebpackPlugin()
    ]
}
