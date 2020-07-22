const express = require('express');
const router = express.Router();

router.get('/',(req,res) => {
    res.send("reporte para proveedor");
});

module.exports = router;