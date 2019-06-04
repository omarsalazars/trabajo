const express = require('express');
const router = express.Router();
const url = require('url');


router.get('/',(req,res)=>{
    res.send('El beris se la come en '+req.headers.host);
});

module.exports = router;