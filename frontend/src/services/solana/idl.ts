/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/privy.json`.
 */
export type Privy = {
  "address": "dev4SsuWeMh6eYUk4QdhjFdDQRiVqjVM5m55LpR6TEQ",
  "metadata": {
    "name": "privy",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addTokens",
      "discriminator": [
        28,
        218,
        30,
        209,
        175,
        155,
        153,
        240
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "privyUser",
          "writable": true
        },
        {
          "name": "privyConfig",
          "writable": true
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "additionalLamports",
          "type": "u64"
        }
      ]
    },
    {
      "name": "allocateSpace",
      "discriminator": [
        24,
        96,
        202,
        32,
        67,
        1,
        233,
        136
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "privyUser",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "computedSpace",
          "type": "u32"
        }
      ]
    },
    {
      "name": "createCategory",
      "discriminator": [
        220,
        242,
        238,
        47,
        228,
        219,
        223,
        230
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "privyUser",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "catName",
          "type": "string"
        },
        {
          "name": "passkey",
          "type": "string"
        },
        {
          "name": "enabled",
          "type": "bool"
        },
        {
          "name": "singleMsg",
          "type": "bool"
        }
      ]
    },
    {
      "name": "createUser",
      "discriminator": [
        108,
        227,
        130,
        130,
        252,
        109,
        75,
        218
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "privyUser",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  105,
                  118,
                  121,
                  45,
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "privyConfig",
          "writable": true
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "username",
          "type": "string"
        },
        {
          "name": "passkey",
          "type": "string"
        },
        {
          "name": "depositLamports",
          "type": "u64"
        }
      ]
    },
    {
      "name": "deleteCategory",
      "discriminator": [
        19,
        234,
        11,
        181,
        69,
        210,
        190,
        82
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "privyUser",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "catIdx",
          "type": "u32"
        }
      ]
    },
    {
      "name": "initializePrivyConfig",
      "discriminator": [
        157,
        44,
        81,
        62,
        54,
        87,
        155,
        171
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "privyConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  105,
                  118,
                  121,
                  45,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "tokensPerSol",
          "type": "u32"
        }
      ]
    },
    {
      "name": "insertMessage",
      "discriminator": [
        63,
        70,
        96,
        204,
        145,
        4,
        147,
        247
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "privyConfig",
          "writable": true
        },
        {
          "name": "privyUser",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "catIdx",
          "type": "u32"
        },
        {
          "name": "passkey",
          "type": "string"
        },
        {
          "name": "message",
          "type": "string"
        }
      ]
    },
    {
      "name": "updateCategory",
      "discriminator": [
        249,
        192,
        204,
        253,
        57,
        132,
        107,
        44
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "privyUser",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "catIdx",
          "type": "u32"
        },
        {
          "name": "catName",
          "type": "string"
        },
        {
          "name": "passkey",
          "type": "string"
        },
        {
          "name": "enabled",
          "type": "bool"
        },
        {
          "name": "singleMsg",
          "type": "bool"
        }
      ]
    },
    {
      "name": "updatePrivyConfig",
      "discriminator": [
        134,
        172,
        68,
        221,
        44,
        25,
        70,
        227
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "privyConfig",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "tokensPerSol",
          "type": "u32"
        }
      ]
    },
    {
      "name": "updateUsername",
      "discriminator": [
        233,
        103,
        45,
        8,
        250,
        100,
        216,
        251
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "privyUser",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "username",
          "type": "string"
        }
      ]
    },
    {
      "name": "withdrawBalance",
      "discriminator": [
        140,
        79,
        65,
        53,
        68,
        73,
        241,
        211
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "privyConfig",
          "writable": true
        },
        {
          "name": "owner"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "privyConfig",
      "discriminator": [
        140,
        170,
        82,
        111,
        237,
        1,
        223,
        208
      ]
    },
    {
      "name": "privyUser",
      "discriminator": [
        147,
        197,
        233,
        66,
        128,
        184,
        87,
        190
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unauthorized",
      "msg": "Unauthorized."
    },
    {
      "code": 6001,
      "name": "tokenLimitExceeded",
      "msg": "Token limit exceeded"
    },
    {
      "code": 6002,
      "name": "messagesDisabled",
      "msg": "Disabled receiving messages."
    },
    {
      "code": 6003,
      "name": "invalidCategoryIndex",
      "msg": "Invalid category index"
    },
    {
      "code": 6004,
      "name": "tokenLimitUnderflow",
      "msg": "Token limit underflow"
    },
    {
      "code": 6005,
      "name": "categoryNotFound",
      "msg": "Category not found"
    },
    {
      "code": 6006,
      "name": "invalidPasskey",
      "msg": "Invalid passkey"
    },
    {
      "code": 6007,
      "name": "categoryDisabled",
      "msg": "Category disabled"
    }
  ],
  "types": [
    {
      "name": "category",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "catName",
            "type": "string"
          },
          {
            "name": "passkey",
            "type": "string"
          },
          {
            "name": "enabled",
            "type": "bool"
          },
          {
            "name": "singleMsg",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "privyConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "tokensPerSol",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "privyUser",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "username",
            "type": "string"
          },
          {
            "name": "tokenLimit",
            "type": "u16"
          },
          {
            "name": "categories",
            "type": {
              "vec": {
                "option": {
                  "defined": {
                    "name": "category"
                  }
                }
              }
            }
          },
          {
            "name": "messages",
            "type": {
              "vec": "string"
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};


/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/privy.json`.
 */
export const IDL: Privy = {
  "address": "dev4SsuWeMh6eYUk4QdhjFdDQRiVqjVM5m55LpR6TEQ",
  "metadata": {
    "name": "privy",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addTokens",
      "discriminator": [
        28,
        218,
        30,
        209,
        175,
        155,
        153,
        240
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "privyUser",
          "writable": true
        },
        {
          "name": "privyConfig",
          "writable": true
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "additionalLamports",
          "type": "u64"
        }
      ]
    },
    {
      "name": "allocateSpace",
      "discriminator": [
        24,
        96,
        202,
        32,
        67,
        1,
        233,
        136
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "privyUser",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "computedSpace",
          "type": "u32"
        }
      ]
    },
    {
      "name": "createCategory",
      "discriminator": [
        220,
        242,
        238,
        47,
        228,
        219,
        223,
        230
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "privyUser",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "catName",
          "type": "string"
        },
        {
          "name": "passkey",
          "type": "string"
        },
        {
          "name": "enabled",
          "type": "bool"
        },
        {
          "name": "singleMsg",
          "type": "bool"
        }
      ]
    },
    {
      "name": "createUser",
      "discriminator": [
        108,
        227,
        130,
        130,
        252,
        109,
        75,
        218
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "privyUser",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  105,
                  118,
                  121,
                  45,
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "privyConfig",
          "writable": true
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "username",
          "type": "string"
        },
        {
          "name": "passkey",
          "type": "string"
        },
        {
          "name": "depositLamports",
          "type": "u64"
        }
      ]
    },
    {
      "name": "deleteCategory",
      "discriminator": [
        19,
        234,
        11,
        181,
        69,
        210,
        190,
        82
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "privyUser",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "catIdx",
          "type": "u32"
        }
      ]
    },
    {
      "name": "initializePrivyConfig",
      "discriminator": [
        157,
        44,
        81,
        62,
        54,
        87,
        155,
        171
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "privyConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  105,
                  118,
                  121,
                  45,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "tokensPerSol",
          "type": "u32"
        }
      ]
    },
    {
      "name": "insertMessage",
      "discriminator": [
        63,
        70,
        96,
        204,
        145,
        4,
        147,
        247
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "privyConfig",
          "writable": true
        },
        {
          "name": "privyUser",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "catIdx",
          "type": "u32"
        },
        {
          "name": "passkey",
          "type": "string"
        },
        {
          "name": "message",
          "type": "string"
        }
      ]
    },
    {
      "name": "updateCategory",
      "discriminator": [
        249,
        192,
        204,
        253,
        57,
        132,
        107,
        44
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "privyUser",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "catIdx",
          "type": "u32"
        },
        {
          "name": "catName",
          "type": "string"
        },
        {
          "name": "passkey",
          "type": "string"
        },
        {
          "name": "enabled",
          "type": "bool"
        },
        {
          "name": "singleMsg",
          "type": "bool"
        }
      ]
    },
    {
      "name": "updatePrivyConfig",
      "discriminator": [
        134,
        172,
        68,
        221,
        44,
        25,
        70,
        227
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "privyConfig",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "tokensPerSol",
          "type": "u32"
        }
      ]
    },
    {
      "name": "updateUsername",
      "discriminator": [
        233,
        103,
        45,
        8,
        250,
        100,
        216,
        251
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "privyUser",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "username",
          "type": "string"
        }
      ]
    },
    {
      "name": "withdrawBalance",
      "discriminator": [
        140,
        79,
        65,
        53,
        68,
        73,
        241,
        211
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "privyConfig",
          "writable": true
        },
        {
          "name": "owner"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "privyConfig",
      "discriminator": [
        140,
        170,
        82,
        111,
        237,
        1,
        223,
        208
      ]
    },
    {
      "name": "privyUser",
      "discriminator": [
        147,
        197,
        233,
        66,
        128,
        184,
        87,
        190
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unauthorized",
      "msg": "Unauthorized."
    },
    {
      "code": 6001,
      "name": "tokenLimitExceeded",
      "msg": "Token limit exceeded"
    },
    {
      "code": 6002,
      "name": "messagesDisabled",
      "msg": "Disabled receiving messages."
    },
    {
      "code": 6003,
      "name": "invalidCategoryIndex",
      "msg": "Invalid category index"
    },
    {
      "code": 6004,
      "name": "tokenLimitUnderflow",
      "msg": "Token limit underflow"
    },
    {
      "code": 6005,
      "name": "categoryNotFound",
      "msg": "Category not found"
    },
    {
      "code": 6006,
      "name": "invalidPasskey",
      "msg": "Invalid passkey"
    },
    {
      "code": 6007,
      "name": "categoryDisabled",
      "msg": "Category disabled"
    }
  ],
  "types": [
    {
      "name": "category",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "catName",
            "type": "string"
          },
          {
            "name": "passkey",
            "type": "string"
          },
          {
            "name": "enabled",
            "type": "bool"
          },
          {
            "name": "singleMsg",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "privyConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "tokensPerSol",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "privyUser",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "username",
            "type": "string"
          },
          {
            "name": "tokenLimit",
            "type": "u16"
          },
          {
            "name": "categories",
            "type": {
              "vec": {
                "option": {
                  "defined": {
                    "name": "category"
                  }
                }
              }
            }
          },
          {
            "name": "messages",
            "type": {
              "vec": "string"
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
