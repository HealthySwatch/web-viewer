let userPassword = 'tOtO'

let key = window.location.hash.substring(1);
if (key === '') {
    throw 'no encryption key given';
}

let base58 = new baseX('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz');

key = arraybufferToString(base58.decode(key)).padStart(32, '\u0000')

rawData.forEach(async it => {
    try {
        let value = await decode(it)
        console.log(value)
    } catch (err) {
        console.error(err)
    }
})