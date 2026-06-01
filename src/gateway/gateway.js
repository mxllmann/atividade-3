const express = require('express');
const router = express.Router();
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3000;

const lockerServiceUrl = "http://localhost:3001";
const deliveryServiceUrl = "http://localhost:3002";
const residentServiceUrl = "http://localhost:3003";
const loggerServiceUrl = "http://localhost:3004";

app.use('/locker', createProxyMiddleware({ target: lockerServiceUrl }));
app.use('/delivery', createProxyMiddleware({ target: deliveryServiceUrl }));
app.use('/resident', createProxyMiddleware({ target: residentServiceUrl }));
app.use('/logger', createProxyMiddleware({ target: loggerServiceUrl }));

app.listen(PORT, () => {
  console.log(`Gateway rodando na porta ${PORT}`);
});