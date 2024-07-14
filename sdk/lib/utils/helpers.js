"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compSymEnc = compSymEnc;
exports.decompSymDec = decompSymDec;
exports.compAsymEnc = compAsymEnc;
exports.decompAsymDec = decompAsymDec;
const asymmetric = __importStar(require("./asymmetric"));
const symmetric = __importStar(require("./symmetric"));
const compression = __importStar(require("./compression"));
function compSymEnc(data, key, iv) {
    const compressedData = compression.compress(data);
    const encryptedData = symmetric.encrypt(compressedData, key, iv);
    return encryptedData;
}
function decompSymDec(encryptedData, key, iv) {
    const decryptedData = symmetric.decrypt(encryptedData, key, iv);
    const decompressedData = compression.decompress(decryptedData);
    return decompressedData;
}
function compAsymEnc(data, publicKey) {
    const compressedData = compression.compress(data);
    const encryptedData = asymmetric.encrypt(compressedData, publicKey);
    return encryptedData;
}
function decompAsymDec(encryptedData, privateKey) {
    const decryptedData = asymmetric.decrypt(encryptedData, privateKey);
    const decompressedData = compression.decompress(decryptedData);
    return decompressedData;
}
