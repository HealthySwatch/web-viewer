
function stringToArraybuffer(message)
{
    const messageArray = new Uint8Array(message.length);
    for (let i = 0; i < message.length; ++i) {
        messageArray[i] = message.charCodeAt(i);
    }
    return messageArray;
}

function arraybufferToString(messageArray)
{
    const array = new Uint8Array(messageArray);
    let message = '', i = 0;
    while(i < array.length) {
        message += String.fromCharCode(array[i++]);
    }
    return message;
}

async function deriveKey(key, password, spec)
{
    let keyArray = stringToArraybuffer(key);
    if (password.length > 0) {
        let passwordArray = stringToArraybuffer(password),
            newKeyArray = new Uint8Array(keyArray.length + passwordArray.length);
        newKeyArray.set(keyArray, 0);
        newKeyArray.set(passwordArray, keyArray.length);
        keyArray = newKeyArray;
    }

    // import raw key
    const importedKey = await window.crypto.subtle.importKey(
        'raw', // only 'raw' is allowed
        keyArray,
        {name: 'PBKDF2'}, // we use PBKDF2 for key derivation
        false, // the key may not be exported
        ['deriveKey'] // we may only use it for key derivation
    );

    // derive a stronger key for use with AES
    return window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2', // we use PBKDF2 for key derivation
            salt: stringToArraybuffer(spec[1]), // salt used in HMAC
            iterations: spec[2], // amount of iterations to apply
            hash: {name: 'SHA-256'} // can be "SHA-1", "SHA-256", "SHA-384" or "SHA-512"
        },
        importedKey,
        {
            name: 'AES-GCM', // can be any supported AES algorithm ("AES-CTR", "AES-CBC", "AES-CMAC", "AES-GCM", "AES-CFB", "AES-KW", "ECDH", "DH" or "HMAC")
            length: spec[3] // can be 128, 192 or 256
        },
        false, // the key may not be exported
        ['encrypt', 'decrypt'] // we may only use it for en- and decryption
    )
}

function decompress(data) {
    return window.pako.inflate(new Uint8Array(data));
}

async function decode(payload) {
    const spec = payload.auth;
    const data = payload.data;

    const adata = JSON.stringify(spec);

    spec[0] = atob(spec[0]);
    spec[1] = atob(spec[1]);

    // use cipher to decode
    let decodedData = await window.crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: stringToArraybuffer(spec[0]), // the initialization vector you used to encrypt
            additionalData: stringToArraybuffer(adata), // the addtional data you used during encryption (if any)
            tagLength: spec[4] // the length of the tag you used to encrypt (if any)
        },
        await deriveKey(key, userPassword, spec),
        stringToArraybuffer(
            atob(data)
        )
    );

    return arraybufferToString(decompress(decodedData));
}