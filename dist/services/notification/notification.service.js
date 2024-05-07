"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NotificationService = (function () {
    function NotificationService() {
        var _this = this;
        this.setRealtimeService = function (realtimeSvc) {
            _this.realtimeSvc = realtimeSvc;
        };
        this.broadcast = function (msgId, content) {
            _this.realtimeSvc.broadcast(msgId, content);
        };
    }
    return NotificationService;
}());
exports.default = NotificationService;
//# sourceMappingURL=notification.service.js.map