"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
var bull_1 = __importDefault(require("bull"));
var date_fns_tz_1 = require("date-fns-tz");
var order_interface_1 = require("../../repository/order/order.interface");
var drive_interface_1 = require("../../repository/driver/drive.interface");
var driver_pickup_service_1 = require("../driver-pickup/driver_pickup.service");
var BOOKING_QUEUE_NAME = 'aloxe_booking';
var bookingQueue = new bull_1.default(BOOKING_QUEUE_NAME);
var BookingService = (function () {
    function BookingService(orderRepo, driverRepo, customerRepo) {
        var _this = this;
        this.driverPickingStrategy = new driver_pickup_service_1.DriverPickingStrategy(new driver_pickup_service_1.DriverPickingBasedLocationAndState());
        this.setRealtimeService = function (realtimeSvc) {
            _this.realtimeSvc = realtimeSvc;
        };
        this.handleAssignDriverForBooking = function (order) { return __awaiter(_this, void 0, void 0, function () {
            var availableDrivers, _a, driver, minDistance, totalPrice, updateOrderDto_1, updateOrderDto, updateOrderResp, error_1, updateDriverLoginSessionDto;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, this.driverRepo.getAvailableDrivers(order.orderDetail.vehicleType)];
                    case 1:
                        availableDrivers = _b.sent();
                        if (!availableDrivers || availableDrivers.length === 0) {
                            return [2, {
                                    driver: { id: 0 },
                                    minDistance: 0,
                                    totalPrice: 0,
                                    status: 'DRIVER_NOT_FOUND'
                                }];
                        }
                        return [4, this.driverPickingStrategy.pickup(order, availableDrivers)];
                    case 2:
                        _a = _b.sent(), driver = _a.driver, minDistance = _a.minDistance, totalPrice = _a.totalPrice;
                        if (!!driver) return [3, 5];
                        console.log('driver-----', driver);
                        return [4, this.realtimeSvc.broadcast('test_evt', JSON.stringify({ test: 'test' }))];
                    case 3:
                        _b.sent();
                        updateOrderDto_1 = {
                            id: order.id,
                            status: order_interface_1.OrderStatus.DRIVER_NOT_FOUND
                        };
                        return [4, this.orderRepo.updateOrder(updateOrderDto_1)];
                    case 4:
                        _b.sent();
                        return [2, null];
                    case 5:
                        updateOrderDto = {
                            id: order.id,
                            driverId: driver.id,
                            status: order_interface_1.OrderStatus.DRIVER_FOUND,
                            totalPrice: totalPrice
                        };
                        _b.label = 6;
                    case 6:
                        _b.trys.push([6, 8, , 9]);
                        return [4, this.orderRepo.updateOrder(updateOrderDto)];
                    case 7:
                        updateOrderResp = _b.sent();
                        console.log('updateOrderResp-----', updateOrderResp);
                        return [3, 9];
                    case 8:
                        error_1 = _b.sent();
                        console.log('error-----', error_1);
                        return [3, 9];
                    case 9:
                        updateDriverLoginSessionDto = {
                            driverId: driver.id,
                            workingStatus: drive_interface_1.DriverOnlineSessionWorkingStatusEnum.DRIVING
                        };
                        return [4, this.driverRepo.updateDriverOnlineSession(updateDriverLoginSessionDto)];
                    case 10:
                        _b.sent();
                        return [2, {
                                driver: driver,
                                minDistance: minDistance,
                                totalPrice: totalPrice,
                                status: 'DRIVER_FOUND'
                            }];
                }
            });
        }); };
        this.orderRepo = orderRepo;
        this.driverRepo = driverRepo;
        this.customerRepo = customerRepo;
    }
    BookingService.prototype.processBookingOrderPub = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var delayInMilliseconds, nowInVN, startTimeInVN;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        delayInMilliseconds = 0;
                        if (input.startTime) {
                            nowInVN = (0, date_fns_tz_1.toZonedTime)(new Date(), 'Asia/Ho_Chi_Minh');
                            startTimeInVN = (0, date_fns_tz_1.toZonedTime)(new Date(input.startTime), 'Asia/Ho_Chi_Minh');
                            delayInMilliseconds = startTimeInVN.getTime() - nowInVN.getTime();
                        }
                        return [4, bookingQueue.add(input, { delay: delayInMilliseconds })];
                    case 1:
                        _a.sent();
                        return [2, null];
                }
            });
        });
    };
    BookingService.prototype.processBookingOrderSub = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, bookingQueue.process(function (job, done) { return __awaiter(_this, void 0, void 0, function () {
                            var input, resp, customer, error_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 3, , 4]);
                                        input = job.data;
                                        return [4, this.handleAssignDriverForBooking(input)];
                                    case 1:
                                        resp = _a.sent();
                                        console.log('resp-------', resp);
                                        if (!(resp === null || resp === void 0 ? void 0 : resp.driver) || resp.driver.id === 0) {
                                            this.realtimeSvc.broadcast(input.id.toString(), JSON.stringify(resp));
                                            done();
                                            return [2];
                                        }
                                        if (input.supportStaffId) {
                                            this.realtimeSvc.broadcast(input.supportStaffId.toString(), 'Hello');
                                        }
                                        return [4, this.customerRepo.getCustomer(input.customerId)];
                                    case 2:
                                        customer = _a.sent();
                                        if (customer) {
                                            this.realtimeSvc.broadcast(input.id.toString(), 'Hello');
                                            this.realtimeSvc.broadcast(resp.driver.id.toString(), JSON.stringify({
                                                message: 'Bạn có 1 đơn đặt xe',
                                                booking: __assign(__assign({}, input), { status: 'DRIVER_FOUND', minDistance: resp.minDistance }),
                                                customer: {
                                                    fullName: customer.user.fullName,
                                                    phoneNumber: customer.user.phoneNumber
                                                }
                                            }));
                                        }
                                        done();
                                        return [3, 4];
                                    case 3:
                                        error_2 = _a.sent();
                                        console.log('error------', error_2);
                                        done();
                                        return [3, 4];
                                    case 4: return [2];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    return BookingService;
}());
exports.BookingService = BookingService;
//# sourceMappingURL=booking.service.js.map