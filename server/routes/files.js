const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');

router.get('/:category/:folder/:file', (req, res) => {

    let category = req.params.category;
    let folder = req.params.folder;
    let file = req.params.file;

    let pathFile = path.resolve(__dirname, `../uploads/${ category }/${ folder }/${ file }`);
    console.log(pathFile);

    if (fs.existsSync(pathFile)) {
        res.sendFile(pathFile);
    } else {
        res.send("NO EXISTE ESE ARCHIVO");
    }

});

module.exports = router;