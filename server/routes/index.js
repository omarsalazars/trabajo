const express = require('express');
const router = express.Router();
const url = require('url');


router.get('/',(req,res)=>{
    res.send(req.hostname);
});

module.exports = router;