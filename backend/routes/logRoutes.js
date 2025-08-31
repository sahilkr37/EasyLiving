
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/logController");

router.post("/", ctrl.createLog);
router.get("/", ctrl.getLogs);
router.delete("/:id", ctrl.deleteLog);

module.exports = router;
