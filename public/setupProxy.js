const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://s3.eu-west-2.amazonaws.com",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "/interview.mock.data",
      },
    })
  );
};
