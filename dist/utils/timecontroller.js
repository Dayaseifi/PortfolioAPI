"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeController = void 0;
const jalali_moment_1 = __importDefault(require("jalali-moment"));
function timeController(startYear, endYear, startMonth, endMonth) {
    const currentDate = (0, jalali_moment_1.default)().locale('fa');
    const currentYear = currentDate.jYear();
    const currentMonth = currentDate.jMonth() + 1;
    const yearFalseCondition = startYear > endYear;
    const monthFalseCondition = (startYear === endYear && startMonth > endMonth);
    if (yearFalseCondition || monthFalseCondition) {
        return {
            success: false,
            Problem: "Now"
        };
    }
    if (startYear > currentYear || (startYear === currentYear && startMonth > currentMonth)) {
        return {
            success: false,
            Problem: "Feature"
        };
    }
    return {
        success: true
    };
}
exports.timeController = timeController;
