"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotificationRoute = void 0;
var express_1 = __importDefault(require("express"));
var notification_controller_rest_1 = __importDefault(require("../controller/notification/notification.controller.rest"));
var createNotificationRoute = function () {
    var router = express_1.default.Router();
    var notificationRestController = new notification_controller_rest_1.default();
    router.post('/broadcast', notificationRestController.broadcast.bind(notificationRestController));
    return router;
};
exports.createNotificationRoute = createNotificationRoute;
//# sourceMappingURL=notification.route.js.map