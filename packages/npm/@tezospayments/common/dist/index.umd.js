(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.tezosPaymentsCommon = {}));
})(this, (function (exports) { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function toVal(mix) {
    var k,
        y,
        str = '';

    if (typeof mix === 'string' || typeof mix === 'number') {
      str += mix;
    } else if (typeof mix === 'object') {
      if (Array.isArray(mix)) {
        for (k = 0; k < mix.length; k++) {
          if (mix[k]) {
            if (y = toVal(mix[k])) {
              str && (str += ' ');
              str += y;
            }
          }
        }
      } else {
        for (k in mix) {
          if (mix[k]) {
            str && (str += ' ');
            str += k;
          }
        }
      }
    }

    return str;
  }

  function clsx_m () {
    var i = 0,
        tmp,
        x,
        str = '';

    while (i < arguments.length) {
      if (tmp = arguments[i++]) {
        if (x = toVal(tmp)) {
          str && (str += ' ');
          str += x;
        }
      }
    }

    return str;
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  var buffer = {};

  var base64Js = {};

  base64Js.byteLength = byteLength;
  base64Js.toByteArray = toByteArray;
  base64Js.fromByteArray = fromByteArray;
  var lookup = [];
  var revLookup = [];
  var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  } // Support decoding URL-safe base64 strings, as Node.js does.
  // See: https://en.wikipedia.org/wiki/Base64#URL_applications


  revLookup['-'.charCodeAt(0)] = 62;
  revLookup['_'.charCodeAt(0)] = 63;

  function getLens(b64) {
    var len = b64.length;

    if (len % 4 > 0) {
      throw new Error('Invalid string. Length must be a multiple of 4');
    } // Trim off extra bytes after placeholder bytes are found
    // See: https://github.com/beatgammit/base64-js/issues/42


    var validLen = b64.indexOf('=');
    if (validLen === -1) validLen = len;
    var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
    return [validLen, placeHoldersLen];
  } // base64 is 4/3 + up to two characters of the original data


  function byteLength(b64) {
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
  }

  function _byteLength(b64, validLen, placeHoldersLen) {
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
  }

  function toByteArray(b64) {
    var tmp;
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
    var curByte = 0; // if there are placeholders, only get up to the last complete 4 chars

    var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
    var i;

    for (i = 0; i < len; i += 4) {
      tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
      arr[curByte++] = tmp >> 16 & 0xFF;
      arr[curByte++] = tmp >> 8 & 0xFF;
      arr[curByte++] = tmp & 0xFF;
    }

    if (placeHoldersLen === 2) {
      tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
      arr[curByte++] = tmp & 0xFF;
    }

    if (placeHoldersLen === 1) {
      tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
      arr[curByte++] = tmp >> 8 & 0xFF;
      arr[curByte++] = tmp & 0xFF;
    }

    return arr;
  }

  function tripletToBase64(num) {
    return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
  }

  function encodeChunk(uint8, start, end) {
    var tmp;
    var output = [];

    for (var i = start; i < end; i += 3) {
      tmp = (uint8[i] << 16 & 0xFF0000) + (uint8[i + 1] << 8 & 0xFF00) + (uint8[i + 2] & 0xFF);
      output.push(tripletToBase64(tmp));
    }

    return output.join('');
  }

  function fromByteArray(uint8) {
    var tmp;
    var len = uint8.length;
    var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes

    var parts = [];
    var maxChunkLength = 16383; // must be multiple of 3
    // go through the array every three bytes, we'll deal with trailing stuff later

    for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
      parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
    } // pad the end with zeros, but make sure to not forget the extra bytes


    if (extraBytes === 1) {
      tmp = uint8[len - 1];
      parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 0x3F] + '==');
    } else if (extraBytes === 2) {
      tmp = (uint8[len - 2] << 8) + uint8[len - 1];
      parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 0x3F] + lookup[tmp << 2 & 0x3F] + '=');
    }

    return parts.join('');
  }

  var ieee754 = {};

  /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */

  ieee754.read = function (buffer, offset, isLE, mLen, nBytes) {
    var e, m;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var nBits = -7;
    var i = isLE ? nBytes - 1 : 0;
    var d = isLE ? -1 : 1;
    var s = buffer[offset + i];
    i += d;
    e = s & (1 << -nBits) - 1;
    s >>= -nBits;
    nBits += eLen;

    for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

    m = e & (1 << -nBits) - 1;
    e >>= -nBits;
    nBits += mLen;

    for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

    if (e === 0) {
      e = 1 - eBias;
    } else if (e === eMax) {
      return m ? NaN : (s ? -1 : 1) * Infinity;
    } else {
      m = m + Math.pow(2, mLen);
      e = e - eBias;
    }

    return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
  };

  ieee754.write = function (buffer, value, offset, isLE, mLen, nBytes) {
    var e, m, c;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
    var i = isLE ? 0 : nBytes - 1;
    var d = isLE ? 1 : -1;
    var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
    value = Math.abs(value);

    if (isNaN(value) || value === Infinity) {
      m = isNaN(value) ? 1 : 0;
      e = eMax;
    } else {
      e = Math.floor(Math.log(value) / Math.LN2);

      if (value * (c = Math.pow(2, -e)) < 1) {
        e--;
        c *= 2;
      }

      if (e + eBias >= 1) {
        value += rt / c;
      } else {
        value += rt * Math.pow(2, 1 - eBias);
      }

      if (value * c >= 2) {
        e++;
        c /= 2;
      }

      if (e + eBias >= eMax) {
        m = 0;
        e = eMax;
      } else if (e + eBias >= 1) {
        m = (value * c - 1) * Math.pow(2, mLen);
        e = e + eBias;
      } else {
        m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
        e = 0;
      }
    }

    for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

    e = e << mLen | m;
    eLen += mLen;

    for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

    buffer[offset + i - d] |= s * 128;
  };

  /*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   */

  (function (exports) {

    const base64 = base64Js;
    const ieee754$1 = ieee754;
    const customInspectSymbol = typeof Symbol === 'function' && typeof Symbol['for'] === 'function' // eslint-disable-line dot-notation
    ? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
    : null;
    exports.Buffer = Buffer;
    exports.SlowBuffer = SlowBuffer;
    exports.INSPECT_MAX_BYTES = 50;
    const K_MAX_LENGTH = 0x7fffffff;
    exports.kMaxLength = K_MAX_LENGTH;
    /**
     * If `Buffer.TYPED_ARRAY_SUPPORT`:
     *   === true    Use Uint8Array implementation (fastest)
     *   === false   Print warning and recommend using `buffer` v4.x which has an Object
     *               implementation (most compatible, even IE6)
     *
     * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
     * Opera 11.6+, iOS 4.2+.
     *
     * We report that the browser does not support typed arrays if the are not subclassable
     * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
     * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
     * for __proto__ and has a buggy typed array implementation.
     */

    Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();

    if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' && typeof console.error === 'function') {
      console.error('This browser lacks typed array (Uint8Array) support which is required by ' + '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.');
    }

    function typedArraySupport() {
      // Can typed array instances can be augmented?
      try {
        const arr = new Uint8Array(1);
        const proto = {
          foo: function () {
            return 42;
          }
        };
        Object.setPrototypeOf(proto, Uint8Array.prototype);
        Object.setPrototypeOf(arr, proto);
        return arr.foo() === 42;
      } catch (e) {
        return false;
      }
    }

    Object.defineProperty(Buffer.prototype, 'parent', {
      enumerable: true,
      get: function () {
        if (!Buffer.isBuffer(this)) return undefined;
        return this.buffer;
      }
    });
    Object.defineProperty(Buffer.prototype, 'offset', {
      enumerable: true,
      get: function () {
        if (!Buffer.isBuffer(this)) return undefined;
        return this.byteOffset;
      }
    });

    function createBuffer(length) {
      if (length > K_MAX_LENGTH) {
        throw new RangeError('The value "' + length + '" is invalid for option "size"');
      } // Return an augmented `Uint8Array` instance


      const buf = new Uint8Array(length);
      Object.setPrototypeOf(buf, Buffer.prototype);
      return buf;
    }
    /**
     * The Buffer constructor returns instances of `Uint8Array` that have their
     * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
     * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
     * and the `Uint8Array` methods. Square bracket notation works as expected -- it
     * returns a single octet.
     *
     * The `Uint8Array` prototype remains unmodified.
     */


    function Buffer(arg, encodingOrOffset, length) {
      // Common case.
      if (typeof arg === 'number') {
        if (typeof encodingOrOffset === 'string') {
          throw new TypeError('The "string" argument must be of type string. Received type number');
        }

        return allocUnsafe(arg);
      }

      return from(arg, encodingOrOffset, length);
    }

    Buffer.poolSize = 8192; // not used by this implementation

    function from(value, encodingOrOffset, length) {
      if (typeof value === 'string') {
        return fromString(value, encodingOrOffset);
      }

      if (ArrayBuffer.isView(value)) {
        return fromArrayView(value);
      }

      if (value == null) {
        throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' + 'or Array-like Object. Received type ' + typeof value);
      }

      if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
        return fromArrayBuffer(value, encodingOrOffset, length);
      }

      if (typeof SharedArrayBuffer !== 'undefined' && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
        return fromArrayBuffer(value, encodingOrOffset, length);
      }

      if (typeof value === 'number') {
        throw new TypeError('The "value" argument must not be of type number. Received type number');
      }

      const valueOf = value.valueOf && value.valueOf();

      if (valueOf != null && valueOf !== value) {
        return Buffer.from(valueOf, encodingOrOffset, length);
      }

      const b = fromObject(value);
      if (b) return b;

      if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === 'function') {
        return Buffer.from(value[Symbol.toPrimitive]('string'), encodingOrOffset, length);
      }

      throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' + 'or Array-like Object. Received type ' + typeof value);
    }
    /**
     * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
     * if value is a number.
     * Buffer.from(str[, encoding])
     * Buffer.from(array)
     * Buffer.from(buffer)
     * Buffer.from(arrayBuffer[, byteOffset[, length]])
     **/


    Buffer.from = function (value, encodingOrOffset, length) {
      return from(value, encodingOrOffset, length);
    }; // Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
    // https://github.com/feross/buffer/pull/148


    Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype);
    Object.setPrototypeOf(Buffer, Uint8Array);

    function assertSize(size) {
      if (typeof size !== 'number') {
        throw new TypeError('"size" argument must be of type number');
      } else if (size < 0) {
        throw new RangeError('The value "' + size + '" is invalid for option "size"');
      }
    }

    function alloc(size, fill, encoding) {
      assertSize(size);

      if (size <= 0) {
        return createBuffer(size);
      }

      if (fill !== undefined) {
        // Only pay attention to encoding if it's a string. This
        // prevents accidentally sending in a number that would
        // be interpreted as a start offset.
        return typeof encoding === 'string' ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
      }

      return createBuffer(size);
    }
    /**
     * Creates a new filled Buffer instance.
     * alloc(size[, fill[, encoding]])
     **/


    Buffer.alloc = function (size, fill, encoding) {
      return alloc(size, fill, encoding);
    };

    function allocUnsafe(size) {
      assertSize(size);
      return createBuffer(size < 0 ? 0 : checked(size) | 0);
    }
    /**
     * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
     * */


    Buffer.allocUnsafe = function (size) {
      return allocUnsafe(size);
    };
    /**
     * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
     */


    Buffer.allocUnsafeSlow = function (size) {
      return allocUnsafe(size);
    };

    function fromString(string, encoding) {
      if (typeof encoding !== 'string' || encoding === '') {
        encoding = 'utf8';
      }

      if (!Buffer.isEncoding(encoding)) {
        throw new TypeError('Unknown encoding: ' + encoding);
      }

      const length = byteLength(string, encoding) | 0;
      let buf = createBuffer(length);
      const actual = buf.write(string, encoding);

      if (actual !== length) {
        // Writing a hex string, for example, that contains invalid characters will
        // cause everything after the first invalid character to be ignored. (e.g.
        // 'abxxcd' will be treated as 'ab')
        buf = buf.slice(0, actual);
      }

      return buf;
    }

    function fromArrayLike(array) {
      const length = array.length < 0 ? 0 : checked(array.length) | 0;
      const buf = createBuffer(length);

      for (let i = 0; i < length; i += 1) {
        buf[i] = array[i] & 255;
      }

      return buf;
    }

    function fromArrayView(arrayView) {
      if (isInstance(arrayView, Uint8Array)) {
        const copy = new Uint8Array(arrayView);
        return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
      }

      return fromArrayLike(arrayView);
    }

    function fromArrayBuffer(array, byteOffset, length) {
      if (byteOffset < 0 || array.byteLength < byteOffset) {
        throw new RangeError('"offset" is outside of buffer bounds');
      }

      if (array.byteLength < byteOffset + (length || 0)) {
        throw new RangeError('"length" is outside of buffer bounds');
      }

      let buf;

      if (byteOffset === undefined && length === undefined) {
        buf = new Uint8Array(array);
      } else if (length === undefined) {
        buf = new Uint8Array(array, byteOffset);
      } else {
        buf = new Uint8Array(array, byteOffset, length);
      } // Return an augmented `Uint8Array` instance


      Object.setPrototypeOf(buf, Buffer.prototype);
      return buf;
    }

    function fromObject(obj) {
      if (Buffer.isBuffer(obj)) {
        const len = checked(obj.length) | 0;
        const buf = createBuffer(len);

        if (buf.length === 0) {
          return buf;
        }

        obj.copy(buf, 0, 0, len);
        return buf;
      }

      if (obj.length !== undefined) {
        if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
          return createBuffer(0);
        }

        return fromArrayLike(obj);
      }

      if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
        return fromArrayLike(obj.data);
      }
    }

    function checked(length) {
      // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
      // length is NaN (which is otherwise coerced to zero.)
      if (length >= K_MAX_LENGTH) {
        throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes');
      }

      return length | 0;
    }

    function SlowBuffer(length) {
      if (+length != length) {
        // eslint-disable-line eqeqeq
        length = 0;
      }

      return Buffer.alloc(+length);
    }

    Buffer.isBuffer = function isBuffer(b) {
      return b != null && b._isBuffer === true && b !== Buffer.prototype; // so Buffer.isBuffer(Buffer.prototype) will be false
    };

    Buffer.compare = function compare(a, b) {
      if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength);
      if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength);

      if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
        throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
      }

      if (a === b) return 0;
      let x = a.length;
      let y = b.length;

      for (let i = 0, len = Math.min(x, y); i < len; ++i) {
        if (a[i] !== b[i]) {
          x = a[i];
          y = b[i];
          break;
        }
      }

      if (x < y) return -1;
      if (y < x) return 1;
      return 0;
    };

    Buffer.isEncoding = function isEncoding(encoding) {
      switch (String(encoding).toLowerCase()) {
        case 'hex':
        case 'utf8':
        case 'utf-8':
        case 'ascii':
        case 'latin1':
        case 'binary':
        case 'base64':
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return true;

        default:
          return false;
      }
    };

    Buffer.concat = function concat(list, length) {
      if (!Array.isArray(list)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      }

      if (list.length === 0) {
        return Buffer.alloc(0);
      }

      let i;

      if (length === undefined) {
        length = 0;

        for (i = 0; i < list.length; ++i) {
          length += list[i].length;
        }
      }

      const buffer = Buffer.allocUnsafe(length);
      let pos = 0;

      for (i = 0; i < list.length; ++i) {
        let buf = list[i];

        if (isInstance(buf, Uint8Array)) {
          if (pos + buf.length > buffer.length) {
            if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf);
            buf.copy(buffer, pos);
          } else {
            Uint8Array.prototype.set.call(buffer, buf, pos);
          }
        } else if (!Buffer.isBuffer(buf)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        } else {
          buf.copy(buffer, pos);
        }

        pos += buf.length;
      }

      return buffer;
    };

    function byteLength(string, encoding) {
      if (Buffer.isBuffer(string)) {
        return string.length;
      }

      if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
        return string.byteLength;
      }

      if (typeof string !== 'string') {
        throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' + 'Received type ' + typeof string);
      }

      const len = string.length;
      const mustMatch = arguments.length > 2 && arguments[2] === true;
      if (!mustMatch && len === 0) return 0; // Use a for loop to avoid recursion

      let loweredCase = false;

      for (;;) {
        switch (encoding) {
          case 'ascii':
          case 'latin1':
          case 'binary':
            return len;

          case 'utf8':
          case 'utf-8':
            return utf8ToBytes(string).length;

          case 'ucs2':
          case 'ucs-2':
          case 'utf16le':
          case 'utf-16le':
            return len * 2;

          case 'hex':
            return len >>> 1;

          case 'base64':
            return base64ToBytes(string).length;

          default:
            if (loweredCase) {
              return mustMatch ? -1 : utf8ToBytes(string).length; // assume utf8
            }

            encoding = ('' + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    }

    Buffer.byteLength = byteLength;

    function slowToString(encoding, start, end) {
      let loweredCase = false; // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
      // property of a typed array.
      // This behaves neither like String nor Uint8Array in that we set start/end
      // to their upper/lower bounds if the value passed is out of range.
      // undefined is handled specially as per ECMA-262 6th Edition,
      // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.

      if (start === undefined || start < 0) {
        start = 0;
      } // Return early if start > this.length. Done here to prevent potential uint32
      // coercion fail below.


      if (start > this.length) {
        return '';
      }

      if (end === undefined || end > this.length) {
        end = this.length;
      }

      if (end <= 0) {
        return '';
      } // Force coercion to uint32. This will also coerce falsey/NaN values to 0.


      end >>>= 0;
      start >>>= 0;

      if (end <= start) {
        return '';
      }

      if (!encoding) encoding = 'utf8';

      while (true) {
        switch (encoding) {
          case 'hex':
            return hexSlice(this, start, end);

          case 'utf8':
          case 'utf-8':
            return utf8Slice(this, start, end);

          case 'ascii':
            return asciiSlice(this, start, end);

          case 'latin1':
          case 'binary':
            return latin1Slice(this, start, end);

          case 'base64':
            return base64Slice(this, start, end);

          case 'ucs2':
          case 'ucs-2':
          case 'utf16le':
          case 'utf-16le':
            return utf16leSlice(this, start, end);

          default:
            if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
            encoding = (encoding + '').toLowerCase();
            loweredCase = true;
        }
      }
    } // This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
    // to detect a Buffer instance. It's not possible to use `instanceof Buffer`
    // reliably in a browserify context because there could be multiple different
    // copies of the 'buffer' package in use. This method works even for Buffer
    // instances that were created from another copy of the `buffer` package.
    // See: https://github.com/feross/buffer/issues/154


    Buffer.prototype._isBuffer = true;

    function swap(b, n, m) {
      const i = b[n];
      b[n] = b[m];
      b[m] = i;
    }

    Buffer.prototype.swap16 = function swap16() {
      const len = this.length;

      if (len % 2 !== 0) {
        throw new RangeError('Buffer size must be a multiple of 16-bits');
      }

      for (let i = 0; i < len; i += 2) {
        swap(this, i, i + 1);
      }

      return this;
    };

    Buffer.prototype.swap32 = function swap32() {
      const len = this.length;

      if (len % 4 !== 0) {
        throw new RangeError('Buffer size must be a multiple of 32-bits');
      }

      for (let i = 0; i < len; i += 4) {
        swap(this, i, i + 3);
        swap(this, i + 1, i + 2);
      }

      return this;
    };

    Buffer.prototype.swap64 = function swap64() {
      const len = this.length;

      if (len % 8 !== 0) {
        throw new RangeError('Buffer size must be a multiple of 64-bits');
      }

      for (let i = 0; i < len; i += 8) {
        swap(this, i, i + 7);
        swap(this, i + 1, i + 6);
        swap(this, i + 2, i + 5);
        swap(this, i + 3, i + 4);
      }

      return this;
    };

    Buffer.prototype.toString = function toString() {
      const length = this.length;
      if (length === 0) return '';
      if (arguments.length === 0) return utf8Slice(this, 0, length);
      return slowToString.apply(this, arguments);
    };

    Buffer.prototype.toLocaleString = Buffer.prototype.toString;

    Buffer.prototype.equals = function equals(b) {
      if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
      if (this === b) return true;
      return Buffer.compare(this, b) === 0;
    };

    Buffer.prototype.inspect = function inspect() {
      let str = '';
      const max = exports.INSPECT_MAX_BYTES;
      str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim();
      if (this.length > max) str += ' ... ';
      return '<Buffer ' + str + '>';
    };

    if (customInspectSymbol) {
      Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect;
    }

    Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
      if (isInstance(target, Uint8Array)) {
        target = Buffer.from(target, target.offset, target.byteLength);
      }

      if (!Buffer.isBuffer(target)) {
        throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. ' + 'Received type ' + typeof target);
      }

      if (start === undefined) {
        start = 0;
      }

      if (end === undefined) {
        end = target ? target.length : 0;
      }

      if (thisStart === undefined) {
        thisStart = 0;
      }

      if (thisEnd === undefined) {
        thisEnd = this.length;
      }

      if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
        throw new RangeError('out of range index');
      }

      if (thisStart >= thisEnd && start >= end) {
        return 0;
      }

      if (thisStart >= thisEnd) {
        return -1;
      }

      if (start >= end) {
        return 1;
      }

      start >>>= 0;
      end >>>= 0;
      thisStart >>>= 0;
      thisEnd >>>= 0;
      if (this === target) return 0;
      let x = thisEnd - thisStart;
      let y = end - start;
      const len = Math.min(x, y);
      const thisCopy = this.slice(thisStart, thisEnd);
      const targetCopy = target.slice(start, end);

      for (let i = 0; i < len; ++i) {
        if (thisCopy[i] !== targetCopy[i]) {
          x = thisCopy[i];
          y = targetCopy[i];
          break;
        }
      }

      if (x < y) return -1;
      if (y < x) return 1;
      return 0;
    }; // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
    // OR the last index of `val` in `buffer` at offset <= `byteOffset`.
    //
    // Arguments:
    // - buffer - a Buffer to search
    // - val - a string, Buffer, or number
    // - byteOffset - an index into `buffer`; will be clamped to an int32
    // - encoding - an optional encoding, relevant is val is a string
    // - dir - true for indexOf, false for lastIndexOf


    function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
      // Empty buffer means no match
      if (buffer.length === 0) return -1; // Normalize byteOffset

      if (typeof byteOffset === 'string') {
        encoding = byteOffset;
        byteOffset = 0;
      } else if (byteOffset > 0x7fffffff) {
        byteOffset = 0x7fffffff;
      } else if (byteOffset < -0x80000000) {
        byteOffset = -0x80000000;
      }

      byteOffset = +byteOffset; // Coerce to Number.

      if (numberIsNaN(byteOffset)) {
        // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
        byteOffset = dir ? 0 : buffer.length - 1;
      } // Normalize byteOffset: negative offsets start from the end of the buffer


      if (byteOffset < 0) byteOffset = buffer.length + byteOffset;

      if (byteOffset >= buffer.length) {
        if (dir) return -1;else byteOffset = buffer.length - 1;
      } else if (byteOffset < 0) {
        if (dir) byteOffset = 0;else return -1;
      } // Normalize val


      if (typeof val === 'string') {
        val = Buffer.from(val, encoding);
      } // Finally, search either indexOf (if dir is true) or lastIndexOf


      if (Buffer.isBuffer(val)) {
        // Special case: looking for empty string/buffer always fails
        if (val.length === 0) {
          return -1;
        }

        return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
      } else if (typeof val === 'number') {
        val = val & 0xFF; // Search for a byte value [0-255]

        if (typeof Uint8Array.prototype.indexOf === 'function') {
          if (dir) {
            return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
          } else {
            return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
          }
        }

        return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
      }

      throw new TypeError('val must be string, number or Buffer');
    }

    function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
      let indexSize = 1;
      let arrLength = arr.length;
      let valLength = val.length;

      if (encoding !== undefined) {
        encoding = String(encoding).toLowerCase();

        if (encoding === 'ucs2' || encoding === 'ucs-2' || encoding === 'utf16le' || encoding === 'utf-16le') {
          if (arr.length < 2 || val.length < 2) {
            return -1;
          }

          indexSize = 2;
          arrLength /= 2;
          valLength /= 2;
          byteOffset /= 2;
        }
      }

      function read(buf, i) {
        if (indexSize === 1) {
          return buf[i];
        } else {
          return buf.readUInt16BE(i * indexSize);
        }
      }

      let i;

      if (dir) {
        let foundIndex = -1;

        for (i = byteOffset; i < arrLength; i++) {
          if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
            if (foundIndex === -1) foundIndex = i;
            if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
          } else {
            if (foundIndex !== -1) i -= i - foundIndex;
            foundIndex = -1;
          }
        }
      } else {
        if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;

        for (i = byteOffset; i >= 0; i--) {
          let found = true;

          for (let j = 0; j < valLength; j++) {
            if (read(arr, i + j) !== read(val, j)) {
              found = false;
              break;
            }
          }

          if (found) return i;
        }
      }

      return -1;
    }

    Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
      return this.indexOf(val, byteOffset, encoding) !== -1;
    };

    Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
    };

    Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
    };

    function hexWrite(buf, string, offset, length) {
      offset = Number(offset) || 0;
      const remaining = buf.length - offset;

      if (!length) {
        length = remaining;
      } else {
        length = Number(length);

        if (length > remaining) {
          length = remaining;
        }
      }

      const strLen = string.length;

      if (length > strLen / 2) {
        length = strLen / 2;
      }

      let i;

      for (i = 0; i < length; ++i) {
        const parsed = parseInt(string.substr(i * 2, 2), 16);
        if (numberIsNaN(parsed)) return i;
        buf[offset + i] = parsed;
      }

      return i;
    }

    function utf8Write(buf, string, offset, length) {
      return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
    }

    function asciiWrite(buf, string, offset, length) {
      return blitBuffer(asciiToBytes(string), buf, offset, length);
    }

    function base64Write(buf, string, offset, length) {
      return blitBuffer(base64ToBytes(string), buf, offset, length);
    }

    function ucs2Write(buf, string, offset, length) {
      return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
    }

    Buffer.prototype.write = function write(string, offset, length, encoding) {
      // Buffer#write(string)
      if (offset === undefined) {
        encoding = 'utf8';
        length = this.length;
        offset = 0; // Buffer#write(string, encoding)
      } else if (length === undefined && typeof offset === 'string') {
        encoding = offset;
        length = this.length;
        offset = 0; // Buffer#write(string, offset[, length][, encoding])
      } else if (isFinite(offset)) {
        offset = offset >>> 0;

        if (isFinite(length)) {
          length = length >>> 0;
          if (encoding === undefined) encoding = 'utf8';
        } else {
          encoding = length;
          length = undefined;
        }
      } else {
        throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
      }

      const remaining = this.length - offset;
      if (length === undefined || length > remaining) length = remaining;

      if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
        throw new RangeError('Attempt to write outside buffer bounds');
      }

      if (!encoding) encoding = 'utf8';
      let loweredCase = false;

      for (;;) {
        switch (encoding) {
          case 'hex':
            return hexWrite(this, string, offset, length);

          case 'utf8':
          case 'utf-8':
            return utf8Write(this, string, offset, length);

          case 'ascii':
          case 'latin1':
          case 'binary':
            return asciiWrite(this, string, offset, length);

          case 'base64':
            // Warning: maxLength not taken into account in base64Write
            return base64Write(this, string, offset, length);

          case 'ucs2':
          case 'ucs-2':
          case 'utf16le':
          case 'utf-16le':
            return ucs2Write(this, string, offset, length);

          default:
            if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
            encoding = ('' + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    };

    Buffer.prototype.toJSON = function toJSON() {
      return {
        type: 'Buffer',
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };

    function base64Slice(buf, start, end) {
      if (start === 0 && end === buf.length) {
        return base64.fromByteArray(buf);
      } else {
        return base64.fromByteArray(buf.slice(start, end));
      }
    }

    function utf8Slice(buf, start, end) {
      end = Math.min(buf.length, end);
      const res = [];
      let i = start;

      while (i < end) {
        const firstByte = buf[i];
        let codePoint = null;
        let bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;

        if (i + bytesPerSequence <= end) {
          let secondByte, thirdByte, fourthByte, tempCodePoint;

          switch (bytesPerSequence) {
            case 1:
              if (firstByte < 0x80) {
                codePoint = firstByte;
              }

              break;

            case 2:
              secondByte = buf[i + 1];

              if ((secondByte & 0xC0) === 0x80) {
                tempCodePoint = (firstByte & 0x1F) << 0x6 | secondByte & 0x3F;

                if (tempCodePoint > 0x7F) {
                  codePoint = tempCodePoint;
                }
              }

              break;

            case 3:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];

              if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
                tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | thirdByte & 0x3F;

                if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
                  codePoint = tempCodePoint;
                }
              }

              break;

            case 4:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              fourthByte = buf[i + 3];

              if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
                tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | fourthByte & 0x3F;

                if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
                  codePoint = tempCodePoint;
                }
              }

          }
        }

        if (codePoint === null) {
          // we did not generate a valid codePoint so insert a
          // replacement char (U+FFFD) and advance only 1 byte
          codePoint = 0xFFFD;
          bytesPerSequence = 1;
        } else if (codePoint > 0xFFFF) {
          // encode to utf16 (surrogate pair dance)
          codePoint -= 0x10000;
          res.push(codePoint >>> 10 & 0x3FF | 0xD800);
          codePoint = 0xDC00 | codePoint & 0x3FF;
        }

        res.push(codePoint);
        i += bytesPerSequence;
      }

      return decodeCodePointsArray(res);
    } // Based on http://stackoverflow.com/a/22747272/680742, the browser with
    // the lowest limit is Chrome, with 0x10000 args.
    // We go 1 magnitude less, for safety


    const MAX_ARGUMENTS_LENGTH = 0x1000;

    function decodeCodePointsArray(codePoints) {
      const len = codePoints.length;

      if (len <= MAX_ARGUMENTS_LENGTH) {
        return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
      } // Decode in chunks to avoid "call stack size exceeded".


      let res = '';
      let i = 0;

      while (i < len) {
        res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
      }

      return res;
    }

    function asciiSlice(buf, start, end) {
      let ret = '';
      end = Math.min(buf.length, end);

      for (let i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i] & 0x7F);
      }

      return ret;
    }

    function latin1Slice(buf, start, end) {
      let ret = '';
      end = Math.min(buf.length, end);

      for (let i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i]);
      }

      return ret;
    }

    function hexSlice(buf, start, end) {
      const len = buf.length;
      if (!start || start < 0) start = 0;
      if (!end || end < 0 || end > len) end = len;
      let out = '';

      for (let i = start; i < end; ++i) {
        out += hexSliceLookupTable[buf[i]];
      }

      return out;
    }

    function utf16leSlice(buf, start, end) {
      const bytes = buf.slice(start, end);
      let res = ''; // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)

      for (let i = 0; i < bytes.length - 1; i += 2) {
        res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
      }

      return res;
    }

    Buffer.prototype.slice = function slice(start, end) {
      const len = this.length;
      start = ~~start;
      end = end === undefined ? len : ~~end;

      if (start < 0) {
        start += len;
        if (start < 0) start = 0;
      } else if (start > len) {
        start = len;
      }

      if (end < 0) {
        end += len;
        if (end < 0) end = 0;
      } else if (end > len) {
        end = len;
      }

      if (end < start) end = start;
      const newBuf = this.subarray(start, end); // Return an augmented `Uint8Array` instance

      Object.setPrototypeOf(newBuf, Buffer.prototype);
      return newBuf;
    };
    /*
     * Need to make sure that buffer isn't trying to write out of bounds.
     */


    function checkOffset(offset, ext, length) {
      if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
      if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
    }

    Buffer.prototype.readUintLE = Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
      offset = offset >>> 0;
      byteLength = byteLength >>> 0;
      if (!noAssert) checkOffset(offset, byteLength, this.length);
      let val = this[offset];
      let mul = 1;
      let i = 0;

      while (++i < byteLength && (mul *= 0x100)) {
        val += this[offset + i] * mul;
      }

      return val;
    };

    Buffer.prototype.readUintBE = Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
      offset = offset >>> 0;
      byteLength = byteLength >>> 0;

      if (!noAssert) {
        checkOffset(offset, byteLength, this.length);
      }

      let val = this[offset + --byteLength];
      let mul = 1;

      while (byteLength > 0 && (mul *= 0x100)) {
        val += this[offset + --byteLength] * mul;
      }

      return val;
    };

    Buffer.prototype.readUint8 = Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 1, this.length);
      return this[offset];
    };

    Buffer.prototype.readUint16LE = Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      return this[offset] | this[offset + 1] << 8;
    };

    Buffer.prototype.readUint16BE = Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      return this[offset] << 8 | this[offset + 1];
    };

    Buffer.prototype.readUint32LE = Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 0x1000000;
    };

    Buffer.prototype.readUint32BE = Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
    };

    Buffer.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, 'offset');
      const first = this[offset];
      const last = this[offset + 7];

      if (first === undefined || last === undefined) {
        boundsError(offset, this.length - 8);
      }

      const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
      const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
      return BigInt(lo) + (BigInt(hi) << BigInt(32));
    });
    Buffer.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, 'offset');
      const first = this[offset];
      const last = this[offset + 7];

      if (first === undefined || last === undefined) {
        boundsError(offset, this.length - 8);
      }

      const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
      const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
      return (BigInt(hi) << BigInt(32)) + BigInt(lo);
    });

    Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
      offset = offset >>> 0;
      byteLength = byteLength >>> 0;
      if (!noAssert) checkOffset(offset, byteLength, this.length);
      let val = this[offset];
      let mul = 1;
      let i = 0;

      while (++i < byteLength && (mul *= 0x100)) {
        val += this[offset + i] * mul;
      }

      mul *= 0x80;
      if (val >= mul) val -= Math.pow(2, 8 * byteLength);
      return val;
    };

    Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
      offset = offset >>> 0;
      byteLength = byteLength >>> 0;
      if (!noAssert) checkOffset(offset, byteLength, this.length);
      let i = byteLength;
      let mul = 1;
      let val = this[offset + --i];

      while (i > 0 && (mul *= 0x100)) {
        val += this[offset + --i] * mul;
      }

      mul *= 0x80;
      if (val >= mul) val -= Math.pow(2, 8 * byteLength);
      return val;
    };

    Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 1, this.length);
      if (!(this[offset] & 0x80)) return this[offset];
      return (0xff - this[offset] + 1) * -1;
    };

    Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      const val = this[offset] | this[offset + 1] << 8;
      return val & 0x8000 ? val | 0xFFFF0000 : val;
    };

    Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      const val = this[offset + 1] | this[offset] << 8;
      return val & 0x8000 ? val | 0xFFFF0000 : val;
    };

    Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
    };

    Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
    };

    Buffer.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, 'offset');
      const first = this[offset];
      const last = this[offset + 7];

      if (first === undefined || last === undefined) {
        boundsError(offset, this.length - 8);
      }

      const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24); // Overflow

      return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
    });
    Buffer.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, 'offset');
      const first = this[offset];
      const last = this[offset + 7];

      if (first === undefined || last === undefined) {
        boundsError(offset, this.length - 8);
      }

      const val = (first << 24) + // Overflow
      this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
      return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
    });

    Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return ieee754$1.read(this, offset, true, 23, 4);
    };

    Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return ieee754$1.read(this, offset, false, 23, 4);
    };

    Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 8, this.length);
      return ieee754$1.read(this, offset, true, 52, 8);
    };

    Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 8, this.length);
      return ieee754$1.read(this, offset, false, 52, 8);
    };

    function checkInt(buf, value, offset, ext, max, min) {
      if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
      if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
      if (offset + ext > buf.length) throw new RangeError('Index out of range');
    }

    Buffer.prototype.writeUintLE = Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength = byteLength >>> 0;

      if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength) - 1;
        checkInt(this, value, offset, byteLength, maxBytes, 0);
      }

      let mul = 1;
      let i = 0;
      this[offset] = value & 0xFF;

      while (++i < byteLength && (mul *= 0x100)) {
        this[offset + i] = value / mul & 0xFF;
      }

      return offset + byteLength;
    };

    Buffer.prototype.writeUintBE = Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength = byteLength >>> 0;

      if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength) - 1;
        checkInt(this, value, offset, byteLength, maxBytes, 0);
      }

      let i = byteLength - 1;
      let mul = 1;
      this[offset + i] = value & 0xFF;

      while (--i >= 0 && (mul *= 0x100)) {
        this[offset + i] = value / mul & 0xFF;
      }

      return offset + byteLength;
    };

    Buffer.prototype.writeUint8 = Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
      this[offset] = value & 0xff;
      return offset + 1;
    };

    Buffer.prototype.writeUint16LE = Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
      this[offset] = value & 0xff;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    };

    Buffer.prototype.writeUint16BE = Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 0xff;
      return offset + 2;
    };

    Buffer.prototype.writeUint32LE = Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
      this[offset + 3] = value >>> 24;
      this[offset + 2] = value >>> 16;
      this[offset + 1] = value >>> 8;
      this[offset] = value & 0xff;
      return offset + 4;
    };

    Buffer.prototype.writeUint32BE = Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 0xff;
      return offset + 4;
    };

    function wrtBigUInt64LE(buf, value, offset, min, max) {
      checkIntBI(value, min, max, buf, offset, 7);
      let lo = Number(value & BigInt(0xffffffff));
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      let hi = Number(value >> BigInt(32) & BigInt(0xffffffff));
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      return offset;
    }

    function wrtBigUInt64BE(buf, value, offset, min, max) {
      checkIntBI(value, min, max, buf, offset, 7);
      let lo = Number(value & BigInt(0xffffffff));
      buf[offset + 7] = lo;
      lo = lo >> 8;
      buf[offset + 6] = lo;
      lo = lo >> 8;
      buf[offset + 5] = lo;
      lo = lo >> 8;
      buf[offset + 4] = lo;
      let hi = Number(value >> BigInt(32) & BigInt(0xffffffff));
      buf[offset + 3] = hi;
      hi = hi >> 8;
      buf[offset + 2] = hi;
      hi = hi >> 8;
      buf[offset + 1] = hi;
      hi = hi >> 8;
      buf[offset] = hi;
      return offset + 8;
    }

    Buffer.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
      return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'));
    });
    Buffer.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
      return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'));
    });

    Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
      value = +value;
      offset = offset >>> 0;

      if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength - 1);
        checkInt(this, value, offset, byteLength, limit - 1, -limit);
      }

      let i = 0;
      let mul = 1;
      let sub = 0;
      this[offset] = value & 0xFF;

      while (++i < byteLength && (mul *= 0x100)) {
        if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
          sub = 1;
        }

        this[offset + i] = (value / mul >> 0) - sub & 0xFF;
      }

      return offset + byteLength;
    };

    Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
      value = +value;
      offset = offset >>> 0;

      if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength - 1);
        checkInt(this, value, offset, byteLength, limit - 1, -limit);
      }

      let i = byteLength - 1;
      let mul = 1;
      let sub = 0;
      this[offset + i] = value & 0xFF;

      while (--i >= 0 && (mul *= 0x100)) {
        if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
          sub = 1;
        }

        this[offset + i] = (value / mul >> 0) - sub & 0xFF;
      }

      return offset + byteLength;
    };

    Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
      if (value < 0) value = 0xff + value + 1;
      this[offset] = value & 0xff;
      return offset + 1;
    };

    Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
      this[offset] = value & 0xff;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    };

    Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 0xff;
      return offset + 2;
    };

    Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
      this[offset] = value & 0xff;
      this[offset + 1] = value >>> 8;
      this[offset + 2] = value >>> 16;
      this[offset + 3] = value >>> 24;
      return offset + 4;
    };

    Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
      if (value < 0) value = 0xffffffff + value + 1;
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 0xff;
      return offset + 4;
    };

    Buffer.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
      return wrtBigUInt64LE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'));
    });
    Buffer.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
      return wrtBigUInt64BE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'));
    });

    function checkIEEE754(buf, value, offset, ext, max, min) {
      if (offset + ext > buf.length) throw new RangeError('Index out of range');
      if (offset < 0) throw new RangeError('Index out of range');
    }

    function writeFloat(buf, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;

      if (!noAssert) {
        checkIEEE754(buf, value, offset, 4);
      }

      ieee754$1.write(buf, value, offset, littleEndian, 23, 4);
      return offset + 4;
    }

    Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
      return writeFloat(this, value, offset, true, noAssert);
    };

    Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
      return writeFloat(this, value, offset, false, noAssert);
    };

    function writeDouble(buf, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;

      if (!noAssert) {
        checkIEEE754(buf, value, offset, 8);
      }

      ieee754$1.write(buf, value, offset, littleEndian, 52, 8);
      return offset + 8;
    }

    Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
      return writeDouble(this, value, offset, true, noAssert);
    };

    Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
      return writeDouble(this, value, offset, false, noAssert);
    }; // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)


    Buffer.prototype.copy = function copy(target, targetStart, start, end) {
      if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer');
      if (!start) start = 0;
      if (!end && end !== 0) end = this.length;
      if (targetStart >= target.length) targetStart = target.length;
      if (!targetStart) targetStart = 0;
      if (end > 0 && end < start) end = start; // Copy 0 bytes; we're done

      if (end === start) return 0;
      if (target.length === 0 || this.length === 0) return 0; // Fatal error conditions

      if (targetStart < 0) {
        throw new RangeError('targetStart out of bounds');
      }

      if (start < 0 || start >= this.length) throw new RangeError('Index out of range');
      if (end < 0) throw new RangeError('sourceEnd out of bounds'); // Are we oob?

      if (end > this.length) end = this.length;

      if (target.length - targetStart < end - start) {
        end = target.length - targetStart + start;
      }

      const len = end - start;

      if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
        // Use built-in when available, missing from IE11
        this.copyWithin(targetStart, start, end);
      } else {
        Uint8Array.prototype.set.call(target, this.subarray(start, end), targetStart);
      }

      return len;
    }; // Usage:
    //    buffer.fill(number[, offset[, end]])
    //    buffer.fill(buffer[, offset[, end]])
    //    buffer.fill(string[, offset[, end]][, encoding])


    Buffer.prototype.fill = function fill(val, start, end, encoding) {
      // Handle string cases:
      if (typeof val === 'string') {
        if (typeof start === 'string') {
          encoding = start;
          start = 0;
          end = this.length;
        } else if (typeof end === 'string') {
          encoding = end;
          end = this.length;
        }

        if (encoding !== undefined && typeof encoding !== 'string') {
          throw new TypeError('encoding must be a string');
        }

        if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
          throw new TypeError('Unknown encoding: ' + encoding);
        }

        if (val.length === 1) {
          const code = val.charCodeAt(0);

          if (encoding === 'utf8' && code < 128 || encoding === 'latin1') {
            // Fast path: If `val` fits into a single byte, use that numeric value.
            val = code;
          }
        }
      } else if (typeof val === 'number') {
        val = val & 255;
      } else if (typeof val === 'boolean') {
        val = Number(val);
      } // Invalid ranges are not set to a default, so can range check early.


      if (start < 0 || this.length < start || this.length < end) {
        throw new RangeError('Out of range index');
      }

      if (end <= start) {
        return this;
      }

      start = start >>> 0;
      end = end === undefined ? this.length : end >>> 0;
      if (!val) val = 0;
      let i;

      if (typeof val === 'number') {
        for (i = start; i < end; ++i) {
          this[i] = val;
        }
      } else {
        const bytes = Buffer.isBuffer(val) ? val : Buffer.from(val, encoding);
        const len = bytes.length;

        if (len === 0) {
          throw new TypeError('The value "' + val + '" is invalid for argument "value"');
        }

        for (i = 0; i < end - start; ++i) {
          this[i + start] = bytes[i % len];
        }
      }

      return this;
    }; // CUSTOM ERRORS
    // =============
    // Simplified versions from Node, changed for Buffer-only usage


    const errors = {};

    function E(sym, getMessage, Base) {
      errors[sym] = class NodeError extends Base {
        constructor() {
          super();
          Object.defineProperty(this, 'message', {
            value: getMessage.apply(this, arguments),
            writable: true,
            configurable: true
          }); // Add the error code to the name to include it in the stack trace.

          this.name = `${this.name} [${sym}]`; // Access the stack to generate the error message including the error code
          // from the name.

          this.stack; // eslint-disable-line no-unused-expressions
          // Reset the name to the actual name.

          delete this.name;
        }

        get code() {
          return sym;
        }

        set code(value) {
          Object.defineProperty(this, 'code', {
            configurable: true,
            enumerable: true,
            value,
            writable: true
          });
        }

        toString() {
          return `${this.name} [${sym}]: ${this.message}`;
        }

      };
    }

    E('ERR_BUFFER_OUT_OF_BOUNDS', function (name) {
      if (name) {
        return `${name} is outside of buffer bounds`;
      }

      return 'Attempt to access memory outside buffer bounds';
    }, RangeError);
    E('ERR_INVALID_ARG_TYPE', function (name, actual) {
      return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
    }, TypeError);
    E('ERR_OUT_OF_RANGE', function (str, range, input) {
      let msg = `The value of "${str}" is out of range.`;
      let received = input;

      if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
        received = addNumericalSeparator(String(input));
      } else if (typeof input === 'bigint') {
        received = String(input);

        if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
          received = addNumericalSeparator(received);
        }

        received += 'n';
      }

      msg += ` It must be ${range}. Received ${received}`;
      return msg;
    }, RangeError);

    function addNumericalSeparator(val) {
      let res = '';
      let i = val.length;
      const start = val[0] === '-' ? 1 : 0;

      for (; i >= start + 4; i -= 3) {
        res = `_${val.slice(i - 3, i)}${res}`;
      }

      return `${val.slice(0, i)}${res}`;
    } // CHECK FUNCTIONS
    // ===============


    function checkBounds(buf, offset, byteLength) {
      validateNumber(offset, 'offset');

      if (buf[offset] === undefined || buf[offset + byteLength] === undefined) {
        boundsError(offset, buf.length - (byteLength + 1));
      }
    }

    function checkIntBI(value, min, max, buf, offset, byteLength) {
      if (value > max || value < min) {
        const n = typeof min === 'bigint' ? 'n' : '';
        let range;

        if (byteLength > 3) {
          if (min === 0 || min === BigInt(0)) {
            range = `>= 0${n} and < 2${n} ** ${(byteLength + 1) * 8}${n}`;
          } else {
            range = `>= -(2${n} ** ${(byteLength + 1) * 8 - 1}${n}) and < 2 ** ` + `${(byteLength + 1) * 8 - 1}${n}`;
          }
        } else {
          range = `>= ${min}${n} and <= ${max}${n}`;
        }

        throw new errors.ERR_OUT_OF_RANGE('value', range, value);
      }

      checkBounds(buf, offset, byteLength);
    }

    function validateNumber(value, name) {
      if (typeof value !== 'number') {
        throw new errors.ERR_INVALID_ARG_TYPE(name, 'number', value);
      }
    }

    function boundsError(value, length, type) {
      if (Math.floor(value) !== value) {
        validateNumber(value, type);
        throw new errors.ERR_OUT_OF_RANGE(type || 'offset', 'an integer', value);
      }

      if (length < 0) {
        throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
      }

      throw new errors.ERR_OUT_OF_RANGE(type || 'offset', `>= ${type ? 1 : 0} and <= ${length}`, value);
    } // HELPER FUNCTIONS
    // ================


    const INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;

    function base64clean(str) {
      // Node takes equal signs as end of the Base64 encoding
      str = str.split('=')[0]; // Node strips out invalid characters like \n and \t from the string, base64-js does not

      str = str.trim().replace(INVALID_BASE64_RE, ''); // Node converts strings with length < 2 to ''

      if (str.length < 2) return ''; // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not

      while (str.length % 4 !== 0) {
        str = str + '=';
      }

      return str;
    }

    function utf8ToBytes(string, units) {
      units = units || Infinity;
      let codePoint;
      const length = string.length;
      let leadSurrogate = null;
      const bytes = [];

      for (let i = 0; i < length; ++i) {
        codePoint = string.charCodeAt(i); // is surrogate component

        if (codePoint > 0xD7FF && codePoint < 0xE000) {
          // last char was a lead
          if (!leadSurrogate) {
            // no lead yet
            if (codePoint > 0xDBFF) {
              // unexpected trail
              if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
              continue;
            } else if (i + 1 === length) {
              // unpaired lead
              if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
              continue;
            } // valid lead


            leadSurrogate = codePoint;
            continue;
          } // 2 leads in a row


          if (codePoint < 0xDC00) {
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
            leadSurrogate = codePoint;
            continue;
          } // valid surrogate pair


          codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
        } else if (leadSurrogate) {
          // valid bmp char, but last char was a lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        }

        leadSurrogate = null; // encode utf8

        if (codePoint < 0x80) {
          if ((units -= 1) < 0) break;
          bytes.push(codePoint);
        } else if (codePoint < 0x800) {
          if ((units -= 2) < 0) break;
          bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
        } else if (codePoint < 0x10000) {
          if ((units -= 3) < 0) break;
          bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
        } else if (codePoint < 0x110000) {
          if ((units -= 4) < 0) break;
          bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
        } else {
          throw new Error('Invalid code point');
        }
      }

      return bytes;
    }

    function asciiToBytes(str) {
      const byteArray = [];

      for (let i = 0; i < str.length; ++i) {
        // Node's code seems to be doing this and not & 0x7F..
        byteArray.push(str.charCodeAt(i) & 0xFF);
      }

      return byteArray;
    }

    function utf16leToBytes(str, units) {
      let c, hi, lo;
      const byteArray = [];

      for (let i = 0; i < str.length; ++i) {
        if ((units -= 2) < 0) break;
        c = str.charCodeAt(i);
        hi = c >> 8;
        lo = c % 256;
        byteArray.push(lo);
        byteArray.push(hi);
      }

      return byteArray;
    }

    function base64ToBytes(str) {
      return base64.toByteArray(base64clean(str));
    }

    function blitBuffer(src, dst, offset, length) {
      let i;

      for (i = 0; i < length; ++i) {
        if (i + offset >= dst.length || i >= src.length) break;
        dst[i + offset] = src[i];
      }

      return i;
    } // ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
    // the `instanceof` check but they should be treated as of that type.
    // See: https://github.com/feross/buffer/issues/166


    function isInstance(obj, type) {
      return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
    }

    function numberIsNaN(obj) {
      // For IE11 support
      return obj !== obj; // eslint-disable-line no-self-compare
    } // Create lookup table for `toString('hex')`
    // See: https://github.com/feross/buffer/issues/219


    const hexSliceLookupTable = function () {
      const alphabet = '0123456789abcdef';
      const table = new Array(256);

      for (let i = 0; i < 16; ++i) {
        const i16 = i * 16;

        for (let j = 0; j < 16; ++j) {
          table[i16 + j] = alphabet[i] + alphabet[j];
        }
      }

      return table;
    }(); // Return not function with Error if BigInt not supported


    function defineBigIntMethod(fn) {
      return typeof BigInt === 'undefined' ? BufferBigIntNotDefined : fn;
    }

    function BufferBigIntNotDefined() {
      throw new Error('BigInt not supported');
    }
  })(buffer);

  const isBase64UrlFormatSupported = buffer.Buffer.isEncoding('base64url');
  const decode$1 = (base64String, format = 'base64') => {
    if (format !== 'base64' && format !== 'base64url') return '';

    if (!isBase64UrlFormatSupported) {
      format = 'base64';
      base64String = base64UrlPreprocessor.prepareValueForDecoding(base64String);
    }

    return buffer.Buffer.from(base64String, format).toString('utf8');
  };
  const encode$1 = (value, format = 'base64') => {
    if (format !== 'base64' && format !== 'base64url') return '';
    if (isBase64UrlFormatSupported) return buffer.Buffer.from(value, 'utf8').toString(format);
    const encodedValue = buffer.Buffer.from(value, 'utf8').toString('base64');
    return base64UrlPreprocessor.prepareEncodedValue(encodedValue);
  };
  const base64UrlPreprocessor = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    prepareEncodedValue: base64value => base64value.split('=')[0].replace(/\+/g, '-').replace(/\//g, '_'),
    prepareValueForDecoding: base64value => {
      base64value = base64value.replace(/-/g, '+').replace(/_/g, '/');

      switch (base64value.length % 4) {
        case 0:
          return base64value;

        case 2:
          return base64value + '==';

        case 3:
          return base64value + '=';

        default:
          throw new Error('Invalid base64url value');
      }
    }
  };

  var base64 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    decode: decode$1,
    encode: encode$1
  });

  var bignumber = {exports: {}};

  (function (module) {

    (function (globalObject) {
      /*
       *      bignumber.js v9.0.1
       *      A JavaScript library for arbitrary-precision arithmetic.
       *      https://github.com/MikeMcl/bignumber.js
       *      Copyright (c) 2020 Michael Mclaughlin <M8ch88l@gmail.com>
       *      MIT Licensed.
       *
       *      BigNumber.prototype methods     |  BigNumber methods
       *                                      |
       *      absoluteValue            abs    |  clone
       *      comparedTo                      |  config               set
       *      decimalPlaces            dp     |      DECIMAL_PLACES
       *      dividedBy                div    |      ROUNDING_MODE
       *      dividedToIntegerBy       idiv   |      EXPONENTIAL_AT
       *      exponentiatedBy          pow    |      RANGE
       *      integerValue                    |      CRYPTO
       *      isEqualTo                eq     |      MODULO_MODE
       *      isFinite                        |      POW_PRECISION
       *      isGreaterThan            gt     |      FORMAT
       *      isGreaterThanOrEqualTo   gte    |      ALPHABET
       *      isInteger                       |  isBigNumber
       *      isLessThan               lt     |  maximum              max
       *      isLessThanOrEqualTo      lte    |  minimum              min
       *      isNaN                           |  random
       *      isNegative                      |  sum
       *      isPositive                      |
       *      isZero                          |
       *      minus                           |
       *      modulo                   mod    |
       *      multipliedBy             times  |
       *      negated                         |
       *      plus                            |
       *      precision                sd     |
       *      shiftedBy                       |
       *      squareRoot               sqrt   |
       *      toExponential                   |
       *      toFixed                         |
       *      toFormat                        |
       *      toFraction                      |
       *      toJSON                          |
       *      toNumber                        |
       *      toPrecision                     |
       *      toString                        |
       *      valueOf                         |
       *
       */

      var BigNumber,
          isNumeric = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i,
          mathceil = Math.ceil,
          mathfloor = Math.floor,
          bignumberError = '[BigNumber Error] ',
          tooManyDigits = bignumberError + 'Number primitive has more than 15 significant digits: ',
          BASE = 1e14,
          LOG_BASE = 14,
          MAX_SAFE_INTEGER = 0x1fffffffffffff,
          // 2^53 - 1
      // MAX_INT32 = 0x7fffffff,                   // 2^31 - 1
      POWS_TEN = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13],
          SQRT_BASE = 1e7,
          // EDITABLE
      // The limit on the value of DECIMAL_PLACES, TO_EXP_NEG, TO_EXP_POS, MIN_EXP, MAX_EXP, and
      // the arguments to toExponential, toFixed, toFormat, and toPrecision.
      MAX = 1E9; // 0 to MAX_INT32

      /*
       * Create and return a BigNumber constructor.
       */

      function clone(configObject) {
        var div,
            convertBase,
            parseNumeric,
            P = BigNumber.prototype = {
          constructor: BigNumber,
          toString: null,
          valueOf: null
        },
            ONE = new BigNumber(1),
            //----------------------------- EDITABLE CONFIG DEFAULTS -------------------------------
        // The default values below must be integers within the inclusive ranges stated.
        // The values can also be changed at run-time using BigNumber.set.
        // The maximum number of decimal places for operations involving division.
        DECIMAL_PLACES = 20,
            // 0 to MAX
        // The rounding mode used when rounding to the above decimal places, and when using
        // toExponential, toFixed, toFormat and toPrecision, and round (default value).
        // UP         0 Away from zero.
        // DOWN       1 Towards zero.
        // CEIL       2 Towards +Infinity.
        // FLOOR      3 Towards -Infinity.
        // HALF_UP    4 Towards nearest neighbour. If equidistant, up.
        // HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
        // HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
        // HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
        // HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
        ROUNDING_MODE = 4,
            // 0 to 8
        // EXPONENTIAL_AT : [TO_EXP_NEG , TO_EXP_POS]
        // The exponent value at and beneath which toString returns exponential notation.
        // Number type: -7
        TO_EXP_NEG = -7,
            // 0 to -MAX
        // The exponent value at and above which toString returns exponential notation.
        // Number type: 21
        TO_EXP_POS = 21,
            // 0 to MAX
        // RANGE : [MIN_EXP, MAX_EXP]
        // The minimum exponent value, beneath which underflow to zero occurs.
        // Number type: -324  (5e-324)
        MIN_EXP = -1e7,
            // -1 to -MAX
        // The maximum exponent value, above which overflow to Infinity occurs.
        // Number type:  308  (1.7976931348623157e+308)
        // For MAX_EXP > 1e7, e.g. new BigNumber('1e100000000').plus(1) may be slow.
        MAX_EXP = 1e7,
            // 1 to MAX
        // Whether to use cryptographically-secure random number generation, if available.
        CRYPTO = false,
            // true or false
        // The modulo mode used when calculating the modulus: a mod n.
        // The quotient (q = a / n) is calculated according to the corresponding rounding mode.
        // The remainder (r) is calculated as: r = a - n * q.
        //
        // UP        0 The remainder is positive if the dividend is negative, else is negative.
        // DOWN      1 The remainder has the same sign as the dividend.
        //             This modulo mode is commonly known as 'truncated division' and is
        //             equivalent to (a % n) in JavaScript.
        // FLOOR     3 The remainder has the same sign as the divisor (Python %).
        // HALF_EVEN 6 This modulo mode implements the IEEE 754 remainder function.
        // EUCLID    9 Euclidian division. q = sign(n) * floor(a / abs(n)).
        //             The remainder is always positive.
        //
        // The truncated division, floored division, Euclidian division and IEEE 754 remainder
        // modes are commonly used for the modulus operation.
        // Although the other rounding modes can also be used, they may not give useful results.
        MODULO_MODE = 1,
            // 0 to 9
        // The maximum number of significant digits of the result of the exponentiatedBy operation.
        // If POW_PRECISION is 0, there will be unlimited significant digits.
        POW_PRECISION = 0,
            // 0 to MAX
        // The format specification used by the BigNumber.prototype.toFormat method.
        FORMAT = {
          prefix: '',
          groupSize: 3,
          secondaryGroupSize: 0,
          groupSeparator: ',',
          decimalSeparator: '.',
          fractionGroupSize: 0,
          fractionGroupSeparator: '\xA0',
          // non-breaking space
          suffix: ''
        },
            // The alphabet used for base conversion. It must be at least 2 characters long, with no '+',
        // '-', '.', whitespace, or repeated character.
        // '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_'
        ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz'; //------------------------------------------------------------------------------------------
        // CONSTRUCTOR

        /*
         * The BigNumber constructor and exported function.
         * Create and return a new instance of a BigNumber object.
         *
         * v {number|string|BigNumber} A numeric value.
         * [b] {number} The base of v. Integer, 2 to ALPHABET.length inclusive.
         */

        function BigNumber(v, b) {
          var alphabet,
              c,
              caseChanged,
              e,
              i,
              isNum,
              len,
              str,
              x = this; // Enable constructor call without `new`.

          if (!(x instanceof BigNumber)) return new BigNumber(v, b);

          if (b == null) {
            if (v && v._isBigNumber === true) {
              x.s = v.s;

              if (!v.c || v.e > MAX_EXP) {
                x.c = x.e = null;
              } else if (v.e < MIN_EXP) {
                x.c = [x.e = 0];
              } else {
                x.e = v.e;
                x.c = v.c.slice();
              }

              return;
            }

            if ((isNum = typeof v == 'number') && v * 0 == 0) {
              // Use `1 / n` to handle minus zero also.
              x.s = 1 / v < 0 ? (v = -v, -1) : 1; // Fast path for integers, where n < 2147483648 (2**31).

              if (v === ~~v) {
                for (e = 0, i = v; i >= 10; i /= 10, e++);

                if (e > MAX_EXP) {
                  x.c = x.e = null;
                } else {
                  x.e = e;
                  x.c = [v];
                }

                return;
              }

              str = String(v);
            } else {
              if (!isNumeric.test(str = String(v))) return parseNumeric(x, str, isNum);
              x.s = str.charCodeAt(0) == 45 ? (str = str.slice(1), -1) : 1;
            } // Decimal point?


            if ((e = str.indexOf('.')) > -1) str = str.replace('.', ''); // Exponential form?

            if ((i = str.search(/e/i)) > 0) {
              // Determine exponent.
              if (e < 0) e = i;
              e += +str.slice(i + 1);
              str = str.substring(0, i);
            } else if (e < 0) {
              // Integer.
              e = str.length;
            }
          } else {
            // '[BigNumber Error] Base {not a primitive number|not an integer|out of range}: {b}'
            intCheck(b, 2, ALPHABET.length, 'Base'); // Allow exponential notation to be used with base 10 argument, while
            // also rounding to DECIMAL_PLACES as with other bases.

            if (b == 10) {
              x = new BigNumber(v);
              return round(x, DECIMAL_PLACES + x.e + 1, ROUNDING_MODE);
            }

            str = String(v);

            if (isNum = typeof v == 'number') {
              // Avoid potential interpretation of Infinity and NaN as base 44+ values.
              if (v * 0 != 0) return parseNumeric(x, str, isNum, b);
              x.s = 1 / v < 0 ? (str = str.slice(1), -1) : 1; // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'

              if (BigNumber.DEBUG && str.replace(/^0\.0*|\./, '').length > 15) {
                throw Error(tooManyDigits + v);
              }
            } else {
              x.s = str.charCodeAt(0) === 45 ? (str = str.slice(1), -1) : 1;
            }

            alphabet = ALPHABET.slice(0, b);
            e = i = 0; // Check that str is a valid base b number.
            // Don't use RegExp, so alphabet can contain special characters.

            for (len = str.length; i < len; i++) {
              if (alphabet.indexOf(c = str.charAt(i)) < 0) {
                if (c == '.') {
                  // If '.' is not the first character and it has not be found before.
                  if (i > e) {
                    e = len;
                    continue;
                  }
                } else if (!caseChanged) {
                  // Allow e.g. hexadecimal 'FF' as well as 'ff'.
                  if (str == str.toUpperCase() && (str = str.toLowerCase()) || str == str.toLowerCase() && (str = str.toUpperCase())) {
                    caseChanged = true;
                    i = -1;
                    e = 0;
                    continue;
                  }
                }

                return parseNumeric(x, String(v), isNum, b);
              }
            } // Prevent later check for length on converted number.


            isNum = false;
            str = convertBase(str, b, 10, x.s); // Decimal point?

            if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');else e = str.length;
          } // Determine leading zeros.


          for (i = 0; str.charCodeAt(i) === 48; i++); // Determine trailing zeros.


          for (len = str.length; str.charCodeAt(--len) === 48;);

          if (str = str.slice(i, ++len)) {
            len -= i; // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'

            if (isNum && BigNumber.DEBUG && len > 15 && (v > MAX_SAFE_INTEGER || v !== mathfloor(v))) {
              throw Error(tooManyDigits + x.s * v);
            } // Overflow?


            if ((e = e - i - 1) > MAX_EXP) {
              // Infinity.
              x.c = x.e = null; // Underflow?
            } else if (e < MIN_EXP) {
              // Zero.
              x.c = [x.e = 0];
            } else {
              x.e = e;
              x.c = []; // Transform base
              // e is the base 10 exponent.
              // i is where to slice str to get the first element of the coefficient array.

              i = (e + 1) % LOG_BASE;
              if (e < 0) i += LOG_BASE; // i < 1

              if (i < len) {
                if (i) x.c.push(+str.slice(0, i));

                for (len -= LOG_BASE; i < len;) {
                  x.c.push(+str.slice(i, i += LOG_BASE));
                }

                i = LOG_BASE - (str = str.slice(i)).length;
              } else {
                i -= len;
              }

              for (; i--; str += '0');

              x.c.push(+str);
            }
          } else {
            // Zero.
            x.c = [x.e = 0];
          }
        } // CONSTRUCTOR PROPERTIES


        BigNumber.clone = clone;
        BigNumber.ROUND_UP = 0;
        BigNumber.ROUND_DOWN = 1;
        BigNumber.ROUND_CEIL = 2;
        BigNumber.ROUND_FLOOR = 3;
        BigNumber.ROUND_HALF_UP = 4;
        BigNumber.ROUND_HALF_DOWN = 5;
        BigNumber.ROUND_HALF_EVEN = 6;
        BigNumber.ROUND_HALF_CEIL = 7;
        BigNumber.ROUND_HALF_FLOOR = 8;
        BigNumber.EUCLID = 9;
        /*
         * Configure infrequently-changing library-wide settings.
         *
         * Accept an object with the following optional properties (if the value of a property is
         * a number, it must be an integer within the inclusive range stated):
         *
         *   DECIMAL_PLACES   {number}           0 to MAX
         *   ROUNDING_MODE    {number}           0 to 8
         *   EXPONENTIAL_AT   {number|number[]}  -MAX to MAX  or  [-MAX to 0, 0 to MAX]
         *   RANGE            {number|number[]}  -MAX to MAX (not zero)  or  [-MAX to -1, 1 to MAX]
         *   CRYPTO           {boolean}          true or false
         *   MODULO_MODE      {number}           0 to 9
         *   POW_PRECISION       {number}           0 to MAX
         *   ALPHABET         {string}           A string of two or more unique characters which does
         *                                       not contain '.'.
         *   FORMAT           {object}           An object with some of the following properties:
         *     prefix                 {string}
         *     groupSize              {number}
         *     secondaryGroupSize     {number}
         *     groupSeparator         {string}
         *     decimalSeparator       {string}
         *     fractionGroupSize      {number}
         *     fractionGroupSeparator {string}
         *     suffix                 {string}
         *
         * (The values assigned to the above FORMAT object properties are not checked for validity.)
         *
         * E.g.
         * BigNumber.config({ DECIMAL_PLACES : 20, ROUNDING_MODE : 4 })
         *
         * Ignore properties/parameters set to null or undefined, except for ALPHABET.
         *
         * Return an object with the properties current values.
         */

        BigNumber.config = BigNumber.set = function (obj) {
          var p, v;

          if (obj != null) {
            if (typeof obj == 'object') {
              // DECIMAL_PLACES {number} Integer, 0 to MAX inclusive.
              // '[BigNumber Error] DECIMAL_PLACES {not a primitive number|not an integer|out of range}: {v}'
              if (obj.hasOwnProperty(p = 'DECIMAL_PLACES')) {
                v = obj[p];
                intCheck(v, 0, MAX, p);
                DECIMAL_PLACES = v;
              } // ROUNDING_MODE {number} Integer, 0 to 8 inclusive.
              // '[BigNumber Error] ROUNDING_MODE {not a primitive number|not an integer|out of range}: {v}'


              if (obj.hasOwnProperty(p = 'ROUNDING_MODE')) {
                v = obj[p];
                intCheck(v, 0, 8, p);
                ROUNDING_MODE = v;
              } // EXPONENTIAL_AT {number|number[]}
              // Integer, -MAX to MAX inclusive or
              // [integer -MAX to 0 inclusive, 0 to MAX inclusive].
              // '[BigNumber Error] EXPONENTIAL_AT {not a primitive number|not an integer|out of range}: {v}'


              if (obj.hasOwnProperty(p = 'EXPONENTIAL_AT')) {
                v = obj[p];

                if (v && v.pop) {
                  intCheck(v[0], -MAX, 0, p);
                  intCheck(v[1], 0, MAX, p);
                  TO_EXP_NEG = v[0];
                  TO_EXP_POS = v[1];
                } else {
                  intCheck(v, -MAX, MAX, p);
                  TO_EXP_NEG = -(TO_EXP_POS = v < 0 ? -v : v);
                }
              } // RANGE {number|number[]} Non-zero integer, -MAX to MAX inclusive or
              // [integer -MAX to -1 inclusive, integer 1 to MAX inclusive].
              // '[BigNumber Error] RANGE {not a primitive number|not an integer|out of range|cannot be zero}: {v}'


              if (obj.hasOwnProperty(p = 'RANGE')) {
                v = obj[p];

                if (v && v.pop) {
                  intCheck(v[0], -MAX, -1, p);
                  intCheck(v[1], 1, MAX, p);
                  MIN_EXP = v[0];
                  MAX_EXP = v[1];
                } else {
                  intCheck(v, -MAX, MAX, p);

                  if (v) {
                    MIN_EXP = -(MAX_EXP = v < 0 ? -v : v);
                  } else {
                    throw Error(bignumberError + p + ' cannot be zero: ' + v);
                  }
                }
              } // CRYPTO {boolean} true or false.
              // '[BigNumber Error] CRYPTO not true or false: {v}'
              // '[BigNumber Error] crypto unavailable'


              if (obj.hasOwnProperty(p = 'CRYPTO')) {
                v = obj[p];

                if (v === !!v) {
                  if (v) {
                    if (typeof crypto != 'undefined' && crypto && (crypto.getRandomValues || crypto.randomBytes)) {
                      CRYPTO = v;
                    } else {
                      CRYPTO = !v;
                      throw Error(bignumberError + 'crypto unavailable');
                    }
                  } else {
                    CRYPTO = v;
                  }
                } else {
                  throw Error(bignumberError + p + ' not true or false: ' + v);
                }
              } // MODULO_MODE {number} Integer, 0 to 9 inclusive.
              // '[BigNumber Error] MODULO_MODE {not a primitive number|not an integer|out of range}: {v}'


              if (obj.hasOwnProperty(p = 'MODULO_MODE')) {
                v = obj[p];
                intCheck(v, 0, 9, p);
                MODULO_MODE = v;
              } // POW_PRECISION {number} Integer, 0 to MAX inclusive.
              // '[BigNumber Error] POW_PRECISION {not a primitive number|not an integer|out of range}: {v}'


              if (obj.hasOwnProperty(p = 'POW_PRECISION')) {
                v = obj[p];
                intCheck(v, 0, MAX, p);
                POW_PRECISION = v;
              } // FORMAT {object}
              // '[BigNumber Error] FORMAT not an object: {v}'


              if (obj.hasOwnProperty(p = 'FORMAT')) {
                v = obj[p];
                if (typeof v == 'object') FORMAT = v;else throw Error(bignumberError + p + ' not an object: ' + v);
              } // ALPHABET {string}
              // '[BigNumber Error] ALPHABET invalid: {v}'


              if (obj.hasOwnProperty(p = 'ALPHABET')) {
                v = obj[p]; // Disallow if less than two characters,
                // or if it contains '+', '-', '.', whitespace, or a repeated character.

                if (typeof v == 'string' && !/^.?$|[+\-.\s]|(.).*\1/.test(v)) {
                  ALPHABET = v;
                } else {
                  throw Error(bignumberError + p + ' invalid: ' + v);
                }
              }
            } else {
              // '[BigNumber Error] Object expected: {v}'
              throw Error(bignumberError + 'Object expected: ' + obj);
            }
          }

          return {
            DECIMAL_PLACES: DECIMAL_PLACES,
            ROUNDING_MODE: ROUNDING_MODE,
            EXPONENTIAL_AT: [TO_EXP_NEG, TO_EXP_POS],
            RANGE: [MIN_EXP, MAX_EXP],
            CRYPTO: CRYPTO,
            MODULO_MODE: MODULO_MODE,
            POW_PRECISION: POW_PRECISION,
            FORMAT: FORMAT,
            ALPHABET: ALPHABET
          };
        };
        /*
         * Return true if v is a BigNumber instance, otherwise return false.
         *
         * If BigNumber.DEBUG is true, throw if a BigNumber instance is not well-formed.
         *
         * v {any}
         *
         * '[BigNumber Error] Invalid BigNumber: {v}'
         */


        BigNumber.isBigNumber = function (v) {
          if (!v || v._isBigNumber !== true) return false;
          if (!BigNumber.DEBUG) return true;
          var i,
              n,
              c = v.c,
              e = v.e,
              s = v.s;

          out: if ({}.toString.call(c) == '[object Array]') {
            if ((s === 1 || s === -1) && e >= -MAX && e <= MAX && e === mathfloor(e)) {
              // If the first element is zero, the BigNumber value must be zero.
              if (c[0] === 0) {
                if (e === 0 && c.length === 1) return true;
                break out;
              } // Calculate number of digits that c[0] should have, based on the exponent.


              i = (e + 1) % LOG_BASE;
              if (i < 1) i += LOG_BASE; // Calculate number of digits of c[0].
              //if (Math.ceil(Math.log(c[0] + 1) / Math.LN10) == i) {

              if (String(c[0]).length == i) {
                for (i = 0; i < c.length; i++) {
                  n = c[i];
                  if (n < 0 || n >= BASE || n !== mathfloor(n)) break out;
                } // Last element cannot be zero, unless it is the only element.


                if (n !== 0) return true;
              }
            } // Infinity/NaN

          } else if (c === null && e === null && (s === null || s === 1 || s === -1)) {
            return true;
          }

          throw Error(bignumberError + 'Invalid BigNumber: ' + v);
        };
        /*
         * Return a new BigNumber whose value is the maximum of the arguments.
         *
         * arguments {number|string|BigNumber}
         */


        BigNumber.maximum = BigNumber.max = function () {
          return maxOrMin(arguments, P.lt);
        };
        /*
         * Return a new BigNumber whose value is the minimum of the arguments.
         *
         * arguments {number|string|BigNumber}
         */


        BigNumber.minimum = BigNumber.min = function () {
          return maxOrMin(arguments, P.gt);
        };
        /*
         * Return a new BigNumber with a random value equal to or greater than 0 and less than 1,
         * and with dp, or DECIMAL_PLACES if dp is omitted, decimal places (or less if trailing
         * zeros are produced).
         *
         * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
         *
         * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp}'
         * '[BigNumber Error] crypto unavailable'
         */


        BigNumber.random = function () {
          var pow2_53 = 0x20000000000000; // Return a 53 bit integer n, where 0 <= n < 9007199254740992.
          // Check if Math.random() produces more than 32 bits of randomness.
          // If it does, assume at least 53 bits are produced, otherwise assume at least 30 bits.
          // 0x40000000 is 2^30, 0x800000 is 2^23, 0x1fffff is 2^21 - 1.

          var random53bitInt = Math.random() * pow2_53 & 0x1fffff ? function () {
            return mathfloor(Math.random() * pow2_53);
          } : function () {
            return (Math.random() * 0x40000000 | 0) * 0x800000 + (Math.random() * 0x800000 | 0);
          };
          return function (dp) {
            var a,
                b,
                e,
                k,
                v,
                i = 0,
                c = [],
                rand = new BigNumber(ONE);
            if (dp == null) dp = DECIMAL_PLACES;else intCheck(dp, 0, MAX);
            k = mathceil(dp / LOG_BASE);

            if (CRYPTO) {
              // Browsers supporting crypto.getRandomValues.
              if (crypto.getRandomValues) {
                a = crypto.getRandomValues(new Uint32Array(k *= 2));

                for (; i < k;) {
                  // 53 bits:
                  // ((Math.pow(2, 32) - 1) * Math.pow(2, 21)).toString(2)
                  // 11111 11111111 11111111 11111111 11100000 00000000 00000000
                  // ((Math.pow(2, 32) - 1) >>> 11).toString(2)
                  //                                     11111 11111111 11111111
                  // 0x20000 is 2^21.
                  v = a[i] * 0x20000 + (a[i + 1] >>> 11); // Rejection sampling:
                  // 0 <= v < 9007199254740992
                  // Probability that v >= 9e15, is
                  // 7199254740992 / 9007199254740992 ~= 0.0008, i.e. 1 in 1251

                  if (v >= 9e15) {
                    b = crypto.getRandomValues(new Uint32Array(2));
                    a[i] = b[0];
                    a[i + 1] = b[1];
                  } else {
                    // 0 <= v <= 8999999999999999
                    // 0 <= (v % 1e14) <= 99999999999999
                    c.push(v % 1e14);
                    i += 2;
                  }
                }

                i = k / 2; // Node.js supporting crypto.randomBytes.
              } else if (crypto.randomBytes) {
                // buffer
                a = crypto.randomBytes(k *= 7);

                for (; i < k;) {
                  // 0x1000000000000 is 2^48, 0x10000000000 is 2^40
                  // 0x100000000 is 2^32, 0x1000000 is 2^24
                  // 11111 11111111 11111111 11111111 11111111 11111111 11111111
                  // 0 <= v < 9007199254740992
                  v = (a[i] & 31) * 0x1000000000000 + a[i + 1] * 0x10000000000 + a[i + 2] * 0x100000000 + a[i + 3] * 0x1000000 + (a[i + 4] << 16) + (a[i + 5] << 8) + a[i + 6];

                  if (v >= 9e15) {
                    crypto.randomBytes(7).copy(a, i);
                  } else {
                    // 0 <= (v % 1e14) <= 99999999999999
                    c.push(v % 1e14);
                    i += 7;
                  }
                }

                i = k / 7;
              } else {
                CRYPTO = false;
                throw Error(bignumberError + 'crypto unavailable');
              }
            } // Use Math.random.


            if (!CRYPTO) {
              for (; i < k;) {
                v = random53bitInt();
                if (v < 9e15) c[i++] = v % 1e14;
              }
            }

            k = c[--i];
            dp %= LOG_BASE; // Convert trailing digits to zeros according to dp.

            if (k && dp) {
              v = POWS_TEN[LOG_BASE - dp];
              c[i] = mathfloor(k / v) * v;
            } // Remove trailing elements which are zero.


            for (; c[i] === 0; c.pop(), i--); // Zero?


            if (i < 0) {
              c = [e = 0];
            } else {
              // Remove leading elements which are zero and adjust exponent accordingly.
              for (e = -1; c[0] === 0; c.splice(0, 1), e -= LOG_BASE); // Count the digits of the first element of c to determine leading zeros, and...


              for (i = 1, v = c[0]; v >= 10; v /= 10, i++); // adjust the exponent accordingly.


              if (i < LOG_BASE) e -= LOG_BASE - i;
            }

            rand.e = e;
            rand.c = c;
            return rand;
          };
        }();
        /*
         * Return a BigNumber whose value is the sum of the arguments.
         *
         * arguments {number|string|BigNumber}
         */


        BigNumber.sum = function () {
          var i = 1,
              args = arguments,
              sum = new BigNumber(args[0]);

          for (; i < args.length;) sum = sum.plus(args[i++]);

          return sum;
        }; // PRIVATE FUNCTIONS
        // Called by BigNumber and BigNumber.prototype.toString.


        convertBase = function () {
          var decimal = '0123456789';
          /*
           * Convert string of baseIn to an array of numbers of baseOut.
           * Eg. toBaseOut('255', 10, 16) returns [15, 15].
           * Eg. toBaseOut('ff', 16, 10) returns [2, 5, 5].
           */

          function toBaseOut(str, baseIn, baseOut, alphabet) {
            var j,
                arr = [0],
                arrL,
                i = 0,
                len = str.length;

            for (; i < len;) {
              for (arrL = arr.length; arrL--; arr[arrL] *= baseIn);

              arr[0] += alphabet.indexOf(str.charAt(i++));

              for (j = 0; j < arr.length; j++) {
                if (arr[j] > baseOut - 1) {
                  if (arr[j + 1] == null) arr[j + 1] = 0;
                  arr[j + 1] += arr[j] / baseOut | 0;
                  arr[j] %= baseOut;
                }
              }
            }

            return arr.reverse();
          } // Convert a numeric string of baseIn to a numeric string of baseOut.
          // If the caller is toString, we are converting from base 10 to baseOut.
          // If the caller is BigNumber, we are converting from baseIn to base 10.


          return function (str, baseIn, baseOut, sign, callerIsToString) {
            var alphabet,
                d,
                e,
                k,
                r,
                x,
                xc,
                y,
                i = str.indexOf('.'),
                dp = DECIMAL_PLACES,
                rm = ROUNDING_MODE; // Non-integer.

            if (i >= 0) {
              k = POW_PRECISION; // Unlimited precision.

              POW_PRECISION = 0;
              str = str.replace('.', '');
              y = new BigNumber(baseIn);
              x = y.pow(str.length - i);
              POW_PRECISION = k; // Convert str as if an integer, then restore the fraction part by dividing the
              // result by its base raised to a power.

              y.c = toBaseOut(toFixedPoint(coeffToString(x.c), x.e, '0'), 10, baseOut, decimal);
              y.e = y.c.length;
            } // Convert the number as integer.


            xc = toBaseOut(str, baseIn, baseOut, callerIsToString ? (alphabet = ALPHABET, decimal) : (alphabet = decimal, ALPHABET)); // xc now represents str as an integer and converted to baseOut. e is the exponent.

            e = k = xc.length; // Remove trailing zeros.

            for (; xc[--k] == 0; xc.pop()); // Zero?


            if (!xc[0]) return alphabet.charAt(0); // Does str represent an integer? If so, no need for the division.

            if (i < 0) {
              --e;
            } else {
              x.c = xc;
              x.e = e; // The sign is needed for correct rounding.

              x.s = sign;
              x = div(x, y, dp, rm, baseOut);
              xc = x.c;
              r = x.r;
              e = x.e;
            } // xc now represents str converted to baseOut.
            // THe index of the rounding digit.


            d = e + dp + 1; // The rounding digit: the digit to the right of the digit that may be rounded up.

            i = xc[d]; // Look at the rounding digits and mode to determine whether to round up.

            k = baseOut / 2;
            r = r || d < 0 || xc[d + 1] != null;
            r = rm < 4 ? (i != null || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : i > k || i == k && (rm == 4 || r || rm == 6 && xc[d - 1] & 1 || rm == (x.s < 0 ? 8 : 7)); // If the index of the rounding digit is not greater than zero, or xc represents
            // zero, then the result of the base conversion is zero or, if rounding up, a value
            // such as 0.00001.

            if (d < 1 || !xc[0]) {
              // 1^-dp or 0
              str = r ? toFixedPoint(alphabet.charAt(1), -dp, alphabet.charAt(0)) : alphabet.charAt(0);
            } else {
              // Truncate xc to the required number of decimal places.
              xc.length = d; // Round up?

              if (r) {
                // Rounding up may mean the previous digit has to be rounded up and so on.
                for (--baseOut; ++xc[--d] > baseOut;) {
                  xc[d] = 0;

                  if (!d) {
                    ++e;
                    xc = [1].concat(xc);
                  }
                }
              } // Determine trailing zeros.


              for (k = xc.length; !xc[--k];); // E.g. [4, 11, 15] becomes 4bf.


              for (i = 0, str = ''; i <= k; str += alphabet.charAt(xc[i++])); // Add leading zeros, decimal point and trailing zeros as required.


              str = toFixedPoint(str, e, alphabet.charAt(0));
            } // The caller will add the sign.


            return str;
          };
        }(); // Perform division in the specified base. Called by div and convertBase.


        div = function () {
          // Assume non-zero x and k.
          function multiply(x, k, base) {
            var m,
                temp,
                xlo,
                xhi,
                carry = 0,
                i = x.length,
                klo = k % SQRT_BASE,
                khi = k / SQRT_BASE | 0;

            for (x = x.slice(); i--;) {
              xlo = x[i] % SQRT_BASE;
              xhi = x[i] / SQRT_BASE | 0;
              m = khi * xlo + xhi * klo;
              temp = klo * xlo + m % SQRT_BASE * SQRT_BASE + carry;
              carry = (temp / base | 0) + (m / SQRT_BASE | 0) + khi * xhi;
              x[i] = temp % base;
            }

            if (carry) x = [carry].concat(x);
            return x;
          }

          function compare(a, b, aL, bL) {
            var i, cmp;

            if (aL != bL) {
              cmp = aL > bL ? 1 : -1;
            } else {
              for (i = cmp = 0; i < aL; i++) {
                if (a[i] != b[i]) {
                  cmp = a[i] > b[i] ? 1 : -1;
                  break;
                }
              }
            }

            return cmp;
          }

          function subtract(a, b, aL, base) {
            var i = 0; // Subtract b from a.

            for (; aL--;) {
              a[aL] -= i;
              i = a[aL] < b[aL] ? 1 : 0;
              a[aL] = i * base + a[aL] - b[aL];
            } // Remove leading zeros.


            for (; !a[0] && a.length > 1; a.splice(0, 1));
          } // x: dividend, y: divisor.


          return function (x, y, dp, rm, base) {
            var cmp,
                e,
                i,
                more,
                n,
                prod,
                prodL,
                q,
                qc,
                rem,
                remL,
                rem0,
                xi,
                xL,
                yc0,
                yL,
                yz,
                s = x.s == y.s ? 1 : -1,
                xc = x.c,
                yc = y.c; // Either NaN, Infinity or 0?

            if (!xc || !xc[0] || !yc || !yc[0]) {
              return new BigNumber( // Return NaN if either NaN, or both Infinity or 0.
              !x.s || !y.s || (xc ? yc && xc[0] == yc[0] : !yc) ? NaN : // Return ±0 if x is ±0 or y is ±Infinity, or return ±Infinity as y is ±0.
              xc && xc[0] == 0 || !yc ? s * 0 : s / 0);
            }

            q = new BigNumber(s);
            qc = q.c = [];
            e = x.e - y.e;
            s = dp + e + 1;

            if (!base) {
              base = BASE;
              e = bitFloor(x.e / LOG_BASE) - bitFloor(y.e / LOG_BASE);
              s = s / LOG_BASE | 0;
            } // Result exponent may be one less then the current value of e.
            // The coefficients of the BigNumbers from convertBase may have trailing zeros.


            for (i = 0; yc[i] == (xc[i] || 0); i++);

            if (yc[i] > (xc[i] || 0)) e--;

            if (s < 0) {
              qc.push(1);
              more = true;
            } else {
              xL = xc.length;
              yL = yc.length;
              i = 0;
              s += 2; // Normalise xc and yc so highest order digit of yc is >= base / 2.

              n = mathfloor(base / (yc[0] + 1)); // Not necessary, but to handle odd bases where yc[0] == (base / 2) - 1.
              // if (n > 1 || n++ == 1 && yc[0] < base / 2) {

              if (n > 1) {
                yc = multiply(yc, n, base);
                xc = multiply(xc, n, base);
                yL = yc.length;
                xL = xc.length;
              }

              xi = yL;
              rem = xc.slice(0, yL);
              remL = rem.length; // Add zeros to make remainder as long as divisor.

              for (; remL < yL; rem[remL++] = 0);

              yz = yc.slice();
              yz = [0].concat(yz);
              yc0 = yc[0];
              if (yc[1] >= base / 2) yc0++; // Not necessary, but to prevent trial digit n > base, when using base 3.
              // else if (base == 3 && yc0 == 1) yc0 = 1 + 1e-15;

              do {
                n = 0; // Compare divisor and remainder.

                cmp = compare(yc, rem, yL, remL); // If divisor < remainder.

                if (cmp < 0) {
                  // Calculate trial digit, n.
                  rem0 = rem[0];
                  if (yL != remL) rem0 = rem0 * base + (rem[1] || 0); // n is how many times the divisor goes into the current remainder.

                  n = mathfloor(rem0 / yc0); //  Algorithm:
                  //  product = divisor multiplied by trial digit (n).
                  //  Compare product and remainder.
                  //  If product is greater than remainder:
                  //    Subtract divisor from product, decrement trial digit.
                  //  Subtract product from remainder.
                  //  If product was less than remainder at the last compare:
                  //    Compare new remainder and divisor.
                  //    If remainder is greater than divisor:
                  //      Subtract divisor from remainder, increment trial digit.

                  if (n > 1) {
                    // n may be > base only when base is 3.
                    if (n >= base) n = base - 1; // product = divisor * trial digit.

                    prod = multiply(yc, n, base);
                    prodL = prod.length;
                    remL = rem.length; // Compare product and remainder.
                    // If product > remainder then trial digit n too high.
                    // n is 1 too high about 5% of the time, and is not known to have
                    // ever been more than 1 too high.

                    while (compare(prod, rem, prodL, remL) == 1) {
                      n--; // Subtract divisor from product.

                      subtract(prod, yL < prodL ? yz : yc, prodL, base);
                      prodL = prod.length;
                      cmp = 1;
                    }
                  } else {
                    // n is 0 or 1, cmp is -1.
                    // If n is 0, there is no need to compare yc and rem again below,
                    // so change cmp to 1 to avoid it.
                    // If n is 1, leave cmp as -1, so yc and rem are compared again.
                    if (n == 0) {
                      // divisor < remainder, so n must be at least 1.
                      cmp = n = 1;
                    } // product = divisor


                    prod = yc.slice();
                    prodL = prod.length;
                  }

                  if (prodL < remL) prod = [0].concat(prod); // Subtract product from remainder.

                  subtract(rem, prod, remL, base);
                  remL = rem.length; // If product was < remainder.

                  if (cmp == -1) {
                    // Compare divisor and new remainder.
                    // If divisor < new remainder, subtract divisor from remainder.
                    // Trial digit n too low.
                    // n is 1 too low about 5% of the time, and very rarely 2 too low.
                    while (compare(yc, rem, yL, remL) < 1) {
                      n++; // Subtract divisor from remainder.

                      subtract(rem, yL < remL ? yz : yc, remL, base);
                      remL = rem.length;
                    }
                  }
                } else if (cmp === 0) {
                  n++;
                  rem = [0];
                } // else cmp === 1 and n will be 0
                // Add the next digit, n, to the result array.


                qc[i++] = n; // Update the remainder.

                if (rem[0]) {
                  rem[remL++] = xc[xi] || 0;
                } else {
                  rem = [xc[xi]];
                  remL = 1;
                }
              } while ((xi++ < xL || rem[0] != null) && s--);

              more = rem[0] != null; // Leading zero?

              if (!qc[0]) qc.splice(0, 1);
            }

            if (base == BASE) {
              // To calculate q.e, first get the number of digits of qc[0].
              for (i = 1, s = qc[0]; s >= 10; s /= 10, i++);

              round(q, dp + (q.e = i + e * LOG_BASE - 1) + 1, rm, more); // Caller is convertBase.
            } else {
              q.e = e;
              q.r = +more;
            }

            return q;
          };
        }();
        /*
         * Return a string representing the value of BigNumber n in fixed-point or exponential
         * notation rounded to the specified decimal places or significant digits.
         *
         * n: a BigNumber.
         * i: the index of the last digit required (i.e. the digit that may be rounded up).
         * rm: the rounding mode.
         * id: 1 (toExponential) or 2 (toPrecision).
         */


        function format(n, i, rm, id) {
          var c0, e, ne, len, str;
          if (rm == null) rm = ROUNDING_MODE;else intCheck(rm, 0, 8);
          if (!n.c) return n.toString();
          c0 = n.c[0];
          ne = n.e;

          if (i == null) {
            str = coeffToString(n.c);
            str = id == 1 || id == 2 && (ne <= TO_EXP_NEG || ne >= TO_EXP_POS) ? toExponential(str, ne) : toFixedPoint(str, ne, '0');
          } else {
            n = round(new BigNumber(n), i, rm); // n.e may have changed if the value was rounded up.

            e = n.e;
            str = coeffToString(n.c);
            len = str.length; // toPrecision returns exponential notation if the number of significant digits
            // specified is less than the number of digits necessary to represent the integer
            // part of the value in fixed-point notation.
            // Exponential notation.

            if (id == 1 || id == 2 && (i <= e || e <= TO_EXP_NEG)) {
              // Append zeros?
              for (; len < i; str += '0', len++);

              str = toExponential(str, e); // Fixed-point notation.
            } else {
              i -= ne;
              str = toFixedPoint(str, e, '0'); // Append zeros?

              if (e + 1 > len) {
                if (--i > 0) for (str += '.'; i--; str += '0');
              } else {
                i += e - len;

                if (i > 0) {
                  if (e + 1 == len) str += '.';

                  for (; i--; str += '0');
                }
              }
            }
          }

          return n.s < 0 && c0 ? '-' + str : str;
        } // Handle BigNumber.max and BigNumber.min.


        function maxOrMin(args, method) {
          var n,
              i = 1,
              m = new BigNumber(args[0]);

          for (; i < args.length; i++) {
            n = new BigNumber(args[i]); // If any number is NaN, return NaN.

            if (!n.s) {
              m = n;
              break;
            } else if (method.call(m, n)) {
              m = n;
            }
          }

          return m;
        }
        /*
         * Strip trailing zeros, calculate base 10 exponent and check against MIN_EXP and MAX_EXP.
         * Called by minus, plus and times.
         */


        function normalise(n, c, e) {
          var i = 1,
              j = c.length; // Remove trailing zeros.

          for (; !c[--j]; c.pop()); // Calculate the base 10 exponent. First get the number of digits of c[0].


          for (j = c[0]; j >= 10; j /= 10, i++); // Overflow?


          if ((e = i + e * LOG_BASE - 1) > MAX_EXP) {
            // Infinity.
            n.c = n.e = null; // Underflow?
          } else if (e < MIN_EXP) {
            // Zero.
            n.c = [n.e = 0];
          } else {
            n.e = e;
            n.c = c;
          }

          return n;
        } // Handle values that fail the validity test in BigNumber.


        parseNumeric = function () {
          var basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i,
              dotAfter = /^([^.]+)\.$/,
              dotBefore = /^\.([^.]+)$/,
              isInfinityOrNaN = /^-?(Infinity|NaN)$/,
              whitespaceOrPlus = /^\s*\+(?=[\w.])|^\s+|\s+$/g;
          return function (x, str, isNum, b) {
            var base,
                s = isNum ? str : str.replace(whitespaceOrPlus, ''); // No exception on ±Infinity or NaN.

            if (isInfinityOrNaN.test(s)) {
              x.s = isNaN(s) ? null : s < 0 ? -1 : 1;
            } else {
              if (!isNum) {
                // basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i
                s = s.replace(basePrefix, function (m, p1, p2) {
                  base = (p2 = p2.toLowerCase()) == 'x' ? 16 : p2 == 'b' ? 2 : 8;
                  return !b || b == base ? p1 : m;
                });

                if (b) {
                  base = b; // E.g. '1.' to '1', '.1' to '0.1'

                  s = s.replace(dotAfter, '$1').replace(dotBefore, '0.$1');
                }

                if (str != s) return new BigNumber(s, base);
              } // '[BigNumber Error] Not a number: {n}'
              // '[BigNumber Error] Not a base {b} number: {n}'


              if (BigNumber.DEBUG) {
                throw Error(bignumberError + 'Not a' + (b ? ' base ' + b : '') + ' number: ' + str);
              } // NaN


              x.s = null;
            }

            x.c = x.e = null;
          };
        }();
        /*
         * Round x to sd significant digits using rounding mode rm. Check for over/under-flow.
         * If r is truthy, it is known that there are more digits after the rounding digit.
         */


        function round(x, sd, rm, r) {
          var d,
              i,
              j,
              k,
              n,
              ni,
              rd,
              xc = x.c,
              pows10 = POWS_TEN; // if x is not Infinity or NaN...

          if (xc) {
            // rd is the rounding digit, i.e. the digit after the digit that may be rounded up.
            // n is a base 1e14 number, the value of the element of array x.c containing rd.
            // ni is the index of n within x.c.
            // d is the number of digits of n.
            // i is the index of rd within n including leading zeros.
            // j is the actual index of rd within n (if < 0, rd is a leading zero).
            out: {
              // Get the number of digits of the first element of xc.
              for (d = 1, k = xc[0]; k >= 10; k /= 10, d++);

              i = sd - d; // If the rounding digit is in the first element of xc...

              if (i < 0) {
                i += LOG_BASE;
                j = sd;
                n = xc[ni = 0]; // Get the rounding digit at index j of n.

                rd = n / pows10[d - j - 1] % 10 | 0;
              } else {
                ni = mathceil((i + 1) / LOG_BASE);

                if (ni >= xc.length) {
                  if (r) {
                    // Needed by sqrt.
                    for (; xc.length <= ni; xc.push(0));

                    n = rd = 0;
                    d = 1;
                    i %= LOG_BASE;
                    j = i - LOG_BASE + 1;
                  } else {
                    break out;
                  }
                } else {
                  n = k = xc[ni]; // Get the number of digits of n.

                  for (d = 1; k >= 10; k /= 10, d++); // Get the index of rd within n.


                  i %= LOG_BASE; // Get the index of rd within n, adjusted for leading zeros.
                  // The number of leading zeros of n is given by LOG_BASE - d.

                  j = i - LOG_BASE + d; // Get the rounding digit at index j of n.

                  rd = j < 0 ? 0 : n / pows10[d - j - 1] % 10 | 0;
                }
              }

              r = r || sd < 0 || // Are there any non-zero digits after the rounding digit?
              // The expression  n % pows10[d - j - 1]  returns all digits of n to the right
              // of the digit at j, e.g. if n is 908714 and j is 2, the expression gives 714.
              xc[ni + 1] != null || (j < 0 ? n : n % pows10[d - j - 1]);
              r = rm < 4 ? (rd || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : rd > 5 || rd == 5 && (rm == 4 || r || rm == 6 && // Check whether the digit to the left of the rounding digit is odd.
              (i > 0 ? j > 0 ? n / pows10[d - j] : 0 : xc[ni - 1]) % 10 & 1 || rm == (x.s < 0 ? 8 : 7));

              if (sd < 1 || !xc[0]) {
                xc.length = 0;

                if (r) {
                  // Convert sd to decimal places.
                  sd -= x.e + 1; // 1, 0.1, 0.01, 0.001, 0.0001 etc.

                  xc[0] = pows10[(LOG_BASE - sd % LOG_BASE) % LOG_BASE];
                  x.e = -sd || 0;
                } else {
                  // Zero.
                  xc[0] = x.e = 0;
                }

                return x;
              } // Remove excess digits.


              if (i == 0) {
                xc.length = ni;
                k = 1;
                ni--;
              } else {
                xc.length = ni + 1;
                k = pows10[LOG_BASE - i]; // E.g. 56700 becomes 56000 if 7 is the rounding digit.
                // j > 0 means i > number of leading zeros of n.

                xc[ni] = j > 0 ? mathfloor(n / pows10[d - j] % pows10[j]) * k : 0;
              } // Round up?


              if (r) {
                for (;;) {
                  // If the digit to be rounded up is in the first element of xc...
                  if (ni == 0) {
                    // i will be the length of xc[0] before k is added.
                    for (i = 1, j = xc[0]; j >= 10; j /= 10, i++);

                    j = xc[0] += k;

                    for (k = 1; j >= 10; j /= 10, k++); // if i != k the length has increased.


                    if (i != k) {
                      x.e++;
                      if (xc[0] == BASE) xc[0] = 1;
                    }

                    break;
                  } else {
                    xc[ni] += k;
                    if (xc[ni] != BASE) break;
                    xc[ni--] = 0;
                    k = 1;
                  }
                }
              } // Remove trailing zeros.


              for (i = xc.length; xc[--i] === 0; xc.pop());
            } // Overflow? Infinity.


            if (x.e > MAX_EXP) {
              x.c = x.e = null; // Underflow? Zero.
            } else if (x.e < MIN_EXP) {
              x.c = [x.e = 0];
            }
          }

          return x;
        }

        function valueOf(n) {
          var str,
              e = n.e;
          if (e === null) return n.toString();
          str = coeffToString(n.c);
          str = e <= TO_EXP_NEG || e >= TO_EXP_POS ? toExponential(str, e) : toFixedPoint(str, e, '0');
          return n.s < 0 ? '-' + str : str;
        } // PROTOTYPE/INSTANCE METHODS

        /*
         * Return a new BigNumber whose value is the absolute value of this BigNumber.
         */


        P.absoluteValue = P.abs = function () {
          var x = new BigNumber(this);
          if (x.s < 0) x.s = 1;
          return x;
        };
        /*
         * Return
         *   1 if the value of this BigNumber is greater than the value of BigNumber(y, b),
         *   -1 if the value of this BigNumber is less than the value of BigNumber(y, b),
         *   0 if they have the same value,
         *   or null if the value of either is NaN.
         */


        P.comparedTo = function (y, b) {
          return compare(this, new BigNumber(y, b));
        };
        /*
         * If dp is undefined or null or true or false, return the number of decimal places of the
         * value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
         *
         * Otherwise, if dp is a number, return a new BigNumber whose value is the value of this
         * BigNumber rounded to a maximum of dp decimal places using rounding mode rm, or
         * ROUNDING_MODE if rm is omitted.
         *
         * [dp] {number} Decimal places: integer, 0 to MAX inclusive.
         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
         *
         * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
         */


        P.decimalPlaces = P.dp = function (dp, rm) {
          var c,
              n,
              v,
              x = this;

          if (dp != null) {
            intCheck(dp, 0, MAX);
            if (rm == null) rm = ROUNDING_MODE;else intCheck(rm, 0, 8);
            return round(new BigNumber(x), dp + x.e + 1, rm);
          }

          if (!(c = x.c)) return null;
          n = ((v = c.length - 1) - bitFloor(this.e / LOG_BASE)) * LOG_BASE; // Subtract the number of trailing zeros of the last number.

          if (v = c[v]) for (; v % 10 == 0; v /= 10, n--);
          if (n < 0) n = 0;
          return n;
        };
        /*
         *  n / 0 = I
         *  n / N = N
         *  n / I = 0
         *  0 / n = 0
         *  0 / 0 = N
         *  0 / N = N
         *  0 / I = 0
         *  N / n = N
         *  N / 0 = N
         *  N / N = N
         *  N / I = N
         *  I / n = I
         *  I / 0 = I
         *  I / N = N
         *  I / I = N
         *
         * Return a new BigNumber whose value is the value of this BigNumber divided by the value of
         * BigNumber(y, b), rounded according to DECIMAL_PLACES and ROUNDING_MODE.
         */


        P.dividedBy = P.div = function (y, b) {
          return div(this, new BigNumber(y, b), DECIMAL_PLACES, ROUNDING_MODE);
        };
        /*
         * Return a new BigNumber whose value is the integer part of dividing the value of this
         * BigNumber by the value of BigNumber(y, b).
         */


        P.dividedToIntegerBy = P.idiv = function (y, b) {
          return div(this, new BigNumber(y, b), 0, 1);
        };
        /*
         * Return a BigNumber whose value is the value of this BigNumber exponentiated by n.
         *
         * If m is present, return the result modulo m.
         * If n is negative round according to DECIMAL_PLACES and ROUNDING_MODE.
         * If POW_PRECISION is non-zero and m is not present, round to POW_PRECISION using ROUNDING_MODE.
         *
         * The modular power operation works efficiently when x, n, and m are integers, otherwise it
         * is equivalent to calculating x.exponentiatedBy(n).modulo(m) with a POW_PRECISION of 0.
         *
         * n {number|string|BigNumber} The exponent. An integer.
         * [m] {number|string|BigNumber} The modulus.
         *
         * '[BigNumber Error] Exponent not an integer: {n}'
         */


        P.exponentiatedBy = P.pow = function (n, m) {
          var half,
              isModExp,
              i,
              k,
              more,
              nIsBig,
              nIsNeg,
              nIsOdd,
              y,
              x = this;
          n = new BigNumber(n); // Allow NaN and ±Infinity, but not other non-integers.

          if (n.c && !n.isInteger()) {
            throw Error(bignumberError + 'Exponent not an integer: ' + valueOf(n));
          }

          if (m != null) m = new BigNumber(m); // Exponent of MAX_SAFE_INTEGER is 15.

          nIsBig = n.e > 14; // If x is NaN, ±Infinity, ±0 or ±1, or n is ±Infinity, NaN or ±0.

          if (!x.c || !x.c[0] || x.c[0] == 1 && !x.e && x.c.length == 1 || !n.c || !n.c[0]) {
            // The sign of the result of pow when x is negative depends on the evenness of n.
            // If +n overflows to ±Infinity, the evenness of n would be not be known.
            y = new BigNumber(Math.pow(+valueOf(x), nIsBig ? 2 - isOdd(n) : +valueOf(n)));
            return m ? y.mod(m) : y;
          }

          nIsNeg = n.s < 0;

          if (m) {
            // x % m returns NaN if abs(m) is zero, or m is NaN.
            if (m.c ? !m.c[0] : !m.s) return new BigNumber(NaN);
            isModExp = !nIsNeg && x.isInteger() && m.isInteger();
            if (isModExp) x = x.mod(m); // Overflow to ±Infinity: >=2**1e10 or >=1.0000024**1e15.
            // Underflow to ±0: <=0.79**1e10 or <=0.9999975**1e15.
          } else if (n.e > 9 && (x.e > 0 || x.e < -1 || (x.e == 0 // [1, 240000000]
          ? x.c[0] > 1 || nIsBig && x.c[1] >= 24e7 // [80000000000000]  [99999750000000]
          : x.c[0] < 8e13 || nIsBig && x.c[0] <= 9999975e7))) {
            // If x is negative and n is odd, k = -0, else k = 0.
            k = x.s < 0 && isOdd(n) ? -0 : 0; // If x >= 1, k = ±Infinity.

            if (x.e > -1) k = 1 / k; // If n is negative return ±0, else return ±Infinity.

            return new BigNumber(nIsNeg ? 1 / k : k);
          } else if (POW_PRECISION) {
            // Truncating each coefficient array to a length of k after each multiplication
            // equates to truncating significant digits to POW_PRECISION + [28, 41],
            // i.e. there will be a minimum of 28 guard digits retained.
            k = mathceil(POW_PRECISION / LOG_BASE + 2);
          }

          if (nIsBig) {
            half = new BigNumber(0.5);
            if (nIsNeg) n.s = 1;
            nIsOdd = isOdd(n);
          } else {
            i = Math.abs(+valueOf(n));
            nIsOdd = i % 2;
          }

          y = new BigNumber(ONE); // Performs 54 loop iterations for n of 9007199254740991.

          for (;;) {
            if (nIsOdd) {
              y = y.times(x);
              if (!y.c) break;

              if (k) {
                if (y.c.length > k) y.c.length = k;
              } else if (isModExp) {
                y = y.mod(m); //y = y.minus(div(y, m, 0, MODULO_MODE).times(m));
              }
            }

            if (i) {
              i = mathfloor(i / 2);
              if (i === 0) break;
              nIsOdd = i % 2;
            } else {
              n = n.times(half);
              round(n, n.e + 1, 1);

              if (n.e > 14) {
                nIsOdd = isOdd(n);
              } else {
                i = +valueOf(n);
                if (i === 0) break;
                nIsOdd = i % 2;
              }
            }

            x = x.times(x);

            if (k) {
              if (x.c && x.c.length > k) x.c.length = k;
            } else if (isModExp) {
              x = x.mod(m); //x = x.minus(div(x, m, 0, MODULO_MODE).times(m));
            }
          }

          if (isModExp) return y;
          if (nIsNeg) y = ONE.div(y);
          return m ? y.mod(m) : k ? round(y, POW_PRECISION, ROUNDING_MODE, more) : y;
        };
        /*
         * Return a new BigNumber whose value is the value of this BigNumber rounded to an integer
         * using rounding mode rm, or ROUNDING_MODE if rm is omitted.
         *
         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
         *
         * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {rm}'
         */


        P.integerValue = function (rm) {
          var n = new BigNumber(this);
          if (rm == null) rm = ROUNDING_MODE;else intCheck(rm, 0, 8);
          return round(n, n.e + 1, rm);
        };
        /*
         * Return true if the value of this BigNumber is equal to the value of BigNumber(y, b),
         * otherwise return false.
         */


        P.isEqualTo = P.eq = function (y, b) {
          return compare(this, new BigNumber(y, b)) === 0;
        };
        /*
         * Return true if the value of this BigNumber is a finite number, otherwise return false.
         */


        P.isFinite = function () {
          return !!this.c;
        };
        /*
         * Return true if the value of this BigNumber is greater than the value of BigNumber(y, b),
         * otherwise return false.
         */


        P.isGreaterThan = P.gt = function (y, b) {
          return compare(this, new BigNumber(y, b)) > 0;
        };
        /*
         * Return true if the value of this BigNumber is greater than or equal to the value of
         * BigNumber(y, b), otherwise return false.
         */


        P.isGreaterThanOrEqualTo = P.gte = function (y, b) {
          return (b = compare(this, new BigNumber(y, b))) === 1 || b === 0;
        };
        /*
         * Return true if the value of this BigNumber is an integer, otherwise return false.
         */


        P.isInteger = function () {
          return !!this.c && bitFloor(this.e / LOG_BASE) > this.c.length - 2;
        };
        /*
         * Return true if the value of this BigNumber is less than the value of BigNumber(y, b),
         * otherwise return false.
         */


        P.isLessThan = P.lt = function (y, b) {
          return compare(this, new BigNumber(y, b)) < 0;
        };
        /*
         * Return true if the value of this BigNumber is less than or equal to the value of
         * BigNumber(y, b), otherwise return false.
         */


        P.isLessThanOrEqualTo = P.lte = function (y, b) {
          return (b = compare(this, new BigNumber(y, b))) === -1 || b === 0;
        };
        /*
         * Return true if the value of this BigNumber is NaN, otherwise return false.
         */


        P.isNaN = function () {
          return !this.s;
        };
        /*
         * Return true if the value of this BigNumber is negative, otherwise return false.
         */


        P.isNegative = function () {
          return this.s < 0;
        };
        /*
         * Return true if the value of this BigNumber is positive, otherwise return false.
         */


        P.isPositive = function () {
          return this.s > 0;
        };
        /*
         * Return true if the value of this BigNumber is 0 or -0, otherwise return false.
         */


        P.isZero = function () {
          return !!this.c && this.c[0] == 0;
        };
        /*
         *  n - 0 = n
         *  n - N = N
         *  n - I = -I
         *  0 - n = -n
         *  0 - 0 = 0
         *  0 - N = N
         *  0 - I = -I
         *  N - n = N
         *  N - 0 = N
         *  N - N = N
         *  N - I = N
         *  I - n = I
         *  I - 0 = I
         *  I - N = N
         *  I - I = N
         *
         * Return a new BigNumber whose value is the value of this BigNumber minus the value of
         * BigNumber(y, b).
         */


        P.minus = function (y, b) {
          var i,
              j,
              t,
              xLTy,
              x = this,
              a = x.s;
          y = new BigNumber(y, b);
          b = y.s; // Either NaN?

          if (!a || !b) return new BigNumber(NaN); // Signs differ?

          if (a != b) {
            y.s = -b;
            return x.plus(y);
          }

          var xe = x.e / LOG_BASE,
              ye = y.e / LOG_BASE,
              xc = x.c,
              yc = y.c;

          if (!xe || !ye) {
            // Either Infinity?
            if (!xc || !yc) return xc ? (y.s = -b, y) : new BigNumber(yc ? x : NaN); // Either zero?

            if (!xc[0] || !yc[0]) {
              // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
              return yc[0] ? (y.s = -b, y) : new BigNumber(xc[0] ? x : // IEEE 754 (2008) 6.3: n - n = -0 when rounding to -Infinity
              ROUNDING_MODE == 3 ? -0 : 0);
            }
          }

          xe = bitFloor(xe);
          ye = bitFloor(ye);
          xc = xc.slice(); // Determine which is the bigger number.

          if (a = xe - ye) {
            if (xLTy = a < 0) {
              a = -a;
              t = xc;
            } else {
              ye = xe;
              t = yc;
            }

            t.reverse(); // Prepend zeros to equalise exponents.

            for (b = a; b--; t.push(0));

            t.reverse();
          } else {
            // Exponents equal. Check digit by digit.
            j = (xLTy = (a = xc.length) < (b = yc.length)) ? a : b;

            for (a = b = 0; b < j; b++) {
              if (xc[b] != yc[b]) {
                xLTy = xc[b] < yc[b];
                break;
              }
            }
          } // x < y? Point xc to the array of the bigger number.


          if (xLTy) t = xc, xc = yc, yc = t, y.s = -y.s;
          b = (j = yc.length) - (i = xc.length); // Append zeros to xc if shorter.
          // No need to add zeros to yc if shorter as subtract only needs to start at yc.length.

          if (b > 0) for (; b--; xc[i++] = 0);
          b = BASE - 1; // Subtract yc from xc.

          for (; j > a;) {
            if (xc[--j] < yc[j]) {
              for (i = j; i && !xc[--i]; xc[i] = b);

              --xc[i];
              xc[j] += BASE;
            }

            xc[j] -= yc[j];
          } // Remove leading zeros and adjust exponent accordingly.


          for (; xc[0] == 0; xc.splice(0, 1), --ye); // Zero?


          if (!xc[0]) {
            // Following IEEE 754 (2008) 6.3,
            // n - n = +0  but  n - n = -0  when rounding towards -Infinity.
            y.s = ROUNDING_MODE == 3 ? -1 : 1;
            y.c = [y.e = 0];
            return y;
          } // No need to check for Infinity as +x - +y != Infinity && -x - -y != Infinity
          // for finite x and y.


          return normalise(y, xc, ye);
        };
        /*
         *   n % 0 =  N
         *   n % N =  N
         *   n % I =  n
         *   0 % n =  0
         *  -0 % n = -0
         *   0 % 0 =  N
         *   0 % N =  N
         *   0 % I =  0
         *   N % n =  N
         *   N % 0 =  N
         *   N % N =  N
         *   N % I =  N
         *   I % n =  N
         *   I % 0 =  N
         *   I % N =  N
         *   I % I =  N
         *
         * Return a new BigNumber whose value is the value of this BigNumber modulo the value of
         * BigNumber(y, b). The result depends on the value of MODULO_MODE.
         */


        P.modulo = P.mod = function (y, b) {
          var q,
              s,
              x = this;
          y = new BigNumber(y, b); // Return NaN if x is Infinity or NaN, or y is NaN or zero.

          if (!x.c || !y.s || y.c && !y.c[0]) {
            return new BigNumber(NaN); // Return x if y is Infinity or x is zero.
          } else if (!y.c || x.c && !x.c[0]) {
            return new BigNumber(x);
          }

          if (MODULO_MODE == 9) {
            // Euclidian division: q = sign(y) * floor(x / abs(y))
            // r = x - qy    where  0 <= r < abs(y)
            s = y.s;
            y.s = 1;
            q = div(x, y, 0, 3);
            y.s = s;
            q.s *= s;
          } else {
            q = div(x, y, 0, MODULO_MODE);
          }

          y = x.minus(q.times(y)); // To match JavaScript %, ensure sign of zero is sign of dividend.

          if (!y.c[0] && MODULO_MODE == 1) y.s = x.s;
          return y;
        };
        /*
         *  n * 0 = 0
         *  n * N = N
         *  n * I = I
         *  0 * n = 0
         *  0 * 0 = 0
         *  0 * N = N
         *  0 * I = N
         *  N * n = N
         *  N * 0 = N
         *  N * N = N
         *  N * I = N
         *  I * n = I
         *  I * 0 = N
         *  I * N = N
         *  I * I = I
         *
         * Return a new BigNumber whose value is the value of this BigNumber multiplied by the value
         * of BigNumber(y, b).
         */


        P.multipliedBy = P.times = function (y, b) {
          var c,
              e,
              i,
              j,
              k,
              m,
              xcL,
              xlo,
              xhi,
              ycL,
              ylo,
              yhi,
              zc,
              base,
              sqrtBase,
              x = this,
              xc = x.c,
              yc = (y = new BigNumber(y, b)).c; // Either NaN, ±Infinity or ±0?

          if (!xc || !yc || !xc[0] || !yc[0]) {
            // Return NaN if either is NaN, or one is 0 and the other is Infinity.
            if (!x.s || !y.s || xc && !xc[0] && !yc || yc && !yc[0] && !xc) {
              y.c = y.e = y.s = null;
            } else {
              y.s *= x.s; // Return ±Infinity if either is ±Infinity.

              if (!xc || !yc) {
                y.c = y.e = null; // Return ±0 if either is ±0.
              } else {
                y.c = [0];
                y.e = 0;
              }
            }

            return y;
          }

          e = bitFloor(x.e / LOG_BASE) + bitFloor(y.e / LOG_BASE);
          y.s *= x.s;
          xcL = xc.length;
          ycL = yc.length; // Ensure xc points to longer array and xcL to its length.

          if (xcL < ycL) zc = xc, xc = yc, yc = zc, i = xcL, xcL = ycL, ycL = i; // Initialise the result array with zeros.

          for (i = xcL + ycL, zc = []; i--; zc.push(0));

          base = BASE;
          sqrtBase = SQRT_BASE;

          for (i = ycL; --i >= 0;) {
            c = 0;
            ylo = yc[i] % sqrtBase;
            yhi = yc[i] / sqrtBase | 0;

            for (k = xcL, j = i + k; j > i;) {
              xlo = xc[--k] % sqrtBase;
              xhi = xc[k] / sqrtBase | 0;
              m = yhi * xlo + xhi * ylo;
              xlo = ylo * xlo + m % sqrtBase * sqrtBase + zc[j] + c;
              c = (xlo / base | 0) + (m / sqrtBase | 0) + yhi * xhi;
              zc[j--] = xlo % base;
            }

            zc[j] = c;
          }

          if (c) {
            ++e;
          } else {
            zc.splice(0, 1);
          }

          return normalise(y, zc, e);
        };
        /*
         * Return a new BigNumber whose value is the value of this BigNumber negated,
         * i.e. multiplied by -1.
         */


        P.negated = function () {
          var x = new BigNumber(this);
          x.s = -x.s || null;
          return x;
        };
        /*
         *  n + 0 = n
         *  n + N = N
         *  n + I = I
         *  0 + n = n
         *  0 + 0 = 0
         *  0 + N = N
         *  0 + I = I
         *  N + n = N
         *  N + 0 = N
         *  N + N = N
         *  N + I = N
         *  I + n = I
         *  I + 0 = I
         *  I + N = N
         *  I + I = I
         *
         * Return a new BigNumber whose value is the value of this BigNumber plus the value of
         * BigNumber(y, b).
         */


        P.plus = function (y, b) {
          var t,
              x = this,
              a = x.s;
          y = new BigNumber(y, b);
          b = y.s; // Either NaN?

          if (!a || !b) return new BigNumber(NaN); // Signs differ?

          if (a != b) {
            y.s = -b;
            return x.minus(y);
          }

          var xe = x.e / LOG_BASE,
              ye = y.e / LOG_BASE,
              xc = x.c,
              yc = y.c;

          if (!xe || !ye) {
            // Return ±Infinity if either ±Infinity.
            if (!xc || !yc) return new BigNumber(a / 0); // Either zero?
            // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.

            if (!xc[0] || !yc[0]) return yc[0] ? y : new BigNumber(xc[0] ? x : a * 0);
          }

          xe = bitFloor(xe);
          ye = bitFloor(ye);
          xc = xc.slice(); // Prepend zeros to equalise exponents. Faster to use reverse then do unshifts.

          if (a = xe - ye) {
            if (a > 0) {
              ye = xe;
              t = yc;
            } else {
              a = -a;
              t = xc;
            }

            t.reverse();

            for (; a--; t.push(0));

            t.reverse();
          }

          a = xc.length;
          b = yc.length; // Point xc to the longer array, and b to the shorter length.

          if (a - b < 0) t = yc, yc = xc, xc = t, b = a; // Only start adding at yc.length - 1 as the further digits of xc can be ignored.

          for (a = 0; b;) {
            a = (xc[--b] = xc[b] + yc[b] + a) / BASE | 0;
            xc[b] = BASE === xc[b] ? 0 : xc[b] % BASE;
          }

          if (a) {
            xc = [a].concat(xc);
            ++ye;
          } // No need to check for zero, as +x + +y != 0 && -x + -y != 0
          // ye = MAX_EXP + 1 possible


          return normalise(y, xc, ye);
        };
        /*
         * If sd is undefined or null or true or false, return the number of significant digits of
         * the value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
         * If sd is true include integer-part trailing zeros in the count.
         *
         * Otherwise, if sd is a number, return a new BigNumber whose value is the value of this
         * BigNumber rounded to a maximum of sd significant digits using rounding mode rm, or
         * ROUNDING_MODE if rm is omitted.
         *
         * sd {number|boolean} number: significant digits: integer, 1 to MAX inclusive.
         *                     boolean: whether to count integer-part trailing zeros: true or false.
         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
         *
         * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
         */


        P.precision = P.sd = function (sd, rm) {
          var c,
              n,
              v,
              x = this;

          if (sd != null && sd !== !!sd) {
            intCheck(sd, 1, MAX);
            if (rm == null) rm = ROUNDING_MODE;else intCheck(rm, 0, 8);
            return round(new BigNumber(x), sd, rm);
          }

          if (!(c = x.c)) return null;
          v = c.length - 1;
          n = v * LOG_BASE + 1;

          if (v = c[v]) {
            // Subtract the number of trailing zeros of the last element.
            for (; v % 10 == 0; v /= 10, n--); // Add the number of digits of the first element.


            for (v = c[0]; v >= 10; v /= 10, n++);
          }

          if (sd && x.e + 1 > n) n = x.e + 1;
          return n;
        };
        /*
         * Return a new BigNumber whose value is the value of this BigNumber shifted by k places
         * (powers of 10). Shift to the right if n > 0, and to the left if n < 0.
         *
         * k {number} Integer, -MAX_SAFE_INTEGER to MAX_SAFE_INTEGER inclusive.
         *
         * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {k}'
         */


        P.shiftedBy = function (k) {
          intCheck(k, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
          return this.times('1e' + k);
        };
        /*
         *  sqrt(-n) =  N
         *  sqrt(N) =  N
         *  sqrt(-I) =  N
         *  sqrt(I) =  I
         *  sqrt(0) =  0
         *  sqrt(-0) = -0
         *
         * Return a new BigNumber whose value is the square root of the value of this BigNumber,
         * rounded according to DECIMAL_PLACES and ROUNDING_MODE.
         */


        P.squareRoot = P.sqrt = function () {
          var m,
              n,
              r,
              rep,
              t,
              x = this,
              c = x.c,
              s = x.s,
              e = x.e,
              dp = DECIMAL_PLACES + 4,
              half = new BigNumber('0.5'); // Negative/NaN/Infinity/zero?

          if (s !== 1 || !c || !c[0]) {
            return new BigNumber(!s || s < 0 && (!c || c[0]) ? NaN : c ? x : 1 / 0);
          } // Initial estimate.


          s = Math.sqrt(+valueOf(x)); // Math.sqrt underflow/overflow?
          // Pass x to Math.sqrt as integer, then adjust the exponent of the result.

          if (s == 0 || s == 1 / 0) {
            n = coeffToString(c);
            if ((n.length + e) % 2 == 0) n += '0';
            s = Math.sqrt(+n);
            e = bitFloor((e + 1) / 2) - (e < 0 || e % 2);

            if (s == 1 / 0) {
              n = '5e' + e;
            } else {
              n = s.toExponential();
              n = n.slice(0, n.indexOf('e') + 1) + e;
            }

            r = new BigNumber(n);
          } else {
            r = new BigNumber(s + '');
          } // Check for zero.
          // r could be zero if MIN_EXP is changed after the this value was created.
          // This would cause a division by zero (x/t) and hence Infinity below, which would cause
          // coeffToString to throw.


          if (r.c[0]) {
            e = r.e;
            s = e + dp;
            if (s < 3) s = 0; // Newton-Raphson iteration.

            for (;;) {
              t = r;
              r = half.times(t.plus(div(x, t, dp, 1)));

              if (coeffToString(t.c).slice(0, s) === (n = coeffToString(r.c)).slice(0, s)) {
                // The exponent of r may here be one less than the final result exponent,
                // e.g 0.0009999 (e-4) --> 0.001 (e-3), so adjust s so the rounding digits
                // are indexed correctly.
                if (r.e < e) --s;
                n = n.slice(s - 3, s + 1); // The 4th rounding digit may be in error by -1 so if the 4 rounding digits
                // are 9999 or 4999 (i.e. approaching a rounding boundary) continue the
                // iteration.

                if (n == '9999' || !rep && n == '4999') {
                  // On the first iteration only, check to see if rounding up gives the
                  // exact result as the nines may infinitely repeat.
                  if (!rep) {
                    round(t, t.e + DECIMAL_PLACES + 2, 0);

                    if (t.times(t).eq(x)) {
                      r = t;
                      break;
                    }
                  }

                  dp += 4;
                  s += 4;
                  rep = 1;
                } else {
                  // If rounding digits are null, 0{0,4} or 50{0,3}, check for exact
                  // result. If not, then there are further digits and m will be truthy.
                  if (!+n || !+n.slice(1) && n.charAt(0) == '5') {
                    // Truncate to the first rounding digit.
                    round(r, r.e + DECIMAL_PLACES + 2, 1);
                    m = !r.times(r).eq(x);
                  }

                  break;
                }
              }
            }
          }

          return round(r, r.e + DECIMAL_PLACES + 1, ROUNDING_MODE, m);
        };
        /*
         * Return a string representing the value of this BigNumber in exponential notation and
         * rounded using ROUNDING_MODE to dp fixed decimal places.
         *
         * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
         *
         * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
         */


        P.toExponential = function (dp, rm) {
          if (dp != null) {
            intCheck(dp, 0, MAX);
            dp++;
          }

          return format(this, dp, rm, 1);
        };
        /*
         * Return a string representing the value of this BigNumber in fixed-point notation rounding
         * to dp fixed decimal places using rounding mode rm, or ROUNDING_MODE if rm is omitted.
         *
         * Note: as with JavaScript's number type, (-0).toFixed(0) is '0',
         * but e.g. (-0.00001).toFixed(0) is '-0'.
         *
         * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
         *
         * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
         */


        P.toFixed = function (dp, rm) {
          if (dp != null) {
            intCheck(dp, 0, MAX);
            dp = dp + this.e + 1;
          }

          return format(this, dp, rm);
        };
        /*
         * Return a string representing the value of this BigNumber in fixed-point notation rounded
         * using rm or ROUNDING_MODE to dp decimal places, and formatted according to the properties
         * of the format or FORMAT object (see BigNumber.set).
         *
         * The formatting object may contain some or all of the properties shown below.
         *
         * FORMAT = {
         *   prefix: '',
         *   groupSize: 3,
         *   secondaryGroupSize: 0,
         *   groupSeparator: ',',
         *   decimalSeparator: '.',
         *   fractionGroupSize: 0,
         *   fractionGroupSeparator: '\xA0',      // non-breaking space
         *   suffix: ''
         * };
         *
         * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
         * [format] {object} Formatting options. See FORMAT pbject above.
         *
         * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
         * '[BigNumber Error] Argument not an object: {format}'
         */


        P.toFormat = function (dp, rm, format) {
          var str,
              x = this;

          if (format == null) {
            if (dp != null && rm && typeof rm == 'object') {
              format = rm;
              rm = null;
            } else if (dp && typeof dp == 'object') {
              format = dp;
              dp = rm = null;
            } else {
              format = FORMAT;
            }
          } else if (typeof format != 'object') {
            throw Error(bignumberError + 'Argument not an object: ' + format);
          }

          str = x.toFixed(dp, rm);

          if (x.c) {
            var i,
                arr = str.split('.'),
                g1 = +format.groupSize,
                g2 = +format.secondaryGroupSize,
                groupSeparator = format.groupSeparator || '',
                intPart = arr[0],
                fractionPart = arr[1],
                isNeg = x.s < 0,
                intDigits = isNeg ? intPart.slice(1) : intPart,
                len = intDigits.length;
            if (g2) i = g1, g1 = g2, g2 = i, len -= i;

            if (g1 > 0 && len > 0) {
              i = len % g1 || g1;
              intPart = intDigits.substr(0, i);

              for (; i < len; i += g1) intPart += groupSeparator + intDigits.substr(i, g1);

              if (g2 > 0) intPart += groupSeparator + intDigits.slice(i);
              if (isNeg) intPart = '-' + intPart;
            }

            str = fractionPart ? intPart + (format.decimalSeparator || '') + ((g2 = +format.fractionGroupSize) ? fractionPart.replace(new RegExp('\\d{' + g2 + '}\\B', 'g'), '$&' + (format.fractionGroupSeparator || '')) : fractionPart) : intPart;
          }

          return (format.prefix || '') + str + (format.suffix || '');
        };
        /*
         * Return an array of two BigNumbers representing the value of this BigNumber as a simple
         * fraction with an integer numerator and an integer denominator.
         * The denominator will be a positive non-zero value less than or equal to the specified
         * maximum denominator. If a maximum denominator is not specified, the denominator will be
         * the lowest value necessary to represent the number exactly.
         *
         * [md] {number|string|BigNumber} Integer >= 1, or Infinity. The maximum denominator.
         *
         * '[BigNumber Error] Argument {not an integer|out of range} : {md}'
         */


        P.toFraction = function (md) {
          var d,
              d0,
              d1,
              d2,
              e,
              exp,
              n,
              n0,
              n1,
              q,
              r,
              s,
              x = this,
              xc = x.c;

          if (md != null) {
            n = new BigNumber(md); // Throw if md is less than one or is not an integer, unless it is Infinity.

            if (!n.isInteger() && (n.c || n.s !== 1) || n.lt(ONE)) {
              throw Error(bignumberError + 'Argument ' + (n.isInteger() ? 'out of range: ' : 'not an integer: ') + valueOf(n));
            }
          }

          if (!xc) return new BigNumber(x);
          d = new BigNumber(ONE);
          n1 = d0 = new BigNumber(ONE);
          d1 = n0 = new BigNumber(ONE);
          s = coeffToString(xc); // Determine initial denominator.
          // d is a power of 10 and the minimum max denominator that specifies the value exactly.

          e = d.e = s.length - x.e - 1;
          d.c[0] = POWS_TEN[(exp = e % LOG_BASE) < 0 ? LOG_BASE + exp : exp];
          md = !md || n.comparedTo(d) > 0 ? e > 0 ? d : n1 : n;
          exp = MAX_EXP;
          MAX_EXP = 1 / 0;
          n = new BigNumber(s); // n0 = d1 = 0

          n0.c[0] = 0;

          for (;;) {
            q = div(n, d, 0, 1);
            d2 = d0.plus(q.times(d1));
            if (d2.comparedTo(md) == 1) break;
            d0 = d1;
            d1 = d2;
            n1 = n0.plus(q.times(d2 = n1));
            n0 = d2;
            d = n.minus(q.times(d2 = d));
            n = d2;
          }

          d2 = div(md.minus(d0), d1, 0, 1);
          n0 = n0.plus(d2.times(n1));
          d0 = d0.plus(d2.times(d1));
          n0.s = n1.s = x.s;
          e = e * 2; // Determine which fraction is closer to x, n0/d0 or n1/d1

          r = div(n1, d1, e, ROUNDING_MODE).minus(x).abs().comparedTo(div(n0, d0, e, ROUNDING_MODE).minus(x).abs()) < 1 ? [n1, d1] : [n0, d0];
          MAX_EXP = exp;
          return r;
        };
        /*
         * Return the value of this BigNumber converted to a number primitive.
         */


        P.toNumber = function () {
          return +valueOf(this);
        };
        /*
         * Return a string representing the value of this BigNumber rounded to sd significant digits
         * using rounding mode rm or ROUNDING_MODE. If sd is less than the number of digits
         * necessary to represent the integer part of the value in fixed-point notation, then use
         * exponential notation.
         *
         * [sd] {number} Significant digits. Integer, 1 to MAX inclusive.
         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
         *
         * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
         */


        P.toPrecision = function (sd, rm) {
          if (sd != null) intCheck(sd, 1, MAX);
          return format(this, sd, rm, 2);
        };
        /*
         * Return a string representing the value of this BigNumber in base b, or base 10 if b is
         * omitted. If a base is specified, including base 10, round according to DECIMAL_PLACES and
         * ROUNDING_MODE. If a base is not specified, and this BigNumber has a positive exponent
         * that is equal to or greater than TO_EXP_POS, or a negative exponent equal to or less than
         * TO_EXP_NEG, return exponential notation.
         *
         * [b] {number} Integer, 2 to ALPHABET.length inclusive.
         *
         * '[BigNumber Error] Base {not a primitive number|not an integer|out of range}: {b}'
         */


        P.toString = function (b) {
          var str,
              n = this,
              s = n.s,
              e = n.e; // Infinity or NaN?

          if (e === null) {
            if (s) {
              str = 'Infinity';
              if (s < 0) str = '-' + str;
            } else {
              str = 'NaN';
            }
          } else {
            if (b == null) {
              str = e <= TO_EXP_NEG || e >= TO_EXP_POS ? toExponential(coeffToString(n.c), e) : toFixedPoint(coeffToString(n.c), e, '0');
            } else if (b === 10) {
              n = round(new BigNumber(n), DECIMAL_PLACES + e + 1, ROUNDING_MODE);
              str = toFixedPoint(coeffToString(n.c), n.e, '0');
            } else {
              intCheck(b, 2, ALPHABET.length, 'Base');
              str = convertBase(toFixedPoint(coeffToString(n.c), e, '0'), 10, b, s, true);
            }

            if (s < 0 && n.c[0]) str = '-' + str;
          }

          return str;
        };
        /*
         * Return as toString, but do not accept a base argument, and include the minus sign for
         * negative zero.
         */


        P.valueOf = P.toJSON = function () {
          return valueOf(this);
        };

        P._isBigNumber = true;
        if (configObject != null) BigNumber.set(configObject);
        return BigNumber;
      } // PRIVATE HELPER FUNCTIONS
      // These functions don't need access to variables,
      // e.g. DECIMAL_PLACES, in the scope of the `clone` function above.


      function bitFloor(n) {
        var i = n | 0;
        return n > 0 || n === i ? i : i - 1;
      } // Return a coefficient array as a string of base 10 digits.


      function coeffToString(a) {
        var s,
            z,
            i = 1,
            j = a.length,
            r = a[0] + '';

        for (; i < j;) {
          s = a[i++] + '';
          z = LOG_BASE - s.length;

          for (; z--; s = '0' + s);

          r += s;
        } // Determine trailing zeros.


        for (j = r.length; r.charCodeAt(--j) === 48;);

        return r.slice(0, j + 1 || 1);
      } // Compare the value of BigNumbers x and y.


      function compare(x, y) {
        var a,
            b,
            xc = x.c,
            yc = y.c,
            i = x.s,
            j = y.s,
            k = x.e,
            l = y.e; // Either NaN?

        if (!i || !j) return null;
        a = xc && !xc[0];
        b = yc && !yc[0]; // Either zero?

        if (a || b) return a ? b ? 0 : -j : i; // Signs differ?

        if (i != j) return i;
        a = i < 0;
        b = k == l; // Either Infinity?

        if (!xc || !yc) return b ? 0 : !xc ^ a ? 1 : -1; // Compare exponents.

        if (!b) return k > l ^ a ? 1 : -1;
        j = (k = xc.length) < (l = yc.length) ? k : l; // Compare digit by digit.

        for (i = 0; i < j; i++) if (xc[i] != yc[i]) return xc[i] > yc[i] ^ a ? 1 : -1; // Compare lengths.


        return k == l ? 0 : k > l ^ a ? 1 : -1;
      }
      /*
       * Check that n is a primitive number, an integer, and in range, otherwise throw.
       */


      function intCheck(n, min, max, name) {
        if (n < min || n > max || n !== mathfloor(n)) {
          throw Error(bignumberError + (name || 'Argument') + (typeof n == 'number' ? n < min || n > max ? ' out of range: ' : ' not an integer: ' : ' not a primitive number: ') + String(n));
        }
      } // Assumes finite n.


      function isOdd(n) {
        var k = n.c.length - 1;
        return bitFloor(n.e / LOG_BASE) == k && n.c[k] % 2 != 0;
      }

      function toExponential(str, e) {
        return (str.length > 1 ? str.charAt(0) + '.' + str.slice(1) : str) + (e < 0 ? 'e' : 'e+') + e;
      }

      function toFixedPoint(str, e, z) {
        var len, zs; // Negative exponent?

        if (e < 0) {
          // Prepend zeros.
          for (zs = z + '.'; ++e; zs += z);

          str = zs + str; // Positive exponent
        } else {
          len = str.length; // Append zeros.

          if (++e > len) {
            for (zs = z, e -= len; --e; zs += z);

            str += zs;
          } else if (e < len) {
            str = str.slice(0, e) + '.' + str.slice(e);
          }
        }

        return str;
      } // EXPORT


      BigNumber = clone();
      BigNumber['default'] = BigNumber.BigNumber = BigNumber; // AMD.

      if (module.exports) {
        module.exports = BigNumber; // Browser.
      } else {
        if (!globalObject) {
          globalObject = typeof self != 'undefined' && self ? self : window;
        }

        globalObject.BigNumber = BigNumber;
      }
    })(commonjsGlobal);
  })(bignumber);

  var BigNumber = bignumber.exports;

  const stringToUint8Array = hex => {
    var _hex$match;

    const integers = (_hex$match = hex.match(/[\da-f]{2}/gi)) === null || _hex$match === void 0 ? void 0 : _hex$match.map(val => parseInt(val, 16)); // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

    return new Uint8Array(integers);
  };
  const stringToBytes = value => buffer.Buffer.from(value, 'utf8').toString('hex');
  const bytesToString = value => buffer.Buffer.from(stringToUint8Array(value)).toString('utf8');
  const objectToBytes = value => stringToBytes(JSON.stringify(value));
  const bytesToObject = value => {
    try {
      return JSON.parse(bytesToString(value));
    } catch {
      return null;
    }
  };
  const tokensAmountToNat = (tokensAmount, decimals) => {
    return new BigNumber(tokensAmount).multipliedBy(10 ** decimals).integerValue();
  };
  const numberToTokensAmount = (value, decimals) => {
    return new BigNumber(value).integerValue().div(10 ** decimals);
  };
  const tezToMutez = tez => tokensAmountToNat(tez, 6);
  const mutezToTez = mutez => numberToTokensAmount(mutez, 6);

  var converters = /*#__PURE__*/Object.freeze({
    __proto__: null,
    stringToUint8Array: stringToUint8Array,
    stringToBytes: stringToBytes,
    bytesToString: bytesToString,
    objectToBytes: objectToBytes,
    bytesToObject: bytesToObject,
    tokensAmountToNat: tokensAmountToNat,
    numberToTokensAmount: numberToTokensAmount,
    tezToMutez: tezToMutez,
    mutezToTez: mutezToTez
  });

  /**
   * lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="npm" -o ./`
   * Copyright jQuery Foundation and other contributors <https://jquery.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   */
  /** `Object#toString` result references. */

  var objectTag = '[object Object]';
  /**
   * Checks if `value` is a host object in IE < 9.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
   */

  function isHostObject(value) {
    // Many host objects are `Object` objects that can coerce to strings
    // despite having improperly defined `toString` methods.
    var result = false;

    if (value != null && typeof value.toString != 'function') {
      try {
        result = !!(value + '');
      } catch (e) {}
    }

    return result;
  }
  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */


  function overArg(func, transform) {
    return function (arg) {
      return func(transform(arg));
    };
  }
  /** Used for built-in method references. */


  var funcProto = Function.prototype,
      objectProto = Object.prototype;
  /** Used to resolve the decompiled source of functions. */

  var funcToString = funcProto.toString;
  /** Used to check objects for own properties. */

  var hasOwnProperty$1 = objectProto.hasOwnProperty;
  /** Used to infer the `Object` constructor. */

  var objectCtorString = funcToString.call(Object);
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */

  var objectToString = objectProto.toString;
  /** Built-in value references. */

  var getPrototype = overArg(Object.getPrototypeOf, Object);
  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */

  function isObjectLike(value) {
    return !!value && typeof value == 'object';
  }
  /**
   * Checks if `value` is a plain object, that is, an object created by the
   * `Object` constructor or one with a `[[Prototype]]` of `null`.
   *
   * @static
   * @memberOf _
   * @since 0.8.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   * }
   *
   * _.isPlainObject(new Foo);
   * // => false
   *
   * _.isPlainObject([1, 2, 3]);
   * // => false
   *
   * _.isPlainObject({ 'x': 0, 'y': 0 });
   * // => true
   *
   * _.isPlainObject(Object.create(null));
   * // => true
   */


  function isPlainObject$1(value) {
    if (!isObjectLike(value) || objectToString.call(value) != objectTag || isHostObject(value)) {
      return false;
    }

    var proto = getPrototype(value);

    if (proto === null) {
      return true;
    }

    var Ctor = hasOwnProperty$1.call(proto, 'constructor') && proto.constructor;
    return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
  }

  var lodash_isplainobject = isPlainObject$1;

  const isArray = arg => {
    return Array.isArray(arg);
  };
  const isReadonlyArray = arg => {
    return Array.isArray(arg);
  };
  const isPlainObject = value => {
    return lodash_isplainobject(value);
  };

  var guards = /*#__PURE__*/Object.freeze({
    __proto__: null,
    isArray: isArray,
    isReadonlyArray: isReadonlyArray,
    isPlainObject: isPlainObject
  });

  const defaultEqualityCheck = (a, b) => a === b;

  const areArgumentsShallowlyEqual = (equalityCheck, prev, next) => {
    if (prev === null || next === null || prev.length !== next.length) {
      return false;
    } // Do this in a for loop (and not a `forEach` or an `every`) so we can determine equality as fast as possible.


    const length = prev.length;

    for (let i = 0; i < length; i++) {
      if (!equalityCheck(prev[i], next[i])) {
        return false;
      }
    }

    return true;
  };
  /* eslint-disable prefer-rest-params  */

  /* eslint-disable prefer-spread */

  /* eslint-disable @typescript-eslint/no-explicit-any */


  const memoize = (func, equalityCheck = defaultEqualityCheck) => {
    let lastArgs = null;
    let lastResult = null;
    return function () {
      if (!areArgumentsShallowlyEqual(equalityCheck, lastArgs, arguments)) {
        // apply arguments instead of spreading for performance.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        lastResult = func.apply(null, arguments);
      }

      lastArgs = arguments;
      return lastResult;
    };
  };
  /* eslint-enable prefer-spread */

  /* eslint-enable prefer-rest-params */

  /* eslint-enable @typescript-eslint/no-explicit-any */

  /* eslint-disable @typescript-eslint/no-explicit-any */

  const emptyArray = [];
  const emptyObject = {};
  const emptyMap = new Map();
  const emptySet = new Set();
  const zeroBigNumber = new BigNumber(0);
  var optimization = {
    emptyArray,
    emptyMap,
    emptySet,
    emptyObject,
    zeroBigNumber
  };

  const is = (x, y) => {
    return x === y ? x !== 0 || y !== 0 || 1 / x === 1 / y // eslint-disable-next-line no-self-compare
    : x !== x && y !== y;
  };

  function shallowEqual(objA, objB) {
    if (is(objA, objB)) return true;
    if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) return false;
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) return false;

    for (let i = 0; i < keysA.length; i++) {
      /* eslint-disable @typescript-eslint/no-explicit-any */

      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) return false;
      /* eslint-enable @typescript-eslint/no-non-null-assertion */

      /* eslint-enable @typescript-eslint/no-explicit-any */
    }

    return true;
  }

  const capitalize = value => {
    var _value$;

    return value && ((_value$ = value[0]) === null || _value$ === void 0 ? void 0 : _value$.toLocaleUpperCase()) + value.slice(1);
  };
  const getAvatarText = (value, maxLength = 2) => {
    if (!value || !maxLength) return '';
    let result = '';

    for (let i = 0, j = 0, isWord = false; i < value.length; i++) {
      if (!isWord && value[i] !== ' ') {
        isWord = true; // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

        result += value[i];
        if (++j === maxLength) return result;
      } else if (isWord && value[i] === ' ') {
        isWord = false;
      }
    }

    return result;
  };

  const stringPad = (string, isStart, maxLength, fillString = ' ') => {
    if (String.prototype.padStart !== undefined) return string.padStart(maxLength, fillString);
    const stringLength = string.length; // eslint-disable-next-line eqeqeq

    if (maxLength <= stringLength || fillString == '') return string;
    const fillLength = maxLength - stringLength;
    let filler = fillString.repeat(Math.ceil(fillLength / fillString.length));
    if (filler.length > fillLength) filler = filler.slice(0, fillLength);
    return isStart ? filler + string : string + filler;
  };

  const padStart = (string, maxLength, fillString = ' ') => String.prototype.padStart !== undefined ? string.padStart(maxLength, fillString) : stringPad(string, true, maxLength, fillString);
  const padEnd = (string, maxLength, fillString = ' ') => String.prototype.padEnd !== undefined ? string.padEnd(maxLength, fillString) : stringPad(string, false, maxLength, fillString);

  var text = /*#__PURE__*/Object.freeze({
    __proto__: null,
    capitalize: capitalize,
    getAvatarText: getAvatarText,
    padStart: padStart,
    padEnd: padEnd
  });

  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

  exports.IconId = void 0;

  (function (IconId) {
    IconId[IconId["Common"] = 0] = "Common";
    IconId[IconId["Email"] = 1] = "Email";
    IconId[IconId["Telegram"] = 2] = "Telegram";
    IconId[IconId["Facebook"] = 3] = "Facebook";
    IconId[IconId["Twitter"] = 4] = "Twitter";
    IconId[IconId["Instagram"] = 5] = "Instagram";
    IconId[IconId["GitHub"] = 6] = "GitHub";
    IconId[IconId["Reddit"] = 7] = "Reddit";
  })(exports.IconId || (exports.IconId = {}));

  const getInvalidLinkInfo = link => ({
    rawLink: link,
    formattedLink: '#',
    displayLink: 'Invalid Link',
    icon: exports.IconId.Common
  });

  const prepareFormattedLink = memoize(link => link.trim());
  const prepareDisplayLink = memoize(link => link.trim().replace(/\/$/, ''));

  const socialMediaLinkInfoProvider = (link, baseUrl, icon) => {
    if (!link.startsWith(baseUrl)) return false;
    const formattedLink = prepareFormattedLink(link);
    if (formattedLink === baseUrl) return false;
    return {
      rawLink: link,
      formattedLink,
      displayLink: prepareDisplayLink(link).replace(baseUrl, ''),
      icon
    };
  };

  const telegramLinkInfoProvider = link => socialMediaLinkInfoProvider(link, 'https://t.me/', exports.IconId.Telegram);

  const facebookLinkInfoProvider = link => socialMediaLinkInfoProvider(link, 'https://facebook.com/', exports.IconId.Facebook);

  const twitterLinkInfoProvider = link => socialMediaLinkInfoProvider(link, 'https://twitter.com/', exports.IconId.Twitter);

  const instagramLinkInfoProvider = link => socialMediaLinkInfoProvider(link, 'https://instagram.com/', exports.IconId.Instagram);

  const gitHubLinkInfoProvider = link => socialMediaLinkInfoProvider(link, 'https://github.com/', exports.IconId.GitHub);

  const redditLinkInfoProvider = link => socialMediaLinkInfoProvider(link, 'https://www.reddit.com/', exports.IconId.Reddit); // This regex should not use for email validation


  const emailCheckingRegEx = /^[^\s/@]+@[^\s@/]+$/;

  const emailLinkInfoProvider = link => {
    const preparedFormattedLink = prepareFormattedLink(link);
    return emailCheckingRegEx.test(preparedFormattedLink) && {
      rawLink: link,
      formattedLink: `mailto:${preparedFormattedLink}`,
      displayLink: prepareDisplayLink(link),
      icon: exports.IconId.Email
    };
  };

  const javascriptLinkInfoProvider = link => link.startsWith('javascript') ? getInvalidLinkInfo(link) : false; // https://datatracker.ietf.org/doc/html/rfc3986#section-3.1


  const urlSchemeRegEx = /^([a-z][a-z0-9+\-.]*):/;

  const commonLinkInfoProvider = link => {
    const formattedLink = prepareFormattedLink(link);
    return urlSchemeRegEx.test(formattedLink) && {
      rawLink: link,
      formattedLink,
      displayLink: prepareDisplayLink(link),
      icon: exports.IconId.Common
    };
  };

  const editLinkInfoProvider = link => {
    const formattedLink = prepareFormattedLink(link);
    return {
      rawLink: link,
      formattedLink,
      displayLink: prepareDisplayLink(link),
      icon: exports.IconId.Common
    };
  };

  class ServiceLinkHelper {
    // Order is important
    getLinkInfo(link, isEditMode = false) {
      for (const provider of ServiceLinkHelper.linkInfoProviders) {
        const linkInfo = provider(link);
        if (linkInfo) return this.linkInfoIsValid(linkInfo) ? linkInfo : null;
      }

      if (isEditMode) return editLinkInfoProvider(link);
      return null;
    }

    linkInfoIsValid(linkInfo) {
      return linkInfo.formattedLink !== '#';
    }

  }

  _defineProperty(ServiceLinkHelper, "linkInfoProviders", [// Disallowed
  javascriptLinkInfoProvider, // Allowed
  telegramLinkInfoProvider, facebookLinkInfoProvider, twitterLinkInfoProvider, instagramLinkInfoProvider, gitHubLinkInfoProvider, emailLinkInfoProvider, redditLinkInfoProvider, commonLinkInfoProvider]);

  exports.PaymentType = void 0;

  (function (PaymentType) {
    PaymentType[PaymentType["Payment"] = 1] = "Payment";
    PaymentType[PaymentType["Donation"] = 2] = "Donation";
  })(exports.PaymentType || (exports.PaymentType = {}));

  class PaymentValidatorBase {
    validate(payment, bail = false) {
      if (!isPlainObject(payment)) return [this.invalidPaymentObjectError];
      let failedValidationResults;

      for (const validationMethod of this.validationMethods) {
        const currentFailedValidationResults = validationMethod(payment);

        if (currentFailedValidationResults) {
          if (!bail) return currentFailedValidationResults;
          failedValidationResults = (failedValidationResults || []).concat(currentFailedValidationResults);
        }
      }

      return failedValidationResults;
    }

  }

  const networksInternal = {
    // mainnet: {
    //   id: 'NetXdQprcVkpaWU',
    //   name: 'mainnet',
    // },
    granadanet: {
      id: 'NetXz969SFaFn8k',
      name: 'granadanet'
    }
  };
  const networks = networksInternal;
  const networksCollection = Object.values(networksInternal);
  const networkIdRegExp = /^[a-zA-Z]\w*$/;
  const networkNameRegExp = networkIdRegExp;

  const tezosMeta = {
    symbol: 'XTZ',
    name: 'Tezos',
    decimals: 6,
    thumbnailUri: 'https://dashboard.tezospayments.com/tokens/tezos.png'
  };
  const unknownAssetMeta = {
    name: 'Unknown',
    symbol: 'Unknown',
    decimals: 0,
    thumbnailUri: 'https://dashboard.tezospayments.com/tokens/unknown.png'
  };
  const tokenWhitelist = [// {
  //   network: networks.mainnet,
  //   type: 'fa1.2',
  //   contractAddress: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV',
  //   metadata: {
  //     decimals: 18,
  //     symbol: 'KUSD',
  //     name: 'Kolibri',
  //     thumbnailUri: 'https://kolibri-data.s3.amazonaws.com/logo.png',
  //   },
  // },
  // {
  //   network: networks.mainnet,
  //   type: 'fa2',
  //   contractAddress: 'KT1REEb5VxWRjcHm5GzDMwErMmNFftsE5Gpf',
  //   fa2TokenId: 0,
  //   metadata: {
  //     decimals: 6,
  //     symbol: 'USDS',
  //     name: 'Stably USD',
  //     thumbnailUri: 'https://quipuswap.com/tokens/stably.png',
  //   },
  // },
  {
    network: networks.granadanet,
    type: 'fa1.2',
    contractAddress: 'KT1KcuD9MmgZuGcptdD3qRqxXpGg4WxFsfVc',
    metadata: {
      decimals: 0,
      symbol: 'fa12',
      name: 'Test fa12',
      thumbnailUri: 'https://dashboard.tezospayments.com/tokens/unknown.png'
    }
  }, {
    network: networks.granadanet,
    type: 'fa2',
    contractAddress: 'KT1BBfxboq63dbaKCAc4uwVKLFzVn1b4fy37',
    id: 0,
    metadata: {
      decimals: 0,
      symbol: 'fa20',
      name: 'Test fa20',
      thumbnailUri: 'https://dashboard.tezospayments.com/tokens/unknown.png'
    }
  }, {
    network: networks.granadanet,
    type: 'fa2',
    contractAddress: 'KT1PMAT81mmL6NFp9rVU3xoVzU2dRdcXt4R9',
    id: 0,
    metadata: {
      decimals: 6,
      symbol: 'USDS',
      name: 'Stably USD',
      thumbnailUri: 'https://quipuswap.com/tokens/stably.png'
    }
  }];
  const tokenWhitelistMap = new Map(networksCollection.map(nc => [nc, new Map(tokenWhitelist.filter(t => t.network === nc).map(t => [t.contractAddress, t]))]));

  const contractAddressPrefixes = ['KT'];
  const implicitAddressPrefixes = ['tz1', 'tz2', 'tz3'];
  const addressPrefixes = [...contractAddressPrefixes, ...implicitAddressPrefixes];
  const tezosInfo = {
    addressLength: 36,
    contractAddressPrefixes,
    implicitAddressPrefixes,
    addressPrefixes
  };

  exports.KeyType = void 0;

  (function (KeyType) {
    KeyType["Ed25519"] = "Ed25519";
    KeyType["Secp256k1"] = "Secp256k1";
    KeyType["P256"] = "P256";
  })(exports.KeyType || (exports.KeyType = {}));

  var url = {};

  var punycode$1 = {exports: {}};

  /*! https://mths.be/punycode v1.3.2 by @mathias */

  (function (module, exports) {

    (function (root) {
      /** Detect free variables */
      var freeExports = exports && !exports.nodeType && exports;
      var freeModule = module && !module.nodeType && module;
      var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal;

      if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal) {
        root = freeGlobal;
      }
      /**
       * The `punycode` object.
       * @name punycode
       * @type Object
       */


      var punycode,

      /** Highest positive signed 32-bit float value */
      maxInt = 2147483647,
          // aka. 0x7FFFFFFF or 2^31-1

      /** Bootstring parameters */
      base = 36,
          tMin = 1,
          tMax = 26,
          skew = 38,
          damp = 700,
          initialBias = 72,
          initialN = 128,
          // 0x80
      delimiter = '-',
          // '\x2D'

      /** Regular expressions */
      regexPunycode = /^xn--/,
          regexNonASCII = /[^\x20-\x7E]/,
          // unprintable ASCII chars + non-ASCII chars
      regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g,
          // RFC 3490 separators

      /** Error messages */
      errors = {
        'overflow': 'Overflow: input needs wider integers to process',
        'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
        'invalid-input': 'Invalid input'
      },

      /** Convenience shortcuts */
      baseMinusTMin = base - tMin,
          floor = Math.floor,
          stringFromCharCode = String.fromCharCode,

      /** Temporary variable */
      key;
      /*--------------------------------------------------------------------------*/

      /**
       * A generic error utility function.
       * @private
       * @param {String} type The error type.
       * @returns {Error} Throws a `RangeError` with the applicable error message.
       */

      function error(type) {
        throw RangeError(errors[type]);
      }
      /**
       * A generic `Array#map` utility function.
       * @private
       * @param {Array} array The array to iterate over.
       * @param {Function} callback The function that gets called for every array
       * item.
       * @returns {Array} A new array of values returned by the callback function.
       */


      function map(array, fn) {
        var length = array.length;
        var result = [];

        while (length--) {
          result[length] = fn(array[length]);
        }

        return result;
      }
      /**
       * A simple `Array#map`-like wrapper to work with domain name strings or email
       * addresses.
       * @private
       * @param {String} domain The domain name or email address.
       * @param {Function} callback The function that gets called for every
       * character.
       * @returns {Array} A new string of characters returned by the callback
       * function.
       */


      function mapDomain(string, fn) {
        var parts = string.split('@');
        var result = '';

        if (parts.length > 1) {
          // In email addresses, only the domain name should be punycoded. Leave
          // the local part (i.e. everything up to `@`) intact.
          result = parts[0] + '@';
          string = parts[1];
        } // Avoid `split(regex)` for IE8 compatibility. See #17.


        string = string.replace(regexSeparators, '\x2E');
        var labels = string.split('.');
        var encoded = map(labels, fn).join('.');
        return result + encoded;
      }
      /**
       * Creates an array containing the numeric code points of each Unicode
       * character in the string. While JavaScript uses UCS-2 internally,
       * this function will convert a pair of surrogate halves (each of which
       * UCS-2 exposes as separate characters) into a single code point,
       * matching UTF-16.
       * @see `punycode.ucs2.encode`
       * @see <https://mathiasbynens.be/notes/javascript-encoding>
       * @memberOf punycode.ucs2
       * @name decode
       * @param {String} string The Unicode input string (UCS-2).
       * @returns {Array} The new array of code points.
       */


      function ucs2decode(string) {
        var output = [],
            counter = 0,
            length = string.length,
            value,
            extra;

        while (counter < length) {
          value = string.charCodeAt(counter++);

          if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
            // high surrogate, and there is a next character
            extra = string.charCodeAt(counter++);

            if ((extra & 0xFC00) == 0xDC00) {
              // low surrogate
              output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
            } else {
              // unmatched surrogate; only append this code unit, in case the next
              // code unit is the high surrogate of a surrogate pair
              output.push(value);
              counter--;
            }
          } else {
            output.push(value);
          }
        }

        return output;
      }
      /**
       * Creates a string based on an array of numeric code points.
       * @see `punycode.ucs2.decode`
       * @memberOf punycode.ucs2
       * @name encode
       * @param {Array} codePoints The array of numeric code points.
       * @returns {String} The new Unicode string (UCS-2).
       */


      function ucs2encode(array) {
        return map(array, function (value) {
          var output = '';

          if (value > 0xFFFF) {
            value -= 0x10000;
            output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
            value = 0xDC00 | value & 0x3FF;
          }

          output += stringFromCharCode(value);
          return output;
        }).join('');
      }
      /**
       * Converts a basic code point into a digit/integer.
       * @see `digitToBasic()`
       * @private
       * @param {Number} codePoint The basic numeric code point value.
       * @returns {Number} The numeric value of a basic code point (for use in
       * representing integers) in the range `0` to `base - 1`, or `base` if
       * the code point does not represent a value.
       */


      function basicToDigit(codePoint) {
        if (codePoint - 48 < 10) {
          return codePoint - 22;
        }

        if (codePoint - 65 < 26) {
          return codePoint - 65;
        }

        if (codePoint - 97 < 26) {
          return codePoint - 97;
        }

        return base;
      }
      /**
       * Converts a digit/integer into a basic code point.
       * @see `basicToDigit()`
       * @private
       * @param {Number} digit The numeric value of a basic code point.
       * @returns {Number} The basic code point whose value (when used for
       * representing integers) is `digit`, which needs to be in the range
       * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
       * used; else, the lowercase form is used. The behavior is undefined
       * if `flag` is non-zero and `digit` has no uppercase form.
       */


      function digitToBasic(digit, flag) {
        //  0..25 map to ASCII a..z or A..Z
        // 26..35 map to ASCII 0..9
        return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
      }
      /**
       * Bias adaptation function as per section 3.4 of RFC 3492.
       * http://tools.ietf.org/html/rfc3492#section-3.4
       * @private
       */


      function adapt(delta, numPoints, firstTime) {
        var k = 0;
        delta = firstTime ? floor(delta / damp) : delta >> 1;
        delta += floor(delta / numPoints);

        for (; delta > baseMinusTMin * tMax >> 1; k += base) {
          delta = floor(delta / baseMinusTMin);
        }

        return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
      }
      /**
       * Converts a Punycode string of ASCII-only symbols to a string of Unicode
       * symbols.
       * @memberOf punycode
       * @param {String} input The Punycode string of ASCII-only symbols.
       * @returns {String} The resulting string of Unicode symbols.
       */


      function decode(input) {
        // Don't use UCS-2
        var output = [],
            inputLength = input.length,
            out,
            i = 0,
            n = initialN,
            bias = initialBias,
            basic,
            j,
            index,
            oldi,
            w,
            k,
            digit,
            t,

        /** Cached calculation results */
        baseMinusT; // Handle the basic code points: let `basic` be the number of input code
        // points before the last delimiter, or `0` if there is none, then copy
        // the first basic code points to the output.

        basic = input.lastIndexOf(delimiter);

        if (basic < 0) {
          basic = 0;
        }

        for (j = 0; j < basic; ++j) {
          // if it's not a basic code point
          if (input.charCodeAt(j) >= 0x80) {
            error('not-basic');
          }

          output.push(input.charCodeAt(j));
        } // Main decoding loop: start just after the last delimiter if any basic code
        // points were copied; start at the beginning otherwise.


        for (index = basic > 0 ? basic + 1 : 0; index < inputLength;) {
          // `index` is the index of the next character to be consumed.
          // Decode a generalized variable-length integer into `delta`,
          // which gets added to `i`. The overflow checking is easier
          // if we increase `i` as we go, then subtract off its starting
          // value at the end to obtain `delta`.
          for (oldi = i, w = 1, k = base;; k += base) {
            if (index >= inputLength) {
              error('invalid-input');
            }

            digit = basicToDigit(input.charCodeAt(index++));

            if (digit >= base || digit > floor((maxInt - i) / w)) {
              error('overflow');
            }

            i += digit * w;
            t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;

            if (digit < t) {
              break;
            }

            baseMinusT = base - t;

            if (w > floor(maxInt / baseMinusT)) {
              error('overflow');
            }

            w *= baseMinusT;
          }

          out = output.length + 1;
          bias = adapt(i - oldi, out, oldi == 0); // `i` was supposed to wrap around from `out` to `0`,
          // incrementing `n` each time, so we'll fix that now:

          if (floor(i / out) > maxInt - n) {
            error('overflow');
          }

          n += floor(i / out);
          i %= out; // Insert `n` at position `i` of the output

          output.splice(i++, 0, n);
        }

        return ucs2encode(output);
      }
      /**
       * Converts a string of Unicode symbols (e.g. a domain name label) to a
       * Punycode string of ASCII-only symbols.
       * @memberOf punycode
       * @param {String} input The string of Unicode symbols.
       * @returns {String} The resulting Punycode string of ASCII-only symbols.
       */


      function encode(input) {
        var n,
            delta,
            handledCPCount,
            basicLength,
            bias,
            j,
            m,
            q,
            k,
            t,
            currentValue,
            output = [],

        /** `inputLength` will hold the number of code points in `input`. */
        inputLength,

        /** Cached calculation results */
        handledCPCountPlusOne,
            baseMinusT,
            qMinusT; // Convert the input in UCS-2 to Unicode

        input = ucs2decode(input); // Cache the length

        inputLength = input.length; // Initialize the state

        n = initialN;
        delta = 0;
        bias = initialBias; // Handle the basic code points

        for (j = 0; j < inputLength; ++j) {
          currentValue = input[j];

          if (currentValue < 0x80) {
            output.push(stringFromCharCode(currentValue));
          }
        }

        handledCPCount = basicLength = output.length; // `handledCPCount` is the number of code points that have been handled;
        // `basicLength` is the number of basic code points.
        // Finish the basic string - if it is not empty - with a delimiter

        if (basicLength) {
          output.push(delimiter);
        } // Main encoding loop:


        while (handledCPCount < inputLength) {
          // All non-basic code points < n have been handled already. Find the next
          // larger one:
          for (m = maxInt, j = 0; j < inputLength; ++j) {
            currentValue = input[j];

            if (currentValue >= n && currentValue < m) {
              m = currentValue;
            }
          } // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
          // but guard against overflow


          handledCPCountPlusOne = handledCPCount + 1;

          if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
            error('overflow');
          }

          delta += (m - n) * handledCPCountPlusOne;
          n = m;

          for (j = 0; j < inputLength; ++j) {
            currentValue = input[j];

            if (currentValue < n && ++delta > maxInt) {
              error('overflow');
            }

            if (currentValue == n) {
              // Represent delta as a generalized variable-length integer
              for (q = delta, k = base;; k += base) {
                t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;

                if (q < t) {
                  break;
                }

                qMinusT = q - t;
                baseMinusT = base - t;
                output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
                q = floor(qMinusT / baseMinusT);
              }

              output.push(stringFromCharCode(digitToBasic(q, 0)));
              bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
              delta = 0;
              ++handledCPCount;
            }
          }

          ++delta;
          ++n;
        }

        return output.join('');
      }
      /**
       * Converts a Punycode string representing a domain name or an email address
       * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
       * it doesn't matter if you call it on a string that has already been
       * converted to Unicode.
       * @memberOf punycode
       * @param {String} input The Punycoded domain name or email address to
       * convert to Unicode.
       * @returns {String} The Unicode representation of the given Punycode
       * string.
       */


      function toUnicode(input) {
        return mapDomain(input, function (string) {
          return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
        });
      }
      /**
       * Converts a Unicode string representing a domain name or an email address to
       * Punycode. Only the non-ASCII parts of the domain name will be converted,
       * i.e. it doesn't matter if you call it with a domain that's already in
       * ASCII.
       * @memberOf punycode
       * @param {String} input The domain name or email address to convert, as a
       * Unicode string.
       * @returns {String} The Punycode representation of the given domain name or
       * email address.
       */


      function toASCII(input) {
        return mapDomain(input, function (string) {
          return regexNonASCII.test(string) ? 'xn--' + encode(string) : string;
        });
      }
      /*--------------------------------------------------------------------------*/

      /** Define the public API */


      punycode = {
        /**
         * A string representing the current Punycode.js version number.
         * @memberOf punycode
         * @type String
         */
        'version': '1.3.2',

        /**
         * An object of methods to convert from JavaScript's internal character
         * representation (UCS-2) to Unicode code points, and back.
         * @see <https://mathiasbynens.be/notes/javascript-encoding>
         * @memberOf punycode
         * @type Object
         */
        'ucs2': {
          'decode': ucs2decode,
          'encode': ucs2encode
        },
        'decode': decode,
        'encode': encode,
        'toASCII': toASCII,
        'toUnicode': toUnicode
      };
      /** Expose `punycode` */
      // Some AMD build optimizers, like r.js, check for specific condition patterns
      // like the following:

      if (freeExports && freeModule) {
        if (module.exports == freeExports) {
          // in Node.js or RingoJS v0.8.0+
          freeModule.exports = punycode;
        } else {
          // in Narwhal or RingoJS v0.7.0-
          for (key in punycode) {
            punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
          }
        }
      } else {
        // in Rhino or a web browser
        root.punycode = punycode;
      }
    })(commonjsGlobal);
  })(punycode$1, punycode$1.exports);

  var util$1 = {
    isString: function (arg) {
      return typeof arg === 'string';
    },
    isObject: function (arg) {
      return typeof arg === 'object' && arg !== null;
    },
    isNull: function (arg) {
      return arg === null;
    },
    isNullOrUndefined: function (arg) {
      return arg == null;
    }
  };

  var querystring$1 = {};

  // obj.hasOwnProperty(prop) will break.
  // See: https://github.com/joyent/node/issues/1707


  function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }

  var decode = function (qs, sep, eq, options) {
    sep = sep || '&';
    eq = eq || '=';
    var obj = {};

    if (typeof qs !== 'string' || qs.length === 0) {
      return obj;
    }

    var regexp = /\+/g;
    qs = qs.split(sep);
    var maxKeys = 1000;

    if (options && typeof options.maxKeys === 'number') {
      maxKeys = options.maxKeys;
    }

    var len = qs.length; // maxKeys <= 0 means that we should not limit keys count

    if (maxKeys > 0 && len > maxKeys) {
      len = maxKeys;
    }

    for (var i = 0; i < len; ++i) {
      var x = qs[i].replace(regexp, '%20'),
          idx = x.indexOf(eq),
          kstr,
          vstr,
          k,
          v;

      if (idx >= 0) {
        kstr = x.substr(0, idx);
        vstr = x.substr(idx + 1);
      } else {
        kstr = x;
        vstr = '';
      }

      k = decodeURIComponent(kstr);
      v = decodeURIComponent(vstr);

      if (!hasOwnProperty(obj, k)) {
        obj[k] = v;
      } else if (Array.isArray(obj[k])) {
        obj[k].push(v);
      } else {
        obj[k] = [obj[k], v];
      }
    }

    return obj;
  };

  var stringifyPrimitive = function (v) {
    switch (typeof v) {
      case 'string':
        return v;

      case 'boolean':
        return v ? 'true' : 'false';

      case 'number':
        return isFinite(v) ? v : '';

      default:
        return '';
    }
  };

  var encode = function (obj, sep, eq, name) {
    sep = sep || '&';
    eq = eq || '=';

    if (obj === null) {
      obj = undefined;
    }

    if (typeof obj === 'object') {
      return Object.keys(obj).map(function (k) {
        var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;

        if (Array.isArray(obj[k])) {
          return obj[k].map(function (v) {
            return ks + encodeURIComponent(stringifyPrimitive(v));
          }).join(sep);
        } else {
          return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
        }
      }).join(sep);
    }

    if (!name) return '';
    return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
  };

  querystring$1.decode = querystring$1.parse = decode;
  querystring$1.encode = querystring$1.stringify = encode;

  var punycode = punycode$1.exports;
  var util = util$1;
  url.parse = urlParse;
  url.resolve = urlResolve;
  url.resolveObject = urlResolveObject;
  url.format = urlFormat;
  url.Url = Url;

  function Url() {
    this.protocol = null;
    this.slashes = null;
    this.auth = null;
    this.host = null;
    this.port = null;
    this.hostname = null;
    this.hash = null;
    this.search = null;
    this.query = null;
    this.pathname = null;
    this.path = null;
    this.href = null;
  } // Reference: RFC 3986, RFC 1808, RFC 2396
  // define these here so at least they only have to be
  // compiled once on the first module load.


  var protocolPattern = /^([a-z0-9.+-]+:)/i,
      portPattern = /:[0-9]*$/,
      // Special case for a simple path URL
  simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,
      // RFC 2396: characters reserved for delimiting URLs.
  // We actually just auto-escape these.
  delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],
      // RFC 2396: characters not allowed for various reasons.
  unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),
      // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
  autoEscape = ['\''].concat(unwise),
      // Characters that are never ever allowed in a hostname.
  // Note that any invalid chars are also handled, but these
  // are the ones that are *expected* to be seen, so we fast-path
  // them.
  nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
      hostEndingChars = ['/', '?', '#'],
      hostnameMaxLen = 255,
      hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
      hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
      // protocols that can allow "unsafe" and "unwise" chars.
  unsafeProtocol = {
    'javascript': true,
    'javascript:': true
  },
      // protocols that never have a hostname.
  hostlessProtocol = {
    'javascript': true,
    'javascript:': true
  },
      // protocols that always contain a // bit.
  slashedProtocol = {
    'http': true,
    'https': true,
    'ftp': true,
    'gopher': true,
    'file': true,
    'http:': true,
    'https:': true,
    'ftp:': true,
    'gopher:': true,
    'file:': true
  },
      querystring = querystring$1;

  function urlParse(url, parseQueryString, slashesDenoteHost) {
    if (url && util.isObject(url) && url instanceof Url) return url;
    var u = new Url();
    u.parse(url, parseQueryString, slashesDenoteHost);
    return u;
  }

  Url.prototype.parse = function (url, parseQueryString, slashesDenoteHost) {
    if (!util.isString(url)) {
      throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
    } // Copy chrome, IE, opera backslash-handling behavior.
    // Back slashes before the query string get converted to forward slashes
    // See: https://code.google.com/p/chromium/issues/detail?id=25916


    var queryIndex = url.indexOf('?'),
        splitter = queryIndex !== -1 && queryIndex < url.indexOf('#') ? '?' : '#',
        uSplit = url.split(splitter),
        slashRegex = /\\/g;
    uSplit[0] = uSplit[0].replace(slashRegex, '/');
    url = uSplit.join(splitter);
    var rest = url; // trim before proceeding.
    // This is to support parse stuff like "  http://foo.com  \n"

    rest = rest.trim();

    if (!slashesDenoteHost && url.split('#').length === 1) {
      // Try fast path regexp
      var simplePath = simplePathPattern.exec(rest);

      if (simplePath) {
        this.path = rest;
        this.href = rest;
        this.pathname = simplePath[1];

        if (simplePath[2]) {
          this.search = simplePath[2];

          if (parseQueryString) {
            this.query = querystring.parse(this.search.substr(1));
          } else {
            this.query = this.search.substr(1);
          }
        } else if (parseQueryString) {
          this.search = '';
          this.query = {};
        }

        return this;
      }
    }

    var proto = protocolPattern.exec(rest);

    if (proto) {
      proto = proto[0];
      var lowerProto = proto.toLowerCase();
      this.protocol = lowerProto;
      rest = rest.substr(proto.length);
    } // figure out if it's got a host
    // user@server is *always* interpreted as a hostname, and url
    // resolution will treat //foo/bar as host=foo,path=bar because that's
    // how the browser resolves relative URLs.


    if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
      var slashes = rest.substr(0, 2) === '//';

      if (slashes && !(proto && hostlessProtocol[proto])) {
        rest = rest.substr(2);
        this.slashes = true;
      }
    }

    if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {
      // there's a hostname.
      // the first instance of /, ?, ;, or # ends the host.
      //
      // If there is an @ in the hostname, then non-host chars *are* allowed
      // to the left of the last @ sign, unless some host-ending character
      // comes *before* the @-sign.
      // URLs are obnoxious.
      //
      // ex:
      // http://a@b@c/ => user:a@b host:c
      // http://a@b?@c => user:a host:c path:/?@c
      // v0.12 TODO(isaacs): This is not quite how Chrome does things.
      // Review our test case against browsers more comprehensively.
      // find the first instance of any hostEndingChars
      var hostEnd = -1;

      for (var i = 0; i < hostEndingChars.length; i++) {
        var hec = rest.indexOf(hostEndingChars[i]);
        if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
      } // at this point, either we have an explicit point where the
      // auth portion cannot go past, or the last @ char is the decider.


      var auth, atSign;

      if (hostEnd === -1) {
        // atSign can be anywhere.
        atSign = rest.lastIndexOf('@');
      } else {
        // atSign must be in auth portion.
        // http://a@b/c@d => host:b auth:a path:/c@d
        atSign = rest.lastIndexOf('@', hostEnd);
      } // Now we have a portion which is definitely the auth.
      // Pull that off.


      if (atSign !== -1) {
        auth = rest.slice(0, atSign);
        rest = rest.slice(atSign + 1);
        this.auth = decodeURIComponent(auth);
      } // the host is the remaining to the left of the first non-host char


      hostEnd = -1;

      for (var i = 0; i < nonHostChars.length; i++) {
        var hec = rest.indexOf(nonHostChars[i]);
        if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
      } // if we still have not hit it, then the entire thing is a host.


      if (hostEnd === -1) hostEnd = rest.length;
      this.host = rest.slice(0, hostEnd);
      rest = rest.slice(hostEnd); // pull out port.

      this.parseHost(); // we've indicated that there is a hostname,
      // so even if it's empty, it has to be present.

      this.hostname = this.hostname || ''; // if hostname begins with [ and ends with ]
      // assume that it's an IPv6 address.

      var ipv6Hostname = this.hostname[0] === '[' && this.hostname[this.hostname.length - 1] === ']'; // validate a little.

      if (!ipv6Hostname) {
        var hostparts = this.hostname.split(/\./);

        for (var i = 0, l = hostparts.length; i < l; i++) {
          var part = hostparts[i];
          if (!part) continue;

          if (!part.match(hostnamePartPattern)) {
            var newpart = '';

            for (var j = 0, k = part.length; j < k; j++) {
              if (part.charCodeAt(j) > 127) {
                // we replace non-ASCII char with a temporary placeholder
                // we need this to make sure size of hostname is not
                // broken by replacing non-ASCII by nothing
                newpart += 'x';
              } else {
                newpart += part[j];
              }
            } // we test again with ASCII char only


            if (!newpart.match(hostnamePartPattern)) {
              var validParts = hostparts.slice(0, i);
              var notHost = hostparts.slice(i + 1);
              var bit = part.match(hostnamePartStart);

              if (bit) {
                validParts.push(bit[1]);
                notHost.unshift(bit[2]);
              }

              if (notHost.length) {
                rest = '/' + notHost.join('.') + rest;
              }

              this.hostname = validParts.join('.');
              break;
            }
          }
        }
      }

      if (this.hostname.length > hostnameMaxLen) {
        this.hostname = '';
      } else {
        // hostnames are always lower case.
        this.hostname = this.hostname.toLowerCase();
      }

      if (!ipv6Hostname) {
        // IDNA Support: Returns a punycoded representation of "domain".
        // It only converts parts of the domain name that
        // have non-ASCII characters, i.e. it doesn't matter if
        // you call it with a domain that already is ASCII-only.
        this.hostname = punycode.toASCII(this.hostname);
      }

      var p = this.port ? ':' + this.port : '';
      var h = this.hostname || '';
      this.host = h + p;
      this.href += this.host; // strip [ and ] from the hostname
      // the host field still retains them, though

      if (ipv6Hostname) {
        this.hostname = this.hostname.substr(1, this.hostname.length - 2);

        if (rest[0] !== '/') {
          rest = '/' + rest;
        }
      }
    } // now rest is set to the post-host stuff.
    // chop off any delim chars.


    if (!unsafeProtocol[lowerProto]) {
      // First, make 100% sure that any "autoEscape" chars get
      // escaped, even if encodeURIComponent doesn't think they
      // need to be.
      for (var i = 0, l = autoEscape.length; i < l; i++) {
        var ae = autoEscape[i];
        if (rest.indexOf(ae) === -1) continue;
        var esc = encodeURIComponent(ae);

        if (esc === ae) {
          esc = escape(ae);
        }

        rest = rest.split(ae).join(esc);
      }
    } // chop off from the tail first.


    var hash = rest.indexOf('#');

    if (hash !== -1) {
      // got a fragment string.
      this.hash = rest.substr(hash);
      rest = rest.slice(0, hash);
    }

    var qm = rest.indexOf('?');

    if (qm !== -1) {
      this.search = rest.substr(qm);
      this.query = rest.substr(qm + 1);

      if (parseQueryString) {
        this.query = querystring.parse(this.query);
      }

      rest = rest.slice(0, qm);
    } else if (parseQueryString) {
      // no query string, but parseQueryString still requested
      this.search = '';
      this.query = {};
    }

    if (rest) this.pathname = rest;

    if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
      this.pathname = '/';
    } //to support http.request


    if (this.pathname || this.search) {
      var p = this.pathname || '';
      var s = this.search || '';
      this.path = p + s;
    } // finally, reconstruct the href based on what has been validated.


    this.href = this.format();
    return this;
  }; // format a parsed object into a url string


  function urlFormat(obj) {
    // ensure it's an object, and not a string url.
    // If it's an obj, this is a no-op.
    // this way, you can call url_format() on strings
    // to clean up potentially wonky urls.
    if (util.isString(obj)) obj = urlParse(obj);
    if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
    return obj.format();
  }

  Url.prototype.format = function () {
    var auth = this.auth || '';

    if (auth) {
      auth = encodeURIComponent(auth);
      auth = auth.replace(/%3A/i, ':');
      auth += '@';
    }

    var protocol = this.protocol || '',
        pathname = this.pathname || '',
        hash = this.hash || '',
        host = false,
        query = '';

    if (this.host) {
      host = auth + this.host;
    } else if (this.hostname) {
      host = auth + (this.hostname.indexOf(':') === -1 ? this.hostname : '[' + this.hostname + ']');

      if (this.port) {
        host += ':' + this.port;
      }
    }

    if (this.query && util.isObject(this.query) && Object.keys(this.query).length) {
      query = querystring.stringify(this.query);
    }

    var search = this.search || query && '?' + query || '';
    if (protocol && protocol.substr(-1) !== ':') protocol += ':'; // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
    // unless they had them to begin with.

    if (this.slashes || (!protocol || slashedProtocol[protocol]) && host !== false) {
      host = '//' + (host || '');
      if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
    } else if (!host) {
      host = '';
    }

    if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
    if (search && search.charAt(0) !== '?') search = '?' + search;
    pathname = pathname.replace(/[?#]/g, function (match) {
      return encodeURIComponent(match);
    });
    search = search.replace('#', '%23');
    return protocol + host + pathname + search + hash;
  };

  function urlResolve(source, relative) {
    return urlParse(source, false, true).resolve(relative);
  }

  Url.prototype.resolve = function (relative) {
    return this.resolveObject(urlParse(relative, false, true)).format();
  };

  function urlResolveObject(source, relative) {
    if (!source) return relative;
    return urlParse(source, false, true).resolveObject(relative);
  }

  Url.prototype.resolveObject = function (relative) {
    if (util.isString(relative)) {
      var rel = new Url();
      rel.parse(relative, false, true);
      relative = rel;
    }

    var result = new Url();
    var tkeys = Object.keys(this);

    for (var tk = 0; tk < tkeys.length; tk++) {
      var tkey = tkeys[tk];
      result[tkey] = this[tkey];
    } // hash is always overridden, no matter what.
    // even href="" will remove it.


    result.hash = relative.hash; // if the relative url is empty, then there's nothing left to do here.

    if (relative.href === '') {
      result.href = result.format();
      return result;
    } // hrefs like //foo/bar always cut to the protocol.


    if (relative.slashes && !relative.protocol) {
      // take everything except the protocol from relative
      var rkeys = Object.keys(relative);

      for (var rk = 0; rk < rkeys.length; rk++) {
        var rkey = rkeys[rk];
        if (rkey !== 'protocol') result[rkey] = relative[rkey];
      } //urlParse appends trailing / to urls like http://www.example.com


      if (slashedProtocol[result.protocol] && result.hostname && !result.pathname) {
        result.path = result.pathname = '/';
      }

      result.href = result.format();
      return result;
    }

    if (relative.protocol && relative.protocol !== result.protocol) {
      // if it's a known url protocol, then changing
      // the protocol does weird things
      // first, if it's not file:, then we MUST have a host,
      // and if there was a path
      // to begin with, then we MUST have a path.
      // if it is file:, then the host is dropped,
      // because that's known to be hostless.
      // anything else is assumed to be absolute.
      if (!slashedProtocol[relative.protocol]) {
        var keys = Object.keys(relative);

        for (var v = 0; v < keys.length; v++) {
          var k = keys[v];
          result[k] = relative[k];
        }

        result.href = result.format();
        return result;
      }

      result.protocol = relative.protocol;

      if (!relative.host && !hostlessProtocol[relative.protocol]) {
        var relPath = (relative.pathname || '').split('/');

        while (relPath.length && !(relative.host = relPath.shift()));

        if (!relative.host) relative.host = '';
        if (!relative.hostname) relative.hostname = '';
        if (relPath[0] !== '') relPath.unshift('');
        if (relPath.length < 2) relPath.unshift('');
        result.pathname = relPath.join('/');
      } else {
        result.pathname = relative.pathname;
      }

      result.search = relative.search;
      result.query = relative.query;
      result.host = relative.host || '';
      result.auth = relative.auth;
      result.hostname = relative.hostname || relative.host;
      result.port = relative.port; // to support http.request

      if (result.pathname || result.search) {
        var p = result.pathname || '';
        var s = result.search || '';
        result.path = p + s;
      }

      result.slashes = result.slashes || relative.slashes;
      result.href = result.format();
      return result;
    }

    var isSourceAbs = result.pathname && result.pathname.charAt(0) === '/',
        isRelAbs = relative.host || relative.pathname && relative.pathname.charAt(0) === '/',
        mustEndAbs = isRelAbs || isSourceAbs || result.host && relative.pathname,
        removeAllDots = mustEndAbs,
        srcPath = result.pathname && result.pathname.split('/') || [],
        relPath = relative.pathname && relative.pathname.split('/') || [],
        psychotic = result.protocol && !slashedProtocol[result.protocol]; // if the url is a non-slashed url, then relative
    // links like ../.. should be able
    // to crawl up to the hostname, as well.  This is strange.
    // result.protocol has already been set by now.
    // Later on, put the first path part into the host field.

    if (psychotic) {
      result.hostname = '';
      result.port = null;

      if (result.host) {
        if (srcPath[0] === '') srcPath[0] = result.host;else srcPath.unshift(result.host);
      }

      result.host = '';

      if (relative.protocol) {
        relative.hostname = null;
        relative.port = null;

        if (relative.host) {
          if (relPath[0] === '') relPath[0] = relative.host;else relPath.unshift(relative.host);
        }

        relative.host = null;
      }

      mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
    }

    if (isRelAbs) {
      // it's absolute.
      result.host = relative.host || relative.host === '' ? relative.host : result.host;
      result.hostname = relative.hostname || relative.hostname === '' ? relative.hostname : result.hostname;
      result.search = relative.search;
      result.query = relative.query;
      srcPath = relPath; // fall through to the dot-handling below.
    } else if (relPath.length) {
      // it's relative
      // throw away the existing file, and take the new path instead.
      if (!srcPath) srcPath = [];
      srcPath.pop();
      srcPath = srcPath.concat(relPath);
      result.search = relative.search;
      result.query = relative.query;
    } else if (!util.isNullOrUndefined(relative.search)) {
      // just pull out the search.
      // like href='?foo'.
      // Put this after the other two cases because it simplifies the booleans
      if (psychotic) {
        result.hostname = result.host = srcPath.shift(); //occationaly the auth can get stuck only in host
        //this especially happens in cases like
        //url.resolveObject('mailto:local1@domain1', 'local2@domain2')

        var authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;

        if (authInHost) {
          result.auth = authInHost.shift();
          result.host = result.hostname = authInHost.shift();
        }
      }

      result.search = relative.search;
      result.query = relative.query; //to support http.request

      if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
        result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
      }

      result.href = result.format();
      return result;
    }

    if (!srcPath.length) {
      // no path at all.  easy.
      // we've already handled the other stuff above.
      result.pathname = null; //to support http.request

      if (result.search) {
        result.path = '/' + result.search;
      } else {
        result.path = null;
      }

      result.href = result.format();
      return result;
    } // if a url ENDs in . or .., then it must get a trailing slash.
    // however, if it ends in anything else non-slashy,
    // then it must NOT get a trailing slash.


    var last = srcPath.slice(-1)[0];
    var hasTrailingSlash = (result.host || relative.host || srcPath.length > 1) && (last === '.' || last === '..') || last === ''; // strip single dots, resolve double dots to parent dir
    // if the path tries to go above the root, `up` ends up > 0

    var up = 0;

    for (var i = srcPath.length; i >= 0; i--) {
      last = srcPath[i];

      if (last === '.') {
        srcPath.splice(i, 1);
      } else if (last === '..') {
        srcPath.splice(i, 1);
        up++;
      } else if (up) {
        srcPath.splice(i, 1);
        up--;
      }
    } // if the path is allowed to go above the root, restore leading ..s


    if (!mustEndAbs && !removeAllDots) {
      for (; up--; up) {
        srcPath.unshift('..');
      }
    }

    if (mustEndAbs && srcPath[0] !== '' && (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
      srcPath.unshift('');
    }

    if (hasTrailingSlash && srcPath.join('/').substr(-1) !== '/') {
      srcPath.push('');
    }

    var isAbsolute = srcPath[0] === '' || srcPath[0] && srcPath[0].charAt(0) === '/'; // put the host back

    if (psychotic) {
      result.hostname = result.host = isAbsolute ? '' : srcPath.length ? srcPath.shift() : ''; //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')

      var authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;

      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }

    mustEndAbs = mustEndAbs || result.host && srcPath.length;

    if (mustEndAbs && !isAbsolute) {
      srcPath.unshift('');
    }

    if (!srcPath.length) {
      result.pathname = null;
      result.path = null;
    } else {
      result.pathname = srcPath.join('/');
    } //to support request.http


    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
    }

    result.auth = relative.auth || result.auth;
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  };

  Url.prototype.parseHost = function () {
    var host = this.host;
    var port = portPattern.exec(host);

    if (port) {
      port = port[0];

      if (port !== ':') {
        this.port = port.substr(1);
      }

      host = host.substr(0, host.length - port.length);
    }

    if (host) this.hostname = host;
  };

  /* eslint-disable @typescript-eslint/no-redeclare */
  const URL = url.URL || globalThis.URL;

  var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    URL: URL
  });

  const validateTargetAddress = (targetAddress, errors) => {
    if (typeof targetAddress !== 'string') return [errors.invalidTargetAddress];
    if (targetAddress.length !== tezosInfo.addressLength) return [errors.targetAddressHasInvalidLength];
    if (!tezosInfo.addressPrefixes.some(prefix => targetAddress.startsWith(prefix))) return [errors.targetAddressIsNotNetworkAddress];
  };
  const validateId = (id, errors) => {
    if (typeof id !== 'string') return [errors.invalidId];
    if (id === '') return [errors.emptyId];
  };
  const validateAmount = (amount, errors) => {
    if (!BigNumber.isBigNumber(amount) || amount.isNaN() || !amount.isFinite()) return [errors.invalidAmount];
    if (amount.isZero() || amount.isNegative()) return [errors.amountIsNonPositive];
  };
  const validateDesiredAmount = (desiredAmount, errors) => {
    return desiredAmount === undefined ? undefined : validateAmount(desiredAmount, errors);
  };
  const validatePaymentAsset = (asset, errors) => {
    if (asset === undefined) return;
    if (!isPlainObject(asset)) return [errors.invalidAsset];
    return validateAsset(asset, errors) || validateAssetDecimals(asset.decimals, errors);
  };
  const validateDonationAsset = (asset, errors) => {
    if (asset === undefined) return;
    if (!isPlainObject(asset)) return [errors.invalidAsset];
    return validateAsset(asset, errors);
  };
  const validateCreatedDate = (date, errors) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) return [errors.invalidCreatedDate];
  };
  const validateUrl = (url, errors) => {
    if (url === undefined) return;
    if (!(url instanceof URL)) return [errors.invalidUrl];
    if (url.protocol.indexOf('javascript') > -1) return [errors.invalidProtocol];
  };
  const validateExpiredDate = (expiredDate, createdDate, minimumPaymentLifetime, errors) => {
    if (expiredDate === undefined) return;
    if (!(expiredDate instanceof Date) || isNaN(expiredDate.getTime())) return [errors.invalidExpiredDate];

    if (expiredDate.getTime() - createdDate.getTime() < minimumPaymentLifetime) {
      return [errors.paymentLifetimeIsShort];
    }
  };
  const validateData = (data, errors) => {
    if (data === undefined) return;
    if (!isPlainObject(data)) return [errors.invalidData];
  };

  const validateAsset = (asset, errors) => {
    return validateAssetAddress(asset.address, errors) || validateAssetId(asset.id, errors);
  };

  const validateAssetAddress = (assetAddress, errors) => {
    if (typeof assetAddress !== 'string') return [errors.invalidAssetAddress];
    if (assetAddress.length !== tezosInfo.addressLength) return [errors.assetAddressHasInvalidLength];
    if (!tezosInfo.contractAddressPrefixes.some(prefix => assetAddress.startsWith(prefix))) return [errors.assetAddressIsNotContractAddress];
  };

  const validateAssetId = (assetId, errors) => {
    if (assetId === null) return;
    if (typeof assetId !== 'number' || Number.isNaN(assetId) || !Number.isFinite(assetId)) return [errors.invalidAssetId];
    if (assetId < 0) return [errors.assetIdIsNegative];
    if (!Number.isInteger(assetId)) return [errors.assetIdIsNotInteger];
  };

  const validateAssetDecimals = (assetDecimals, errors) => {
    if (typeof assetDecimals !== 'number' || Number.isNaN(assetDecimals) || !Number.isFinite(assetDecimals)) return [errors.invalidAssetDecimals];
    if (assetDecimals < 0) return [errors.assetDecimalsNumberIsNegative];
    if (!Number.isInteger(assetDecimals)) return [errors.assetDecimalsNumberIsNotInteger];
  };

  class PaymentValidator extends PaymentValidatorBase {
    constructor(...args) {
      super(...args);

      _defineProperty(this, "validationMethods", [payment => payment.type !== exports.PaymentType.Payment ? [PaymentValidator.errors.invalidType] : undefined, payment => validateTargetAddress(payment.targetAddress, PaymentValidator.errors), payment => validateId(payment.id, PaymentValidator.errors), payment => validateAmount(payment.amount, PaymentValidator.errors), payment => validatePaymentAsset(payment.asset, PaymentValidator.errors), payment => validateData(payment.data, PaymentValidator.errors), payment => validateUrl(payment.successUrl, PaymentValidator.successUrlErrors), payment => validateUrl(payment.cancelUrl, PaymentValidator.cancelUrlErrors), payment => validateCreatedDate(payment.created, PaymentValidator.errors), payment => validateExpiredDate(payment.expired, payment.created, PaymentValidator.minimumPaymentLifetime, PaymentValidator.errors)]);

      _defineProperty(this, "invalidPaymentObjectError", PaymentValidator.errors.invalidPaymentObject);
    }

  }

  _defineProperty(PaymentValidator, "errors", {
    invalidPaymentObject: 'Payment is undefined or not object',
    invalidType: 'Payment type is invalid',
    invalidTargetAddress: 'Target address is invalid',
    targetAddressIsNotNetworkAddress: 'Target address isn\'t a network address',
    targetAddressHasInvalidLength: 'Target address has an invalid address',
    invalidId: 'Id is invalid',
    emptyId: 'Id is empty',
    invalidAmount: 'Amount is invalid',
    amountIsNonPositive: 'Amount is less than or equal to zero',
    invalidData: 'Payment data is invalid',
    invalidAsset: 'Asset is invalid',
    invalidAssetAddress: 'Asset address is invalid',
    assetAddressIsNotContractAddress: 'Asset address isn\'t a contract address',
    assetAddressHasInvalidLength: 'Asset address has an invalid address',
    invalidAssetId: 'Asset Id is invalid',
    assetIdIsNegative: 'Asset Id is negative',
    assetIdIsNotInteger: 'Asset Id isn\'t an integer',
    invalidAssetDecimals: 'Asset number of decimals is invalid',
    assetDecimalsNumberIsNegative: 'Asset number of decimals is negative',
    assetDecimalsNumberIsNotInteger: 'Asset number of decimals isn\'t an integer',
    invalidSuccessUrl: 'Success URL is invalid',
    successUrlHasInvalidProtocol: 'Success URL has an invalid protocol',
    invalidCancelUrl: 'Cancel URL is invalid',
    cancelUrlHasInvalidProtocol: 'Cancel URL has an invalid protocol',
    invalidCreatedDate: 'Created date is invalid',
    invalidExpiredDate: 'Expired date is invalid',
    paymentLifetimeIsShort: 'Payment lifetime is short'
  });

  _defineProperty(PaymentValidator, "minimumPaymentLifetime", 600000);

  _defineProperty(PaymentValidator, "successUrlErrors", {
    invalidUrl: PaymentValidator.errors.invalidSuccessUrl,
    invalidProtocol: PaymentValidator.errors.successUrlHasInvalidProtocol
  });

  _defineProperty(PaymentValidator, "cancelUrlErrors", {
    invalidUrl: PaymentValidator.errors.invalidCancelUrl,
    invalidProtocol: PaymentValidator.errors.cancelUrlHasInvalidProtocol
  });

  class DonationValidator extends PaymentValidatorBase {
    constructor(...args) {
      super(...args);

      _defineProperty(this, "validationMethods", [donation => donation.type !== exports.PaymentType.Donation ? [DonationValidator.errors.invalidType] : undefined, donation => validateData(donation.data, DonationValidator.errors), donation => validateTargetAddress(donation.targetAddress, DonationValidator.errors), donation => validateDesiredAmount(donation.desiredAmount, DonationValidator.errors), donation => validateDonationAsset(donation.desiredAsset, DonationValidator.errors), donation => validateUrl(donation.successUrl, DonationValidator.successUrlErrors), donation => validateUrl(donation.cancelUrl, DonationValidator.cancelUrlErrors)]);

      _defineProperty(this, "invalidPaymentObjectError", DonationValidator.errors.invalidDonationObject);
    }

  }

  _defineProperty(DonationValidator, "errors", {
    invalidDonationObject: 'Donation is undefined or not object',
    invalidType: 'Donation type is invalid',
    invalidData: 'Donation data is invalid',
    invalidAmount: 'Desired amount is invalid',
    amountIsNonPositive: 'Desired amount is less than or equal to zero',
    invalidTargetAddress: 'Target address is invalid',
    targetAddressIsNotNetworkAddress: 'Target address isn\'t a network address',
    targetAddressHasInvalidLength: 'Target address has an invalid address',
    invalidAsset: 'Desired asset is invalid',
    invalidAssetAddress: 'Desired asset address is invalid',
    assetAddressIsNotContractAddress: 'Desired asset address isn\'t a contract address',
    assetAddressHasInvalidLength: 'Desired asset address has an invalid address',
    invalidAssetId: 'Asset Id is invalid',
    assetIdIsNegative: 'Asset Id is negative',
    assetIdIsNotInteger: 'Asset Id isn\'t an integer',
    invalidSuccessUrl: 'Success URL is invalid',
    successUrlHasInvalidProtocol: 'Success URL has an invalid protocol',
    invalidCancelUrl: 'Cancel URL is invalid',
    cancelUrlHasInvalidProtocol: 'Cancel URL has an invalid protocol'
  });

  _defineProperty(DonationValidator, "successUrlErrors", {
    invalidUrl: DonationValidator.errors.invalidSuccessUrl,
    invalidProtocol: DonationValidator.errors.successUrlHasInvalidProtocol
  });

  _defineProperty(DonationValidator, "cancelUrlErrors", {
    invalidUrl: DonationValidator.errors.invalidCancelUrl,
    invalidProtocol: DonationValidator.errors.cancelUrlHasInvalidProtocol
  });

  class StateModel {
    constructor() {// All derived classes should be static
    }

  }

  class ObjectSerializationValidator {
    constructor(objectFieldTypes) {
      this.objectFieldTypes = objectFieldTypes;
    }

    get minObjectFieldsCount() {
      if (!this._minObjectFieldsCount) {
        let count = 0;

        for (const info of this.objectFieldTypes) {
          if (typeof info[1] === 'string' ? info[1] !== 'undefined' : info[1].every(type => type !== 'undefined')) count++;
        }

        this._minObjectFieldsCount = count;
      }

      return this._minObjectFieldsCount;
    }

    get maxObjectFieldsCount() {
      return this.objectFieldTypes.size;
    }

    validate(value) {
      if (!value) return false;
      const fieldNames = Object.getOwnPropertyNames(value); // Prevent the field checking if the deserializedValue has an invalid number of fields

      if (fieldNames.length < this.minObjectFieldsCount || fieldNames.length > this.maxObjectFieldsCount) return false;

      for (const [fieldName, expectedFieldType] of this.objectFieldTypes) {
        const fieldValue = value[fieldName];
        const actualFieldType = fieldValue === null ? 'null' : typeof fieldValue;

        if (Array.isArray(expectedFieldType) ? !expectedFieldType.some(expectedType => actualFieldType === expectedType) : actualFieldType !== expectedFieldType) {
          return false;
        }
      }

      return true;
    }

  }

  class Base64Serializer {
    constructor(fieldTypes) {
      this.objectSerializationValidator = new ObjectSerializationValidator(fieldTypes);
    }

    serialize(value) {
      try {
        if (!this.objectSerializationValidator.validate(value)) return null;
        const jsonString = JSON.stringify(value);
        return encode$1(jsonString, 'base64url');
      } catch {
        return null;
      }
    }

  }

  class Base64Deserializer {
    constructor(fieldTypes) {
      this.objectSerializationValidator = new ObjectSerializationValidator(fieldTypes);
    }

    deserialize(serializedValue) {
      try {
        let value;

        if (serializedValue) {
          const serializedValueString = decode$1(serializedValue, 'base64url');
          value = JSON.parse(serializedValueString);
        } else value = {};

        return this.objectSerializationValidator.validate(value) ? value : null;
      } catch {
        return null;
      }
    }

  }

  new Map() // address
  .set('a', 'string') // decimals
  .set('d', 'number') // id
  .set('i', ['number', 'undefined', 'null']);

  new Map() // contract
  .set('c', 'string') // client
  .set('cl', ['string', 'undefined', 'null']) // signature.signingPublicKey
  .set('k', 'string');

  const serializedPaymentFieldTypes = new Map() // id
  .set('i', 'string') // amount
  .set('a', 'string') // asset
  .set('as', ['object', 'undefined', 'null']) // .set('as', serializedPaymentAssetFieldTypes)
  // data
  .set('d', ['object', 'undefined', 'null']) // successUrl
  .set('su', ['string', 'undefined', 'null']) // cancelUrl
  .set('cu', ['string', 'undefined', 'null']) // created
  .set('c', 'number') // expired
  .set('e', ['number', 'undefined', 'null']) // signature
  .set('s', 'object'); // .set('s', serializedPaymentSignatureFieldTypes);

  class PaymentSerializer {
    serialize(payment) {
      try {
        const serializedPayment = this.mapPaymentToSerializedPayment(payment);
        return PaymentSerializer.serializedPaymentBase64Serializer.serialize(serializedPayment);
      } catch {
        return null;
      }
    }

    mapPaymentToSerializedPayment(payment) {
      var _payment$successUrl, _payment$cancelUrl, _payment$expired;

      return {
        i: payment.id,
        a: payment.amount.toString(),
        as: payment.asset ? this.mapPaymentAssetToSerializedPaymentAsset(payment.asset) : undefined,
        d: payment.data,
        su: (_payment$successUrl = payment.successUrl) === null || _payment$successUrl === void 0 ? void 0 : _payment$successUrl.toString(),
        cu: (_payment$cancelUrl = payment.cancelUrl) === null || _payment$cancelUrl === void 0 ? void 0 : _payment$cancelUrl.toString(),
        c: payment.created.getTime(),
        e: (_payment$expired = payment.expired) === null || _payment$expired === void 0 ? void 0 : _payment$expired.getTime(),
        s: this.mapPaymentSignatureToSerializedPaymentSignature(payment.signature)
      };
    }

    mapPaymentAssetToSerializedPaymentAsset(paymentAsset) {
      return {
        a: paymentAsset.address,
        d: paymentAsset.decimals,
        i: paymentAsset.id !== null ? paymentAsset.id : undefined
      };
    }

    mapPaymentSignatureToSerializedPaymentSignature(paymentSignature) {
      return {
        k: paymentSignature.signingPublicKey,
        c: paymentSignature.contract,
        cl: paymentSignature.client
      };
    }

  }

  _defineProperty(PaymentSerializer, "serializedPaymentBase64Serializer", new Base64Serializer(serializedPaymentFieldTypes));

  class PaymentDeserializer {
    deserialize(serializedPaymentBase64, nonSerializedPaymentSlice) {
      try {
        const serializedPayment = PaymentDeserializer.serializedPaymentBase64Deserializer.deserialize(serializedPaymentBase64);
        return serializedPayment ? this.mapSerializedPaymentToPayment(serializedPayment, nonSerializedPaymentSlice) : null;
      } catch {
        return null;
      }
    }

    mapSerializedPaymentToPayment(serializedPayment, nonSerializedPaymentSlice) {
      return {
        type: exports.PaymentType.Payment,
        id: serializedPayment.i,
        amount: new BigNumber(serializedPayment.a),
        asset: serializedPayment.as ? this.mapSerializedPaymentAssetToPaymentAsset(serializedPayment.as) : undefined,
        data: serializedPayment.d,
        successUrl: serializedPayment.su ? new URL(serializedPayment.su) : undefined,
        cancelUrl: serializedPayment.cu ? new URL(serializedPayment.cu) : undefined,
        created: new Date(serializedPayment.c),
        expired: serializedPayment.e ? new Date(serializedPayment.e) : undefined,
        targetAddress: nonSerializedPaymentSlice.targetAddress,
        signature: this.mapSerializedPaymentSignatureToPaymentSignature(serializedPayment.s)
      };
    }

    mapSerializedPaymentAssetToPaymentAsset(serializedPaymentAsset) {
      return {
        address: serializedPaymentAsset.a,
        decimals: serializedPaymentAsset.d,
        id: serializedPaymentAsset.i !== undefined ? serializedPaymentAsset.i : null
      };
    }

    mapSerializedPaymentSignatureToPaymentSignature(serializedPaymentSignature) {
      return {
        signingPublicKey: serializedPaymentSignature.k,
        contract: serializedPaymentSignature.c,
        client: serializedPaymentSignature.cl
      };
    }

  }

  _defineProperty(PaymentDeserializer, "serializedPaymentBase64Deserializer", new Base64Deserializer(serializedPaymentFieldTypes));

  new Map() // address
  .set('a', 'string') // id
  .set('i', ['number', 'undefined', 'null']);

  new Map() // client
  .set('cl', 'string') // signature.signingPublicKey
  .set('k', 'string');

  const serializedDonationFieldTypes = new Map() // data
  .set('d', ['object', 'undefined', 'null']) // desiredAmount
  .set('da', ['string', 'undefined', 'null']) // desiredAsset
  .set('das', ['object', 'undefined', 'null']) // .set('das', serializedDonationAssetFieldTypes)
  // successUrl
  .set('su', ['string', 'undefined', 'null']) // cancelUrl
  .set('cu', ['string', 'undefined', 'null']) // signature
  .set('s', ['object', 'undefined', 'null']); // .set('da', serializedDonationSignatureFieldTypes)

  const serializedEmptyObjectBase64 = 'e30';
  class DonationSerializer {
    serialize(donation) {
      try {
        const serializedDonation = this.mapDonationToSerializedDonation(donation);
        const serializedDonationBase64 = DonationSerializer.serializedDonationBase64Serializer.serialize(serializedDonation);
        return serializedDonationBase64 === serializedEmptyObjectBase64 ? '' : serializedDonationBase64;
      } catch {
        return null;
      }
    }

    mapDonationToSerializedDonation(donation) {
      var _donation$desiredAmou, _donation$successUrl, _donation$cancelUrl;

      return {
        d: donation.data,
        da: (_donation$desiredAmou = donation.desiredAmount) === null || _donation$desiredAmou === void 0 ? void 0 : _donation$desiredAmou.toString(),
        das: donation.desiredAsset ? this.mapDonationAssetToSerializedDonationAsset(donation.desiredAsset) : undefined,
        su: (_donation$successUrl = donation.successUrl) === null || _donation$successUrl === void 0 ? void 0 : _donation$successUrl.toString(),
        cu: (_donation$cancelUrl = donation.cancelUrl) === null || _donation$cancelUrl === void 0 ? void 0 : _donation$cancelUrl.toString(),
        s: donation.signature ? this.mapDonationSignatureToSerializedDonationSignature(donation.signature) : undefined
      };
    }

    mapDonationAssetToSerializedDonationAsset(donationAsset) {
      return {
        a: donationAsset.address,
        i: donationAsset.id !== null ? donationAsset.id : undefined
      };
    }

    mapDonationSignatureToSerializedDonationSignature(donationSignature) {
      return {
        k: donationSignature.signingPublicKey,
        cl: donationSignature.client
      };
    }

  }

  _defineProperty(DonationSerializer, "serializedDonationBase64Serializer", new Base64Serializer(serializedDonationFieldTypes));

  class DonationDeserializer {
    deserialize(serializedDonationBase64, nonSerializedDonationSlice) {
      try {
        const serializedDonation = DonationDeserializer.serializedDonationBase64Deserializer.deserialize(serializedDonationBase64);
        return serializedDonation ? this.mapSerializedDonationToDonation(serializedDonation, nonSerializedDonationSlice) : null;
      } catch {
        return null;
      }
    }

    mapSerializedDonationToDonation(serializedDonation, nonSerializedDonationSlice) {
      return {
        type: exports.PaymentType.Donation,
        data: serializedDonation.d,
        desiredAmount: serializedDonation.da ? new BigNumber(serializedDonation.da) : undefined,
        desiredAsset: serializedDonation.das ? this.mapSerializedDonationAssetToDonationAsset(serializedDonation.das) : undefined,
        successUrl: serializedDonation.su ? new URL(serializedDonation.su) : undefined,
        cancelUrl: serializedDonation.cu ? new URL(serializedDonation.cu) : undefined,
        targetAddress: nonSerializedDonationSlice.targetAddress,
        signature: serializedDonation.s ? this.mapSerializedDonationSignatureToDonationSignature(serializedDonation.s) : undefined
      };
    }

    mapSerializedDonationAssetToDonationAsset(serializedDonationAsset) {
      return {
        address: serializedDonationAsset.a,
        id: serializedDonationAsset.i !== undefined ? serializedDonationAsset.i : null
      };
    }

    mapSerializedDonationSignatureToDonationSignature(serializedDonationSignature) {
      return {
        signingPublicKey: serializedDonationSignature.k,
        client: serializedDonationSignature.cl
      };
    }

  }

  _defineProperty(DonationDeserializer, "serializedDonationBase64Deserializer", new Base64Deserializer(serializedDonationFieldTypes));

  class Payment extends StateModel {
    static validate(payment) {
      return Payment.defaultValidator.validate(payment);
    }

    static deserialize(serializedPayment, nonSerializedPaymentSlice) {
      return Payment.defaultDeserializer.deserialize(serializedPayment, nonSerializedPaymentSlice);
    }

  }

  _defineProperty(Payment, "defaultDeserializer", new PaymentDeserializer());

  _defineProperty(Payment, "defaultValidator", new PaymentValidator());

  class Donation extends StateModel {
    static validate(donation) {
      return Donation.defaultValidator.validate(donation);
    }

    static deserialize(serializedDonation, nonSerializedDonationSlice) {
      return Donation.defaultDeserializer.deserialize(serializedDonation, nonSerializedDonationSlice);
    }

  }

  _defineProperty(Donation, "defaultDeserializer", new DonationDeserializer());

  _defineProperty(Donation, "defaultValidator", new DonationValidator());

  exports.PaymentUrlType = void 0;

  (function (PaymentUrlType) {
    PaymentUrlType[PaymentUrlType["Base64"] = 0] = "Base64";
  })(exports.PaymentUrlType || (exports.PaymentUrlType = {}));

  const encodedPaymentUrlTypeMap = new Map(Object.keys(exports.PaymentUrlType).filter(value => !isNaN(+value)).map(value => [+value, padStart(value, 2, '0')]));
  const getEncodedPaymentUrlType = paymentUrlType => encodedPaymentUrlTypeMap.get(paymentUrlType) || '';

  const getParameterizedRoute = (factory, template) => {
    factory.template = template;
    return factory;
  };

  exports.ServiceOperationType = void 0;

  (function (ServiceOperationType) {
    ServiceOperationType[ServiceOperationType["Payment"] = 1] = "Payment";
    ServiceOperationType[ServiceOperationType["Donation"] = 2] = "Donation";
    ServiceOperationType[ServiceOperationType["All"] = 3] = "All";
  })(exports.ServiceOperationType || (exports.ServiceOperationType = {}));

  const emptyService = {
    name: '',
    description: '',
    links: optimization.emptyArray,
    version: 0,
    metadata: '',
    contractAddress: '',
    allowedTokens: {
      tez: true,
      assets: optimization.emptyArray
    },
    allowedOperationType: exports.ServiceOperationType.Payment,
    owner: '',
    paused: false,
    deleted: false,
    network: networks.granadanet,
    signingKeys: optimization.emptyMap
  };

  exports.OperationType = void 0;

  (function (OperationType) {
    OperationType[OperationType["Payment"] = 1] = "Payment";
    OperationType[OperationType["Donation"] = 2] = "Donation";
  })(exports.OperationType || (exports.OperationType = {}));

  exports.OperationDirection = void 0;

  (function (OperationDirection) {
    OperationDirection[OperationDirection["Incoming"] = 0] = "Incoming";
    OperationDirection[OperationDirection["Outgoing"] = 1] = "Outgoing";
  })(exports.OperationDirection || (exports.OperationDirection = {}));

  exports.OperationStatus = void 0;

  (function (OperationStatus) {
    OperationStatus[OperationStatus["Pending"] = 0] = "Pending";
    OperationStatus[OperationStatus["Success"] = 1] = "Success";
    OperationStatus[OperationStatus["Cancelled"] = 2] = "Cancelled";
  })(exports.OperationStatus || (exports.OperationStatus = {}));

  class DonationOperation extends StateModel {
    static parsePayload(encodedValue) {
      const valueString = bytesToString(encodedValue);
      let value = null;

      try {
        value = JSON.parse(valueString);
      } catch {
        /**/
      }

      return {
        value,
        valueString,
        encodedValue
      };
    }

  }

  class DonationSignPayloadEncoder {
    encode(donation) {
      return {
        clientSignPayload: this.getClientSignPayload(donation)
      };
    }

    getClientSignPayload(donation) {
      return (donation.successUrl ? donation.successUrl.href : '') + (donation.cancelUrl ? donation.cancelUrl.href : '') || null;
    }

  }

  // Michelson abstract syntax tree types https://tezos.gitlab.io/whitedoc/michelson.html#concrete-syntax
  var sourceReference = Symbol("source_reference");
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */

  /* global Reflect, Promise */

  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
    };

    return extendStatics(d, b);
  };

  function __extends(d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  var __assign = function () {
    __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];

        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }

      return t;
    };

    return __assign.apply(this, arguments);
  };

  function __rest(s, e) {
    var t = {};

    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

    if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
    }
    return t;
  }

  function __generator(thisArg, body) {
    var _ = {
      label: 0,
      sent: function () {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    },
        f,
        y,
        t,
        g;
    return g = {
      next: verb(0),
      "throw": verb(1),
      "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
      return this;
    }), g;

    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }

    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");

      while (_) try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }

      if (op[0] & 5) throw op[1];
      return {
        value: op[0] ? op[1] : void 0,
        done: true
      };
    }
  }

  function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator,
        m = s && o[s],
        i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function () {
        if (o && i >= o.length) o = void 0;
        return {
          value: o && o[i++],
          done: !o
        };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  }

  function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
        r,
        ar = [],
        e;

    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = {
        error: error
      };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }

    return ar;
  }

  function __spreadArray(to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++) to[j] = from[i];

    return to;
  }

  var ScanError =
  /** @class */
  function (_super) {
    __extends(ScanError, _super);

    function ScanError(src, idx, message) {
      var _this = _super.call(this, message) || this;

      _this.src = src;
      _this.idx = idx;
      Object.setPrototypeOf(_this, ScanError.prototype);
      return _this;
    }

    return ScanError;
  }(Error);

  var Literal;

  (function (Literal) {
    Literal[Literal["Comment"] = 0] = "Comment";
    Literal[Literal["Number"] = 1] = "Number";
    Literal[Literal["String"] = 2] = "String";
    Literal[Literal["Bytes"] = 3] = "Bytes";
    Literal[Literal["Ident"] = 4] = "Ident";
  })(Literal || (Literal = {}));

  var isSpace = new RegExp("\\s");
  var isIdentStart = new RegExp("[:@%_A-Za-z]");
  var isIdent = new RegExp("[@%_\\.A-Za-z0-9]");
  var isDigit = new RegExp("[0-9]");
  var isHex = new RegExp("[0-9a-fA-F]");

  function scan(src, scanComments) {
    var i, s, start, ii, esc;

    if (scanComments === void 0) {
      scanComments = false;
    }

    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          i = 0;
          _a.label = 1;

        case 1:
          if (!(i < src.length)) return [3
          /*break*/
          , 19]; // Skip space

          while (i < src.length && isSpace.test(src[i])) {
            i++;
          }

          if (i === src.length) {
            return [2
            /*return*/
            ];
          }

          s = src[i];
          start = i;
          if (!isIdentStart.test(s)) return [3
          /*break*/
          , 3]; // Identifier

          i++;

          while (i < src.length && isIdent.test(src[i])) {
            i++;
          }

          return [4
          /*yield*/
          , {
            t: Literal.Ident,
            v: src.slice(start, i),
            first: start,
            last: i
          }];

        case 2:
          _a.sent();

          return [3
          /*break*/
          , 18];

        case 3:
          if (!(src.length - i > 1 && src.substr(i, 2) === "0x")) return [3
          /*break*/
          , 5]; // Bytes

          i += 2;

          while (i < src.length && isHex.test(src[i])) {
            i++;
          }

          if ((i - start & 1) !== 0) {
            throw new ScanError(src, i, "Bytes literal length is expected to be power of two");
          }

          return [4
          /*yield*/
          , {
            t: Literal.Bytes,
            v: src.slice(start, i),
            first: start,
            last: i
          }];

        case 4:
          _a.sent();

          return [3
          /*break*/
          , 18];

        case 5:
          if (!(isDigit.test(s) || s === "-")) return [3
          /*break*/
          , 7]; // Number

          if (s === "-") {
            i++;
          }

          ii = i;

          while (i < src.length && isDigit.test(src[i])) {
            i++;
          }

          if (ii === i) {
            throw new ScanError(src, i, "Number literal is too short");
          }

          return [4
          /*yield*/
          , {
            t: Literal.Number,
            v: src.slice(start, i),
            first: start,
            last: i
          }];

        case 6:
          _a.sent();

          return [3
          /*break*/
          , 18];

        case 7:
          if (!(s === "\"")) return [3
          /*break*/
          , 9]; // String

          i++;
          esc = false;

          for (; i < src.length && (esc || src[i] !== "\""); i++) {
            if (!esc && src[i] === "\\") {
              esc = true;
            } else {
              esc = false;
            }
          }

          if (i === src.length) {
            throw new ScanError(src, i, "Unterminated string literal");
          }

          i++;
          return [4
          /*yield*/
          , {
            t: Literal.String,
            v: src.slice(start, i),
            first: start,
            last: i
          }];

        case 8:
          _a.sent();

          return [3
          /*break*/
          , 18];

        case 9:
          if (!(s === "#")) return [3
          /*break*/
          , 12]; // Comment

          i++;

          while (i < src.length && src[i] !== "\n") {
            i++;
          }

          if (!scanComments) return [3
          /*break*/
          , 11];
          return [4
          /*yield*/
          , {
            t: Literal.Comment,
            v: src.slice(start, i),
            first: start,
            last: i
          }];

        case 10:
          _a.sent();

          _a.label = 11;

        case 11:
          return [3
          /*break*/
          , 18];

        case 12:
          if (!(src.length - i > 1 && src.substr(i, 2) === "/*")) return [3
          /*break*/
          , 15]; // C style comment

          i += 2;

          while (i < src.length && !(src.length - i > 1 && src.substr(i, 2) === "*/")) {
            i++;
          }

          if (i === src.length) {
            throw new ScanError(src, i, "Unterminated C style comment");
          }

          i += 2;
          if (!scanComments) return [3
          /*break*/
          , 14];
          return [4
          /*yield*/
          , {
            t: Literal.Comment,
            v: src.slice(start, i),
            first: start,
            last: i
          }];

        case 13:
          _a.sent();

          _a.label = 14;

        case 14:
          return [3
          /*break*/
          , 18];

        case 15:
          if (!(s === "(" || s === ")" || s === "{" || s === "}" || s === ";")) return [3
          /*break*/
          , 17];
          i++;
          return [4
          /*yield*/
          , {
            t: s,
            v: s,
            first: start,
            last: i
          }];

        case 16:
          _a.sent();

          return [3
          /*break*/
          , 18];

        case 17:
          throw new ScanError(src, i, "Invalid character at offset " + i + ": `" + s + "'");

        case 18:
          return [3
          /*break*/
          , 1];

        case 19:
          return [2
          /*return*/
          ];
      }
    });
  } // Michelson types


  var refContract = Symbol("ref_contract");
  var Protocol;

  (function (Protocol) {
    Protocol["Pt24m4xi"] = "Pt24m4xiPbLDhVgVfABUjirbmda3yohdN82Sp9FeuAXJ4eV9otd";
    Protocol["PsBABY5H"] = "PsBABY5HQTSkA4297zNHfsZNKtxULfL18y95qb3m53QJiXGmrbU";
    Protocol["PsBabyM1"] = "PsBabyM1eUXZseaJdmXFApDSBqj8YBfwELoxZHHW77EMcAbbwAS";
    Protocol["PsCARTHA"] = "PsCARTHAGazKbHtnKfLzQg3kms52kSRpgnDY982a9oYsSXRLQEb";
    Protocol["PsDELPH1"] = "PsDELPH1Kxsxt8f9eWbxQeRxkjfbxoqM52jvs5Y5fBxWWh4ifpo";
    Protocol["PtEdo2Zk"] = "PtEdo2ZkT9oKpimTah6x2embF25oss54njMuPzkJTEi5RqfdZFA";
    Protocol["PsFLorena"] = "PsFLorenaUUuikDWvMDr6fGBRG8kt3e3D3fHoXK1j1BFRxeSH4i";
    Protocol["PtGRANADs"] = "PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV";
    Protocol["PtHangzH"] = "PtHangzHogokSuiMHemCuowEavgYTP8J5qQ9fQS793MHYFpCY3r";
  })(Protocol || (Protocol = {}));

  var DefaultProtocol = Protocol.PsDELPH1;

  var MacroError =
  /** @class */
  function (_super) {
    __extends(MacroError, _super);

    function MacroError(prim, message) {
      var _this = _super.call(this, message) || this;

      _this.prim = prim;
      Object.setPrototypeOf(_this, MacroError.prototype);
      return _this;
    }

    return MacroError;
  }(Error);

  function assertArgs$1(ex, n) {
    var _a, _b;

    if (n === 0 && ex.args === undefined || ((_a = ex.args) === null || _a === void 0 ? void 0 : _a.length) === n) {
      return true;
    }

    throw new MacroError(ex, "macro " + ex.prim + " expects " + n + " arguments, was given " + ((_b = ex.args) === null || _b === void 0 ? void 0 : _b.length));
  }

  function assertNoAnnots(ex) {
    if (ex.annots === undefined) {
      return true;
    }

    throw new MacroError(ex, "unexpected annotation on macro " + ex.prim + ": " + ex.annots);
  }

  function assertIntArg(ex, arg) {
    if ("int" in arg) {
      return true;
    }

    throw new MacroError(ex, "macro " + ex.prim + " expects int argument");
  }

  function parsePairUnpairExpr(p, expr, annotations, agg) {
    var i = 0;
    var ai = 0;
    var ann = [null, null]; // Left expression

    var lexpr;

    if (i === expr.length) {
      throw new MacroError(p, "unexpected end: " + p.prim);
    }

    var c = expr[i++];

    switch (c) {
      case "P":
        var _a = parsePairUnpairExpr(p, expr.slice(i), annotations.slice(ai), agg),
            r = _a.r,
            n = _a.n,
            an = _a.an;

        lexpr = r;
        i += n;
        ai += an;
        break;

      case "A":
        if (ai !== annotations.length) {
          ann[0] = annotations[ai++];
        }

        break;

      default:
        throw new MacroError(p, p.prim + ": unexpected character: " + c);
    } // Right expression


    var rexpr;

    if (i === expr.length) {
      throw new MacroError(p, "unexpected end: " + p.prim);
    }

    c = expr[i++];

    switch (c) {
      case "P":
        var _b = parsePairUnpairExpr(p, expr.slice(i), annotations.slice(ai), agg),
            r = _b.r,
            n = _b.n,
            an = _b.an;

        rexpr = r.map(function (_a) {
          var _b = __read(_a, 2),
              v = _b[0],
              a = _b[1];

          return [v + 1, a];
        });
        i += n;
        ai += an;
        break;

      case "I":
        if (ai !== annotations.length) {
          ann[1] = annotations[ai++];
        }

        break;

      default:
        throw new MacroError(p, p.prim + ": unexpected character: " + c);
    }

    return {
      r: agg(lexpr, rexpr, [0, ann]),
      n: i,
      an: ai
    };
  }

  function parseSetMapCadr(p, expr, vann, term) {
    var c = expr[0];

    switch (c) {
      case "A":
        return expr.length > 1 ? [{
          prim: "DUP"
        }, {
          prim: "DIP",
          args: [[{
            prim: "CAR",
            annots: ["@%%"]
          }, parseSetMapCadr(p, expr.slice(1), [], term)]]
        }, {
          prim: "CDR",
          annots: ["@%%"]
        }, {
          prim: "SWAP"
        }, {
          prim: "PAIR",
          annots: __spreadArray(["%@", "%@"], __read(vann))
        }] : term.a;

      case "D":
        return expr.length > 1 ? [{
          prim: "DUP"
        }, {
          prim: "DIP",
          args: [[{
            prim: "CDR",
            annots: ["@%%"]
          }, parseSetMapCadr(p, expr.slice(1), [], term)]]
        }, {
          prim: "CAR",
          annots: ["@%%"]
        }, {
          prim: "PAIR",
          annots: __spreadArray(["%@", "%@"], __read(vann))
        }] : term.d;

      default:
        throw new MacroError(p, p.prim + ": unexpected character: " + c);
    }
  }

  function trimLast(a, v) {
    var l = a.length;

    while (l > 0 && a[l - 1] === v) {
      l--;
    }

    return a.slice(0, l);
  }

  function filterAnnotations(a) {
    var e_1, _a;

    var fields = [];
    var rest = [];

    if (a !== undefined) {
      try {
        for (var a_1 = __values(a), a_1_1 = a_1.next(); !a_1_1.done; a_1_1 = a_1.next()) {
          var v = a_1_1.value;
          (v.length !== 0 && v[0] === "%" ? fields : rest).push(v);
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (a_1_1 && !a_1_1.done && (_a = a_1.return)) _a.call(a_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    }

    return {
      fields: fields,
      rest: rest
    };
  }

  function mkPrim(_a) {
    var prim = _a.prim,
        annots = _a.annots,
        args = _a.args;
    return __assign(__assign({
      prim: prim
    }, annots && {
      annots: annots
    }), args && {
      args: args
    });
  }

  var pairRe = /^P[PAI]{3,}R$/;
  var unpairRe = /^UNP[PAI]{2,}R$/;
  var cadrRe = /^C[AD]{2,}R$/;
  var setCadrRe = /^SET_C[AD]+R$/;
  var mapCadrRe = /^MAP_C[AD]+R$/;
  var diipRe = /^DI{2,}P$/;
  var duupRe = /^DU+P$/;

  function expandMacros(ex, opt) {
    var proto = (opt === null || opt === void 0 ? void 0 : opt.protocol) || DefaultProtocol;

    function mayRename(annots) {
      return annots !== undefined ? [{
        prim: "RENAME",
        annots: annots
      }] : [];
    }

    switch (ex.prim) {
      // Compare
      case "CMPEQ":
      case "CMPNEQ":
      case "CMPLT":
      case "CMPGT":
      case "CMPLE":
      case "CMPGE":
        if (assertArgs$1(ex, 0)) {
          return [{
            prim: "COMPARE"
          }, mkPrim({
            prim: ex.prim.slice(3),
            annots: ex.annots
          })];
        }

        break;

      case "IFEQ":
      case "IFNEQ":
      case "IFLT":
      case "IFGT":
      case "IFLE":
      case "IFGE":
        if (assertArgs$1(ex, 2)) {
          return [{
            prim: ex.prim.slice(2)
          }, mkPrim({
            prim: "IF",
            annots: ex.annots,
            args: ex.args
          })];
        }

        break;

      case "IFCMPEQ":
      case "IFCMPNEQ":
      case "IFCMPLT":
      case "IFCMPGT":
      case "IFCMPLE":
      case "IFCMPGE":
        if (assertArgs$1(ex, 2)) {
          return [{
            prim: "COMPARE"
          }, {
            prim: ex.prim.slice(5)
          }, mkPrim({
            prim: "IF",
            annots: ex.annots,
            args: ex.args
          })];
        }

        break;
      // Fail

      case "FAIL":
        if (assertArgs$1(ex, 0) && assertNoAnnots(ex)) {
          return [{
            prim: "UNIT"
          }, {
            prim: "FAILWITH"
          }];
        }

        break;
      // Assertion macros

      case "ASSERT":
        if (assertArgs$1(ex, 0) && assertNoAnnots(ex)) {
          return [{
            prim: "IF",
            args: [[], [[{
              prim: "UNIT"
            }, {
              prim: "FAILWITH"
            }]]]
          }];
        }

        break;

      case "ASSERT_EQ":
      case "ASSERT_NEQ":
      case "ASSERT_LT":
      case "ASSERT_GT":
      case "ASSERT_LE":
      case "ASSERT_GE":
        if (assertArgs$1(ex, 0) && assertNoAnnots(ex)) {
          return [{
            prim: ex.prim.slice(7)
          }, {
            prim: "IF",
            args: [[], [[{
              prim: "UNIT"
            }, {
              prim: "FAILWITH"
            }]]]
          }];
        }

        break;

      case "ASSERT_CMPEQ":
      case "ASSERT_CMPNEQ":
      case "ASSERT_CMPLT":
      case "ASSERT_CMPGT":
      case "ASSERT_CMPLE":
      case "ASSERT_CMPGE":
        if (assertArgs$1(ex, 0) && assertNoAnnots(ex)) {
          return [[{
            prim: "COMPARE"
          }, {
            prim: ex.prim.slice(10)
          }], {
            prim: "IF",
            args: [[], [[{
              prim: "UNIT"
            }, {
              prim: "FAILWITH"
            }]]]
          }];
        }

        break;

      case "ASSERT_NONE":
        if (assertArgs$1(ex, 0) && assertNoAnnots(ex)) {
          return [{
            prim: "IF_NONE",
            args: [[], [[{
              prim: "UNIT"
            }, {
              prim: "FAILWITH"
            }]]]
          }];
        }

        break;

      case "ASSERT_SOME":
        if (assertArgs$1(ex, 0)) {
          return [{
            prim: "IF_NONE",
            args: [[[{
              prim: "UNIT"
            }, {
              prim: "FAILWITH"
            }]], mayRename(ex.annots)]
          }];
        }

        break;

      case "ASSERT_LEFT":
        if (assertArgs$1(ex, 0)) {
          return [{
            prim: "IF_LEFT",
            args: [mayRename(ex.annots), [[{
              prim: "UNIT"
            }, {
              prim: "FAILWITH"
            }]]]
          }];
        }

        break;

      case "ASSERT_RIGHT":
        if (assertArgs$1(ex, 0)) {
          return [{
            prim: "IF_LEFT",
            args: [[[{
              prim: "UNIT"
            }, {
              prim: "FAILWITH"
            }]], mayRename(ex.annots)]
          }];
        }

        break;
      // Syntactic conveniences

      case "IF_SOME":
        if (assertArgs$1(ex, 2)) {
          return [mkPrim({
            prim: "IF_NONE",
            annots: ex.annots,
            args: [ex.args[1], ex.args[0]]
          })];
        }

        break;

      case "IF_RIGHT":
        if (assertArgs$1(ex, 2)) {
          return [mkPrim({
            prim: "IF_LEFT",
            annots: ex.annots,
            args: [ex.args[1], ex.args[0]]
          })];
        }

        break;
      // CAR/CDR n

      case "CAR":
      case "CDR":
        if (ex.args !== undefined) {
          if (assertArgs$1(ex, 1) && assertIntArg(ex, ex.args[0])) {
            var n = parseInt(ex.args[0].int, 10);
            return mkPrim({
              prim: "GET",
              args: [{
                int: ex.prim === "CAR" ? String(n * 2 + 1) : String(n * 2)
              }],
              annots: ex.annots
            });
          }
        } else {
          return ex;
        }

    } // More syntactic conveniences
    // PAPPAIIR macro


    if (pairRe.test(ex.prim)) {
      if (assertArgs$1(ex, 0)) {
        var _a = filterAnnotations(ex.annots),
            fields = _a.fields,
            rest_1 = _a.rest;

        var r_1 = parsePairUnpairExpr(ex, ex.prim.slice(1), fields, function (l, r, top) {
          return __spreadArray(__spreadArray(__spreadArray([], __read(l || [])), __read(r || [])), [top]);
        }).r;
        return r_1.map(function (_a, i) {
          var _b = __read(_a, 2),
              v = _b[0],
              a = _b[1];

          var ann = __spreadArray(__spreadArray([], __read(trimLast(a, null).map(function (v) {
            return v === null ? "%" : v;
          }))), __read(v === 0 && i === r_1.length - 1 ? rest_1 : []));

          var leaf = mkPrim({
            prim: "PAIR",
            annots: ann.length !== 0 ? ann : undefined
          });
          return v === 0 ? leaf : {
            prim: "DIP",
            args: v === 1 ? [[leaf]] : [{
              int: String(v)
            }, [leaf]]
          };
        });
      }
    } // UNPAPPAIIR macro


    if (unpairRe.test(ex.prim)) {
      if (proto === Protocol.PtEdo2Zk || proto === Protocol.PsFLorena || proto === Protocol.PtGRANADs || proto === Protocol.PtHangzH) {
        if (ex.prim === "UNPAIR") {
          return ex;
        }

        if (assertArgs$1(ex, 0)) {
          // 008_edo: annotations are deprecated
          var r = parsePairUnpairExpr(ex, ex.prim.slice(3), [], function (l, r, top) {
            return __spreadArray(__spreadArray([top], __read(r || [])), __read(l || []));
          }).r;
          return r.map(function (_a) {
            var _b = __read(_a, 1),
                v = _b[0];

            var leaf = mkPrim({
              prim: "UNPAIR"
            });
            return v === 0 ? leaf : {
              prim: "DIP",
              args: v === 1 ? [[leaf]] : [{
                int: String(v)
              }, [leaf]]
            };
          });
        }
      } else if (assertArgs$1(ex, 0)) {
        var r = parsePairUnpairExpr(ex, ex.prim.slice(3), ex.annots || [], function (l, r, top) {
          return __spreadArray(__spreadArray([top], __read(r || [])), __read(l || []));
        }).r;
        return r.map(function (_a) {
          var _b = __read(_a, 2),
              v = _b[0],
              a = _b[1];

          var leaf = [{
            prim: "DUP"
          }, mkPrim({
            prim: "CAR",
            annots: a[0] !== null ? [a[0]] : undefined
          }), {
            prim: "DIP",
            args: [[mkPrim({
              prim: "CDR",
              annots: a[1] !== null ? [a[1]] : undefined
            })]]
          }];
          return v === 0 ? leaf : {
            prim: "DIP",
            args: v === 1 ? [[leaf]] : [{
              int: String(v)
            }, [leaf]]
          };
        });
      }
    } // C[AD]+R macro


    if (cadrRe.test(ex.prim)) {
      if (assertArgs$1(ex, 0)) {
        var ch_1 = __spreadArray([], __read(ex.prim.slice(1, ex.prim.length - 1)));

        return ch_1.map(function (c, i) {
          var ann = i === ch_1.length - 1 ? ex.annots : undefined;

          switch (c) {
            case "A":
              return mkPrim({
                prim: "CAR",
                annots: ann
              });

            case "D":
              return mkPrim({
                prim: "CDR",
                annots: ann
              });

            default:
              throw new MacroError(ex, "unexpected character: " + c);
          }
        });
      }
    } // SET_C[AD]+R macro


    if (setCadrRe.test(ex.prim)) {
      if (assertArgs$1(ex, 0)) {
        var _b = filterAnnotations(ex.annots),
            fields = _b.fields,
            rest = _b.rest;

        if (fields.length > 1) {
          throw new MacroError(ex, "unexpected annotation on macro " + ex.prim + ": " + fields);
        }

        var term = fields.length !== 0 ? {
          a: [{
            prim: "DUP"
          }, {
            prim: "CAR",
            annots: fields
          }, {
            prim: "DROP"
          }, {
            prim: "CDR",
            annots: ["@%%"]
          }, {
            prim: "SWAP"
          }, {
            prim: "PAIR",
            annots: [fields[0], "%@"]
          }],
          d: [{
            prim: "DUP"
          }, {
            prim: "CDR",
            annots: fields
          }, {
            prim: "DROP"
          }, {
            prim: "CAR",
            annots: ["@%%"]
          }, {
            prim: "PAIR",
            annots: ["%@", fields[0]]
          }]
        } : {
          a: [{
            prim: "CDR",
            annots: ["@%%"]
          }, {
            prim: "SWAP"
          }, {
            prim: "PAIR",
            annots: ["%", "%@"]
          }],
          d: [{
            prim: "CAR",
            annots: ["@%%"]
          }, {
            prim: "PAIR",
            annots: ["%@", "%"]
          }]
        };
        return parseSetMapCadr(ex, ex.prim.slice(5, ex.prim.length - 1), rest, term);
      }
    } // MAP_C[AD]+R macro


    if (mapCadrRe.test(ex.prim)) {
      if (assertArgs$1(ex, 1)) {
        var fields = filterAnnotations(ex.annots).fields;

        if (fields.length > 1) {
          throw new MacroError(ex, "unexpected annotation on macro " + ex.prim + ": " + fields);
        }

        var term = {
          a: [{
            prim: "DUP"
          }, {
            prim: "CDR",
            annots: ["@%%"]
          }, {
            prim: "DIP",
            args: [[mkPrim({
              prim: "CAR",
              annots: fields.length !== 0 ? ["@" + fields[0].slice(1)] : undefined
            }), ex.args[0]]]
          }, {
            prim: "SWAP"
          }, {
            prim: "PAIR",
            annots: [fields.length !== 0 ? fields[0] : "%", "%@"]
          }],
          d: [{
            prim: "DUP"
          }, mkPrim({
            prim: "CDR",
            annots: fields.length !== 0 ? ["@" + fields[0].slice(1)] : undefined
          }), ex.args[0], {
            prim: "SWAP"
          }, {
            prim: "CAR",
            annots: ["@%%"]
          }, {
            prim: "PAIR",
            annots: ["%@", fields.length !== 0 ? fields[0] : "%"]
          }]
        };
        return parseSetMapCadr(ex, ex.prim.slice(5, ex.prim.length - 1), [], term);
      }
    } // Expand deprecated DI...IP to [DIP n]


    if (diipRe.test(ex.prim)) {
      if (assertArgs$1(ex, 1)) {
        var n = 0;

        while (ex.prim[1 + n] === "I") {
          n++;
        }

        return mkPrim({
          prim: "DIP",
          args: [{
            int: String(n)
          }, ex.args[0]]
        });
      }
    } // Expand DU...UP and DUP n


    if (duupRe.test(ex.prim)) {
      var n = 0;

      while (ex.prim[1 + n] === "U") {
        n++;
      }

      if (proto === Protocol.PtEdo2Zk || proto === Protocol.PsFLorena || proto === Protocol.PtGRANADs || proto === Protocol.PtHangzH) {
        if (n === 1) {
          return ex;
        }

        if (assertArgs$1(ex, 0)) {
          return mkPrim({
            prim: "DUP",
            args: [{
              int: String(n)
            }],
            annots: ex.annots
          });
        }
      } else {
        if (n === 1) {
          if (ex.args === undefined) {
            return ex; // skip
          }

          if (assertArgs$1(ex, 1) && assertIntArg(ex, ex.args[0])) {
            n = parseInt(ex.args[0].int, 10);
          }
        } else {
          assertArgs$1(ex, 0);
        }

        if (n === 1) {
          return [mkPrim({
            prim: "DUP",
            annots: ex.annots
          })];
        } else if (n === 2) {
          return [{
            prim: "DIP",
            args: [[mkPrim({
              prim: "DUP",
              annots: ex.annots
            })]]
          }, {
            prim: "SWAP"
          }];
        } else {
          return [{
            prim: "DIP",
            args: [{
              int: String(n - 1)
            }, [mkPrim({
              prim: "DUP",
              annots: ex.annots
            })]]
          }, {
            prim: "DIG",
            args: [{
              int: String(n)
            }]
          }];
        }
      }
    }

    return ex;
  }

  var MichelineParseError =
  /** @class */
  function (_super) {
    __extends(MichelineParseError, _super);
    /**
     * @param token A token caused the error
     * @param message An error message
     */


    function MichelineParseError(token, message) {
      var _this = _super.call(this, message) || this;

      _this.token = token;
      Object.setPrototypeOf(_this, MichelineParseError.prototype);
      return _this;
    }

    return MichelineParseError;
  }(Error);

  var JSONParseError =
  /** @class */
  function (_super) {
    __extends(JSONParseError, _super);
    /**
     * @param node A node caused the error
     * @param message An error message
     */


    function JSONParseError(node, message) {
      var _this = _super.call(this, message) || this;

      _this.node = node;
      Object.setPrototypeOf(_this, JSONParseError.prototype);
      return _this;
    }

    return JSONParseError;
  }(Error);

  var errEOF = new MichelineParseError(null, 'Unexpected EOF');

  function isAnnotation(tok) {
    return tok.t === Literal.Ident && (tok.v[0] === '@' || tok.v[0] === '%' || tok.v[0] === ':');
  }

  var intRe = new RegExp('^-?[0-9]+$');
  var bytesRe = new RegExp('^([0-9a-fA-F]{2})*$');
  /**
   * Converts and validates Michelson expressions between JSON-based Michelson and Micheline
   *
   * Pretty Print a Michelson Smart Contract:
   * ```
   * const contract = await Tezos.contract.at("KT1Vsw3kh9638gqWoHTjvHCoHLPKvCbMVbCg");
   * const p = new Parser();
   *
   * const michelsonCode = p.parseJSON(contract.script.code);
   * const storage = p.parseJSON(contract.script.storage);
   *
   * console.log("Pretty print Michelson smart contract:");
   * console.log(emitMicheline(michelsonCode, {indent:"    ", newline: "\n",}));
   *
   * console.log("Pretty print Storage:");
   * console.log(emitMicheline(storage, {indent:"    ", newline: "\n",}));
   * ```
   *
   * Encode a Michelson expression for inital storage of a smart contract
   * ```
   * const src = `(Pair (Pair { Elt 1
   *                (Pair (Pair "tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN" "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx")
   *                      0x0501000000026869) }
   *          10000000)
   *    (Pair 2 333))`;
   *
   * const p = new Parser();
   *
   * const exp = p.parseMichelineExpression(src);
   * console.log(JSON.stringify(exp));
   * ```
   */

  var Parser =
  /** @class */
  function () {
    function Parser(opt) {
      this.opt = opt;
    }

    Parser.prototype.expand = function (ex) {
      var _a, _b;

      if (((_a = this.opt) === null || _a === void 0 ? void 0 : _a.expandMacros) !== undefined ? (_b = this.opt) === null || _b === void 0 ? void 0 : _b.expandMacros : true) {
        var ret = expandMacros(ex, this.opt);

        if (ret !== ex) {
          ret[sourceReference] = __assign(__assign({}, ex[sourceReference] || {
            first: 0,
            last: 0
          }), {
            macro: ex
          });
        }

        return ret;
      } else {
        return ex;
      }
    };

    Parser.prototype.parseListExpr = function (scanner, start) {
      var _a;

      var _b;

      var ref = {
        first: start.first,
        last: start.last
      };
      var expectBracket = start.t === "(";
      var tok;

      if (expectBracket) {
        tok = scanner.next();

        if (tok.done) {
          throw errEOF;
        }

        ref.last = tok.value.last;
      } else {
        tok = {
          value: start
        };
      }

      if (tok.value.t !== Literal.Ident) {
        throw new MichelineParseError(tok.value, "not an identifier: " + tok.value.v);
      }

      var ret = (_a = {
        prim: tok.value.v
      }, _a[sourceReference] = ref, _a);

      for (;;) {
        var tok_1 = scanner.next();

        if (tok_1.done) {
          if (expectBracket) {
            throw errEOF;
          }

          break;
        } else if (tok_1.value.t === ')') {
          if (!expectBracket) {
            throw new MichelineParseError(tok_1.value, "unexpected closing bracket");
          }

          ref.last = tok_1.value.last;
          break;
        } else if (isAnnotation(tok_1.value)) {
          ret.annots = ret.annots || [];
          ret.annots.push(tok_1.value.v);
          ref.last = tok_1.value.last;
        } else {
          ret.args = ret.args || [];
          var arg = this.parseExpr(scanner, tok_1.value);
          ref.last = ((_b = arg[sourceReference]) === null || _b === void 0 ? void 0 : _b.last) || ref.last;
          ret.args.push(arg);
        }
      }

      return this.expand(ret);
    };

    Parser.prototype.parseArgs = function (scanner, start) {
      var _a;

      var _b; // Identifier with arguments


      var ref = {
        first: start.first,
        last: start.last
      };
      var p = (_a = {
        prim: start.v
      }, _a[sourceReference] = ref, _a);

      for (;;) {
        var t = scanner.next();

        if (t.done || t.value.t === '}' || t.value.t === ';') {
          return [p, t];
        }

        if (isAnnotation(t.value)) {
          ref.last = t.value.last;
          p.annots = p.annots || [];
          p.annots.push(t.value.v);
        } else {
          var arg = this.parseExpr(scanner, t.value);
          ref.last = ((_b = arg[sourceReference]) === null || _b === void 0 ? void 0 : _b.last) || ref.last;
          p.args = p.args || [];
          p.args.push(arg);
        }
      }
    };

    Parser.prototype.parseSequenceExpr = function (scanner, start) {
      var _a, _b;

      var ref = {
        first: start.first,
        last: start.last
      };
      var seq = [];
      seq[sourceReference] = ref;
      var expectBracket = start.t === "{";
      var tok = start.t === "{" ? null : {
        value: start
      };

      for (;;) {
        if (tok === null) {
          tok = scanner.next();

          if (!tok.done) {
            ref.last = tok.value.last;
          }
        }

        if (tok.done) {
          if (expectBracket) {
            throw errEOF;
          } else {
            return seq;
          }
        }

        if (tok.value.t === "}") {
          if (!expectBracket) {
            throw new MichelineParseError(tok.value, "unexpected closing bracket");
          } else {
            return seq;
          }
        } else if (tok.value.t === Literal.Ident) {
          // Identifier with arguments
          var _c = __read(this.parseArgs(scanner, tok.value), 2),
              itm = _c[0],
              n = _c[1];

          ref.last = ((_a = itm[sourceReference]) === null || _a === void 0 ? void 0 : _a.last) || ref.last;
          seq.push(this.expand(itm));
          tok = n;
        } else {
          // Other
          var ex = this.parseExpr(scanner, tok.value);
          ref.last = ((_b = ex[sourceReference]) === null || _b === void 0 ? void 0 : _b.last) || ref.last;
          seq.push(ex);
          tok = null;
        }

        if (tok === null) {
          tok = scanner.next();

          if (!tok.done) {
            ref.last = tok.value.last;
          }
        }

        if (!tok.done && tok.value.t === ";") {
          tok = null;
        }
      }
    };

    Parser.prototype.parseExpr = function (scanner, tok) {
      var _a, _b, _c, _d;

      switch (tok.t) {
        case Literal.Ident:
          return this.expand((_a = {
            prim: tok.v
          }, _a[sourceReference] = {
            first: tok.first,
            last: tok.last
          }, _a));

        case Literal.Number:
          return _b = {
            int: tok.v
          }, _b[sourceReference] = {
            first: tok.first,
            last: tok.last
          }, _b;

        case Literal.String:
          return _c = {
            string: JSON.parse(tok.v)
          }, _c[sourceReference] = {
            first: tok.first,
            last: tok.last
          }, _c;

        case Literal.Bytes:
          return _d = {
            bytes: tok.v.slice(2)
          }, _d[sourceReference] = {
            first: tok.first,
            last: tok.last
          }, _d;

        case '{':
          return this.parseSequenceExpr(scanner, tok);

        default:
          return this.parseListExpr(scanner, tok);
      }
    };
    /**
     * Parses a Micheline sequence expression, such as smart contract source. Enclosing curly brackets may be omitted.
     * @param src A Micheline sequence `{parameter ...; storage int; code { DUP ; ...};}` or `parameter ...; storage int; code { DUP ; ...};`
     */


    Parser.prototype.parseSequence = function (src) {
      // tslint:disable-next-line: strict-type-predicates
      if (typeof src !== "string") {
        throw new TypeError("string type was expected, got " + typeof src + " instead");
      }

      var scanner = scan(src);
      var tok = scanner.next();

      if (tok.done) {
        return null;
      }

      return this.parseSequenceExpr(scanner, tok.value);
    };
    /**
     * Parse a Micheline sequence expression. Enclosing curly brackets may be omitted.
     * @param src A Michelson list expression such as `(Pair {Elt "0" 0} 0)` or `Pair {Elt "0" 0} 0`
     * @returns An AST node or null for empty document.
     */


    Parser.prototype.parseList = function (src) {
      // tslint:disable-next-line: strict-type-predicates
      if (typeof src !== "string") {
        throw new TypeError("string type was expected, got " + typeof src + " instead");
      }

      var scanner = scan(src);
      var tok = scanner.next();

      if (tok.done) {
        return null;
      }

      return this.parseListExpr(scanner, tok.value);
    };
    /**
     * Parse any Michelson expression
     * @param src A Michelson expression such as `(Pair {Elt "0" 0} 0)` or `{parameter ...; storage int; code { DUP ; ...};}`
     * @returns An AST node or null for empty document.
     */


    Parser.prototype.parseMichelineExpression = function (src) {
      // tslint:disable-next-line: strict-type-predicates
      if (typeof src !== "string") {
        throw new TypeError("string type was expected, got " + typeof src + " instead");
      }

      var scanner = scan(src);
      var tok = scanner.next();

      if (tok.done) {
        return null;
      }

      return this.parseExpr(scanner, tok.value);
    };
    /**
     * Parse a Micheline sequence expression, such as smart contract source. Enclosing curly brackets may be omitted.
     * An alias for `parseSequence`
     * @param src A Micheline sequence `{parameter ...; storage int; code { DUP ; ...};}` or `parameter ...; storage int; code { DUP ; ...};`
     */


    Parser.prototype.parseScript = function (src) {
      return this.parseSequence(src);
    };
    /**
     * Parse a Micheline sequence expression. Enclosing curly brackets may be omitted.
     * An alias for `parseList`
     * @param src A Michelson list expression such as `(Pair {Elt "0" 0} 0)` or `Pair {Elt "0" 0} 0`
     * @returns An AST node or null for empty document.
     */


    Parser.prototype.parseData = function (src) {
      return this.parseList(src);
    };
    /**
     * Takes a JSON-encoded Michelson, validates it, strips away unneeded properties and optionally expands macros (See {@link ParserOptions}).
     * @param src An object containing JSON-encoded Michelson, usually returned by `JSON.parse()`
     */


    Parser.prototype.parseJSON = function (src) {
      var e_1, _a, e_2, _b, e_3, _c; // tslint:disable-next-line: strict-type-predicates


      if (typeof src !== "object") {
        throw new TypeError("object type was expected, got " + typeof src + " instead");
      }

      if (Array.isArray(src)) {
        var ret = [];

        try {
          for (var src_1 = __values(src), src_1_1 = src_1.next(); !src_1_1.done; src_1_1 = src_1.next()) {
            var n = src_1_1.value;

            if (n === null || typeof n !== 'object') {
              throw new JSONParseError(n, "unexpected sequence element: " + n);
            }

            ret.push(this.parseJSON(n));
          }
        } catch (e_1_1) {
          e_1 = {
            error: e_1_1
          };
        } finally {
          try {
            if (src_1_1 && !src_1_1.done && (_a = src_1.return)) _a.call(src_1);
          } finally {
            if (e_1) throw e_1.error;
          }
        }

        return ret;
      } else if ('prim' in src) {
        var p = src;

        if (typeof p.prim === 'string' && (p.annots === undefined || Array.isArray(p.annots)) && (p.args === undefined || Array.isArray(p.args))) {
          var ret = {
            prim: p.prim
          };

          if (p.annots !== undefined) {
            try {
              for (var _d = __values(p.annots), _e = _d.next(); !_e.done; _e = _d.next()) {
                var a = _e.value;

                if (typeof a !== 'string') {
                  throw new JSONParseError(a, "string expected: " + a);
                }
              }
            } catch (e_2_1) {
              e_2 = {
                error: e_2_1
              };
            } finally {
              try {
                if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
              } finally {
                if (e_2) throw e_2.error;
              }
            }

            ret.annots = p.annots;
          }

          if (p.args !== undefined) {
            ret.args = [];

            try {
              for (var _f = __values(p.args), _g = _f.next(); !_g.done; _g = _f.next()) {
                var a = _g.value;

                if (a === null || typeof a !== 'object') {
                  throw new JSONParseError(a, "unexpected argument: " + a);
                }

                ret.args.push(this.parseJSON(a));
              }
            } catch (e_3_1) {
              e_3 = {
                error: e_3_1
              };
            } finally {
              try {
                if (_g && !_g.done && (_c = _f.return)) _c.call(_f);
              } finally {
                if (e_3) throw e_3.error;
              }
            }
          }

          return this.expand(ret);
        }

        throw new JSONParseError(src, "malformed prim expression: " + src);
      } else if ('string' in src) {
        if (typeof src.string === 'string') {
          return {
            string: src.string
          };
        }

        throw new JSONParseError(src, "malformed string literal: " + src);
      } else if ('int' in src) {
        if (typeof src.int === 'string' && intRe.test(src.int)) {
          return {
            int: src.int
          };
        }

        throw new JSONParseError(src, "malformed int literal: " + src);
      } else if ('bytes' in src) {
        if (typeof src.bytes === 'string' && bytesRe.test(src.bytes)) {
          return {
            bytes: src.bytes
          };
        }

        throw new JSONParseError(src, "malformed bytes literal: " + src);
      } else {
        throw new JSONParseError(src, "unexpected object: " + src);
      }
    };

    return Parser;
  }();

  /** @class */
  (function () {
    function Formatter(opt, lev) {
      if (lev === void 0) {
        lev = 0;
      }

      this.opt = opt;
      this.lev = lev;
    }

    Formatter.prototype.indent = function (n) {
      var _a;

      if (n === void 0) {
        n = 0;
      }

      var ret = "";

      if (((_a = this.opt) === null || _a === void 0 ? void 0 : _a.indent) !== undefined) {
        for (var i = this.lev + n; i > 0; i--) {
          ret += this.opt.indent;
        }
      }

      return ret;
    };

    Object.defineProperty(Formatter.prototype, "lf", {
      get: function () {
        var _a;

        return ((_a = this.opt) === null || _a === void 0 ? void 0 : _a.newline) || "";
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Formatter.prototype, "lfsp", {
      get: function () {
        var _a;

        return ((_a = this.opt) === null || _a === void 0 ? void 0 : _a.newline) || " ";
      },
      enumerable: false,
      configurable: true
    });

    Formatter.prototype.down = function (n) {
      return new Formatter(this.opt, this.lev + n);
    };

    return Formatter;
  })();

  var H = [0x6a09e667 | 0, 0xbb67ae85 | 0, 0x3c6ef372 | 0, 0xa54ff53a | 0, 0x510e527f | 0, 0x9b05688c | 0, 0x1f83d9ab | 0, 0x5be0cd19 | 0];
  var K = [0x428a2f98 | 0, 0x71374491 | 0, 0xb5c0fbcf | 0, 0xe9b5dba5 | 0, 0x3956c25b | 0, 0x59f111f1 | 0, 0x923f82a4 | 0, 0xab1c5ed5 | 0, 0xd807aa98 | 0, 0x12835b01 | 0, 0x243185be | 0, 0x550c7dc3 | 0, 0x72be5d74 | 0, 0x80deb1fe | 0, 0x9bdc06a7 | 0, 0xc19bf174 | 0, 0xe49b69c1 | 0, 0xefbe4786 | 0, 0x0fc19dc6 | 0, 0x240ca1cc | 0, 0x2de92c6f | 0, 0x4a7484aa | 0, 0x5cb0a9dc | 0, 0x76f988da | 0, 0x983e5152 | 0, 0xa831c66d | 0, 0xb00327c8 | 0, 0xbf597fc7 | 0, 0xc6e00bf3 | 0, 0xd5a79147 | 0, 0x06ca6351 | 0, 0x14292967 | 0, 0x27b70a85 | 0, 0x2e1b2138 | 0, 0x4d2c6dfc | 0, 0x53380d13 | 0, 0x650a7354 | 0, 0x766a0abb | 0, 0x81c2c92e | 0, 0x92722c85 | 0, 0xa2bfe8a1 | 0, 0xa81a664b | 0, 0xc24b8b70 | 0, 0xc76c51a3 | 0, 0xd192e819 | 0, 0xd6990624 | 0, 0xf40e3585 | 0, 0x106aa070 | 0, 0x19a4c116 | 0, 0x1e376c08 | 0, 0x2748774c | 0, 0x34b0bcb5 | 0, 0x391c0cb3 | 0, 0x4ed8aa4a | 0, 0x5b9cca4f | 0, 0x682e6ff3 | 0, 0x748f82ee | 0, 0x78a5636f | 0, 0x84c87814 | 0, 0x8cc70208 | 0, 0x90befffa | 0, 0xa4506ceb | 0, 0xbef9a3f7 | 0, 0xc67178f2 | 0]; // https://tools.ietf.org/html/rfc6234

  function sha256(msg) {
    var e_1, _a; // pad the message


    var r = (msg.length + 9) % 64;
    var pad = r === 0 ? 0 : 64 - r;

    if (msg.length > 268435455) {
      throw new Error("sha256: message length is too big: " + msg.length);
    }

    var l = msg.length << 3;

    var buffer = __spreadArray(__spreadArray(__spreadArray(__spreadArray([], __read(msg)), [0x80]), __read(new Array(pad).fill(0))), [0, 0, 0, 0, l >> 24 & 0xff, l >> 16 & 0xff, l >> 8 & 0xff, l & 0xff]);

    function ror(x, n) {
      return x >>> n | x << 32 - n;
    }

    var h = __spreadArray([], __read(H));

    var w = new Array(64);
    var v = new Array(8);

    for (var offset = 0; offset < buffer.length; offset += 64) {
      var q = offset;
      var i = 0;

      while (i < 16) {
        w[i] = buffer[q] << 24 | buffer[q + 1] << 16 | buffer[q + 2] << 8 | buffer[q + 3];
        q += 4;
        i++;
      }

      while (i < 64) {
        var s0 = ror(w[i - 15], 7) ^ ror(w[i - 15], 18) ^ w[i - 15] >>> 3;
        var s1 = ror(w[i - 2], 17) ^ ror(w[i - 2], 19) ^ w[i - 2] >>> 10;
        w[i] = (s1 | 0) + w[i - 7] + s0 + w[i - 16] | 0;
        i++;
      }

      for (var i_1 = 0; i_1 < 8; i_1++) {
        v[i_1] = h[i_1];
      }

      for (var i_2 = 0; i_2 < 64; i_2++) {
        var b0 = ror(v[0], 2) ^ ror(v[0], 13) ^ ror(v[0], 22);
        var b1 = ror(v[4], 6) ^ ror(v[4], 11) ^ ror(v[4], 25);
        var t1 = v[7] + b1 + (v[4] & v[5] ^ ~v[4] & v[6]) + K[i_2] + w[i_2] | 0;
        var t2 = b0 + (v[0] & v[1] ^ v[0] & v[2] ^ v[1] & v[2]) | 0;
        v[7] = v[6];
        v[6] = v[5];
        v[5] = v[4];
        v[4] = v[3] + t1 | 0;
        v[3] = v[2];
        v[2] = v[1];
        v[1] = v[0];
        v[0] = t1 + t2 | 0;
      }

      for (var i_3 = 0; i_3 < 8; i_3++) {
        h[i_3] = h[i_3] + v[i_3] | 0;
      }
    }

    var digest = [];

    try {
      for (var h_1 = __values(h), h_1_1 = h_1.next(); !h_1_1.done; h_1_1 = h_1.next()) {
        var v_1 = h_1_1.value;
        digest.push(v_1 >> 24 & 0xff);
        digest.push(v_1 >> 16 & 0xff);
        digest.push(v_1 >> 8 & 0xff);
        digest.push(v_1 & 0xff);
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (h_1_1 && !h_1_1.done && (_a = h_1.return)) _a.call(h_1);
      } finally {
        if (e_1) throw e_1.error;
      }
    }

    return digest;
  }

  var base58alphabetFwd = [0, 1, 2, 3, 4, 5, 6, 7, 8, -1, -1, -1, -1, -1, -1, -1, 9, 10, 11, 12, 13, 14, 15, 16, -1, 17, 18, 19, 20, 21, -1, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, -1, -1, -1, -1, -1, -1, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, -1, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57];

  function byteAt(src, i) {
    var c = src.charCodeAt(i) - 49;

    if (c >= base58alphabetFwd.length || base58alphabetFwd[c] === -1) {
      throw new Error("Base58 decoding error: unexpected character at position " + i + ": " + src[i]);
    }

    return base58alphabetFwd[c];
  }

  function decodeBase58(src) {
    var acc = [];
    var i = 0; // count and skip leading zeros

    while (i < src.length && byteAt(src, i) === 0) {
      i++;
    }

    var zeros = i;

    while (i < src.length) {
      var carry = byteAt(src, i++);
      /*
      for every symbol x
      acc = acc * 58 + x
      where acc is a little endian arbitrary length integer
      */

      var ii = 0;

      while (carry !== 0 || ii < acc.length) {
        var m = (acc[ii] || 0) * 58 + carry;
        acc[ii++] = m % 256;
        carry = Math.floor(m / 256);
      }
    }

    while (zeros-- > 0) {
      acc.push(0);
    }

    return acc.reverse();
  }

  function decodeBase58Check(src) {
    var buffer = decodeBase58(src);

    if (buffer.length < 4) {
      throw new Error("Base58Check decoding error: data is too short " + buffer.length);
    }

    var data = buffer.slice(0, buffer.length - 4);
    var sum = buffer.slice(buffer.length - 4);
    var computed = sha256(sha256(data));

    if (sum[0] !== computed[0] || sum[1] !== computed[1] || sum[2] !== computed[2] || sum[3] !== computed[3]) {
      throw new Error("Base58Check decoding error: invalid checksum");
    }

    return data;
  }

  var MichelsonError =
  /** @class */
  function (_super) {
    __extends(MichelsonError, _super);
    /**
     * @param val Value of a AST node caused the error
     * @param path Path to a node caused the error
     * @param message An error message
     */


    function MichelsonError(val, message) {
      var _this = _super.call(this, message) || this;

      _this.val = val;
      Object.setPrototypeOf(_this, MichelsonError.prototype);
      return _this;
    }

    return MichelsonError;
  }(Error);

  var MichelsonTypeError =
  /** @class */
  function (_super) {
    __extends(MichelsonTypeError, _super);
    /**
     * @param val Value of a type node caused the error
     * @param data Value of a data node caused the error
     * @param message An error message
     */


    function MichelsonTypeError(val, data, message) {
      var _this = _super.call(this, val, message) || this;

      if (data !== undefined) {
        _this.data = data;
      }

      Object.setPrototypeOf(_this, MichelsonTypeError.prototype);
      return _this;
    }

    return MichelsonTypeError;
  }(MichelsonError); // Ad hoc big integer parser


  var LongInteger =
  /** @class */
  function () {
    function LongInteger(arg) {
      this.neg = false;
      this.buf = [];

      if (arg === undefined) {
        return;
      }

      if (typeof arg === "string") {
        for (var i = 0; i < arg.length; i++) {
          var c = arg.charCodeAt(i);

          if (i === 0 && c === 0x2d) {
            this.neg = true;
          } else {
            if (c < 0x30 || c > 0x39) {
              throw new Error("unexpected character in integer constant: " + arg[i]);
            }

            this.append(c - 0x30);
          }
        }
      } else if (arg < 0) {
        this.neg = true;
        this.append(-arg);
      } else {
        this.append(arg);
      }
    }

    LongInteger.prototype.append = function (c) {
      var i = 0;

      while (c !== 0 || i < this.buf.length) {
        var m = (this.buf[i] || 0) * 10 + c;
        this.buf[i++] = m % 256;
        c = Math.floor(m / 256);
      }
    };

    LongInteger.prototype.cmp = function (arg) {
      if (this.neg !== arg.neg) {
        return (arg.neg ? 1 : 0) - (this.neg ? 1 : 0);
      } else {
        var ret = 0;

        if (this.buf.length !== arg.buf.length) {
          ret = this.buf.length < arg.buf.length ? -1 : 1;
        } else if (this.buf.length !== 0) {
          var i = arg.buf.length - 1;

          while (i >= 0 && this.buf[i] === arg.buf[i]) {
            i--;
          }

          ret = i < 0 ? 0 : this.buf[i] < arg.buf[i] ? -1 : 1;
        }

        return !this.neg ? ret : ret === 0 ? 0 : -ret;
      }
    };

    Object.defineProperty(LongInteger.prototype, "sign", {
      get: function () {
        return this.buf.length === 0 ? 0 : this.neg ? -1 : 1;
      },
      enumerable: false,
      configurable: true
    });
    return LongInteger;
  }();

  function parseBytes(s) {
    var ret = [];

    for (var i = 0; i < s.length; i += 2) {
      var x = parseInt(s.slice(i, i + 2), 16);

      if (Number.isNaN(x)) {
        return null;
      }

      ret.push(x);
    }

    return ret;
  }

  function compareBytes(a, b) {
    if (a.length !== b.length) {
      return a.length < b.length ? -1 : 1;
    } else if (a.length !== 0) {
      var i = 0;

      while (i < a.length && a[i] === b[i]) {
        i++;
      }

      return i === a.length ? 0 : a[i] < b[i] ? -1 : 1;
    } else {
      return 0;
    }
  }

  function isDecimal(x) {
    try {
      // tslint:disable-next-line: no-unused-expression
      new LongInteger(x);
      return true;
    } catch (_a) {
      return false;
    }
  }

  function isNatural(x) {
    try {
      return new LongInteger(x).sign >= 0;
    } catch (_a) {
      return false;
    }
  }

  var annRe = /^(@%|@%%|%@|[@:%]([_0-9a-zA-Z][_0-9a-zA-Z\.%@]*)?)$/;

  function unpackAnnotations(p, opt) {
    var e_1, _a;

    if (Array.isArray(p)) {
      return {};
    }

    var field;
    var type;
    var vars;

    if (p.annots !== undefined) {
      try {
        for (var _b = __values(p.annots), _c = _b.next(); !_c.done; _c = _b.next()) {
          var v = _c.value;

          if (v.length !== 0) {
            if (!annRe.test(v) || !(opt === null || opt === void 0 ? void 0 : opt.specialVar) && (v === "@%" || v === "@%%") || !(opt === null || opt === void 0 ? void 0 : opt.specialFields) && v === "%@") {
              throw new MichelsonError(p, p.prim + ": unexpected annotation: " + v);
            }

            switch (v[0]) {
              case "%":
                if ((opt === null || opt === void 0 ? void 0 : opt.emptyFields) || v.length > 1) {
                  field = field || [];
                  field.push(v);
                }

                break;

              case ":":
                if (v.length > 1) {
                  type = type || [];
                  type.push(v);
                }

                break;

              case "@":
                if ((opt === null || opt === void 0 ? void 0 : opt.emptyVar) || v.length > 1) {
                  vars = vars || [];
                  vars.push(v);
                }

                break;
            }
          }
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    }

    return {
      f: field,
      t: type,
      v: vars
    };
  }

  var tezosPrefix = {
    BlockHash: [32, [1, 52]],
    OperationHash: [32, [5, 116]],
    OperationListHash: [32, [133, 233]],
    OperationListListHash: [32, [29, 159, 109]],
    ProtocolHash: [32, [2, 170]],
    ContextHash: [32, [79, 199]],
    ED25519PublicKeyHash: [20, [6, 161, 159]],
    SECP256K1PublicKeyHash: [20, [6, 161, 161]],
    P256PublicKeyHash: [20, [6, 161, 164]],
    ContractHash: [20, [2, 90, 121]],
    CryptoboxPublicKeyHash: [16, [153, 103]],
    ED25519Seed: [32, [13, 15, 58, 7]],
    ED25519PublicKey: [32, [13, 15, 37, 217]],
    SECP256K1SecretKey: [32, [17, 162, 224, 201]],
    P256SecretKey: [32, [16, 81, 238, 189]],
    ED25519EncryptedSeed: [56, [7, 90, 60, 179, 41]],
    SECP256K1EncryptedSecretKey: [56, [9, 237, 241, 174, 150]],
    P256EncryptedSecretKey: [56, [9, 48, 57, 115, 171]],
    SECP256K1PublicKey: [33, [3, 254, 226, 86]],
    P256PublicKey: [33, [3, 178, 139, 127]],
    SECP256K1Scalar: [33, [38, 248, 136]],
    SECP256K1Element: [33, [5, 92, 0]],
    ED25519SecretKey: [64, [43, 246, 78, 7]],
    ED25519Signature: [64, [9, 245, 205, 134, 18]],
    SECP256K1Signature: [64, [13, 115, 101, 19, 63]],
    P256Signature: [64, [54, 240, 44, 52]],
    GenericSignature: [64, [4, 130, 43]],
    ChainID: [4, [87, 82, 0]]
  };

  function checkDecodeTezosID(id) {
    var e_2, _a;

    var types = [];

    for (var _i = 1; _i < arguments.length; _i++) {
      types[_i - 1] = arguments[_i];
    }

    var buf = decodeBase58Check(id);

    try {
      for (var types_1 = __values(types), types_1_1 = types_1.next(); !types_1_1.done; types_1_1 = types_1.next()) {
        var t = types_1_1.value;

        var _b = __read(tezosPrefix[t], 2),
            plen = _b[0],
            p = _b[1];

        if (buf.length === plen + p.length) {
          var i = 0;

          while (i < p.length && buf[i] === p[i]) {
            i++;
          }

          if (i === p.length) {
            return [t, buf.slice(p.length)];
          }
        }
      }
    } catch (e_2_1) {
      e_2 = {
        error: e_2_1
      };
    } finally {
      try {
        if (types_1_1 && !types_1_1.done && (_a = types_1.return)) _a.call(types_1);
      } finally {
        if (e_2) throw e_2.error;
      }
    }

    return null;
  }

  function unpackComb(id, v) {
    var vv = v;
    var args = Array.isArray(vv) ? vv : vv.args;

    if (args.length === 2) {
      // it's a way to make a union of two interfaces not an interface with two independent properties of union types
      var ret = id === "pair" ? {
        prim: "pair",
        args: args
      } : {
        prim: "Pair",
        args: args
      };
      return ret;
    }

    return __assign(__assign({}, Array.isArray(vv) ? {
      prim: id
    } : vv), {
      args: [args[0], {
        prim: id,
        args: args.slice(1)
      }]
    });
  }

  function isPairType(t) {
    return Array.isArray(t) || t.prim === "pair";
  }

  function isPairData(d) {
    return Array.isArray(d) || "prim" in d && d.prim === "Pair";
  }

  var rfc3339Re = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])[T ]([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]|60)(\.[0-9]+)?(Z|[+-]([01][0-9]|2[0-3]):([0-5][0-9]))$/;

  function parseDate(a) {
    if ("string" in a) {
      if (isNatural(a.string)) {
        return new Date(parseInt(a.string, 10));
      } else if (rfc3339Re.test(a.string)) {
        var x = new Date(a.string);

        if (!Number.isNaN(x.valueOf)) {
          return x;
        }
      }
    } else if (isNatural(a.int)) {
      return new Date(parseInt(a.int, 10));
    }

    return null;
  }

  function parseHex(s) {
    var res = [];

    for (var i = 0; i < s.length; i += 2) {
      var ss = s.slice(i, i + 2);
      var x = parseInt(ss, 16);

      if (Number.isNaN(x)) {
        throw new Error("can't parse hex byte: " + ss);
      }

      res.push(x);
    }

    return res;
  }

  function hexBytes(bytes) {
    return bytes.map(function (x) {
      return (x >> 4 & 0xf).toString(16) + (x & 0xf).toString(16);
    }).join("");
  } // Michelson validator


  var noArgInstructionIDs = {
    "ABS": true,
    "ADD": true,
    "ADDRESS": true,
    "AMOUNT": true,
    "AND": true,
    "APPLY": true,
    "BALANCE": true,
    "BLAKE2B": true,
    "CAR": true,
    "CDR": true,
    "CHAIN_ID": true,
    "CHECK_SIGNATURE": true,
    "COMPARE": true,
    "CONCAT": true,
    "CONS": true,
    "EDIV": true,
    "EQ": true,
    "EXEC": true,
    "FAILWITH": true,
    "GE": true,
    "GET_AND_UPDATE": true,
    "GT": true,
    "HASH_KEY": true,
    "IMPLICIT_ACCOUNT": true,
    "INT": true,
    "ISNAT": true,
    "JOIN_TICKETS": true,
    "KECCAK": true,
    "LE": true,
    "LEVEL": true,
    "LSL": true,
    "LSR": true,
    "LT": true,
    "MEM": true,
    "MUL": true,
    "NEG": true,
    "NEQ": true,
    "NEVER": true,
    "NOT": true,
    "NOW": true,
    "OR": true,
    "PACK": true,
    "PAIRING_CHECK": true,
    "READ_TICKET": true,
    "SAPLING_VERIFY_UPDATE": true,
    "SELF": true,
    "SELF_ADDRESS": true,
    "SENDER": true,
    "SET_DELEGATE": true,
    "SHA256": true,
    "SHA3": true,
    "SHA512": true,
    "SIZE": true,
    "SLICE": true,
    "SOME": true,
    "SOURCE": true,
    "SPLIT_TICKET": true,
    "SUB": true,
    "SWAP": true,
    "TICKET": true,
    "TOTAL_VOTING_POWER": true,
    "TRANSFER_TOKENS": true,
    "UNIT": true,
    "VOTING_POWER": true,
    "XOR": true,
    "RENAME": true
  };
  var instructionIDs = Object.assign({}, noArgInstructionIDs, {
    "CONTRACT": true,
    "CREATE_CONTRACT": true,
    "DIG": true,
    "DIP": true,
    "DROP": true,
    "DUG": true,
    "DUP": true,
    "EMPTY_BIG_MAP": true,
    "EMPTY_MAP": true,
    "EMPTY_SET": true,
    "GET": true,
    "IF": true,
    "IF_CONS": true,
    "IF_LEFT": true,
    "IF_NONE": true,
    "ITER": true,
    "LAMBDA": true,
    "LEFT": true,
    "LOOP": true,
    "LOOP_LEFT": true,
    "MAP": true,
    "NIL": true,
    "NONE": true,
    "PAIR": true,
    "PUSH": true,
    "RIGHT": true,
    "SAPLING_EMPTY_STATE": true,
    "UNPACK": true,
    "UNPAIR": true,
    "UPDATE": true,
    "CAST": true
  });
  var simpleComparableTypeIDs = {
    "unit": true,
    "never": true,
    "bool": true,
    "int": true,
    "nat": true,
    "string": true,
    "chain_id": true,
    "bytes": true,
    "mutez": true,
    "key_hash": true,
    "key": true,
    "signature": true,
    "timestamp": true,
    "address": true
  };
  var typeIDs = Object.assign({}, simpleComparableTypeIDs, {
    "or": true,
    "pair": true,
    "set": true,
    "big_map": true,
    "contract": true,
    "lambda": true,
    "list": true,
    "map": true,
    "operation": true,
    "option": true,
    "bls12_381_g1": true,
    "bls12_381_g2": true,
    "bls12_381_fr": true,
    "sapling_transaction": true,
    "sapling_state": true,
    "ticket": true
  });

  var MichelsonValidationError =
  /** @class */
  function (_super) {
    __extends(MichelsonValidationError, _super);
    /**
     * @param val Value of a node caused the error
     * @param message An error message
     */


    function MichelsonValidationError(val, message) {
      var _this = _super.call(this, val, message) || this;

      _this.val = val;
      Object.setPrototypeOf(_this, MichelsonValidationError.prototype);
      return _this;
    }

    return MichelsonValidationError;
  }(MichelsonError);

  function isPrim(ex) {
    return "prim" in ex;
  }

  function isPrimOrSeq(ex) {
    return Array.isArray(ex) || "prim" in ex;
  }

  function assertPrim(ex) {
    if (isPrim(ex)) {
      return true;
    }

    throw new MichelsonValidationError(ex, "prim expression expected");
  }

  function assertSeq(ex) {
    if (Array.isArray(ex)) {
      return true;
    }

    throw new MichelsonValidationError(ex, "sequence expression expected");
  }

  function assertPrimOrSeq(ex) {
    if (isPrimOrSeq(ex)) {
      return true;
    }

    throw new MichelsonValidationError(ex, "prim or sequence expression expected");
  }

  function assertNatural(i) {
    if (i.int[0] === "-") {
      throw new MichelsonValidationError(i, "natural number expected");
    }
  }

  function assertIntLiteral(ex) {
    if ("int" in ex) {
      return true;
    }

    throw new MichelsonValidationError(ex, "int literal expected");
  }

  function assertArgs(ex, n) {
    var _a;

    if (n === 0 && ex.args === undefined || ((_a = ex.args) === null || _a === void 0 ? void 0 : _a.length) === n) {
      return true;
    }

    throw new MichelsonValidationError(ex, n + " arguments expected");
  }
  /**
   * Checks if the node is a valid Michelson code (sequence of instructions).
   * This is a type guard function which either returns true of throws an exception.
   * @param ex An AST node
   */


  function assertMichelsonInstruction(ex) {
    var e_1, _a;

    var _b, _c;

    if (Array.isArray(ex)) {
      try {
        for (var ex_1 = __values(ex), ex_1_1 = ex_1.next(); !ex_1_1.done; ex_1_1 = ex_1.next()) {
          var n = ex_1_1.value;

          if (!Array.isArray(n) && !isPrim(n)) {
            throw new MichelsonValidationError(ex, "sequence or prim expected");
          }

          assertMichelsonInstruction(n);
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (ex_1_1 && !ex_1_1.done && (_a = ex_1.return)) _a.call(ex_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }

      return true;
    }

    if (assertPrim(ex)) {
      if (Object.prototype.hasOwnProperty.call(noArgInstructionIDs, ex.prim)) {
        assertArgs(ex, 0);
        return true;
      }

      switch (ex.prim) {
        case "DROP":
        case "PAIR":
        case "UNPAIR":
        case "DUP":
        case "UPDATE":
        case "GET":
          if (ex.args !== undefined && assertArgs(ex, 1)) {
            /* istanbul ignore else */
            if (assertIntLiteral(ex.args[0])) {
              assertNatural(ex.args[0]);
            }
          }

          break;

        case "DIG":
        case "DUG":
        case "SAPLING_EMPTY_STATE":
          /* istanbul ignore else */
          if (assertArgs(ex, 1)) {
            /* istanbul ignore else */
            if (assertIntLiteral(ex.args[0])) {
              assertNatural(ex.args[0]);
            }
          }

          break;

        case "NONE":
        case "LEFT":
        case "RIGHT":
        case "NIL":
        case "CAST":
          /* istanbul ignore else */
          if (assertArgs(ex, 1)) {
            assertMichelsonType(ex.args[0]);
          }

          break;

        case "UNPACK":
          /* istanbul ignore else */
          if (assertArgs(ex, 1)) {
            assertMichelsonPackableType(ex.args[0]);
          }

          break;

        case "CONTRACT":
          /* istanbul ignore else */
          if (assertArgs(ex, 1)) {
            assertMichelsonPassableType(ex.args[0]);
          }

          break;

        case "IF_NONE":
        case "IF_LEFT":
        case "IF_CONS":
        case "IF":
          /* istanbul ignore else */
          if (assertArgs(ex, 2)) {
            /* istanbul ignore else */
            if (assertSeq(ex.args[0])) {
              assertMichelsonInstruction(ex.args[0]);
            }
            /* istanbul ignore else */


            if (assertSeq(ex.args[1])) {
              assertMichelsonInstruction(ex.args[1]);
            }
          }

          break;

        case "MAP":
        case "ITER":
        case "LOOP":
        case "LOOP_LEFT":
          /* istanbul ignore else */
          if (assertArgs(ex, 1)) {
            assertMichelsonInstruction(ex.args[0]);
          }

          break;

        case "CREATE_CONTRACT":
          /* istanbul ignore else */
          if (assertArgs(ex, 1)) {
            assertMichelsonContract(ex.args[0]);
          }

          break;

        case "DIP":
          if (((_b = ex.args) === null || _b === void 0 ? void 0 : _b.length) === 2) {
            /* istanbul ignore else */
            if (assertIntLiteral(ex.args[0])) {
              assertNatural(ex.args[0]);
            }
            /* istanbul ignore else */


            if (assertSeq(ex.args[1])) {
              assertMichelsonInstruction(ex.args[1]);
            }
          } else if (((_c = ex.args) === null || _c === void 0 ? void 0 : _c.length) === 1) {
            /* istanbul ignore else */
            if (assertSeq(ex.args[0])) {
              assertMichelsonInstruction(ex.args[0]);
            }
          } else {
            throw new MichelsonValidationError(ex, "1 or 2 arguments expected");
          }

          break;

        case "PUSH":
          /* istanbul ignore else */
          if (assertArgs(ex, 2)) {
            assertMichelsonPushableType(ex.args[0]);
            assertMichelsonData(ex.args[1]);
          }

          break;

        case "EMPTY_SET":
          /* istanbul ignore else */
          if (assertArgs(ex, 1)) {
            assertMichelsonComparableType(ex.args[0]);
          }

          break;

        case "EMPTY_MAP":
          /* istanbul ignore else */
          if (assertArgs(ex, 2)) {
            assertMichelsonComparableType(ex.args[0]);
            assertMichelsonType(ex.args[1]);
          }

          break;

        case "EMPTY_BIG_MAP":
          /* istanbul ignore else */
          if (assertArgs(ex, 2)) {
            assertMichelsonComparableType(ex.args[0]);
            assertMichelsonBigMapStorableType(ex.args[1]);
          }

          break;

        case "LAMBDA":
          /* istanbul ignore else */
          if (assertArgs(ex, 3)) {
            assertMichelsonType(ex.args[0]);
            assertMichelsonType(ex.args[1]);
            /* istanbul ignore else */

            if (assertSeq(ex.args[2])) {
              assertMichelsonInstruction(ex.args[2]);
            }
          }

          break;

        default:
          throw new MichelsonValidationError(ex, "instruction expected");
      }
    }

    return true;
  }

  function assertMichelsonComparableType(ex) {
    /* istanbul ignore else */
    if (assertPrimOrSeq(ex)) {
      if (Array.isArray(ex) || ex.prim === "pair" || ex.prim === "or" || ex.prim === "option") {
        traverseType(ex, function (ex) {
          return assertMichelsonComparableType(ex);
        });
      } else if (!Object.prototype.hasOwnProperty.call(simpleComparableTypeIDs, ex.prim)) {
        throw new MichelsonValidationError(ex, ex.prim + ": type is not comparable");
      }
    }

    return true;
  }

  function assertMichelsonPackableType(ex) {
    /* istanbul ignore else */
    if (assertPrimOrSeq(ex)) {
      if (isPrim(ex)) {
        if (!Object.prototype.hasOwnProperty.call(typeIDs, ex.prim) || ex.prim === "big_map" || ex.prim === "operation" || ex.prim === "sapling_state" || ex.prim === "ticket") {
          throw new MichelsonValidationError(ex, ex.prim + ": type can't be used inside PACK/UNPACK instructions");
        }

        traverseType(ex, function (ex) {
          return assertMichelsonPackableType(ex);
        });
      }
    }

    return true;
  }

  function assertMichelsonPushableType(ex) {
    /* istanbul ignore else */
    if (assertPrimOrSeq(ex)) {
      if (isPrim(ex)) {
        if (!Object.prototype.hasOwnProperty.call(typeIDs, ex.prim) || ex.prim === "big_map" || ex.prim === "operation" || ex.prim === "sapling_state" || ex.prim === "ticket" || ex.prim === "contract") {
          throw new MichelsonValidationError(ex, ex.prim + ": type can't be pushed");
        }

        traverseType(ex, function (ex) {
          return assertMichelsonPushableType(ex);
        });
      }
    }

    return true;
  }

  function assertMichelsonStorableType(ex) {
    /* istanbul ignore else */
    if (assertPrimOrSeq(ex)) {
      if (isPrim(ex)) {
        if (!Object.prototype.hasOwnProperty.call(typeIDs, ex.prim) || ex.prim === "operation" || ex.prim === "contract") {
          throw new MichelsonValidationError(ex, ex.prim + ": type can't be used as part of a storage");
        }

        traverseType(ex, function (ex) {
          return assertMichelsonStorableType(ex);
        });
      }
    }

    return true;
  }

  function assertMichelsonPassableType(ex) {
    /* istanbul ignore else */
    if (assertPrimOrSeq(ex)) {
      if (isPrim(ex)) {
        if (!Object.prototype.hasOwnProperty.call(typeIDs, ex.prim) || ex.prim === "operation") {
          throw new MichelsonValidationError(ex, ex.prim + ": type can't be used as part of a parameter");
        }

        traverseType(ex, function (ex) {
          return assertMichelsonPassableType(ex);
        });
      }
    }

    return true;
  }

  function assertMichelsonBigMapStorableType(ex) {
    /* istanbul ignore else */
    if (assertPrimOrSeq(ex)) {
      if (isPrim(ex)) {
        if (!Object.prototype.hasOwnProperty.call(typeIDs, ex.prim) || ex.prim === "big_map" || ex.prim === "operation" || ex.prim === "sapling_state") {
          throw new MichelsonValidationError(ex, ex.prim + ": type can't be used inside a big_map");
        }

        traverseType(ex, function (ex) {
          return assertMichelsonBigMapStorableType(ex);
        });
      }
    }

    return true;
  }
  /**
   * Checks if the node is a valid Michelson type expression.
   * This is a type guard function which either returns true of throws an exception.
   * @param ex An AST node
   */


  function assertMichelsonType(ex) {
    /* istanbul ignore else */
    if (assertPrimOrSeq(ex)) {
      if (isPrim(ex)) {
        if (!Object.prototype.hasOwnProperty.call(typeIDs, ex.prim)) {
          throw new MichelsonValidationError(ex, "type expected");
        }

        traverseType(ex, function (ex) {
          return assertMichelsonType(ex);
        });
      }
    }

    return true;
  }

  function traverseType(ex, cb) {
    if (Array.isArray(ex) || ex.prim === "pair") {
      var args = Array.isArray(ex) ? ex : ex.args;

      if (args === undefined || args.length < 2) {
        throw new MichelsonValidationError(ex, "at least 2 arguments expected");
      }

      args.forEach(function (a) {
        if (assertPrimOrSeq(a)) {
          cb(a);
        }
      });
      return true;
    }

    switch (ex.prim) {
      case "option":
      case "list":
        /* istanbul ignore else */
        if (assertArgs(ex, 1) && assertPrimOrSeq(ex.args[0])) {
          cb(ex.args[0]);
        }

        break;

      case "contract":
        /* istanbul ignore else */
        if (assertArgs(ex, 1)) {
          assertMichelsonPassableType(ex.args[0]);
        }

        break;

      case "or":
        /* istanbul ignore else */
        if (assertArgs(ex, 2) && assertPrimOrSeq(ex.args[0]) && assertPrimOrSeq(ex.args[1])) {
          cb(ex.args[0]);
          cb(ex.args[1]);
        }

        break;

      case "lambda":
        /* istanbul ignore else */
        if (assertArgs(ex, 2)) {
          assertMichelsonType(ex.args[0]);
          assertMichelsonType(ex.args[1]);
        }

        break;

      case "set":
        /* istanbul ignore else */
        if (assertArgs(ex, 1)) {
          assertMichelsonComparableType(ex.args[0]);
        }

        break;

      case "map":
        /* istanbul ignore else */
        if (assertArgs(ex, 2) && assertPrimOrSeq(ex.args[0]) && assertPrimOrSeq(ex.args[1])) {
          assertMichelsonComparableType(ex.args[0]);
          cb(ex.args[1]);
        }

        break;

      case "big_map":
        /* istanbul ignore else */
        if (assertArgs(ex, 2) && assertPrimOrSeq(ex.args[0]) && assertPrimOrSeq(ex.args[1])) {
          assertMichelsonComparableType(ex.args[0]);
          assertMichelsonBigMapStorableType(ex.args[1]);
          cb(ex.args[1]);
        }

        break;

      case "ticket":
        /* istanbul ignore else */
        if (assertArgs(ex, 1) && assertPrimOrSeq(ex.args[0])) {
          assertMichelsonComparableType(ex.args[0]);
        }

        break;

      case "sapling_state":
      case "sapling_transaction":
        if (assertArgs(ex, 1)) {
          assertIntLiteral(ex.args[0]);
        }

        break;

      default:
        assertArgs(ex, 0);
    }

    return true;
  }
  /**
   * Checks if the node is a valid Michelson data literal such as `(Pair {Elt "0" 0} 0)`.
   * This is a type guard function which either returns true of throws an exception.
   * @param ex An AST node
   */


  function assertMichelsonData(ex) {
    var e_2, _a, e_3, _b;

    if ("int" in ex || "string" in ex || "bytes" in ex) {
      return true;
    }

    if (Array.isArray(ex)) {
      var mapElts = 0;

      try {
        for (var ex_2 = __values(ex), ex_2_1 = ex_2.next(); !ex_2_1.done; ex_2_1 = ex_2.next()) {
          var n = ex_2_1.value;

          if (isPrim(n) && n.prim === "Elt") {
            /* istanbul ignore else */
            if (assertArgs(n, 2)) {
              assertMichelsonData(n.args[0]);
              assertMichelsonData(n.args[1]);
            }

            mapElts++;
          } else {
            assertMichelsonData(n);
          }
        }
      } catch (e_2_1) {
        e_2 = {
          error: e_2_1
        };
      } finally {
        try {
          if (ex_2_1 && !ex_2_1.done && (_a = ex_2.return)) _a.call(ex_2);
        } finally {
          if (e_2) throw e_2.error;
        }
      }

      if (mapElts !== 0 && mapElts !== ex.length) {
        throw new MichelsonValidationError(ex, "data entries and map elements can't be intermixed");
      }

      return true;
    }

    if (isPrim(ex)) {
      switch (ex.prim) {
        case "Unit":
        case "True":
        case "False":
        case "None":
          assertArgs(ex, 0);
          break;

        case "Pair":
          /* istanbul ignore else */
          if (ex.args === undefined || ex.args.length < 2) {
            throw new MichelsonValidationError(ex, "at least 2 arguments expected");
          }

          try {
            for (var _c = __values(ex.args), _d = _c.next(); !_d.done; _d = _c.next()) {
              var a = _d.value;
              assertMichelsonData(a);
            }
          } catch (e_3_1) {
            e_3 = {
              error: e_3_1
            };
          } finally {
            try {
              if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
            } finally {
              if (e_3) throw e_3.error;
            }
          }

          break;

        case "Left":
        case "Right":
        case "Some":
          /* istanbul ignore else */
          if (assertArgs(ex, 1)) {
            assertMichelsonData(ex.args[0]);
          }

          break;

        default:
          if (Object.prototype.hasOwnProperty.call(instructionIDs, ex.prim)) {
            assertMichelsonInstruction(ex);
          } else {
            throw new MichelsonValidationError(ex, "data entry or instruction expected");
          }

      }
    } else {
      throw new MichelsonValidationError(ex, "data entry expected");
    }

    return true;
  }
  /**
   * Checks if the node is a valid Michelson smart contract source containing all required and valid properties such as `parameter`, `storage` and `code`.
   * This is a type guard function which either returns true of throws an exception.
   * @param ex An AST node
   */


  function assertMichelsonContract(ex) {
    var e_4, _a;
    /* istanbul ignore else */


    if (assertSeq(ex)) {
      var ent = {};

      try {
        for (var ex_3 = __values(ex), ex_3_1 = ex_3.next(); !ex_3_1.done; ex_3_1 = ex_3.next()) {
          var sec = ex_3_1.value;

          if (assertPrim(sec)) {
            if (sec.prim !== "code" && sec.prim !== "parameter" && sec.prim !== "storage") {
              throw new MichelsonValidationError(ex, "unexpected contract section: " + sec.prim);
            }

            if (sec.prim in ent) {
              throw new MichelsonValidationError(ex, "duplicate contract section: " + sec.prim);
            }

            ent[sec.prim] = true;
            /* istanbul ignore else */

            if (assertArgs(sec, 1)) {
              switch (sec.prim) {
                case "code":
                  /* istanbul ignore else */
                  if (assertSeq(sec.args[0])) {
                    assertMichelsonInstruction(sec.args[0]);
                  }

                  break;

                case "parameter":
                  assertMichelsonPassableType(sec.args[0]);
                  break;

                case "storage":
                  assertMichelsonStorableType(sec.args[0]);
              }
            }
          }
        }
      } catch (e_4_1) {
        e_4 = {
          error: e_4_1
        };
      } finally {
        try {
          if (ex_3_1 && !ex_3_1.done && (_a = ex_3.return)) _a.call(ex_3);
        } finally {
          if (e_4) throw e_4.error;
        }
      }
    }

    return true;
  }

  function isInstruction(p) {
    return Object.prototype.hasOwnProperty.call(instructionIDs, p.prim);
  }

  function assertDataListIfAny(d) {
    var e_5, _a;

    if (!Array.isArray(d)) {
      return false;
    }

    try {
      for (var d_1 = __values(d), d_1_1 = d_1.next(); !d_1_1.done; d_1_1 = d_1.next()) {
        var v = d_1_1.value;

        if ("prim" in v) {
          if (isInstruction(v)) {
            throw new MichelsonError(d, "Instruction outside of a lambda: " + JSON.stringify(d));
          } else if (v.prim === "Elt") {
            throw new MichelsonError(d, "Elt item outside of a map literal: " + JSON.stringify(d));
          }
        }
      }
    } catch (e_5_1) {
      e_5 = {
        error: e_5_1
      };
    } finally {
      try {
        if (d_1_1 && !d_1_1.done && (_a = d_1.return)) _a.call(d_1);
      } finally {
        if (e_5) throw e_5.error;
      }
    }

    return true;
  }

  var primitives = ["parameter", "storage", "code", "False", "Elt", "Left", "None", "Pair", "Right", "Some", "True", "Unit", "PACK", "UNPACK", "BLAKE2B", "SHA256", "SHA512", "ABS", "ADD", "AMOUNT", "AND", "BALANCE", "CAR", "CDR", "CHECK_SIGNATURE", "COMPARE", "CONCAT", "CONS", "CREATE_ACCOUNT", "CREATE_CONTRACT", "IMPLICIT_ACCOUNT", "DIP", "DROP", "DUP", "EDIV", "EMPTY_MAP", "EMPTY_SET", "EQ", "EXEC", "FAILWITH", "GE", "GET", "GT", "HASH_KEY", "IF", "IF_CONS", "IF_LEFT", "IF_NONE", "INT", "LAMBDA", "LE", "LEFT", "LOOP", "LSL", "LSR", "LT", "MAP", "MEM", "MUL", "NEG", "NEQ", "NIL", "NONE", "NOT", "NOW", "OR", "PAIR", "PUSH", "RIGHT", "SIZE", "SOME", "SOURCE", "SENDER", "SELF", "STEPS_TO_QUOTA", "SUB", "SWAP", "TRANSFER_TOKENS", "SET_DELEGATE", "UNIT", "UPDATE", "XOR", "ITER", "LOOP_LEFT", "ADDRESS", "CONTRACT", "ISNAT", "CAST", "RENAME", "bool", "contract", "int", "key", "key_hash", "lambda", "list", "map", "big_map", "nat", "option", "or", "pair", "set", "signature", "string", "bytes", "mutez", "timestamp", "unit", "operation", "address", "SLICE", "DIG", "DUG", "EMPTY_BIG_MAP", "APPLY", "chain_id", "CHAIN_ID", "LEVEL", "SELF_ADDRESS", "never", "NEVER", "UNPAIR", "VOTING_POWER", "TOTAL_VOTING_POWER", "KECCAK", "SHA3", "PAIRING_CHECK", "bls12_381_g1", "bls12_381_g2", "bls12_381_fr", "sapling_state", "sapling_transaction", "SAPLING_EMPTY_STATE", "SAPLING_VERIFY_UPDATE", "ticket", "TICKET", "READ_TICKET", "SPLIT_TICKET", "JOIN_TICKETS", "GET_AND_UPDATE"];
  var primTags = Object.assign.apply(Object, __spreadArray([{}], __read(primitives.map(function (v, i) {
    var _a;

    return _a = {}, _a[v] = i, _a;
  }))));
  var Tag;

  (function (Tag) {
    Tag[Tag["Int"] = 0] = "Int";
    Tag[Tag["String"] = 1] = "String";
    Tag[Tag["Sequence"] = 2] = "Sequence";
    Tag[Tag["Prim0"] = 3] = "Prim0";
    Tag[Tag["Prim0Annot"] = 4] = "Prim0Annot";
    Tag[Tag["Prim1"] = 5] = "Prim1";
    Tag[Tag["Prim1Annot"] = 6] = "Prim1Annot";
    Tag[Tag["Prim2"] = 7] = "Prim2";
    Tag[Tag["Prim2Annot"] = 8] = "Prim2Annot";
    Tag[Tag["Prim"] = 9] = "Prim";
    Tag[Tag["Bytes"] = 10] = "Bytes";
  })(Tag || (Tag = {}));

  var Writer =
  /** @class */
  function () {
    function Writer() {
      this.buffer = [];
    }

    Object.defineProperty(Writer.prototype, "length", {
      get: function () {
        return this.buffer.length;
      },
      enumerable: false,
      configurable: true
    });

    Writer.prototype.writeBytes = function (val) {
      var _a;

      (_a = this.buffer).push.apply(_a, __spreadArray([], __read(val.map(function (v) {
        return v & 0xff;
      }))));
    };

    Writer.prototype.writeUint8 = function (val) {
      var v = val | 0;
      this.buffer.push(v & 0xff);
    };

    Writer.prototype.writeUint16 = function (val) {
      var v = val | 0;
      this.buffer.push(v >> 8 & 0xff);
      this.buffer.push(v & 0xff);
    };

    Writer.prototype.writeUint32 = function (val) {
      var v = val | 0;
      this.buffer.push(v >> 24 & 0xff);
      this.buffer.push(v >> 16 & 0xff);
      this.buffer.push(v >> 8 & 0xff);
      this.buffer.push(v & 0xff);
    };

    Writer.prototype.writeInt8 = function (val) {
      this.writeUint8(val);
    };

    Writer.prototype.writeInt16 = function (val) {
      this.writeUint16(val);
    };

    Writer.prototype.writeInt32 = function (val) {
      this.writeUint32(val);
    };

    return Writer;
  }();

  var boundsErr = new Error("bounds out of range");

  var Reader =
  /** @class */
  function () {
    function Reader(buffer, idx, cap) {
      if (idx === void 0) {
        idx = 0;
      }

      if (cap === void 0) {
        cap = buffer.length;
      }

      this.buffer = buffer;
      this.idx = idx;
      this.cap = cap;
    }

    Object.defineProperty(Reader.prototype, "length", {
      /** Remaining length */
      get: function () {
        return this.cap - this.idx;
      },
      enumerable: false,
      configurable: true
    });

    Reader.prototype.readBytes = function (len) {
      if (this.cap - this.idx < len) {
        throw boundsErr;
      }

      var ret = this.buffer.slice(this.idx, this.idx + len);
      this.idx += len;
      return ret;
    };

    Reader.prototype.reader = function (len) {
      if (this.cap - this.idx < len) {
        throw boundsErr;
      }

      var ret = new Reader(this.buffer, this.idx, this.idx + len);
      this.idx += len;
      return ret;
    };

    Reader.prototype.copy = function () {
      return new Reader(this.buffer, this.idx, this.cap);
    };

    Reader.prototype.readUint8 = function () {
      if (this.cap - this.idx < 1) {
        throw boundsErr;
      }

      return this.buffer[this.idx++] >>> 0;
    };

    Reader.prototype.readUint16 = function () {
      if (this.cap - this.idx < 2) {
        throw boundsErr;
      }

      var x0 = this.buffer[this.idx++];
      var x1 = this.buffer[this.idx++];
      return (x0 << 8 | x1) >>> 0;
    };

    Reader.prototype.readUint32 = function () {
      if (this.cap - this.idx < 4) {
        throw boundsErr;
      }

      var x0 = this.buffer[this.idx++];
      var x1 = this.buffer[this.idx++];
      var x2 = this.buffer[this.idx++];
      var x3 = this.buffer[this.idx++];
      return (x0 << 24 | x1 << 16 | x2 << 8 | x3) >>> 0;
    };

    Reader.prototype.readInt8 = function () {
      if (this.cap - this.idx < 1) {
        throw boundsErr;
      }

      var x = this.buffer[this.idx++];
      return x << 24 >> 24;
    };

    Reader.prototype.readInt16 = function () {
      if (this.cap - this.idx < 2) {
        throw boundsErr;
      }

      var x0 = this.buffer[this.idx++];
      var x1 = this.buffer[this.idx++];
      return (x0 << 8 | x1) << 16 >> 16;
    };

    Reader.prototype.readInt32 = function () {
      if (this.cap - this.idx < 4) {
        throw boundsErr;
      }

      var x0 = this.buffer[this.idx++];
      var x1 = this.buffer[this.idx++];
      var x2 = this.buffer[this.idx++];
      var x3 = this.buffer[this.idx++];
      return x0 << 24 | x1 << 16 | x2 << 8 | x3;
    };

    return Reader;
  }();

  var ContractID;

  (function (ContractID) {
    ContractID[ContractID["Implicit"] = 0] = "Implicit";
    ContractID[ContractID["Originated"] = 1] = "Originated";
  })(ContractID || (ContractID = {}));

  var PublicKeyHashID;

  (function (PublicKeyHashID) {
    PublicKeyHashID[PublicKeyHashID["ED25519"] = 0] = "ED25519";
    PublicKeyHashID[PublicKeyHashID["SECP256K1"] = 1] = "SECP256K1";
    PublicKeyHashID[PublicKeyHashID["P256"] = 2] = "P256";
  })(PublicKeyHashID || (PublicKeyHashID = {}));

  function readPublicKeyHash(rd) {
    var type;
    var tag = rd.readUint8();

    switch (tag) {
      case PublicKeyHashID.ED25519:
        type = "ED25519PublicKeyHash";
        break;

      case PublicKeyHashID.SECP256K1:
        type = "SECP256K1PublicKeyHash";
        break;

      case PublicKeyHashID.P256:
        type = "P256PublicKeyHash";
        break;

      default:
        throw new Error("unknown public key hash tag: " + tag);
    }

    return {
      type: type,
      hash: rd.readBytes(20)
    };
  }

  function readAddress(rd) {
    var address;
    var tag = rd.readUint8();

    switch (tag) {
      case ContractID.Implicit:
        address = readPublicKeyHash(rd);
        break;

      case ContractID.Originated:
        address = {
          type: "ContractHash",
          hash: rd.readBytes(20)
        };
        rd.readBytes(1);
        break;

      default:
        throw new Error("unknown address tag: " + tag);
    }

    if (rd.length !== 0) {
      // entry point
      var dec = new TextDecoder();
      address.entryPoint = dec.decode(new Uint8Array(rd.readBytes(rd.length)));
    }

    return address;
  }

  function writePublicKeyHash(a, w) {
    var tag;

    switch (a.type) {
      case "ED25519PublicKeyHash":
        tag = PublicKeyHashID.ED25519;
        break;

      case "SECP256K1PublicKeyHash":
        tag = PublicKeyHashID.SECP256K1;
        break;

      case "P256PublicKeyHash":
        tag = PublicKeyHashID.P256;
        break;

      default:
        throw new Error("unexpected address type: " + a.type);
    }

    w.writeUint8(tag);
    w.writeBytes(Array.from(a.hash));
  }

  function writeAddress(a, w) {
    if (a.type === "ContractHash") {
      w.writeUint8(ContractID.Originated);
      w.writeBytes(Array.from(a.hash));
      w.writeUint8(0);
    } else {
      w.writeUint8(ContractID.Implicit);
      writePublicKeyHash(a, w);
    }

    if (a.entryPoint !== undefined && a.entryPoint !== "" && a.entryPoint !== "default") {
      var enc = new TextEncoder();
      var bytes = enc.encode(a.entryPoint);
      w.writeBytes(Array.from(bytes));
    }
  }

  var PublicKeyID;

  (function (PublicKeyID) {
    PublicKeyID[PublicKeyID["ED25519"] = 0] = "ED25519";
    PublicKeyID[PublicKeyID["SECP256K1"] = 1] = "SECP256K1";
    PublicKeyID[PublicKeyID["P256"] = 2] = "P256";
  })(PublicKeyID || (PublicKeyID = {}));

  function readPublicKey(rd) {
    var ln;
    var type;
    var tag = rd.readUint8();

    switch (tag) {
      case PublicKeyID.ED25519:
        type = "ED25519PublicKey";
        ln = 32;
        break;

      case PublicKeyID.SECP256K1:
        type = "SECP256K1PublicKey";
        ln = 33;
        break;

      case PublicKeyID.P256:
        type = "P256PublicKey";
        ln = 33;
        break;

      default:
        throw new Error("unknown public key tag: " + tag);
    }

    return {
      type: type,
      publicKey: rd.readBytes(ln)
    };
  }

  function writePublicKey(pk, w) {
    var tag;

    switch (pk.type) {
      case "ED25519PublicKey":
        tag = PublicKeyID.ED25519;
        break;

      case "SECP256K1PublicKey":
        tag = PublicKeyID.SECP256K1;
        break;

      case "P256PublicKey":
        tag = PublicKeyID.P256;
        break;

      default:
        throw new Error("unexpected public key type: " + pk.type);
    }

    w.writeUint8(tag);
    w.writeBytes(Array.from(pk.publicKey));
  }

  function writeExpr(expr, wr, tf) {
    var e_1, _a, e_2, _b, e_3, _c;

    var _d, _e;

    var _f = __read(tf(expr), 2),
        e = _f[0],
        args = _f[1];

    if (Array.isArray(e)) {
      var w = new Writer();

      try {
        for (var e_4 = __values(e), e_4_1 = e_4.next(); !e_4_1.done; e_4_1 = e_4.next()) {
          var v = e_4_1.value;
          var a = args.next();

          if (a.done) {
            throw new Error("REPORT ME: iterator is done");
          }

          writeExpr(v, w, a.value);
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (e_4_1 && !e_4_1.done && (_a = e_4.return)) _a.call(e_4);
        } finally {
          if (e_1) throw e_1.error;
        }
      }

      wr.writeUint8(Tag.Sequence);
      wr.writeUint32(w.length);
      wr.writeBytes(w.buffer);
      return;
    }

    if ("string" in e) {
      var enc = new TextEncoder();
      var bytes = enc.encode(e.string);
      wr.writeUint8(Tag.String);
      wr.writeUint32(bytes.length);
      wr.writeBytes(Array.from(bytes));
      return;
    }

    if ("int" in e) {
      wr.writeUint8(Tag.Int);
      var val = BigInt(e.int);
      var sign = val < 0;

      if (sign) {
        val = -val;
      }

      var i = 0;

      do {
        var bits = i === 0 ? BigInt(6) : BigInt(7);
        var byte = val & (BigInt(1) << bits) - BigInt(1);
        val >>= bits;

        if (val) {
          byte |= BigInt(0x80);
        }

        if (i === 0 && sign) {
          byte |= BigInt(0x40);
        }

        wr.writeUint8(Number(byte));
        i++;
      } while (val);

      return;
    }

    if ("bytes" in e) {
      var bytes = parseHex(e.bytes);
      wr.writeUint8(Tag.Bytes);
      wr.writeUint32(bytes.length);
      wr.writeBytes(bytes);
      return;
    }

    var prim = primTags[e.prim];

    if (prim === undefined) {
      throw new TypeError("Can't encode primary: " + e.prim);
    }

    var tag = (((_d = e.args) === null || _d === void 0 ? void 0 : _d.length) || 0) < 3 ? Tag.Prim0 + (((_e = e.args) === null || _e === void 0 ? void 0 : _e.length) || 0) * 2 + (e.annots === undefined || e.annots.length === 0 ? 0 : 1) : Tag.Prim;
    wr.writeUint8(tag);
    wr.writeUint8(prim);

    if (e.args !== undefined) {
      if (e.args.length < 3) {
        try {
          for (var _g = __values(e.args), _h = _g.next(); !_h.done; _h = _g.next()) {
            var v = _h.value;
            var a = args.next();

            if (a.done) {
              throw new Error("REPORT ME: iterator is done");
            }

            writeExpr(v, wr, a.value);
          }
        } catch (e_2_1) {
          e_2 = {
            error: e_2_1
          };
        } finally {
          try {
            if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
          } finally {
            if (e_2) throw e_2.error;
          }
        }
      } else {
        var w = new Writer();

        try {
          for (var _j = __values(e.args), _k = _j.next(); !_k.done; _k = _j.next()) {
            var v = _k.value;
            var a = args.next();

            if (a.done) {
              throw new Error("REPORT ME: iterator is done");
            }

            writeExpr(v, w, a.value);
          }
        } catch (e_3_1) {
          e_3 = {
            error: e_3_1
          };
        } finally {
          try {
            if (_k && !_k.done && (_c = _j.return)) _c.call(_j);
          } finally {
            if (e_3) throw e_3.error;
          }
        }

        wr.writeUint32(w.length);
        wr.writeBytes(w.buffer);
      }
    }

    if (e.annots !== undefined && e.annots.length !== 0) {
      var enc = new TextEncoder();
      var bytes = enc.encode(e.annots.join(" "));
      wr.writeUint32(bytes.length);
      wr.writeBytes(Array.from(bytes));
    } else if (e.args !== undefined && e.args.length >= 3) {
      wr.writeUint32(0);
    }
  }

  var isOrData = function (e) {
    return "prim" in e && (e.prim === "Left" || e.prim === "Right");
  };

  var isOptionData = function (e) {
    return "prim" in e && (e.prim === "Some" || e.prim === "None");
  };

  var getWriteTransformFunc = function (t) {
    if (isPairType(t)) {
      return function (d) {
        if (!isPairData(d)) {
          throw new MichelsonTypeError(t, d, "pair expected: " + JSON.stringify(d));
        }

        assertDataListIfAny(d); // combs aren't used in pack format

        var tc = unpackComb("pair", t);
        var dc = unpackComb("Pair", d);
        return [dc, function () {
          var _a, _b, a, e_5_1;

          var e_5, _c;

          return __generator(this, function (_d) {
            switch (_d.label) {
              case 0:
                _d.trys.push([0, 5, 6, 7]);

                _a = __values(tc.args), _b = _a.next();
                _d.label = 1;

              case 1:
                if (!!_b.done) return [3
                /*break*/
                , 4];
                a = _b.value;
                return [4
                /*yield*/
                , getWriteTransformFunc(a)];

              case 2:
                _d.sent();

                _d.label = 3;

              case 3:
                _b = _a.next();
                return [3
                /*break*/
                , 1];

              case 4:
                return [3
                /*break*/
                , 7];

              case 5:
                e_5_1 = _d.sent();
                e_5 = {
                  error: e_5_1
                };
                return [3
                /*break*/
                , 7];

              case 6:
                try {
                  if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                } finally {
                  if (e_5) throw e_5.error;
                }

                return [7
                /*endfinally*/
                ];

              case 7:
                return [2
                /*return*/
                ];
            }
          });
        }()];
      };
    }

    switch (t.prim) {
      case "or":
        return function (d) {
          if (!isOrData(d)) {
            throw new MichelsonTypeError(t, d, "or expected: " + JSON.stringify(d));
          }

          return [d, function () {
            return __generator(this, function (_a) {
              switch (_a.label) {
                case 0:
                  return [4
                  /*yield*/
                  , getWriteTransformFunc(t.args[d.prim === "Left" ? 0 : 1])];

                case 1:
                  _a.sent();

                  return [2
                  /*return*/
                  ];
              }
            });
          }()];
        };

      case "option":
        return function (d) {
          if (!isOptionData(d)) {
            throw new MichelsonTypeError(t, d, "option expected: " + JSON.stringify(d));
          }

          return [d, function () {
            var dd;
            return __generator(this, function (_a) {
              switch (_a.label) {
                case 0:
                  dd = d;
                  if (!(dd.prim === "Some")) return [3
                  /*break*/
                  , 2];
                  return [4
                  /*yield*/
                  , getWriteTransformFunc(t.args[0])];

                case 1:
                  _a.sent();

                  _a.label = 2;

                case 2:
                  return [2
                  /*return*/
                  ];
              }
            });
          }()];
        };

      case "list":
      case "set":
        return function (d) {
          if (!Array.isArray(d)) {
            throw new MichelsonTypeError(t, d, t.prim + " expected: " + JSON.stringify(d));
          }

          return [d, function () {
            var d_1, d_1_1, e_6_1;

            var e_6, _a;

            return __generator(this, function (_b) {
              switch (_b.label) {
                case 0:
                  _b.trys.push([0, 5, 6, 7]);

                  d_1 = __values(d), d_1_1 = d_1.next();
                  _b.label = 1;

                case 1:
                  if (!!d_1_1.done) return [3
                  /*break*/
                  , 4];
                  return [4
                  /*yield*/
                  , getWriteTransformFunc(t.args[0])];

                case 2:
                  _b.sent();

                  _b.label = 3;

                case 3:
                  d_1_1 = d_1.next();
                  return [3
                  /*break*/
                  , 1];

                case 4:
                  return [3
                  /*break*/
                  , 7];

                case 5:
                  e_6_1 = _b.sent();
                  e_6 = {
                    error: e_6_1
                  };
                  return [3
                  /*break*/
                  , 7];

                case 6:
                  try {
                    if (d_1_1 && !d_1_1.done && (_a = d_1.return)) _a.call(d_1);
                  } finally {
                    if (e_6) throw e_6.error;
                  }

                  return [7
                  /*endfinally*/
                  ];

                case 7:
                  return [2
                  /*return*/
                  ];
              }
            });
          }()];
        };

      case "map":
        return function (d) {
          if (!Array.isArray(d)) {
            throw new MichelsonTypeError(t, d, "map expected: " + JSON.stringify(d));
          }

          return [d, function () {
            var d_2, d_2_1, e_7_1;

            var e_7, _a;

            return __generator(this, function (_b) {
              switch (_b.label) {
                case 0:
                  _b.trys.push([0, 5, 6, 7]);

                  d_2 = __values(d), d_2_1 = d_2.next();
                  _b.label = 1;

                case 1:
                  if (!!d_2_1.done) return [3
                  /*break*/
                  , 4];
                  return [4
                  /*yield*/
                  , function (elt) {
                    if (!("prim" in elt) || elt.prim !== "Elt") {
                      throw new MichelsonTypeError(t, elt, "map element expected: " + JSON.stringify(elt));
                    }

                    return [elt, function () {
                      var _a, _b, a, e_8_1;

                      var e_8, _c;

                      return __generator(this, function (_d) {
                        switch (_d.label) {
                          case 0:
                            _d.trys.push([0, 5, 6, 7]);

                            _a = __values(t.args), _b = _a.next();
                            _d.label = 1;

                          case 1:
                            if (!!_b.done) return [3
                            /*break*/
                            , 4];
                            a = _b.value;
                            return [4
                            /*yield*/
                            , getWriteTransformFunc(a)];

                          case 2:
                            _d.sent();

                            _d.label = 3;

                          case 3:
                            _b = _a.next();
                            return [3
                            /*break*/
                            , 1];

                          case 4:
                            return [3
                            /*break*/
                            , 7];

                          case 5:
                            e_8_1 = _d.sent();
                            e_8 = {
                              error: e_8_1
                            };
                            return [3
                            /*break*/
                            , 7];

                          case 6:
                            try {
                              if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                            } finally {
                              if (e_8) throw e_8.error;
                            }

                            return [7
                            /*endfinally*/
                            ];

                          case 7:
                            return [2
                            /*return*/
                            ];
                        }
                      });
                    }()];
                  }];

                case 2:
                  _b.sent();

                  _b.label = 3;

                case 3:
                  d_2_1 = d_2.next();
                  return [3
                  /*break*/
                  , 1];

                case 4:
                  return [3
                  /*break*/
                  , 7];

                case 5:
                  e_7_1 = _b.sent();
                  e_7 = {
                    error: e_7_1
                  };
                  return [3
                  /*break*/
                  , 7];

                case 6:
                  try {
                    if (d_2_1 && !d_2_1.done && (_a = d_2.return)) _a.call(d_2);
                  } finally {
                    if (e_7) throw e_7.error;
                  }

                  return [7
                  /*endfinally*/
                  ];

                case 7:
                  return [2
                  /*return*/
                  ];
              }
            });
          }()];
        };

      case "chain_id":
        return function (d) {
          if (!("bytes" in d) && !("string" in d)) {
            throw new MichelsonTypeError(t, d, "chain id expected: " + JSON.stringify(d));
          }

          var bytes;

          if ("string" in d) {
            var id = checkDecodeTezosID(d.string, "ChainID");

            if (id === null) {
              throw new MichelsonTypeError(t, d, "chain id base58 expected: " + d.string);
            }

            bytes = {
              bytes: hexBytes(id[1])
            };
          } else {
            bytes = d;
          }

          return [bytes, [][Symbol.iterator]()];
        };

      case "signature":
        return function (d) {
          if (!("bytes" in d) && !("string" in d)) {
            throw new MichelsonTypeError(t, d, "signature expected: " + JSON.stringify(d));
          }

          var bytes;

          if ("string" in d) {
            var sig = checkDecodeTezosID(d.string, "ED25519Signature", "SECP256K1Signature", "P256Signature", "GenericSignature");

            if (sig === null) {
              throw new MichelsonTypeError(t, d, "signature base58 expected: " + d.string);
            }

            bytes = {
              bytes: hexBytes(sig[1])
            };
          } else {
            bytes = d;
          }

          return [bytes, [][Symbol.iterator]()];
        };

      case "key_hash":
        return function (d) {
          if (!("bytes" in d) && !("string" in d)) {
            throw new MichelsonTypeError(t, d, "key hash expected: " + JSON.stringify(d));
          }

          var bytes;

          if ("string" in d) {
            var pkh = checkDecodeTezosID(d.string, "ED25519PublicKeyHash", "SECP256K1PublicKeyHash", "P256PublicKeyHash");

            if (pkh === null) {
              throw new MichelsonTypeError(t, d, "key hash base58 expected: " + d.string);
            }

            var w = new Writer();
            writePublicKeyHash({
              type: pkh[0],
              hash: pkh[1]
            }, w);
            bytes = {
              bytes: hexBytes(w.buffer)
            };
          } else {
            bytes = d;
          }

          return [bytes, [][Symbol.iterator]()];
        };

      case "key":
        return function (d) {
          if (!("bytes" in d) && !("string" in d)) {
            throw new MichelsonTypeError(t, d, "public key expected: " + JSON.stringify(d));
          }

          var bytes;

          if ("string" in d) {
            var key = checkDecodeTezosID(d.string, "ED25519PublicKey", "SECP256K1PublicKey", "P256PublicKey");

            if (key === null) {
              throw new MichelsonTypeError(t, d, "public key base58 expected: " + d.string);
            }

            var w = new Writer();
            writePublicKey({
              type: key[0],
              publicKey: key[1]
            }, w);
            bytes = {
              bytes: hexBytes(w.buffer)
            };
          } else {
            bytes = d;
          }

          return [bytes, [][Symbol.iterator]()];
        };

      case "address":
        return function (d) {
          if (!("bytes" in d) && !("string" in d)) {
            throw new MichelsonTypeError(t, d, "address expected: " + JSON.stringify(d));
          }

          var bytes;

          if ("string" in d) {
            var s = d.string.split("%");
            var address = checkDecodeTezosID(s[0], "ED25519PublicKeyHash", "SECP256K1PublicKeyHash", "P256PublicKeyHash", "ContractHash");

            if (address === null) {
              throw new MichelsonTypeError(t, d, "address base58 expected: " + d.string);
            }

            var w = new Writer();
            writeAddress({
              type: address[0],
              hash: address[1],
              entryPoint: s.length > 1 ? s[1] : undefined
            }, w);
            bytes = {
              bytes: hexBytes(w.buffer)
            };
          } else {
            bytes = d;
          }

          return [bytes, [][Symbol.iterator]()];
        };

      case "timestamp":
        return function (d) {
          if (!("string" in d) && !("int" in d)) {
            throw new MichelsonTypeError(t, d, "timestamp expected: " + JSON.stringify(d));
          }

          var int;

          if ("string" in d) {
            var p = parseDate(d);

            if (p === null) {
              throw new MichelsonTypeError(t, d, "can't parse date: " + d.string);
            }

            int = {
              int: String(Math.floor(p.getTime() / 1000))
            };
          } else {
            int = d;
          }

          return [int, [][Symbol.iterator]()];
        };

      default:
        return writePassThrough;
    }
  };

  var isPushInstruction = function (e) {
    return "prim" in e && e.prim === "PUSH";
  };

  var writePassThrough = function (e) {
    if (isPushInstruction(e)) {
      assertMichelsonInstruction(e); // capture inlined type definition

      return [e, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4
              /*yield*/
              , writePassThrough];

            case 1:
              _a.sent();

              return [4
              /*yield*/
              , getWriteTransformFunc(e.args[0])];

            case 2:
              _a.sent();

              return [2
              /*return*/
              ];
          }
        });
      }()];
    }

    return [e, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , writePassThrough];

          case 1:
            _a.sent();

            return [3
            /*break*/
            , 0];

          case 2:
            return [2
            /*return*/
            ];
        }
      });
    }()];
  };
  /**
   * Serializes any value of packable type to its optimized binary representation
   * identical to the one used by PACK and UNPACK Michelson instructions.
   * Without a type definition (not recommended) the data will be encoded as a binary form of a generic Michelson expression.
   * Type definition allows some types like `timestamp` and `address` and other base58 representable types to be encoded to
   * corresponding optimized binary forms borrowed from the Tezos protocol
   *
   * ```typescript
   * const data: MichelsonData = {
   *     string: "KT1RvkwF4F7pz1gCoxkyZrG1RkrxQy3gmFTv%foo"
   * };
   *
   * const typ: MichelsonType = {
   *     prim: "address"
   * };
   *
   * const packed = packData(data, typ);
   *
   * // 050a0000001901be41ee922ddd2cf33201e49d32da0afec571dce300666f6f
   * ```
   *
   * Without a type definition the base58 encoded address will be treated as a string
   * ```typescript
   * const data: MichelsonData = {
   *     string: "KT1RvkwF4F7pz1gCoxkyZrG1RkrxQy3gmFTv%foo"
   * };
   *
   * const packed = packData(data);
   *
   * // 0501000000284b543152766b7746344637707a3167436f786b795a724731526b7278517933676d46547625666f6f
   * ```
   * @param d Data object
   * @param t Optional type definition
   * @returns Binary representation as numeric array
   */


  function packData(d, t) {
    var w = new Writer();
    w.writeUint8(5);
    writeExpr(d, w, t !== undefined ? getWriteTransformFunc(t) : writePassThrough);
    return w.buffer;
  }
  /**
   * Serializes any value of packable type to its optimized binary representation
   * identical to the one used by PACK and UNPACK Michelson instructions.
   * Same as {@link packData} but returns a `bytes` Michelson data literal instead of an array
   *
   * ```typescript
   * const data: MichelsonData = {
   *     string: "2019-09-26T10:59:51Z"
   * };
   *
   * const typ: MichelsonType = {
   *     prim: "timestamp"
   * };
   *
   * const packed = packDataBytes(data, typ);
   *
   * // { bytes: "0500a7e8e4d80b" }
   * ```
   * @param d Data object
   * @param t Optional type definition
   * @returns Binary representation as a bytes literal
   */


  function packDataBytes(d, t) {
    return {
      bytes: hexBytes(packData(d, t))
    };
  }


  function decodeAddressBytes(b) {
    var bytes = parseBytes(b.bytes);

    if (bytes === null) {
      throw new Error("can't parse bytes: \"" + b.bytes + "\"");
    }

    var rd = new Reader(new Uint8Array(bytes));
    return readAddress(rd);
  }

  function decodePublicKeyHashBytes(b) {
    var bytes = parseBytes(b.bytes);

    if (bytes === null) {
      throw new Error("can't parse bytes: \"" + b.bytes + "\"");
    }

    var rd = new Reader(new Uint8Array(bytes));
    return readPublicKeyHash(rd);
  }

  function decodePublicKeyBytes(b) {
    var bytes = parseBytes(b.bytes);

    if (bytes === null) {
      throw new Error("can't parse bytes: \"" + b.bytes + "\"");
    }

    var rd = new Reader(new Uint8Array(bytes));
    return readPublicKey(rd);
  }

  var MichelsonInstructionError =
  /** @class */
  function (_super) {
    __extends(MichelsonInstructionError, _super);
    /**
     * @param val Value of a type node caused the error
     * @param stackState Current stack state
     * @param message An error message
     */


    function MichelsonInstructionError(val, stackState, message) {
      var _this = _super.call(this, val, message) || this;

      _this.stackState = stackState;
      Object.setPrototypeOf(_this, MichelsonInstructionError.prototype);
      return _this;
    }

    return MichelsonInstructionError;
  }(MichelsonError); // 'sequence as a pair' edo syntax helpers


  function typeID(t) {
    return Array.isArray(t) ? "pair" : t.prim;
  }

  function typeArgs(t) {
    return "prim" in t ? t.args : t;
  }

  function assertScalarTypesEqual(a, b, field) {
    if (field === void 0) {
      field = false;
    }

    if (typeID(a) !== typeID(b)) {
      throw new MichelsonTypeError(a, undefined, "types mismatch: " + typeID(a) + " != " + typeID(b));
    }

    var ann = [unpackAnnotations(a), unpackAnnotations(b)];

    if (ann[0].t && ann[1].t && ann[0].t[0] !== ann[1].t[0]) {
      throw new MichelsonTypeError(a, undefined, typeID(a) + ": type names mismatch: " + ann[0].t[0] + " != " + ann[1].t[0]);
    }

    if (field && ann[0].f && ann[1].f && ann[0].f[0] !== ann[1].f[0]) {
      throw new MichelsonTypeError(a, undefined, typeID(a) + ": field names mismatch: " + ann[0].f[0] + " != " + ann[1].f);
    }

    if (isPairType(a)) {
      var aArgs = unpackComb("pair", a);
      var bArgs = unpackComb("pair", b);
      assertScalarTypesEqual(aArgs.args[0], bArgs.args[0], true);
      assertScalarTypesEqual(aArgs.args[1], bArgs.args[1], true);
      return;
    }

    switch (a.prim) {
      case "option":
      case "list":
      case "contract":
      case "set":
      case "ticket":
        assertScalarTypesEqual(a.args[0], b.args[0]);
        break;

      case "or":
        assertScalarTypesEqual(a.args[0], b.args[0], true);
        assertScalarTypesEqual(a.args[1], b.args[1], true);
        break;

      case "lambda":
      case "map":
      case "big_map":
        assertScalarTypesEqual(a.args[0], b.args[0]);
        assertScalarTypesEqual(a.args[1], b.args[1]);
        break;

      case "sapling_state":
      case "sapling_transaction":
        if (parseInt(a.args[0].int, 10) !== parseInt(b.args[0].int, 10)) {
          throw new MichelsonTypeError(a, undefined, typeID(a) + ": type argument mismatch: " + a.args[0].int + " != " + b.args[0].int);
        }

    }
  }

  function assertStacksEqual(a, b) {
    if (a.length !== b.length) {
      throw new MichelsonTypeError(a, undefined, "stack length mismatch: " + a.length + " != " + b.length);
    }

    for (var i = 0; i < a.length; i++) {
      assertScalarTypesEqual(a[i], b[i]);
    }
  }

  function assertTypeAnnotationsValid(t, field) {
    var e_1, _a, e_2, _b;

    var _c, _d, _e;

    if (field === void 0) {
      field = false;
    }

    if (!Array.isArray(t)) {
      var ann = unpackAnnotations(t);

      if ((((_c = ann.t) === null || _c === void 0 ? void 0 : _c.length) || 0) > 1) {
        throw new MichelsonTypeError(t, undefined, t.prim + ": at most one type annotation allowed: " + t.annots);
      }

      if (field) {
        if ((((_d = ann.f) === null || _d === void 0 ? void 0 : _d.length) || 0) > 1) {
          throw new MichelsonTypeError(t, undefined, t.prim + ": at most one field annotation allowed: " + t.annots);
        }
      } else {
        if ((((_e = ann.f) === null || _e === void 0 ? void 0 : _e.length) || 0) > 0) {
          throw new MichelsonTypeError(t, undefined, t.prim + ": field annotations aren't allowed: " + t.annots);
        }
      }
    }

    if (isPairType(t)) {
      var args = typeArgs(t);

      try {
        for (var args_1 = __values(args), args_1_1 = args_1.next(); !args_1_1.done; args_1_1 = args_1.next()) {
          var a = args_1_1.value;
          assertTypeAnnotationsValid(a, true);
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (args_1_1 && !args_1_1.done && (_a = args_1.return)) _a.call(args_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }

      return;
    }

    switch (t.prim) {
      case "option":
      case "list":
      case "contract":
      case "set":
        assertTypeAnnotationsValid(t.args[0]);
        break;

      case "or":
        try {
          for (var _f = __values(t.args), _g = _f.next(); !_g.done; _g = _f.next()) {
            var a = _g.value;
            assertTypeAnnotationsValid(a, true);
          }
        } catch (e_2_1) {
          e_2 = {
            error: e_2_1
          };
        } finally {
          try {
            if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
          } finally {
            if (e_2) throw e_2.error;
          }
        }

        break;

      case "lambda":
      case "map":
      case "big_map":
        assertTypeAnnotationsValid(t.args[0]);
        assertTypeAnnotationsValid(t.args[1]);
    }
  } // Data integrity check


  function compareMichelsonData(t, a, b) {
    if (isPairType(t)) {
      if (isPairData(a) && isPairData(b)) {
        assertDataListIfAny(a);
        assertDataListIfAny(b);
        var tComb = unpackComb("pair", t);
        var aComb = unpackComb("Pair", a);
        var bComb = unpackComb("Pair", b);
        var x = compareMichelsonData(tComb.args[0], aComb.args[0], bComb.args[0]);

        if (x !== 0) {
          return x;
        }

        return compareMichelsonData(tComb.args[0], aComb.args[1], bComb.args[1]);
      }
    } else {
      switch (t.prim) {
        case "int":
        case "nat":
        case "mutez":
          if ("int" in a && "int" in b) {
            return new LongInteger(a.int).cmp(new LongInteger(b.int));
          }

          break;

        case "string":
          if ("string" in a && "string" in b) {
            var x = a.string.localeCompare(b.string);
            return x < 0 ? -1 : x > 0 ? 1 : 0;
          }

          break;

        case "bytes":
          if ("bytes" in a && "bytes" in b) {
            var aa = parseBytes(a.bytes);
            var bb = parseBytes(b.bytes);

            if (aa !== null && bb !== null) {
              return compareBytes(aa, bb);
            }
          }

          break;

        case "bool":
          if ("prim" in a && "prim" in b && (a.prim === "True" || a.prim === "False") && (b.prim === "True" || b.prim === "False")) {
            return a.prim === b.prim ? 0 : a.prim === "False" ? -1 : 1;
          }

          break;

        case "key":
        case "key_hash":
        case "address":
        case "signature":
        case "chain_id":
          if (("string" in a || "bytes" in a) && ("string" in b || "bytes" in b)) {
            return compareBytes("string" in a ? decodeBase58Check(a.string) : parseBytes(a.bytes) || [], "string" in b ? decodeBase58Check(b.string) : parseBytes(b.bytes) || []);
          }

          break;

        case "timestamp":
          if (("string" in a || "int" in a) && ("string" in b || "int" in b)) {
            var aa = parseDate(a);
            var bb = parseDate(b);

            if (aa !== null && bb !== null) {
              var x = aa.valueOf() - bb.valueOf();
              return x < 0 ? -1 : x > 0 ? 1 : 0;
            }
          }

          break;

        case "unit":
          if ("prim" in a && "prim" in b && a.prim === "Unit" && b.prim === "Unit") {
            return 0;
          }

      }
    } // Unlikely, types are expected to be verified before the function call


    throw new MichelsonTypeError(t, undefined, typeID(t) + ": not comparable values: " + JSON.stringify(a) + ", " + JSON.stringify(b));
  } // Simplified version of assertMichelsonInstruction() for previously validated data


  function isFunction(d) {
    var e_3, _a;

    if (!Array.isArray(d)) {
      return false;
    }

    try {
      for (var d_1 = __values(d), d_1_1 = d_1.next(); !d_1_1.done; d_1_1 = d_1.next()) {
        var v = d_1_1.value;

        if (!(Array.isArray(v) && isFunction(v) || "prim" in v && isInstruction(v))) {
          return false;
        }
      }
    } catch (e_3_1) {
      e_3 = {
        error: e_3_1
      };
    } finally {
      try {
        if (d_1_1 && !d_1_1.done && (_a = d_1.return)) _a.call(d_1);
      } finally {
        if (e_3) throw e_3.error;
      }
    }

    return true;
  }

  function assertDataValidInternal(d, t, ctx) {
    var e_4, _a, e_5, _b;

    if (isPairType(t)) {
      if (isPairData(d)) {
        assertDataListIfAny(d);
        var dc = unpackComb("Pair", d);
        var tc = unpackComb("pair", t);
        assertDataValidInternal(dc.args[0], tc.args[0], ctx);
        assertDataValidInternal(dc.args[1], tc.args[1], ctx);
        return;
      }

      throw new MichelsonTypeError(t, d, "pair expected: " + JSON.stringify(d));
    }

    switch (t.prim) {
      // Atomic literals
      case "int":
        if ("int" in d && isDecimal(d.int)) {
          return;
        }

        throw new MichelsonTypeError(t, d, "integer value expected: " + JSON.stringify(d));

      case "nat":
      case "mutez":
        if ("int" in d && isNatural(d.int)) {
          return;
        }

        throw new MichelsonTypeError(t, d, "natural value expected: " + JSON.stringify(d));

      case "string":
        if ("string" in d) {
          return;
        }

        throw new MichelsonTypeError(t, d, "string value expected: " + JSON.stringify(d));

      case "bytes":
      case "bls12_381_g1":
      case "bls12_381_g2":
        if ("bytes" in d && parseBytes(d.bytes) !== null) {
          return;
        }

        throw new MichelsonTypeError(t, d, "bytes value expected: " + JSON.stringify(d));

      case "bool":
        if ("prim" in d && (d.prim === "True" || d.prim === "False")) {
          return;
        }

        throw new MichelsonTypeError(t, d, "boolean value expected: " + JSON.stringify(d));

      case "key_hash":
        if ("string" in d && checkDecodeTezosID(d.string, "ED25519PublicKeyHash", "SECP256K1PublicKeyHash", "P256PublicKeyHash") !== null) {
          return;
        } else if ("bytes" in d) {
          try {
            decodePublicKeyHashBytes(d);
            return;
          } catch (err) {// ignore message
          }
        }

        throw new MichelsonTypeError(t, d, "key hash expected: " + JSON.stringify(d));

      case "timestamp":
        if (("string" in d || "int" in d) && parseDate(d) !== null) {
          return;
        }

        throw new MichelsonTypeError(t, d, "timestamp expected: " + JSON.stringify(d));

      case "address":
        if ("string" in d) {
          var address = d.string;
          var ep = d.string.indexOf("%");

          if (ep >= 0) {
            // trim entry point
            address = d.string.slice(0, ep);
          }

          if (checkDecodeTezosID(address, "ED25519PublicKeyHash", "SECP256K1PublicKeyHash", "P256PublicKeyHash", "ContractHash") !== null) {
            return;
          }
        } else if ("bytes" in d) {
          try {
            decodeAddressBytes(d);
            return;
          } catch (err) {// ignore message
          }
        }

        throw new MichelsonTypeError(t, d, "address expected: " + JSON.stringify(d));

      case "key":
        if ("string" in d && checkDecodeTezosID(d.string, "ED25519PublicKey", "SECP256K1PublicKey", "P256PublicKey") !== null) {
          return;
        } else if ("bytes" in d) {
          try {
            decodePublicKeyBytes(d);
            return;
          } catch (err) {// ignore message
          }
        }

        throw new MichelsonTypeError(t, d, "public key expected: " + JSON.stringify(d));

      case "unit":
        if ("prim" in d && d.prim === "Unit") {
          return;
        }

        throw new MichelsonTypeError(t, d, "unit value expected: " + JSON.stringify(d));

      case "signature":
        if ("bytes" in d || "string" in d && checkDecodeTezosID(d.string, "ED25519Signature", "SECP256K1Signature", "P256Signature", "GenericSignature") !== null) {
          return;
        }

        throw new MichelsonTypeError(t, d, "signature expected: " + JSON.stringify(d));

      case "chain_id":
        if ("bytes" in d || "string" in d) {
          var x = "string" in d ? decodeBase58Check(d.string) : parseBytes(d.bytes);

          if (x !== null) {
            return;
          }
        }

        throw new MichelsonTypeError(t, d, "chain id expected: " + JSON.stringify(d));

      case "operation":
        throw new MichelsonTypeError(t, d, "operation type can't be represented as a literal value");

      case "contract":
        throw new MichelsonTypeError(t, d, "contract type can't be represented as a literal value");
      // Complex types

      case "option":
        if ("prim" in d) {
          if (d.prim === "None") {
            return;
          } else if (d.prim === "Some") {
            assertDataValidInternal(d.args[0], t.args[0], ctx);
            return;
          }
        }

        throw new MichelsonTypeError(t, d, "option expected: " + JSON.stringify(d));

      case "list":
      case "set":
        if (assertDataListIfAny(d)) {
          var prev = void 0;

          try {
            for (var d_2 = __values(d), d_2_1 = d_2.next(); !d_2_1.done; d_2_1 = d_2.next()) {
              var v = d_2_1.value;
              assertDataValidInternal(v, t.args[0], ctx);

              if (t.prim === "set") {
                if (prev === undefined) {
                  prev = v;
                } else if (compareMichelsonData(t.args[0], prev, v) > 0) {
                  throw new MichelsonTypeError(t, d, "set elements must be ordered: " + JSON.stringify(d));
                }
              }
            }
          } catch (e_4_1) {
            e_4 = {
              error: e_4_1
            };
          } finally {
            try {
              if (d_2_1 && !d_2_1.done && (_a = d_2.return)) _a.call(d_2);
            } finally {
              if (e_4) throw e_4.error;
            }
          }

          return;
        }

        throw new MichelsonTypeError(t, d, t.prim + " expected: " + JSON.stringify(d));

      case "or":
        if ("prim" in d) {
          if (d.prim === "Left") {
            assertDataValidInternal(d.args[0], t.args[0], ctx);
            return;
          } else if (d.prim === "Right") {
            assertDataValidInternal(d.args[0], t.args[1], ctx);
            return;
          }
        }

        throw new MichelsonTypeError(t, d, "union (or) expected: " + JSON.stringify(d));

      case "lambda":
        if (isFunction(d)) {
          var ret = functionTypeInternal(d, [t.args[0]], ctx);

          if ("failed" in ret) {
            throw new MichelsonTypeError(t, d, "function is failed with error type: " + ret.failed);
          }

          if (ret.length !== 1) {
            throw new MichelsonTypeError(t, d, "function must return a value");
          }

          assertScalarTypesEqual(t.args[1], ret[0]);
          return;
        }

        throw new MichelsonTypeError(t, d, "function expected: " + JSON.stringify(d));

      case "map":
      case "big_map":
        if (Array.isArray(d)) {
          var prev = void 0;

          try {
            for (var d_3 = __values(d), d_3_1 = d_3.next(); !d_3_1.done; d_3_1 = d_3.next()) {
              var v = d_3_1.value;

              if (!("prim" in v) || v.prim !== "Elt") {
                throw new MichelsonTypeError(t, d, "map elements expected: " + JSON.stringify(d));
              }

              assertDataValidInternal(v.args[0], t.args[0], ctx);
              assertDataValidInternal(v.args[1], t.args[1], ctx);

              if (prev === undefined) {
                prev = v;
              } else if (compareMichelsonData(t.args[0], prev.args[0], v.args[0]) > 0) {
                throw new MichelsonTypeError(t, d, "map elements must be ordered: " + JSON.stringify(d));
              }
            }
          } catch (e_5_1) {
            e_5 = {
              error: e_5_1
            };
          } finally {
            try {
              if (d_3_1 && !d_3_1.done && (_b = d_3.return)) _b.call(d_3);
            } finally {
              if (e_5) throw e_5.error;
            }
          }

          return;
        }

        throw new MichelsonTypeError(t, d, t.prim + " expected: " + JSON.stringify(d));

      case "bls12_381_fr":
        if ("int" in d && isDecimal(d.int) || "bytes" in d && parseBytes(d.bytes) !== null) {
          return;
        }

        throw new MichelsonTypeError(t, d, "BLS12-381 element expected: " + JSON.stringify(d));

      case "sapling_state":
        if (Array.isArray(d)) {
          return;
        }

        throw new MichelsonTypeError(t, d, "sapling state expected: " + JSON.stringify(d));

      case "ticket":
        assertDataValidInternal(d, {
          prim: "pair",
          args: [{
            prim: "address"
          }, t.args[0], {
            prim: "nat"
          }]
        }, ctx);
        return;

      default:
        throw new MichelsonTypeError(t, d, "unexpected type: " + typeID(t));
    }
  }

  function instructionListType(inst, stack, ctx) {
    var e_6, _a;

    var ret = stack;
    var s = stack;
    var i = 0;

    try {
      for (var inst_1 = __values(inst), inst_1_1 = inst_1.next(); !inst_1_1.done; inst_1_1 = inst_1.next()) {
        var op = inst_1_1.value;
        var ft = functionTypeInternal(op, s, ctx);
        ret = ft;

        if ("failed" in ft) {
          break;
        }

        s = ft;
        i++;
      }
    } catch (e_6_1) {
      e_6 = {
        error: e_6_1
      };
    } finally {
      try {
        if (inst_1_1 && !inst_1_1.done && (_a = inst_1.return)) _a.call(inst_1);
      } finally {
        if (e_6) throw e_6.error;
      }
    }

    if ("failed" in ret && i !== inst.length - 1) {
      throw new MichelsonInstructionError(inst, ret, "FAIL must appear in a tail position");
    }

    if ((ctx === null || ctx === void 0 ? void 0 : ctx.traceCallback) !== undefined) {
      var trace = {
        op: inst,
        in: stack,
        out: ret
      };
      ctx.traceCallback(trace);
    }

    return ret;
  }

  function functionTypeInternal(inst, stack, ctx) {
    var proto = (ctx === null || ctx === void 0 ? void 0 : ctx.protocol) || DefaultProtocol;

    if (Array.isArray(inst)) {
      return instructionListType(inst, stack, ctx);
    }

    var instruction = inst; // Make it const for type guarding
    // make sure the stack has enough number of arguments of specific types

    function args(n) {
      var e_7, _a;

      var typeIds = [];

      for (var _i = 1; _i < arguments.length; _i++) {
        typeIds[_i - 1] = arguments[_i];
      }

      if (stack.length < typeIds.length + n) {
        throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": stack must have at least " + typeIds.length + " element(s)");
      }

      var i = n;

      try {
        for (var typeIds_1 = __values(typeIds), typeIds_1_1 = typeIds_1.next(); !typeIds_1_1.done; typeIds_1_1 = typeIds_1.next()) {
          var ids = typeIds_1_1.value;

          if (ids !== null && ids.length !== 0) {
            var ii = 0;

            while (ii < ids.length && ids[ii] !== typeID(stack[i])) {
              ii++;
            }

            if (ii === ids.length) {
              throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": stack type mismatch: [" + i + "] expected to be " + ids + ", got " + typeID(stack[i]) + " instead");
            }
          }

          i++;
        }
      } catch (e_7_1) {
        e_7 = {
          error: e_7_1
        };
      } finally {
        try {
          if (typeIds_1_1 && !typeIds_1_1.done && (_a = typeIds_1.return)) _a.call(typeIds_1);
        } finally {
          if (e_7) throw e_7.error;
        }
      }

      return stack.slice(n, typeIds.length + n);
    }

    function rethrow(fn) {
      return function () {
        var args = [];

        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }

        try {
          return fn.apply(void 0, __spreadArray([], __read(args)));
        } catch (err) {
          if (err instanceof MichelsonError) {
            throw new MichelsonInstructionError(instruction, stack, err.message);
          } else {
            throw err;
          }
        }
      };
    }

    function rethrowTypeGuard(fn) {
      return function (arg) {
        try {
          return fn(arg);
        } catch (err) {
          if (err instanceof MichelsonError) {
            throw new MichelsonInstructionError(instruction, stack, err.message);
          } else {
            throw err;
          }
        }
      };
    }

    var argAnn = rethrow(unpackAnnotations);
    var ensureStacksEqual = rethrow(assertStacksEqual);
    var ensureTypesEqual = rethrow(assertScalarTypesEqual);
    var ensureComparableType = rethrowTypeGuard(assertMichelsonComparableType);
    var ensurePackableType = rethrowTypeGuard(assertMichelsonPackableType);
    var ensureStorableType = rethrowTypeGuard(assertMichelsonStorableType);
    var ensurePushableType = rethrowTypeGuard(assertMichelsonPushableType);
    var ensureBigMapStorableType = rethrowTypeGuard(assertMichelsonBigMapStorableType); // unpack instruction annotations and assert their maximum number

    function instructionAnn(num, opt) {
      var a = argAnn(instruction, __assign(__assign({}, opt), {
        emptyFields: num.f !== undefined && num.f > 1,
        emptyVar: num.v !== undefined && num.v > 1
      }));

      var assertNum = function (a, n, type) {
        if (a && a.length > (n || 0)) {
          throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": at most " + (n || 0) + " " + type + " annotations allowed");
        }
      };

      assertNum(a.f, num.f, "field");
      assertNum(a.t, num.t, "type");
      assertNum(a.v, num.v, "variable");
      return a;
    } // also keeps annotation class if null is provided


    function annotate(tt, a) {
      var tx = tt;
      var t = Array.isArray(tx) ? {
        prim: "pair",
        args: tx
      } : tx;
      var src = argAnn(t);
      var ann = a.v !== undefined || a.t !== undefined || a.f !== undefined ? __spreadArray(__spreadArray(__spreadArray([], __read((a.v === null ? src.v : a.v) || [])), __read((a.t === null ? src.t : a.t) || [])), __read((a.f === null ? src.f : a.f) || [])) : undefined;
      t.annots;

      var rest = __rest(t, ["annots"]);

      return __assign(__assign({}, rest), ann && ann.length !== 0 && {
        annots: ann
      });
    } // shortcut to copy at most one variable annotation from the instruction to the type


    function annotateVar(t, def) {
      var ia = instructionAnn({
        v: 1
      });
      return annotate(t, {
        v: ia.v !== undefined ? ia.v : def !== undefined ? [def] : null,
        t: null
      });
    } // annotate CAR/CDR/UNPAIR/GET


    function annotateField(arg, field, insAnn, n, defField) {
      var _a, _b, _c, _d;

      var fieldAnn = (_a = argAnn(field).f) === null || _a === void 0 ? void 0 : _a[0]; // field's field annotation

      var insFieldAnn = (_b = insAnn.f) === null || _b === void 0 ? void 0 : _b[n];

      if (insFieldAnn !== undefined && insFieldAnn !== "%" && fieldAnn !== undefined && insFieldAnn !== fieldAnn) {
        throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": field names doesn't match: " + insFieldAnn + " !== " + fieldAnn);
      }

      var insVarAnn = (_c = insAnn.v) === null || _c === void 0 ? void 0 : _c[n]; // nth instruction's variable annotation

      var varAnn = (_d = argAnn(arg).v) === null || _d === void 0 ? void 0 : _d[0]; // instruction argument's variable annotation

      return annotate(field, {
        t: null,
        v: insVarAnn ? insVarAnn === "@%" ? fieldAnn ? ["@" + fieldAnn.slice(1)] : undefined : insVarAnn === "@%%" ? varAnn ? ["@" + varAnn.slice(1) + "." + (fieldAnn ? fieldAnn.slice(1) : defField)] : fieldAnn ? ["@" + fieldAnn.slice(1)] : undefined : [insVarAnn] : null
      });
    } // comb helper functions


    function getN(src, n, i) {
      if (i === void 0) {
        i = n;
      }

      var p = unpackComb("pair", src);

      if (i === 1) {
        return [p.args[0]];
      } else if (i === 2) {
        return p.args;
      }

      var right = p.args[1];

      if (isPairType(right)) {
        return __spreadArray([p.args[0]], __read(getN(right, n, i - 1)));
      } else {
        throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": at least " + n + " fields are expected");
      }
    }

    function getNth(src, n, i) {
      if (i === void 0) {
        i = n;
      }

      if (i === 0) {
        return src;
      }

      var p = unpackComb("pair", src);

      if (i === 1) {
        return p.args[0];
      }

      var right = p.args[1];

      if (isPairType(right)) {
        return getNth(right, n, i - 2);
      } else if (i === 2) {
        return right;
      }

      throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": at least " + (n + 1) + " fields are expected");
    }

    function updateNth(src, x, n, i) {
      if (i === void 0) {
        i = n;
      }

      if (i === 0) {
        return x;
      }

      var p = unpackComb("pair", src);

      if (i === 1) {
        return __assign(__assign({}, p), {
          args: [x, p.args[1]]
        });
      }

      var right = p.args[1];

      if (isPairType(right)) {
        return __assign(__assign({}, p), {
          args: [p.args[0], updateNth(right, x, n, i - 2)]
        });
      } else if (i === 2) {
        return __assign(__assign({}, p), {
          args: [p.args[0], x]
        });
      }

      throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": at least " + (n + 1) + " fields are expected");
    }

    var varSuffix = function (a, suffix) {
      return ["@" + (a.v ? a.v[0].slice(1) + "." : "") + suffix];
    };

    function branchType(br0, br1) {
      if ("failed" in br0 || "failed" in br1) {
        // Might be useful for debugging
        if ("failed" in br0 && "failed" in br1) {
          try {
            assertScalarTypesEqual(br0.failed, br1.failed);
            return br0;
          } catch (_a) {
            return {
              failed: {
                prim: "or",
                args: [br0.failed, br1.failed]
              }
            };
          }
        } else {
          return "failed" in br0 ? br1 : br0;
        }
      } else {
        ensureStacksEqual(br0, br1);
        return br0;
      }
    }

    var retStack = function (instruction) {
      var _a, _b;

      var _c, _d, _e, _f, _g;

      switch (instruction.prim) {
        case "DUP":
          {
            var n = instruction.args ? parseInt(instruction.args[0].int, 10) : 1;

            if (n === 0) {
              throw new MichelsonInstructionError(instruction, stack, "DUP 0 is forbidden");
            }

            var s_1 = args(n - 1, null)[0];

            if (typeID(s_1) === "ticket") {
              throw new MichelsonInstructionError(instruction, stack, "ticket can't be DUPed");
            }

            return __spreadArray([s_1], __read(stack));
          }

        case "SWAP":
          {
            var s_2 = args(0, null, null);
            instructionAnn({});
            return __spreadArray([s_2[1], s_2[0]], __read(stack.slice(2)));
          }

        case "SOME":
          return __spreadArray([annotate({
            prim: "option",
            args: [args(0, null)[0]]
          }, instructionAnn({
            t: 1,
            v: 1
          }))], __read(stack.slice(1)));

        case "UNIT":
          return __spreadArray([annotate({
            prim: "unit"
          }, instructionAnn({
            v: 1,
            t: 1
          }))], __read(stack));

        case "PAIR":
          {
            var n = instruction.args ? parseInt(instruction.args[0].int, 10) : 2;

            if (n < 2) {
              throw new MichelsonInstructionError(instruction, stack, "PAIR " + n + " is forbidden");
            }

            var s_3 = args.apply(void 0, __spreadArray([0], __read(new Array(n).fill(null))));
            var ia_1 = instructionAnn({
              f: n,
              t: 1,
              v: 1
            }, {
              specialFields: true
            });

            var trim_1 = function (s) {
              var i = s.lastIndexOf(".");
              return s.slice(i > 0 ? i + 1 : 1);
            };

            var retArgs = s_3.map(function (v, i) {
              var _a;

              var va = argAnn(v);
              var f = ia_1.f && ia_1.f.length > i && ia_1.f[i] !== "%" ? ia_1.f[i] === "%@" ? va.v ? ["%" + trim_1(((_a = va.v) === null || _a === void 0 ? void 0 : _a[0]) || "")] : undefined : [ia_1.f[i]] : undefined;
              return annotate(v, {
                v: null,
                t: null,
                f: f
              });
            });
            return __spreadArray([annotate({
              prim: "pair",
              args: retArgs
            }, {
              t: ia_1.t,
              v: ia_1.v
            })], __read(stack.slice(n)));
          }

        case "UNPAIR":
          {
            var n = instruction.args ? parseInt(instruction.args[0].int, 10) : 2;

            if (n < 2) {
              throw new MichelsonInstructionError(instruction, stack, "UNPAIR " + n + " is forbidden");
            }

            var s_4 = args(0, ["pair"])[0];
            var ia_2 = instructionAnn({
              f: 2,
              v: 2
            }, {
              specialVar: true
            });
            var fields = getN(s_4, n);
            return __spreadArray(__spreadArray([], __read(fields.map(function (field, i) {
              return annotateField(s_4, field, ia_2, i, i === 0 ? "car" : "cdr");
            }))), __read(stack.slice(1)));
          }

        case "CAR":
        case "CDR":
          {
            var s_5 = unpackComb("pair", args(0, ["pair"])[0]);
            var field = s_5.args[instruction.prim === "CAR" ? 0 : 1];
            var ia = instructionAnn({
              f: 1,
              v: 1
            }, {
              specialVar: true
            });
            return __spreadArray([annotateField(s_5, field, ia, 0, instruction.prim.toLocaleLowerCase())], __read(stack.slice(1)));
          }

        case "CONS":
          {
            var s_6 = args(0, null, ["list"]);
            ensureTypesEqual(s_6[0], s_6[1].args[0]);
            return __spreadArray([annotateVar({
              prim: "list",
              args: [s_6[1].args[0]]
            })], __read(stack.slice(2)));
          }

        case "SIZE":
          args(0, ["string", "list", "set", "map", "bytes"]);
          return __spreadArray([annotateVar({
            prim: "nat"
          })], __read(stack.slice(1)));

        case "MEM":
          {
            var s_7 = args(0, null, ["set", "map", "big_map"]);
            ensureComparableType(s_7[0]);
            ensureTypesEqual(s_7[0], s_7[1].args[0]);
            return __spreadArray([annotateVar({
              prim: "bool"
            })], __read(stack.slice(2)));
          }

        case "GET":
          if (instruction.args) {
            // comb operation
            var n = parseInt(instruction.args[0].int, 10);
            var s_8 = args(0, ["pair"])[0];
            return __spreadArray([annotateVar(getNth(s_8, n))], __read(stack.slice(1)));
          } else {
            // map operation
            var s_9 = args(0, null, ["map", "big_map"]);
            ensureComparableType(s_9[0]);
            ensureTypesEqual(s_9[0], s_9[1].args[0]);
            return __spreadArray([annotateVar({
              prim: "option",
              args: [s_9[1].args[1]]
            })], __read(stack.slice(2)));
          }

        case "UPDATE":
          if (instruction.args) {
            // comb operation
            var n = parseInt(instruction.args[0].int, 10);
            var s_10 = args(0, null, ["pair"]);
            return __spreadArray([annotateVar(updateNth(s_10[1], s_10[0], n))], __read(stack.slice(2)));
          } else {
            // map operation
            var s0 = args(0, null, ["bool", "option"]);
            ensureComparableType(s0[0]);

            if (s0[1].prim === "bool") {
              var s1_1 = args(2, ["set"]);
              ensureTypesEqual(s0[0], s1_1[0].args[0]);
              return __spreadArray([annotateVar({
                prim: "set",
                args: [annotate(s0[0], {
                  t: null
                })]
              })], __read(stack.slice(3)));
            }

            var s1 = args(2, ["map", "big_map"]);
            ensureTypesEqual(s0[0], s1[0].args[0]);

            if (s1[0].prim === "map") {
              return __spreadArray([annotateVar({
                prim: "map",
                args: [annotate(s0[0], {
                  t: null
                }), annotate(s0[1].args[0], {
                  t: null
                })]
              })], __read(stack.slice(3)));
            }

            ensureBigMapStorableType(s0[1].args[0]);
            return __spreadArray([annotateVar({
              prim: "big_map",
              args: [annotate(s0[0], {
                t: null
              }), annotate(s0[1].args[0], {
                t: null
              })]
            })], __read(stack.slice(3)));
          }

        case "GET_AND_UPDATE":
          {
            var ia = instructionAnn({
              v: 2
            });
            var s_11 = args(0, null, ["option"], ["map", "big_map"]);
            ensureComparableType(s_11[0]);
            ensureTypesEqual(s_11[0], s_11[2].args[0]);
            ensureTypesEqual(s_11[1].args[0], s_11[2].args[1]);
            var va = (_c = ia.v) === null || _c === void 0 ? void 0 : _c.map(function (v) {
              return v !== "@" ? [v] : undefined;
            });

            if (s_11[2].prim === "map") {
              return __spreadArray([annotate({
                prim: "option",
                args: [s_11[2].args[1]]
              }, {
                v: va === null || va === void 0 ? void 0 : va[0]
              }), annotate({
                prim: "map",
                args: [annotate(s_11[0], {
                  t: null
                }), annotate(s_11[1].args[0], {
                  t: null
                })]
              }, {
                v: va === null || va === void 0 ? void 0 : va[1]
              })], __read(stack.slice(3)));
            }

            ensureBigMapStorableType(s_11[1].args[0]);
            return __spreadArray([annotate({
              prim: "option",
              args: [s_11[2].args[1]]
            }, {
              v: va === null || va === void 0 ? void 0 : va[0]
            }), annotate({
              prim: "big_map",
              args: [annotate(s_11[0], {
                t: null
              }), annotate(s_11[1].args[0], {
                t: null
              })]
            }, {
              v: va === null || va === void 0 ? void 0 : va[1]
            })], __read(stack.slice(3)));
          }

        case "EXEC":
          {
            var s_12 = args(0, null, ["lambda"]);
            ensureTypesEqual(s_12[0], s_12[1].args[0]);
            return __spreadArray([annotateVar(s_12[1].args[1])], __read(stack.slice(2)));
          }

        case "APPLY":
          {
            var s_13 = args(0, null, ["lambda"]);
            ensureStorableType(s_13[0]);
            ensurePushableType(s_13[0]);

            if (!isPairType(s_13[1].args[0])) {
              throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": function's argument must be a pair: " + typeID(s_13[1].args[0]));
            }

            var pt = s_13[1].args[0];
            ensureTypesEqual(s_13[0], typeArgs(pt)[0]);
            return __spreadArray([annotateVar({
              prim: "lambda",
              args: [typeArgs(pt)[1], s_13[1].args[1]]
            })], __read(stack.slice(2)));
          }

        case "FAILWITH":
          {
            var s_14 = args(0, null)[0];

            if (proto === Protocol.PtEdo2Zk || proto === Protocol.PsFLorena || proto === Protocol.PtGRANADs) {
              ensurePackableType(s_14);
            }

            return {
              failed: s_14
            };
          }

        case "NEVER":
          args(0, ["never"]);
          return {
            failed: {
              prim: "never"
            }
          };

        case "RENAME":
          return __spreadArray([annotateVar(args(0, null)[0])], __read(stack.slice(1)));

        case "CONCAT":
          {
            var s0 = args(0, ["string", "list", "bytes"]);

            if (s0[0].prim === "list") {
              if (typeID(s0[0].args[0]) !== "string" && typeID(s0[0].args[0]) !== "bytes") {
                throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": can't concatenate list of " + typeID(s0[0].args[0]) + "'s");
              }

              return __spreadArray([annotateVar(s0[0].args[0])], __read(stack.slice(1)));
            }

            var s1 = args(1, ["string", "bytes"]);

            if (s0[0].prim !== s1[0].prim) {
              throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": can't concatenate " + s0[0].prim + " with " + s1[0].prim);
            }

            return __spreadArray([annotateVar(s1[0])], __read(stack.slice(2)));
          }

        case "SLICE":
          return __spreadArray([annotateVar({
            prim: "option",
            args: [args(0, ["nat"], ["nat"], ["string", "bytes"])[2]]
          }, "@slice")], __read(stack.slice(3)));

        case "PACK":
          {
            var s_15 = args(0, null)[0];
            ensurePackableType(s_15);
            return __spreadArray([annotateVar({
              prim: "bytes"
            }, "@packed")], __read(stack.slice(1)));
          }

        case "ADD":
          {
            var s_16 = args(0, ["nat", "int", "timestamp", "mutez", "bls12_381_g1", "bls12_381_g2", "bls12_381_fr"], ["nat", "int", "timestamp", "mutez", "bls12_381_g1", "bls12_381_g2", "bls12_381_fr"]);

            if (s_16[0].prim === "nat" && s_16[1].prim === "int" || s_16[0].prim === "int" && s_16[1].prim === "nat") {
              return __spreadArray([annotateVar({
                prim: "int"
              })], __read(stack.slice(2)));
            } else if (s_16[0].prim === "int" && s_16[1].prim === "timestamp" || s_16[0].prim === "timestamp" && s_16[1].prim === "int") {
              return __spreadArray([annotateVar({
                prim: "timestamp"
              })], __read(stack.slice(2)));
            } else if ((s_16[0].prim === "int" || s_16[0].prim === "nat" || s_16[0].prim === "mutez" || s_16[0].prim === "bls12_381_g1" || s_16[0].prim === "bls12_381_g2" || s_16[0].prim === "bls12_381_fr") && s_16[0].prim === s_16[1].prim) {
              return __spreadArray([annotateVar(s_16[0])], __read(stack.slice(2)));
            }

            throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": can't add " + s_16[0].prim + " to " + s_16[1].prim);
          }

        case "SUB":
          {
            var s_17 = args(0, ["nat", "int", "timestamp", "mutez"], ["nat", "int", "timestamp", "mutez"]);

            if ((s_17[0].prim === "nat" || s_17[0].prim === "int") && (s_17[1].prim === "nat" || s_17[1].prim === "int") || s_17[0].prim === "timestamp" && s_17[1].prim === "timestamp") {
              return __spreadArray([annotateVar({
                prim: "int"
              })], __read(stack.slice(2)));
            } else if (s_17[0].prim === "timestamp" && s_17[1].prim === "int") {
              return __spreadArray([annotateVar({
                prim: "timestamp"
              })], __read(stack.slice(2)));
            } else if (s_17[0].prim === "mutez" && s_17[1].prim === "mutez") {
              return __spreadArray([annotateVar({
                prim: "mutez"
              })], __read(stack.slice(2)));
            }

            throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": can't subtract " + s_17[0].prim + " from " + s_17[1].prim);
          }

        case "MUL":
          {
            var s_18 = args(0, ["nat", "int", "mutez", "bls12_381_g1", "bls12_381_g2", "bls12_381_fr"], ["nat", "int", "mutez", "bls12_381_g1", "bls12_381_g2", "bls12_381_fr"]);

            if (s_18[0].prim === "nat" && s_18[1].prim === "int" || s_18[0].prim === "int" && s_18[1].prim === "nat") {
              return __spreadArray([annotateVar({
                prim: "int"
              })], __read(stack.slice(2)));
            } else if (s_18[0].prim === "nat" && s_18[1].prim === "mutez" || s_18[0].prim === "mutez" && s_18[1].prim === "nat") {
              return __spreadArray([annotateVar({
                prim: "mutez"
              })], __read(stack.slice(2)));
            } else if ((s_18[0].prim === "bls12_381_g1" || s_18[0].prim === "bls12_381_g2" || s_18[0].prim === "bls12_381_fr") && s_18[1].prim === "bls12_381_fr" || (s_18[0].prim === "nat" || s_18[0].prim === "int") && s_18[0].prim === s_18[1].prim) {
              return __spreadArray([annotateVar(s_18[0])], __read(stack.slice(2)));
            } else if ((s_18[0].prim === "nat" || s_18[0].prim === "int") && s_18[1].prim === "bls12_381_fr" || (s_18[1].prim === "nat" || s_18[1].prim === "int") && s_18[0].prim === "bls12_381_fr") {
              return __spreadArray([annotateVar({
                prim: "bls12_381_fr"
              })], __read(stack.slice(2)));
            }

            throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": can't multiply " + s_18[0].prim + " by " + s_18[1].prim);
          }

        case "EDIV":
          {
            var res = function (a, b) {
              return {
                prim: "option",
                args: [{
                  prim: "pair",
                  args: [{
                    prim: a
                  }, {
                    prim: b
                  }]
                }]
              };
            };

            var s_19 = args(0, ["nat", "int", "mutez"], ["nat", "int", "mutez"]);

            if (s_19[0].prim === "nat" && s_19[1].prim === "nat") {
              return __spreadArray([annotateVar(res("nat", "nat"))], __read(stack.slice(2)));
            } else if ((s_19[0].prim === "nat" || s_19[0].prim === "int") && (s_19[1].prim === "nat" || s_19[1].prim === "int")) {
              return __spreadArray([annotateVar(res("int", "nat"))], __read(stack.slice(2)));
            } else if (s_19[0].prim === "mutez" && s_19[1].prim === "nat") {
              return __spreadArray([annotateVar(res("mutez", "mutez"))], __read(stack.slice(2)));
            } else if (s_19[0].prim === "mutez" && s_19[1].prim === "mutez") {
              return __spreadArray([annotateVar(res("nat", "mutez"))], __read(stack.slice(2)));
            }

            throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": can't euclideally divide " + s_19[0].prim + " by " + s_19[1].prim);
          }

        case "ABS":
          args(0, ["int"]);
          return __spreadArray([annotateVar({
            prim: "nat"
          })], __read(stack.slice(1)));

        case "ISNAT":
          args(0, ["int"]);
          return __spreadArray([annotateVar({
            prim: "option",
            args: [{
              prim: "nat"
            }]
          })], __read(stack.slice(1)));

        case "INT":
          args(0, ["nat", "bls12_381_fr"]);
          return __spreadArray([annotateVar({
            prim: "int"
          })], __read(stack.slice(1)));

        case "NEG":
          {
            var s_20 = args(0, ["nat", "int", "bls12_381_g1", "bls12_381_g2", "bls12_381_fr"])[0];

            if (s_20.prim === "nat" || s_20.prim === "int") {
              return __spreadArray([annotateVar({
                prim: "int"
              })], __read(stack.slice(1)));
            }

            return __spreadArray([annotateVar(s_20)], __read(stack.slice(1)));
          }

        case "LSL":
        case "LSR":
          args(0, ["nat"], ["nat"]);
          return __spreadArray([annotateVar({
            prim: "nat"
          })], __read(stack.slice(2)));

        case "OR":
        case "XOR":
          {
            var s_21 = args(0, ["nat", "bool"], ["nat", "bool"]);

            if (s_21[0].prim !== s_21[1].prim) {
              throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": both arguments must be of the same type: " + s_21[0].prim + ", " + s_21[1].prim);
            }

            return __spreadArray([annotateVar(s_21[1])], __read(stack.slice(2)));
          }

        case "AND":
          {
            var s_22 = args(0, ["nat", "bool", "int"], ["nat", "bool"]);

            if ((s_22[0].prim !== "int" || s_22[1].prim !== "nat") && s_22[0].prim !== s_22[1].prim) {
              throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": both arguments must be of the same type: " + s_22[0].prim + ", " + s_22[1].prim);
            }

            return __spreadArray([annotateVar(s_22[1])], __read(stack.slice(2)));
          }

        case "NOT":
          {
            var s_23 = args(0, ["nat", "bool", "int"])[0];

            if (s_23.prim === "bool") {
              return __spreadArray([annotateVar({
                prim: "bool"
              })], __read(stack.slice(1)));
            }

            return __spreadArray([annotateVar({
              prim: "int"
            })], __read(stack.slice(1)));
          }

        case "COMPARE":
          {
            var s_24 = args(0, null, null);
            ensureComparableType(s_24[0]);
            ensureComparableType(s_24[1]);
            return __spreadArray([annotateVar({
              prim: "int"
            })], __read(stack.slice(2)));
          }

        case "EQ":
        case "NEQ":
        case "LT":
        case "GT":
        case "LE":
        case "GE":
          args(0, ["int"]);
          return __spreadArray([annotateVar({
            prim: "bool"
          })], __read(stack.slice(1)));

        case "SELF":
          {
            if ((ctx === null || ctx === void 0 ? void 0 : ctx.contract) === undefined) {
              throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": contract required");
            }

            var ia = instructionAnn({
              f: 1,
              v: 1
            });
            var ep = contractEntryPoint(ctx.contract, (_d = ia.f) === null || _d === void 0 ? void 0 : _d[0]);

            if (ep === null) {
              throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": contract has no entrypoint " + ep);
            }

            return __spreadArray([annotate({
              prim: "contract",
              args: [ep]
            }, {
              v: ia.v ? ia.v : ["@self"]
            })], __read(stack));
          }

        case "TRANSFER_TOKENS":
          {
            var s_25 = args(0, null, ["mutez"], ["contract"]);
            ensureTypesEqual(s_25[0], s_25[2].args[0]);
            return __spreadArray([annotateVar({
              prim: "operation"
            })], __read(stack.slice(3)));
          }

        case "SET_DELEGATE":
          {
            var s_26 = args(0, ["option"])[0];

            if (typeID(s_26.args[0]) !== "key_hash") {
              throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": key hash expected: " + typeID(s_26.args[0]));
            }

            return __spreadArray([annotateVar({
              prim: "operation"
            })], __read(stack.slice(1)));
          }

        case "IMPLICIT_ACCOUNT":
          args(0, ["key_hash"]);
          return __spreadArray([annotateVar({
            prim: "contract",
            args: [{
              prim: "unit"
            }]
          })], __read(stack.slice(1)));

        case "NOW":
          return __spreadArray([annotateVar({
            prim: "timestamp"
          }, "@now")], __read(stack));

        case "AMOUNT":
          return __spreadArray([annotateVar({
            prim: "mutez"
          }, "@amount")], __read(stack));

        case "BALANCE":
          return __spreadArray([annotateVar({
            prim: "mutez"
          }, "@balance")], __read(stack));

        case "CHECK_SIGNATURE":
          args(0, ["key"], ["signature"], ["bytes"]);
          return __spreadArray([annotateVar({
            prim: "bool"
          })], __read(stack.slice(3)));

        case "BLAKE2B":
        case "SHA256":
        case "SHA512":
        case "KECCAK":
        case "SHA3":
          args(0, ["bytes"]);
          return __spreadArray([annotateVar({
            prim: "bytes"
          })], __read(stack.slice(1)));

        case "HASH_KEY":
          args(0, ["key"]);
          return __spreadArray([annotateVar({
            prim: "key_hash"
          })], __read(stack.slice(1)));

        case "SOURCE":
          return __spreadArray([annotateVar({
            prim: "address"
          }, "@source")], __read(stack));

        case "SENDER":
          return __spreadArray([annotateVar({
            prim: "address"
          }, "@sender")], __read(stack));

        case "ADDRESS":
          {
            var s_27 = args(0, ["contract"])[0];
            var ia = instructionAnn({
              v: 1
            });
            return __spreadArray([annotate((_a = {
              prim: "address"
            }, _a[refContract] = s_27, _a), {
              v: ia.v ? ia.v : varSuffix(argAnn(s_27), "address")
            })], __read(stack.slice(1)));
          }

        case "SELF_ADDRESS":
          {
            var addr = {
              prim: "address"
            };

            if ((ctx === null || ctx === void 0 ? void 0 : ctx.contract) !== undefined) {
              addr[refContract] = {
                prim: "contract",
                args: [contractSection(ctx.contract, "parameter").args[0]]
              };
            }

            return __spreadArray([annotateVar(addr, "@address")], __read(stack));
          }

        case "CHAIN_ID":
          return __spreadArray([annotateVar({
            prim: "chain_id"
          })], __read(stack));

        case "DROP":
          {
            instructionAnn({});
            var n = instruction.args !== undefined ? parseInt(instruction.args[0].int, 10) : 1;
            args(n - 1, null);
            return stack.slice(n);
          }

        case "DIG":
          {
            instructionAnn({});
            var n = parseInt(instruction.args[0].int, 10);
            return __spreadArray(__spreadArray([args(n, null)[0]], __read(stack.slice(0, n))), __read(stack.slice(n + 1)));
          }

        case "DUG":
          {
            instructionAnn({});
            var n = parseInt(instruction.args[0].int, 10);
            return __spreadArray(__spreadArray(__spreadArray([], __read(stack.slice(1, n + 1))), [args(0, null)[0]]), __read(stack.slice(n + 1)));
          }

        case "NONE":
          assertTypeAnnotationsValid(instruction.args[0]);
          return __spreadArray([annotate({
            prim: "option",
            args: [instruction.args[0]]
          }, instructionAnn({
            t: 1,
            v: 1
          }))], __read(stack));

        case "LEFT":
        case "RIGHT":
          {
            var s_28 = args(0, null)[0];
            var ia = instructionAnn({
              f: 2,
              t: 1,
              v: 1
            }, {
              specialFields: true
            });
            var va = argAnn(s_28);
            var children = [annotate(s_28, {
              t: null,
              v: null,
              f: ia.f && ia.f.length > 0 && ia.f[0] !== "%" ? ia.f[0] === "%@" ? va.v ? ["%" + va.v[0].slice(1)] : undefined : ia.f : undefined
            }), annotate(instruction.args[0], {
              t: null,
              f: ia.f && ia.f.length > 1 && ia.f[1] !== "%" ? ia.f : undefined
            })];
            return __spreadArray([annotate({
              prim: "or",
              args: instruction.prim === "LEFT" ? children : [children[1], children[0]]
            }, {
              t: ia.t,
              v: ia.v
            })], __read(stack.slice(1)));
          }

        case "NIL":
          assertTypeAnnotationsValid(instruction.args[0]);
          return __spreadArray([annotate({
            prim: "list",
            args: [instruction.args[0]]
          }, instructionAnn({
            t: 1,
            v: 1
          }))], __read(stack));

        case "UNPACK":
          args(0, ["bytes"]);
          assertTypeAnnotationsValid(instruction.args[0]);
          return __spreadArray([annotateVar({
            prim: "option",
            args: [instruction.args[0]]
          }, "@unpacked")], __read(stack.slice(1)));

        case "CONTRACT":
          {
            var s_29 = args(0, ["address"])[0];
            assertTypeAnnotationsValid(instruction.args[0]);
            var ia = instructionAnn({
              v: 1,
              f: 1
            });
            var contract = s_29[refContract];

            if (contract !== undefined) {
              var ep = contractEntryPoint(contract, (_e = ia.f) === null || _e === void 0 ? void 0 : _e[0]);

              if (ep === null) {
                throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": contract has no entrypoint " + ep);
              }

              ensureTypesEqual(ep, instruction.args[0]);
            }

            return __spreadArray([annotate({
              prim: "option",
              args: [{
                prim: "contract",
                args: [instruction.args[0]]
              }]
            }, {
              v: ia.v ? ia.v : varSuffix(argAnn(s_29), "contract")
            })], __read(stack.slice(1)));
          }

        case "CAST":
          instructionAnn({});
          var s = args(0, null)[0];
          assertTypeAnnotationsValid(instruction.args[0]);
          ensureTypesEqual(instruction.args[0], s);
          return __spreadArray([instruction.args[0]], __read(stack.slice(1)));

        case "IF_NONE":
          {
            instructionAnn({});
            var s_30 = args(0, ["option"])[0];
            var tail = stack.slice(1);
            var br0 = functionTypeInternal(instruction.args[0], tail, ctx);
            var br1 = functionTypeInternal(instruction.args[1], __spreadArray([annotate(s_30.args[0], {
              t: null,
              v: varSuffix(argAnn(s_30), "some")
            })], __read(tail)), ctx);
            return branchType(br0, br1);
          }

        case "IF_LEFT":
          {
            instructionAnn({});
            var s_31 = args(0, ["or"])[0];
            var va = argAnn(s_31);
            var lefta = argAnn(s_31.args[0]);
            var righta = argAnn(s_31.args[1]);
            var tail = stack.slice(1);
            var br0 = functionTypeInternal(instruction.args[0], __spreadArray([annotate(s_31.args[0], {
              t: null,
              v: varSuffix(va, lefta.f ? lefta.f[0].slice(1) : "left")
            })], __read(tail)), ctx);
            var br1 = functionTypeInternal(instruction.args[1], __spreadArray([annotate(s_31.args[1], {
              t: null,
              v: varSuffix(va, righta.f ? righta.f[0].slice(1) : "right")
            })], __read(tail)), ctx);
            return branchType(br0, br1);
          }

        case "IF_CONS":
          {
            instructionAnn({});
            var s_32 = args(0, ["list"])[0];
            var va = argAnn(s_32);
            var tail = stack.slice(1);
            var br0 = functionTypeInternal(instruction.args[0], __spreadArray([annotate(s_32.args[0], {
              t: null,
              v: varSuffix(va, "hd")
            }), annotate(s_32, {
              t: null,
              v: varSuffix(va, "tl")
            })], __read(tail)), ctx);
            var br1 = functionTypeInternal(instruction.args[1], tail, ctx);
            return branchType(br0, br1);
          }

        case "IF":
          {
            instructionAnn({});
            args(0, ["bool"]);
            var tail = stack.slice(1);
            var br0 = functionTypeInternal(instruction.args[0], tail, ctx);
            var br1 = functionTypeInternal(instruction.args[1], tail, ctx);
            return branchType(br0, br1);
          }

        case "MAP":
          {
            var s_33 = args(0, ["list", "map"])[0];
            var tail = stack.slice(1);
            var elt = s_33.prim === "map" ? {
              prim: "pair",
              args: s_33.args
            } : s_33.args[0];
            var body = functionTypeInternal(instruction.args[0], __spreadArray([annotate(elt, {
              t: null,
              v: varSuffix(argAnn(s_33), "elt")
            })], __read(tail)), ctx);

            if ("failed" in body) {
              return body;
            }

            if (body.length < 1) {
              throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": function must return a value");
            }

            ensureStacksEqual(body.slice(1), tail);

            if (s_33.prim === "list") {
              return __spreadArray([annotateVar({
                prim: "list",
                args: [body[0]]
              })], __read(tail));
            }

            return __spreadArray([annotateVar({
              prim: "map",
              args: [s_33.args[0], body[0]]
            })], __read(tail));
          }

        case "ITER":
          {
            instructionAnn({});
            var s_34 = args(0, ["set", "list", "map"])[0];
            var tail = stack.slice(1);
            var elt = s_34.prim === "map" ? {
              prim: "pair",
              args: s_34.args
            } : s_34.args[0];
            var body = functionTypeInternal(instruction.args[0], __spreadArray([annotate(elt, {
              t: null,
              v: varSuffix(argAnn(s_34), "elt")
            })], __read(tail)), ctx);

            if ("failed" in body) {
              return body;
            }

            ensureStacksEqual(body, tail);
            return tail;
          }

        case "LOOP":
          {
            instructionAnn({});
            args(0, ["bool"]);
            var tail = stack.slice(1);
            var body = functionTypeInternal(instruction.args[0], tail, ctx);

            if ("failed" in body) {
              return body;
            }

            ensureStacksEqual(body, __spreadArray([{
              prim: "bool"
            }], __read(tail)));
            return tail;
          }

        case "LOOP_LEFT":
          {
            instructionAnn({});
            var s_35 = args(0, ["or"])[0];
            var tail = stack.slice(1);
            var body = functionTypeInternal(instruction.args[0], __spreadArray([annotate(s_35.args[0], {
              t: null,
              v: varSuffix(argAnn(s_35), "left")
            })], __read(tail)), ctx);

            if ("failed" in body) {
              return body;
            }

            ensureStacksEqual(body, __spreadArray([s_35], __read(tail)));
            return __spreadArray([annotate(s_35.args[1], {
              t: null,
              v: instructionAnn({
                v: 1
              }).v
            })], __read(tail));
          }

        case "DIP":
          {
            instructionAnn({});
            var n = instruction.args.length === 2 ? parseInt(instruction.args[0].int, 10) : 1;
            args(n - 1, null);
            var head = stack.slice(0, n);
            var tail = stack.slice(n); // ternary operator is a type guard so use it instead of just `instruction.args.length - 1`

            var body = instruction.args.length === 2 ? functionTypeInternal(instruction.args[1], tail, ctx) : functionTypeInternal(instruction.args[0], tail, ctx);

            if ("failed" in body) {
              return body;
            }

            return __spreadArray(__spreadArray([], __read(head)), __read(body));
          }

        case "CREATE_CONTRACT":
          {
            var ia = instructionAnn({
              v: 2
            });
            var s_36 = args(0, ["option"], ["mutez"], null);

            if (typeID(s_36[0].args[0]) !== "key_hash") {
              throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": key hash expected: " + typeID(s_36[0].args[0]));
            }

            if (ensureStorableType(s_36[2])) {
              assertContractValid(instruction.args[0]);
              assertScalarTypesEqual(contractSection(instruction.args[0], "storage").args[0], s_36[2]);
            }

            var va = (_f = ia.v) === null || _f === void 0 ? void 0 : _f.map(function (v) {
              return v !== "@" ? [v] : undefined;
            });
            return __spreadArray([annotate({
              prim: "operation"
            }, {
              v: va === null || va === void 0 ? void 0 : va[0]
            }), annotate((_b = {
              prim: "address"
            }, _b[refContract] = {
              prim: "contract",
              args: [contractSection(instruction.args[0], "parameter").args[0]]
            }, _b), {
              v: va === null || va === void 0 ? void 0 : va[1]
            })], __read(stack.slice(3)));
          }

        case "PUSH":
          assertTypeAnnotationsValid(instruction.args[0]);
          assertDataValidInternal(instruction.args[1], instruction.args[0], __assign(__assign({}, ctx), {
            contract: undefined
          }));
          return __spreadArray([annotateVar(instruction.args[0])], __read(stack));

        case "EMPTY_SET":
          assertTypeAnnotationsValid(instruction.args[0]);
          ensureComparableType(instruction.args[0]);
          return __spreadArray([annotate({
            prim: "set",
            args: instruction.args
          }, instructionAnn({
            t: 1,
            v: 1
          }))], __read(stack));

        case "EMPTY_MAP":
          assertTypeAnnotationsValid(instruction.args[0]);
          ensureComparableType(instruction.args[0]);
          assertTypeAnnotationsValid(instruction.args[1]);
          return __spreadArray([annotate({
            prim: "map",
            args: instruction.args
          }, instructionAnn({
            t: 1,
            v: 1
          }))], __read(stack));

        case "EMPTY_BIG_MAP":
          assertTypeAnnotationsValid(instruction.args[0]);
          ensureComparableType(instruction.args[0]);
          assertTypeAnnotationsValid(instruction.args[1]);
          ensureBigMapStorableType(instruction.args[0]);
          return __spreadArray([annotate({
            prim: "big_map",
            args: instruction.args
          }, instructionAnn({
            t: 1,
            v: 1
          }))], __read(stack));

        case "LAMBDA":
          {
            assertTypeAnnotationsValid(instruction.args[0]);
            assertTypeAnnotationsValid(instruction.args[1]);
            var body = functionTypeInternal(instruction.args[2], [instruction.args[0]], __assign(__assign({}, ctx), {
              contract: undefined
            }));

            if ("failed" in body) {
              return body;
            }

            if (body.length !== 1) {
              throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": function must return a value");
            }

            ensureTypesEqual(instruction.args[1], body[0]);
            return __spreadArray([annotateVar({
              prim: "lambda",
              args: [instruction.args[0], instruction.args[1]]
            })], __read(stack));
          }

        case "LEVEL":
          return __spreadArray([annotateVar({
            prim: "nat"
          }, "@level")], __read(stack));

        case "TOTAL_VOTING_POWER":
          return __spreadArray([annotateVar({
            prim: "nat"
          })], __read(stack));

        case "VOTING_POWER":
          args(0, ["key_hash"]);
          return __spreadArray([annotateVar({
            prim: "nat"
          })], __read(stack.slice(1)));

        case "TICKET":
          {
            var s_37 = args(0, null, ["nat"])[0];
            ensureComparableType(s_37);
            return __spreadArray([annotate({
              prim: "ticket",
              args: [s_37]
            }, instructionAnn({
              t: 1,
              v: 1
            }))], __read(stack.slice(2)));
          }

        case "JOIN_TICKETS":
          {
            var s_38 = unpackComb("pair", args(0, ["pair"])[0]);

            if (typeID(s_38.args[0]) !== "ticket") {
              throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": ticket expected: " + typeID(s_38.args[0]));
            }

            ensureTypesEqual(s_38.args[0], s_38.args[1]);
            return __spreadArray([annotateVar({
              prim: "option",
              args: [annotate(s_38.args[0], {
                t: null
              })]
            })], __read(stack.slice(1)));
          }

        case "SPLIT_TICKET":
          {
            var s_39 = args(0, ["ticket"], ["pair"]);
            var p = unpackComb("pair", s_39[1]);

            if (typeID(p.args[0]) !== "nat") {
              throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": nat expected: " + typeID(p.args[0]));
            }

            ensureTypesEqual(p.args[0], p.args[1]);
            return __spreadArray([annotateVar({
              prim: "option",
              args: [{
                prim: "pair",
                args: [annotate(s_39[0], {
                  t: null
                }), annotate(s_39[0], {
                  t: null
                })]
              }]
            })], __read(stack.slice(2)));
          }

        case "READ_TICKET":
          {
            var ia = instructionAnn({
              v: 2
            });
            var s_40 = args(0, ["ticket"])[0];
            var va = (_g = ia.v) === null || _g === void 0 ? void 0 : _g.map(function (v) {
              return v !== "@" ? [v] : undefined;
            });
            return __spreadArray([annotate({
              prim: "pair",
              args: [{
                prim: "address"
              }, annotate(s_40.args[0], {
                t: null
              }), {
                prim: "nat"
              }]
            }, {
              v: va === null || va === void 0 ? void 0 : va[0]
            }), annotate(s_40, {
              v: va === null || va === void 0 ? void 0 : va[1],
              t: null
            })], __read(stack.slice(1)));
          }

        case "PAIRING_CHECK":
          {
            var p = args(0, ["list"])[0].args[0];

            if (!isPairType(p)) {
              throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": pair expected: " + typeID(p));
            }

            var c = unpackComb("pair", p);

            if (typeID(c.args[0]) !== "bls12_381_g1") {
              throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": bls12_381_g1 expected: " + typeID(c.args[0]));
            }

            if (typeID(c.args[1]) !== "bls12_381_g2") {
              throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": bls12_381_g2 expected: " + typeID(c.args[1]));
            }

            return __spreadArray([annotateVar({
              prim: "bool"
            })], __read(stack.slice(1)));
          }

        case "SAPLING_EMPTY_STATE":
          return __spreadArray([annotate({
            prim: "sapling_state",
            args: [instruction.args[0]]
          }, instructionAnn({
            v: 1,
            t: 1
          }))], __read(stack));

        case "SAPLING_VERIFY_UPDATE":
          {
            var s_41 = args(0, ["sapling_transaction"], ["sapling_state"]);

            if (parseInt(s_41[0].args[0].int, 10) !== parseInt(s_41[1].args[0].int, 10)) {
              throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": sapling memo size mismatch: " + s_41[0].args[0].int + " != " + s_41[1].args[0].int);
            }

            return __spreadArray([annotateVar({
              prim: "option",
              args: [{
                prim: "pair",
                args: [{
                  prim: "int"
                }, annotate(s_41[1], {
                  t: null
                })]
              }]
            })], __read(stack.slice(2)));
          }

        default:
          throw new MichelsonError(instruction, "unexpected instruction: " + instruction.prim);
      }
    }(instruction);

    if ((ctx === null || ctx === void 0 ? void 0 : ctx.traceCallback) !== undefined) {
      var trace = {
        op: instruction,
        in: stack,
        out: retStack
      };
      ctx.traceCallback(trace);
    }

    return retStack;
  }

  function contractSection(contract, section) {
    var e_8, _a;

    try {
      for (var contract_1 = __values(contract), contract_1_1 = contract_1.next(); !contract_1_1.done; contract_1_1 = contract_1.next()) {
        var s = contract_1_1.value;

        if (s.prim === section) {
          return s;
        }
      }
    } catch (e_8_1) {
      e_8 = {
        error: e_8_1
      };
    } finally {
      try {
        if (contract_1_1 && !contract_1_1.done && (_a = contract_1.return)) _a.call(contract_1);
      } finally {
        if (e_8) throw e_8.error;
      }
    }

    throw new MichelsonError(contract, "missing contract section: " + section);
  }

  function isContract(v) {
    var e_9, _a;

    if (Array.isArray(v)) {
      try {
        for (var v_1 = __values(v), v_1_1 = v_1.next(); !v_1_1.done; v_1_1 = v_1.next()) {
          var s = v_1_1.value;

          if ("prim" in s && (s.prim === "parameter" || s.prim === "storage" || s.prim === "code")) {
            return true;
          }
        }
      } catch (e_9_1) {
        e_9 = {
          error: e_9_1
        };
      } finally {
        try {
          if (v_1_1 && !v_1_1.done && (_a = v_1.return)) _a.call(v_1);
        } finally {
          if (e_9) throw e_9.error;
        }
      }
    }

    return false;
  }

  function contractEntryPoint(src, ep) {
    ep = ep || "%default";
    var entryPoint = contractEntryPoints(src).find(function (x) {
      return x[0] === ep;
    });

    if (entryPoint !== undefined) {
      return entryPoint[1];
    } else if (ep === "%default") {
      return isContract(src) ? contractSection(src, "parameter").args[0] : src;
    }

    return null;
  }

  function isOrType(t) {
    return Array.isArray(t) || t.prim === "or";
  }

  function contractEntryPoints(src) {
    if (isContract(src)) {
      var param = contractSection(src, "parameter");
      var ch = contractEntryPoints(param.args[0]);
      var a = unpackAnnotations(param);
      return a.f ? __spreadArray([[a.f[0], param.args[0]]], __read(ch)) : ch;
    }

    if (isOrType(src)) {
      var args_2 = typeArgs(src);

      var getArg = function (n) {
        var a = unpackAnnotations(args_2[n]);

        if (typeID(args_2[n]) === "or") {
          var ch = contractEntryPoints(args_2[n]);
          return a.f ? __spreadArray([[a.f[0], args_2[n]]], __read(ch)) : ch;
        }

        return a.f ? [[a.f[0], args_2[n]]] : [];
      };

      return __spreadArray(__spreadArray([], __read(getArg(0))), __read(getArg(1)));
    }

    return [];
  } // Contract validation


  function assertContractValid(contract, ctx) {
    var parameter = contractSection(contract, "parameter").args[0];
    assertTypeAnnotationsValid(parameter, true);
    var storage = contractSection(contract, "storage").args[0];
    assertTypeAnnotationsValid(storage);
    var arg = {
      "prim": "pair",
      args: [__assign(__assign({}, parameter), {
        annots: ["@parameter"]
      }), __assign(__assign({}, storage), {
        annots: ["@storage"]
      })]
    };
    var code = contractSection(contract, "code").args[0];
    var ret = functionTypeInternal(code, [arg], __assign(__assign({}, ctx), {
      contract: contract
    }));

    if ("failed" in ret) {
      return ret;
    }

    var expected = {
      "prim": "pair",
      args: [{
        "prim": "list",
        args: [{
          "prim": "operation"
        }]
      }, storage]
    };

    try {
      assertStacksEqual(ret, [expected]);
    } catch (err) {
      if (err instanceof MichelsonError) {
        throw new MichelsonInstructionError(code, ret, err.message);
      } else {
        throw err;
      }
    }

    return ret;
  } // Exported wrapper functions


  function assertDataValid(d, t, ctx) {
    assertTypeAnnotationsValid(t);
    assertDataValidInternal(d, t, ctx || null);
  }

  function functionType(inst, stack, ctx) {
    var e_10, _a, e_11, _b;

    try {
      for (var stack_1 = __values(stack), stack_1_1 = stack_1.next(); !stack_1_1.done; stack_1_1 = stack_1.next()) {
        var t = stack_1_1.value;
        assertTypeAnnotationsValid(t);
      }
    } catch (e_10_1) {
      e_10 = {
        error: e_10_1
      };
    } finally {
      try {
        if (stack_1_1 && !stack_1_1.done && (_a = stack_1.return)) _a.call(stack_1);
      } finally {
        if (e_10) throw e_10.error;
      }
    }

    if ((ctx === null || ctx === void 0 ? void 0 : ctx.contract) !== undefined) {
      try {
        for (var _c = __values(["parameter", "storage"]), _d = _c.next(); !_d.done; _d = _c.next()) {
          var typesec = _d.value;
          var sec = contractSection(ctx.contract, typesec).args[0];
          assertTypeAnnotationsValid(sec);
        }
      } catch (e_11_1) {
        e_11 = {
          error: e_11_1
        };
      } finally {
        try {
          if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
        } finally {
          if (e_11) throw e_11.error;
        }
      }
    }

    return functionTypeInternal(inst, stack, ctx || null);
  }

  function isDataValid(d, t, ctx) {
    try {
      assertDataValid(d, t, ctx);
      return true;
    } catch (_a) {
      return false;
    }
  }

  var Contract =
  /** @class */
  function () {
    function Contract(contract, opt) {
      this.contract = contract;
      this.ctx = __assign({
        contract: contract
      }, opt);
      this.output = assertContractValid(contract, this.ctx);
    }

    Contract.parse = function (src, opt) {
      var p = new Parser(opt);
      var expr = typeof src === "string" ? p.parseScript(src) : p.parseJSON(src);

      if (expr === null) {
        throw new Error("empty contract");
      }

      if (assertMichelsonContract(expr)) {
        return new Contract(expr, opt);
      }
    };

    Contract.parseTypeExpression = function (src, opt) {
      var p = new Parser(opt);
      var expr = typeof src === "string" ? p.parseScript(src) : p.parseJSON(src);

      if (expr === null) {
        throw new Error("empty type expression");
      }

      if (assertMichelsonType(expr) && assertTypeAnnotationsValid(expr)) {
        return expr;
      }

      throw undefined;
    };

    Contract.parseDataExpression = function (src, opt) {
      var p = new Parser(opt);
      var expr = typeof src === "string" ? p.parseScript(src) : p.parseJSON(src);

      if (expr === null) {
        throw new Error("empty data expression");
      }

      if (assertMichelsonData(expr)) {
        return expr;
      }

      throw undefined;
    };

    Contract.prototype.section = function (section) {
      return contractSection(this.contract, section);
    };

    Contract.prototype.entryPoints = function () {
      return contractEntryPoints(this.contract);
    };

    Contract.prototype.entryPoint = function (ep) {
      return contractEntryPoint(this.contract, ep);
    };

    Contract.prototype.assertDataValid = function (d, t) {
      assertDataValid(d, t, this.ctx);
    };

    Contract.prototype.isDataValid = function (d, t) {
      return isDataValid(d, t, this.ctx);
    };

    Contract.prototype.assertParameterValid = function (ep, d) {
      var t = this.entryPoint(ep || undefined);

      if (t === null) {
        throw new Error("contract has no entrypoint named " + ep);
      }

      this.assertDataValid(d, t);
    };

    Contract.prototype.isParameterValid = function (ep, d) {
      try {
        this.assertParameterValid(ep, d);
        return true;
      } catch (_a) {
        return false;
      }
    };

    Contract.prototype.functionType = function (inst, stack) {
      return functionType(inst, stack, this.ctx);
    };

    return Contract;
  }();

  new Contract([{
    prim: "parameter",
    args: [{
      prim: "unit"
    }]
  }, {
    prim: "storage",
    args: [{
      prim: "unit"
    }]
  }, {
    prim: "code",
    args: [[{
      prim: "CAR"
    }, {
      prim: "NIL",
      args: [{
        prim: "operation"
      }]
    }, {
      prim: "PAIR"
    }]]
  }]);

  const contractPaymentInTezSignPayloadMichelsonType = {
    prim: 'pair',
    args: [{
      prim: 'pair',
      args: [{
        prim: 'string'
      }, {
        prim: 'address'
      }]
    }, {
      prim: 'mutez'
    }]
  };
  const contractPaymentInAssetSignPayloadMichelsonType = {
    prim: 'pair',
    args: [{
      prim: 'pair',
      args: [{
        prim: 'pair',
        args: [{
          prim: 'string'
        }, {
          prim: 'address'
        }]
      }, {
        prim: 'pair',
        args: [{
          prim: 'nat'
        }, {
          prim: 'address'
        }]
      }]
    }, {
      prim: 'option',
      args: [{
        prim: 'nat'
      }]
    }]
  };

  class PaymentSignPayloadEncoder {
    encode(payment) {
      return {
        contractSignPayload: this.getContractSignPayload(payment),
        clientSignPayload: this.getClientSignPayload(payment)
      };
    }

    getContractSignPayload(payment) {
      const signPayload = payment.asset ? packDataBytes({
        prim: 'Pair',
        args: [{
          prim: 'Pair',
          args: [{
            prim: 'Pair',
            args: [{
              string: payment.id
            }, {
              string: payment.targetAddress
            }]
          }, {
            prim: 'Pair',
            args: [{
              int: tokensAmountToNat(payment.amount, payment.asset.decimals).toString(10)
            }, {
              string: payment.asset.address
            }]
          }]
        }, payment.asset.id !== undefined && payment.asset.id !== null ? {
          prim: 'Some',
          args: [{
            int: payment.asset.id.toString()
          }]
        } : {
          prim: 'None'
        }]
      }, contractPaymentInAssetSignPayloadMichelsonType) : packDataBytes({
        prim: 'Pair',
        args: [{
          prim: 'Pair',
          args: [{
            string: payment.id
          }, {
            string: payment.targetAddress
          }]
        }, {
          int: tezToMutez(payment.amount).toString(10)
        }]
      }, contractPaymentInTezSignPayloadMichelsonType);
      return '0x' + signPayload.bytes;
    }

    getClientSignPayload(payment) {
      return (payment.successUrl ? payment.successUrl.href : '') + (payment.cancelUrl ? payment.cancelUrl.href : '') || null;
    }

  }

  _defineProperty(PaymentSignPayloadEncoder, "contractPaymentInTezSignPayloadMichelsonType", contractPaymentInTezSignPayloadMichelsonType);

  _defineProperty(PaymentSignPayloadEncoder, "contractPaymentInAssetSignPayloadMichelsonType", contractPaymentInAssetSignPayloadMichelsonType);

  exports.Base64Deserializer = Base64Deserializer;
  exports.Base64Serializer = Base64Serializer;
  exports.Donation = Donation;
  exports.DonationDeserializer = DonationDeserializer;
  exports.DonationOperation = DonationOperation;
  exports.DonationSerializer = DonationSerializer;
  exports.DonationSignPayloadEncoder = DonationSignPayloadEncoder;
  exports.DonationValidator = DonationValidator;
  exports.Payment = Payment;
  exports.PaymentDeserializer = PaymentDeserializer;
  exports.PaymentSerializer = PaymentSerializer;
  exports.PaymentSignPayloadEncoder = PaymentSignPayloadEncoder;
  exports.PaymentValidator = PaymentValidator;
  exports.ServiceLinkHelper = ServiceLinkHelper;
  exports.StateModel = StateModel;
  exports.base64 = base64;
  exports.combineClassNames = clsx_m;
  exports.converters = converters;
  exports.emptyService = emptyService;
  exports.getEncodedPaymentUrlType = getEncodedPaymentUrlType;
  exports.getParameterizedRoute = getParameterizedRoute;
  exports.guards = guards;
  exports.memoize = memoize;
  exports.native = index;
  exports.networkIdRegExp = networkIdRegExp;
  exports.networkNameRegExp = networkNameRegExp;
  exports.networks = networks;
  exports.networksCollection = networksCollection;
  exports.optimization = optimization;
  exports.shallowEqual = shallowEqual;
  exports.text = text;
  exports.tezosInfo = tezosInfo;
  exports.tezosMeta = tezosMeta;
  exports.tokenWhitelist = tokenWhitelist;
  exports.tokenWhitelistMap = tokenWhitelistMap;
  exports.unknownAssetMeta = unknownAssetMeta;
  exports.wait = wait;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.umd.js.map
