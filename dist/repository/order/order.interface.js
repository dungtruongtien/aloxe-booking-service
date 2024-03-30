"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    OrderStatus[OrderStatus["DRIVER_CONFIRMED"] = 1] = "DRIVER_CONFIRMED";
    OrderStatus[OrderStatus["CANCELLED"] = 2] = "CANCELLED";
    OrderStatus[OrderStatus["ARRIVED"] = 3] = "ARRIVED";
    OrderStatus[OrderStatus["PAID"] = 4] = "PAID";
    OrderStatus[OrderStatus["ONBOARDING"] = 5] = "ONBOARDING";
    OrderStatus[OrderStatus["BOOKED"] = 6] = "BOOKED";
    OrderStatus[OrderStatus["DRIVER_NOT_FOUND"] = 7] = "DRIVER_NOT_FOUND";
    OrderStatus[OrderStatus["DRIVER_FOUND"] = 7] = "DRIVER_FOUND";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
//# sourceMappingURL=order.interface.js.map