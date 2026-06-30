const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const controller = require("../controllers/notification.controller");
const { notificationValidation } = require("../validators/notification.validator");

router.get("/", auth, controller.getAll);
router.get("/unread-count", auth, controller.unreadCount);
router.post("/", auth, notificationValidation, controller.create);
router.put("/read-all", auth, controller.readAll);
router.put("/read/:id", auth, controller.read);
router.delete("/:id", auth, controller.delete);

module.exports = router;
