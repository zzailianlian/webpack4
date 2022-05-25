/**
 * 验证文件的强缓存
 */

// eslint-disable-next-line import/no-extraneous-dependencies
const express = require('express');

const app = express();

app.use(express.static('../dist', { maxAge: 1000 * 3600 }));

app.listen(3500);
