"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
var socket_1 = require("../client/socket");
var BaseService = (function () {
    function BaseService() {
        this.realtimeSvc = new socket_1.RealtimeSvc();
    }
    return BaseService;
}());
exports.BaseService = BaseService;
//# sourceMappingURL=base.service.js.map