const express = require('express');

const router = express.Router();

const Manuscript = require('../models/Manuscript');

router.get('/', function (req, res) {
    res.send('API works!');
});

// TODO: get real list from mongoDB
router.get('/manuscripts', async (req, res) => {
    try {
        let manuscripts = await Manuscript.find();
        res.status(200).send(manuscripts);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

module.exports = router;