const { Router } = require("express");
const usersCtrl = require("../controllers/users.js");

const router = Router();

router.post("/", usersCtrl.createUser);

router.get("/", usersCtrl.getUser);

router.get("/:id", usersCtrl.getSingleUser);

router.put("/:id", usersCtrl.updatetSingleUser);

router.patch("/:id/skills/add", usersCtrl.addSkillsToUser);

router.delete("/:id", usersCtrl.deleteUser);

module.exports = router;
