/**
 * @see http://www.flickr.com/groups/api/discuss/72157616713786392/
 * @see http://www.timparenti.com/dev/flickr/shortlink/
 */

(function ($) {

    var base58_alphabet = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';

    function base_encode(num, alphabet) {
        var count = alphabet.length;
        var encoded = '';
        while (num >= count) {
            var _div = num / count;
            var _mod = (num - (count * parseInt(_div)));
            encoded = alphabet[_mod] + encoded;
            num = parseInt(_div);
        }

        if (num) encoded = alphabet[num] + encoded;

        return encoded;
    }

    function base_decode(str, alphabet) {
        var count = alphabet.length;
        var decoded = 0;
        var multi = 1;
        while (str.length > 0) {
            var _digit = str[str.length - 1];
            decoded += multi * alphabet.indexOf(_digit);
            multi = multi * count;
            str = str.substring(0, str.length - 1);
        }

        return decoded;
    }

    $.base58 = {
        "encode": function (num) {
            return base_encode(num, base58_alphabet);
        },
        "decode": function (str) {
            return base_decode(str, base58_alphabet);
        }
    }

}(jQuery));
