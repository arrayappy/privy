"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compress = compress;
exports.decompress = decompress;
const zlib_1 = __importDefault(require("zlib"));
function compress(data) {
    return zlib_1.default.brotliCompressSync(Buffer.from(data, 'utf8'));
}
function decompress(data) {
    return zlib_1.default.brotliDecompressSync(data).toString('utf8');
}
