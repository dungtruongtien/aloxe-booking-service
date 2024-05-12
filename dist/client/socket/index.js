"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeSvc = void 0;
var socket_io_1 = require("socket.io");
var server_1 = require("../../server");
var GLOBAL_SOCKET_IO;
var RealtimeSvc = (function () {
    function RealtimeSvc() {
        var _this = this;
        this.connect = function () {
            _this.socketio = new socket_io_1.Server(_this.server, {
                cors: {
                    origin: '*'
                }
            });
        };
        this.onConnection = function () {
            if (!_this.socketio) {
                _this.connect();
            }
            _this.socketio.on('connection', function (socket) {
                console.log('socket-----', socket);
                console.log('a user connected');
            });
        };
        this.broadcast = function (evt, msg) {
            if (!_this.socketio) {
                _this.connect();
            }
            _this.socketio.emit(evt, msg);
        };
        this.listen = function (evt, callback) {
            if (!_this.socketio) {
                _this.connect();
            }
            _this.socketio.emit(evt, callback);
        };
        if (!GLOBAL_SOCKET_IO) {
            GLOBAL_SOCKET_IO = new socket_io_1.Server((0, server_1.createSocketServer)(), {
                path: '/realtime/booking-notify',
                cors: {
                    origin: '*'
                }
            });
            this.socketio = GLOBAL_SOCKET_IO;
            this.socketio.engine.on('connection_error', function (err) {
                console.log(err.req);
                console.log(err.code);
                console.log(err.message);
                console.log(err.context);
            });
            this.onConnection();
        }
    }
    return RealtimeSvc;
}());
exports.RealtimeSvc = RealtimeSvc;
//# sourceMappingURL=index.js.map