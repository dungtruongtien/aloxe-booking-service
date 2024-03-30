"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var booking_route_1 = __importDefault(require("./booking.route"));
var router = express_1.default.Router();
router.use('/booking', booking_route_1.default);
exports.default = router;
//# sourceMappingURL=api.route.js.map