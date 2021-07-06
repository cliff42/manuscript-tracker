const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
    res.send('API works!');
});

// TODO: get real list from mongoDB
router.get('/manuscripts', function (req, res) {
    const tempList = [
        {
            name: "Manuscript 1"
        },
        {
            name: "Manuscript 2"
        }
    ]
    res.send(tempList);
});

module.exports = router;