import zlib from "zlib";

function compress(data: string): Buffer {
    return zlib.brotliCompressSync(Buffer.from(data, 'utf8'));
}

function decompress(data: Buffer): string {
    return zlib.brotliDecompressSync(data).toString('utf8');
}

export {
    compress,
    decompress
}
