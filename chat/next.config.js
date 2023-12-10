/** @type {import('next').NextConfig} */
module.exports = {
    serverRuntimeConfig: {
        // 在这里配置你的服务器选项
        // 指定公网 IP 和端口号
        // 例如，使用公网 IP 0.0.0.0 和端口号 3000
        // 修改 HOST 和 PORT 变量以适应你的需求
        HOST: '0.0.0.0',
        PORT: 3000,
    },
};
