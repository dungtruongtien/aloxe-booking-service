"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSocketServer = exports.createHttpServer = exports.createApp = void 0;
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var api_route_1 = require("./routes/api.route");
var HTTP_SERVER;
var SOCKET_SERVER;
var createApp = function () {
    var app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(function (err, req, res, next) {
        if (!err.status || (err.status >= 500 && err.status <= 599)) {
            err.status = 500;
            err.name = 'INTERNAL_ERROR';
            err.message = 'Internal error';
        }
        res.status(err.status).json({
            name: err.name,
            message: err.message,
            data: null,
            status: err.name
        });
    });
    return app;
};
exports.createApp = createApp;
function createHttpServer() {
    if (!HTTP_SERVER) {
        var rootRouter = (0, api_route_1.createRootRoute)();
        var app = (0, exports.createApp)();
        app.use('/api', rootRouter);
        HTTP_SERVER = http_1.default.createServer(app);
    }
    return HTTP_SERVER;
}
exports.createHttpServer = createHttpServer;
function createSocketServer() {
    if (!SOCKET_SERVER) {
        var app = (0, exports.createApp)();
        SOCKET_SERVER = http_1.default.createServer(app);
    }
    return SOCKET_SERVER;
}
exports.createSocketServer = createSocketServer;
//# sourceMappingURL=server.js.map