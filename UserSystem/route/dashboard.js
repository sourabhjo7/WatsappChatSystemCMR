const express = require("express");
const router = express.Router();

//Requring Controllers
const controller = require('../controller/dashboard');

//importing custom middlewares
const {valToken, isAdmin, isAdminOrManager} = require("../middleware/auth");

//Dashboard route
router.get("/", valToken, controller.home);

//Getting all agents route
router.get("/agents", valToken, isAdminOrManager, controller.agents);

//Getting specific user route
router.post("/indi_user", controller.indiUser);

//Getting all managers route
router.get("/managers", valToken, isAdmin, controller.managers);

//Deleteing user from database
router.post("/del_agent", valToken, isAdminOrManager, controller.delAgent);

//Deleteing manager from database
router.post("/del_manager", valToken, isAdmin, controller.delManager);

//change the name of the specific user
router.post("/change_name", valToken, controller.changeName);

//change the password of the specific user
router.post("/change_password", valToken, controller.changePassword);

//handling new escalation
router.post("/new_escalation", valToken, controller.newEscatation);

//getting all the escalations on a specific manager
router.post("/get_escalations", valToken, controller.getEscatations);


module.exports = router
