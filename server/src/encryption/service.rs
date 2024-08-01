extern crate aes;
extern crate block_modes;
extern crate block_padding;
extern crate base64;
extern crate brotli;

use aes::Aes128;
use block_modes::{BlockMode, Cbc};
use block_modes::block_padding::Pkcs7;
use base64::{encode, decode};
use brotli::CompressorWriter;
use brotli::Decompressor;
use std::io::{Write, Read, Cursor};

type Aes128Cbc = Cbc<Aes128, Pkcs7>;

fn extend_key(key: &str) -> Vec<u8> {
    let mut extended_key = key.repeat(16 / key.len());
    extended_key.truncate(16);
    extended_key.into_bytes()
}

fn compress_data(data: &str) -> Vec<u8> {
    let mut compressor = CompressorWriter::new(Vec::new(), 4096, 11, 22);
    compressor.write_all(data.as_bytes()).unwrap();
    compressor.into_inner()
}

fn decompress_data(data: &[u8]) -> String {
    let mut decompressed_data = Vec::new();
    let mut decompressor = Decompressor::new(Cursor::new(data), 4096);
    decompressor.read_to_end(&mut decompressed_data).unwrap();
    String::from_utf8(decompressed_data).unwrap()
}

fn encrypt(data: &[u8], key: &[u8], iv: &[u8]) -> String {
    let cipher = Aes128Cbc::new_from_slices(key, iv).unwrap();
    let ciphertext = cipher.encrypt_vec(data);
    encode(&ciphertext)
}

fn decrypt(encoded_data: &str, key: &[u8], iv: &[u8]) -> Vec<u8> {
    let cipher = Aes128Cbc::new_from_slices(key, iv).unwrap();
    let decoded_data = decode(encoded_data).unwrap();
    cipher.decrypt_vec(&decoded_data).unwrap()
}

pub fn compress_and_encrypt(data: &str, key: &str, iv: &[u8]) -> String {
    let extended_key = extend_key(key);
    let compressed_data = compress_data(data);
    let encrypted_data = encrypt(&compressed_data, &extended_key, iv);
    encrypted_data
}

pub fn decompress_and_decrypt(encrypted_data: &str, key: &str, iv: &[u8]) -> String {
    let extended_key = extend_key(key);
    let decrypted_data = decrypt(encrypted_data, &extended_key, iv);
    let decompressed_data = decompress_data(&decrypted_data);
    decompressed_data
}
