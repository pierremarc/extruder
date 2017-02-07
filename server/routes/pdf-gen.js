const express = require('express');
const fs = require('fs');
const op = require('../lib/operation');
const ContextPDF = require('../lib/ctx-pdf').default;

console.log(ContextPDF);

const router = express.Router();


router.post('/', function(req, res, next) {
    const body = req.body;
    const options = {
        width: body.width,
        height: body.height,
        stream: res,
    }
    const ctx = new ContextPDF(options);
    res.set('Content-Type', 'application/pdf');
    op.render(ctx, body.operations);
    ctx.end();
});

module.exports = router;
