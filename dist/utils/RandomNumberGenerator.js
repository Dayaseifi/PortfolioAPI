"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomNumberString = void 0;
function generateRandomNumberString(length) {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
exports.generateRandomNumberString = generateRandomNumberString;
