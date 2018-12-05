const nacl = require('tweetnacl');
nacl.util = require('tweetnacl-util');

function verifySig(data, sig, pubkey) {
    dataBytes = nacl.util.decodeUTF8(data)
    sigBytes = nacl.util.decodeBase64(sig)
    pkBytes = nacl.util.decodeBase64(pubkey)
    return nacl.sign.detached.verify(dataBytes, sigBytes, pkBytes)
}
module.exports = {
    verifySig
};