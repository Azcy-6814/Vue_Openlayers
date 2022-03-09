/*
 * @Author: your name
 * @Date: 2022-02-18 09:45:15
 * @LastEditTime: 2022-03-03 16:09:35
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \sail-vue3\vue.config.js
 */
module.exports = {
    publicPath:"./",
    lintOnSave: false, //关闭eslint
    outputDir: 'dist',
    css: {
        loaderOptions: {
            sass: {
                // additionalData: `@import '~@/assets/style/public.scss';`,
            },
            less: {
                lessOptions: {
                  // important extra layer for less-loader^6.0.0
                  javascriptEnabled: true
                }
            }
        }
    },
    configureWebpack: {
        devtool: 'source-map'

    },
    chainWebpack: (config) => {
        // 修复HMR
        config.resolve.symlinks(true);
    },
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: true,
    devServer: {
        port: 8080, // 端口
        open: true, // 自动开启浏览器
        compress: false, // 开启压缩
        proxy: {
            '/api': {
                target: "http://10.51.103.223:8082",
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/api'
                }
            }
        },
        overlay: {
            warnings: false,
            errors: false
        }

    }
}