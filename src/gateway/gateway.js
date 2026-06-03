const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3000;

const lockerServiceUrl = "http://localhost:3001";
const deliveryServiceUrl = "http://localhost:3002";
const residentServiceUrl = "http://localhost:3003";
const loggerServiceUrl = "http://localhost:3004";

app.use(createProxyMiddleware({ target: lockerServiceUrl, pathFilter: '/locker/**' }));
app.use(createProxyMiddleware({ target: deliveryServiceUrl, pathFilter: '/delivery/**' }));
app.use(createProxyMiddleware({ target: residentServiceUrl, pathFilter: '/resident/**' }));
app.use(createProxyMiddleware({ target: loggerServiceUrl, pathFilter: '/log/**' }));

app.listen(PORT, () => {
  console.log(`\n🌐 [Gateway] Rodando na porta ${PORT}`);
  console.log(`   ├── /locker    → ${lockerServiceUrl}`);
  console.log(`   ├── /delivery  → ${deliveryServiceUrl}`);
  console.log(`   ├── /resident  → ${residentServiceUrl}`);
  console.log(`   └── /log       → ${loggerServiceUrl}\n`);
});
