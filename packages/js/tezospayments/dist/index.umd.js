(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('libsodium-wrappers'), require('@taquito/signer')) :
  typeof define === 'function' && define.amd ? define(['exports', 'libsodium-wrappers', '@taquito/signer'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.tezosPayments = {}, global.sodium, global.taquitoSigner));
})(this, (function (exports, sodium, signer) { 'use strict';

  var constants = {
    defaultNetworkName: 'mainnet',
    paymentAppBaseUrl: 'https://payment.tezospayments.com'
  };

  function _defineProperty$1(obj, key, value) {
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

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function getAugmentedNamespace(n) {
  	if (n.__esModule) return n;
  	var a = Object.defineProperty({}, '__esModule', {value: true});
  	Object.keys(n).forEach(function (k) {
  		var d = Object.getOwnPropertyDescriptor(n, k);
  		Object.defineProperty(a, k, d.get ? d : {
  			enumerable: true,
  			get: function () {
  				return n[k];
  			}
  		});
  	});
  	return a;
  }

  function commonjsRequire (path) {
  	throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
  }

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

    Buffer.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value) {
      let offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'));
    });
    Buffer.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value) {
      let offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
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

    Buffer.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value) {
      let offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      return wrtBigUInt64LE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'));
    });
    Buffer.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value) {
      let offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
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

          this.name = "".concat(this.name, " [").concat(sym, "]"); // Access the stack to generate the error message including the error code
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
          return "".concat(this.name, " [").concat(sym, "]: ").concat(this.message);
        }

      };
    }

    E('ERR_BUFFER_OUT_OF_BOUNDS', function (name) {
      if (name) {
        return "".concat(name, " is outside of buffer bounds");
      }

      return 'Attempt to access memory outside buffer bounds';
    }, RangeError);
    E('ERR_INVALID_ARG_TYPE', function (name, actual) {
      return "The \"".concat(name, "\" argument must be of type number. Received type ").concat(typeof actual);
    }, TypeError);
    E('ERR_OUT_OF_RANGE', function (str, range, input) {
      let msg = "The value of \"".concat(str, "\" is out of range.");
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

      msg += " It must be ".concat(range, ". Received ").concat(received);
      return msg;
    }, RangeError);

    function addNumericalSeparator(val) {
      let res = '';
      let i = val.length;
      const start = val[0] === '-' ? 1 : 0;

      for (; i >= start + 4; i -= 3) {
        res = "_".concat(val.slice(i - 3, i)).concat(res);
      }

      return "".concat(val.slice(0, i)).concat(res);
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
            range = ">= 0".concat(n, " and < 2").concat(n, " ** ").concat((byteLength + 1) * 8).concat(n);
          } else {
            range = ">= -(2".concat(n, " ** ").concat((byteLength + 1) * 8 - 1).concat(n, ") and < 2 ** ") + "".concat((byteLength + 1) * 8 - 1).concat(n);
          }
        } else {
          range = ">= ".concat(min).concat(n, " and <= ").concat(max).concat(n);
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

      throw new errors.ERR_OUT_OF_RANGE(type || 'offset', ">= ".concat(type ? 1 : 0, " and <= ").concat(length), value);
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

  var bignumber = {exports: {}};

  (function (module) {

    (function (globalObject) {
      /*
       *      bignumber.js v9.0.2
       *      A JavaScript library for arbitrary-precision arithmetic.
       *      https://github.com/MikeMcl/bignumber.js
       *      Copyright (c) 2021 Michael Mclaughlin <M8ch88l@gmail.com>
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
        ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz',
            alphabetHasNormalDecimalDigits = true; //------------------------------------------------------------------------------------------
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

            if (b == 10 && alphabetHasNormalDecimalDigits) {
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
                  alphabetHasNormalDecimalDigits = v.slice(0, 10) == '0123456789';
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
            } else if (b === 10 && alphabetHasNormalDecimalDigits) {
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

  var decode$1 = function (qs, sep, eq, options) {
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

  var encode$1 = function (obj, sep, eq, name) {
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

  querystring$1.decode = querystring$1.parse = decode$1;
  querystring$1.encode = querystring$1.stringify = encode$1;

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
  /** @deprecated */


  function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));

    return ar;
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
    Protocol["Ps9mPmXa"] = "Ps9mPmXaRzmzk35gbAYNCAw6UXdE2qoABTHbN2oEEc1qM7CwT9P";
    Protocol["PtCJ7pwo"] = "PtCJ7pwoxe8JasnHY8YonnLYjcVHmhiARPJvqcC6VfHT5s8k8sY";
    Protocol["PsYLVpVv"] = "PsYLVpVvgbLhAhoqAkMFUo6gudkJ9weNXhUYCiLDzcUpFpkk8Wt";
    Protocol["PsddFKi3"] = "PsddFKi32cMJ2qPjf43Qv5GDWLDPZb3T3bF6fLKiF5HtvHNU7aP";
    Protocol["Pt24m4xi"] = "Pt24m4xiPbLDhVgVfABUjirbmda3yohdN82Sp9FeuAXJ4eV9otd";
    Protocol["PsBABY5H"] = "PsBABY5HQTSkA4297zNHfsZNKtxULfL18y95qb3m53QJiXGmrbU";
    Protocol["PsBabyM1"] = "PsBabyM1eUXZseaJdmXFApDSBqj8YBfwELoxZHHW77EMcAbbwAS";
    Protocol["PsCARTHA"] = "PsCARTHAGazKbHtnKfLzQg3kms52kSRpgnDY982a9oYsSXRLQEb";
    Protocol["PsDELPH1"] = "PsDELPH1Kxsxt8f9eWbxQeRxkjfbxoqM52jvs5Y5fBxWWh4ifpo";
    Protocol["PtEdoTez"] = "PtEdoTezd3RHSC31mpxxo1npxFjoWWcFgQtxapi51Z8TLu6v6Uq";
    Protocol["PtEdo2Zk"] = "PtEdo2ZkT9oKpimTah6x2embF25oss54njMuPzkJTEi5RqfdZFA";
    Protocol["PsFLoren"] = "PsFLorenaUUuikDWvMDr6fGBRG8kt3e3D3fHoXK1j1BFRxeSH4i";
    Protocol["PsFLorena"] = "PsFLorenaUUuikDWvMDr6fGBRG8kt3e3D3fHoXK1j1BFRxeSH4i";
    Protocol["PtGRANAD"] = "PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV";
    Protocol["PtGRANADs"] = "PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV";
    Protocol["PtHangzH"] = "PtHangzHogokSuiMHemCuowEavgYTP8J5qQ9fQS793MHYFpCY3r";
    Protocol["PtHangz2"] = "PtHangz2aRngywmSRGGvrcTyMbbdpWdpFKuS4uMWxg2RaH9i1qx";
    Protocol["ProtoALpha"] = "ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK"; // temporary protocol hash
  })(Protocol || (Protocol = {}));

  var DefaultProtocol = Protocol.PtGRANAD;
  var protoLevel = {
    Ps9mPmXaRzmzk35gbAYNCAw6UXdE2qoABTHbN2oEEc1qM7CwT9P: 0,
    PtCJ7pwoxe8JasnHY8YonnLYjcVHmhiARPJvqcC6VfHT5s8k8sY: 1,
    PsYLVpVvgbLhAhoqAkMFUo6gudkJ9weNXhUYCiLDzcUpFpkk8Wt: 2,
    PsddFKi32cMJ2qPjf43Qv5GDWLDPZb3T3bF6fLKiF5HtvHNU7aP: 3,
    Pt24m4xiPbLDhVgVfABUjirbmda3yohdN82Sp9FeuAXJ4eV9otd: 4,
    PsBABY5HQTSkA4297zNHfsZNKtxULfL18y95qb3m53QJiXGmrbU: 5,
    PsBabyM1eUXZseaJdmXFApDSBqj8YBfwELoxZHHW77EMcAbbwAS: 5,
    PsCARTHAGazKbHtnKfLzQg3kms52kSRpgnDY982a9oYsSXRLQEb: 6,
    PsDELPH1Kxsxt8f9eWbxQeRxkjfbxoqM52jvs5Y5fBxWWh4ifpo: 7,
    PtEdoTezd3RHSC31mpxxo1npxFjoWWcFgQtxapi51Z8TLu6v6Uq: 8,
    PtEdo2ZkT9oKpimTah6x2embF25oss54njMuPzkJTEi5RqfdZFA: 8,
    PsFLorenaUUuikDWvMDr6fGBRG8kt3e3D3fHoXK1j1BFRxeSH4i: 9,
    PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV: 10,
    PtHangzHogokSuiMHemCuowEavgYTP8J5qQ9fQS793MHYFpCY3r: 11,
    PtHangz2aRngywmSRGGvrcTyMbbdpWdpFKuS4uMWxg2RaH9i1qx: 11,
    ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK: 12
  };

  function ProtoInferiorTo(a, b) {
    return protoLevel[a] < protoLevel[b];
  }

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
        {
          var _a = parsePairUnpairExpr(p, expr.slice(i), annotations.slice(ai), agg),
              r = _a.r,
              n = _a.n,
              an = _a.an;

          lexpr = r;
          i += n;
          ai += an;
          break;
        }

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
        {
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
        }

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
          annots: __spread(["%@", "%@"], vann)
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
          annots: __spread(["%@", "%@"], vann)
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
          return __spread(l || [], r || [], [top]);
        }).r;
        return r_1.map(function (_a, i) {
          var _b = __read(_a, 2),
              v = _b[0],
              a = _b[1];

          var ann = __spread(trimLast(a, null).map(function (v) {
            return v === null ? "%" : v;
          }), v === 0 && i === r_1.length - 1 ? rest_1 : []);

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
      if (ProtoInferiorTo(proto, Protocol.PtEdo2Zk) && assertArgs$1(ex, 0)) {
        var r = parsePairUnpairExpr(ex, ex.prim.slice(3), ex.annots || [], function (l, r, top) {
          return __spread([top], r || [], l || []);
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
      } else {
        if (ex.prim === "UNPAIR") {
          return ex;
        }

        if (assertArgs$1(ex, 0)) {
          // 008_edo: annotations are deprecated
          var r = parsePairUnpairExpr(ex, ex.prim.slice(3), [], function (l, r, top) {
            return __spread([top], r || [], l || []);
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
      }
    } // C[AD]+R macro


    if (cadrRe.test(ex.prim)) {
      if (assertArgs$1(ex, 0)) {
        var ch_1 = __spread(ex.prim.slice(1, ex.prim.length - 1));

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

      if (ProtoInferiorTo(proto, Protocol.PtEdo2Zk)) {
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
      } else {
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
      }
    }

    return ex;
  }

  function expandGlobalConstants(ex, hashAndValue) {
    if (ex.args !== undefined && ex.args.length === 1 && 'string' in ex.args[0] && ex.args[0].string in hashAndValue) {
      return hashAndValue[ex.args[0].string];
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
    return tok.t === Literal.Ident && (tok.v[0] === "@" || tok.v[0] === "%" || tok.v[0] === ":");
  }

  var intRe = new RegExp("^-?[0-9]+$");
  var bytesRe = new RegExp("^([0-9a-fA-F]{2})*$");
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
      var _a, _b, _c;

      if (((_a = this.opt) === null || _a === void 0 ? void 0 : _a.expandGlobalConstant) !== undefined && ex.prim === 'constant') {
        var ret = expandGlobalConstants(ex, this.opt.expandGlobalConstant);

        if (ret !== ex) {
          ret[sourceReference] = __assign(__assign({}, ex[sourceReference] || {
            first: 0,
            last: 0
          }), {
            globalConstant: ex
          });
        }

        return ret;
      }

      if (((_b = this.opt) === null || _b === void 0 ? void 0 : _b.expandMacros) !== undefined ? (_c = this.opt) === null || _c === void 0 ? void 0 : _c.expandMacros : true) {
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
        } else if (tok_1.value.t === ")") {
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

        if (t.done || t.value.t === "}" || t.value.t === ";") {
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

        case "{":
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

            if (n === null || typeof n !== "object") {
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
      } else if ("prim" in src) {
        var p = src;

        if (typeof p.prim === "string" && (p.annots === undefined || Array.isArray(p.annots)) && (p.args === undefined || Array.isArray(p.args))) {
          var ret = {
            prim: p.prim
          };

          if (p.annots !== undefined) {
            try {
              for (var _d = __values(p.annots), _e = _d.next(); !_e.done; _e = _d.next()) {
                var a = _e.value;

                if (typeof a !== "string") {
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

                if (a === null || typeof a !== "object") {
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
      } else if ("string" in src) {
        if (typeof src.string === "string") {
          return {
            string: src.string
          };
        }

        throw new JSONParseError(src, "malformed string literal: " + src);
      } else if ("int" in src) {
        if (typeof src.int === "string" && intRe.test(src.int)) {
          return {
            int: src.int
          };
        }

        throw new JSONParseError(src, "malformed int literal: " + src);
      } else if ("bytes" in src) {
        if (typeof src.bytes === "string" && bytesRe.test(src.bytes)) {
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
  var K$1 = [0x428a2f98 | 0, 0x71374491 | 0, 0xb5c0fbcf | 0, 0xe9b5dba5 | 0, 0x3956c25b | 0, 0x59f111f1 | 0, 0x923f82a4 | 0, 0xab1c5ed5 | 0, 0xd807aa98 | 0, 0x12835b01 | 0, 0x243185be | 0, 0x550c7dc3 | 0, 0x72be5d74 | 0, 0x80deb1fe | 0, 0x9bdc06a7 | 0, 0xc19bf174 | 0, 0xe49b69c1 | 0, 0xefbe4786 | 0, 0x0fc19dc6 | 0, 0x240ca1cc | 0, 0x2de92c6f | 0, 0x4a7484aa | 0, 0x5cb0a9dc | 0, 0x76f988da | 0, 0x983e5152 | 0, 0xa831c66d | 0, 0xb00327c8 | 0, 0xbf597fc7 | 0, 0xc6e00bf3 | 0, 0xd5a79147 | 0, 0x06ca6351 | 0, 0x14292967 | 0, 0x27b70a85 | 0, 0x2e1b2138 | 0, 0x4d2c6dfc | 0, 0x53380d13 | 0, 0x650a7354 | 0, 0x766a0abb | 0, 0x81c2c92e | 0, 0x92722c85 | 0, 0xa2bfe8a1 | 0, 0xa81a664b | 0, 0xc24b8b70 | 0, 0xc76c51a3 | 0, 0xd192e819 | 0, 0xd6990624 | 0, 0xf40e3585 | 0, 0x106aa070 | 0, 0x19a4c116 | 0, 0x1e376c08 | 0, 0x2748774c | 0, 0x34b0bcb5 | 0, 0x391c0cb3 | 0, 0x4ed8aa4a | 0, 0x5b9cca4f | 0, 0x682e6ff3 | 0, 0x748f82ee | 0, 0x78a5636f | 0, 0x84c87814 | 0, 0x8cc70208 | 0, 0x90befffa | 0, 0xa4506ceb | 0, 0xbef9a3f7 | 0, 0xc67178f2 | 0]; // https://tools.ietf.org/html/rfc6234

  function sha256(msg) {
    var e_1, _a; // pad the message


    var r = (msg.length + 9) % 64;
    var pad = r === 0 ? 0 : 64 - r;

    if (msg.length > 268435455) {
      throw new Error("sha256: message length is too big: " + msg.length);
    }

    var l = msg.length << 3;

    var buffer = __spread(msg, [0x80], new Array(pad).fill(0), [0, 0, 0, 0, l >> 24 & 0xff, l >> 16 & 0xff, l >> 8 & 0xff, l & 0xff]);

    function ror(x, n) {
      return x >>> n | x << 32 - n;
    }

    var h = __spread(H);

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
        var t1 = v[7] + b1 + (v[4] & v[5] ^ ~v[4] & v[6]) + K$1[i_2] + w[i_2] | 0;
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

  function parseBytes$3(s) {
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

  var annRe = /^(@%|@%%|%@|[@:%]([_0-9a-zA-Z][_0-9a-zA-Z.%@]*)?)$/;

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


  var maxViewNameLength = 31;
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
    "RENAME": true,
    "OPEN_CHEST": true
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
    "CAST": true,
    "VIEW": true
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
    "ticket": true,
    "chest_key": true,
    "chest": true
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

  function assertStringLiteral(ex) {
    if ("string" in ex) {
      return true;
    }

    throw new MichelsonValidationError(ex, "string literal expected");
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

        case "VIEW":
          /* istanbul ignore else */
          if (assertArgs(ex, 2)) {
            if (assertStringLiteral(ex.args[0])) {
              assertViewNameValid(ex.args[0]);
            }

            if (assertMichelsonType(ex.args[1])) {
              assertMichelsonPushableType(ex.args[1]);
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

  var viewRe = new RegExp("^[a-zA-Z0-9_.%@]*$");

  function assertViewNameValid(name) {
    if (name.string.length > maxViewNameLength) {
      throw new MichelsonValidationError(name, "view name too long: " + name.string);
    }

    if (!viewRe.test(name.string)) {
      throw new MichelsonValidationError(name, "invalid character(s) in view name: " + name.string);
    }
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
      var toplevelSec = {};
      var views = {};

      try {
        for (var ex_3 = __values(ex), ex_3_1 = ex_3.next(); !ex_3_1.done; ex_3_1 = ex_3.next()) {
          var sec = ex_3_1.value;

          if (assertPrim(sec)) {
            if (sec.prim !== "view") {
              if (sec.prim in toplevelSec) {
                throw new MichelsonValidationError(ex, "duplicate contract section: " + sec.prim);
              }

              toplevelSec[sec.prim] = true;
            }
            /* istanbul ignore else */


            switch (sec.prim) {
              case "code":
                if (assertArgs(sec, 1)) {
                  /* istanbul ignore else */
                  if (assertSeq(sec.args[0])) {
                    assertMichelsonInstruction(sec.args[0]);
                  }
                }

                break;

              case "parameter":
                if (assertArgs(sec, 1)) {
                  assertMichelsonPassableType(sec.args[0]);
                }

                break;

              case "storage":
                if (assertArgs(sec, 1)) {
                  assertMichelsonStorableType(sec.args[0]);
                }

                break;

              case "view":
                if (assertArgs(sec, 4)) {
                  if (assertStringLiteral(sec.args[0])) {
                    var name_1 = sec.args[0];

                    if (name_1.string in views) {
                      throw new MichelsonValidationError(ex, "duplicate view name: " + name_1.string);
                    }

                    views[name_1.string] = true;
                    assertViewNameValid(name_1);
                  }

                  assertMichelsonPushableType(sec.args[1]);
                  assertMichelsonPushableType(sec.args[2]);

                  if (assertSeq(sec.args[3])) {
                    assertMichelsonInstruction(sec.args[3]);
                  }
                }

                break;

              default:
                throw new MichelsonValidationError(ex, "unexpected contract section: " + sec.prim);
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
  var primTags = Object.assign.apply(Object, __spread([{}], primitives.map(function (v, i) {
    var _a;

    return _a = {}, _a[v] = i, _a;
  })));
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

      (_a = this.buffer).push.apply(_a, __spread(val.map(function (v) {
        return v & 0xff;
      })));
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
    var bytes = parseBytes$3(b.bytes);

    if (bytes === null) {
      throw new Error("can't parse bytes: \"" + b.bytes + "\"");
    }

    var rd = new Reader(new Uint8Array(bytes));
    return readAddress(rd);
  }

  function decodePublicKeyHashBytes(b) {
    var bytes = parseBytes$3(b.bytes);

    if (bytes === null) {
      throw new Error("can't parse bytes: \"" + b.bytes + "\"");
    }

    var rd = new Reader(new Uint8Array(bytes));
    return readPublicKeyHash(rd);
  }

  function decodePublicKeyBytes(b) {
    var bytes = parseBytes$3(b.bytes);

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
            var aa = parseBytes$3(a.bytes);
            var bb = parseBytes$3(b.bytes);

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
            return compareBytes("string" in a ? decodeBase58Check(a.string) : parseBytes$3(a.bytes) || [], "string" in b ? decodeBase58Check(b.string) : parseBytes$3(b.bytes) || []);
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
        if ("bytes" in d && parseBytes$3(d.bytes) !== null) {
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
          var x = "string" in d ? decodeBase58Check(d.string) : parseBytes$3(d.bytes);

          if (x !== null) {
            return;
          }
        }

        throw new MichelsonTypeError(t, d, "chain id expected: " + JSON.stringify(d));
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
        if ("int" in d && isDecimal(d.int) || "bytes" in d && parseBytes$3(d.bytes) !== null) {
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
        throw new MichelsonTypeError(t, d, "type " + typeID(t) + " don't have Michelson literal representation");
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
          return fn.apply(void 0, __spread(args));
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
      var ann = a.v !== undefined || a.t !== undefined || a.f !== undefined ? __spread((a.v === null ? src.v : a.v) || [], (a.t === null ? src.t : a.t) || [], (a.f === null ? src.f : a.f) || []) : undefined;
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
        return __spread([p.args[0]], getN(right, n, i - 1));
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

            var s = args(n - 1, null)[0];

            if (typeID(s) === "ticket") {
              throw new MichelsonInstructionError(instruction, stack, "ticket can't be DUPed");
            }

            return __spread([s], stack);
          }

        case "SWAP":
          {
            var s = args(0, null, null);
            instructionAnn({});
            return __spread([s[1], s[0]], stack.slice(2));
          }

        case "SOME":
          return __spread([annotate({
            prim: "option",
            args: [args(0, null)[0]]
          }, instructionAnn({
            t: 1,
            v: 1
          }))], stack.slice(1));

        case "UNIT":
          return __spread([annotate({
            prim: "unit"
          }, instructionAnn({
            v: 1,
            t: 1
          }))], stack);

        case "PAIR":
          {
            var n = instruction.args ? parseInt(instruction.args[0].int, 10) : 2;

            if (n < 2) {
              throw new MichelsonInstructionError(instruction, stack, "PAIR " + n + " is forbidden");
            }

            var s = args.apply(void 0, __spread([0], new Array(n).fill(null)));
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

            var retArgs = s.map(function (v, i) {
              var _a;

              var va = argAnn(v);
              var f = ia_1.f && ia_1.f.length > i && ia_1.f[i] !== "%" ? ia_1.f[i] === "%@" ? va.v ? ["%" + trim_1(((_a = va.v) === null || _a === void 0 ? void 0 : _a[0]) || "")] : undefined : [ia_1.f[i]] : undefined;
              return annotate(v, {
                v: null,
                t: null,
                f: f
              });
            });
            return __spread([annotate({
              prim: "pair",
              args: retArgs
            }, {
              t: ia_1.t,
              v: ia_1.v
            })], stack.slice(n));
          }

        case "UNPAIR":
          {
            var n = instruction.args ? parseInt(instruction.args[0].int, 10) : 2;

            if (n < 2) {
              throw new MichelsonInstructionError(instruction, stack, "UNPAIR " + n + " is forbidden");
            }

            var s_1 = args(0, ["pair"])[0];
            var ia_2 = instructionAnn({
              f: 2,
              v: 2
            }, {
              specialVar: true
            });
            var fields = getN(s_1, n);
            return __spread(fields.map(function (field, i) {
              return annotateField(s_1, field, ia_2, i, i === 0 ? "car" : "cdr");
            }), stack.slice(1));
          }

        case "CAR":
        case "CDR":
          {
            var s = unpackComb("pair", args(0, ["pair"])[0]);
            var field = s.args[instruction.prim === "CAR" ? 0 : 1];
            var ia = instructionAnn({
              f: 1,
              v: 1
            }, {
              specialVar: true
            });
            return __spread([annotateField(s, field, ia, 0, instruction.prim.toLocaleLowerCase())], stack.slice(1));
          }

        case "CONS":
          {
            var s = args(0, null, ["list"]);
            ensureTypesEqual(s[0], s[1].args[0]);
            return __spread([annotateVar({
              prim: "list",
              args: [s[1].args[0]]
            })], stack.slice(2));
          }

        case "SIZE":
          args(0, ["string", "list", "set", "map", "bytes"]);
          return __spread([annotateVar({
            prim: "nat"
          })], stack.slice(1));

        case "MEM":
          {
            var s = args(0, null, ["set", "map", "big_map"]);
            ensureComparableType(s[0]);
            ensureTypesEqual(s[0], s[1].args[0]);
            return __spread([annotateVar({
              prim: "bool"
            })], stack.slice(2));
          }

        case "GET":
          if (instruction.args) {
            // comb operation
            var n = parseInt(instruction.args[0].int, 10);
            var s = args(0, ["pair"])[0];
            return __spread([annotateVar(getNth(s, n))], stack.slice(1));
          } else {
            // map operation
            var s = args(0, null, ["map", "big_map"]);
            ensureComparableType(s[0]);
            ensureTypesEqual(s[0], s[1].args[0]);
            return __spread([annotateVar({
              prim: "option",
              args: [s[1].args[1]]
            })], stack.slice(2));
          }

        case "UPDATE":
          if (instruction.args) {
            // comb operation
            var n = parseInt(instruction.args[0].int, 10);
            var s = args(0, null, ["pair"]);
            return __spread([annotateVar(updateNth(s[1], s[0], n))], stack.slice(2));
          } else {
            // map operation
            var s0 = args(0, null, ["bool", "option"]);
            ensureComparableType(s0[0]);

            if (s0[1].prim === "bool") {
              var s1_1 = args(2, ["set"]);
              ensureTypesEqual(s0[0], s1_1[0].args[0]);
              return __spread([annotateVar({
                prim: "set",
                args: [annotate(s0[0], {
                  t: null
                })]
              })], stack.slice(3));
            }

            var s1 = args(2, ["map", "big_map"]);
            ensureTypesEqual(s0[0], s1[0].args[0]);

            if (s1[0].prim === "map") {
              return __spread([annotateVar({
                prim: "map",
                args: [annotate(s0[0], {
                  t: null
                }), annotate(s0[1].args[0], {
                  t: null
                })]
              })], stack.slice(3));
            }

            ensureBigMapStorableType(s0[1].args[0]);
            return __spread([annotateVar({
              prim: "big_map",
              args: [annotate(s0[0], {
                t: null
              }), annotate(s0[1].args[0], {
                t: null
              })]
            })], stack.slice(3));
          }

        case "GET_AND_UPDATE":
          {
            var ia = instructionAnn({
              v: 2
            });
            var s = args(0, null, ["option"], ["map", "big_map"]);
            ensureComparableType(s[0]);
            ensureTypesEqual(s[0], s[2].args[0]);
            ensureTypesEqual(s[1].args[0], s[2].args[1]);
            var va = (_c = ia.v) === null || _c === void 0 ? void 0 : _c.map(function (v) {
              return v !== "@" ? [v] : undefined;
            });

            if (s[2].prim === "map") {
              return __spread([annotate({
                prim: "option",
                args: [s[2].args[1]]
              }, {
                v: va === null || va === void 0 ? void 0 : va[0]
              }), annotate({
                prim: "map",
                args: [annotate(s[0], {
                  t: null
                }), annotate(s[1].args[0], {
                  t: null
                })]
              }, {
                v: va === null || va === void 0 ? void 0 : va[1]
              })], stack.slice(3));
            }

            ensureBigMapStorableType(s[1].args[0]);
            return __spread([annotate({
              prim: "option",
              args: [s[2].args[1]]
            }, {
              v: va === null || va === void 0 ? void 0 : va[0]
            }), annotate({
              prim: "big_map",
              args: [annotate(s[0], {
                t: null
              }), annotate(s[1].args[0], {
                t: null
              })]
            }, {
              v: va === null || va === void 0 ? void 0 : va[1]
            })], stack.slice(3));
          }

        case "EXEC":
          {
            var s = args(0, null, ["lambda"]);
            ensureTypesEqual(s[0], s[1].args[0]);
            return __spread([annotateVar(s[1].args[1])], stack.slice(2));
          }

        case "APPLY":
          {
            var s = args(0, null, ["lambda"]);
            ensureStorableType(s[0]);
            ensurePushableType(s[0]);

            if (!isPairType(s[1].args[0])) {
              throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": function's argument must be a pair: " + typeID(s[1].args[0]));
            }

            var pt = s[1].args[0];
            ensureTypesEqual(s[0], typeArgs(pt)[0]);
            return __spread([annotateVar({
              prim: "lambda",
              args: [typeArgs(pt)[1], s[1].args[1]]
            })], stack.slice(2));
          }

        case "FAILWITH":
          {
            var s = args(0, null)[0];

            if (!ProtoInferiorTo(proto, Protocol.PtEdo2Zk)) {
              ensurePackableType(s);
            }

            return {
              failed: s
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
          return __spread([annotateVar(args(0, null)[0])], stack.slice(1));

        case "CONCAT":
          {
            var s0 = args(0, ["string", "list", "bytes"]);

            if (s0[0].prim === "list") {
              if (typeID(s0[0].args[0]) !== "string" && typeID(s0[0].args[0]) !== "bytes") {
                throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": can't concatenate list of " + typeID(s0[0].args[0]) + "'s");
              }

              return __spread([annotateVar(s0[0].args[0])], stack.slice(1));
            }

            var s1 = args(1, ["string", "bytes"]);

            if (s0[0].prim !== s1[0].prim) {
              throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": can't concatenate " + s0[0].prim + " with " + s1[0].prim);
            }

            return __spread([annotateVar(s1[0])], stack.slice(2));
          }

        case "SLICE":
          return __spread([annotateVar({
            prim: "option",
            args: [args(0, ["nat"], ["nat"], ["string", "bytes"])[2]]
          }, "@slice")], stack.slice(3));

        case "PACK":
          {
            var s = args(0, null)[0];
            ensurePackableType(s);
            return __spread([annotateVar({
              prim: "bytes"
            }, "@packed")], stack.slice(1));
          }

        case "ADD":
          {
            var s = args(0, ["nat", "int", "timestamp", "mutez", "bls12_381_g1", "bls12_381_g2", "bls12_381_fr"], ["nat", "int", "timestamp", "mutez", "bls12_381_g1", "bls12_381_g2", "bls12_381_fr"]);

            if (s[0].prim === "nat" && s[1].prim === "int" || s[0].prim === "int" && s[1].prim === "nat") {
              return __spread([annotateVar({
                prim: "int"
              })], stack.slice(2));
            } else if (s[0].prim === "int" && s[1].prim === "timestamp" || s[0].prim === "timestamp" && s[1].prim === "int") {
              return __spread([annotateVar({
                prim: "timestamp"
              })], stack.slice(2));
            } else if ((s[0].prim === "int" || s[0].prim === "nat" || s[0].prim === "mutez" || s[0].prim === "bls12_381_g1" || s[0].prim === "bls12_381_g2" || s[0].prim === "bls12_381_fr") && s[0].prim === s[1].prim) {
              return __spread([annotateVar(s[0])], stack.slice(2));
            }

            throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": can't add " + s[0].prim + " to " + s[1].prim);
          }

        case "SUB":
          {
            var s = args(0, ["nat", "int", "timestamp", "mutez"], ["nat", "int", "timestamp", "mutez"]);

            if ((s[0].prim === "nat" || s[0].prim === "int") && (s[1].prim === "nat" || s[1].prim === "int") || s[0].prim === "timestamp" && s[1].prim === "timestamp") {
              return __spread([annotateVar({
                prim: "int"
              })], stack.slice(2));
            } else if (s[0].prim === "timestamp" && s[1].prim === "int") {
              return __spread([annotateVar({
                prim: "timestamp"
              })], stack.slice(2));
            } else if (s[0].prim === "mutez" && s[1].prim === "mutez") {
              return __spread([annotateVar({
                prim: "mutez"
              })], stack.slice(2));
            }

            throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": can't subtract " + s[0].prim + " from " + s[1].prim);
          }

        case "MUL":
          {
            var s = args(0, ["nat", "int", "mutez", "bls12_381_g1", "bls12_381_g2", "bls12_381_fr"], ["nat", "int", "mutez", "bls12_381_g1", "bls12_381_g2", "bls12_381_fr"]);

            if (s[0].prim === "nat" && s[1].prim === "int" || s[0].prim === "int" && s[1].prim === "nat") {
              return __spread([annotateVar({
                prim: "int"
              })], stack.slice(2));
            } else if (s[0].prim === "nat" && s[1].prim === "mutez" || s[0].prim === "mutez" && s[1].prim === "nat") {
              return __spread([annotateVar({
                prim: "mutez"
              })], stack.slice(2));
            } else if ((s[0].prim === "bls12_381_g1" || s[0].prim === "bls12_381_g2" || s[0].prim === "bls12_381_fr") && s[1].prim === "bls12_381_fr" || (s[0].prim === "nat" || s[0].prim === "int") && s[0].prim === s[1].prim) {
              return __spread([annotateVar(s[0])], stack.slice(2));
            } else if ((s[0].prim === "nat" || s[0].prim === "int") && s[1].prim === "bls12_381_fr" || (s[1].prim === "nat" || s[1].prim === "int") && s[0].prim === "bls12_381_fr") {
              return __spread([annotateVar({
                prim: "bls12_381_fr"
              })], stack.slice(2));
            }

            throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": can't multiply " + s[0].prim + " by " + s[1].prim);
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

            var s = args(0, ["nat", "int", "mutez"], ["nat", "int", "mutez"]);

            if (s[0].prim === "nat" && s[1].prim === "nat") {
              return __spread([annotateVar(res("nat", "nat"))], stack.slice(2));
            } else if ((s[0].prim === "nat" || s[0].prim === "int") && (s[1].prim === "nat" || s[1].prim === "int")) {
              return __spread([annotateVar(res("int", "nat"))], stack.slice(2));
            } else if (s[0].prim === "mutez" && s[1].prim === "nat") {
              return __spread([annotateVar(res("mutez", "mutez"))], stack.slice(2));
            } else if (s[0].prim === "mutez" && s[1].prim === "mutez") {
              return __spread([annotateVar(res("nat", "mutez"))], stack.slice(2));
            }

            throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": can't euclideally divide " + s[0].prim + " by " + s[1].prim);
          }

        case "ABS":
          args(0, ["int"]);
          return __spread([annotateVar({
            prim: "nat"
          })], stack.slice(1));

        case "ISNAT":
          args(0, ["int"]);
          return __spread([annotateVar({
            prim: "option",
            args: [{
              prim: "nat"
            }]
          })], stack.slice(1));

        case "INT":
          args(0, ["nat", "bls12_381_fr"]);
          return __spread([annotateVar({
            prim: "int"
          })], stack.slice(1));

        case "NEG":
          {
            var s = args(0, ["nat", "int", "bls12_381_g1", "bls12_381_g2", "bls12_381_fr"])[0];

            if (s.prim === "nat" || s.prim === "int") {
              return __spread([annotateVar({
                prim: "int"
              })], stack.slice(1));
            }

            return __spread([annotateVar(s)], stack.slice(1));
          }

        case "LSL":
        case "LSR":
          args(0, ["nat"], ["nat"]);
          return __spread([annotateVar({
            prim: "nat"
          })], stack.slice(2));

        case "OR":
        case "XOR":
          {
            var s = args(0, ["nat", "bool"], ["nat", "bool"]);

            if (s[0].prim !== s[1].prim) {
              throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": both arguments must be of the same type: " + s[0].prim + ", " + s[1].prim);
            }

            return __spread([annotateVar(s[1])], stack.slice(2));
          }

        case "AND":
          {
            var s = args(0, ["nat", "bool", "int"], ["nat", "bool"]);

            if ((s[0].prim !== "int" || s[1].prim !== "nat") && s[0].prim !== s[1].prim) {
              throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": both arguments must be of the same type: " + s[0].prim + ", " + s[1].prim);
            }

            return __spread([annotateVar(s[1])], stack.slice(2));
          }

        case "NOT":
          {
            var s = args(0, ["nat", "bool", "int"])[0];

            if (s.prim === "bool") {
              return __spread([annotateVar({
                prim: "bool"
              })], stack.slice(1));
            }

            return __spread([annotateVar({
              prim: "int"
            })], stack.slice(1));
          }

        case "COMPARE":
          {
            var s = args(0, null, null);
            ensureComparableType(s[0]);
            ensureComparableType(s[1]);
            return __spread([annotateVar({
              prim: "int"
            })], stack.slice(2));
          }

        case "EQ":
        case "NEQ":
        case "LT":
        case "GT":
        case "LE":
        case "GE":
          args(0, ["int"]);
          return __spread([annotateVar({
            prim: "bool"
          })], stack.slice(1));

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

            return __spread([annotate({
              prim: "contract",
              args: [ep]
            }, {
              v: ia.v ? ia.v : ["@self"]
            })], stack);
          }

        case "TRANSFER_TOKENS":
          {
            var s = args(0, null, ["mutez"], ["contract"]);
            ensureTypesEqual(s[0], s[2].args[0]);
            return __spread([annotateVar({
              prim: "operation"
            })], stack.slice(3));
          }

        case "SET_DELEGATE":
          {
            var s = args(0, ["option"])[0];

            if (typeID(s.args[0]) !== "key_hash") {
              throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": key hash expected: " + typeID(s.args[0]));
            }

            return __spread([annotateVar({
              prim: "operation"
            })], stack.slice(1));
          }

        case "IMPLICIT_ACCOUNT":
          args(0, ["key_hash"]);
          return __spread([annotateVar({
            prim: "contract",
            args: [{
              prim: "unit"
            }]
          })], stack.slice(1));

        case "NOW":
          return __spread([annotateVar({
            prim: "timestamp"
          }, "@now")], stack);

        case "AMOUNT":
          return __spread([annotateVar({
            prim: "mutez"
          }, "@amount")], stack);

        case "BALANCE":
          return __spread([annotateVar({
            prim: "mutez"
          }, "@balance")], stack);

        case "CHECK_SIGNATURE":
          args(0, ["key"], ["signature"], ["bytes"]);
          return __spread([annotateVar({
            prim: "bool"
          })], stack.slice(3));

        case "BLAKE2B":
        case "SHA256":
        case "SHA512":
        case "KECCAK":
        case "SHA3":
          args(0, ["bytes"]);
          return __spread([annotateVar({
            prim: "bytes"
          })], stack.slice(1));

        case "HASH_KEY":
          args(0, ["key"]);
          return __spread([annotateVar({
            prim: "key_hash"
          })], stack.slice(1));

        case "SOURCE":
          return __spread([annotateVar({
            prim: "address"
          }, "@source")], stack);

        case "SENDER":
          return __spread([annotateVar({
            prim: "address"
          }, "@sender")], stack);

        case "ADDRESS":
          {
            var s = args(0, ["contract"])[0];
            var ia = instructionAnn({
              v: 1
            });
            return __spread([annotate((_a = {
              prim: "address"
            }, _a[refContract] = s, _a), {
              v: ia.v ? ia.v : varSuffix(argAnn(s), "address")
            })], stack.slice(1));
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

            return __spread([annotateVar(addr, "@address")], stack);
          }

        case "CHAIN_ID":
          return __spread([annotateVar({
            prim: "chain_id"
          })], stack);

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
            return __spread([args(n, null)[0]], stack.slice(0, n), stack.slice(n + 1));
          }

        case "DUG":
          {
            instructionAnn({});
            var n = parseInt(instruction.args[0].int, 10);
            return __spread(stack.slice(1, n + 1), [args(0, null)[0]], stack.slice(n + 1));
          }

        case "NONE":
          assertTypeAnnotationsValid(instruction.args[0]);
          return __spread([annotate({
            prim: "option",
            args: [instruction.args[0]]
          }, instructionAnn({
            t: 1,
            v: 1
          }))], stack);

        case "LEFT":
        case "RIGHT":
          {
            var s = args(0, null)[0];
            var ia = instructionAnn({
              f: 2,
              t: 1,
              v: 1
            }, {
              specialFields: true
            });
            var va = argAnn(s);
            var children = [annotate(s, {
              t: null,
              v: null,
              f: ia.f && ia.f.length > 0 && ia.f[0] !== "%" ? ia.f[0] === "%@" ? va.v ? ["%" + va.v[0].slice(1)] : undefined : ia.f : undefined
            }), annotate(instruction.args[0], {
              t: null,
              f: ia.f && ia.f.length > 1 && ia.f[1] !== "%" ? ia.f : undefined
            })];
            return __spread([annotate({
              prim: "or",
              args: instruction.prim === "LEFT" ? children : [children[1], children[0]]
            }, {
              t: ia.t,
              v: ia.v
            })], stack.slice(1));
          }

        case "NIL":
          assertTypeAnnotationsValid(instruction.args[0]);
          return __spread([annotate({
            prim: "list",
            args: [instruction.args[0]]
          }, instructionAnn({
            t: 1,
            v: 1
          }))], stack);

        case "UNPACK":
          args(0, ["bytes"]);
          assertTypeAnnotationsValid(instruction.args[0]);
          return __spread([annotateVar({
            prim: "option",
            args: [instruction.args[0]]
          }, "@unpacked")], stack.slice(1));

        case "CONTRACT":
          {
            var s = args(0, ["address"])[0];
            assertTypeAnnotationsValid(instruction.args[0]);
            var ia = instructionAnn({
              v: 1,
              f: 1
            });
            var contract = s[refContract];

            if (contract !== undefined) {
              var ep = contractEntryPoint(contract, (_e = ia.f) === null || _e === void 0 ? void 0 : _e[0]);

              if (ep === null) {
                throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": contract has no entrypoint " + ep);
              }

              ensureTypesEqual(ep, instruction.args[0]);
            }

            return __spread([annotate({
              prim: "option",
              args: [{
                prim: "contract",
                args: [instruction.args[0]]
              }]
            }, {
              v: ia.v ? ia.v : varSuffix(argAnn(s), "contract")
            })], stack.slice(1));
          }

        case "CAST":
          {
            instructionAnn({});
            var s = args(0, null)[0];
            assertTypeAnnotationsValid(instruction.args[0]);
            ensureTypesEqual(instruction.args[0], s);
            return __spread([instruction.args[0]], stack.slice(1));
          }

        case "IF_NONE":
          {
            instructionAnn({});
            var s = args(0, ["option"])[0];
            var tail = stack.slice(1);
            var br0 = functionTypeInternal(instruction.args[0], tail, ctx);
            var br1 = functionTypeInternal(instruction.args[1], __spread([annotate(s.args[0], {
              t: null,
              v: varSuffix(argAnn(s), "some")
            })], tail), ctx);
            return branchType(br0, br1);
          }

        case "IF_LEFT":
          {
            instructionAnn({});
            var s = args(0, ["or"])[0];
            var va = argAnn(s);
            var lefta = argAnn(s.args[0]);
            var righta = argAnn(s.args[1]);
            var tail = stack.slice(1);
            var br0 = functionTypeInternal(instruction.args[0], __spread([annotate(s.args[0], {
              t: null,
              v: varSuffix(va, lefta.f ? lefta.f[0].slice(1) : "left")
            })], tail), ctx);
            var br1 = functionTypeInternal(instruction.args[1], __spread([annotate(s.args[1], {
              t: null,
              v: varSuffix(va, righta.f ? righta.f[0].slice(1) : "right")
            })], tail), ctx);
            return branchType(br0, br1);
          }

        case "IF_CONS":
          {
            instructionAnn({});
            var s = args(0, ["list"])[0];
            var va = argAnn(s);
            var tail = stack.slice(1);
            var br0 = functionTypeInternal(instruction.args[0], __spread([annotate(s.args[0], {
              t: null,
              v: varSuffix(va, "hd")
            }), annotate(s, {
              t: null,
              v: varSuffix(va, "tl")
            })], tail), ctx);
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
            var s = args(0, ["list", "map"])[0];
            var tail = stack.slice(1);
            var elt = s.prim === "map" ? {
              prim: "pair",
              args: s.args
            } : s.args[0];
            var body = functionTypeInternal(instruction.args[0], __spread([annotate(elt, {
              t: null,
              v: varSuffix(argAnn(s), "elt")
            })], tail), ctx);

            if ("failed" in body) {
              return body;
            }

            if (body.length < 1) {
              throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": function must return a value");
            }

            ensureStacksEqual(body.slice(1), tail);

            if (s.prim === "list") {
              return __spread([annotateVar({
                prim: "list",
                args: [body[0]]
              })], tail);
            }

            return __spread([annotateVar({
              prim: "map",
              args: [s.args[0], body[0]]
            })], tail);
          }

        case "ITER":
          {
            instructionAnn({});
            var s = args(0, ["set", "list", "map"])[0];
            var tail = stack.slice(1);
            var elt = s.prim === "map" ? {
              prim: "pair",
              args: s.args
            } : s.args[0];
            var body = functionTypeInternal(instruction.args[0], __spread([annotate(elt, {
              t: null,
              v: varSuffix(argAnn(s), "elt")
            })], tail), ctx);

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

            ensureStacksEqual(body, __spread([{
              prim: "bool"
            }], tail));
            return tail;
          }

        case "LOOP_LEFT":
          {
            instructionAnn({});
            var s = args(0, ["or"])[0];
            var tail = stack.slice(1);
            var body = functionTypeInternal(instruction.args[0], __spread([annotate(s.args[0], {
              t: null,
              v: varSuffix(argAnn(s), "left")
            })], tail), ctx);

            if ("failed" in body) {
              return body;
            }

            ensureStacksEqual(body, __spread([s], tail));
            return __spread([annotate(s.args[1], {
              t: null,
              v: instructionAnn({
                v: 1
              }).v
            })], tail);
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

            return __spread(head, body);
          }

        case "CREATE_CONTRACT":
          {
            var ia = instructionAnn({
              v: 2
            });
            var s = args(0, ["option"], ["mutez"], null);

            if (typeID(s[0].args[0]) !== "key_hash") {
              throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": key hash expected: " + typeID(s[0].args[0]));
            }

            if (ensureStorableType(s[2])) {
              assertContractValid(instruction.args[0]);
              assertScalarTypesEqual(contractSection(instruction.args[0], "storage").args[0], s[2]);
            }

            var va = (_f = ia.v) === null || _f === void 0 ? void 0 : _f.map(function (v) {
              return v !== "@" ? [v] : undefined;
            });
            return __spread([annotate({
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
            })], stack.slice(3));
          }

        case "PUSH":
          assertTypeAnnotationsValid(instruction.args[0]);
          assertDataValidInternal(instruction.args[1], instruction.args[0], __assign(__assign({}, ctx), {
            contract: undefined
          }));
          return __spread([annotateVar(instruction.args[0])], stack);

        case "EMPTY_SET":
          assertTypeAnnotationsValid(instruction.args[0]);
          ensureComparableType(instruction.args[0]);
          return __spread([annotate({
            prim: "set",
            args: instruction.args
          }, instructionAnn({
            t: 1,
            v: 1
          }))], stack);

        case "EMPTY_MAP":
          assertTypeAnnotationsValid(instruction.args[0]);
          ensureComparableType(instruction.args[0]);
          assertTypeAnnotationsValid(instruction.args[1]);
          return __spread([annotate({
            prim: "map",
            args: instruction.args
          }, instructionAnn({
            t: 1,
            v: 1
          }))], stack);

        case "EMPTY_BIG_MAP":
          assertTypeAnnotationsValid(instruction.args[0]);
          ensureComparableType(instruction.args[0]);
          assertTypeAnnotationsValid(instruction.args[1]);
          ensureBigMapStorableType(instruction.args[0]);
          return __spread([annotate({
            prim: "big_map",
            args: instruction.args
          }, instructionAnn({
            t: 1,
            v: 1
          }))], stack);

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
            return __spread([annotateVar({
              prim: "lambda",
              args: [instruction.args[0], instruction.args[1]]
            })], stack);
          }

        case "LEVEL":
          return __spread([annotateVar({
            prim: "nat"
          }, "@level")], stack);

        case "TOTAL_VOTING_POWER":
          return __spread([annotateVar({
            prim: "nat"
          })], stack);

        case "VOTING_POWER":
          args(0, ["key_hash"]);
          return __spread([annotateVar({
            prim: "nat"
          })], stack.slice(1));

        case "TICKET":
          {
            var s = args(0, null, ["nat"])[0];
            ensureComparableType(s);
            return __spread([annotate({
              prim: "ticket",
              args: [s]
            }, instructionAnn({
              t: 1,
              v: 1
            }))], stack.slice(2));
          }

        case "JOIN_TICKETS":
          {
            var s = unpackComb("pair", args(0, ["pair"])[0]);

            if (typeID(s.args[0]) !== "ticket") {
              throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": ticket expected: " + typeID(s.args[0]));
            }

            ensureTypesEqual(s.args[0], s.args[1]);
            return __spread([annotateVar({
              prim: "option",
              args: [annotate(s.args[0], {
                t: null
              })]
            })], stack.slice(1));
          }

        case "SPLIT_TICKET":
          {
            var s = args(0, ["ticket"], ["pair"]);
            var p = unpackComb("pair", s[1]);

            if (typeID(p.args[0]) !== "nat") {
              throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": nat expected: " + typeID(p.args[0]));
            }

            ensureTypesEqual(p.args[0], p.args[1]);
            return __spread([annotateVar({
              prim: "option",
              args: [{
                prim: "pair",
                args: [annotate(s[0], {
                  t: null
                }), annotate(s[0], {
                  t: null
                })]
              }]
            })], stack.slice(2));
          }

        case "READ_TICKET":
          {
            var ia = instructionAnn({
              v: 2
            });
            var s = args(0, ["ticket"])[0];
            var va = (_g = ia.v) === null || _g === void 0 ? void 0 : _g.map(function (v) {
              return v !== "@" ? [v] : undefined;
            });
            return __spread([annotate({
              prim: "pair",
              args: [{
                prim: "address"
              }, annotate(s.args[0], {
                t: null
              }), {
                prim: "nat"
              }]
            }, {
              v: va === null || va === void 0 ? void 0 : va[0]
            }), annotate(s, {
              v: va === null || va === void 0 ? void 0 : va[1],
              t: null
            })], stack.slice(1));
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

            return __spread([annotateVar({
              prim: "bool"
            })], stack.slice(1));
          }

        case "SAPLING_EMPTY_STATE":
          return __spread([annotate({
            prim: "sapling_state",
            args: [instruction.args[0]]
          }, instructionAnn({
            v: 1,
            t: 1
          }))], stack);

        case "SAPLING_VERIFY_UPDATE":
          {
            var s = args(0, ["sapling_transaction"], ["sapling_state"]);

            if (parseInt(s[0].args[0].int, 10) !== parseInt(s[1].args[0].int, 10)) {
              throw new MichelsonInstructionError(instruction, stack, instruction.prim + ": sapling memo size mismatch: " + s[0].args[0].int + " != " + s[1].args[0].int);
            }

            return __spread([annotateVar({
              prim: "option",
              args: [{
                prim: "pair",
                args: [{
                  prim: "int"
                }, annotate(s[1], {
                  t: null
                })]
              }]
            })], stack.slice(2));
          }

        case "OPEN_CHEST":
          args(0, ["chest_key"], ["chest"], ["nat"]);
          return __spread([annotateVar({
            prim: "or",
            args: [{
              prim: "bytes"
            }, {
              prim: "bool"
            }]
          })], stack.slice(3));

        case "VIEW":
          {
            var s = args(0, null, ["address"]);
            ensurePushableType(s[0]);
            return __spread([annotateVar({
              prim: "option",
              args: [instruction.args[1]]
            })], stack.slice(2));
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

  function contractViews(contract) {
    var e_9, _a;

    var views = {};

    try {
      for (var contract_2 = __values(contract), contract_2_1 = contract_2.next(); !contract_2_1.done; contract_2_1 = contract_2.next()) {
        var s = contract_2_1.value;

        if (s.prim === "view") {
          views[s.args[0].string] = s;
        }
      }
    } catch (e_9_1) {
      e_9 = {
        error: e_9_1
      };
    } finally {
      try {
        if (contract_2_1 && !contract_2_1.done && (_a = contract_2.return)) _a.call(contract_2);
      } finally {
        if (e_9) throw e_9.error;
      }
    }

    return views;
  }

  function isContract(v) {
    var e_10, _a;

    if (Array.isArray(v)) {
      try {
        for (var v_1 = __values(v), v_1_1 = v_1.next(); !v_1_1.done; v_1_1 = v_1.next()) {
          var s = v_1_1.value;

          if ("prim" in s && (s.prim === "parameter" || s.prim === "storage" || s.prim === "code")) {
            return true;
          }
        }
      } catch (e_10_1) {
        e_10 = {
          error: e_10_1
        };
      } finally {
        try {
          if (v_1_1 && !v_1_1.done && (_a = v_1.return)) _a.call(v_1);
        } finally {
          if (e_10) throw e_10.error;
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
      return a.f ? __spread([[a.f[0], param.args[0]]], ch) : ch;
    }

    if (isOrType(src)) {
      var args_2 = typeArgs(src);

      var getArg = function (n) {
        var a = unpackAnnotations(args_2[n]);

        if (typeID(args_2[n]) === "or") {
          var ch = contractEntryPoints(args_2[n]);
          return a.f ? __spread([[a.f[0], args_2[n]]], ch) : ch;
        }

        return a.f ? [[a.f[0], args_2[n]]] : [];
      };

      return __spread(getArg(0), getArg(1));
    }

    return [];
  } // Contract validation


  function assertContractValid(contract, ctx) {
    var e_11, _a;

    var assertSection = function (parameter, storage, ret, code) {
      assertTypeAnnotationsValid(parameter, true);
      assertTypeAnnotationsValid(storage);
      var arg = {
        prim: "pair",
        args: [__assign(__assign({}, parameter), {
          annots: ["@parameter"]
        }), __assign(__assign({}, storage), {
          annots: ["@storage"]
        })]
      };
      var out = functionTypeInternal(code, [arg], __assign(__assign({}, ctx), {
        contract: contract
      }));

      if ("failed" in out) {
        return out;
      }

      try {
        assertStacksEqual(out, [ret]);
      } catch (err) {
        if (err instanceof MichelsonError) {
          throw new MichelsonInstructionError(code, out, err.message);
        } else {
          throw err;
        }
      }

      return out;
    };

    var parameter = contractSection(contract, "parameter").args[0];
    var storage = contractSection(contract, "storage").args[0];
    var code = contractSection(contract, "code").args[0];
    var expected = {
      prim: "pair",
      args: [{
        prim: "list",
        args: [{
          prim: "operation"
        }]
      }, storage]
    };
    var ret = assertSection(parameter, storage, expected, code);

    try {
      for (var _b = __values(Object.values(contractViews(contract))), _c = _b.next(); !_c.done; _c = _b.next()) {
        var view = _c.value;
        assertSection(view.args[1], storage, view.args[2], view.args[3]);
      }
    } catch (e_11_1) {
      e_11 = {
        error: e_11_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_11) throw e_11.error;
      }
    }

    return ret;
  } // Exported wrapper functions


  function assertDataValid(d, t, ctx) {
    assertTypeAnnotationsValid(t);
    assertDataValidInternal(d, t, ctx || null);
  }

  function functionType(inst, stack, ctx) {
    var e_12, _a, e_13, _b;

    try {
      for (var stack_1 = __values(stack), stack_1_1 = stack_1.next(); !stack_1_1.done; stack_1_1 = stack_1.next()) {
        var t = stack_1_1.value;
        assertTypeAnnotationsValid(t);
      }
    } catch (e_12_1) {
      e_12 = {
        error: e_12_1
      };
    } finally {
      try {
        if (stack_1_1 && !stack_1_1.done && (_a = stack_1.return)) _a.call(stack_1);
      } finally {
        if (e_12) throw e_12.error;
      }
    }

    if ((ctx === null || ctx === void 0 ? void 0 : ctx.contract) !== undefined) {
      try {
        for (var _c = __values(["parameter", "storage"]), _d = _c.next(); !_d.done; _d = _c.next()) {
          var typesec = _d.value;
          var sec = contractSection(ctx.contract, typesec).args[0];
          assertTypeAnnotationsValid(sec);
        }
      } catch (e_13_1) {
        e_13 = {
          error: e_13_1
        };
      } finally {
        try {
          if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
        } finally {
          if (e_13) throw e_13.error;
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

  var ed25519 = {};

  var random = {};

  var system = {};

  var browser = {};

  // MIT License. See LICENSE file for details.


  Object.defineProperty(browser, "__esModule", {
    value: true
  });
  var QUOTA = 65536;

  var BrowserRandomSource =
  /** @class */
  function () {
    function BrowserRandomSource() {
      this.isAvailable = false;
      this.isInstantiated = false;
      var browserCrypto = typeof self !== 'undefined' ? self.crypto || self.msCrypto // IE11 has msCrypto
      : null;

      if (browserCrypto && browserCrypto.getRandomValues) {
        this._crypto = browserCrypto;
        this.isAvailable = true;
        this.isInstantiated = true;
      }
    }

    BrowserRandomSource.prototype.randomBytes = function (length) {
      if (!this.isAvailable || !this._crypto) {
        throw new Error("Browser random byte generator is not available.");
      }

      var out = new Uint8Array(length);

      for (var i = 0; i < out.length; i += QUOTA) {
        this._crypto.getRandomValues(out.subarray(i, i + Math.min(out.length - i, QUOTA)));
      }

      return out;
    };

    return BrowserRandomSource;
  }();

  browser.BrowserRandomSource = BrowserRandomSource;

  var node = {};

  var wipe$1 = {};

  // MIT License. See LICENSE file for details.


  Object.defineProperty(wipe$1, "__esModule", {
    value: true
  });
  /**
   * Sets all values in the given array to zero and returns it.
   *
   * The fact that it sets bytes to zero can be relied on.
   *
   * There is no guarantee that this function makes data disappear from memory,
   * as runtime implementation can, for example, have copying garbage collector
   * that will make copies of sensitive data before we wipe it. Or that an
   * operating system will write our data to swap or sleep image. Another thing
   * is that an optimizing compiler can remove calls to this function or make it
   * no-op. There's nothing we can do with it, so we just do our best and hope
   * that everything will be okay and good will triumph over evil.
   */

  function wipe(array) {
    // Right now it's similar to array.fill(0). If it turns
    // out that runtimes optimize this call away, maybe
    // we can try something else.
    for (var i = 0; i < array.length; i++) {
      array[i] = 0;
    }

    return array;
  }

  wipe$1.wipe = wipe;

  var _nodeResolve_empty = {};

  var _nodeResolve_empty$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': _nodeResolve_empty
  });

  var require$$1 = /*@__PURE__*/getAugmentedNamespace(_nodeResolve_empty$1);

  // MIT License. See LICENSE file for details.


  Object.defineProperty(node, "__esModule", {
    value: true
  });
  var wipe_1 = wipe$1;

  var NodeRandomSource =
  /** @class */
  function () {
    function NodeRandomSource() {
      this.isAvailable = false;
      this.isInstantiated = false;

      if (typeof commonjsRequire !== "undefined") {
        var nodeCrypto = require$$1;

        if (nodeCrypto && nodeCrypto.randomBytes) {
          this._crypto = nodeCrypto;
          this.isAvailable = true;
          this.isInstantiated = true;
        }
      }
    }

    NodeRandomSource.prototype.randomBytes = function (length) {
      if (!this.isAvailable || !this._crypto) {
        throw new Error("Node.js random byte generator is not available.");
      } // Get random bytes (result is Buffer).


      var buffer = this._crypto.randomBytes(length); // Make sure we got the length that we requested.


      if (buffer.length !== length) {
        throw new Error("NodeRandomSource: got fewer bytes than requested");
      } // Allocate output array.


      var out = new Uint8Array(length); // Copy bytes from buffer to output.

      for (var i = 0; i < out.length; i++) {
        out[i] = buffer[i];
      } // Cleanup.


      wipe_1.wipe(buffer);
      return out;
    };

    return NodeRandomSource;
  }();

  node.NodeRandomSource = NodeRandomSource;

  // MIT License. See LICENSE file for details.


  Object.defineProperty(system, "__esModule", {
    value: true
  });
  var browser_1 = browser;
  var node_1 = node;

  var SystemRandomSource =
  /** @class */
  function () {
    function SystemRandomSource() {
      this.isAvailable = false;
      this.name = ""; // Try browser.

      this._source = new browser_1.BrowserRandomSource();

      if (this._source.isAvailable) {
        this.isAvailable = true;
        this.name = "Browser";
        return;
      } // If no browser source, try Node.


      this._source = new node_1.NodeRandomSource();

      if (this._source.isAvailable) {
        this.isAvailable = true;
        this.name = "Node";
        return;
      } // No sources, we're out of options.

    }

    SystemRandomSource.prototype.randomBytes = function (length) {
      if (!this.isAvailable) {
        throw new Error("System random byte generator is not available.");
      }

      return this._source.randomBytes(length);
    };

    return SystemRandomSource;
  }();

  system.SystemRandomSource = SystemRandomSource;

  var binary = {};

  var int = {};

  (function (exports) {
    // MIT License. See LICENSE file for details.

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    /**
     * Package int provides helper functions for integerss.
     */
    // Shim using 16-bit pieces.

    function imulShim(a, b) {
      var ah = a >>> 16 & 0xffff,
          al = a & 0xffff;
      var bh = b >>> 16 & 0xffff,
          bl = b & 0xffff;
      return al * bl + (ah * bl + al * bh << 16 >>> 0) | 0;
    }
    /** 32-bit integer multiplication.  */
    // Use system Math.imul if available, otherwise use our shim.


    exports.mul = Math.imul || imulShim;
    /** 32-bit integer addition.  */

    function add(a, b) {
      return a + b | 0;
    }

    exports.add = add;
    /**  32-bit integer subtraction.  */

    function sub(a, b) {
      return a - b | 0;
    }

    exports.sub = sub;
    /** 32-bit integer left rotation */

    function rotl(x, n) {
      return x << n | x >>> 32 - n;
    }

    exports.rotl = rotl;
    /** 32-bit integer left rotation */

    function rotr(x, n) {
      return x << 32 - n | x >>> n;
    }

    exports.rotr = rotr;

    function isIntegerShim(n) {
      return typeof n === "number" && isFinite(n) && Math.floor(n) === n;
    }
    /**
     * Returns true if the argument is an integer number.
     *
     * In ES2015, Number.isInteger.
     */


    exports.isInteger = Number.isInteger || isIntegerShim;
    /**
     *  Math.pow(2, 53) - 1
     *
     *  In ES2015 Number.MAX_SAFE_INTEGER.
     */

    exports.MAX_SAFE_INTEGER = 9007199254740991;
    /**
     * Returns true if the argument is a safe integer number
     * (-MIN_SAFE_INTEGER < number <= MAX_SAFE_INTEGER)
     *
     * In ES2015, Number.isSafeInteger.
     */

    exports.isSafeInteger = function (n) {
      return exports.isInteger(n) && n >= -exports.MAX_SAFE_INTEGER && n <= exports.MAX_SAFE_INTEGER;
    };
  })(int);

  // MIT License. See LICENSE file for details.


  Object.defineProperty(binary, "__esModule", {
    value: true
  });
  /**
   * Package binary provides functions for encoding and decoding numbers in byte arrays.
   */

  var int_1 = int; // TODO(dchest): add asserts for correct value ranges and array offsets.

  /**
   * Reads 2 bytes from array starting at offset as big-endian
   * signed 16-bit integer and returns it.
   */

  function readInt16BE(array, offset) {
    if (offset === void 0) {
      offset = 0;
    }

    return (array[offset + 0] << 8 | array[offset + 1]) << 16 >> 16;
  }

  binary.readInt16BE = readInt16BE;
  /**
   * Reads 2 bytes from array starting at offset as big-endian
   * unsigned 16-bit integer and returns it.
   */

  function readUint16BE(array, offset) {
    if (offset === void 0) {
      offset = 0;
    }

    return (array[offset + 0] << 8 | array[offset + 1]) >>> 0;
  }

  binary.readUint16BE = readUint16BE;
  /**
   * Reads 2 bytes from array starting at offset as little-endian
   * signed 16-bit integer and returns it.
   */

  function readInt16LE(array, offset) {
    if (offset === void 0) {
      offset = 0;
    }

    return (array[offset + 1] << 8 | array[offset]) << 16 >> 16;
  }

  binary.readInt16LE = readInt16LE;
  /**
   * Reads 2 bytes from array starting at offset as little-endian
   * unsigned 16-bit integer and returns it.
   */

  function readUint16LE(array, offset) {
    if (offset === void 0) {
      offset = 0;
    }

    return (array[offset + 1] << 8 | array[offset]) >>> 0;
  }

  binary.readUint16LE = readUint16LE;
  /**
   * Writes 2-byte big-endian representation of 16-bit unsigned
   * value to byte array starting at offset.
   *
   * If byte array is not given, creates a new 2-byte one.
   *
   * Returns the output byte array.
   */

  function writeUint16BE(value, out, offset) {
    if (out === void 0) {
      out = new Uint8Array(2);
    }

    if (offset === void 0) {
      offset = 0;
    }

    out[offset + 0] = value >>> 8;
    out[offset + 1] = value >>> 0;
    return out;
  }

  binary.writeUint16BE = writeUint16BE;
  binary.writeInt16BE = writeUint16BE;
  /**
   * Writes 2-byte little-endian representation of 16-bit unsigned
   * value to array starting at offset.
   *
   * If byte array is not given, creates a new 2-byte one.
   *
   * Returns the output byte array.
   */

  function writeUint16LE(value, out, offset) {
    if (out === void 0) {
      out = new Uint8Array(2);
    }

    if (offset === void 0) {
      offset = 0;
    }

    out[offset + 0] = value >>> 0;
    out[offset + 1] = value >>> 8;
    return out;
  }

  binary.writeUint16LE = writeUint16LE;
  binary.writeInt16LE = writeUint16LE;
  /**
   * Reads 4 bytes from array starting at offset as big-endian
   * signed 32-bit integer and returns it.
   */

  function readInt32BE(array, offset) {
    if (offset === void 0) {
      offset = 0;
    }

    return array[offset] << 24 | array[offset + 1] << 16 | array[offset + 2] << 8 | array[offset + 3];
  }

  binary.readInt32BE = readInt32BE;
  /**
   * Reads 4 bytes from array starting at offset as big-endian
   * unsigned 32-bit integer and returns it.
   */

  function readUint32BE(array, offset) {
    if (offset === void 0) {
      offset = 0;
    }

    return (array[offset] << 24 | array[offset + 1] << 16 | array[offset + 2] << 8 | array[offset + 3]) >>> 0;
  }

  binary.readUint32BE = readUint32BE;
  /**
   * Reads 4 bytes from array starting at offset as little-endian
   * signed 32-bit integer and returns it.
   */

  function readInt32LE(array, offset) {
    if (offset === void 0) {
      offset = 0;
    }

    return array[offset + 3] << 24 | array[offset + 2] << 16 | array[offset + 1] << 8 | array[offset];
  }

  binary.readInt32LE = readInt32LE;
  /**
   * Reads 4 bytes from array starting at offset as little-endian
   * unsigned 32-bit integer and returns it.
   */

  function readUint32LE(array, offset) {
    if (offset === void 0) {
      offset = 0;
    }

    return (array[offset + 3] << 24 | array[offset + 2] << 16 | array[offset + 1] << 8 | array[offset]) >>> 0;
  }

  binary.readUint32LE = readUint32LE;
  /**
   * Writes 4-byte big-endian representation of 32-bit unsigned
   * value to byte array starting at offset.
   *
   * If byte array is not given, creates a new 4-byte one.
   *
   * Returns the output byte array.
   */

  function writeUint32BE(value, out, offset) {
    if (out === void 0) {
      out = new Uint8Array(4);
    }

    if (offset === void 0) {
      offset = 0;
    }

    out[offset + 0] = value >>> 24;
    out[offset + 1] = value >>> 16;
    out[offset + 2] = value >>> 8;
    out[offset + 3] = value >>> 0;
    return out;
  }

  binary.writeUint32BE = writeUint32BE;
  binary.writeInt32BE = writeUint32BE;
  /**
   * Writes 4-byte little-endian representation of 32-bit unsigned
   * value to array starting at offset.
   *
   * If byte array is not given, creates a new 4-byte one.
   *
   * Returns the output byte array.
   */

  function writeUint32LE(value, out, offset) {
    if (out === void 0) {
      out = new Uint8Array(4);
    }

    if (offset === void 0) {
      offset = 0;
    }

    out[offset + 0] = value >>> 0;
    out[offset + 1] = value >>> 8;
    out[offset + 2] = value >>> 16;
    out[offset + 3] = value >>> 24;
    return out;
  }

  binary.writeUint32LE = writeUint32LE;
  binary.writeInt32LE = writeUint32LE;
  /**
   * Reads 8 bytes from array starting at offset as big-endian
   * signed 64-bit integer and returns it.
   *
   * IMPORTANT: due to JavaScript limitation, supports exact
   * numbers in range -9007199254740991 to 9007199254740991.
   * If the number stored in the byte array is outside this range,
   * the result is not exact.
   */

  function readInt64BE(array, offset) {
    if (offset === void 0) {
      offset = 0;
    }

    var hi = readInt32BE(array, offset);
    var lo = readInt32BE(array, offset + 4);
    return hi * 0x100000000 + lo - (lo >> 31) * 0x100000000;
  }

  binary.readInt64BE = readInt64BE;
  /**
   * Reads 8 bytes from array starting at offset as big-endian
   * unsigned 64-bit integer and returns it.
   *
   * IMPORTANT: due to JavaScript limitation, supports values up to 2^53-1.
   */

  function readUint64BE(array, offset) {
    if (offset === void 0) {
      offset = 0;
    }

    var hi = readUint32BE(array, offset);
    var lo = readUint32BE(array, offset + 4);
    return hi * 0x100000000 + lo;
  }

  binary.readUint64BE = readUint64BE;
  /**
   * Reads 8 bytes from array starting at offset as little-endian
   * signed 64-bit integer and returns it.
   *
   * IMPORTANT: due to JavaScript limitation, supports exact
   * numbers in range -9007199254740991 to 9007199254740991.
   * If the number stored in the byte array is outside this range,
   * the result is not exact.
   */

  function readInt64LE(array, offset) {
    if (offset === void 0) {
      offset = 0;
    }

    var lo = readInt32LE(array, offset);
    var hi = readInt32LE(array, offset + 4);
    return hi * 0x100000000 + lo - (lo >> 31) * 0x100000000;
  }

  binary.readInt64LE = readInt64LE;
  /**
   * Reads 8 bytes from array starting at offset as little-endian
   * unsigned 64-bit integer and returns it.
   *
   * IMPORTANT: due to JavaScript limitation, supports values up to 2^53-1.
   */

  function readUint64LE(array, offset) {
    if (offset === void 0) {
      offset = 0;
    }

    var lo = readUint32LE(array, offset);
    var hi = readUint32LE(array, offset + 4);
    return hi * 0x100000000 + lo;
  }

  binary.readUint64LE = readUint64LE;
  /**
   * Writes 8-byte big-endian representation of 64-bit unsigned
   * value to byte array starting at offset.
   *
   * Due to JavaScript limitation, supports values up to 2^53-1.
   *
   * If byte array is not given, creates a new 8-byte one.
   *
   * Returns the output byte array.
   */

  function writeUint64BE(value, out, offset) {
    if (out === void 0) {
      out = new Uint8Array(8);
    }

    if (offset === void 0) {
      offset = 0;
    }

    writeUint32BE(value / 0x100000000 >>> 0, out, offset);
    writeUint32BE(value >>> 0, out, offset + 4);
    return out;
  }

  binary.writeUint64BE = writeUint64BE;
  binary.writeInt64BE = writeUint64BE;
  /**
   * Writes 8-byte little-endian representation of 64-bit unsigned
   * value to byte array starting at offset.
   *
   * Due to JavaScript limitation, supports values up to 2^53-1.
   *
   * If byte array is not given, creates a new 8-byte one.
   *
   * Returns the output byte array.
   */

  function writeUint64LE(value, out, offset) {
    if (out === void 0) {
      out = new Uint8Array(8);
    }

    if (offset === void 0) {
      offset = 0;
    }

    writeUint32LE(value >>> 0, out, offset);
    writeUint32LE(value / 0x100000000 >>> 0, out, offset + 4);
    return out;
  }

  binary.writeUint64LE = writeUint64LE;
  binary.writeInt64LE = writeUint64LE;
  /**
   * Reads bytes from array starting at offset as big-endian
   * unsigned bitLen-bit integer and returns it.
   *
   * Supports bit lengths divisible by 8, up to 48.
   */

  function readUintBE(bitLength, array, offset) {
    if (offset === void 0) {
      offset = 0;
    } // TODO(dchest): implement support for bitLengths non-divisible by 8


    if (bitLength % 8 !== 0) {
      throw new Error("readUintBE supports only bitLengths divisible by 8");
    }

    if (bitLength / 8 > array.length - offset) {
      throw new Error("readUintBE: array is too short for the given bitLength");
    }

    var result = 0;
    var mul = 1;

    for (var i = bitLength / 8 + offset - 1; i >= offset; i--) {
      result += array[i] * mul;
      mul *= 256;
    }

    return result;
  }

  binary.readUintBE = readUintBE;
  /**
   * Reads bytes from array starting at offset as little-endian
   * unsigned bitLen-bit integer and returns it.
   *
   * Supports bit lengths divisible by 8, up to 48.
   */

  function readUintLE(bitLength, array, offset) {
    if (offset === void 0) {
      offset = 0;
    } // TODO(dchest): implement support for bitLengths non-divisible by 8


    if (bitLength % 8 !== 0) {
      throw new Error("readUintLE supports only bitLengths divisible by 8");
    }

    if (bitLength / 8 > array.length - offset) {
      throw new Error("readUintLE: array is too short for the given bitLength");
    }

    var result = 0;
    var mul = 1;

    for (var i = offset; i < offset + bitLength / 8; i++) {
      result += array[i] * mul;
      mul *= 256;
    }

    return result;
  }

  binary.readUintLE = readUintLE;
  /**
   * Writes a big-endian representation of bitLen-bit unsigned
   * value to array starting at offset.
   *
   * Supports bit lengths divisible by 8, up to 48.
   *
   * If byte array is not given, creates a new one.
   *
   * Returns the output byte array.
   */

  function writeUintBE(bitLength, value, out, offset) {
    if (out === void 0) {
      out = new Uint8Array(bitLength / 8);
    }

    if (offset === void 0) {
      offset = 0;
    } // TODO(dchest): implement support for bitLengths non-divisible by 8


    if (bitLength % 8 !== 0) {
      throw new Error("writeUintBE supports only bitLengths divisible by 8");
    }

    if (!int_1.isSafeInteger(value)) {
      throw new Error("writeUintBE value must be an integer");
    }

    var div = 1;

    for (var i = bitLength / 8 + offset - 1; i >= offset; i--) {
      out[i] = value / div & 0xff;
      div *= 256;
    }

    return out;
  }

  binary.writeUintBE = writeUintBE;
  /**
   * Writes a little-endian representation of bitLen-bit unsigned
   * value to array starting at offset.
   *
   * Supports bit lengths divisible by 8, up to 48.
   *
   * If byte array is not given, creates a new one.
   *
   * Returns the output byte array.
   */

  function writeUintLE(bitLength, value, out, offset) {
    if (out === void 0) {
      out = new Uint8Array(bitLength / 8);
    }

    if (offset === void 0) {
      offset = 0;
    } // TODO(dchest): implement support for bitLengths non-divisible by 8


    if (bitLength % 8 !== 0) {
      throw new Error("writeUintLE supports only bitLengths divisible by 8");
    }

    if (!int_1.isSafeInteger(value)) {
      throw new Error("writeUintLE value must be an integer");
    }

    var div = 1;

    for (var i = offset; i < offset + bitLength / 8; i++) {
      out[i] = value / div & 0xff;
      div *= 256;
    }

    return out;
  }

  binary.writeUintLE = writeUintLE;
  /**
   * Reads 4 bytes from array starting at offset as big-endian
   * 32-bit floating-point number and returns it.
   */

  function readFloat32BE(array, offset) {
    if (offset === void 0) {
      offset = 0;
    }

    var view = new DataView(array.buffer, array.byteOffset, array.byteLength);
    return view.getFloat32(offset);
  }

  binary.readFloat32BE = readFloat32BE;
  /**
   * Reads 4 bytes from array starting at offset as little-endian
   * 32-bit floating-point number and returns it.
   */

  function readFloat32LE(array, offset) {
    if (offset === void 0) {
      offset = 0;
    }

    var view = new DataView(array.buffer, array.byteOffset, array.byteLength);
    return view.getFloat32(offset, true);
  }

  binary.readFloat32LE = readFloat32LE;
  /**
   * Reads 8 bytes from array starting at offset as big-endian
   * 64-bit floating-point number ("double") and returns it.
   */

  function readFloat64BE(array, offset) {
    if (offset === void 0) {
      offset = 0;
    }

    var view = new DataView(array.buffer, array.byteOffset, array.byteLength);
    return view.getFloat64(offset);
  }

  binary.readFloat64BE = readFloat64BE;
  /**
   * Reads 8 bytes from array starting at offset as little-endian
   * 64-bit floating-point number ("double") and returns it.
   */

  function readFloat64LE(array, offset) {
    if (offset === void 0) {
      offset = 0;
    }

    var view = new DataView(array.buffer, array.byteOffset, array.byteLength);
    return view.getFloat64(offset, true);
  }

  binary.readFloat64LE = readFloat64LE;
  /**
   * Writes 4-byte big-endian floating-point representation of value
   * to byte array starting at offset.
   *
   * If byte array is not given, creates a new 4-byte one.
   *
   * Returns the output byte array.
   */

  function writeFloat32BE(value, out, offset) {
    if (out === void 0) {
      out = new Uint8Array(4);
    }

    if (offset === void 0) {
      offset = 0;
    }

    var view = new DataView(out.buffer, out.byteOffset, out.byteLength);
    view.setFloat32(offset, value);
    return out;
  }

  binary.writeFloat32BE = writeFloat32BE;
  /**
   * Writes 4-byte little-endian floating-point representation of value
   * to byte array starting at offset.
   *
   * If byte array is not given, creates a new 4-byte one.
   *
   * Returns the output byte array.
   */

  function writeFloat32LE(value, out, offset) {
    if (out === void 0) {
      out = new Uint8Array(4);
    }

    if (offset === void 0) {
      offset = 0;
    }

    var view = new DataView(out.buffer, out.byteOffset, out.byteLength);
    view.setFloat32(offset, value, true);
    return out;
  }

  binary.writeFloat32LE = writeFloat32LE;
  /**
   * Writes 8-byte big-endian floating-point representation of value
   * to byte array starting at offset.
   *
   * If byte array is not given, creates a new 8-byte one.
   *
   * Returns the output byte array.
   */

  function writeFloat64BE(value, out, offset) {
    if (out === void 0) {
      out = new Uint8Array(8);
    }

    if (offset === void 0) {
      offset = 0;
    }

    var view = new DataView(out.buffer, out.byteOffset, out.byteLength);
    view.setFloat64(offset, value);
    return out;
  }

  binary.writeFloat64BE = writeFloat64BE;
  /**
   * Writes 8-byte little-endian floating-point representation of value
   * to byte array starting at offset.
   *
   * If byte array is not given, creates a new 8-byte one.
   *
   * Returns the output byte array.
   */

  function writeFloat64LE(value, out, offset) {
    if (out === void 0) {
      out = new Uint8Array(8);
    }

    if (offset === void 0) {
      offset = 0;
    }

    var view = new DataView(out.buffer, out.byteOffset, out.byteLength);
    view.setFloat64(offset, value, true);
    return out;
  }

  binary.writeFloat64LE = writeFloat64LE;

  (function (exports) {
    // MIT License. See LICENSE file for details.

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var system_1 = system;
    var binary_1 = binary;
    var wipe_1 = wipe$1;
    exports.defaultRandomSource = new system_1.SystemRandomSource();

    function randomBytes(length, prng) {
      if (prng === void 0) {
        prng = exports.defaultRandomSource;
      }

      return prng.randomBytes(length);
    }

    exports.randomBytes = randomBytes;
    /**
     * Returns a uniformly random unsigned 32-bit integer.
     */

    function randomUint32(prng) {
      if (prng === void 0) {
        prng = exports.defaultRandomSource;
      } // Generate 4-byte random buffer.


      var buf = randomBytes(4, prng); // Convert bytes from buffer into a 32-bit integer.
      // It's not important which byte order to use, since
      // the result is random.

      var result = binary_1.readUint32LE(buf); // Clean the buffer.

      wipe_1.wipe(buf);
      return result;
    }

    exports.randomUint32 = randomUint32;
    /** 62 alphanumeric characters for default charset of randomString() */

    var ALPHANUMERIC = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    /**
     * Returns a uniform random string of the given length
     * with characters from the given charset.
     *
     * Charset must not have more than 256 characters.
     *
     * Default charset generates case-sensitive alphanumeric
     * strings (0-9, A-Z, a-z).
     */

    function randomString(length, charset, prng) {
      if (charset === void 0) {
        charset = ALPHANUMERIC;
      }

      if (prng === void 0) {
        prng = exports.defaultRandomSource;
      }

      if (charset.length < 2) {
        throw new Error("randomString charset is too short");
      }

      if (charset.length > 256) {
        throw new Error("randomString charset is too long");
      }

      var out = '';
      var charsLen = charset.length;
      var maxByte = 256 - 256 % charsLen;

      while (length > 0) {
        var buf = randomBytes(Math.ceil(length * 256 / maxByte), prng);

        for (var i = 0; i < buf.length && length > 0; i++) {
          var randomByte = buf[i];

          if (randomByte < maxByte) {
            out += charset.charAt(randomByte % charsLen);
            length--;
          }
        }

        wipe_1.wipe(buf);
      }

      return out;
    }

    exports.randomString = randomString;
    /**
     * Returns uniform random string containing at least the given
     * number of bits of entropy.
     *
     * For example, randomStringForEntropy(128) will return a 22-character
     * alphanumeric string, while randomStringForEntropy(128, "0123456789")
     * will return a 39-character numeric string, both will contain at
     * least 128 bits of entropy.
     *
     * Default charset generates case-sensitive alphanumeric
     * strings (0-9, A-Z, a-z).
     */

    function randomStringForEntropy(bits, charset, prng) {
      if (charset === void 0) {
        charset = ALPHANUMERIC;
      }

      if (prng === void 0) {
        prng = exports.defaultRandomSource;
      }

      var length = Math.ceil(bits / (Math.log(charset.length) / Math.LN2));
      return randomString(length, charset, prng);
    }

    exports.randomStringForEntropy = randomStringForEntropy;
  })(random);

  var sha512 = {};

  (function (exports) {
    // MIT License. See LICENSE file for details.

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var binary_1 = binary;
    var wipe_1 = wipe$1;
    exports.DIGEST_LENGTH = 64;
    exports.BLOCK_SIZE = 128;
    /**
     * SHA-2-512 cryptographic hash algorithm.
     */

    var SHA512 =
    /** @class */
    function () {
      function SHA512() {
        /** Length of hash output */
        this.digestLength = exports.DIGEST_LENGTH;
        /** Block size */

        this.blockSize = exports.BLOCK_SIZE; // Note: Int32Array is used instead of Uint32Array for performance reasons.

        this._stateHi = new Int32Array(8); // hash state, high bytes

        this._stateLo = new Int32Array(8); // hash state, low bytes

        this._tempHi = new Int32Array(16); // temporary state, high bytes

        this._tempLo = new Int32Array(16); // temporary state, low bytes

        this._buffer = new Uint8Array(256); // buffer for data to hash

        this._bufferLength = 0; // number of bytes in buffer

        this._bytesHashed = 0; // number of total bytes hashed

        this._finished = false; // indicates whether the hash was finalized

        this.reset();
      }

      SHA512.prototype._initState = function () {
        this._stateHi[0] = 0x6a09e667;
        this._stateHi[1] = 0xbb67ae85;
        this._stateHi[2] = 0x3c6ef372;
        this._stateHi[3] = 0xa54ff53a;
        this._stateHi[4] = 0x510e527f;
        this._stateHi[5] = 0x9b05688c;
        this._stateHi[6] = 0x1f83d9ab;
        this._stateHi[7] = 0x5be0cd19;
        this._stateLo[0] = 0xf3bcc908;
        this._stateLo[1] = 0x84caa73b;
        this._stateLo[2] = 0xfe94f82b;
        this._stateLo[3] = 0x5f1d36f1;
        this._stateLo[4] = 0xade682d1;
        this._stateLo[5] = 0x2b3e6c1f;
        this._stateLo[6] = 0xfb41bd6b;
        this._stateLo[7] = 0x137e2179;
      };
      /**
       * Resets hash state making it possible
       * to re-use this instance to hash other data.
       */


      SHA512.prototype.reset = function () {
        this._initState();

        this._bufferLength = 0;
        this._bytesHashed = 0;
        this._finished = false;
        return this;
      };
      /**
       * Cleans internal buffers and resets hash state.
       */


      SHA512.prototype.clean = function () {
        wipe_1.wipe(this._buffer);
        wipe_1.wipe(this._tempHi);
        wipe_1.wipe(this._tempLo);
        this.reset();
      };
      /**
       * Updates hash state with the given data.
       *
       * Throws error when trying to update already finalized hash:
       * instance must be reset to update it again.
       */


      SHA512.prototype.update = function (data, dataLength) {
        if (dataLength === void 0) {
          dataLength = data.length;
        }

        if (this._finished) {
          throw new Error("SHA512: can't update because hash was finished.");
        }

        var dataPos = 0;
        this._bytesHashed += dataLength;

        if (this._bufferLength > 0) {
          while (this._bufferLength < exports.BLOCK_SIZE && dataLength > 0) {
            this._buffer[this._bufferLength++] = data[dataPos++];
            dataLength--;
          }

          if (this._bufferLength === this.blockSize) {
            hashBlocks(this._tempHi, this._tempLo, this._stateHi, this._stateLo, this._buffer, 0, this.blockSize);
            this._bufferLength = 0;
          }
        }

        if (dataLength >= this.blockSize) {
          dataPos = hashBlocks(this._tempHi, this._tempLo, this._stateHi, this._stateLo, data, dataPos, dataLength);
          dataLength %= this.blockSize;
        }

        while (dataLength > 0) {
          this._buffer[this._bufferLength++] = data[dataPos++];
          dataLength--;
        }

        return this;
      };
      /**
       * Finalizes hash state and puts hash into out.
       * If hash was already finalized, puts the same value.
       */


      SHA512.prototype.finish = function (out) {
        if (!this._finished) {
          var bytesHashed = this._bytesHashed;
          var left = this._bufferLength;
          var bitLenHi = bytesHashed / 0x20000000 | 0;
          var bitLenLo = bytesHashed << 3;
          var padLength = bytesHashed % 128 < 112 ? 128 : 256;
          this._buffer[left] = 0x80;

          for (var i = left + 1; i < padLength - 8; i++) {
            this._buffer[i] = 0;
          }

          binary_1.writeUint32BE(bitLenHi, this._buffer, padLength - 8);
          binary_1.writeUint32BE(bitLenLo, this._buffer, padLength - 4);
          hashBlocks(this._tempHi, this._tempLo, this._stateHi, this._stateLo, this._buffer, 0, padLength);
          this._finished = true;
        }

        for (var i = 0; i < this.digestLength / 8; i++) {
          binary_1.writeUint32BE(this._stateHi[i], out, i * 8);
          binary_1.writeUint32BE(this._stateLo[i], out, i * 8 + 4);
        }

        return this;
      };
      /**
       * Returns the final hash digest.
       */


      SHA512.prototype.digest = function () {
        var out = new Uint8Array(this.digestLength);
        this.finish(out);
        return out;
      };
      /**
       * Function useful for HMAC/PBKDF2 optimization. Returns hash state to be
       * used with restoreState(). Only chain value is saved, not buffers or
       * other state variables.
       */


      SHA512.prototype.saveState = function () {
        if (this._finished) {
          throw new Error("SHA256: cannot save finished state");
        }

        return {
          stateHi: new Int32Array(this._stateHi),
          stateLo: new Int32Array(this._stateLo),
          buffer: this._bufferLength > 0 ? new Uint8Array(this._buffer) : undefined,
          bufferLength: this._bufferLength,
          bytesHashed: this._bytesHashed
        };
      };
      /**
       * Function useful for HMAC/PBKDF2 optimization. Restores state saved by
       * saveState() and sets bytesHashed to the given value.
       */


      SHA512.prototype.restoreState = function (savedState) {
        this._stateHi.set(savedState.stateHi);

        this._stateLo.set(savedState.stateLo);

        this._bufferLength = savedState.bufferLength;

        if (savedState.buffer) {
          this._buffer.set(savedState.buffer);
        }

        this._bytesHashed = savedState.bytesHashed;
        this._finished = false;
        return this;
      };
      /**
       * Cleans state returned by saveState().
       */


      SHA512.prototype.cleanSavedState = function (savedState) {
        wipe_1.wipe(savedState.stateHi);
        wipe_1.wipe(savedState.stateLo);

        if (savedState.buffer) {
          wipe_1.wipe(savedState.buffer);
        }

        savedState.bufferLength = 0;
        savedState.bytesHashed = 0;
      };

      return SHA512;
    }();

    exports.SHA512 = SHA512; // Constants

    var K = new Int32Array([0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd, 0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc, 0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019, 0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118, 0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe, 0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2, 0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1, 0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694, 0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3, 0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65, 0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483, 0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5, 0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210, 0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4, 0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725, 0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70, 0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926, 0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df, 0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8, 0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b, 0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001, 0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30, 0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910, 0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8, 0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53, 0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8, 0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb, 0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3, 0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60, 0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec, 0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9, 0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b, 0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207, 0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178, 0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6, 0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b, 0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493, 0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c, 0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a, 0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817]);

    function hashBlocks(wh, wl, hh, hl, m, pos, len) {
      var ah0 = hh[0],
          ah1 = hh[1],
          ah2 = hh[2],
          ah3 = hh[3],
          ah4 = hh[4],
          ah5 = hh[5],
          ah6 = hh[6],
          ah7 = hh[7],
          al0 = hl[0],
          al1 = hl[1],
          al2 = hl[2],
          al3 = hl[3],
          al4 = hl[4],
          al5 = hl[5],
          al6 = hl[6],
          al7 = hl[7];
      var h, l;
      var th, tl;
      var a, b, c, d;

      while (len >= 128) {
        for (var i = 0; i < 16; i++) {
          var j = 8 * i + pos;
          wh[i] = binary_1.readUint32BE(m, j);
          wl[i] = binary_1.readUint32BE(m, j + 4);
        }

        for (var i = 0; i < 80; i++) {
          var bh0 = ah0;
          var bh1 = ah1;
          var bh2 = ah2;
          var bh3 = ah3;
          var bh4 = ah4;
          var bh5 = ah5;
          var bh6 = ah6;
          var bh7 = ah7;
          var bl0 = al0;
          var bl1 = al1;
          var bl2 = al2;
          var bl3 = al3;
          var bl4 = al4;
          var bl5 = al5;
          var bl6 = al6;
          var bl7 = al7; // add

          h = ah7;
          l = al7;
          a = l & 0xffff;
          b = l >>> 16;
          c = h & 0xffff;
          d = h >>> 16; // Sigma1

          h = (ah4 >>> 14 | al4 << 32 - 14) ^ (ah4 >>> 18 | al4 << 32 - 18) ^ (al4 >>> 41 - 32 | ah4 << 32 - (41 - 32));
          l = (al4 >>> 14 | ah4 << 32 - 14) ^ (al4 >>> 18 | ah4 << 32 - 18) ^ (ah4 >>> 41 - 32 | al4 << 32 - (41 - 32));
          a += l & 0xffff;
          b += l >>> 16;
          c += h & 0xffff;
          d += h >>> 16; // Ch

          h = ah4 & ah5 ^ ~ah4 & ah6;
          l = al4 & al5 ^ ~al4 & al6;
          a += l & 0xffff;
          b += l >>> 16;
          c += h & 0xffff;
          d += h >>> 16; // K

          h = K[i * 2];
          l = K[i * 2 + 1];
          a += l & 0xffff;
          b += l >>> 16;
          c += h & 0xffff;
          d += h >>> 16; // w

          h = wh[i % 16];
          l = wl[i % 16];
          a += l & 0xffff;
          b += l >>> 16;
          c += h & 0xffff;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          th = c & 0xffff | d << 16;
          tl = a & 0xffff | b << 16; // add

          h = th;
          l = tl;
          a = l & 0xffff;
          b = l >>> 16;
          c = h & 0xffff;
          d = h >>> 16; // Sigma0

          h = (ah0 >>> 28 | al0 << 32 - 28) ^ (al0 >>> 34 - 32 | ah0 << 32 - (34 - 32)) ^ (al0 >>> 39 - 32 | ah0 << 32 - (39 - 32));
          l = (al0 >>> 28 | ah0 << 32 - 28) ^ (ah0 >>> 34 - 32 | al0 << 32 - (34 - 32)) ^ (ah0 >>> 39 - 32 | al0 << 32 - (39 - 32));
          a += l & 0xffff;
          b += l >>> 16;
          c += h & 0xffff;
          d += h >>> 16; // Maj

          h = ah0 & ah1 ^ ah0 & ah2 ^ ah1 & ah2;
          l = al0 & al1 ^ al0 & al2 ^ al1 & al2;
          a += l & 0xffff;
          b += l >>> 16;
          c += h & 0xffff;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          bh7 = c & 0xffff | d << 16;
          bl7 = a & 0xffff | b << 16; // add

          h = bh3;
          l = bl3;
          a = l & 0xffff;
          b = l >>> 16;
          c = h & 0xffff;
          d = h >>> 16;
          h = th;
          l = tl;
          a += l & 0xffff;
          b += l >>> 16;
          c += h & 0xffff;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          bh3 = c & 0xffff | d << 16;
          bl3 = a & 0xffff | b << 16;
          ah1 = bh0;
          ah2 = bh1;
          ah3 = bh2;
          ah4 = bh3;
          ah5 = bh4;
          ah6 = bh5;
          ah7 = bh6;
          ah0 = bh7;
          al1 = bl0;
          al2 = bl1;
          al3 = bl2;
          al4 = bl3;
          al5 = bl4;
          al6 = bl5;
          al7 = bl6;
          al0 = bl7;

          if (i % 16 === 15) {
            for (var j = 0; j < 16; j++) {
              // add
              h = wh[j];
              l = wl[j];
              a = l & 0xffff;
              b = l >>> 16;
              c = h & 0xffff;
              d = h >>> 16;
              h = wh[(j + 9) % 16];
              l = wl[(j + 9) % 16];
              a += l & 0xffff;
              b += l >>> 16;
              c += h & 0xffff;
              d += h >>> 16; // sigma0

              th = wh[(j + 1) % 16];
              tl = wl[(j + 1) % 16];
              h = (th >>> 1 | tl << 32 - 1) ^ (th >>> 8 | tl << 32 - 8) ^ th >>> 7;
              l = (tl >>> 1 | th << 32 - 1) ^ (tl >>> 8 | th << 32 - 8) ^ (tl >>> 7 | th << 32 - 7);
              a += l & 0xffff;
              b += l >>> 16;
              c += h & 0xffff;
              d += h >>> 16; // sigma1

              th = wh[(j + 14) % 16];
              tl = wl[(j + 14) % 16];
              h = (th >>> 19 | tl << 32 - 19) ^ (tl >>> 61 - 32 | th << 32 - (61 - 32)) ^ th >>> 6;
              l = (tl >>> 19 | th << 32 - 19) ^ (th >>> 61 - 32 | tl << 32 - (61 - 32)) ^ (tl >>> 6 | th << 32 - 6);
              a += l & 0xffff;
              b += l >>> 16;
              c += h & 0xffff;
              d += h >>> 16;
              b += a >>> 16;
              c += b >>> 16;
              d += c >>> 16;
              wh[j] = c & 0xffff | d << 16;
              wl[j] = a & 0xffff | b << 16;
            }
          }
        } // add


        h = ah0;
        l = al0;
        a = l & 0xffff;
        b = l >>> 16;
        c = h & 0xffff;
        d = h >>> 16;
        h = hh[0];
        l = hl[0];
        a += l & 0xffff;
        b += l >>> 16;
        c += h & 0xffff;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[0] = ah0 = c & 0xffff | d << 16;
        hl[0] = al0 = a & 0xffff | b << 16;
        h = ah1;
        l = al1;
        a = l & 0xffff;
        b = l >>> 16;
        c = h & 0xffff;
        d = h >>> 16;
        h = hh[1];
        l = hl[1];
        a += l & 0xffff;
        b += l >>> 16;
        c += h & 0xffff;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[1] = ah1 = c & 0xffff | d << 16;
        hl[1] = al1 = a & 0xffff | b << 16;
        h = ah2;
        l = al2;
        a = l & 0xffff;
        b = l >>> 16;
        c = h & 0xffff;
        d = h >>> 16;
        h = hh[2];
        l = hl[2];
        a += l & 0xffff;
        b += l >>> 16;
        c += h & 0xffff;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[2] = ah2 = c & 0xffff | d << 16;
        hl[2] = al2 = a & 0xffff | b << 16;
        h = ah3;
        l = al3;
        a = l & 0xffff;
        b = l >>> 16;
        c = h & 0xffff;
        d = h >>> 16;
        h = hh[3];
        l = hl[3];
        a += l & 0xffff;
        b += l >>> 16;
        c += h & 0xffff;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[3] = ah3 = c & 0xffff | d << 16;
        hl[3] = al3 = a & 0xffff | b << 16;
        h = ah4;
        l = al4;
        a = l & 0xffff;
        b = l >>> 16;
        c = h & 0xffff;
        d = h >>> 16;
        h = hh[4];
        l = hl[4];
        a += l & 0xffff;
        b += l >>> 16;
        c += h & 0xffff;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[4] = ah4 = c & 0xffff | d << 16;
        hl[4] = al4 = a & 0xffff | b << 16;
        h = ah5;
        l = al5;
        a = l & 0xffff;
        b = l >>> 16;
        c = h & 0xffff;
        d = h >>> 16;
        h = hh[5];
        l = hl[5];
        a += l & 0xffff;
        b += l >>> 16;
        c += h & 0xffff;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[5] = ah5 = c & 0xffff | d << 16;
        hl[5] = al5 = a & 0xffff | b << 16;
        h = ah6;
        l = al6;
        a = l & 0xffff;
        b = l >>> 16;
        c = h & 0xffff;
        d = h >>> 16;
        h = hh[6];
        l = hl[6];
        a += l & 0xffff;
        b += l >>> 16;
        c += h & 0xffff;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[6] = ah6 = c & 0xffff | d << 16;
        hl[6] = al6 = a & 0xffff | b << 16;
        h = ah7;
        l = al7;
        a = l & 0xffff;
        b = l >>> 16;
        c = h & 0xffff;
        d = h >>> 16;
        h = hh[7];
        l = hl[7];
        a += l & 0xffff;
        b += l >>> 16;
        c += h & 0xffff;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[7] = ah7 = c & 0xffff | d << 16;
        hl[7] = al7 = a & 0xffff | b << 16;
        pos += 128;
        len -= 128;
      }

      return pos;
    }

    function hash(data) {
      var h = new SHA512();
      h.update(data);
      var digest = h.digest();
      h.clean();
      return digest;
    }

    exports.hash = hash;
  })(sha512);

  (function (exports) {
    // MIT License. See LICENSE file for details.

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    /**
     * Package ed25519 implements Ed25519 public-key signature algorithm.
     */

    var random_1 = random;
    var sha512_1 = sha512;
    var wipe_1 = wipe$1;
    exports.SIGNATURE_LENGTH = 64;
    exports.PUBLIC_KEY_LENGTH = 32;
    exports.SECRET_KEY_LENGTH = 64;
    exports.SEED_LENGTH = 32; // Returns new zero-filled 16-element GF (Float64Array).
    // If passed an array of numbers, prefills the returned
    // array with them.
    //
    // We use Float64Array, because we need 48-bit numbers
    // for this implementation.

    function gf(init) {
      var r = new Float64Array(16);

      if (init) {
        for (var i = 0; i < init.length; i++) {
          r[i] = init[i];
        }
      }

      return r;
    } // Base point.


    var _9 = new Uint8Array(32);

    _9[0] = 9;
    var gf0 = gf();
    var gf1 = gf([1]);
    var D = gf([0x78a3, 0x1359, 0x4dca, 0x75eb, 0xd8ab, 0x4141, 0x0a4d, 0x0070, 0xe898, 0x7779, 0x4079, 0x8cc7, 0xfe73, 0x2b6f, 0x6cee, 0x5203]);
    var D2 = gf([0xf159, 0x26b2, 0x9b94, 0xebd6, 0xb156, 0x8283, 0x149a, 0x00e0, 0xd130, 0xeef3, 0x80f2, 0x198e, 0xfce7, 0x56df, 0xd9dc, 0x2406]);
    var X = gf([0xd51a, 0x8f25, 0x2d60, 0xc956, 0xa7b2, 0x9525, 0xc760, 0x692c, 0xdc5c, 0xfdd6, 0xe231, 0xc0a4, 0x53fe, 0xcd6e, 0x36d3, 0x2169]);
    var Y = gf([0x6658, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666]);
    var I = gf([0xa0b0, 0x4a0e, 0x1b27, 0xc4ee, 0xe478, 0xad2f, 0x1806, 0x2f43, 0xd7a7, 0x3dfb, 0x0099, 0x2b4d, 0xdf0b, 0x4fc1, 0x2480, 0x2b83]);

    function set25519(r, a) {
      for (var i = 0; i < 16; i++) {
        r[i] = a[i] | 0;
      }
    }

    function car25519(o) {
      var c = 1;

      for (var i = 0; i < 16; i++) {
        var v = o[i] + c + 65535;
        c = Math.floor(v / 65536);
        o[i] = v - c * 65536;
      }

      o[0] += c - 1 + 37 * (c - 1);
    }

    function sel25519(p, q, b) {
      var c = ~(b - 1);

      for (var i = 0; i < 16; i++) {
        var t = c & (p[i] ^ q[i]);
        p[i] ^= t;
        q[i] ^= t;
      }
    }

    function pack25519(o, n) {
      var m = gf();
      var t = gf();

      for (var i = 0; i < 16; i++) {
        t[i] = n[i];
      }

      car25519(t);
      car25519(t);
      car25519(t);

      for (var j = 0; j < 2; j++) {
        m[0] = t[0] - 0xffed;

        for (var i = 1; i < 15; i++) {
          m[i] = t[i] - 0xffff - (m[i - 1] >> 16 & 1);
          m[i - 1] &= 0xffff;
        }

        m[15] = t[15] - 0x7fff - (m[14] >> 16 & 1);
        var b = m[15] >> 16 & 1;
        m[14] &= 0xffff;
        sel25519(t, m, 1 - b);
      }

      for (var i = 0; i < 16; i++) {
        o[2 * i] = t[i] & 0xff;
        o[2 * i + 1] = t[i] >> 8;
      }
    }

    function verify32(x, y) {
      var d = 0;

      for (var i = 0; i < 32; i++) {
        d |= x[i] ^ y[i];
      }

      return (1 & d - 1 >>> 8) - 1;
    }

    function neq25519(a, b) {
      var c = new Uint8Array(32);
      var d = new Uint8Array(32);
      pack25519(c, a);
      pack25519(d, b);
      return verify32(c, d);
    }

    function par25519(a) {
      var d = new Uint8Array(32);
      pack25519(d, a);
      return d[0] & 1;
    }

    function unpack25519(o, n) {
      for (var i = 0; i < 16; i++) {
        o[i] = n[2 * i] + (n[2 * i + 1] << 8);
      }

      o[15] &= 0x7fff;
    }

    function add(o, a, b) {
      for (var i = 0; i < 16; i++) {
        o[i] = a[i] + b[i];
      }
    }

    function sub(o, a, b) {
      for (var i = 0; i < 16; i++) {
        o[i] = a[i] - b[i];
      }
    }

    function mul(o, a, b) {
      var v,
          c,
          t0 = 0,
          t1 = 0,
          t2 = 0,
          t3 = 0,
          t4 = 0,
          t5 = 0,
          t6 = 0,
          t7 = 0,
          t8 = 0,
          t9 = 0,
          t10 = 0,
          t11 = 0,
          t12 = 0,
          t13 = 0,
          t14 = 0,
          t15 = 0,
          t16 = 0,
          t17 = 0,
          t18 = 0,
          t19 = 0,
          t20 = 0,
          t21 = 0,
          t22 = 0,
          t23 = 0,
          t24 = 0,
          t25 = 0,
          t26 = 0,
          t27 = 0,
          t28 = 0,
          t29 = 0,
          t30 = 0,
          b0 = b[0],
          b1 = b[1],
          b2 = b[2],
          b3 = b[3],
          b4 = b[4],
          b5 = b[5],
          b6 = b[6],
          b7 = b[7],
          b8 = b[8],
          b9 = b[9],
          b10 = b[10],
          b11 = b[11],
          b12 = b[12],
          b13 = b[13],
          b14 = b[14],
          b15 = b[15];
      v = a[0];
      t0 += v * b0;
      t1 += v * b1;
      t2 += v * b2;
      t3 += v * b3;
      t4 += v * b4;
      t5 += v * b5;
      t6 += v * b6;
      t7 += v * b7;
      t8 += v * b8;
      t9 += v * b9;
      t10 += v * b10;
      t11 += v * b11;
      t12 += v * b12;
      t13 += v * b13;
      t14 += v * b14;
      t15 += v * b15;
      v = a[1];
      t1 += v * b0;
      t2 += v * b1;
      t3 += v * b2;
      t4 += v * b3;
      t5 += v * b4;
      t6 += v * b5;
      t7 += v * b6;
      t8 += v * b7;
      t9 += v * b8;
      t10 += v * b9;
      t11 += v * b10;
      t12 += v * b11;
      t13 += v * b12;
      t14 += v * b13;
      t15 += v * b14;
      t16 += v * b15;
      v = a[2];
      t2 += v * b0;
      t3 += v * b1;
      t4 += v * b2;
      t5 += v * b3;
      t6 += v * b4;
      t7 += v * b5;
      t8 += v * b6;
      t9 += v * b7;
      t10 += v * b8;
      t11 += v * b9;
      t12 += v * b10;
      t13 += v * b11;
      t14 += v * b12;
      t15 += v * b13;
      t16 += v * b14;
      t17 += v * b15;
      v = a[3];
      t3 += v * b0;
      t4 += v * b1;
      t5 += v * b2;
      t6 += v * b3;
      t7 += v * b4;
      t8 += v * b5;
      t9 += v * b6;
      t10 += v * b7;
      t11 += v * b8;
      t12 += v * b9;
      t13 += v * b10;
      t14 += v * b11;
      t15 += v * b12;
      t16 += v * b13;
      t17 += v * b14;
      t18 += v * b15;
      v = a[4];
      t4 += v * b0;
      t5 += v * b1;
      t6 += v * b2;
      t7 += v * b3;
      t8 += v * b4;
      t9 += v * b5;
      t10 += v * b6;
      t11 += v * b7;
      t12 += v * b8;
      t13 += v * b9;
      t14 += v * b10;
      t15 += v * b11;
      t16 += v * b12;
      t17 += v * b13;
      t18 += v * b14;
      t19 += v * b15;
      v = a[5];
      t5 += v * b0;
      t6 += v * b1;
      t7 += v * b2;
      t8 += v * b3;
      t9 += v * b4;
      t10 += v * b5;
      t11 += v * b6;
      t12 += v * b7;
      t13 += v * b8;
      t14 += v * b9;
      t15 += v * b10;
      t16 += v * b11;
      t17 += v * b12;
      t18 += v * b13;
      t19 += v * b14;
      t20 += v * b15;
      v = a[6];
      t6 += v * b0;
      t7 += v * b1;
      t8 += v * b2;
      t9 += v * b3;
      t10 += v * b4;
      t11 += v * b5;
      t12 += v * b6;
      t13 += v * b7;
      t14 += v * b8;
      t15 += v * b9;
      t16 += v * b10;
      t17 += v * b11;
      t18 += v * b12;
      t19 += v * b13;
      t20 += v * b14;
      t21 += v * b15;
      v = a[7];
      t7 += v * b0;
      t8 += v * b1;
      t9 += v * b2;
      t10 += v * b3;
      t11 += v * b4;
      t12 += v * b5;
      t13 += v * b6;
      t14 += v * b7;
      t15 += v * b8;
      t16 += v * b9;
      t17 += v * b10;
      t18 += v * b11;
      t19 += v * b12;
      t20 += v * b13;
      t21 += v * b14;
      t22 += v * b15;
      v = a[8];
      t8 += v * b0;
      t9 += v * b1;
      t10 += v * b2;
      t11 += v * b3;
      t12 += v * b4;
      t13 += v * b5;
      t14 += v * b6;
      t15 += v * b7;
      t16 += v * b8;
      t17 += v * b9;
      t18 += v * b10;
      t19 += v * b11;
      t20 += v * b12;
      t21 += v * b13;
      t22 += v * b14;
      t23 += v * b15;
      v = a[9];
      t9 += v * b0;
      t10 += v * b1;
      t11 += v * b2;
      t12 += v * b3;
      t13 += v * b4;
      t14 += v * b5;
      t15 += v * b6;
      t16 += v * b7;
      t17 += v * b8;
      t18 += v * b9;
      t19 += v * b10;
      t20 += v * b11;
      t21 += v * b12;
      t22 += v * b13;
      t23 += v * b14;
      t24 += v * b15;
      v = a[10];
      t10 += v * b0;
      t11 += v * b1;
      t12 += v * b2;
      t13 += v * b3;
      t14 += v * b4;
      t15 += v * b5;
      t16 += v * b6;
      t17 += v * b7;
      t18 += v * b8;
      t19 += v * b9;
      t20 += v * b10;
      t21 += v * b11;
      t22 += v * b12;
      t23 += v * b13;
      t24 += v * b14;
      t25 += v * b15;
      v = a[11];
      t11 += v * b0;
      t12 += v * b1;
      t13 += v * b2;
      t14 += v * b3;
      t15 += v * b4;
      t16 += v * b5;
      t17 += v * b6;
      t18 += v * b7;
      t19 += v * b8;
      t20 += v * b9;
      t21 += v * b10;
      t22 += v * b11;
      t23 += v * b12;
      t24 += v * b13;
      t25 += v * b14;
      t26 += v * b15;
      v = a[12];
      t12 += v * b0;
      t13 += v * b1;
      t14 += v * b2;
      t15 += v * b3;
      t16 += v * b4;
      t17 += v * b5;
      t18 += v * b6;
      t19 += v * b7;
      t20 += v * b8;
      t21 += v * b9;
      t22 += v * b10;
      t23 += v * b11;
      t24 += v * b12;
      t25 += v * b13;
      t26 += v * b14;
      t27 += v * b15;
      v = a[13];
      t13 += v * b0;
      t14 += v * b1;
      t15 += v * b2;
      t16 += v * b3;
      t17 += v * b4;
      t18 += v * b5;
      t19 += v * b6;
      t20 += v * b7;
      t21 += v * b8;
      t22 += v * b9;
      t23 += v * b10;
      t24 += v * b11;
      t25 += v * b12;
      t26 += v * b13;
      t27 += v * b14;
      t28 += v * b15;
      v = a[14];
      t14 += v * b0;
      t15 += v * b1;
      t16 += v * b2;
      t17 += v * b3;
      t18 += v * b4;
      t19 += v * b5;
      t20 += v * b6;
      t21 += v * b7;
      t22 += v * b8;
      t23 += v * b9;
      t24 += v * b10;
      t25 += v * b11;
      t26 += v * b12;
      t27 += v * b13;
      t28 += v * b14;
      t29 += v * b15;
      v = a[15];
      t15 += v * b0;
      t16 += v * b1;
      t17 += v * b2;
      t18 += v * b3;
      t19 += v * b4;
      t20 += v * b5;
      t21 += v * b6;
      t22 += v * b7;
      t23 += v * b8;
      t24 += v * b9;
      t25 += v * b10;
      t26 += v * b11;
      t27 += v * b12;
      t28 += v * b13;
      t29 += v * b14;
      t30 += v * b15;
      t0 += 38 * t16;
      t1 += 38 * t17;
      t2 += 38 * t18;
      t3 += 38 * t19;
      t4 += 38 * t20;
      t5 += 38 * t21;
      t6 += 38 * t22;
      t7 += 38 * t23;
      t8 += 38 * t24;
      t9 += 38 * t25;
      t10 += 38 * t26;
      t11 += 38 * t27;
      t12 += 38 * t28;
      t13 += 38 * t29;
      t14 += 38 * t30; // t15 left as is
      // first car

      c = 1;
      v = t0 + c + 65535;
      c = Math.floor(v / 65536);
      t0 = v - c * 65536;
      v = t1 + c + 65535;
      c = Math.floor(v / 65536);
      t1 = v - c * 65536;
      v = t2 + c + 65535;
      c = Math.floor(v / 65536);
      t2 = v - c * 65536;
      v = t3 + c + 65535;
      c = Math.floor(v / 65536);
      t3 = v - c * 65536;
      v = t4 + c + 65535;
      c = Math.floor(v / 65536);
      t4 = v - c * 65536;
      v = t5 + c + 65535;
      c = Math.floor(v / 65536);
      t5 = v - c * 65536;
      v = t6 + c + 65535;
      c = Math.floor(v / 65536);
      t6 = v - c * 65536;
      v = t7 + c + 65535;
      c = Math.floor(v / 65536);
      t7 = v - c * 65536;
      v = t8 + c + 65535;
      c = Math.floor(v / 65536);
      t8 = v - c * 65536;
      v = t9 + c + 65535;
      c = Math.floor(v / 65536);
      t9 = v - c * 65536;
      v = t10 + c + 65535;
      c = Math.floor(v / 65536);
      t10 = v - c * 65536;
      v = t11 + c + 65535;
      c = Math.floor(v / 65536);
      t11 = v - c * 65536;
      v = t12 + c + 65535;
      c = Math.floor(v / 65536);
      t12 = v - c * 65536;
      v = t13 + c + 65535;
      c = Math.floor(v / 65536);
      t13 = v - c * 65536;
      v = t14 + c + 65535;
      c = Math.floor(v / 65536);
      t14 = v - c * 65536;
      v = t15 + c + 65535;
      c = Math.floor(v / 65536);
      t15 = v - c * 65536;
      t0 += c - 1 + 37 * (c - 1); // second car

      c = 1;
      v = t0 + c + 65535;
      c = Math.floor(v / 65536);
      t0 = v - c * 65536;
      v = t1 + c + 65535;
      c = Math.floor(v / 65536);
      t1 = v - c * 65536;
      v = t2 + c + 65535;
      c = Math.floor(v / 65536);
      t2 = v - c * 65536;
      v = t3 + c + 65535;
      c = Math.floor(v / 65536);
      t3 = v - c * 65536;
      v = t4 + c + 65535;
      c = Math.floor(v / 65536);
      t4 = v - c * 65536;
      v = t5 + c + 65535;
      c = Math.floor(v / 65536);
      t5 = v - c * 65536;
      v = t6 + c + 65535;
      c = Math.floor(v / 65536);
      t6 = v - c * 65536;
      v = t7 + c + 65535;
      c = Math.floor(v / 65536);
      t7 = v - c * 65536;
      v = t8 + c + 65535;
      c = Math.floor(v / 65536);
      t8 = v - c * 65536;
      v = t9 + c + 65535;
      c = Math.floor(v / 65536);
      t9 = v - c * 65536;
      v = t10 + c + 65535;
      c = Math.floor(v / 65536);
      t10 = v - c * 65536;
      v = t11 + c + 65535;
      c = Math.floor(v / 65536);
      t11 = v - c * 65536;
      v = t12 + c + 65535;
      c = Math.floor(v / 65536);
      t12 = v - c * 65536;
      v = t13 + c + 65535;
      c = Math.floor(v / 65536);
      t13 = v - c * 65536;
      v = t14 + c + 65535;
      c = Math.floor(v / 65536);
      t14 = v - c * 65536;
      v = t15 + c + 65535;
      c = Math.floor(v / 65536);
      t15 = v - c * 65536;
      t0 += c - 1 + 37 * (c - 1);
      o[0] = t0;
      o[1] = t1;
      o[2] = t2;
      o[3] = t3;
      o[4] = t4;
      o[5] = t5;
      o[6] = t6;
      o[7] = t7;
      o[8] = t8;
      o[9] = t9;
      o[10] = t10;
      o[11] = t11;
      o[12] = t12;
      o[13] = t13;
      o[14] = t14;
      o[15] = t15;
    }

    function square(o, a) {
      mul(o, a, a);
    }

    function inv25519(o, i) {
      var c = gf();
      var a;

      for (a = 0; a < 16; a++) {
        c[a] = i[a];
      }

      for (a = 253; a >= 0; a--) {
        square(c, c);

        if (a !== 2 && a !== 4) {
          mul(c, c, i);
        }
      }

      for (a = 0; a < 16; a++) {
        o[a] = c[a];
      }
    }

    function pow2523(o, i) {
      var c = gf();
      var a;

      for (a = 0; a < 16; a++) {
        c[a] = i[a];
      }

      for (a = 250; a >= 0; a--) {
        square(c, c);

        if (a !== 1) {
          mul(c, c, i);
        }
      }

      for (a = 0; a < 16; a++) {
        o[a] = c[a];
      }
    }

    function edadd(p, q) {
      var a = gf(),
          b = gf(),
          c = gf(),
          d = gf(),
          e = gf(),
          f = gf(),
          g = gf(),
          h = gf(),
          t = gf();
      sub(a, p[1], p[0]);
      sub(t, q[1], q[0]);
      mul(a, a, t);
      add(b, p[0], p[1]);
      add(t, q[0], q[1]);
      mul(b, b, t);
      mul(c, p[3], q[3]);
      mul(c, c, D2);
      mul(d, p[2], q[2]);
      add(d, d, d);
      sub(e, b, a);
      sub(f, d, c);
      add(g, d, c);
      add(h, b, a);
      mul(p[0], e, f);
      mul(p[1], h, g);
      mul(p[2], g, f);
      mul(p[3], e, h);
    }

    function cswap(p, q, b) {
      for (var i = 0; i < 4; i++) {
        sel25519(p[i], q[i], b);
      }
    }

    function pack(r, p) {
      var tx = gf(),
          ty = gf(),
          zi = gf();
      inv25519(zi, p[2]);
      mul(tx, p[0], zi);
      mul(ty, p[1], zi);
      pack25519(r, ty);
      r[31] ^= par25519(tx) << 7;
    }

    function scalarmult(p, q, s) {
      set25519(p[0], gf0);
      set25519(p[1], gf1);
      set25519(p[2], gf1);
      set25519(p[3], gf0);

      for (var i = 255; i >= 0; --i) {
        var b = s[i / 8 | 0] >> (i & 7) & 1;
        cswap(p, q, b);
        edadd(q, p);
        edadd(p, p);
        cswap(p, q, b);
      }
    }

    function scalarbase(p, s) {
      var q = [gf(), gf(), gf(), gf()];
      set25519(q[0], X);
      set25519(q[1], Y);
      set25519(q[2], gf1);
      mul(q[3], X, Y);
      scalarmult(p, q, s);
    } // Generates key pair from secret 32-byte seed.


    function generateKeyPairFromSeed(seed) {
      if (seed.length !== exports.SEED_LENGTH) {
        throw new Error("ed25519: seed must be " + exports.SEED_LENGTH + " bytes");
      }

      var d = sha512_1.hash(seed);
      d[0] &= 248;
      d[31] &= 127;
      d[31] |= 64;
      var publicKey = new Uint8Array(32);
      var p = [gf(), gf(), gf(), gf()];
      scalarbase(p, d);
      pack(publicKey, p);
      var secretKey = new Uint8Array(64);
      secretKey.set(seed);
      secretKey.set(publicKey, 32);
      return {
        publicKey: publicKey,
        secretKey: secretKey
      };
    }

    exports.generateKeyPairFromSeed = generateKeyPairFromSeed;

    function generateKeyPair(prng) {
      var seed = random_1.randomBytes(32, prng);
      var result = generateKeyPairFromSeed(seed);
      wipe_1.wipe(seed);
      return result;
    }

    exports.generateKeyPair = generateKeyPair;

    function extractPublicKeyFromSecretKey(secretKey) {
      if (secretKey.length !== exports.SECRET_KEY_LENGTH) {
        throw new Error("ed25519: secret key must be " + exports.SECRET_KEY_LENGTH + " bytes");
      }

      return new Uint8Array(secretKey.subarray(32));
    }

    exports.extractPublicKeyFromSecretKey = extractPublicKeyFromSecretKey;
    var L = new Float64Array([0xed, 0xd3, 0xf5, 0x5c, 0x1a, 0x63, 0x12, 0x58, 0xd6, 0x9c, 0xf7, 0xa2, 0xde, 0xf9, 0xde, 0x14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x10]);

    function modL(r, x) {
      var carry;
      var i;
      var j;
      var k;

      for (i = 63; i >= 32; --i) {
        carry = 0;

        for (j = i - 32, k = i - 12; j < k; ++j) {
          x[j] += carry - 16 * x[i] * L[j - (i - 32)];
          carry = Math.floor((x[j] + 128) / 256);
          x[j] -= carry * 256;
        }

        x[j] += carry;
        x[i] = 0;
      }

      carry = 0;

      for (j = 0; j < 32; j++) {
        x[j] += carry - (x[31] >> 4) * L[j];
        carry = x[j] >> 8;
        x[j] &= 255;
      }

      for (j = 0; j < 32; j++) {
        x[j] -= carry * L[j];
      }

      for (i = 0; i < 32; i++) {
        x[i + 1] += x[i] >> 8;
        r[i] = x[i] & 255;
      }
    }

    function reduce(r) {
      var x = new Float64Array(64);

      for (var i = 0; i < 64; i++) {
        x[i] = r[i];
      }

      for (var i = 0; i < 64; i++) {
        r[i] = 0;
      }

      modL(r, x);
    } // Returns 64-byte signature of the message under the 64-byte secret key.


    function sign(secretKey, message) {
      var x = new Float64Array(64);
      var p = [gf(), gf(), gf(), gf()];
      var d = sha512_1.hash(secretKey.subarray(0, 32));
      d[0] &= 248;
      d[31] &= 127;
      d[31] |= 64;
      var signature = new Uint8Array(64);
      signature.set(d.subarray(32), 32);
      var hs = new sha512_1.SHA512();
      hs.update(signature.subarray(32));
      hs.update(message);
      var r = hs.digest();
      hs.clean();
      reduce(r);
      scalarbase(p, r);
      pack(signature, p);
      hs.reset();
      hs.update(signature.subarray(0, 32));
      hs.update(secretKey.subarray(32));
      hs.update(message);
      var h = hs.digest();
      reduce(h);

      for (var i = 0; i < 32; i++) {
        x[i] = r[i];
      }

      for (var i = 0; i < 32; i++) {
        for (var j = 0; j < 32; j++) {
          x[i + j] += h[i] * d[j];
        }
      }

      modL(signature.subarray(32), x);
      return signature;
    }

    exports.sign = sign;

    function unpackneg(r, p) {
      var t = gf(),
          chk = gf(),
          num = gf(),
          den = gf(),
          den2 = gf(),
          den4 = gf(),
          den6 = gf();
      set25519(r[2], gf1);
      unpack25519(r[1], p);
      square(num, r[1]);
      mul(den, num, D);
      sub(num, num, r[2]);
      add(den, r[2], den);
      square(den2, den);
      square(den4, den2);
      mul(den6, den4, den2);
      mul(t, den6, num);
      mul(t, t, den);
      pow2523(t, t);
      mul(t, t, num);
      mul(t, t, den);
      mul(t, t, den);
      mul(r[0], t, den);
      square(chk, r[0]);
      mul(chk, chk, den);

      if (neq25519(chk, num)) {
        mul(r[0], r[0], I);
      }

      square(chk, r[0]);
      mul(chk, chk, den);

      if (neq25519(chk, num)) {
        return -1;
      }

      if (par25519(r[0]) === p[31] >> 7) {
        sub(r[0], gf0, r[0]);
      }

      mul(r[3], r[0], r[1]);
      return 0;
    }

    function verify(publicKey, message, signature) {
      var t = new Uint8Array(32);
      var p = [gf(), gf(), gf(), gf()];
      var q = [gf(), gf(), gf(), gf()];

      if (signature.length !== exports.SIGNATURE_LENGTH) {
        throw new Error("ed25519: signature must be " + exports.SIGNATURE_LENGTH + " bytes");
      }

      if (unpackneg(q, publicKey)) {
        return false;
      }

      var hs = new sha512_1.SHA512();
      hs.update(signature.subarray(0, 32));
      hs.update(publicKey);
      hs.update(message);
      var h = hs.digest();
      reduce(h);
      scalarmult(p, q, h);
      scalarbase(q, signature.subarray(32));
      edadd(p, q);
      pack(t, p);

      if (verify32(signature, t)) {
        return false;
      }

      return true;
    }

    exports.verify = verify;
    /**
     * Convert Ed25519 public key to X25519 public key.
     *
     * Throws if given an invalid public key.
     */

    function convertPublicKeyToX25519(publicKey) {
      var q = [gf(), gf(), gf(), gf()];

      if (unpackneg(q, publicKey)) {
        throw new Error("Ed25519: invalid public key");
      } // Formula: montgomeryX = (edwardsY + 1)*inverse(1 - edwardsY) mod p


      var a = gf();
      var b = gf();
      var y = q[1];
      add(a, gf1, y);
      sub(b, gf1, y);
      inv25519(b, b);
      mul(a, a, b);
      var z = new Uint8Array(32);
      pack25519(z, a);
      return z;
    }

    exports.convertPublicKeyToX25519 = convertPublicKeyToX25519;
    /**
     *  Convert Ed25519 secret (private) key to X25519 secret key.
     */

    function convertSecretKeyToX25519(secretKey) {
      var d = sha512_1.hash(secretKey.subarray(0, 32));
      d[0] &= 248;
      d[31] &= 127;
      d[31] |= 64;
      var o = new Uint8Array(d.subarray(0, 32));
      wipe_1.wipe(d);
      return o;
    }

    exports.convertSecretKeyToX25519 = convertSecretKeyToX25519;
  })(ed25519);

  var blake2b = {};

  (function (exports) {
    // MIT License. See LICENSE file for details.

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var binary_1 = binary;
    var wipe_1 = wipe$1;
    exports.BLOCK_SIZE = 128;
    exports.DIGEST_LENGTH = 64;
    exports.KEY_LENGTH = 64;
    exports.PERSONALIZATION_LENGTH = 16;
    exports.SALT_LENGTH = 16;
    exports.MAX_LEAF_SIZE = Math.pow(2, 32) - 1;
    exports.MAX_FANOUT = 255;
    exports.MAX_MAX_DEPTH = 255; // not a typo

    var IV = new Uint32Array([// low bits // high bits
    0xf3bcc908, 0x6a09e667, 0x84caa73b, 0xbb67ae85, 0xfe94f82b, 0x3c6ef372, 0x5f1d36f1, 0xa54ff53a, 0xade682d1, 0x510e527f, 0x2b3e6c1f, 0x9b05688c, 0xfb41bd6b, 0x1f83d9ab, 0x137e2179, 0x5be0cd19]); // Note: sigma values are doubled since we store
    // 64-bit ints as two 32-bit ints in arrays.

    var SIGMA = [[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], [28, 20, 8, 16, 18, 30, 26, 12, 2, 24, 0, 4, 22, 14, 10, 6], [22, 16, 24, 0, 10, 4, 30, 26, 20, 28, 6, 12, 14, 2, 18, 8], [14, 18, 6, 2, 26, 24, 22, 28, 4, 12, 10, 20, 8, 0, 30, 16], [18, 0, 10, 14, 4, 8, 20, 30, 28, 2, 22, 24, 12, 16, 6, 26], [4, 24, 12, 20, 0, 22, 16, 6, 8, 26, 14, 10, 30, 28, 2, 18], [24, 10, 2, 30, 28, 26, 8, 20, 0, 14, 12, 6, 18, 4, 16, 22], [26, 22, 14, 28, 24, 2, 6, 18, 10, 0, 30, 8, 16, 12, 4, 20], [12, 30, 28, 18, 22, 6, 0, 16, 24, 4, 26, 14, 2, 8, 20, 10], [20, 4, 16, 8, 14, 12, 2, 10, 30, 22, 18, 28, 6, 24, 26, 0], [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], [28, 20, 8, 16, 18, 30, 26, 12, 2, 24, 0, 4, 22, 14, 10, 6]];
    /**
     * BLAKE2b hash function.
     */

    var BLAKE2b =
    /** @class */
    function () {
      function BLAKE2b(digestLength, config) {
        if (digestLength === void 0) {
          digestLength = 64;
        }

        this.digestLength = digestLength;
        this.blockSize = exports.BLOCK_SIZE; // Note: Int32Arrays for state and message are used for performance reasons.

        this._state = new Int32Array(IV); // hash state, initialized with IV

        this._buffer = new Uint8Array(exports.BLOCK_SIZE); // buffer for data

        this._bufferLength = 0; // number of bytes in buffer

        this._ctr = new Uint32Array(4);
        this._flag = new Uint32Array(4);
        this._lastNode = false;
        this._finished = false;
        this._vtmp = new Uint32Array(32);
        this._mtmp = new Uint32Array(32); // Validate digest length.

        if (digestLength < 1 || digestLength > exports.DIGEST_LENGTH) {
          throw new Error("blake2b: wrong digest length");
        } // Validate config, if present.


        if (config) {
          this.validateConfig(config);
        } // Get key length from config.


        var keyLength = 0;

        if (config && config.key) {
          keyLength = config.key.length;
        } // Get tree fanout and maxDepth from config.


        var fanout = 1;
        var maxDepth = 1;

        if (config && config.tree) {
          fanout = config.tree.fanout;
          maxDepth = config.tree.maxDepth;
        } // Xor common parameters into state.


        this._state[0] ^= digestLength | keyLength << 8 | fanout << 16 | maxDepth << 24; // Xor tree parameters into state.

        if (config && config.tree) {
          this._state[1] ^= config.tree.leafSize;
          this._state[2] ^= config.tree.nodeOffsetLowBits;
          this._state[3] ^= config.tree.nodeOffsetHighBits;
          this._state[4] ^= config.tree.nodeDepth | config.tree.innerDigestLength << 8;
          this._lastNode = config.tree.lastNode;
        } // Xor salt into state.


        if (config && config.salt) {
          this._state[8] ^= binary_1.readUint32LE(config.salt, 0);
          this._state[9] ^= binary_1.readUint32LE(config.salt, 4);
          this._state[10] ^= binary_1.readUint32LE(config.salt, 8);
          this._state[11] ^= binary_1.readUint32LE(config.salt, 12);
        } // Xor personalization into state.


        if (config && config.personalization) {
          this._state[12] ^= binary_1.readUint32LE(config.personalization, 0);
          this._state[13] ^= binary_1.readUint32LE(config.personalization, 4);
          this._state[14] ^= binary_1.readUint32LE(config.personalization, 8);
          this._state[15] ^= binary_1.readUint32LE(config.personalization, 12);
        } // Save a copy of initialized state for reset.


        this._initialState = new Uint32Array(this._state); // Process key.

        if (config && config.key && keyLength > 0) {
          this._paddedKey = new Uint8Array(exports.BLOCK_SIZE);

          this._paddedKey.set(config.key); // Put padded key into buffer.


          this._buffer.set(this._paddedKey);

          this._bufferLength = exports.BLOCK_SIZE;
        }
      }

      BLAKE2b.prototype.reset = function () {
        // Restore initial state.
        this._state.set(this._initialState);

        if (this._paddedKey) {
          // Put padded key into buffer.
          this._buffer.set(this._paddedKey);

          this._bufferLength = exports.BLOCK_SIZE;
        } else {
          this._bufferLength = 0;
        } // Clear counters and flags.


        wipe_1.wipe(this._ctr);
        wipe_1.wipe(this._flag);
        this._finished = false;
        return this;
      };

      BLAKE2b.prototype.validateConfig = function (config) {
        if (config.key && config.key.length > exports.KEY_LENGTH) {
          throw new Error("blake2b: wrong key length");
        }

        if (config.salt && config.salt.length !== exports.SALT_LENGTH) {
          throw new Error("blake2b: wrong salt length");
        }

        if (config.personalization && config.personalization.length !== exports.PERSONALIZATION_LENGTH) {
          throw new Error("blake2b: wrong personalization length");
        }

        if (config.tree) {
          if (config.tree.fanout < 0 || config.tree.fanout > exports.MAX_FANOUT) {
            throw new Error("blake2b: wrong tree fanout");
          }

          if (config.tree.maxDepth < 0 || config.tree.maxDepth > exports.MAX_MAX_DEPTH) {
            throw new Error("blake2b: wrong tree depth");
          }

          if (config.tree.leafSize < 0 || config.tree.leafSize > exports.MAX_LEAF_SIZE) {
            throw new Error("blake2b: wrong leaf size");
          }

          if (config.tree.innerDigestLength < 0 || config.tree.innerDigestLength > exports.DIGEST_LENGTH) {
            throw new Error("blake2b: wrong tree inner digest length");
          }
        }
      };

      BLAKE2b.prototype.update = function (data, dataLength) {
        if (dataLength === void 0) {
          dataLength = data.length;
        }

        if (this._finished) {
          throw new Error("blake2b: can't update because hash was finished.");
        }

        var left = exports.BLOCK_SIZE - this._bufferLength;
        var dataPos = 0;

        if (dataLength === 0) {
          return this;
        } // Finish buffer.


        if (dataLength > left) {
          for (var i = 0; i < left; i++) {
            this._buffer[this._bufferLength + i] = data[dataPos + i];
          }

          this._processBlock(exports.BLOCK_SIZE);

          dataPos += left;
          dataLength -= left;
          this._bufferLength = 0;
        } // Process data blocks.


        while (dataLength > exports.BLOCK_SIZE) {
          for (var i = 0; i < exports.BLOCK_SIZE; i++) {
            this._buffer[i] = data[dataPos + i];
          }

          this._processBlock(exports.BLOCK_SIZE);

          dataPos += exports.BLOCK_SIZE;
          dataLength -= exports.BLOCK_SIZE;
          this._bufferLength = 0;
        } // Copy leftovers to buffer.


        for (var i = 0; i < dataLength; i++) {
          this._buffer[this._bufferLength + i] = data[dataPos + i];
        }

        this._bufferLength += dataLength;
        return this;
      };

      BLAKE2b.prototype.finish = function (out) {
        if (!this._finished) {
          for (var i = this._bufferLength; i < exports.BLOCK_SIZE; i++) {
            this._buffer[i] = 0;
          } // Set last block flag.


          this._flag[0] = 0xffffffff;
          this._flag[1] = 0xffffffff; // Set last node flag if last node in tree.

          if (this._lastNode) {
            this._flag[2] = 0xffffffff;
            this._flag[3] = 0xffffffff;
          }

          this._processBlock(this._bufferLength);

          this._finished = true;
        } // Reuse buffer as temporary space for digest.


        var tmp = this._buffer.subarray(0, 64);

        for (var i = 0; i < 16; i++) {
          binary_1.writeUint32LE(this._state[i], tmp, i * 4);
        }

        out.set(tmp.subarray(0, out.length));
        return this;
      };

      BLAKE2b.prototype.digest = function () {
        var out = new Uint8Array(this.digestLength);
        this.finish(out);
        return out;
      };

      BLAKE2b.prototype.clean = function () {
        wipe_1.wipe(this._vtmp);
        wipe_1.wipe(this._mtmp);
        wipe_1.wipe(this._state);
        wipe_1.wipe(this._buffer);
        wipe_1.wipe(this._initialState);

        if (this._paddedKey) {
          wipe_1.wipe(this._paddedKey);
        }

        this._bufferLength = 0;
        wipe_1.wipe(this._ctr);
        wipe_1.wipe(this._flag);
        this._lastNode = false;
        this._finished = false;
      };

      BLAKE2b.prototype.saveState = function () {
        if (this._finished) {
          throw new Error("blake2b: cannot save finished state");
        }

        return {
          state: new Uint32Array(this._state),
          buffer: new Uint8Array(this._buffer),
          bufferLength: this._bufferLength,
          ctr: new Uint32Array(this._ctr),
          flag: new Uint32Array(this._flag),
          lastNode: this._lastNode,
          paddedKey: this._paddedKey ? new Uint8Array(this._paddedKey) : undefined,
          initialState: new Uint32Array(this._initialState)
        };
      };

      BLAKE2b.prototype.restoreState = function (savedState) {
        this._state.set(savedState.state);

        this._buffer.set(savedState.buffer);

        this._bufferLength = savedState.bufferLength;

        this._ctr.set(savedState.ctr);

        this._flag.set(savedState.flag);

        this._lastNode = savedState.lastNode;

        if (this._paddedKey) {
          wipe_1.wipe(this._paddedKey);
        }

        this._paddedKey = savedState.paddedKey ? new Uint8Array(savedState.paddedKey) : undefined;

        this._initialState.set(savedState.initialState);

        return this;
      };

      BLAKE2b.prototype.cleanSavedState = function (savedState) {
        wipe_1.wipe(savedState.state);
        wipe_1.wipe(savedState.buffer);
        wipe_1.wipe(savedState.initialState);

        if (savedState.paddedKey) {
          wipe_1.wipe(savedState.paddedKey);
        }

        savedState.bufferLength = 0;
        wipe_1.wipe(savedState.ctr);
        wipe_1.wipe(savedState.flag);
        savedState.lastNode = false;
      };

      BLAKE2b.prototype._G = function (v, al, bl, cl, dl, ah, bh, ch, dh, ml0, mh0, ml1, mh1) {
        var vla = v[al],
            vha = v[ah],
            vlb = v[bl],
            vhb = v[bh],
            vlc = v[cl],
            vhc = v[ch],
            vld = v[dl],
            vhd = v[dh]; // 64-bit: va += vb

        var w = vla & 0xffff,
            x = vla >>> 16,
            y = vha & 0xffff,
            z = vha >>> 16;
        w += vlb & 0xffff;
        x += vlb >>> 16;
        y += vhb & 0xffff;
        z += vhb >>> 16;
        x += w >>> 16;
        y += x >>> 16;
        z += y >>> 16;
        vha = y & 0xffff | z << 16;
        vla = w & 0xffff | x << 16; // 64-bit: va += m[sigma[r][2 * i + 0]]

        w = vla & 0xffff;
        x = vla >>> 16;
        y = vha & 0xffff;
        z = vha >>> 16;
        w += ml0 & 0xffff;
        x += ml0 >>> 16;
        y += mh0 & 0xffff;
        z += mh0 >>> 16;
        x += w >>> 16;
        y += x >>> 16;
        z += y >>> 16;
        vha = y & 0xffff | z << 16;
        vla = w & 0xffff | x << 16; // 64-bit: vd ^= va

        vld ^= vla;
        vhd ^= vha; // 64-bit: rot(vd, 32)

        w = vhd;
        vhd = vld;
        vld = w; // 64-bit: vc += vd

        w = vlc & 0xffff;
        x = vlc >>> 16;
        y = vhc & 0xffff;
        z = vhc >>> 16;
        w += vld & 0xffff;
        x += vld >>> 16;
        y += vhd & 0xffff;
        z += vhd >>> 16;
        x += w >>> 16;
        y += x >>> 16;
        z += y >>> 16;
        vhc = y & 0xffff | z << 16;
        vlc = w & 0xffff | x << 16; // 64-bit: vb ^= vc

        vlb ^= vlc;
        vhb ^= vhc; // 64-bit: rot(vb, 24)

        w = vlb << 8 | vhb >>> 24;
        vlb = vhb << 8 | vlb >>> 24;
        vhb = w; // 64-bit: va += vb

        w = vla & 0xffff;
        x = vla >>> 16;
        y = vha & 0xffff;
        z = vha >>> 16;
        w += vlb & 0xffff;
        x += vlb >>> 16;
        y += vhb & 0xffff;
        z += vhb >>> 16;
        x += w >>> 16;
        y += x >>> 16;
        z += y >>> 16;
        vha = y & 0xffff | z << 16;
        vla = w & 0xffff | x << 16; // 64-bit: va += m[sigma[r][2 * i + 1]

        w = vla & 0xffff;
        x = vla >>> 16;
        y = vha & 0xffff;
        z = vha >>> 16;
        w += ml1 & 0xffff;
        x += ml1 >>> 16;
        y += mh1 & 0xffff;
        z += mh1 >>> 16;
        x += w >>> 16;
        y += x >>> 16;
        z += y >>> 16;
        vha = y & 0xffff | z << 16;
        vla = w & 0xffff | x << 16; // 64-bit: vd ^= va

        vld ^= vla;
        vhd ^= vha; // 64-bit: rot(vd, 16)

        w = vld << 16 | vhd >>> 16;
        vld = vhd << 16 | vld >>> 16;
        vhd = w; // 64-bit: vc += vd

        w = vlc & 0xffff;
        x = vlc >>> 16;
        y = vhc & 0xffff;
        z = vhc >>> 16;
        w += vld & 0xffff;
        x += vld >>> 16;
        y += vhd & 0xffff;
        z += vhd >>> 16;
        x += w >>> 16;
        y += x >>> 16;
        z += y >>> 16;
        vhc = y & 0xffff | z << 16;
        vlc = w & 0xffff | x << 16; // 64-bit: vb ^= vc

        vlb ^= vlc;
        vhb ^= vhc; // 64-bit: rot(vb, 63)

        w = vhb << 1 | vlb >>> 31;
        vlb = vlb << 1 | vhb >>> 31;
        vhb = w;
        v[al] = vla;
        v[ah] = vha;
        v[bl] = vlb;
        v[bh] = vhb;
        v[cl] = vlc;
        v[ch] = vhc;
        v[dl] = vld;
        v[dh] = vhd;
      };

      BLAKE2b.prototype._incrementCounter = function (n) {
        for (var i = 0; i < 3; i++) {
          var a = this._ctr[i] + n;
          this._ctr[i] = a >>> 0;

          if (this._ctr[i] === a) {
            return;
          }

          n = 1;
        }
      };

      BLAKE2b.prototype._processBlock = function (length) {
        this._incrementCounter(length);

        var v = this._vtmp;
        v.set(this._state);
        v.set(IV, 16);
        v[12 * 2 + 0] ^= this._ctr[0];
        v[12 * 2 + 1] ^= this._ctr[1];
        v[13 * 2 + 0] ^= this._ctr[2];
        v[13 * 2 + 1] ^= this._ctr[3];
        v[14 * 2 + 0] ^= this._flag[0];
        v[14 * 2 + 1] ^= this._flag[1];
        v[15 * 2 + 0] ^= this._flag[2];
        v[15 * 2 + 1] ^= this._flag[3];
        var m = this._mtmp;

        for (var i = 0; i < 32; i++) {
          m[i] = binary_1.readUint32LE(this._buffer, i * 4);
        }

        for (var r = 0; r < 12; r++) {
          this._G(v, 0, 8, 16, 24, 1, 9, 17, 25, m[SIGMA[r][0]], m[SIGMA[r][0] + 1], m[SIGMA[r][1]], m[SIGMA[r][1] + 1]);

          this._G(v, 2, 10, 18, 26, 3, 11, 19, 27, m[SIGMA[r][2]], m[SIGMA[r][2] + 1], m[SIGMA[r][3]], m[SIGMA[r][3] + 1]);

          this._G(v, 4, 12, 20, 28, 5, 13, 21, 29, m[SIGMA[r][4]], m[SIGMA[r][4] + 1], m[SIGMA[r][5]], m[SIGMA[r][5] + 1]);

          this._G(v, 6, 14, 22, 30, 7, 15, 23, 31, m[SIGMA[r][6]], m[SIGMA[r][6] + 1], m[SIGMA[r][7]], m[SIGMA[r][7] + 1]);

          this._G(v, 0, 10, 20, 30, 1, 11, 21, 31, m[SIGMA[r][8]], m[SIGMA[r][8] + 1], m[SIGMA[r][9]], m[SIGMA[r][9] + 1]);

          this._G(v, 2, 12, 22, 24, 3, 13, 23, 25, m[SIGMA[r][10]], m[SIGMA[r][10] + 1], m[SIGMA[r][11]], m[SIGMA[r][11] + 1]);

          this._G(v, 4, 14, 16, 26, 5, 15, 17, 27, m[SIGMA[r][12]], m[SIGMA[r][12] + 1], m[SIGMA[r][13]], m[SIGMA[r][13] + 1]);

          this._G(v, 6, 8, 18, 28, 7, 9, 19, 29, m[SIGMA[r][14]], m[SIGMA[r][14] + 1], m[SIGMA[r][15]], m[SIGMA[r][15] + 1]);
        }

        for (var i = 0; i < 16; i++) {
          this._state[i] ^= v[i] ^ v[i + 16];
        }
      };

      return BLAKE2b;
    }();

    exports.BLAKE2b = BLAKE2b;

    function hash(data, digestLength, config) {
      if (digestLength === void 0) {
        digestLength = exports.DIGEST_LENGTH;
      }

      var h = new BLAKE2b(digestLength, config);
      h.update(data);
      var digest = h.digest();
      h.clean();
      return digest;
    }

    exports.hash = hash;
  })(blake2b);

  var elliptic = {};

  var name = "elliptic";
  var version = "6.5.4";
  var description = "EC cryptography";
  var main = "lib/elliptic.js";
  var files = [
  	"lib"
  ];
  var scripts = {
  	lint: "eslint lib test",
  	"lint:fix": "npm run lint -- --fix",
  	unit: "istanbul test _mocha --reporter=spec test/index.js",
  	test: "npm run lint && npm run unit",
  	version: "grunt dist && git add dist/"
  };
  var repository = {
  	type: "git",
  	url: "git@github.com:indutny/elliptic"
  };
  var keywords = [
  	"EC",
  	"Elliptic",
  	"curve",
  	"Cryptography"
  ];
  var author = "Fedor Indutny <fedor@indutny.com>";
  var license = "MIT";
  var bugs = {
  	url: "https://github.com/indutny/elliptic/issues"
  };
  var homepage = "https://github.com/indutny/elliptic";
  var devDependencies = {
  	brfs: "^2.0.2",
  	coveralls: "^3.1.0",
  	eslint: "^7.6.0",
  	grunt: "^1.2.1",
  	"grunt-browserify": "^5.3.0",
  	"grunt-cli": "^1.3.2",
  	"grunt-contrib-connect": "^3.0.0",
  	"grunt-contrib-copy": "^1.0.0",
  	"grunt-contrib-uglify": "^5.0.0",
  	"grunt-mocha-istanbul": "^5.0.2",
  	"grunt-saucelabs": "^9.0.1",
  	istanbul: "^0.4.5",
  	mocha: "^8.0.1"
  };
  var dependencies = {
  	"bn.js": "^4.11.9",
  	brorand: "^1.1.0",
  	"hash.js": "^1.0.0",
  	"hmac-drbg": "^1.0.1",
  	inherits: "^2.0.4",
  	"minimalistic-assert": "^1.0.1",
  	"minimalistic-crypto-utils": "^1.0.1"
  };
  var require$$0 = {
  	name: name,
  	version: version,
  	description: description,
  	main: main,
  	files: files,
  	scripts: scripts,
  	repository: repository,
  	keywords: keywords,
  	author: author,
  	license: license,
  	bugs: bugs,
  	homepage: homepage,
  	devDependencies: devDependencies,
  	dependencies: dependencies
  };

  var utils$m = {};

  var bn = {exports: {}};

  (function (module) {
    (function (module, exports) {

      function assert(val, msg) {
        if (!val) throw new Error(msg || 'Assertion failed');
      } // Could use `inherits` module, but don't want to move from single file
      // architecture yet.


      function inherits(ctor, superCtor) {
        ctor.super_ = superCtor;

        var TempCtor = function () {};

        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor();
        ctor.prototype.constructor = ctor;
      } // BN


      function BN(number, base, endian) {
        if (BN.isBN(number)) {
          return number;
        }

        this.negative = 0;
        this.words = null;
        this.length = 0; // Reduction context

        this.red = null;

        if (number !== null) {
          if (base === 'le' || base === 'be') {
            endian = base;
            base = 10;
          }

          this._init(number || 0, base || 10, endian || 'be');
        }
      }

      if (typeof module === 'object') {
        module.exports = BN;
      } else {
        exports.BN = BN;
      }

      BN.BN = BN;
      BN.wordSize = 26;
      var Buffer;

      try {
        if (typeof window !== 'undefined' && typeof window.Buffer !== 'undefined') {
          Buffer = window.Buffer;
        } else {
          Buffer = require('buffer').Buffer;
        }
      } catch (e) {}

      BN.isBN = function isBN(num) {
        if (num instanceof BN) {
          return true;
        }

        return num !== null && typeof num === 'object' && num.constructor.wordSize === BN.wordSize && Array.isArray(num.words);
      };

      BN.max = function max(left, right) {
        if (left.cmp(right) > 0) return left;
        return right;
      };

      BN.min = function min(left, right) {
        if (left.cmp(right) < 0) return left;
        return right;
      };

      BN.prototype._init = function init(number, base, endian) {
        if (typeof number === 'number') {
          return this._initNumber(number, base, endian);
        }

        if (typeof number === 'object') {
          return this._initArray(number, base, endian);
        }

        if (base === 'hex') {
          base = 16;
        }

        assert(base === (base | 0) && base >= 2 && base <= 36);
        number = number.toString().replace(/\s+/g, '');
        var start = 0;

        if (number[0] === '-') {
          start++;
          this.negative = 1;
        }

        if (start < number.length) {
          if (base === 16) {
            this._parseHex(number, start, endian);
          } else {
            this._parseBase(number, base, start);

            if (endian === 'le') {
              this._initArray(this.toArray(), base, endian);
            }
          }
        }
      };

      BN.prototype._initNumber = function _initNumber(number, base, endian) {
        if (number < 0) {
          this.negative = 1;
          number = -number;
        }

        if (number < 0x4000000) {
          this.words = [number & 0x3ffffff];
          this.length = 1;
        } else if (number < 0x10000000000000) {
          this.words = [number & 0x3ffffff, number / 0x4000000 & 0x3ffffff];
          this.length = 2;
        } else {
          assert(number < 0x20000000000000); // 2 ^ 53 (unsafe)

          this.words = [number & 0x3ffffff, number / 0x4000000 & 0x3ffffff, 1];
          this.length = 3;
        }

        if (endian !== 'le') return; // Reverse the bytes

        this._initArray(this.toArray(), base, endian);
      };

      BN.prototype._initArray = function _initArray(number, base, endian) {
        // Perhaps a Uint8Array
        assert(typeof number.length === 'number');

        if (number.length <= 0) {
          this.words = [0];
          this.length = 1;
          return this;
        }

        this.length = Math.ceil(number.length / 3);
        this.words = new Array(this.length);

        for (var i = 0; i < this.length; i++) {
          this.words[i] = 0;
        }

        var j, w;
        var off = 0;

        if (endian === 'be') {
          for (i = number.length - 1, j = 0; i >= 0; i -= 3) {
            w = number[i] | number[i - 1] << 8 | number[i - 2] << 16;
            this.words[j] |= w << off & 0x3ffffff;
            this.words[j + 1] = w >>> 26 - off & 0x3ffffff;
            off += 24;

            if (off >= 26) {
              off -= 26;
              j++;
            }
          }
        } else if (endian === 'le') {
          for (i = 0, j = 0; i < number.length; i += 3) {
            w = number[i] | number[i + 1] << 8 | number[i + 2] << 16;
            this.words[j] |= w << off & 0x3ffffff;
            this.words[j + 1] = w >>> 26 - off & 0x3ffffff;
            off += 24;

            if (off >= 26) {
              off -= 26;
              j++;
            }
          }
        }

        return this.strip();
      };

      function parseHex4Bits(string, index) {
        var c = string.charCodeAt(index); // 'A' - 'F'

        if (c >= 65 && c <= 70) {
          return c - 55; // 'a' - 'f'
        } else if (c >= 97 && c <= 102) {
          return c - 87; // '0' - '9'
        } else {
          return c - 48 & 0xf;
        }
      }

      function parseHexByte(string, lowerBound, index) {
        var r = parseHex4Bits(string, index);

        if (index - 1 >= lowerBound) {
          r |= parseHex4Bits(string, index - 1) << 4;
        }

        return r;
      }

      BN.prototype._parseHex = function _parseHex(number, start, endian) {
        // Create possibly bigger array to ensure that it fits the number
        this.length = Math.ceil((number.length - start) / 6);
        this.words = new Array(this.length);

        for (var i = 0; i < this.length; i++) {
          this.words[i] = 0;
        } // 24-bits chunks


        var off = 0;
        var j = 0;
        var w;

        if (endian === 'be') {
          for (i = number.length - 1; i >= start; i -= 2) {
            w = parseHexByte(number, start, i) << off;
            this.words[j] |= w & 0x3ffffff;

            if (off >= 18) {
              off -= 18;
              j += 1;
              this.words[j] |= w >>> 26;
            } else {
              off += 8;
            }
          }
        } else {
          var parseLength = number.length - start;

          for (i = parseLength % 2 === 0 ? start + 1 : start; i < number.length; i += 2) {
            w = parseHexByte(number, start, i) << off;
            this.words[j] |= w & 0x3ffffff;

            if (off >= 18) {
              off -= 18;
              j += 1;
              this.words[j] |= w >>> 26;
            } else {
              off += 8;
            }
          }
        }

        this.strip();
      };

      function parseBase(str, start, end, mul) {
        var r = 0;
        var len = Math.min(str.length, end);

        for (var i = start; i < len; i++) {
          var c = str.charCodeAt(i) - 48;
          r *= mul; // 'a'

          if (c >= 49) {
            r += c - 49 + 0xa; // 'A'
          } else if (c >= 17) {
            r += c - 17 + 0xa; // '0' - '9'
          } else {
            r += c;
          }
        }

        return r;
      }

      BN.prototype._parseBase = function _parseBase(number, base, start) {
        // Initialize as zero
        this.words = [0];
        this.length = 1; // Find length of limb in base

        for (var limbLen = 0, limbPow = 1; limbPow <= 0x3ffffff; limbPow *= base) {
          limbLen++;
        }

        limbLen--;
        limbPow = limbPow / base | 0;
        var total = number.length - start;
        var mod = total % limbLen;
        var end = Math.min(total, total - mod) + start;
        var word = 0;

        for (var i = start; i < end; i += limbLen) {
          word = parseBase(number, i, i + limbLen, base);
          this.imuln(limbPow);

          if (this.words[0] + word < 0x4000000) {
            this.words[0] += word;
          } else {
            this._iaddn(word);
          }
        }

        if (mod !== 0) {
          var pow = 1;
          word = parseBase(number, i, number.length, base);

          for (i = 0; i < mod; i++) {
            pow *= base;
          }

          this.imuln(pow);

          if (this.words[0] + word < 0x4000000) {
            this.words[0] += word;
          } else {
            this._iaddn(word);
          }
        }

        this.strip();
      };

      BN.prototype.copy = function copy(dest) {
        dest.words = new Array(this.length);

        for (var i = 0; i < this.length; i++) {
          dest.words[i] = this.words[i];
        }

        dest.length = this.length;
        dest.negative = this.negative;
        dest.red = this.red;
      };

      BN.prototype.clone = function clone() {
        var r = new BN(null);
        this.copy(r);
        return r;
      };

      BN.prototype._expand = function _expand(size) {
        while (this.length < size) {
          this.words[this.length++] = 0;
        }

        return this;
      }; // Remove leading `0` from `this`


      BN.prototype.strip = function strip() {
        while (this.length > 1 && this.words[this.length - 1] === 0) {
          this.length--;
        }

        return this._normSign();
      };

      BN.prototype._normSign = function _normSign() {
        // -0 = 0
        if (this.length === 1 && this.words[0] === 0) {
          this.negative = 0;
        }

        return this;
      };

      BN.prototype.inspect = function inspect() {
        return (this.red ? '<BN-R: ' : '<BN: ') + this.toString(16) + '>';
      };
      /*
       var zeros = [];
      var groupSizes = [];
      var groupBases = [];
       var s = '';
      var i = -1;
      while (++i < BN.wordSize) {
        zeros[i] = s;
        s += '0';
      }
      groupSizes[0] = 0;
      groupSizes[1] = 0;
      groupBases[0] = 0;
      groupBases[1] = 0;
      var base = 2 - 1;
      while (++base < 36 + 1) {
        var groupSize = 0;
        var groupBase = 1;
        while (groupBase < (1 << BN.wordSize) / base) {
          groupBase *= base;
          groupSize += 1;
        }
        groupSizes[base] = groupSize;
        groupBases[base] = groupBase;
      }
       */


      var zeros = ['', '0', '00', '000', '0000', '00000', '000000', '0000000', '00000000', '000000000', '0000000000', '00000000000', '000000000000', '0000000000000', '00000000000000', '000000000000000', '0000000000000000', '00000000000000000', '000000000000000000', '0000000000000000000', '00000000000000000000', '000000000000000000000', '0000000000000000000000', '00000000000000000000000', '000000000000000000000000', '0000000000000000000000000'];
      var groupSizes = [0, 0, 25, 16, 12, 11, 10, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
      var groupBases = [0, 0, 33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216, 43046721, 10000000, 19487171, 35831808, 62748517, 7529536, 11390625, 16777216, 24137569, 34012224, 47045881, 64000000, 4084101, 5153632, 6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149, 24300000, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176];

      BN.prototype.toString = function toString(base, padding) {
        base = base || 10;
        padding = padding | 0 || 1;
        var out;

        if (base === 16 || base === 'hex') {
          out = '';
          var off = 0;
          var carry = 0;

          for (var i = 0; i < this.length; i++) {
            var w = this.words[i];
            var word = ((w << off | carry) & 0xffffff).toString(16);
            carry = w >>> 24 - off & 0xffffff;

            if (carry !== 0 || i !== this.length - 1) {
              out = zeros[6 - word.length] + word + out;
            } else {
              out = word + out;
            }

            off += 2;

            if (off >= 26) {
              off -= 26;
              i--;
            }
          }

          if (carry !== 0) {
            out = carry.toString(16) + out;
          }

          while (out.length % padding !== 0) {
            out = '0' + out;
          }

          if (this.negative !== 0) {
            out = '-' + out;
          }

          return out;
        }

        if (base === (base | 0) && base >= 2 && base <= 36) {
          // var groupSize = Math.floor(BN.wordSize * Math.LN2 / Math.log(base));
          var groupSize = groupSizes[base]; // var groupBase = Math.pow(base, groupSize);

          var groupBase = groupBases[base];
          out = '';
          var c = this.clone();
          c.negative = 0;

          while (!c.isZero()) {
            var r = c.modn(groupBase).toString(base);
            c = c.idivn(groupBase);

            if (!c.isZero()) {
              out = zeros[groupSize - r.length] + r + out;
            } else {
              out = r + out;
            }
          }

          if (this.isZero()) {
            out = '0' + out;
          }

          while (out.length % padding !== 0) {
            out = '0' + out;
          }

          if (this.negative !== 0) {
            out = '-' + out;
          }

          return out;
        }

        assert(false, 'Base should be between 2 and 36');
      };

      BN.prototype.toNumber = function toNumber() {
        var ret = this.words[0];

        if (this.length === 2) {
          ret += this.words[1] * 0x4000000;
        } else if (this.length === 3 && this.words[2] === 0x01) {
          // NOTE: at this stage it is known that the top bit is set
          ret += 0x10000000000000 + this.words[1] * 0x4000000;
        } else if (this.length > 2) {
          assert(false, 'Number can only safely store up to 53 bits');
        }

        return this.negative !== 0 ? -ret : ret;
      };

      BN.prototype.toJSON = function toJSON() {
        return this.toString(16);
      };

      BN.prototype.toBuffer = function toBuffer(endian, length) {
        assert(typeof Buffer !== 'undefined');
        return this.toArrayLike(Buffer, endian, length);
      };

      BN.prototype.toArray = function toArray(endian, length) {
        return this.toArrayLike(Array, endian, length);
      };

      BN.prototype.toArrayLike = function toArrayLike(ArrayType, endian, length) {
        var byteLength = this.byteLength();
        var reqLength = length || Math.max(1, byteLength);
        assert(byteLength <= reqLength, 'byte array longer than desired length');
        assert(reqLength > 0, 'Requested array length <= 0');
        this.strip();
        var littleEndian = endian === 'le';
        var res = new ArrayType(reqLength);
        var b, i;
        var q = this.clone();

        if (!littleEndian) {
          // Assume big-endian
          for (i = 0; i < reqLength - byteLength; i++) {
            res[i] = 0;
          }

          for (i = 0; !q.isZero(); i++) {
            b = q.andln(0xff);
            q.iushrn(8);
            res[reqLength - i - 1] = b;
          }
        } else {
          for (i = 0; !q.isZero(); i++) {
            b = q.andln(0xff);
            q.iushrn(8);
            res[i] = b;
          }

          for (; i < reqLength; i++) {
            res[i] = 0;
          }
        }

        return res;
      };

      if (Math.clz32) {
        BN.prototype._countBits = function _countBits(w) {
          return 32 - Math.clz32(w);
        };
      } else {
        BN.prototype._countBits = function _countBits(w) {
          var t = w;
          var r = 0;

          if (t >= 0x1000) {
            r += 13;
            t >>>= 13;
          }

          if (t >= 0x40) {
            r += 7;
            t >>>= 7;
          }

          if (t >= 0x8) {
            r += 4;
            t >>>= 4;
          }

          if (t >= 0x02) {
            r += 2;
            t >>>= 2;
          }

          return r + t;
        };
      }

      BN.prototype._zeroBits = function _zeroBits(w) {
        // Short-cut
        if (w === 0) return 26;
        var t = w;
        var r = 0;

        if ((t & 0x1fff) === 0) {
          r += 13;
          t >>>= 13;
        }

        if ((t & 0x7f) === 0) {
          r += 7;
          t >>>= 7;
        }

        if ((t & 0xf) === 0) {
          r += 4;
          t >>>= 4;
        }

        if ((t & 0x3) === 0) {
          r += 2;
          t >>>= 2;
        }

        if ((t & 0x1) === 0) {
          r++;
        }

        return r;
      }; // Return number of used bits in a BN


      BN.prototype.bitLength = function bitLength() {
        var w = this.words[this.length - 1];

        var hi = this._countBits(w);

        return (this.length - 1) * 26 + hi;
      };

      function toBitArray(num) {
        var w = new Array(num.bitLength());

        for (var bit = 0; bit < w.length; bit++) {
          var off = bit / 26 | 0;
          var wbit = bit % 26;
          w[bit] = (num.words[off] & 1 << wbit) >>> wbit;
        }

        return w;
      } // Number of trailing zero bits


      BN.prototype.zeroBits = function zeroBits() {
        if (this.isZero()) return 0;
        var r = 0;

        for (var i = 0; i < this.length; i++) {
          var b = this._zeroBits(this.words[i]);

          r += b;
          if (b !== 26) break;
        }

        return r;
      };

      BN.prototype.byteLength = function byteLength() {
        return Math.ceil(this.bitLength() / 8);
      };

      BN.prototype.toTwos = function toTwos(width) {
        if (this.negative !== 0) {
          return this.abs().inotn(width).iaddn(1);
        }

        return this.clone();
      };

      BN.prototype.fromTwos = function fromTwos(width) {
        if (this.testn(width - 1)) {
          return this.notn(width).iaddn(1).ineg();
        }

        return this.clone();
      };

      BN.prototype.isNeg = function isNeg() {
        return this.negative !== 0;
      }; // Return negative clone of `this`


      BN.prototype.neg = function neg() {
        return this.clone().ineg();
      };

      BN.prototype.ineg = function ineg() {
        if (!this.isZero()) {
          this.negative ^= 1;
        }

        return this;
      }; // Or `num` with `this` in-place


      BN.prototype.iuor = function iuor(num) {
        while (this.length < num.length) {
          this.words[this.length++] = 0;
        }

        for (var i = 0; i < num.length; i++) {
          this.words[i] = this.words[i] | num.words[i];
        }

        return this.strip();
      };

      BN.prototype.ior = function ior(num) {
        assert((this.negative | num.negative) === 0);
        return this.iuor(num);
      }; // Or `num` with `this`


      BN.prototype.or = function or(num) {
        if (this.length > num.length) return this.clone().ior(num);
        return num.clone().ior(this);
      };

      BN.prototype.uor = function uor(num) {
        if (this.length > num.length) return this.clone().iuor(num);
        return num.clone().iuor(this);
      }; // And `num` with `this` in-place


      BN.prototype.iuand = function iuand(num) {
        // b = min-length(num, this)
        var b;

        if (this.length > num.length) {
          b = num;
        } else {
          b = this;
        }

        for (var i = 0; i < b.length; i++) {
          this.words[i] = this.words[i] & num.words[i];
        }

        this.length = b.length;
        return this.strip();
      };

      BN.prototype.iand = function iand(num) {
        assert((this.negative | num.negative) === 0);
        return this.iuand(num);
      }; // And `num` with `this`


      BN.prototype.and = function and(num) {
        if (this.length > num.length) return this.clone().iand(num);
        return num.clone().iand(this);
      };

      BN.prototype.uand = function uand(num) {
        if (this.length > num.length) return this.clone().iuand(num);
        return num.clone().iuand(this);
      }; // Xor `num` with `this` in-place


      BN.prototype.iuxor = function iuxor(num) {
        // a.length > b.length
        var a;
        var b;

        if (this.length > num.length) {
          a = this;
          b = num;
        } else {
          a = num;
          b = this;
        }

        for (var i = 0; i < b.length; i++) {
          this.words[i] = a.words[i] ^ b.words[i];
        }

        if (this !== a) {
          for (; i < a.length; i++) {
            this.words[i] = a.words[i];
          }
        }

        this.length = a.length;
        return this.strip();
      };

      BN.prototype.ixor = function ixor(num) {
        assert((this.negative | num.negative) === 0);
        return this.iuxor(num);
      }; // Xor `num` with `this`


      BN.prototype.xor = function xor(num) {
        if (this.length > num.length) return this.clone().ixor(num);
        return num.clone().ixor(this);
      };

      BN.prototype.uxor = function uxor(num) {
        if (this.length > num.length) return this.clone().iuxor(num);
        return num.clone().iuxor(this);
      }; // Not ``this`` with ``width`` bitwidth


      BN.prototype.inotn = function inotn(width) {
        assert(typeof width === 'number' && width >= 0);
        var bytesNeeded = Math.ceil(width / 26) | 0;
        var bitsLeft = width % 26; // Extend the buffer with leading zeroes

        this._expand(bytesNeeded);

        if (bitsLeft > 0) {
          bytesNeeded--;
        } // Handle complete words


        for (var i = 0; i < bytesNeeded; i++) {
          this.words[i] = ~this.words[i] & 0x3ffffff;
        } // Handle the residue


        if (bitsLeft > 0) {
          this.words[i] = ~this.words[i] & 0x3ffffff >> 26 - bitsLeft;
        } // And remove leading zeroes


        return this.strip();
      };

      BN.prototype.notn = function notn(width) {
        return this.clone().inotn(width);
      }; // Set `bit` of `this`


      BN.prototype.setn = function setn(bit, val) {
        assert(typeof bit === 'number' && bit >= 0);
        var off = bit / 26 | 0;
        var wbit = bit % 26;

        this._expand(off + 1);

        if (val) {
          this.words[off] = this.words[off] | 1 << wbit;
        } else {
          this.words[off] = this.words[off] & ~(1 << wbit);
        }

        return this.strip();
      }; // Add `num` to `this` in-place


      BN.prototype.iadd = function iadd(num) {
        var r; // negative + positive

        if (this.negative !== 0 && num.negative === 0) {
          this.negative = 0;
          r = this.isub(num);
          this.negative ^= 1;
          return this._normSign(); // positive + negative
        } else if (this.negative === 0 && num.negative !== 0) {
          num.negative = 0;
          r = this.isub(num);
          num.negative = 1;
          return r._normSign();
        } // a.length > b.length


        var a, b;

        if (this.length > num.length) {
          a = this;
          b = num;
        } else {
          a = num;
          b = this;
        }

        var carry = 0;

        for (var i = 0; i < b.length; i++) {
          r = (a.words[i] | 0) + (b.words[i] | 0) + carry;
          this.words[i] = r & 0x3ffffff;
          carry = r >>> 26;
        }

        for (; carry !== 0 && i < a.length; i++) {
          r = (a.words[i] | 0) + carry;
          this.words[i] = r & 0x3ffffff;
          carry = r >>> 26;
        }

        this.length = a.length;

        if (carry !== 0) {
          this.words[this.length] = carry;
          this.length++; // Copy the rest of the words
        } else if (a !== this) {
          for (; i < a.length; i++) {
            this.words[i] = a.words[i];
          }
        }

        return this;
      }; // Add `num` to `this`


      BN.prototype.add = function add(num) {
        var res;

        if (num.negative !== 0 && this.negative === 0) {
          num.negative = 0;
          res = this.sub(num);
          num.negative ^= 1;
          return res;
        } else if (num.negative === 0 && this.negative !== 0) {
          this.negative = 0;
          res = num.sub(this);
          this.negative = 1;
          return res;
        }

        if (this.length > num.length) return this.clone().iadd(num);
        return num.clone().iadd(this);
      }; // Subtract `num` from `this` in-place


      BN.prototype.isub = function isub(num) {
        // this - (-num) = this + num
        if (num.negative !== 0) {
          num.negative = 0;
          var r = this.iadd(num);
          num.negative = 1;
          return r._normSign(); // -this - num = -(this + num)
        } else if (this.negative !== 0) {
          this.negative = 0;
          this.iadd(num);
          this.negative = 1;
          return this._normSign();
        } // At this point both numbers are positive


        var cmp = this.cmp(num); // Optimization - zeroify

        if (cmp === 0) {
          this.negative = 0;
          this.length = 1;
          this.words[0] = 0;
          return this;
        } // a > b


        var a, b;

        if (cmp > 0) {
          a = this;
          b = num;
        } else {
          a = num;
          b = this;
        }

        var carry = 0;

        for (var i = 0; i < b.length; i++) {
          r = (a.words[i] | 0) - (b.words[i] | 0) + carry;
          carry = r >> 26;
          this.words[i] = r & 0x3ffffff;
        }

        for (; carry !== 0 && i < a.length; i++) {
          r = (a.words[i] | 0) + carry;
          carry = r >> 26;
          this.words[i] = r & 0x3ffffff;
        } // Copy rest of the words


        if (carry === 0 && i < a.length && a !== this) {
          for (; i < a.length; i++) {
            this.words[i] = a.words[i];
          }
        }

        this.length = Math.max(this.length, i);

        if (a !== this) {
          this.negative = 1;
        }

        return this.strip();
      }; // Subtract `num` from `this`


      BN.prototype.sub = function sub(num) {
        return this.clone().isub(num);
      };

      function smallMulTo(self, num, out) {
        out.negative = num.negative ^ self.negative;
        var len = self.length + num.length | 0;
        out.length = len;
        len = len - 1 | 0; // Peel one iteration (compiler can't do it, because of code complexity)

        var a = self.words[0] | 0;
        var b = num.words[0] | 0;
        var r = a * b;
        var lo = r & 0x3ffffff;
        var carry = r / 0x4000000 | 0;
        out.words[0] = lo;

        for (var k = 1; k < len; k++) {
          // Sum all words with the same `i + j = k` and accumulate `ncarry`,
          // note that ncarry could be >= 0x3ffffff
          var ncarry = carry >>> 26;
          var rword = carry & 0x3ffffff;
          var maxJ = Math.min(k, num.length - 1);

          for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
            var i = k - j | 0;
            a = self.words[i] | 0;
            b = num.words[j] | 0;
            r = a * b + rword;
            ncarry += r / 0x4000000 | 0;
            rword = r & 0x3ffffff;
          }

          out.words[k] = rword | 0;
          carry = ncarry | 0;
        }

        if (carry !== 0) {
          out.words[k] = carry | 0;
        } else {
          out.length--;
        }

        return out.strip();
      } // TODO(indutny): it may be reasonable to omit it for users who don't need
      // to work with 256-bit numbers, otherwise it gives 20% improvement for 256-bit
      // multiplication (like elliptic secp256k1).


      var comb10MulTo = function comb10MulTo(self, num, out) {
        var a = self.words;
        var b = num.words;
        var o = out.words;
        var c = 0;
        var lo;
        var mid;
        var hi;
        var a0 = a[0] | 0;
        var al0 = a0 & 0x1fff;
        var ah0 = a0 >>> 13;
        var a1 = a[1] | 0;
        var al1 = a1 & 0x1fff;
        var ah1 = a1 >>> 13;
        var a2 = a[2] | 0;
        var al2 = a2 & 0x1fff;
        var ah2 = a2 >>> 13;
        var a3 = a[3] | 0;
        var al3 = a3 & 0x1fff;
        var ah3 = a3 >>> 13;
        var a4 = a[4] | 0;
        var al4 = a4 & 0x1fff;
        var ah4 = a4 >>> 13;
        var a5 = a[5] | 0;
        var al5 = a5 & 0x1fff;
        var ah5 = a5 >>> 13;
        var a6 = a[6] | 0;
        var al6 = a6 & 0x1fff;
        var ah6 = a6 >>> 13;
        var a7 = a[7] | 0;
        var al7 = a7 & 0x1fff;
        var ah7 = a7 >>> 13;
        var a8 = a[8] | 0;
        var al8 = a8 & 0x1fff;
        var ah8 = a8 >>> 13;
        var a9 = a[9] | 0;
        var al9 = a9 & 0x1fff;
        var ah9 = a9 >>> 13;
        var b0 = b[0] | 0;
        var bl0 = b0 & 0x1fff;
        var bh0 = b0 >>> 13;
        var b1 = b[1] | 0;
        var bl1 = b1 & 0x1fff;
        var bh1 = b1 >>> 13;
        var b2 = b[2] | 0;
        var bl2 = b2 & 0x1fff;
        var bh2 = b2 >>> 13;
        var b3 = b[3] | 0;
        var bl3 = b3 & 0x1fff;
        var bh3 = b3 >>> 13;
        var b4 = b[4] | 0;
        var bl4 = b4 & 0x1fff;
        var bh4 = b4 >>> 13;
        var b5 = b[5] | 0;
        var bl5 = b5 & 0x1fff;
        var bh5 = b5 >>> 13;
        var b6 = b[6] | 0;
        var bl6 = b6 & 0x1fff;
        var bh6 = b6 >>> 13;
        var b7 = b[7] | 0;
        var bl7 = b7 & 0x1fff;
        var bh7 = b7 >>> 13;
        var b8 = b[8] | 0;
        var bl8 = b8 & 0x1fff;
        var bh8 = b8 >>> 13;
        var b9 = b[9] | 0;
        var bl9 = b9 & 0x1fff;
        var bh9 = b9 >>> 13;
        out.negative = self.negative ^ num.negative;
        out.length = 19;
        /* k = 0 */

        lo = Math.imul(al0, bl0);
        mid = Math.imul(al0, bh0);
        mid = mid + Math.imul(ah0, bl0) | 0;
        hi = Math.imul(ah0, bh0);
        var w0 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w0 >>> 26) | 0;
        w0 &= 0x3ffffff;
        /* k = 1 */

        lo = Math.imul(al1, bl0);
        mid = Math.imul(al1, bh0);
        mid = mid + Math.imul(ah1, bl0) | 0;
        hi = Math.imul(ah1, bh0);
        lo = lo + Math.imul(al0, bl1) | 0;
        mid = mid + Math.imul(al0, bh1) | 0;
        mid = mid + Math.imul(ah0, bl1) | 0;
        hi = hi + Math.imul(ah0, bh1) | 0;
        var w1 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w1 >>> 26) | 0;
        w1 &= 0x3ffffff;
        /* k = 2 */

        lo = Math.imul(al2, bl0);
        mid = Math.imul(al2, bh0);
        mid = mid + Math.imul(ah2, bl0) | 0;
        hi = Math.imul(ah2, bh0);
        lo = lo + Math.imul(al1, bl1) | 0;
        mid = mid + Math.imul(al1, bh1) | 0;
        mid = mid + Math.imul(ah1, bl1) | 0;
        hi = hi + Math.imul(ah1, bh1) | 0;
        lo = lo + Math.imul(al0, bl2) | 0;
        mid = mid + Math.imul(al0, bh2) | 0;
        mid = mid + Math.imul(ah0, bl2) | 0;
        hi = hi + Math.imul(ah0, bh2) | 0;
        var w2 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w2 >>> 26) | 0;
        w2 &= 0x3ffffff;
        /* k = 3 */

        lo = Math.imul(al3, bl0);
        mid = Math.imul(al3, bh0);
        mid = mid + Math.imul(ah3, bl0) | 0;
        hi = Math.imul(ah3, bh0);
        lo = lo + Math.imul(al2, bl1) | 0;
        mid = mid + Math.imul(al2, bh1) | 0;
        mid = mid + Math.imul(ah2, bl1) | 0;
        hi = hi + Math.imul(ah2, bh1) | 0;
        lo = lo + Math.imul(al1, bl2) | 0;
        mid = mid + Math.imul(al1, bh2) | 0;
        mid = mid + Math.imul(ah1, bl2) | 0;
        hi = hi + Math.imul(ah1, bh2) | 0;
        lo = lo + Math.imul(al0, bl3) | 0;
        mid = mid + Math.imul(al0, bh3) | 0;
        mid = mid + Math.imul(ah0, bl3) | 0;
        hi = hi + Math.imul(ah0, bh3) | 0;
        var w3 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w3 >>> 26) | 0;
        w3 &= 0x3ffffff;
        /* k = 4 */

        lo = Math.imul(al4, bl0);
        mid = Math.imul(al4, bh0);
        mid = mid + Math.imul(ah4, bl0) | 0;
        hi = Math.imul(ah4, bh0);
        lo = lo + Math.imul(al3, bl1) | 0;
        mid = mid + Math.imul(al3, bh1) | 0;
        mid = mid + Math.imul(ah3, bl1) | 0;
        hi = hi + Math.imul(ah3, bh1) | 0;
        lo = lo + Math.imul(al2, bl2) | 0;
        mid = mid + Math.imul(al2, bh2) | 0;
        mid = mid + Math.imul(ah2, bl2) | 0;
        hi = hi + Math.imul(ah2, bh2) | 0;
        lo = lo + Math.imul(al1, bl3) | 0;
        mid = mid + Math.imul(al1, bh3) | 0;
        mid = mid + Math.imul(ah1, bl3) | 0;
        hi = hi + Math.imul(ah1, bh3) | 0;
        lo = lo + Math.imul(al0, bl4) | 0;
        mid = mid + Math.imul(al0, bh4) | 0;
        mid = mid + Math.imul(ah0, bl4) | 0;
        hi = hi + Math.imul(ah0, bh4) | 0;
        var w4 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w4 >>> 26) | 0;
        w4 &= 0x3ffffff;
        /* k = 5 */

        lo = Math.imul(al5, bl0);
        mid = Math.imul(al5, bh0);
        mid = mid + Math.imul(ah5, bl0) | 0;
        hi = Math.imul(ah5, bh0);
        lo = lo + Math.imul(al4, bl1) | 0;
        mid = mid + Math.imul(al4, bh1) | 0;
        mid = mid + Math.imul(ah4, bl1) | 0;
        hi = hi + Math.imul(ah4, bh1) | 0;
        lo = lo + Math.imul(al3, bl2) | 0;
        mid = mid + Math.imul(al3, bh2) | 0;
        mid = mid + Math.imul(ah3, bl2) | 0;
        hi = hi + Math.imul(ah3, bh2) | 0;
        lo = lo + Math.imul(al2, bl3) | 0;
        mid = mid + Math.imul(al2, bh3) | 0;
        mid = mid + Math.imul(ah2, bl3) | 0;
        hi = hi + Math.imul(ah2, bh3) | 0;
        lo = lo + Math.imul(al1, bl4) | 0;
        mid = mid + Math.imul(al1, bh4) | 0;
        mid = mid + Math.imul(ah1, bl4) | 0;
        hi = hi + Math.imul(ah1, bh4) | 0;
        lo = lo + Math.imul(al0, bl5) | 0;
        mid = mid + Math.imul(al0, bh5) | 0;
        mid = mid + Math.imul(ah0, bl5) | 0;
        hi = hi + Math.imul(ah0, bh5) | 0;
        var w5 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w5 >>> 26) | 0;
        w5 &= 0x3ffffff;
        /* k = 6 */

        lo = Math.imul(al6, bl0);
        mid = Math.imul(al6, bh0);
        mid = mid + Math.imul(ah6, bl0) | 0;
        hi = Math.imul(ah6, bh0);
        lo = lo + Math.imul(al5, bl1) | 0;
        mid = mid + Math.imul(al5, bh1) | 0;
        mid = mid + Math.imul(ah5, bl1) | 0;
        hi = hi + Math.imul(ah5, bh1) | 0;
        lo = lo + Math.imul(al4, bl2) | 0;
        mid = mid + Math.imul(al4, bh2) | 0;
        mid = mid + Math.imul(ah4, bl2) | 0;
        hi = hi + Math.imul(ah4, bh2) | 0;
        lo = lo + Math.imul(al3, bl3) | 0;
        mid = mid + Math.imul(al3, bh3) | 0;
        mid = mid + Math.imul(ah3, bl3) | 0;
        hi = hi + Math.imul(ah3, bh3) | 0;
        lo = lo + Math.imul(al2, bl4) | 0;
        mid = mid + Math.imul(al2, bh4) | 0;
        mid = mid + Math.imul(ah2, bl4) | 0;
        hi = hi + Math.imul(ah2, bh4) | 0;
        lo = lo + Math.imul(al1, bl5) | 0;
        mid = mid + Math.imul(al1, bh5) | 0;
        mid = mid + Math.imul(ah1, bl5) | 0;
        hi = hi + Math.imul(ah1, bh5) | 0;
        lo = lo + Math.imul(al0, bl6) | 0;
        mid = mid + Math.imul(al0, bh6) | 0;
        mid = mid + Math.imul(ah0, bl6) | 0;
        hi = hi + Math.imul(ah0, bh6) | 0;
        var w6 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w6 >>> 26) | 0;
        w6 &= 0x3ffffff;
        /* k = 7 */

        lo = Math.imul(al7, bl0);
        mid = Math.imul(al7, bh0);
        mid = mid + Math.imul(ah7, bl0) | 0;
        hi = Math.imul(ah7, bh0);
        lo = lo + Math.imul(al6, bl1) | 0;
        mid = mid + Math.imul(al6, bh1) | 0;
        mid = mid + Math.imul(ah6, bl1) | 0;
        hi = hi + Math.imul(ah6, bh1) | 0;
        lo = lo + Math.imul(al5, bl2) | 0;
        mid = mid + Math.imul(al5, bh2) | 0;
        mid = mid + Math.imul(ah5, bl2) | 0;
        hi = hi + Math.imul(ah5, bh2) | 0;
        lo = lo + Math.imul(al4, bl3) | 0;
        mid = mid + Math.imul(al4, bh3) | 0;
        mid = mid + Math.imul(ah4, bl3) | 0;
        hi = hi + Math.imul(ah4, bh3) | 0;
        lo = lo + Math.imul(al3, bl4) | 0;
        mid = mid + Math.imul(al3, bh4) | 0;
        mid = mid + Math.imul(ah3, bl4) | 0;
        hi = hi + Math.imul(ah3, bh4) | 0;
        lo = lo + Math.imul(al2, bl5) | 0;
        mid = mid + Math.imul(al2, bh5) | 0;
        mid = mid + Math.imul(ah2, bl5) | 0;
        hi = hi + Math.imul(ah2, bh5) | 0;
        lo = lo + Math.imul(al1, bl6) | 0;
        mid = mid + Math.imul(al1, bh6) | 0;
        mid = mid + Math.imul(ah1, bl6) | 0;
        hi = hi + Math.imul(ah1, bh6) | 0;
        lo = lo + Math.imul(al0, bl7) | 0;
        mid = mid + Math.imul(al0, bh7) | 0;
        mid = mid + Math.imul(ah0, bl7) | 0;
        hi = hi + Math.imul(ah0, bh7) | 0;
        var w7 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w7 >>> 26) | 0;
        w7 &= 0x3ffffff;
        /* k = 8 */

        lo = Math.imul(al8, bl0);
        mid = Math.imul(al8, bh0);
        mid = mid + Math.imul(ah8, bl0) | 0;
        hi = Math.imul(ah8, bh0);
        lo = lo + Math.imul(al7, bl1) | 0;
        mid = mid + Math.imul(al7, bh1) | 0;
        mid = mid + Math.imul(ah7, bl1) | 0;
        hi = hi + Math.imul(ah7, bh1) | 0;
        lo = lo + Math.imul(al6, bl2) | 0;
        mid = mid + Math.imul(al6, bh2) | 0;
        mid = mid + Math.imul(ah6, bl2) | 0;
        hi = hi + Math.imul(ah6, bh2) | 0;
        lo = lo + Math.imul(al5, bl3) | 0;
        mid = mid + Math.imul(al5, bh3) | 0;
        mid = mid + Math.imul(ah5, bl3) | 0;
        hi = hi + Math.imul(ah5, bh3) | 0;
        lo = lo + Math.imul(al4, bl4) | 0;
        mid = mid + Math.imul(al4, bh4) | 0;
        mid = mid + Math.imul(ah4, bl4) | 0;
        hi = hi + Math.imul(ah4, bh4) | 0;
        lo = lo + Math.imul(al3, bl5) | 0;
        mid = mid + Math.imul(al3, bh5) | 0;
        mid = mid + Math.imul(ah3, bl5) | 0;
        hi = hi + Math.imul(ah3, bh5) | 0;
        lo = lo + Math.imul(al2, bl6) | 0;
        mid = mid + Math.imul(al2, bh6) | 0;
        mid = mid + Math.imul(ah2, bl6) | 0;
        hi = hi + Math.imul(ah2, bh6) | 0;
        lo = lo + Math.imul(al1, bl7) | 0;
        mid = mid + Math.imul(al1, bh7) | 0;
        mid = mid + Math.imul(ah1, bl7) | 0;
        hi = hi + Math.imul(ah1, bh7) | 0;
        lo = lo + Math.imul(al0, bl8) | 0;
        mid = mid + Math.imul(al0, bh8) | 0;
        mid = mid + Math.imul(ah0, bl8) | 0;
        hi = hi + Math.imul(ah0, bh8) | 0;
        var w8 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w8 >>> 26) | 0;
        w8 &= 0x3ffffff;
        /* k = 9 */

        lo = Math.imul(al9, bl0);
        mid = Math.imul(al9, bh0);
        mid = mid + Math.imul(ah9, bl0) | 0;
        hi = Math.imul(ah9, bh0);
        lo = lo + Math.imul(al8, bl1) | 0;
        mid = mid + Math.imul(al8, bh1) | 0;
        mid = mid + Math.imul(ah8, bl1) | 0;
        hi = hi + Math.imul(ah8, bh1) | 0;
        lo = lo + Math.imul(al7, bl2) | 0;
        mid = mid + Math.imul(al7, bh2) | 0;
        mid = mid + Math.imul(ah7, bl2) | 0;
        hi = hi + Math.imul(ah7, bh2) | 0;
        lo = lo + Math.imul(al6, bl3) | 0;
        mid = mid + Math.imul(al6, bh3) | 0;
        mid = mid + Math.imul(ah6, bl3) | 0;
        hi = hi + Math.imul(ah6, bh3) | 0;
        lo = lo + Math.imul(al5, bl4) | 0;
        mid = mid + Math.imul(al5, bh4) | 0;
        mid = mid + Math.imul(ah5, bl4) | 0;
        hi = hi + Math.imul(ah5, bh4) | 0;
        lo = lo + Math.imul(al4, bl5) | 0;
        mid = mid + Math.imul(al4, bh5) | 0;
        mid = mid + Math.imul(ah4, bl5) | 0;
        hi = hi + Math.imul(ah4, bh5) | 0;
        lo = lo + Math.imul(al3, bl6) | 0;
        mid = mid + Math.imul(al3, bh6) | 0;
        mid = mid + Math.imul(ah3, bl6) | 0;
        hi = hi + Math.imul(ah3, bh6) | 0;
        lo = lo + Math.imul(al2, bl7) | 0;
        mid = mid + Math.imul(al2, bh7) | 0;
        mid = mid + Math.imul(ah2, bl7) | 0;
        hi = hi + Math.imul(ah2, bh7) | 0;
        lo = lo + Math.imul(al1, bl8) | 0;
        mid = mid + Math.imul(al1, bh8) | 0;
        mid = mid + Math.imul(ah1, bl8) | 0;
        hi = hi + Math.imul(ah1, bh8) | 0;
        lo = lo + Math.imul(al0, bl9) | 0;
        mid = mid + Math.imul(al0, bh9) | 0;
        mid = mid + Math.imul(ah0, bl9) | 0;
        hi = hi + Math.imul(ah0, bh9) | 0;
        var w9 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w9 >>> 26) | 0;
        w9 &= 0x3ffffff;
        /* k = 10 */

        lo = Math.imul(al9, bl1);
        mid = Math.imul(al9, bh1);
        mid = mid + Math.imul(ah9, bl1) | 0;
        hi = Math.imul(ah9, bh1);
        lo = lo + Math.imul(al8, bl2) | 0;
        mid = mid + Math.imul(al8, bh2) | 0;
        mid = mid + Math.imul(ah8, bl2) | 0;
        hi = hi + Math.imul(ah8, bh2) | 0;
        lo = lo + Math.imul(al7, bl3) | 0;
        mid = mid + Math.imul(al7, bh3) | 0;
        mid = mid + Math.imul(ah7, bl3) | 0;
        hi = hi + Math.imul(ah7, bh3) | 0;
        lo = lo + Math.imul(al6, bl4) | 0;
        mid = mid + Math.imul(al6, bh4) | 0;
        mid = mid + Math.imul(ah6, bl4) | 0;
        hi = hi + Math.imul(ah6, bh4) | 0;
        lo = lo + Math.imul(al5, bl5) | 0;
        mid = mid + Math.imul(al5, bh5) | 0;
        mid = mid + Math.imul(ah5, bl5) | 0;
        hi = hi + Math.imul(ah5, bh5) | 0;
        lo = lo + Math.imul(al4, bl6) | 0;
        mid = mid + Math.imul(al4, bh6) | 0;
        mid = mid + Math.imul(ah4, bl6) | 0;
        hi = hi + Math.imul(ah4, bh6) | 0;
        lo = lo + Math.imul(al3, bl7) | 0;
        mid = mid + Math.imul(al3, bh7) | 0;
        mid = mid + Math.imul(ah3, bl7) | 0;
        hi = hi + Math.imul(ah3, bh7) | 0;
        lo = lo + Math.imul(al2, bl8) | 0;
        mid = mid + Math.imul(al2, bh8) | 0;
        mid = mid + Math.imul(ah2, bl8) | 0;
        hi = hi + Math.imul(ah2, bh8) | 0;
        lo = lo + Math.imul(al1, bl9) | 0;
        mid = mid + Math.imul(al1, bh9) | 0;
        mid = mid + Math.imul(ah1, bl9) | 0;
        hi = hi + Math.imul(ah1, bh9) | 0;
        var w10 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w10 >>> 26) | 0;
        w10 &= 0x3ffffff;
        /* k = 11 */

        lo = Math.imul(al9, bl2);
        mid = Math.imul(al9, bh2);
        mid = mid + Math.imul(ah9, bl2) | 0;
        hi = Math.imul(ah9, bh2);
        lo = lo + Math.imul(al8, bl3) | 0;
        mid = mid + Math.imul(al8, bh3) | 0;
        mid = mid + Math.imul(ah8, bl3) | 0;
        hi = hi + Math.imul(ah8, bh3) | 0;
        lo = lo + Math.imul(al7, bl4) | 0;
        mid = mid + Math.imul(al7, bh4) | 0;
        mid = mid + Math.imul(ah7, bl4) | 0;
        hi = hi + Math.imul(ah7, bh4) | 0;
        lo = lo + Math.imul(al6, bl5) | 0;
        mid = mid + Math.imul(al6, bh5) | 0;
        mid = mid + Math.imul(ah6, bl5) | 0;
        hi = hi + Math.imul(ah6, bh5) | 0;
        lo = lo + Math.imul(al5, bl6) | 0;
        mid = mid + Math.imul(al5, bh6) | 0;
        mid = mid + Math.imul(ah5, bl6) | 0;
        hi = hi + Math.imul(ah5, bh6) | 0;
        lo = lo + Math.imul(al4, bl7) | 0;
        mid = mid + Math.imul(al4, bh7) | 0;
        mid = mid + Math.imul(ah4, bl7) | 0;
        hi = hi + Math.imul(ah4, bh7) | 0;
        lo = lo + Math.imul(al3, bl8) | 0;
        mid = mid + Math.imul(al3, bh8) | 0;
        mid = mid + Math.imul(ah3, bl8) | 0;
        hi = hi + Math.imul(ah3, bh8) | 0;
        lo = lo + Math.imul(al2, bl9) | 0;
        mid = mid + Math.imul(al2, bh9) | 0;
        mid = mid + Math.imul(ah2, bl9) | 0;
        hi = hi + Math.imul(ah2, bh9) | 0;
        var w11 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w11 >>> 26) | 0;
        w11 &= 0x3ffffff;
        /* k = 12 */

        lo = Math.imul(al9, bl3);
        mid = Math.imul(al9, bh3);
        mid = mid + Math.imul(ah9, bl3) | 0;
        hi = Math.imul(ah9, bh3);
        lo = lo + Math.imul(al8, bl4) | 0;
        mid = mid + Math.imul(al8, bh4) | 0;
        mid = mid + Math.imul(ah8, bl4) | 0;
        hi = hi + Math.imul(ah8, bh4) | 0;
        lo = lo + Math.imul(al7, bl5) | 0;
        mid = mid + Math.imul(al7, bh5) | 0;
        mid = mid + Math.imul(ah7, bl5) | 0;
        hi = hi + Math.imul(ah7, bh5) | 0;
        lo = lo + Math.imul(al6, bl6) | 0;
        mid = mid + Math.imul(al6, bh6) | 0;
        mid = mid + Math.imul(ah6, bl6) | 0;
        hi = hi + Math.imul(ah6, bh6) | 0;
        lo = lo + Math.imul(al5, bl7) | 0;
        mid = mid + Math.imul(al5, bh7) | 0;
        mid = mid + Math.imul(ah5, bl7) | 0;
        hi = hi + Math.imul(ah5, bh7) | 0;
        lo = lo + Math.imul(al4, bl8) | 0;
        mid = mid + Math.imul(al4, bh8) | 0;
        mid = mid + Math.imul(ah4, bl8) | 0;
        hi = hi + Math.imul(ah4, bh8) | 0;
        lo = lo + Math.imul(al3, bl9) | 0;
        mid = mid + Math.imul(al3, bh9) | 0;
        mid = mid + Math.imul(ah3, bl9) | 0;
        hi = hi + Math.imul(ah3, bh9) | 0;
        var w12 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w12 >>> 26) | 0;
        w12 &= 0x3ffffff;
        /* k = 13 */

        lo = Math.imul(al9, bl4);
        mid = Math.imul(al9, bh4);
        mid = mid + Math.imul(ah9, bl4) | 0;
        hi = Math.imul(ah9, bh4);
        lo = lo + Math.imul(al8, bl5) | 0;
        mid = mid + Math.imul(al8, bh5) | 0;
        mid = mid + Math.imul(ah8, bl5) | 0;
        hi = hi + Math.imul(ah8, bh5) | 0;
        lo = lo + Math.imul(al7, bl6) | 0;
        mid = mid + Math.imul(al7, bh6) | 0;
        mid = mid + Math.imul(ah7, bl6) | 0;
        hi = hi + Math.imul(ah7, bh6) | 0;
        lo = lo + Math.imul(al6, bl7) | 0;
        mid = mid + Math.imul(al6, bh7) | 0;
        mid = mid + Math.imul(ah6, bl7) | 0;
        hi = hi + Math.imul(ah6, bh7) | 0;
        lo = lo + Math.imul(al5, bl8) | 0;
        mid = mid + Math.imul(al5, bh8) | 0;
        mid = mid + Math.imul(ah5, bl8) | 0;
        hi = hi + Math.imul(ah5, bh8) | 0;
        lo = lo + Math.imul(al4, bl9) | 0;
        mid = mid + Math.imul(al4, bh9) | 0;
        mid = mid + Math.imul(ah4, bl9) | 0;
        hi = hi + Math.imul(ah4, bh9) | 0;
        var w13 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w13 >>> 26) | 0;
        w13 &= 0x3ffffff;
        /* k = 14 */

        lo = Math.imul(al9, bl5);
        mid = Math.imul(al9, bh5);
        mid = mid + Math.imul(ah9, bl5) | 0;
        hi = Math.imul(ah9, bh5);
        lo = lo + Math.imul(al8, bl6) | 0;
        mid = mid + Math.imul(al8, bh6) | 0;
        mid = mid + Math.imul(ah8, bl6) | 0;
        hi = hi + Math.imul(ah8, bh6) | 0;
        lo = lo + Math.imul(al7, bl7) | 0;
        mid = mid + Math.imul(al7, bh7) | 0;
        mid = mid + Math.imul(ah7, bl7) | 0;
        hi = hi + Math.imul(ah7, bh7) | 0;
        lo = lo + Math.imul(al6, bl8) | 0;
        mid = mid + Math.imul(al6, bh8) | 0;
        mid = mid + Math.imul(ah6, bl8) | 0;
        hi = hi + Math.imul(ah6, bh8) | 0;
        lo = lo + Math.imul(al5, bl9) | 0;
        mid = mid + Math.imul(al5, bh9) | 0;
        mid = mid + Math.imul(ah5, bl9) | 0;
        hi = hi + Math.imul(ah5, bh9) | 0;
        var w14 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w14 >>> 26) | 0;
        w14 &= 0x3ffffff;
        /* k = 15 */

        lo = Math.imul(al9, bl6);
        mid = Math.imul(al9, bh6);
        mid = mid + Math.imul(ah9, bl6) | 0;
        hi = Math.imul(ah9, bh6);
        lo = lo + Math.imul(al8, bl7) | 0;
        mid = mid + Math.imul(al8, bh7) | 0;
        mid = mid + Math.imul(ah8, bl7) | 0;
        hi = hi + Math.imul(ah8, bh7) | 0;
        lo = lo + Math.imul(al7, bl8) | 0;
        mid = mid + Math.imul(al7, bh8) | 0;
        mid = mid + Math.imul(ah7, bl8) | 0;
        hi = hi + Math.imul(ah7, bh8) | 0;
        lo = lo + Math.imul(al6, bl9) | 0;
        mid = mid + Math.imul(al6, bh9) | 0;
        mid = mid + Math.imul(ah6, bl9) | 0;
        hi = hi + Math.imul(ah6, bh9) | 0;
        var w15 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w15 >>> 26) | 0;
        w15 &= 0x3ffffff;
        /* k = 16 */

        lo = Math.imul(al9, bl7);
        mid = Math.imul(al9, bh7);
        mid = mid + Math.imul(ah9, bl7) | 0;
        hi = Math.imul(ah9, bh7);
        lo = lo + Math.imul(al8, bl8) | 0;
        mid = mid + Math.imul(al8, bh8) | 0;
        mid = mid + Math.imul(ah8, bl8) | 0;
        hi = hi + Math.imul(ah8, bh8) | 0;
        lo = lo + Math.imul(al7, bl9) | 0;
        mid = mid + Math.imul(al7, bh9) | 0;
        mid = mid + Math.imul(ah7, bl9) | 0;
        hi = hi + Math.imul(ah7, bh9) | 0;
        var w16 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w16 >>> 26) | 0;
        w16 &= 0x3ffffff;
        /* k = 17 */

        lo = Math.imul(al9, bl8);
        mid = Math.imul(al9, bh8);
        mid = mid + Math.imul(ah9, bl8) | 0;
        hi = Math.imul(ah9, bh8);
        lo = lo + Math.imul(al8, bl9) | 0;
        mid = mid + Math.imul(al8, bh9) | 0;
        mid = mid + Math.imul(ah8, bl9) | 0;
        hi = hi + Math.imul(ah8, bh9) | 0;
        var w17 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w17 >>> 26) | 0;
        w17 &= 0x3ffffff;
        /* k = 18 */

        lo = Math.imul(al9, bl9);
        mid = Math.imul(al9, bh9);
        mid = mid + Math.imul(ah9, bl9) | 0;
        hi = Math.imul(ah9, bh9);
        var w18 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w18 >>> 26) | 0;
        w18 &= 0x3ffffff;
        o[0] = w0;
        o[1] = w1;
        o[2] = w2;
        o[3] = w3;
        o[4] = w4;
        o[5] = w5;
        o[6] = w6;
        o[7] = w7;
        o[8] = w8;
        o[9] = w9;
        o[10] = w10;
        o[11] = w11;
        o[12] = w12;
        o[13] = w13;
        o[14] = w14;
        o[15] = w15;
        o[16] = w16;
        o[17] = w17;
        o[18] = w18;

        if (c !== 0) {
          o[19] = c;
          out.length++;
        }

        return out;
      }; // Polyfill comb


      if (!Math.imul) {
        comb10MulTo = smallMulTo;
      }

      function bigMulTo(self, num, out) {
        out.negative = num.negative ^ self.negative;
        out.length = self.length + num.length;
        var carry = 0;
        var hncarry = 0;

        for (var k = 0; k < out.length - 1; k++) {
          // Sum all words with the same `i + j = k` and accumulate `ncarry`,
          // note that ncarry could be >= 0x3ffffff
          var ncarry = hncarry;
          hncarry = 0;
          var rword = carry & 0x3ffffff;
          var maxJ = Math.min(k, num.length - 1);

          for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
            var i = k - j;
            var a = self.words[i] | 0;
            var b = num.words[j] | 0;
            var r = a * b;
            var lo = r & 0x3ffffff;
            ncarry = ncarry + (r / 0x4000000 | 0) | 0;
            lo = lo + rword | 0;
            rword = lo & 0x3ffffff;
            ncarry = ncarry + (lo >>> 26) | 0;
            hncarry += ncarry >>> 26;
            ncarry &= 0x3ffffff;
          }

          out.words[k] = rword;
          carry = ncarry;
          ncarry = hncarry;
        }

        if (carry !== 0) {
          out.words[k] = carry;
        } else {
          out.length--;
        }

        return out.strip();
      }

      function jumboMulTo(self, num, out) {
        var fftm = new FFTM();
        return fftm.mulp(self, num, out);
      }

      BN.prototype.mulTo = function mulTo(num, out) {
        var res;
        var len = this.length + num.length;

        if (this.length === 10 && num.length === 10) {
          res = comb10MulTo(this, num, out);
        } else if (len < 63) {
          res = smallMulTo(this, num, out);
        } else if (len < 1024) {
          res = bigMulTo(this, num, out);
        } else {
          res = jumboMulTo(this, num, out);
        }

        return res;
      }; // Cooley-Tukey algorithm for FFT
      // slightly revisited to rely on looping instead of recursion


      function FFTM(x, y) {
        this.x = x;
        this.y = y;
      }

      FFTM.prototype.makeRBT = function makeRBT(N) {
        var t = new Array(N);
        var l = BN.prototype._countBits(N) - 1;

        for (var i = 0; i < N; i++) {
          t[i] = this.revBin(i, l, N);
        }

        return t;
      }; // Returns binary-reversed representation of `x`


      FFTM.prototype.revBin = function revBin(x, l, N) {
        if (x === 0 || x === N - 1) return x;
        var rb = 0;

        for (var i = 0; i < l; i++) {
          rb |= (x & 1) << l - i - 1;
          x >>= 1;
        }

        return rb;
      }; // Performs "tweedling" phase, therefore 'emulating'
      // behaviour of the recursive algorithm


      FFTM.prototype.permute = function permute(rbt, rws, iws, rtws, itws, N) {
        for (var i = 0; i < N; i++) {
          rtws[i] = rws[rbt[i]];
          itws[i] = iws[rbt[i]];
        }
      };

      FFTM.prototype.transform = function transform(rws, iws, rtws, itws, N, rbt) {
        this.permute(rbt, rws, iws, rtws, itws, N);

        for (var s = 1; s < N; s <<= 1) {
          var l = s << 1;
          var rtwdf = Math.cos(2 * Math.PI / l);
          var itwdf = Math.sin(2 * Math.PI / l);

          for (var p = 0; p < N; p += l) {
            var rtwdf_ = rtwdf;
            var itwdf_ = itwdf;

            for (var j = 0; j < s; j++) {
              var re = rtws[p + j];
              var ie = itws[p + j];
              var ro = rtws[p + j + s];
              var io = itws[p + j + s];
              var rx = rtwdf_ * ro - itwdf_ * io;
              io = rtwdf_ * io + itwdf_ * ro;
              ro = rx;
              rtws[p + j] = re + ro;
              itws[p + j] = ie + io;
              rtws[p + j + s] = re - ro;
              itws[p + j + s] = ie - io;
              /* jshint maxdepth : false */

              if (j !== l) {
                rx = rtwdf * rtwdf_ - itwdf * itwdf_;
                itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
                rtwdf_ = rx;
              }
            }
          }
        }
      };

      FFTM.prototype.guessLen13b = function guessLen13b(n, m) {
        var N = Math.max(m, n) | 1;
        var odd = N & 1;
        var i = 0;

        for (N = N / 2 | 0; N; N = N >>> 1) {
          i++;
        }

        return 1 << i + 1 + odd;
      };

      FFTM.prototype.conjugate = function conjugate(rws, iws, N) {
        if (N <= 1) return;

        for (var i = 0; i < N / 2; i++) {
          var t = rws[i];
          rws[i] = rws[N - i - 1];
          rws[N - i - 1] = t;
          t = iws[i];
          iws[i] = -iws[N - i - 1];
          iws[N - i - 1] = -t;
        }
      };

      FFTM.prototype.normalize13b = function normalize13b(ws, N) {
        var carry = 0;

        for (var i = 0; i < N / 2; i++) {
          var w = Math.round(ws[2 * i + 1] / N) * 0x2000 + Math.round(ws[2 * i] / N) + carry;
          ws[i] = w & 0x3ffffff;

          if (w < 0x4000000) {
            carry = 0;
          } else {
            carry = w / 0x4000000 | 0;
          }
        }

        return ws;
      };

      FFTM.prototype.convert13b = function convert13b(ws, len, rws, N) {
        var carry = 0;

        for (var i = 0; i < len; i++) {
          carry = carry + (ws[i] | 0);
          rws[2 * i] = carry & 0x1fff;
          carry = carry >>> 13;
          rws[2 * i + 1] = carry & 0x1fff;
          carry = carry >>> 13;
        } // Pad with zeroes


        for (i = 2 * len; i < N; ++i) {
          rws[i] = 0;
        }

        assert(carry === 0);
        assert((carry & ~0x1fff) === 0);
      };

      FFTM.prototype.stub = function stub(N) {
        var ph = new Array(N);

        for (var i = 0; i < N; i++) {
          ph[i] = 0;
        }

        return ph;
      };

      FFTM.prototype.mulp = function mulp(x, y, out) {
        var N = 2 * this.guessLen13b(x.length, y.length);
        var rbt = this.makeRBT(N);

        var _ = this.stub(N);

        var rws = new Array(N);
        var rwst = new Array(N);
        var iwst = new Array(N);
        var nrws = new Array(N);
        var nrwst = new Array(N);
        var niwst = new Array(N);
        var rmws = out.words;
        rmws.length = N;
        this.convert13b(x.words, x.length, rws, N);
        this.convert13b(y.words, y.length, nrws, N);
        this.transform(rws, _, rwst, iwst, N, rbt);
        this.transform(nrws, _, nrwst, niwst, N, rbt);

        for (var i = 0; i < N; i++) {
          var rx = rwst[i] * nrwst[i] - iwst[i] * niwst[i];
          iwst[i] = rwst[i] * niwst[i] + iwst[i] * nrwst[i];
          rwst[i] = rx;
        }

        this.conjugate(rwst, iwst, N);
        this.transform(rwst, iwst, rmws, _, N, rbt);
        this.conjugate(rmws, _, N);
        this.normalize13b(rmws, N);
        out.negative = x.negative ^ y.negative;
        out.length = x.length + y.length;
        return out.strip();
      }; // Multiply `this` by `num`


      BN.prototype.mul = function mul(num) {
        var out = new BN(null);
        out.words = new Array(this.length + num.length);
        return this.mulTo(num, out);
      }; // Multiply employing FFT


      BN.prototype.mulf = function mulf(num) {
        var out = new BN(null);
        out.words = new Array(this.length + num.length);
        return jumboMulTo(this, num, out);
      }; // In-place Multiplication


      BN.prototype.imul = function imul(num) {
        return this.clone().mulTo(num, this);
      };

      BN.prototype.imuln = function imuln(num) {
        assert(typeof num === 'number');
        assert(num < 0x4000000); // Carry

        var carry = 0;

        for (var i = 0; i < this.length; i++) {
          var w = (this.words[i] | 0) * num;
          var lo = (w & 0x3ffffff) + (carry & 0x3ffffff);
          carry >>= 26;
          carry += w / 0x4000000 | 0; // NOTE: lo is 27bit maximum

          carry += lo >>> 26;
          this.words[i] = lo & 0x3ffffff;
        }

        if (carry !== 0) {
          this.words[i] = carry;
          this.length++;
        }

        return this;
      };

      BN.prototype.muln = function muln(num) {
        return this.clone().imuln(num);
      }; // `this` * `this`


      BN.prototype.sqr = function sqr() {
        return this.mul(this);
      }; // `this` * `this` in-place


      BN.prototype.isqr = function isqr() {
        return this.imul(this.clone());
      }; // Math.pow(`this`, `num`)


      BN.prototype.pow = function pow(num) {
        var w = toBitArray(num);
        if (w.length === 0) return new BN(1); // Skip leading zeroes

        var res = this;

        for (var i = 0; i < w.length; i++, res = res.sqr()) {
          if (w[i] !== 0) break;
        }

        if (++i < w.length) {
          for (var q = res.sqr(); i < w.length; i++, q = q.sqr()) {
            if (w[i] === 0) continue;
            res = res.mul(q);
          }
        }

        return res;
      }; // Shift-left in-place


      BN.prototype.iushln = function iushln(bits) {
        assert(typeof bits === 'number' && bits >= 0);
        var r = bits % 26;
        var s = (bits - r) / 26;
        var carryMask = 0x3ffffff >>> 26 - r << 26 - r;
        var i;

        if (r !== 0) {
          var carry = 0;

          for (i = 0; i < this.length; i++) {
            var newCarry = this.words[i] & carryMask;
            var c = (this.words[i] | 0) - newCarry << r;
            this.words[i] = c | carry;
            carry = newCarry >>> 26 - r;
          }

          if (carry) {
            this.words[i] = carry;
            this.length++;
          }
        }

        if (s !== 0) {
          for (i = this.length - 1; i >= 0; i--) {
            this.words[i + s] = this.words[i];
          }

          for (i = 0; i < s; i++) {
            this.words[i] = 0;
          }

          this.length += s;
        }

        return this.strip();
      };

      BN.prototype.ishln = function ishln(bits) {
        // TODO(indutny): implement me
        assert(this.negative === 0);
        return this.iushln(bits);
      }; // Shift-right in-place
      // NOTE: `hint` is a lowest bit before trailing zeroes
      // NOTE: if `extended` is present - it will be filled with destroyed bits


      BN.prototype.iushrn = function iushrn(bits, hint, extended) {
        assert(typeof bits === 'number' && bits >= 0);
        var h;

        if (hint) {
          h = (hint - hint % 26) / 26;
        } else {
          h = 0;
        }

        var r = bits % 26;
        var s = Math.min((bits - r) / 26, this.length);
        var mask = 0x3ffffff ^ 0x3ffffff >>> r << r;
        var maskedWords = extended;
        h -= s;
        h = Math.max(0, h); // Extended mode, copy masked part

        if (maskedWords) {
          for (var i = 0; i < s; i++) {
            maskedWords.words[i] = this.words[i];
          }

          maskedWords.length = s;
        }

        if (s === 0) ; else if (this.length > s) {
          this.length -= s;

          for (i = 0; i < this.length; i++) {
            this.words[i] = this.words[i + s];
          }
        } else {
          this.words[0] = 0;
          this.length = 1;
        }

        var carry = 0;

        for (i = this.length - 1; i >= 0 && (carry !== 0 || i >= h); i--) {
          var word = this.words[i] | 0;
          this.words[i] = carry << 26 - r | word >>> r;
          carry = word & mask;
        } // Push carried bits as a mask


        if (maskedWords && carry !== 0) {
          maskedWords.words[maskedWords.length++] = carry;
        }

        if (this.length === 0) {
          this.words[0] = 0;
          this.length = 1;
        }

        return this.strip();
      };

      BN.prototype.ishrn = function ishrn(bits, hint, extended) {
        // TODO(indutny): implement me
        assert(this.negative === 0);
        return this.iushrn(bits, hint, extended);
      }; // Shift-left


      BN.prototype.shln = function shln(bits) {
        return this.clone().ishln(bits);
      };

      BN.prototype.ushln = function ushln(bits) {
        return this.clone().iushln(bits);
      }; // Shift-right


      BN.prototype.shrn = function shrn(bits) {
        return this.clone().ishrn(bits);
      };

      BN.prototype.ushrn = function ushrn(bits) {
        return this.clone().iushrn(bits);
      }; // Test if n bit is set


      BN.prototype.testn = function testn(bit) {
        assert(typeof bit === 'number' && bit >= 0);
        var r = bit % 26;
        var s = (bit - r) / 26;
        var q = 1 << r; // Fast case: bit is much higher than all existing words

        if (this.length <= s) return false; // Check bit and return

        var w = this.words[s];
        return !!(w & q);
      }; // Return only lowers bits of number (in-place)


      BN.prototype.imaskn = function imaskn(bits) {
        assert(typeof bits === 'number' && bits >= 0);
        var r = bits % 26;
        var s = (bits - r) / 26;
        assert(this.negative === 0, 'imaskn works only with positive numbers');

        if (this.length <= s) {
          return this;
        }

        if (r !== 0) {
          s++;
        }

        this.length = Math.min(s, this.length);

        if (r !== 0) {
          var mask = 0x3ffffff ^ 0x3ffffff >>> r << r;
          this.words[this.length - 1] &= mask;
        }

        return this.strip();
      }; // Return only lowers bits of number


      BN.prototype.maskn = function maskn(bits) {
        return this.clone().imaskn(bits);
      }; // Add plain number `num` to `this`


      BN.prototype.iaddn = function iaddn(num) {
        assert(typeof num === 'number');
        assert(num < 0x4000000);
        if (num < 0) return this.isubn(-num); // Possible sign change

        if (this.negative !== 0) {
          if (this.length === 1 && (this.words[0] | 0) < num) {
            this.words[0] = num - (this.words[0] | 0);
            this.negative = 0;
            return this;
          }

          this.negative = 0;
          this.isubn(num);
          this.negative = 1;
          return this;
        } // Add without checks


        return this._iaddn(num);
      };

      BN.prototype._iaddn = function _iaddn(num) {
        this.words[0] += num; // Carry

        for (var i = 0; i < this.length && this.words[i] >= 0x4000000; i++) {
          this.words[i] -= 0x4000000;

          if (i === this.length - 1) {
            this.words[i + 1] = 1;
          } else {
            this.words[i + 1]++;
          }
        }

        this.length = Math.max(this.length, i + 1);
        return this;
      }; // Subtract plain number `num` from `this`


      BN.prototype.isubn = function isubn(num) {
        assert(typeof num === 'number');
        assert(num < 0x4000000);
        if (num < 0) return this.iaddn(-num);

        if (this.negative !== 0) {
          this.negative = 0;
          this.iaddn(num);
          this.negative = 1;
          return this;
        }

        this.words[0] -= num;

        if (this.length === 1 && this.words[0] < 0) {
          this.words[0] = -this.words[0];
          this.negative = 1;
        } else {
          // Carry
          for (var i = 0; i < this.length && this.words[i] < 0; i++) {
            this.words[i] += 0x4000000;
            this.words[i + 1] -= 1;
          }
        }

        return this.strip();
      };

      BN.prototype.addn = function addn(num) {
        return this.clone().iaddn(num);
      };

      BN.prototype.subn = function subn(num) {
        return this.clone().isubn(num);
      };

      BN.prototype.iabs = function iabs() {
        this.negative = 0;
        return this;
      };

      BN.prototype.abs = function abs() {
        return this.clone().iabs();
      };

      BN.prototype._ishlnsubmul = function _ishlnsubmul(num, mul, shift) {
        var len = num.length + shift;
        var i;

        this._expand(len);

        var w;
        var carry = 0;

        for (i = 0; i < num.length; i++) {
          w = (this.words[i + shift] | 0) + carry;
          var right = (num.words[i] | 0) * mul;
          w -= right & 0x3ffffff;
          carry = (w >> 26) - (right / 0x4000000 | 0);
          this.words[i + shift] = w & 0x3ffffff;
        }

        for (; i < this.length - shift; i++) {
          w = (this.words[i + shift] | 0) + carry;
          carry = w >> 26;
          this.words[i + shift] = w & 0x3ffffff;
        }

        if (carry === 0) return this.strip(); // Subtraction overflow

        assert(carry === -1);
        carry = 0;

        for (i = 0; i < this.length; i++) {
          w = -(this.words[i] | 0) + carry;
          carry = w >> 26;
          this.words[i] = w & 0x3ffffff;
        }

        this.negative = 1;
        return this.strip();
      };

      BN.prototype._wordDiv = function _wordDiv(num, mode) {
        var shift = this.length - num.length;
        var a = this.clone();
        var b = num; // Normalize

        var bhi = b.words[b.length - 1] | 0;

        var bhiBits = this._countBits(bhi);

        shift = 26 - bhiBits;

        if (shift !== 0) {
          b = b.ushln(shift);
          a.iushln(shift);
          bhi = b.words[b.length - 1] | 0;
        } // Initialize quotient


        var m = a.length - b.length;
        var q;

        if (mode !== 'mod') {
          q = new BN(null);
          q.length = m + 1;
          q.words = new Array(q.length);

          for (var i = 0; i < q.length; i++) {
            q.words[i] = 0;
          }
        }

        var diff = a.clone()._ishlnsubmul(b, 1, m);

        if (diff.negative === 0) {
          a = diff;

          if (q) {
            q.words[m] = 1;
          }
        }

        for (var j = m - 1; j >= 0; j--) {
          var qj = (a.words[b.length + j] | 0) * 0x4000000 + (a.words[b.length + j - 1] | 0); // NOTE: (qj / bhi) is (0x3ffffff * 0x4000000 + 0x3ffffff) / 0x2000000 max
          // (0x7ffffff)

          qj = Math.min(qj / bhi | 0, 0x3ffffff);

          a._ishlnsubmul(b, qj, j);

          while (a.negative !== 0) {
            qj--;
            a.negative = 0;

            a._ishlnsubmul(b, 1, j);

            if (!a.isZero()) {
              a.negative ^= 1;
            }
          }

          if (q) {
            q.words[j] = qj;
          }
        }

        if (q) {
          q.strip();
        }

        a.strip(); // Denormalize

        if (mode !== 'div' && shift !== 0) {
          a.iushrn(shift);
        }

        return {
          div: q || null,
          mod: a
        };
      }; // NOTE: 1) `mode` can be set to `mod` to request mod only,
      //       to `div` to request div only, or be absent to
      //       request both div & mod
      //       2) `positive` is true if unsigned mod is requested


      BN.prototype.divmod = function divmod(num, mode, positive) {
        assert(!num.isZero());

        if (this.isZero()) {
          return {
            div: new BN(0),
            mod: new BN(0)
          };
        }

        var div, mod, res;

        if (this.negative !== 0 && num.negative === 0) {
          res = this.neg().divmod(num, mode);

          if (mode !== 'mod') {
            div = res.div.neg();
          }

          if (mode !== 'div') {
            mod = res.mod.neg();

            if (positive && mod.negative !== 0) {
              mod.iadd(num);
            }
          }

          return {
            div: div,
            mod: mod
          };
        }

        if (this.negative === 0 && num.negative !== 0) {
          res = this.divmod(num.neg(), mode);

          if (mode !== 'mod') {
            div = res.div.neg();
          }

          return {
            div: div,
            mod: res.mod
          };
        }

        if ((this.negative & num.negative) !== 0) {
          res = this.neg().divmod(num.neg(), mode);

          if (mode !== 'div') {
            mod = res.mod.neg();

            if (positive && mod.negative !== 0) {
              mod.isub(num);
            }
          }

          return {
            div: res.div,
            mod: mod
          };
        } // Both numbers are positive at this point
        // Strip both numbers to approximate shift value


        if (num.length > this.length || this.cmp(num) < 0) {
          return {
            div: new BN(0),
            mod: this
          };
        } // Very short reduction


        if (num.length === 1) {
          if (mode === 'div') {
            return {
              div: this.divn(num.words[0]),
              mod: null
            };
          }

          if (mode === 'mod') {
            return {
              div: null,
              mod: new BN(this.modn(num.words[0]))
            };
          }

          return {
            div: this.divn(num.words[0]),
            mod: new BN(this.modn(num.words[0]))
          };
        }

        return this._wordDiv(num, mode);
      }; // Find `this` / `num`


      BN.prototype.div = function div(num) {
        return this.divmod(num, 'div', false).div;
      }; // Find `this` % `num`


      BN.prototype.mod = function mod(num) {
        return this.divmod(num, 'mod', false).mod;
      };

      BN.prototype.umod = function umod(num) {
        return this.divmod(num, 'mod', true).mod;
      }; // Find Round(`this` / `num`)


      BN.prototype.divRound = function divRound(num) {
        var dm = this.divmod(num); // Fast case - exact division

        if (dm.mod.isZero()) return dm.div;
        var mod = dm.div.negative !== 0 ? dm.mod.isub(num) : dm.mod;
        var half = num.ushrn(1);
        var r2 = num.andln(1);
        var cmp = mod.cmp(half); // Round down

        if (cmp < 0 || r2 === 1 && cmp === 0) return dm.div; // Round up

        return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
      };

      BN.prototype.modn = function modn(num) {
        assert(num <= 0x3ffffff);
        var p = (1 << 26) % num;
        var acc = 0;

        for (var i = this.length - 1; i >= 0; i--) {
          acc = (p * acc + (this.words[i] | 0)) % num;
        }

        return acc;
      }; // In-place division by number


      BN.prototype.idivn = function idivn(num) {
        assert(num <= 0x3ffffff);
        var carry = 0;

        for (var i = this.length - 1; i >= 0; i--) {
          var w = (this.words[i] | 0) + carry * 0x4000000;
          this.words[i] = w / num | 0;
          carry = w % num;
        }

        return this.strip();
      };

      BN.prototype.divn = function divn(num) {
        return this.clone().idivn(num);
      };

      BN.prototype.egcd = function egcd(p) {
        assert(p.negative === 0);
        assert(!p.isZero());
        var x = this;
        var y = p.clone();

        if (x.negative !== 0) {
          x = x.umod(p);
        } else {
          x = x.clone();
        } // A * x + B * y = x


        var A = new BN(1);
        var B = new BN(0); // C * x + D * y = y

        var C = new BN(0);
        var D = new BN(1);
        var g = 0;

        while (x.isEven() && y.isEven()) {
          x.iushrn(1);
          y.iushrn(1);
          ++g;
        }

        var yp = y.clone();
        var xp = x.clone();

        while (!x.isZero()) {
          for (var i = 0, im = 1; (x.words[0] & im) === 0 && i < 26; ++i, im <<= 1);

          if (i > 0) {
            x.iushrn(i);

            while (i-- > 0) {
              if (A.isOdd() || B.isOdd()) {
                A.iadd(yp);
                B.isub(xp);
              }

              A.iushrn(1);
              B.iushrn(1);
            }
          }

          for (var j = 0, jm = 1; (y.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);

          if (j > 0) {
            y.iushrn(j);

            while (j-- > 0) {
              if (C.isOdd() || D.isOdd()) {
                C.iadd(yp);
                D.isub(xp);
              }

              C.iushrn(1);
              D.iushrn(1);
            }
          }

          if (x.cmp(y) >= 0) {
            x.isub(y);
            A.isub(C);
            B.isub(D);
          } else {
            y.isub(x);
            C.isub(A);
            D.isub(B);
          }
        }

        return {
          a: C,
          b: D,
          gcd: y.iushln(g)
        };
      }; // This is reduced incarnation of the binary EEA
      // above, designated to invert members of the
      // _prime_ fields F(p) at a maximal speed


      BN.prototype._invmp = function _invmp(p) {
        assert(p.negative === 0);
        assert(!p.isZero());
        var a = this;
        var b = p.clone();

        if (a.negative !== 0) {
          a = a.umod(p);
        } else {
          a = a.clone();
        }

        var x1 = new BN(1);
        var x2 = new BN(0);
        var delta = b.clone();

        while (a.cmpn(1) > 0 && b.cmpn(1) > 0) {
          for (var i = 0, im = 1; (a.words[0] & im) === 0 && i < 26; ++i, im <<= 1);

          if (i > 0) {
            a.iushrn(i);

            while (i-- > 0) {
              if (x1.isOdd()) {
                x1.iadd(delta);
              }

              x1.iushrn(1);
            }
          }

          for (var j = 0, jm = 1; (b.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);

          if (j > 0) {
            b.iushrn(j);

            while (j-- > 0) {
              if (x2.isOdd()) {
                x2.iadd(delta);
              }

              x2.iushrn(1);
            }
          }

          if (a.cmp(b) >= 0) {
            a.isub(b);
            x1.isub(x2);
          } else {
            b.isub(a);
            x2.isub(x1);
          }
        }

        var res;

        if (a.cmpn(1) === 0) {
          res = x1;
        } else {
          res = x2;
        }

        if (res.cmpn(0) < 0) {
          res.iadd(p);
        }

        return res;
      };

      BN.prototype.gcd = function gcd(num) {
        if (this.isZero()) return num.abs();
        if (num.isZero()) return this.abs();
        var a = this.clone();
        var b = num.clone();
        a.negative = 0;
        b.negative = 0; // Remove common factor of two

        for (var shift = 0; a.isEven() && b.isEven(); shift++) {
          a.iushrn(1);
          b.iushrn(1);
        }

        do {
          while (a.isEven()) {
            a.iushrn(1);
          }

          while (b.isEven()) {
            b.iushrn(1);
          }

          var r = a.cmp(b);

          if (r < 0) {
            // Swap `a` and `b` to make `a` always bigger than `b`
            var t = a;
            a = b;
            b = t;
          } else if (r === 0 || b.cmpn(1) === 0) {
            break;
          }

          a.isub(b);
        } while (true);

        return b.iushln(shift);
      }; // Invert number in the field F(num)


      BN.prototype.invm = function invm(num) {
        return this.egcd(num).a.umod(num);
      };

      BN.prototype.isEven = function isEven() {
        return (this.words[0] & 1) === 0;
      };

      BN.prototype.isOdd = function isOdd() {
        return (this.words[0] & 1) === 1;
      }; // And first word and num


      BN.prototype.andln = function andln(num) {
        return this.words[0] & num;
      }; // Increment at the bit position in-line


      BN.prototype.bincn = function bincn(bit) {
        assert(typeof bit === 'number');
        var r = bit % 26;
        var s = (bit - r) / 26;
        var q = 1 << r; // Fast case: bit is much higher than all existing words

        if (this.length <= s) {
          this._expand(s + 1);

          this.words[s] |= q;
          return this;
        } // Add bit and propagate, if needed


        var carry = q;

        for (var i = s; carry !== 0 && i < this.length; i++) {
          var w = this.words[i] | 0;
          w += carry;
          carry = w >>> 26;
          w &= 0x3ffffff;
          this.words[i] = w;
        }

        if (carry !== 0) {
          this.words[i] = carry;
          this.length++;
        }

        return this;
      };

      BN.prototype.isZero = function isZero() {
        return this.length === 1 && this.words[0] === 0;
      };

      BN.prototype.cmpn = function cmpn(num) {
        var negative = num < 0;
        if (this.negative !== 0 && !negative) return -1;
        if (this.negative === 0 && negative) return 1;
        this.strip();
        var res;

        if (this.length > 1) {
          res = 1;
        } else {
          if (negative) {
            num = -num;
          }

          assert(num <= 0x3ffffff, 'Number is too big');
          var w = this.words[0] | 0;
          res = w === num ? 0 : w < num ? -1 : 1;
        }

        if (this.negative !== 0) return -res | 0;
        return res;
      }; // Compare two numbers and return:
      // 1 - if `this` > `num`
      // 0 - if `this` == `num`
      // -1 - if `this` < `num`


      BN.prototype.cmp = function cmp(num) {
        if (this.negative !== 0 && num.negative === 0) return -1;
        if (this.negative === 0 && num.negative !== 0) return 1;
        var res = this.ucmp(num);
        if (this.negative !== 0) return -res | 0;
        return res;
      }; // Unsigned comparison


      BN.prototype.ucmp = function ucmp(num) {
        // At this point both numbers have the same sign
        if (this.length > num.length) return 1;
        if (this.length < num.length) return -1;
        var res = 0;

        for (var i = this.length - 1; i >= 0; i--) {
          var a = this.words[i] | 0;
          var b = num.words[i] | 0;
          if (a === b) continue;

          if (a < b) {
            res = -1;
          } else if (a > b) {
            res = 1;
          }

          break;
        }

        return res;
      };

      BN.prototype.gtn = function gtn(num) {
        return this.cmpn(num) === 1;
      };

      BN.prototype.gt = function gt(num) {
        return this.cmp(num) === 1;
      };

      BN.prototype.gten = function gten(num) {
        return this.cmpn(num) >= 0;
      };

      BN.prototype.gte = function gte(num) {
        return this.cmp(num) >= 0;
      };

      BN.prototype.ltn = function ltn(num) {
        return this.cmpn(num) === -1;
      };

      BN.prototype.lt = function lt(num) {
        return this.cmp(num) === -1;
      };

      BN.prototype.lten = function lten(num) {
        return this.cmpn(num) <= 0;
      };

      BN.prototype.lte = function lte(num) {
        return this.cmp(num) <= 0;
      };

      BN.prototype.eqn = function eqn(num) {
        return this.cmpn(num) === 0;
      };

      BN.prototype.eq = function eq(num) {
        return this.cmp(num) === 0;
      }; //
      // A reduce context, could be using montgomery or something better, depending
      // on the `m` itself.
      //


      BN.red = function red(num) {
        return new Red(num);
      };

      BN.prototype.toRed = function toRed(ctx) {
        assert(!this.red, 'Already a number in reduction context');
        assert(this.negative === 0, 'red works only with positives');
        return ctx.convertTo(this)._forceRed(ctx);
      };

      BN.prototype.fromRed = function fromRed() {
        assert(this.red, 'fromRed works only with numbers in reduction context');
        return this.red.convertFrom(this);
      };

      BN.prototype._forceRed = function _forceRed(ctx) {
        this.red = ctx;
        return this;
      };

      BN.prototype.forceRed = function forceRed(ctx) {
        assert(!this.red, 'Already a number in reduction context');
        return this._forceRed(ctx);
      };

      BN.prototype.redAdd = function redAdd(num) {
        assert(this.red, 'redAdd works only with red numbers');
        return this.red.add(this, num);
      };

      BN.prototype.redIAdd = function redIAdd(num) {
        assert(this.red, 'redIAdd works only with red numbers');
        return this.red.iadd(this, num);
      };

      BN.prototype.redSub = function redSub(num) {
        assert(this.red, 'redSub works only with red numbers');
        return this.red.sub(this, num);
      };

      BN.prototype.redISub = function redISub(num) {
        assert(this.red, 'redISub works only with red numbers');
        return this.red.isub(this, num);
      };

      BN.prototype.redShl = function redShl(num) {
        assert(this.red, 'redShl works only with red numbers');
        return this.red.shl(this, num);
      };

      BN.prototype.redMul = function redMul(num) {
        assert(this.red, 'redMul works only with red numbers');

        this.red._verify2(this, num);

        return this.red.mul(this, num);
      };

      BN.prototype.redIMul = function redIMul(num) {
        assert(this.red, 'redMul works only with red numbers');

        this.red._verify2(this, num);

        return this.red.imul(this, num);
      };

      BN.prototype.redSqr = function redSqr() {
        assert(this.red, 'redSqr works only with red numbers');

        this.red._verify1(this);

        return this.red.sqr(this);
      };

      BN.prototype.redISqr = function redISqr() {
        assert(this.red, 'redISqr works only with red numbers');

        this.red._verify1(this);

        return this.red.isqr(this);
      }; // Square root over p


      BN.prototype.redSqrt = function redSqrt() {
        assert(this.red, 'redSqrt works only with red numbers');

        this.red._verify1(this);

        return this.red.sqrt(this);
      };

      BN.prototype.redInvm = function redInvm() {
        assert(this.red, 'redInvm works only with red numbers');

        this.red._verify1(this);

        return this.red.invm(this);
      }; // Return negative clone of `this` % `red modulo`


      BN.prototype.redNeg = function redNeg() {
        assert(this.red, 'redNeg works only with red numbers');

        this.red._verify1(this);

        return this.red.neg(this);
      };

      BN.prototype.redPow = function redPow(num) {
        assert(this.red && !num.red, 'redPow(normalNum)');

        this.red._verify1(this);

        return this.red.pow(this, num);
      }; // Prime numbers with efficient reduction


      var primes = {
        k256: null,
        p224: null,
        p192: null,
        p25519: null
      }; // Pseudo-Mersenne prime

      function MPrime(name, p) {
        // P = 2 ^ N - K
        this.name = name;
        this.p = new BN(p, 16);
        this.n = this.p.bitLength();
        this.k = new BN(1).iushln(this.n).isub(this.p);
        this.tmp = this._tmp();
      }

      MPrime.prototype._tmp = function _tmp() {
        var tmp = new BN(null);
        tmp.words = new Array(Math.ceil(this.n / 13));
        return tmp;
      };

      MPrime.prototype.ireduce = function ireduce(num) {
        // Assumes that `num` is less than `P^2`
        // num = HI * (2 ^ N - K) + HI * K + LO = HI * K + LO (mod P)
        var r = num;
        var rlen;

        do {
          this.split(r, this.tmp);
          r = this.imulK(r);
          r = r.iadd(this.tmp);
          rlen = r.bitLength();
        } while (rlen > this.n);

        var cmp = rlen < this.n ? -1 : r.ucmp(this.p);

        if (cmp === 0) {
          r.words[0] = 0;
          r.length = 1;
        } else if (cmp > 0) {
          r.isub(this.p);
        } else {
          if (r.strip !== undefined) {
            // r is BN v4 instance
            r.strip();
          } else {
            // r is BN v5 instance
            r._strip();
          }
        }

        return r;
      };

      MPrime.prototype.split = function split(input, out) {
        input.iushrn(this.n, 0, out);
      };

      MPrime.prototype.imulK = function imulK(num) {
        return num.imul(this.k);
      };

      function K256() {
        MPrime.call(this, 'k256', 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f');
      }

      inherits(K256, MPrime);

      K256.prototype.split = function split(input, output) {
        // 256 = 9 * 26 + 22
        var mask = 0x3fffff;
        var outLen = Math.min(input.length, 9);

        for (var i = 0; i < outLen; i++) {
          output.words[i] = input.words[i];
        }

        output.length = outLen;

        if (input.length <= 9) {
          input.words[0] = 0;
          input.length = 1;
          return;
        } // Shift by 9 limbs


        var prev = input.words[9];
        output.words[output.length++] = prev & mask;

        for (i = 10; i < input.length; i++) {
          var next = input.words[i] | 0;
          input.words[i - 10] = (next & mask) << 4 | prev >>> 22;
          prev = next;
        }

        prev >>>= 22;
        input.words[i - 10] = prev;

        if (prev === 0 && input.length > 10) {
          input.length -= 10;
        } else {
          input.length -= 9;
        }
      };

      K256.prototype.imulK = function imulK(num) {
        // K = 0x1000003d1 = [ 0x40, 0x3d1 ]
        num.words[num.length] = 0;
        num.words[num.length + 1] = 0;
        num.length += 2; // bounded at: 0x40 * 0x3ffffff + 0x3d0 = 0x100000390

        var lo = 0;

        for (var i = 0; i < num.length; i++) {
          var w = num.words[i] | 0;
          lo += w * 0x3d1;
          num.words[i] = lo & 0x3ffffff;
          lo = w * 0x40 + (lo / 0x4000000 | 0);
        } // Fast length reduction


        if (num.words[num.length - 1] === 0) {
          num.length--;

          if (num.words[num.length - 1] === 0) {
            num.length--;
          }
        }

        return num;
      };

      function P224() {
        MPrime.call(this, 'p224', 'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001');
      }

      inherits(P224, MPrime);

      function P192() {
        MPrime.call(this, 'p192', 'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff');
      }

      inherits(P192, MPrime);

      function P25519() {
        // 2 ^ 255 - 19
        MPrime.call(this, '25519', '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed');
      }

      inherits(P25519, MPrime);

      P25519.prototype.imulK = function imulK(num) {
        // K = 0x13
        var carry = 0;

        for (var i = 0; i < num.length; i++) {
          var hi = (num.words[i] | 0) * 0x13 + carry;
          var lo = hi & 0x3ffffff;
          hi >>>= 26;
          num.words[i] = lo;
          carry = hi;
        }

        if (carry !== 0) {
          num.words[num.length++] = carry;
        }

        return num;
      }; // Exported mostly for testing purposes, use plain name instead


      BN._prime = function prime(name) {
        // Cached version of prime
        if (primes[name]) return primes[name];
        var prime;

        if (name === 'k256') {
          prime = new K256();
        } else if (name === 'p224') {
          prime = new P224();
        } else if (name === 'p192') {
          prime = new P192();
        } else if (name === 'p25519') {
          prime = new P25519();
        } else {
          throw new Error('Unknown prime ' + name);
        }

        primes[name] = prime;
        return prime;
      }; //
      // Base reduction engine
      //


      function Red(m) {
        if (typeof m === 'string') {
          var prime = BN._prime(m);

          this.m = prime.p;
          this.prime = prime;
        } else {
          assert(m.gtn(1), 'modulus must be greater than 1');
          this.m = m;
          this.prime = null;
        }
      }

      Red.prototype._verify1 = function _verify1(a) {
        assert(a.negative === 0, 'red works only with positives');
        assert(a.red, 'red works only with red numbers');
      };

      Red.prototype._verify2 = function _verify2(a, b) {
        assert((a.negative | b.negative) === 0, 'red works only with positives');
        assert(a.red && a.red === b.red, 'red works only with red numbers');
      };

      Red.prototype.imod = function imod(a) {
        if (this.prime) return this.prime.ireduce(a)._forceRed(this);
        return a.umod(this.m)._forceRed(this);
      };

      Red.prototype.neg = function neg(a) {
        if (a.isZero()) {
          return a.clone();
        }

        return this.m.sub(a)._forceRed(this);
      };

      Red.prototype.add = function add(a, b) {
        this._verify2(a, b);

        var res = a.add(b);

        if (res.cmp(this.m) >= 0) {
          res.isub(this.m);
        }

        return res._forceRed(this);
      };

      Red.prototype.iadd = function iadd(a, b) {
        this._verify2(a, b);

        var res = a.iadd(b);

        if (res.cmp(this.m) >= 0) {
          res.isub(this.m);
        }

        return res;
      };

      Red.prototype.sub = function sub(a, b) {
        this._verify2(a, b);

        var res = a.sub(b);

        if (res.cmpn(0) < 0) {
          res.iadd(this.m);
        }

        return res._forceRed(this);
      };

      Red.prototype.isub = function isub(a, b) {
        this._verify2(a, b);

        var res = a.isub(b);

        if (res.cmpn(0) < 0) {
          res.iadd(this.m);
        }

        return res;
      };

      Red.prototype.shl = function shl(a, num) {
        this._verify1(a);

        return this.imod(a.ushln(num));
      };

      Red.prototype.imul = function imul(a, b) {
        this._verify2(a, b);

        return this.imod(a.imul(b));
      };

      Red.prototype.mul = function mul(a, b) {
        this._verify2(a, b);

        return this.imod(a.mul(b));
      };

      Red.prototype.isqr = function isqr(a) {
        return this.imul(a, a.clone());
      };

      Red.prototype.sqr = function sqr(a) {
        return this.mul(a, a);
      };

      Red.prototype.sqrt = function sqrt(a) {
        if (a.isZero()) return a.clone();
        var mod3 = this.m.andln(3);
        assert(mod3 % 2 === 1); // Fast case

        if (mod3 === 3) {
          var pow = this.m.add(new BN(1)).iushrn(2);
          return this.pow(a, pow);
        } // Tonelli-Shanks algorithm (Totally unoptimized and slow)
        //
        // Find Q and S, that Q * 2 ^ S = (P - 1)


        var q = this.m.subn(1);
        var s = 0;

        while (!q.isZero() && q.andln(1) === 0) {
          s++;
          q.iushrn(1);
        }

        assert(!q.isZero());
        var one = new BN(1).toRed(this);
        var nOne = one.redNeg(); // Find quadratic non-residue
        // NOTE: Max is such because of generalized Riemann hypothesis.

        var lpow = this.m.subn(1).iushrn(1);
        var z = this.m.bitLength();
        z = new BN(2 * z * z).toRed(this);

        while (this.pow(z, lpow).cmp(nOne) !== 0) {
          z.redIAdd(nOne);
        }

        var c = this.pow(z, q);
        var r = this.pow(a, q.addn(1).iushrn(1));
        var t = this.pow(a, q);
        var m = s;

        while (t.cmp(one) !== 0) {
          var tmp = t;

          for (var i = 0; tmp.cmp(one) !== 0; i++) {
            tmp = tmp.redSqr();
          }

          assert(i < m);
          var b = this.pow(c, new BN(1).iushln(m - i - 1));
          r = r.redMul(b);
          c = b.redSqr();
          t = t.redMul(c);
          m = i;
        }

        return r;
      };

      Red.prototype.invm = function invm(a) {
        var inv = a._invmp(this.m);

        if (inv.negative !== 0) {
          inv.negative = 0;
          return this.imod(inv).redNeg();
        } else {
          return this.imod(inv);
        }
      };

      Red.prototype.pow = function pow(a, num) {
        if (num.isZero()) return new BN(1).toRed(this);
        if (num.cmpn(1) === 0) return a.clone();
        var windowSize = 4;
        var wnd = new Array(1 << windowSize);
        wnd[0] = new BN(1).toRed(this);
        wnd[1] = a;

        for (var i = 2; i < wnd.length; i++) {
          wnd[i] = this.mul(wnd[i - 1], a);
        }

        var res = wnd[0];
        var current = 0;
        var currentLen = 0;
        var start = num.bitLength() % 26;

        if (start === 0) {
          start = 26;
        }

        for (i = num.length - 1; i >= 0; i--) {
          var word = num.words[i];

          for (var j = start - 1; j >= 0; j--) {
            var bit = word >> j & 1;

            if (res !== wnd[0]) {
              res = this.sqr(res);
            }

            if (bit === 0 && current === 0) {
              currentLen = 0;
              continue;
            }

            current <<= 1;
            current |= bit;
            currentLen++;
            if (currentLen !== windowSize && (i !== 0 || j !== 0)) continue;
            res = this.mul(res, wnd[current]);
            currentLen = 0;
            current = 0;
          }

          start = 26;
        }

        return res;
      };

      Red.prototype.convertTo = function convertTo(num) {
        var r = num.umod(this.m);
        return r === num ? r.clone() : r;
      };

      Red.prototype.convertFrom = function convertFrom(num) {
        var res = num.clone();
        res.red = null;
        return res;
      }; //
      // Montgomery method engine
      //


      BN.mont = function mont(num) {
        return new Mont(num);
      };

      function Mont(m) {
        Red.call(this, m);
        this.shift = this.m.bitLength();

        if (this.shift % 26 !== 0) {
          this.shift += 26 - this.shift % 26;
        }

        this.r = new BN(1).iushln(this.shift);
        this.r2 = this.imod(this.r.sqr());
        this.rinv = this.r._invmp(this.m);
        this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
        this.minv = this.minv.umod(this.r);
        this.minv = this.r.sub(this.minv);
      }

      inherits(Mont, Red);

      Mont.prototype.convertTo = function convertTo(num) {
        return this.imod(num.ushln(this.shift));
      };

      Mont.prototype.convertFrom = function convertFrom(num) {
        var r = this.imod(num.mul(this.rinv));
        r.red = null;
        return r;
      };

      Mont.prototype.imul = function imul(a, b) {
        if (a.isZero() || b.isZero()) {
          a.words[0] = 0;
          a.length = 1;
          return a;
        }

        var t = a.imul(b);
        var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
        var u = t.isub(c).iushrn(this.shift);
        var res = u;

        if (u.cmp(this.m) >= 0) {
          res = u.isub(this.m);
        } else if (u.cmpn(0) < 0) {
          res = u.iadd(this.m);
        }

        return res._forceRed(this);
      };

      Mont.prototype.mul = function mul(a, b) {
        if (a.isZero() || b.isZero()) return new BN(0)._forceRed(this);
        var t = a.mul(b);
        var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
        var u = t.isub(c).iushrn(this.shift);
        var res = u;

        if (u.cmp(this.m) >= 0) {
          res = u.isub(this.m);
        } else if (u.cmpn(0) < 0) {
          res = u.iadd(this.m);
        }

        return res._forceRed(this);
      };

      Mont.prototype.invm = function invm(a) {
        // (AR)^-1 * R^2 = (A^-1 * R^-1) * R^2 = A^-1 * R
        var res = this.imod(a._invmp(this.m).mul(this.r2));
        return res._forceRed(this);
      };
    })(module, commonjsGlobal);
  })(bn);

  var minimalisticAssert = assert$f;

  function assert$f(val, msg) {
    if (!val) throw new Error(msg || 'Assertion failed');
  }

  assert$f.equal = function assertEqual(l, r, msg) {
    if (l != r) throw new Error(msg || 'Assertion failed: ' + l + ' != ' + r);
  };

  var utils$l = {};

  (function (exports) {

    var utils = exports;

    function toArray(msg, enc) {
      if (Array.isArray(msg)) return msg.slice();
      if (!msg) return [];
      var res = [];

      if (typeof msg !== 'string') {
        for (var i = 0; i < msg.length; i++) res[i] = msg[i] | 0;

        return res;
      }

      if (enc === 'hex') {
        msg = msg.replace(/[^a-z0-9]+/ig, '');
        if (msg.length % 2 !== 0) msg = '0' + msg;

        for (var i = 0; i < msg.length; i += 2) res.push(parseInt(msg[i] + msg[i + 1], 16));
      } else {
        for (var i = 0; i < msg.length; i++) {
          var c = msg.charCodeAt(i);
          var hi = c >> 8;
          var lo = c & 0xff;
          if (hi) res.push(hi, lo);else res.push(lo);
        }
      }

      return res;
    }

    utils.toArray = toArray;

    function zero2(word) {
      if (word.length === 1) return '0' + word;else return word;
    }

    utils.zero2 = zero2;

    function toHex(msg) {
      var res = '';

      for (var i = 0; i < msg.length; i++) res += zero2(msg[i].toString(16));

      return res;
    }

    utils.toHex = toHex;

    utils.encode = function encode(arr, enc) {
      if (enc === 'hex') return toHex(arr);else return arr;
    };
  })(utils$l);

  (function (exports) {

    var utils = exports;
    var BN = bn.exports;
    var minAssert = minimalisticAssert;
    var minUtils = utils$l;
    utils.assert = minAssert;
    utils.toArray = minUtils.toArray;
    utils.zero2 = minUtils.zero2;
    utils.toHex = minUtils.toHex;
    utils.encode = minUtils.encode; // Represent num in a w-NAF form

    function getNAF(num, w, bits) {
      var naf = new Array(Math.max(num.bitLength(), bits) + 1);
      naf.fill(0);
      var ws = 1 << w + 1;
      var k = num.clone();

      for (var i = 0; i < naf.length; i++) {
        var z;
        var mod = k.andln(ws - 1);

        if (k.isOdd()) {
          if (mod > (ws >> 1) - 1) z = (ws >> 1) - mod;else z = mod;
          k.isubn(z);
        } else {
          z = 0;
        }

        naf[i] = z;
        k.iushrn(1);
      }

      return naf;
    }

    utils.getNAF = getNAF; // Represent k1, k2 in a Joint Sparse Form

    function getJSF(k1, k2) {
      var jsf = [[], []];
      k1 = k1.clone();
      k2 = k2.clone();
      var d1 = 0;
      var d2 = 0;
      var m8;

      while (k1.cmpn(-d1) > 0 || k2.cmpn(-d2) > 0) {
        // First phase
        var m14 = k1.andln(3) + d1 & 3;
        var m24 = k2.andln(3) + d2 & 3;
        if (m14 === 3) m14 = -1;
        if (m24 === 3) m24 = -1;
        var u1;

        if ((m14 & 1) === 0) {
          u1 = 0;
        } else {
          m8 = k1.andln(7) + d1 & 7;
          if ((m8 === 3 || m8 === 5) && m24 === 2) u1 = -m14;else u1 = m14;
        }

        jsf[0].push(u1);
        var u2;

        if ((m24 & 1) === 0) {
          u2 = 0;
        } else {
          m8 = k2.andln(7) + d2 & 7;
          if ((m8 === 3 || m8 === 5) && m14 === 2) u2 = -m24;else u2 = m24;
        }

        jsf[1].push(u2); // Second phase

        if (2 * d1 === u1 + 1) d1 = 1 - d1;
        if (2 * d2 === u2 + 1) d2 = 1 - d2;
        k1.iushrn(1);
        k2.iushrn(1);
      }

      return jsf;
    }

    utils.getJSF = getJSF;

    function cachedProperty(obj, name, computer) {
      var key = '_' + name;

      obj.prototype[name] = function cachedProperty() {
        return this[key] !== undefined ? this[key] : this[key] = computer.call(this);
      };
    }

    utils.cachedProperty = cachedProperty;

    function parseBytes(bytes) {
      return typeof bytes === 'string' ? utils.toArray(bytes, 'hex') : bytes;
    }

    utils.parseBytes = parseBytes;

    function intFromLE(bytes) {
      return new BN(bytes, 'hex', 'le');
    }

    utils.intFromLE = intFromLE;
  })(utils$m);

  var brorand = {exports: {}};

  var r$1;

  brorand.exports = function rand(len) {
    if (!r$1) r$1 = new Rand(null);
    return r$1.generate(len);
  };

  function Rand(rand) {
    this.rand = rand;
  }

  brorand.exports.Rand = Rand;

  Rand.prototype.generate = function generate(len) {
    return this._rand(len);
  }; // Emulate crypto API using randy


  Rand.prototype._rand = function _rand(n) {
    if (this.rand.getBytes) return this.rand.getBytes(n);
    var res = new Uint8Array(n);

    for (var i = 0; i < res.length; i++) res[i] = this.rand.getByte();

    return res;
  };

  if (typeof self === 'object') {
    if (self.crypto && self.crypto.getRandomValues) {
      // Modern browsers
      Rand.prototype._rand = function _rand(n) {
        var arr = new Uint8Array(n);
        self.crypto.getRandomValues(arr);
        return arr;
      };
    } else if (self.msCrypto && self.msCrypto.getRandomValues) {
      // IE
      Rand.prototype._rand = function _rand(n) {
        var arr = new Uint8Array(n);
        self.msCrypto.getRandomValues(arr);
        return arr;
      }; // Safari's WebWorkers do not have `crypto`

    } else if (typeof window === 'object') {
      // Old junk
      Rand.prototype._rand = function () {
        throw new Error('Not implemented yet');
      };
    }
  } else {
    // Node.js or Web worker with no crypto support
    try {
      var crypto$1 = require('crypto');

      if (typeof crypto$1.randomBytes !== 'function') throw new Error('Not supported');

      Rand.prototype._rand = function _rand(n) {
        return crypto$1.randomBytes(n);
      };
    } catch (e) {}
  }

  var curve = {};

  var BN$7 = bn.exports;
  var utils$k = utils$m;
  var getNAF = utils$k.getNAF;
  var getJSF = utils$k.getJSF;
  var assert$e = utils$k.assert;

  function BaseCurve(type, conf) {
    this.type = type;
    this.p = new BN$7(conf.p, 16); // Use Montgomery, when there is no fast reduction for the prime

    this.red = conf.prime ? BN$7.red(conf.prime) : BN$7.mont(this.p); // Useful for many curves

    this.zero = new BN$7(0).toRed(this.red);
    this.one = new BN$7(1).toRed(this.red);
    this.two = new BN$7(2).toRed(this.red); // Curve configuration, optional

    this.n = conf.n && new BN$7(conf.n, 16);
    this.g = conf.g && this.pointFromJSON(conf.g, conf.gRed); // Temporary arrays

    this._wnafT1 = new Array(4);
    this._wnafT2 = new Array(4);
    this._wnafT3 = new Array(4);
    this._wnafT4 = new Array(4);
    this._bitLength = this.n ? this.n.bitLength() : 0; // Generalized Greg Maxwell's trick

    var adjustCount = this.n && this.p.div(this.n);

    if (!adjustCount || adjustCount.cmpn(100) > 0) {
      this.redN = null;
    } else {
      this._maxwellTrick = true;
      this.redN = this.n.toRed(this.red);
    }
  }

  var base = BaseCurve;

  BaseCurve.prototype.point = function point() {
    throw new Error('Not implemented');
  };

  BaseCurve.prototype.validate = function validate() {
    throw new Error('Not implemented');
  };

  BaseCurve.prototype._fixedNafMul = function _fixedNafMul(p, k) {
    assert$e(p.precomputed);

    var doubles = p._getDoubles();

    var naf = getNAF(k, 1, this._bitLength);
    var I = (1 << doubles.step + 1) - (doubles.step % 2 === 0 ? 2 : 1);
    I /= 3; // Translate into more windowed form

    var repr = [];
    var j;
    var nafW;

    for (j = 0; j < naf.length; j += doubles.step) {
      nafW = 0;

      for (var l = j + doubles.step - 1; l >= j; l--) nafW = (nafW << 1) + naf[l];

      repr.push(nafW);
    }

    var a = this.jpoint(null, null, null);
    var b = this.jpoint(null, null, null);

    for (var i = I; i > 0; i--) {
      for (j = 0; j < repr.length; j++) {
        nafW = repr[j];
        if (nafW === i) b = b.mixedAdd(doubles.points[j]);else if (nafW === -i) b = b.mixedAdd(doubles.points[j].neg());
      }

      a = a.add(b);
    }

    return a.toP();
  };

  BaseCurve.prototype._wnafMul = function _wnafMul(p, k) {
    var w = 4; // Precompute window

    var nafPoints = p._getNAFPoints(w);

    w = nafPoints.wnd;
    var wnd = nafPoints.points; // Get NAF form

    var naf = getNAF(k, w, this._bitLength); // Add `this`*(N+1) for every w-NAF index

    var acc = this.jpoint(null, null, null);

    for (var i = naf.length - 1; i >= 0; i--) {
      // Count zeroes
      for (var l = 0; i >= 0 && naf[i] === 0; i--) l++;

      if (i >= 0) l++;
      acc = acc.dblp(l);
      if (i < 0) break;
      var z = naf[i];
      assert$e(z !== 0);

      if (p.type === 'affine') {
        // J +- P
        if (z > 0) acc = acc.mixedAdd(wnd[z - 1 >> 1]);else acc = acc.mixedAdd(wnd[-z - 1 >> 1].neg());
      } else {
        // J +- J
        if (z > 0) acc = acc.add(wnd[z - 1 >> 1]);else acc = acc.add(wnd[-z - 1 >> 1].neg());
      }
    }

    return p.type === 'affine' ? acc.toP() : acc;
  };

  BaseCurve.prototype._wnafMulAdd = function _wnafMulAdd(defW, points, coeffs, len, jacobianResult) {
    var wndWidth = this._wnafT1;
    var wnd = this._wnafT2;
    var naf = this._wnafT3; // Fill all arrays

    var max = 0;
    var i;
    var j;
    var p;

    for (i = 0; i < len; i++) {
      p = points[i];

      var nafPoints = p._getNAFPoints(defW);

      wndWidth[i] = nafPoints.wnd;
      wnd[i] = nafPoints.points;
    } // Comb small window NAFs


    for (i = len - 1; i >= 1; i -= 2) {
      var a = i - 1;
      var b = i;

      if (wndWidth[a] !== 1 || wndWidth[b] !== 1) {
        naf[a] = getNAF(coeffs[a], wndWidth[a], this._bitLength);
        naf[b] = getNAF(coeffs[b], wndWidth[b], this._bitLength);
        max = Math.max(naf[a].length, max);
        max = Math.max(naf[b].length, max);
        continue;
      }

      var comb = [points[a],
      /* 1 */
      null,
      /* 3 */
      null,
      /* 5 */
      points[b]
      /* 7 */
      ]; // Try to avoid Projective points, if possible

      if (points[a].y.cmp(points[b].y) === 0) {
        comb[1] = points[a].add(points[b]);
        comb[2] = points[a].toJ().mixedAdd(points[b].neg());
      } else if (points[a].y.cmp(points[b].y.redNeg()) === 0) {
        comb[1] = points[a].toJ().mixedAdd(points[b]);
        comb[2] = points[a].add(points[b].neg());
      } else {
        comb[1] = points[a].toJ().mixedAdd(points[b]);
        comb[2] = points[a].toJ().mixedAdd(points[b].neg());
      }

      var index = [-3,
      /* -1 -1 */
      -1,
      /* -1 0 */
      -5,
      /* -1 1 */
      -7,
      /* 0 -1 */
      0,
      /* 0 0 */
      7,
      /* 0 1 */
      5,
      /* 1 -1 */
      1,
      /* 1 0 */
      3
      /* 1 1 */
      ];
      var jsf = getJSF(coeffs[a], coeffs[b]);
      max = Math.max(jsf[0].length, max);
      naf[a] = new Array(max);
      naf[b] = new Array(max);

      for (j = 0; j < max; j++) {
        var ja = jsf[0][j] | 0;
        var jb = jsf[1][j] | 0;
        naf[a][j] = index[(ja + 1) * 3 + (jb + 1)];
        naf[b][j] = 0;
        wnd[a] = comb;
      }
    }

    var acc = this.jpoint(null, null, null);
    var tmp = this._wnafT4;

    for (i = max; i >= 0; i--) {
      var k = 0;

      while (i >= 0) {
        var zero = true;

        for (j = 0; j < len; j++) {
          tmp[j] = naf[j][i] | 0;
          if (tmp[j] !== 0) zero = false;
        }

        if (!zero) break;
        k++;
        i--;
      }

      if (i >= 0) k++;
      acc = acc.dblp(k);
      if (i < 0) break;

      for (j = 0; j < len; j++) {
        var z = tmp[j];
        if (z === 0) continue;else if (z > 0) p = wnd[j][z - 1 >> 1];else if (z < 0) p = wnd[j][-z - 1 >> 1].neg();
        if (p.type === 'affine') acc = acc.mixedAdd(p);else acc = acc.add(p);
      }
    } // Zeroify references


    for (i = 0; i < len; i++) wnd[i] = null;

    if (jacobianResult) return acc;else return acc.toP();
  };

  function BasePoint(curve, type) {
    this.curve = curve;
    this.type = type;
    this.precomputed = null;
  }

  BaseCurve.BasePoint = BasePoint;

  BasePoint.prototype.eq = function
    /*other*/
  eq() {
    throw new Error('Not implemented');
  };

  BasePoint.prototype.validate = function validate() {
    return this.curve.validate(this);
  };

  BaseCurve.prototype.decodePoint = function decodePoint(bytes, enc) {
    bytes = utils$k.toArray(bytes, enc);
    var len = this.p.byteLength(); // uncompressed, hybrid-odd, hybrid-even

    if ((bytes[0] === 0x04 || bytes[0] === 0x06 || bytes[0] === 0x07) && bytes.length - 1 === 2 * len) {
      if (bytes[0] === 0x06) assert$e(bytes[bytes.length - 1] % 2 === 0);else if (bytes[0] === 0x07) assert$e(bytes[bytes.length - 1] % 2 === 1);
      var res = this.point(bytes.slice(1, 1 + len), bytes.slice(1 + len, 1 + 2 * len));
      return res;
    } else if ((bytes[0] === 0x02 || bytes[0] === 0x03) && bytes.length - 1 === len) {
      return this.pointFromX(bytes.slice(1, 1 + len), bytes[0] === 0x03);
    }

    throw new Error('Unknown point format');
  };

  BasePoint.prototype.encodeCompressed = function encodeCompressed(enc) {
    return this.encode(enc, true);
  };

  BasePoint.prototype._encode = function _encode(compact) {
    var len = this.curve.p.byteLength();
    var x = this.getX().toArray('be', len);
    if (compact) return [this.getY().isEven() ? 0x02 : 0x03].concat(x);
    return [0x04].concat(x, this.getY().toArray('be', len));
  };

  BasePoint.prototype.encode = function encode(enc, compact) {
    return utils$k.encode(this._encode(compact), enc);
  };

  BasePoint.prototype.precompute = function precompute(power) {
    if (this.precomputed) return this;
    var precomputed = {
      doubles: null,
      naf: null,
      beta: null
    };
    precomputed.naf = this._getNAFPoints(8);
    precomputed.doubles = this._getDoubles(4, power);
    precomputed.beta = this._getBeta();
    this.precomputed = precomputed;
    return this;
  };

  BasePoint.prototype._hasDoubles = function _hasDoubles(k) {
    if (!this.precomputed) return false;
    var doubles = this.precomputed.doubles;
    if (!doubles) return false;
    return doubles.points.length >= Math.ceil((k.bitLength() + 1) / doubles.step);
  };

  BasePoint.prototype._getDoubles = function _getDoubles(step, power) {
    if (this.precomputed && this.precomputed.doubles) return this.precomputed.doubles;
    var doubles = [this];
    var acc = this;

    for (var i = 0; i < power; i += step) {
      for (var j = 0; j < step; j++) acc = acc.dbl();

      doubles.push(acc);
    }

    return {
      step: step,
      points: doubles
    };
  };

  BasePoint.prototype._getNAFPoints = function _getNAFPoints(wnd) {
    if (this.precomputed && this.precomputed.naf) return this.precomputed.naf;
    var res = [this];
    var max = (1 << wnd) - 1;
    var dbl = max === 1 ? null : this.dbl();

    for (var i = 1; i < max; i++) res[i] = res[i - 1].add(dbl);

    return {
      wnd: wnd,
      points: res
    };
  };

  BasePoint.prototype._getBeta = function _getBeta() {
    return null;
  };

  BasePoint.prototype.dblp = function dblp(k) {
    var r = this;

    for (var i = 0; i < k; i++) r = r.dbl();

    return r;
  };

  var inherits_browser = {exports: {}};

  if (typeof Object.create === 'function') {
    // implementation from standard node.js 'util' module
    inherits_browser.exports = function inherits(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
          constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
      }
    };
  } else {
    // old school shim for old browsers
    inherits_browser.exports = function inherits(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor;

        var TempCtor = function () {};

        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor();
        ctor.prototype.constructor = ctor;
      }
    };
  }

  var utils$j = utils$m;
  var BN$6 = bn.exports;
  var inherits$3 = inherits_browser.exports;
  var Base$2 = base;
  var assert$d = utils$j.assert;

  function ShortCurve(conf) {
    Base$2.call(this, 'short', conf);
    this.a = new BN$6(conf.a, 16).toRed(this.red);
    this.b = new BN$6(conf.b, 16).toRed(this.red);
    this.tinv = this.two.redInvm();
    this.zeroA = this.a.fromRed().cmpn(0) === 0;
    this.threeA = this.a.fromRed().sub(this.p).cmpn(-3) === 0; // If the curve is endomorphic, precalculate beta and lambda

    this.endo = this._getEndomorphism(conf);
    this._endoWnafT1 = new Array(4);
    this._endoWnafT2 = new Array(4);
  }

  inherits$3(ShortCurve, Base$2);
  var short = ShortCurve;

  ShortCurve.prototype._getEndomorphism = function _getEndomorphism(conf) {
    // No efficient endomorphism
    if (!this.zeroA || !this.g || !this.n || this.p.modn(3) !== 1) return; // Compute beta and lambda, that lambda * P = (beta * Px; Py)

    var beta;
    var lambda;

    if (conf.beta) {
      beta = new BN$6(conf.beta, 16).toRed(this.red);
    } else {
      var betas = this._getEndoRoots(this.p); // Choose the smallest beta


      beta = betas[0].cmp(betas[1]) < 0 ? betas[0] : betas[1];
      beta = beta.toRed(this.red);
    }

    if (conf.lambda) {
      lambda = new BN$6(conf.lambda, 16);
    } else {
      // Choose the lambda that is matching selected beta
      var lambdas = this._getEndoRoots(this.n);

      if (this.g.mul(lambdas[0]).x.cmp(this.g.x.redMul(beta)) === 0) {
        lambda = lambdas[0];
      } else {
        lambda = lambdas[1];
        assert$d(this.g.mul(lambda).x.cmp(this.g.x.redMul(beta)) === 0);
      }
    } // Get basis vectors, used for balanced length-two representation


    var basis;

    if (conf.basis) {
      basis = conf.basis.map(function (vec) {
        return {
          a: new BN$6(vec.a, 16),
          b: new BN$6(vec.b, 16)
        };
      });
    } else {
      basis = this._getEndoBasis(lambda);
    }

    return {
      beta: beta,
      lambda: lambda,
      basis: basis
    };
  };

  ShortCurve.prototype._getEndoRoots = function _getEndoRoots(num) {
    // Find roots of for x^2 + x + 1 in F
    // Root = (-1 +- Sqrt(-3)) / 2
    //
    var red = num === this.p ? this.red : BN$6.mont(num);
    var tinv = new BN$6(2).toRed(red).redInvm();
    var ntinv = tinv.redNeg();
    var s = new BN$6(3).toRed(red).redNeg().redSqrt().redMul(tinv);
    var l1 = ntinv.redAdd(s).fromRed();
    var l2 = ntinv.redSub(s).fromRed();
    return [l1, l2];
  };

  ShortCurve.prototype._getEndoBasis = function _getEndoBasis(lambda) {
    // aprxSqrt >= sqrt(this.n)
    var aprxSqrt = this.n.ushrn(Math.floor(this.n.bitLength() / 2)); // 3.74
    // Run EGCD, until r(L + 1) < aprxSqrt

    var u = lambda;
    var v = this.n.clone();
    var x1 = new BN$6(1);
    var y1 = new BN$6(0);
    var x2 = new BN$6(0);
    var y2 = new BN$6(1); // NOTE: all vectors are roots of: a + b * lambda = 0 (mod n)

    var a0;
    var b0; // First vector

    var a1;
    var b1; // Second vector

    var a2;
    var b2;
    var prevR;
    var i = 0;
    var r;
    var x;

    while (u.cmpn(0) !== 0) {
      var q = v.div(u);
      r = v.sub(q.mul(u));
      x = x2.sub(q.mul(x1));
      var y = y2.sub(q.mul(y1));

      if (!a1 && r.cmp(aprxSqrt) < 0) {
        a0 = prevR.neg();
        b0 = x1;
        a1 = r.neg();
        b1 = x;
      } else if (a1 && ++i === 2) {
        break;
      }

      prevR = r;
      v = u;
      u = r;
      x2 = x1;
      x1 = x;
      y2 = y1;
      y1 = y;
    }

    a2 = r.neg();
    b2 = x;
    var len1 = a1.sqr().add(b1.sqr());
    var len2 = a2.sqr().add(b2.sqr());

    if (len2.cmp(len1) >= 0) {
      a2 = a0;
      b2 = b0;
    } // Normalize signs


    if (a1.negative) {
      a1 = a1.neg();
      b1 = b1.neg();
    }

    if (a2.negative) {
      a2 = a2.neg();
      b2 = b2.neg();
    }

    return [{
      a: a1,
      b: b1
    }, {
      a: a2,
      b: b2
    }];
  };

  ShortCurve.prototype._endoSplit = function _endoSplit(k) {
    var basis = this.endo.basis;
    var v1 = basis[0];
    var v2 = basis[1];
    var c1 = v2.b.mul(k).divRound(this.n);
    var c2 = v1.b.neg().mul(k).divRound(this.n);
    var p1 = c1.mul(v1.a);
    var p2 = c2.mul(v2.a);
    var q1 = c1.mul(v1.b);
    var q2 = c2.mul(v2.b); // Calculate answer

    var k1 = k.sub(p1).sub(p2);
    var k2 = q1.add(q2).neg();
    return {
      k1: k1,
      k2: k2
    };
  };

  ShortCurve.prototype.pointFromX = function pointFromX(x, odd) {
    x = new BN$6(x, 16);
    if (!x.red) x = x.toRed(this.red);
    var y2 = x.redSqr().redMul(x).redIAdd(x.redMul(this.a)).redIAdd(this.b);
    var y = y2.redSqrt();
    if (y.redSqr().redSub(y2).cmp(this.zero) !== 0) throw new Error('invalid point'); // XXX Is there any way to tell if the number is odd without converting it
    // to non-red form?

    var isOdd = y.fromRed().isOdd();
    if (odd && !isOdd || !odd && isOdd) y = y.redNeg();
    return this.point(x, y);
  };

  ShortCurve.prototype.validate = function validate(point) {
    if (point.inf) return true;
    var x = point.x;
    var y = point.y;
    var ax = this.a.redMul(x);
    var rhs = x.redSqr().redMul(x).redIAdd(ax).redIAdd(this.b);
    return y.redSqr().redISub(rhs).cmpn(0) === 0;
  };

  ShortCurve.prototype._endoWnafMulAdd = function _endoWnafMulAdd(points, coeffs, jacobianResult) {
    var npoints = this._endoWnafT1;
    var ncoeffs = this._endoWnafT2;

    for (var i = 0; i < points.length; i++) {
      var split = this._endoSplit(coeffs[i]);

      var p = points[i];

      var beta = p._getBeta();

      if (split.k1.negative) {
        split.k1.ineg();
        p = p.neg(true);
      }

      if (split.k2.negative) {
        split.k2.ineg();
        beta = beta.neg(true);
      }

      npoints[i * 2] = p;
      npoints[i * 2 + 1] = beta;
      ncoeffs[i * 2] = split.k1;
      ncoeffs[i * 2 + 1] = split.k2;
    }

    var res = this._wnafMulAdd(1, npoints, ncoeffs, i * 2, jacobianResult); // Clean-up references to points and coefficients


    for (var j = 0; j < i * 2; j++) {
      npoints[j] = null;
      ncoeffs[j] = null;
    }

    return res;
  };

  function Point$2(curve, x, y, isRed) {
    Base$2.BasePoint.call(this, curve, 'affine');

    if (x === null && y === null) {
      this.x = null;
      this.y = null;
      this.inf = true;
    } else {
      this.x = new BN$6(x, 16);
      this.y = new BN$6(y, 16); // Force redgomery representation when loading from JSON

      if (isRed) {
        this.x.forceRed(this.curve.red);
        this.y.forceRed(this.curve.red);
      }

      if (!this.x.red) this.x = this.x.toRed(this.curve.red);
      if (!this.y.red) this.y = this.y.toRed(this.curve.red);
      this.inf = false;
    }
  }

  inherits$3(Point$2, Base$2.BasePoint);

  ShortCurve.prototype.point = function point(x, y, isRed) {
    return new Point$2(this, x, y, isRed);
  };

  ShortCurve.prototype.pointFromJSON = function pointFromJSON(obj, red) {
    return Point$2.fromJSON(this, obj, red);
  };

  Point$2.prototype._getBeta = function _getBeta() {
    if (!this.curve.endo) return;
    var pre = this.precomputed;
    if (pre && pre.beta) return pre.beta;
    var beta = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);

    if (pre) {
      var curve = this.curve;

      var endoMul = function (p) {
        return curve.point(p.x.redMul(curve.endo.beta), p.y);
      };

      pre.beta = beta;
      beta.precomputed = {
        beta: null,
        naf: pre.naf && {
          wnd: pre.naf.wnd,
          points: pre.naf.points.map(endoMul)
        },
        doubles: pre.doubles && {
          step: pre.doubles.step,
          points: pre.doubles.points.map(endoMul)
        }
      };
    }

    return beta;
  };

  Point$2.prototype.toJSON = function toJSON() {
    if (!this.precomputed) return [this.x, this.y];
    return [this.x, this.y, this.precomputed && {
      doubles: this.precomputed.doubles && {
        step: this.precomputed.doubles.step,
        points: this.precomputed.doubles.points.slice(1)
      },
      naf: this.precomputed.naf && {
        wnd: this.precomputed.naf.wnd,
        points: this.precomputed.naf.points.slice(1)
      }
    }];
  };

  Point$2.fromJSON = function fromJSON(curve, obj, red) {
    if (typeof obj === 'string') obj = JSON.parse(obj);
    var res = curve.point(obj[0], obj[1], red);
    if (!obj[2]) return res;

    function obj2point(obj) {
      return curve.point(obj[0], obj[1], red);
    }

    var pre = obj[2];
    res.precomputed = {
      beta: null,
      doubles: pre.doubles && {
        step: pre.doubles.step,
        points: [res].concat(pre.doubles.points.map(obj2point))
      },
      naf: pre.naf && {
        wnd: pre.naf.wnd,
        points: [res].concat(pre.naf.points.map(obj2point))
      }
    };
    return res;
  };

  Point$2.prototype.inspect = function inspect() {
    if (this.isInfinity()) return '<EC Point Infinity>';
    return '<EC Point x: ' + this.x.fromRed().toString(16, 2) + ' y: ' + this.y.fromRed().toString(16, 2) + '>';
  };

  Point$2.prototype.isInfinity = function isInfinity() {
    return this.inf;
  };

  Point$2.prototype.add = function add(p) {
    // O + P = P
    if (this.inf) return p; // P + O = P

    if (p.inf) return this; // P + P = 2P

    if (this.eq(p)) return this.dbl(); // P + (-P) = O

    if (this.neg().eq(p)) return this.curve.point(null, null); // P + Q = O

    if (this.x.cmp(p.x) === 0) return this.curve.point(null, null);
    var c = this.y.redSub(p.y);
    if (c.cmpn(0) !== 0) c = c.redMul(this.x.redSub(p.x).redInvm());
    var nx = c.redSqr().redISub(this.x).redISub(p.x);
    var ny = c.redMul(this.x.redSub(nx)).redISub(this.y);
    return this.curve.point(nx, ny);
  };

  Point$2.prototype.dbl = function dbl() {
    if (this.inf) return this; // 2P = O

    var ys1 = this.y.redAdd(this.y);
    if (ys1.cmpn(0) === 0) return this.curve.point(null, null);
    var a = this.curve.a;
    var x2 = this.x.redSqr();
    var dyinv = ys1.redInvm();
    var c = x2.redAdd(x2).redIAdd(x2).redIAdd(a).redMul(dyinv);
    var nx = c.redSqr().redISub(this.x.redAdd(this.x));
    var ny = c.redMul(this.x.redSub(nx)).redISub(this.y);
    return this.curve.point(nx, ny);
  };

  Point$2.prototype.getX = function getX() {
    return this.x.fromRed();
  };

  Point$2.prototype.getY = function getY() {
    return this.y.fromRed();
  };

  Point$2.prototype.mul = function mul(k) {
    k = new BN$6(k, 16);
    if (this.isInfinity()) return this;else if (this._hasDoubles(k)) return this.curve._fixedNafMul(this, k);else if (this.curve.endo) return this.curve._endoWnafMulAdd([this], [k]);else return this.curve._wnafMul(this, k);
  };

  Point$2.prototype.mulAdd = function mulAdd(k1, p2, k2) {
    var points = [this, p2];
    var coeffs = [k1, k2];
    if (this.curve.endo) return this.curve._endoWnafMulAdd(points, coeffs);else return this.curve._wnafMulAdd(1, points, coeffs, 2);
  };

  Point$2.prototype.jmulAdd = function jmulAdd(k1, p2, k2) {
    var points = [this, p2];
    var coeffs = [k1, k2];
    if (this.curve.endo) return this.curve._endoWnafMulAdd(points, coeffs, true);else return this.curve._wnafMulAdd(1, points, coeffs, 2, true);
  };

  Point$2.prototype.eq = function eq(p) {
    return this === p || this.inf === p.inf && (this.inf || this.x.cmp(p.x) === 0 && this.y.cmp(p.y) === 0);
  };

  Point$2.prototype.neg = function neg(_precompute) {
    if (this.inf) return this;
    var res = this.curve.point(this.x, this.y.redNeg());

    if (_precompute && this.precomputed) {
      var pre = this.precomputed;

      var negate = function (p) {
        return p.neg();
      };

      res.precomputed = {
        naf: pre.naf && {
          wnd: pre.naf.wnd,
          points: pre.naf.points.map(negate)
        },
        doubles: pre.doubles && {
          step: pre.doubles.step,
          points: pre.doubles.points.map(negate)
        }
      };
    }

    return res;
  };

  Point$2.prototype.toJ = function toJ() {
    if (this.inf) return this.curve.jpoint(null, null, null);
    var res = this.curve.jpoint(this.x, this.y, this.curve.one);
    return res;
  };

  function JPoint(curve, x, y, z) {
    Base$2.BasePoint.call(this, curve, 'jacobian');

    if (x === null && y === null && z === null) {
      this.x = this.curve.one;
      this.y = this.curve.one;
      this.z = new BN$6(0);
    } else {
      this.x = new BN$6(x, 16);
      this.y = new BN$6(y, 16);
      this.z = new BN$6(z, 16);
    }

    if (!this.x.red) this.x = this.x.toRed(this.curve.red);
    if (!this.y.red) this.y = this.y.toRed(this.curve.red);
    if (!this.z.red) this.z = this.z.toRed(this.curve.red);
    this.zOne = this.z === this.curve.one;
  }

  inherits$3(JPoint, Base$2.BasePoint);

  ShortCurve.prototype.jpoint = function jpoint(x, y, z) {
    return new JPoint(this, x, y, z);
  };

  JPoint.prototype.toP = function toP() {
    if (this.isInfinity()) return this.curve.point(null, null);
    var zinv = this.z.redInvm();
    var zinv2 = zinv.redSqr();
    var ax = this.x.redMul(zinv2);
    var ay = this.y.redMul(zinv2).redMul(zinv);
    return this.curve.point(ax, ay);
  };

  JPoint.prototype.neg = function neg() {
    return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
  };

  JPoint.prototype.add = function add(p) {
    // O + P = P
    if (this.isInfinity()) return p; // P + O = P

    if (p.isInfinity()) return this; // 12M + 4S + 7A

    var pz2 = p.z.redSqr();
    var z2 = this.z.redSqr();
    var u1 = this.x.redMul(pz2);
    var u2 = p.x.redMul(z2);
    var s1 = this.y.redMul(pz2.redMul(p.z));
    var s2 = p.y.redMul(z2.redMul(this.z));
    var h = u1.redSub(u2);
    var r = s1.redSub(s2);

    if (h.cmpn(0) === 0) {
      if (r.cmpn(0) !== 0) return this.curve.jpoint(null, null, null);else return this.dbl();
    }

    var h2 = h.redSqr();
    var h3 = h2.redMul(h);
    var v = u1.redMul(h2);
    var nx = r.redSqr().redIAdd(h3).redISub(v).redISub(v);
    var ny = r.redMul(v.redISub(nx)).redISub(s1.redMul(h3));
    var nz = this.z.redMul(p.z).redMul(h);
    return this.curve.jpoint(nx, ny, nz);
  };

  JPoint.prototype.mixedAdd = function mixedAdd(p) {
    // O + P = P
    if (this.isInfinity()) return p.toJ(); // P + O = P

    if (p.isInfinity()) return this; // 8M + 3S + 7A

    var z2 = this.z.redSqr();
    var u1 = this.x;
    var u2 = p.x.redMul(z2);
    var s1 = this.y;
    var s2 = p.y.redMul(z2).redMul(this.z);
    var h = u1.redSub(u2);
    var r = s1.redSub(s2);

    if (h.cmpn(0) === 0) {
      if (r.cmpn(0) !== 0) return this.curve.jpoint(null, null, null);else return this.dbl();
    }

    var h2 = h.redSqr();
    var h3 = h2.redMul(h);
    var v = u1.redMul(h2);
    var nx = r.redSqr().redIAdd(h3).redISub(v).redISub(v);
    var ny = r.redMul(v.redISub(nx)).redISub(s1.redMul(h3));
    var nz = this.z.redMul(h);
    return this.curve.jpoint(nx, ny, nz);
  };

  JPoint.prototype.dblp = function dblp(pow) {
    if (pow === 0) return this;
    if (this.isInfinity()) return this;
    if (!pow) return this.dbl();
    var i;

    if (this.curve.zeroA || this.curve.threeA) {
      var r = this;

      for (i = 0; i < pow; i++) r = r.dbl();

      return r;
    } // 1M + 2S + 1A + N * (4S + 5M + 8A)
    // N = 1 => 6M + 6S + 9A


    var a = this.curve.a;
    var tinv = this.curve.tinv;
    var jx = this.x;
    var jy = this.y;
    var jz = this.z;
    var jz4 = jz.redSqr().redSqr(); // Reuse results

    var jyd = jy.redAdd(jy);

    for (i = 0; i < pow; i++) {
      var jx2 = jx.redSqr();
      var jyd2 = jyd.redSqr();
      var jyd4 = jyd2.redSqr();
      var c = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a.redMul(jz4));
      var t1 = jx.redMul(jyd2);
      var nx = c.redSqr().redISub(t1.redAdd(t1));
      var t2 = t1.redISub(nx);
      var dny = c.redMul(t2);
      dny = dny.redIAdd(dny).redISub(jyd4);
      var nz = jyd.redMul(jz);
      if (i + 1 < pow) jz4 = jz4.redMul(jyd4);
      jx = nx;
      jz = nz;
      jyd = dny;
    }

    return this.curve.jpoint(jx, jyd.redMul(tinv), jz);
  };

  JPoint.prototype.dbl = function dbl() {
    if (this.isInfinity()) return this;
    if (this.curve.zeroA) return this._zeroDbl();else if (this.curve.threeA) return this._threeDbl();else return this._dbl();
  };

  JPoint.prototype._zeroDbl = function _zeroDbl() {
    var nx;
    var ny;
    var nz; // Z = 1

    if (this.zOne) {
      // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html
      //     #doubling-mdbl-2007-bl
      // 1M + 5S + 14A
      // XX = X1^2
      var xx = this.x.redSqr(); // YY = Y1^2

      var yy = this.y.redSqr(); // YYYY = YY^2

      var yyyy = yy.redSqr(); // S = 2 * ((X1 + YY)^2 - XX - YYYY)

      var s = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
      s = s.redIAdd(s); // M = 3 * XX + a; a = 0

      var m = xx.redAdd(xx).redIAdd(xx); // T = M ^ 2 - 2*S

      var t = m.redSqr().redISub(s).redISub(s); // 8 * YYYY

      var yyyy8 = yyyy.redIAdd(yyyy);
      yyyy8 = yyyy8.redIAdd(yyyy8);
      yyyy8 = yyyy8.redIAdd(yyyy8); // X3 = T

      nx = t; // Y3 = M * (S - T) - 8 * YYYY

      ny = m.redMul(s.redISub(t)).redISub(yyyy8); // Z3 = 2*Y1

      nz = this.y.redAdd(this.y);
    } else {
      // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html
      //     #doubling-dbl-2009-l
      // 2M + 5S + 13A
      // A = X1^2
      var a = this.x.redSqr(); // B = Y1^2

      var b = this.y.redSqr(); // C = B^2

      var c = b.redSqr(); // D = 2 * ((X1 + B)^2 - A - C)

      var d = this.x.redAdd(b).redSqr().redISub(a).redISub(c);
      d = d.redIAdd(d); // E = 3 * A

      var e = a.redAdd(a).redIAdd(a); // F = E^2

      var f = e.redSqr(); // 8 * C

      var c8 = c.redIAdd(c);
      c8 = c8.redIAdd(c8);
      c8 = c8.redIAdd(c8); // X3 = F - 2 * D

      nx = f.redISub(d).redISub(d); // Y3 = E * (D - X3) - 8 * C

      ny = e.redMul(d.redISub(nx)).redISub(c8); // Z3 = 2 * Y1 * Z1

      nz = this.y.redMul(this.z);
      nz = nz.redIAdd(nz);
    }

    return this.curve.jpoint(nx, ny, nz);
  };

  JPoint.prototype._threeDbl = function _threeDbl() {
    var nx;
    var ny;
    var nz; // Z = 1

    if (this.zOne) {
      // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-3.html
      //     #doubling-mdbl-2007-bl
      // 1M + 5S + 15A
      // XX = X1^2
      var xx = this.x.redSqr(); // YY = Y1^2

      var yy = this.y.redSqr(); // YYYY = YY^2

      var yyyy = yy.redSqr(); // S = 2 * ((X1 + YY)^2 - XX - YYYY)

      var s = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
      s = s.redIAdd(s); // M = 3 * XX + a

      var m = xx.redAdd(xx).redIAdd(xx).redIAdd(this.curve.a); // T = M^2 - 2 * S

      var t = m.redSqr().redISub(s).redISub(s); // X3 = T

      nx = t; // Y3 = M * (S - T) - 8 * YYYY

      var yyyy8 = yyyy.redIAdd(yyyy);
      yyyy8 = yyyy8.redIAdd(yyyy8);
      yyyy8 = yyyy8.redIAdd(yyyy8);
      ny = m.redMul(s.redISub(t)).redISub(yyyy8); // Z3 = 2 * Y1

      nz = this.y.redAdd(this.y);
    } else {
      // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-3.html#doubling-dbl-2001-b
      // 3M + 5S
      // delta = Z1^2
      var delta = this.z.redSqr(); // gamma = Y1^2

      var gamma = this.y.redSqr(); // beta = X1 * gamma

      var beta = this.x.redMul(gamma); // alpha = 3 * (X1 - delta) * (X1 + delta)

      var alpha = this.x.redSub(delta).redMul(this.x.redAdd(delta));
      alpha = alpha.redAdd(alpha).redIAdd(alpha); // X3 = alpha^2 - 8 * beta

      var beta4 = beta.redIAdd(beta);
      beta4 = beta4.redIAdd(beta4);
      var beta8 = beta4.redAdd(beta4);
      nx = alpha.redSqr().redISub(beta8); // Z3 = (Y1 + Z1)^2 - gamma - delta

      nz = this.y.redAdd(this.z).redSqr().redISub(gamma).redISub(delta); // Y3 = alpha * (4 * beta - X3) - 8 * gamma^2

      var ggamma8 = gamma.redSqr();
      ggamma8 = ggamma8.redIAdd(ggamma8);
      ggamma8 = ggamma8.redIAdd(ggamma8);
      ggamma8 = ggamma8.redIAdd(ggamma8);
      ny = alpha.redMul(beta4.redISub(nx)).redISub(ggamma8);
    }

    return this.curve.jpoint(nx, ny, nz);
  };

  JPoint.prototype._dbl = function _dbl() {
    var a = this.curve.a; // 4M + 6S + 10A

    var jx = this.x;
    var jy = this.y;
    var jz = this.z;
    var jz4 = jz.redSqr().redSqr();
    var jx2 = jx.redSqr();
    var jy2 = jy.redSqr();
    var c = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a.redMul(jz4));
    var jxd4 = jx.redAdd(jx);
    jxd4 = jxd4.redIAdd(jxd4);
    var t1 = jxd4.redMul(jy2);
    var nx = c.redSqr().redISub(t1.redAdd(t1));
    var t2 = t1.redISub(nx);
    var jyd8 = jy2.redSqr();
    jyd8 = jyd8.redIAdd(jyd8);
    jyd8 = jyd8.redIAdd(jyd8);
    jyd8 = jyd8.redIAdd(jyd8);
    var ny = c.redMul(t2).redISub(jyd8);
    var nz = jy.redAdd(jy).redMul(jz);
    return this.curve.jpoint(nx, ny, nz);
  };

  JPoint.prototype.trpl = function trpl() {
    if (!this.curve.zeroA) return this.dbl().add(this); // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html#tripling-tpl-2007-bl
    // 5M + 10S + ...
    // XX = X1^2

    var xx = this.x.redSqr(); // YY = Y1^2

    var yy = this.y.redSqr(); // ZZ = Z1^2

    var zz = this.z.redSqr(); // YYYY = YY^2

    var yyyy = yy.redSqr(); // M = 3 * XX + a * ZZ2; a = 0

    var m = xx.redAdd(xx).redIAdd(xx); // MM = M^2

    var mm = m.redSqr(); // E = 6 * ((X1 + YY)^2 - XX - YYYY) - MM

    var e = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
    e = e.redIAdd(e);
    e = e.redAdd(e).redIAdd(e);
    e = e.redISub(mm); // EE = E^2

    var ee = e.redSqr(); // T = 16*YYYY

    var t = yyyy.redIAdd(yyyy);
    t = t.redIAdd(t);
    t = t.redIAdd(t);
    t = t.redIAdd(t); // U = (M + E)^2 - MM - EE - T

    var u = m.redIAdd(e).redSqr().redISub(mm).redISub(ee).redISub(t); // X3 = 4 * (X1 * EE - 4 * YY * U)

    var yyu4 = yy.redMul(u);
    yyu4 = yyu4.redIAdd(yyu4);
    yyu4 = yyu4.redIAdd(yyu4);
    var nx = this.x.redMul(ee).redISub(yyu4);
    nx = nx.redIAdd(nx);
    nx = nx.redIAdd(nx); // Y3 = 8 * Y1 * (U * (T - U) - E * EE)

    var ny = this.y.redMul(u.redMul(t.redISub(u)).redISub(e.redMul(ee)));
    ny = ny.redIAdd(ny);
    ny = ny.redIAdd(ny);
    ny = ny.redIAdd(ny); // Z3 = (Z1 + E)^2 - ZZ - EE

    var nz = this.z.redAdd(e).redSqr().redISub(zz).redISub(ee);
    return this.curve.jpoint(nx, ny, nz);
  };

  JPoint.prototype.mul = function mul(k, kbase) {
    k = new BN$6(k, kbase);
    return this.curve._wnafMul(this, k);
  };

  JPoint.prototype.eq = function eq(p) {
    if (p.type === 'affine') return this.eq(p.toJ());
    if (this === p) return true; // x1 * z2^2 == x2 * z1^2

    var z2 = this.z.redSqr();
    var pz2 = p.z.redSqr();
    if (this.x.redMul(pz2).redISub(p.x.redMul(z2)).cmpn(0) !== 0) return false; // y1 * z2^3 == y2 * z1^3

    var z3 = z2.redMul(this.z);
    var pz3 = pz2.redMul(p.z);
    return this.y.redMul(pz3).redISub(p.y.redMul(z3)).cmpn(0) === 0;
  };

  JPoint.prototype.eqXToP = function eqXToP(x) {
    var zs = this.z.redSqr();
    var rx = x.toRed(this.curve.red).redMul(zs);
    if (this.x.cmp(rx) === 0) return true;
    var xc = x.clone();
    var t = this.curve.redN.redMul(zs);

    for (;;) {
      xc.iadd(this.curve.n);
      if (xc.cmp(this.curve.p) >= 0) return false;
      rx.redIAdd(t);
      if (this.x.cmp(rx) === 0) return true;
    }
  };

  JPoint.prototype.inspect = function inspect() {
    if (this.isInfinity()) return '<EC JPoint Infinity>';
    return '<EC JPoint x: ' + this.x.toString(16, 2) + ' y: ' + this.y.toString(16, 2) + ' z: ' + this.z.toString(16, 2) + '>';
  };

  JPoint.prototype.isInfinity = function isInfinity() {
    // XXX This code assumes that zero is always zero in red
    return this.z.cmpn(0) === 0;
  };

  var BN$5 = bn.exports;
  var inherits$2 = inherits_browser.exports;
  var Base$1 = base;
  var utils$i = utils$m;

  function MontCurve(conf) {
    Base$1.call(this, 'mont', conf);
    this.a = new BN$5(conf.a, 16).toRed(this.red);
    this.b = new BN$5(conf.b, 16).toRed(this.red);
    this.i4 = new BN$5(4).toRed(this.red).redInvm();
    this.two = new BN$5(2).toRed(this.red);
    this.a24 = this.i4.redMul(this.a.redAdd(this.two));
  }

  inherits$2(MontCurve, Base$1);
  var mont = MontCurve;

  MontCurve.prototype.validate = function validate(point) {
    var x = point.normalize().x;
    var x2 = x.redSqr();
    var rhs = x2.redMul(x).redAdd(x2.redMul(this.a)).redAdd(x);
    var y = rhs.redSqrt();
    return y.redSqr().cmp(rhs) === 0;
  };

  function Point$1(curve, x, z) {
    Base$1.BasePoint.call(this, curve, 'projective');

    if (x === null && z === null) {
      this.x = this.curve.one;
      this.z = this.curve.zero;
    } else {
      this.x = new BN$5(x, 16);
      this.z = new BN$5(z, 16);
      if (!this.x.red) this.x = this.x.toRed(this.curve.red);
      if (!this.z.red) this.z = this.z.toRed(this.curve.red);
    }
  }

  inherits$2(Point$1, Base$1.BasePoint);

  MontCurve.prototype.decodePoint = function decodePoint(bytes, enc) {
    return this.point(utils$i.toArray(bytes, enc), 1);
  };

  MontCurve.prototype.point = function point(x, z) {
    return new Point$1(this, x, z);
  };

  MontCurve.prototype.pointFromJSON = function pointFromJSON(obj) {
    return Point$1.fromJSON(this, obj);
  };

  Point$1.prototype.precompute = function precompute() {// No-op
  };

  Point$1.prototype._encode = function _encode() {
    return this.getX().toArray('be', this.curve.p.byteLength());
  };

  Point$1.fromJSON = function fromJSON(curve, obj) {
    return new Point$1(curve, obj[0], obj[1] || curve.one);
  };

  Point$1.prototype.inspect = function inspect() {
    if (this.isInfinity()) return '<EC Point Infinity>';
    return '<EC Point x: ' + this.x.fromRed().toString(16, 2) + ' z: ' + this.z.fromRed().toString(16, 2) + '>';
  };

  Point$1.prototype.isInfinity = function isInfinity() {
    // XXX This code assumes that zero is always zero in red
    return this.z.cmpn(0) === 0;
  };

  Point$1.prototype.dbl = function dbl() {
    // http://hyperelliptic.org/EFD/g1p/auto-montgom-xz.html#doubling-dbl-1987-m-3
    // 2M + 2S + 4A
    // A = X1 + Z1
    var a = this.x.redAdd(this.z); // AA = A^2

    var aa = a.redSqr(); // B = X1 - Z1

    var b = this.x.redSub(this.z); // BB = B^2

    var bb = b.redSqr(); // C = AA - BB

    var c = aa.redSub(bb); // X3 = AA * BB

    var nx = aa.redMul(bb); // Z3 = C * (BB + A24 * C)

    var nz = c.redMul(bb.redAdd(this.curve.a24.redMul(c)));
    return this.curve.point(nx, nz);
  };

  Point$1.prototype.add = function add() {
    throw new Error('Not supported on Montgomery curve');
  };

  Point$1.prototype.diffAdd = function diffAdd(p, diff) {
    // http://hyperelliptic.org/EFD/g1p/auto-montgom-xz.html#diffadd-dadd-1987-m-3
    // 4M + 2S + 6A
    // A = X2 + Z2
    var a = this.x.redAdd(this.z); // B = X2 - Z2

    var b = this.x.redSub(this.z); // C = X3 + Z3

    var c = p.x.redAdd(p.z); // D = X3 - Z3

    var d = p.x.redSub(p.z); // DA = D * A

    var da = d.redMul(a); // CB = C * B

    var cb = c.redMul(b); // X5 = Z1 * (DA + CB)^2

    var nx = diff.z.redMul(da.redAdd(cb).redSqr()); // Z5 = X1 * (DA - CB)^2

    var nz = diff.x.redMul(da.redISub(cb).redSqr());
    return this.curve.point(nx, nz);
  };

  Point$1.prototype.mul = function mul(k) {
    var t = k.clone();
    var a = this; // (N / 2) * Q + Q

    var b = this.curve.point(null, null); // (N / 2) * Q

    var c = this; // Q

    for (var bits = []; t.cmpn(0) !== 0; t.iushrn(1)) bits.push(t.andln(1));

    for (var i = bits.length - 1; i >= 0; i--) {
      if (bits[i] === 0) {
        // N * Q + Q = ((N / 2) * Q + Q)) + (N / 2) * Q
        a = a.diffAdd(b, c); // N * Q = 2 * ((N / 2) * Q + Q))

        b = b.dbl();
      } else {
        // N * Q = ((N / 2) * Q + Q) + ((N / 2) * Q)
        b = a.diffAdd(b, c); // N * Q + Q = 2 * ((N / 2) * Q + Q)

        a = a.dbl();
      }
    }

    return b;
  };

  Point$1.prototype.mulAdd = function mulAdd() {
    throw new Error('Not supported on Montgomery curve');
  };

  Point$1.prototype.jumlAdd = function jumlAdd() {
    throw new Error('Not supported on Montgomery curve');
  };

  Point$1.prototype.eq = function eq(other) {
    return this.getX().cmp(other.getX()) === 0;
  };

  Point$1.prototype.normalize = function normalize() {
    this.x = this.x.redMul(this.z.redInvm());
    this.z = this.curve.one;
    return this;
  };

  Point$1.prototype.getX = function getX() {
    // Normalize coordinates
    this.normalize();
    return this.x.fromRed();
  };

  var utils$h = utils$m;
  var BN$4 = bn.exports;
  var inherits$1 = inherits_browser.exports;
  var Base = base;
  var assert$c = utils$h.assert;

  function EdwardsCurve(conf) {
    // NOTE: Important as we are creating point in Base.call()
    this.twisted = (conf.a | 0) !== 1;
    this.mOneA = this.twisted && (conf.a | 0) === -1;
    this.extended = this.mOneA;
    Base.call(this, 'edwards', conf);
    this.a = new BN$4(conf.a, 16).umod(this.red.m);
    this.a = this.a.toRed(this.red);
    this.c = new BN$4(conf.c, 16).toRed(this.red);
    this.c2 = this.c.redSqr();
    this.d = new BN$4(conf.d, 16).toRed(this.red);
    this.dd = this.d.redAdd(this.d);
    assert$c(!this.twisted || this.c.fromRed().cmpn(1) === 0);
    this.oneC = (conf.c | 0) === 1;
  }

  inherits$1(EdwardsCurve, Base);
  var edwards = EdwardsCurve;

  EdwardsCurve.prototype._mulA = function _mulA(num) {
    if (this.mOneA) return num.redNeg();else return this.a.redMul(num);
  };

  EdwardsCurve.prototype._mulC = function _mulC(num) {
    if (this.oneC) return num;else return this.c.redMul(num);
  }; // Just for compatibility with Short curve


  EdwardsCurve.prototype.jpoint = function jpoint(x, y, z, t) {
    return this.point(x, y, z, t);
  };

  EdwardsCurve.prototype.pointFromX = function pointFromX(x, odd) {
    x = new BN$4(x, 16);
    if (!x.red) x = x.toRed(this.red);
    var x2 = x.redSqr();
    var rhs = this.c2.redSub(this.a.redMul(x2));
    var lhs = this.one.redSub(this.c2.redMul(this.d).redMul(x2));
    var y2 = rhs.redMul(lhs.redInvm());
    var y = y2.redSqrt();
    if (y.redSqr().redSub(y2).cmp(this.zero) !== 0) throw new Error('invalid point');
    var isOdd = y.fromRed().isOdd();
    if (odd && !isOdd || !odd && isOdd) y = y.redNeg();
    return this.point(x, y);
  };

  EdwardsCurve.prototype.pointFromY = function pointFromY(y, odd) {
    y = new BN$4(y, 16);
    if (!y.red) y = y.toRed(this.red); // x^2 = (y^2 - c^2) / (c^2 d y^2 - a)

    var y2 = y.redSqr();
    var lhs = y2.redSub(this.c2);
    var rhs = y2.redMul(this.d).redMul(this.c2).redSub(this.a);
    var x2 = lhs.redMul(rhs.redInvm());

    if (x2.cmp(this.zero) === 0) {
      if (odd) throw new Error('invalid point');else return this.point(this.zero, y);
    }

    var x = x2.redSqrt();
    if (x.redSqr().redSub(x2).cmp(this.zero) !== 0) throw new Error('invalid point');
    if (x.fromRed().isOdd() !== odd) x = x.redNeg();
    return this.point(x, y);
  };

  EdwardsCurve.prototype.validate = function validate(point) {
    if (point.isInfinity()) return true; // Curve: A * X^2 + Y^2 = C^2 * (1 + D * X^2 * Y^2)

    point.normalize();
    var x2 = point.x.redSqr();
    var y2 = point.y.redSqr();
    var lhs = x2.redMul(this.a).redAdd(y2);
    var rhs = this.c2.redMul(this.one.redAdd(this.d.redMul(x2).redMul(y2)));
    return lhs.cmp(rhs) === 0;
  };

  function Point(curve, x, y, z, t) {
    Base.BasePoint.call(this, curve, 'projective');

    if (x === null && y === null && z === null) {
      this.x = this.curve.zero;
      this.y = this.curve.one;
      this.z = this.curve.one;
      this.t = this.curve.zero;
      this.zOne = true;
    } else {
      this.x = new BN$4(x, 16);
      this.y = new BN$4(y, 16);
      this.z = z ? new BN$4(z, 16) : this.curve.one;
      this.t = t && new BN$4(t, 16);
      if (!this.x.red) this.x = this.x.toRed(this.curve.red);
      if (!this.y.red) this.y = this.y.toRed(this.curve.red);
      if (!this.z.red) this.z = this.z.toRed(this.curve.red);
      if (this.t && !this.t.red) this.t = this.t.toRed(this.curve.red);
      this.zOne = this.z === this.curve.one; // Use extended coordinates

      if (this.curve.extended && !this.t) {
        this.t = this.x.redMul(this.y);
        if (!this.zOne) this.t = this.t.redMul(this.z.redInvm());
      }
    }
  }

  inherits$1(Point, Base.BasePoint);

  EdwardsCurve.prototype.pointFromJSON = function pointFromJSON(obj) {
    return Point.fromJSON(this, obj);
  };

  EdwardsCurve.prototype.point = function point(x, y, z, t) {
    return new Point(this, x, y, z, t);
  };

  Point.fromJSON = function fromJSON(curve, obj) {
    return new Point(curve, obj[0], obj[1], obj[2]);
  };

  Point.prototype.inspect = function inspect() {
    if (this.isInfinity()) return '<EC Point Infinity>';
    return '<EC Point x: ' + this.x.fromRed().toString(16, 2) + ' y: ' + this.y.fromRed().toString(16, 2) + ' z: ' + this.z.fromRed().toString(16, 2) + '>';
  };

  Point.prototype.isInfinity = function isInfinity() {
    // XXX This code assumes that zero is always zero in red
    return this.x.cmpn(0) === 0 && (this.y.cmp(this.z) === 0 || this.zOne && this.y.cmp(this.curve.c) === 0);
  };

  Point.prototype._extDbl = function _extDbl() {
    // hyperelliptic.org/EFD/g1p/auto-twisted-extended-1.html
    //     #doubling-dbl-2008-hwcd
    // 4M + 4S
    // A = X1^2
    var a = this.x.redSqr(); // B = Y1^2

    var b = this.y.redSqr(); // C = 2 * Z1^2

    var c = this.z.redSqr();
    c = c.redIAdd(c); // D = a * A

    var d = this.curve._mulA(a); // E = (X1 + Y1)^2 - A - B


    var e = this.x.redAdd(this.y).redSqr().redISub(a).redISub(b); // G = D + B

    var g = d.redAdd(b); // F = G - C

    var f = g.redSub(c); // H = D - B

    var h = d.redSub(b); // X3 = E * F

    var nx = e.redMul(f); // Y3 = G * H

    var ny = g.redMul(h); // T3 = E * H

    var nt = e.redMul(h); // Z3 = F * G

    var nz = f.redMul(g);
    return this.curve.point(nx, ny, nz, nt);
  };

  Point.prototype._projDbl = function _projDbl() {
    // hyperelliptic.org/EFD/g1p/auto-twisted-projective.html
    //     #doubling-dbl-2008-bbjlp
    //     #doubling-dbl-2007-bl
    // and others
    // Generally 3M + 4S or 2M + 4S
    // B = (X1 + Y1)^2
    var b = this.x.redAdd(this.y).redSqr(); // C = X1^2

    var c = this.x.redSqr(); // D = Y1^2

    var d = this.y.redSqr();
    var nx;
    var ny;
    var nz;
    var e;
    var h;
    var j;

    if (this.curve.twisted) {
      // E = a * C
      e = this.curve._mulA(c); // F = E + D

      var f = e.redAdd(d);

      if (this.zOne) {
        // X3 = (B - C - D) * (F - 2)
        nx = b.redSub(c).redSub(d).redMul(f.redSub(this.curve.two)); // Y3 = F * (E - D)

        ny = f.redMul(e.redSub(d)); // Z3 = F^2 - 2 * F

        nz = f.redSqr().redSub(f).redSub(f);
      } else {
        // H = Z1^2
        h = this.z.redSqr(); // J = F - 2 * H

        j = f.redSub(h).redISub(h); // X3 = (B-C-D)*J

        nx = b.redSub(c).redISub(d).redMul(j); // Y3 = F * (E - D)

        ny = f.redMul(e.redSub(d)); // Z3 = F * J

        nz = f.redMul(j);
      }
    } else {
      // E = C + D
      e = c.redAdd(d); // H = (c * Z1)^2

      h = this.curve._mulC(this.z).redSqr(); // J = E - 2 * H

      j = e.redSub(h).redSub(h); // X3 = c * (B - E) * J

      nx = this.curve._mulC(b.redISub(e)).redMul(j); // Y3 = c * E * (C - D)

      ny = this.curve._mulC(e).redMul(c.redISub(d)); // Z3 = E * J

      nz = e.redMul(j);
    }

    return this.curve.point(nx, ny, nz);
  };

  Point.prototype.dbl = function dbl() {
    if (this.isInfinity()) return this; // Double in extended coordinates

    if (this.curve.extended) return this._extDbl();else return this._projDbl();
  };

  Point.prototype._extAdd = function _extAdd(p) {
    // hyperelliptic.org/EFD/g1p/auto-twisted-extended-1.html
    //     #addition-add-2008-hwcd-3
    // 8M
    // A = (Y1 - X1) * (Y2 - X2)
    var a = this.y.redSub(this.x).redMul(p.y.redSub(p.x)); // B = (Y1 + X1) * (Y2 + X2)

    var b = this.y.redAdd(this.x).redMul(p.y.redAdd(p.x)); // C = T1 * k * T2

    var c = this.t.redMul(this.curve.dd).redMul(p.t); // D = Z1 * 2 * Z2

    var d = this.z.redMul(p.z.redAdd(p.z)); // E = B - A

    var e = b.redSub(a); // F = D - C

    var f = d.redSub(c); // G = D + C

    var g = d.redAdd(c); // H = B + A

    var h = b.redAdd(a); // X3 = E * F

    var nx = e.redMul(f); // Y3 = G * H

    var ny = g.redMul(h); // T3 = E * H

    var nt = e.redMul(h); // Z3 = F * G

    var nz = f.redMul(g);
    return this.curve.point(nx, ny, nz, nt);
  };

  Point.prototype._projAdd = function _projAdd(p) {
    // hyperelliptic.org/EFD/g1p/auto-twisted-projective.html
    //     #addition-add-2008-bbjlp
    //     #addition-add-2007-bl
    // 10M + 1S
    // A = Z1 * Z2
    var a = this.z.redMul(p.z); // B = A^2

    var b = a.redSqr(); // C = X1 * X2

    var c = this.x.redMul(p.x); // D = Y1 * Y2

    var d = this.y.redMul(p.y); // E = d * C * D

    var e = this.curve.d.redMul(c).redMul(d); // F = B - E

    var f = b.redSub(e); // G = B + E

    var g = b.redAdd(e); // X3 = A * F * ((X1 + Y1) * (X2 + Y2) - C - D)

    var tmp = this.x.redAdd(this.y).redMul(p.x.redAdd(p.y)).redISub(c).redISub(d);
    var nx = a.redMul(f).redMul(tmp);
    var ny;
    var nz;

    if (this.curve.twisted) {
      // Y3 = A * G * (D - a * C)
      ny = a.redMul(g).redMul(d.redSub(this.curve._mulA(c))); // Z3 = F * G

      nz = f.redMul(g);
    } else {
      // Y3 = A * G * (D - C)
      ny = a.redMul(g).redMul(d.redSub(c)); // Z3 = c * F * G

      nz = this.curve._mulC(f).redMul(g);
    }

    return this.curve.point(nx, ny, nz);
  };

  Point.prototype.add = function add(p) {
    if (this.isInfinity()) return p;
    if (p.isInfinity()) return this;
    if (this.curve.extended) return this._extAdd(p);else return this._projAdd(p);
  };

  Point.prototype.mul = function mul(k) {
    if (this._hasDoubles(k)) return this.curve._fixedNafMul(this, k);else return this.curve._wnafMul(this, k);
  };

  Point.prototype.mulAdd = function mulAdd(k1, p, k2) {
    return this.curve._wnafMulAdd(1, [this, p], [k1, k2], 2, false);
  };

  Point.prototype.jmulAdd = function jmulAdd(k1, p, k2) {
    return this.curve._wnafMulAdd(1, [this, p], [k1, k2], 2, true);
  };

  Point.prototype.normalize = function normalize() {
    if (this.zOne) return this; // Normalize coordinates

    var zi = this.z.redInvm();
    this.x = this.x.redMul(zi);
    this.y = this.y.redMul(zi);
    if (this.t) this.t = this.t.redMul(zi);
    this.z = this.curve.one;
    this.zOne = true;
    return this;
  };

  Point.prototype.neg = function neg() {
    return this.curve.point(this.x.redNeg(), this.y, this.z, this.t && this.t.redNeg());
  };

  Point.prototype.getX = function getX() {
    this.normalize();
    return this.x.fromRed();
  };

  Point.prototype.getY = function getY() {
    this.normalize();
    return this.y.fromRed();
  };

  Point.prototype.eq = function eq(other) {
    return this === other || this.getX().cmp(other.getX()) === 0 && this.getY().cmp(other.getY()) === 0;
  };

  Point.prototype.eqXToP = function eqXToP(x) {
    var rx = x.toRed(this.curve.red).redMul(this.z);
    if (this.x.cmp(rx) === 0) return true;
    var xc = x.clone();
    var t = this.curve.redN.redMul(this.z);

    for (;;) {
      xc.iadd(this.curve.n);
      if (xc.cmp(this.curve.p) >= 0) return false;
      rx.redIAdd(t);
      if (this.x.cmp(rx) === 0) return true;
    }
  }; // Compatibility with BaseCurve


  Point.prototype.toP = Point.prototype.normalize;
  Point.prototype.mixedAdd = Point.prototype.add;

  (function (exports) {

    var curve = exports;
    curve.base = base;
    curve.short = short;
    curve.mont = mont;
    curve.edwards = edwards;
  })(curve);

  var curves$2 = {};

  var hash$2 = {};

  var utils$g = {};

  var assert$b = minimalisticAssert;
  var inherits = inherits_browser.exports;
  utils$g.inherits = inherits;

  function isSurrogatePair(msg, i) {
    if ((msg.charCodeAt(i) & 0xFC00) !== 0xD800) {
      return false;
    }

    if (i < 0 || i + 1 >= msg.length) {
      return false;
    }

    return (msg.charCodeAt(i + 1) & 0xFC00) === 0xDC00;
  }

  function toArray(msg, enc) {
    if (Array.isArray(msg)) return msg.slice();
    if (!msg) return [];
    var res = [];

    if (typeof msg === 'string') {
      if (!enc) {
        // Inspired by stringToUtf8ByteArray() in closure-library by Google
        // https://github.com/google/closure-library/blob/8598d87242af59aac233270742c8984e2b2bdbe0/closure/goog/crypt/crypt.js#L117-L143
        // Apache License 2.0
        // https://github.com/google/closure-library/blob/master/LICENSE
        var p = 0;

        for (var i = 0; i < msg.length; i++) {
          var c = msg.charCodeAt(i);

          if (c < 128) {
            res[p++] = c;
          } else if (c < 2048) {
            res[p++] = c >> 6 | 192;
            res[p++] = c & 63 | 128;
          } else if (isSurrogatePair(msg, i)) {
            c = 0x10000 + ((c & 0x03FF) << 10) + (msg.charCodeAt(++i) & 0x03FF);
            res[p++] = c >> 18 | 240;
            res[p++] = c >> 12 & 63 | 128;
            res[p++] = c >> 6 & 63 | 128;
            res[p++] = c & 63 | 128;
          } else {
            res[p++] = c >> 12 | 224;
            res[p++] = c >> 6 & 63 | 128;
            res[p++] = c & 63 | 128;
          }
        }
      } else if (enc === 'hex') {
        msg = msg.replace(/[^a-z0-9]+/ig, '');
        if (msg.length % 2 !== 0) msg = '0' + msg;

        for (i = 0; i < msg.length; i += 2) res.push(parseInt(msg[i] + msg[i + 1], 16));
      }
    } else {
      for (i = 0; i < msg.length; i++) res[i] = msg[i] | 0;
    }

    return res;
  }

  utils$g.toArray = toArray;

  function toHex(msg) {
    var res = '';

    for (var i = 0; i < msg.length; i++) res += zero2(msg[i].toString(16));

    return res;
  }

  utils$g.toHex = toHex;

  function htonl(w) {
    var res = w >>> 24 | w >>> 8 & 0xff00 | w << 8 & 0xff0000 | (w & 0xff) << 24;
    return res >>> 0;
  }

  utils$g.htonl = htonl;

  function toHex32(msg, endian) {
    var res = '';

    for (var i = 0; i < msg.length; i++) {
      var w = msg[i];
      if (endian === 'little') w = htonl(w);
      res += zero8(w.toString(16));
    }

    return res;
  }

  utils$g.toHex32 = toHex32;

  function zero2(word) {
    if (word.length === 1) return '0' + word;else return word;
  }

  utils$g.zero2 = zero2;

  function zero8(word) {
    if (word.length === 7) return '0' + word;else if (word.length === 6) return '00' + word;else if (word.length === 5) return '000' + word;else if (word.length === 4) return '0000' + word;else if (word.length === 3) return '00000' + word;else if (word.length === 2) return '000000' + word;else if (word.length === 1) return '0000000' + word;else return word;
  }

  utils$g.zero8 = zero8;

  function join32(msg, start, end, endian) {
    var len = end - start;
    assert$b(len % 4 === 0);
    var res = new Array(len / 4);

    for (var i = 0, k = start; i < res.length; i++, k += 4) {
      var w;
      if (endian === 'big') w = msg[k] << 24 | msg[k + 1] << 16 | msg[k + 2] << 8 | msg[k + 3];else w = msg[k + 3] << 24 | msg[k + 2] << 16 | msg[k + 1] << 8 | msg[k];
      res[i] = w >>> 0;
    }

    return res;
  }

  utils$g.join32 = join32;

  function split32(msg, endian) {
    var res = new Array(msg.length * 4);

    for (var i = 0, k = 0; i < msg.length; i++, k += 4) {
      var m = msg[i];

      if (endian === 'big') {
        res[k] = m >>> 24;
        res[k + 1] = m >>> 16 & 0xff;
        res[k + 2] = m >>> 8 & 0xff;
        res[k + 3] = m & 0xff;
      } else {
        res[k + 3] = m >>> 24;
        res[k + 2] = m >>> 16 & 0xff;
        res[k + 1] = m >>> 8 & 0xff;
        res[k] = m & 0xff;
      }
    }

    return res;
  }

  utils$g.split32 = split32;

  function rotr32$1(w, b) {
    return w >>> b | w << 32 - b;
  }

  utils$g.rotr32 = rotr32$1;

  function rotl32$2(w, b) {
    return w << b | w >>> 32 - b;
  }

  utils$g.rotl32 = rotl32$2;

  function sum32$3(a, b) {
    return a + b >>> 0;
  }

  utils$g.sum32 = sum32$3;

  function sum32_3$1(a, b, c) {
    return a + b + c >>> 0;
  }

  utils$g.sum32_3 = sum32_3$1;

  function sum32_4$2(a, b, c, d) {
    return a + b + c + d >>> 0;
  }

  utils$g.sum32_4 = sum32_4$2;

  function sum32_5$2(a, b, c, d, e) {
    return a + b + c + d + e >>> 0;
  }

  utils$g.sum32_5 = sum32_5$2;

  function sum64$1(buf, pos, ah, al) {
    var bh = buf[pos];
    var bl = buf[pos + 1];
    var lo = al + bl >>> 0;
    var hi = (lo < al ? 1 : 0) + ah + bh;
    buf[pos] = hi >>> 0;
    buf[pos + 1] = lo;
  }

  utils$g.sum64 = sum64$1;

  function sum64_hi$1(ah, al, bh, bl) {
    var lo = al + bl >>> 0;
    var hi = (lo < al ? 1 : 0) + ah + bh;
    return hi >>> 0;
  }

  utils$g.sum64_hi = sum64_hi$1;

  function sum64_lo$1(ah, al, bh, bl) {
    var lo = al + bl;
    return lo >>> 0;
  }

  utils$g.sum64_lo = sum64_lo$1;

  function sum64_4_hi$1(ah, al, bh, bl, ch, cl, dh, dl) {
    var carry = 0;
    var lo = al;
    lo = lo + bl >>> 0;
    carry += lo < al ? 1 : 0;
    lo = lo + cl >>> 0;
    carry += lo < cl ? 1 : 0;
    lo = lo + dl >>> 0;
    carry += lo < dl ? 1 : 0;
    var hi = ah + bh + ch + dh + carry;
    return hi >>> 0;
  }

  utils$g.sum64_4_hi = sum64_4_hi$1;

  function sum64_4_lo$1(ah, al, bh, bl, ch, cl, dh, dl) {
    var lo = al + bl + cl + dl;
    return lo >>> 0;
  }

  utils$g.sum64_4_lo = sum64_4_lo$1;

  function sum64_5_hi$1(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
    var carry = 0;
    var lo = al;
    lo = lo + bl >>> 0;
    carry += lo < al ? 1 : 0;
    lo = lo + cl >>> 0;
    carry += lo < cl ? 1 : 0;
    lo = lo + dl >>> 0;
    carry += lo < dl ? 1 : 0;
    lo = lo + el >>> 0;
    carry += lo < el ? 1 : 0;
    var hi = ah + bh + ch + dh + eh + carry;
    return hi >>> 0;
  }

  utils$g.sum64_5_hi = sum64_5_hi$1;

  function sum64_5_lo$1(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
    var lo = al + bl + cl + dl + el;
    return lo >>> 0;
  }

  utils$g.sum64_5_lo = sum64_5_lo$1;

  function rotr64_hi$1(ah, al, num) {
    var r = al << 32 - num | ah >>> num;
    return r >>> 0;
  }

  utils$g.rotr64_hi = rotr64_hi$1;

  function rotr64_lo$1(ah, al, num) {
    var r = ah << 32 - num | al >>> num;
    return r >>> 0;
  }

  utils$g.rotr64_lo = rotr64_lo$1;

  function shr64_hi$1(ah, al, num) {
    return ah >>> num;
  }

  utils$g.shr64_hi = shr64_hi$1;

  function shr64_lo$1(ah, al, num) {
    var r = ah << 32 - num | al >>> num;
    return r >>> 0;
  }

  utils$g.shr64_lo = shr64_lo$1;

  var common$5 = {};

  var utils$f = utils$g;
  var assert$a = minimalisticAssert;

  function BlockHash$4() {
    this.pending = null;
    this.pendingTotal = 0;
    this.blockSize = this.constructor.blockSize;
    this.outSize = this.constructor.outSize;
    this.hmacStrength = this.constructor.hmacStrength;
    this.padLength = this.constructor.padLength / 8;
    this.endian = 'big';
    this._delta8 = this.blockSize / 8;
    this._delta32 = this.blockSize / 32;
  }

  common$5.BlockHash = BlockHash$4;

  BlockHash$4.prototype.update = function update(msg, enc) {
    // Convert message to array, pad it, and join into 32bit blocks
    msg = utils$f.toArray(msg, enc);
    if (!this.pending) this.pending = msg;else this.pending = this.pending.concat(msg);
    this.pendingTotal += msg.length; // Enough data, try updating

    if (this.pending.length >= this._delta8) {
      msg = this.pending; // Process pending data in blocks

      var r = msg.length % this._delta8;
      this.pending = msg.slice(msg.length - r, msg.length);
      if (this.pending.length === 0) this.pending = null;
      msg = utils$f.join32(msg, 0, msg.length - r, this.endian);

      for (var i = 0; i < msg.length; i += this._delta32) this._update(msg, i, i + this._delta32);
    }

    return this;
  };

  BlockHash$4.prototype.digest = function digest(enc) {
    this.update(this._pad());
    assert$a(this.pending === null);
    return this._digest(enc);
  };

  BlockHash$4.prototype._pad = function pad() {
    var len = this.pendingTotal;
    var bytes = this._delta8;
    var k = bytes - (len + this.padLength) % bytes;
    var res = new Array(k + this.padLength);
    res[0] = 0x80;

    for (var i = 1; i < k; i++) res[i] = 0; // Append length


    len <<= 3;

    if (this.endian === 'big') {
      for (var t = 8; t < this.padLength; t++) res[i++] = 0;

      res[i++] = 0;
      res[i++] = 0;
      res[i++] = 0;
      res[i++] = 0;
      res[i++] = len >>> 24 & 0xff;
      res[i++] = len >>> 16 & 0xff;
      res[i++] = len >>> 8 & 0xff;
      res[i++] = len & 0xff;
    } else {
      res[i++] = len & 0xff;
      res[i++] = len >>> 8 & 0xff;
      res[i++] = len >>> 16 & 0xff;
      res[i++] = len >>> 24 & 0xff;
      res[i++] = 0;
      res[i++] = 0;
      res[i++] = 0;
      res[i++] = 0;

      for (t = 8; t < this.padLength; t++) res[i++] = 0;
    }

    return res;
  };

  var sha = {};

  var common$4 = {};

  var utils$e = utils$g;
  var rotr32 = utils$e.rotr32;

  function ft_1$1(s, x, y, z) {
    if (s === 0) return ch32$1(x, y, z);
    if (s === 1 || s === 3) return p32(x, y, z);
    if (s === 2) return maj32$1(x, y, z);
  }

  common$4.ft_1 = ft_1$1;

  function ch32$1(x, y, z) {
    return x & y ^ ~x & z;
  }

  common$4.ch32 = ch32$1;

  function maj32$1(x, y, z) {
    return x & y ^ x & z ^ y & z;
  }

  common$4.maj32 = maj32$1;

  function p32(x, y, z) {
    return x ^ y ^ z;
  }

  common$4.p32 = p32;

  function s0_256$1(x) {
    return rotr32(x, 2) ^ rotr32(x, 13) ^ rotr32(x, 22);
  }

  common$4.s0_256 = s0_256$1;

  function s1_256$1(x) {
    return rotr32(x, 6) ^ rotr32(x, 11) ^ rotr32(x, 25);
  }

  common$4.s1_256 = s1_256$1;

  function g0_256$1(x) {
    return rotr32(x, 7) ^ rotr32(x, 18) ^ x >>> 3;
  }

  common$4.g0_256 = g0_256$1;

  function g1_256$1(x) {
    return rotr32(x, 17) ^ rotr32(x, 19) ^ x >>> 10;
  }

  common$4.g1_256 = g1_256$1;

  var utils$d = utils$g;
  var common$3 = common$5;
  var shaCommon$1 = common$4;
  var rotl32$1 = utils$d.rotl32;
  var sum32$2 = utils$d.sum32;
  var sum32_5$1 = utils$d.sum32_5;
  var ft_1 = shaCommon$1.ft_1;
  var BlockHash$3 = common$3.BlockHash;
  var sha1_K = [0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xCA62C1D6];

  function SHA1() {
    if (!(this instanceof SHA1)) return new SHA1();
    BlockHash$3.call(this);
    this.h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
    this.W = new Array(80);
  }

  utils$d.inherits(SHA1, BlockHash$3);
  var _1 = SHA1;
  SHA1.blockSize = 512;
  SHA1.outSize = 160;
  SHA1.hmacStrength = 80;
  SHA1.padLength = 64;

  SHA1.prototype._update = function _update(msg, start) {
    var W = this.W;

    for (var i = 0; i < 16; i++) W[i] = msg[start + i];

    for (; i < W.length; i++) W[i] = rotl32$1(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

    var a = this.h[0];
    var b = this.h[1];
    var c = this.h[2];
    var d = this.h[3];
    var e = this.h[4];

    for (i = 0; i < W.length; i++) {
      var s = ~~(i / 20);
      var t = sum32_5$1(rotl32$1(a, 5), ft_1(s, b, c, d), e, W[i], sha1_K[s]);
      e = d;
      d = c;
      c = rotl32$1(b, 30);
      b = a;
      a = t;
    }

    this.h[0] = sum32$2(this.h[0], a);
    this.h[1] = sum32$2(this.h[1], b);
    this.h[2] = sum32$2(this.h[2], c);
    this.h[3] = sum32$2(this.h[3], d);
    this.h[4] = sum32$2(this.h[4], e);
  };

  SHA1.prototype._digest = function digest(enc) {
    if (enc === 'hex') return utils$d.toHex32(this.h, 'big');else return utils$d.split32(this.h, 'big');
  };

  var utils$c = utils$g;
  var common$2 = common$5;
  var shaCommon = common$4;
  var assert$9 = minimalisticAssert;
  var sum32$1 = utils$c.sum32;
  var sum32_4$1 = utils$c.sum32_4;
  var sum32_5 = utils$c.sum32_5;
  var ch32 = shaCommon.ch32;
  var maj32 = shaCommon.maj32;
  var s0_256 = shaCommon.s0_256;
  var s1_256 = shaCommon.s1_256;
  var g0_256 = shaCommon.g0_256;
  var g1_256 = shaCommon.g1_256;
  var BlockHash$2 = common$2.BlockHash;
  var sha256_K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];

  function SHA256$1() {
    if (!(this instanceof SHA256$1)) return new SHA256$1();
    BlockHash$2.call(this);
    this.h = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    this.k = sha256_K;
    this.W = new Array(64);
  }

  utils$c.inherits(SHA256$1, BlockHash$2);
  var _256 = SHA256$1;
  SHA256$1.blockSize = 512;
  SHA256$1.outSize = 256;
  SHA256$1.hmacStrength = 192;
  SHA256$1.padLength = 64;

  SHA256$1.prototype._update = function _update(msg, start) {
    var W = this.W;

    for (var i = 0; i < 16; i++) W[i] = msg[start + i];

    for (; i < W.length; i++) W[i] = sum32_4$1(g1_256(W[i - 2]), W[i - 7], g0_256(W[i - 15]), W[i - 16]);

    var a = this.h[0];
    var b = this.h[1];
    var c = this.h[2];
    var d = this.h[3];
    var e = this.h[4];
    var f = this.h[5];
    var g = this.h[6];
    var h = this.h[7];
    assert$9(this.k.length === W.length);

    for (i = 0; i < W.length; i++) {
      var T1 = sum32_5(h, s1_256(e), ch32(e, f, g), this.k[i], W[i]);
      var T2 = sum32$1(s0_256(a), maj32(a, b, c));
      h = g;
      g = f;
      f = e;
      e = sum32$1(d, T1);
      d = c;
      c = b;
      b = a;
      a = sum32$1(T1, T2);
    }

    this.h[0] = sum32$1(this.h[0], a);
    this.h[1] = sum32$1(this.h[1], b);
    this.h[2] = sum32$1(this.h[2], c);
    this.h[3] = sum32$1(this.h[3], d);
    this.h[4] = sum32$1(this.h[4], e);
    this.h[5] = sum32$1(this.h[5], f);
    this.h[6] = sum32$1(this.h[6], g);
    this.h[7] = sum32$1(this.h[7], h);
  };

  SHA256$1.prototype._digest = function digest(enc) {
    if (enc === 'hex') return utils$c.toHex32(this.h, 'big');else return utils$c.split32(this.h, 'big');
  };

  var utils$b = utils$g;
  var SHA256 = _256;

  function SHA224() {
    if (!(this instanceof SHA224)) return new SHA224();
    SHA256.call(this);
    this.h = [0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939, 0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4];
  }

  utils$b.inherits(SHA224, SHA256);
  var _224 = SHA224;
  SHA224.blockSize = 512;
  SHA224.outSize = 224;
  SHA224.hmacStrength = 192;
  SHA224.padLength = 64;

  SHA224.prototype._digest = function digest(enc) {
    // Just truncate output
    if (enc === 'hex') return utils$b.toHex32(this.h.slice(0, 7), 'big');else return utils$b.split32(this.h.slice(0, 7), 'big');
  };

  var utils$a = utils$g;
  var common$1 = common$5;
  var assert$8 = minimalisticAssert;
  var rotr64_hi = utils$a.rotr64_hi;
  var rotr64_lo = utils$a.rotr64_lo;
  var shr64_hi = utils$a.shr64_hi;
  var shr64_lo = utils$a.shr64_lo;
  var sum64 = utils$a.sum64;
  var sum64_hi = utils$a.sum64_hi;
  var sum64_lo = utils$a.sum64_lo;
  var sum64_4_hi = utils$a.sum64_4_hi;
  var sum64_4_lo = utils$a.sum64_4_lo;
  var sum64_5_hi = utils$a.sum64_5_hi;
  var sum64_5_lo = utils$a.sum64_5_lo;
  var BlockHash$1 = common$1.BlockHash;
  var sha512_K = [0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd, 0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc, 0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019, 0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118, 0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe, 0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2, 0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1, 0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694, 0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3, 0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65, 0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483, 0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5, 0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210, 0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4, 0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725, 0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70, 0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926, 0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df, 0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8, 0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b, 0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001, 0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30, 0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910, 0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8, 0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53, 0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8, 0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb, 0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3, 0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60, 0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec, 0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9, 0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b, 0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207, 0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178, 0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6, 0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b, 0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493, 0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c, 0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a, 0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817];

  function SHA512$1() {
    if (!(this instanceof SHA512$1)) return new SHA512$1();
    BlockHash$1.call(this);
    this.h = [0x6a09e667, 0xf3bcc908, 0xbb67ae85, 0x84caa73b, 0x3c6ef372, 0xfe94f82b, 0xa54ff53a, 0x5f1d36f1, 0x510e527f, 0xade682d1, 0x9b05688c, 0x2b3e6c1f, 0x1f83d9ab, 0xfb41bd6b, 0x5be0cd19, 0x137e2179];
    this.k = sha512_K;
    this.W = new Array(160);
  }

  utils$a.inherits(SHA512$1, BlockHash$1);
  var _512 = SHA512$1;
  SHA512$1.blockSize = 1024;
  SHA512$1.outSize = 512;
  SHA512$1.hmacStrength = 192;
  SHA512$1.padLength = 128;

  SHA512$1.prototype._prepareBlock = function _prepareBlock(msg, start) {
    var W = this.W; // 32 x 32bit words

    for (var i = 0; i < 32; i++) W[i] = msg[start + i];

    for (; i < W.length; i += 2) {
      var c0_hi = g1_512_hi(W[i - 4], W[i - 3]); // i - 2

      var c0_lo = g1_512_lo(W[i - 4], W[i - 3]);
      var c1_hi = W[i - 14]; // i - 7

      var c1_lo = W[i - 13];
      var c2_hi = g0_512_hi(W[i - 30], W[i - 29]); // i - 15

      var c2_lo = g0_512_lo(W[i - 30], W[i - 29]);
      var c3_hi = W[i - 32]; // i - 16

      var c3_lo = W[i - 31];
      W[i] = sum64_4_hi(c0_hi, c0_lo, c1_hi, c1_lo, c2_hi, c2_lo, c3_hi, c3_lo);
      W[i + 1] = sum64_4_lo(c0_hi, c0_lo, c1_hi, c1_lo, c2_hi, c2_lo, c3_hi, c3_lo);
    }
  };

  SHA512$1.prototype._update = function _update(msg, start) {
    this._prepareBlock(msg, start);

    var W = this.W;
    var ah = this.h[0];
    var al = this.h[1];
    var bh = this.h[2];
    var bl = this.h[3];
    var ch = this.h[4];
    var cl = this.h[5];
    var dh = this.h[6];
    var dl = this.h[7];
    var eh = this.h[8];
    var el = this.h[9];
    var fh = this.h[10];
    var fl = this.h[11];
    var gh = this.h[12];
    var gl = this.h[13];
    var hh = this.h[14];
    var hl = this.h[15];
    assert$8(this.k.length === W.length);

    for (var i = 0; i < W.length; i += 2) {
      var c0_hi = hh;
      var c0_lo = hl;
      var c1_hi = s1_512_hi(eh, el);
      var c1_lo = s1_512_lo(eh, el);
      var c2_hi = ch64_hi(eh, el, fh, fl, gh);
      var c2_lo = ch64_lo(eh, el, fh, fl, gh, gl);
      var c3_hi = this.k[i];
      var c3_lo = this.k[i + 1];
      var c4_hi = W[i];
      var c4_lo = W[i + 1];
      var T1_hi = sum64_5_hi(c0_hi, c0_lo, c1_hi, c1_lo, c2_hi, c2_lo, c3_hi, c3_lo, c4_hi, c4_lo);
      var T1_lo = sum64_5_lo(c0_hi, c0_lo, c1_hi, c1_lo, c2_hi, c2_lo, c3_hi, c3_lo, c4_hi, c4_lo);
      c0_hi = s0_512_hi(ah, al);
      c0_lo = s0_512_lo(ah, al);
      c1_hi = maj64_hi(ah, al, bh, bl, ch);
      c1_lo = maj64_lo(ah, al, bh, bl, ch, cl);
      var T2_hi = sum64_hi(c0_hi, c0_lo, c1_hi, c1_lo);
      var T2_lo = sum64_lo(c0_hi, c0_lo, c1_hi, c1_lo);
      hh = gh;
      hl = gl;
      gh = fh;
      gl = fl;
      fh = eh;
      fl = el;
      eh = sum64_hi(dh, dl, T1_hi, T1_lo);
      el = sum64_lo(dl, dl, T1_hi, T1_lo);
      dh = ch;
      dl = cl;
      ch = bh;
      cl = bl;
      bh = ah;
      bl = al;
      ah = sum64_hi(T1_hi, T1_lo, T2_hi, T2_lo);
      al = sum64_lo(T1_hi, T1_lo, T2_hi, T2_lo);
    }

    sum64(this.h, 0, ah, al);
    sum64(this.h, 2, bh, bl);
    sum64(this.h, 4, ch, cl);
    sum64(this.h, 6, dh, dl);
    sum64(this.h, 8, eh, el);
    sum64(this.h, 10, fh, fl);
    sum64(this.h, 12, gh, gl);
    sum64(this.h, 14, hh, hl);
  };

  SHA512$1.prototype._digest = function digest(enc) {
    if (enc === 'hex') return utils$a.toHex32(this.h, 'big');else return utils$a.split32(this.h, 'big');
  };

  function ch64_hi(xh, xl, yh, yl, zh) {
    var r = xh & yh ^ ~xh & zh;
    if (r < 0) r += 0x100000000;
    return r;
  }

  function ch64_lo(xh, xl, yh, yl, zh, zl) {
    var r = xl & yl ^ ~xl & zl;
    if (r < 0) r += 0x100000000;
    return r;
  }

  function maj64_hi(xh, xl, yh, yl, zh) {
    var r = xh & yh ^ xh & zh ^ yh & zh;
    if (r < 0) r += 0x100000000;
    return r;
  }

  function maj64_lo(xh, xl, yh, yl, zh, zl) {
    var r = xl & yl ^ xl & zl ^ yl & zl;
    if (r < 0) r += 0x100000000;
    return r;
  }

  function s0_512_hi(xh, xl) {
    var c0_hi = rotr64_hi(xh, xl, 28);
    var c1_hi = rotr64_hi(xl, xh, 2); // 34

    var c2_hi = rotr64_hi(xl, xh, 7); // 39

    var r = c0_hi ^ c1_hi ^ c2_hi;
    if (r < 0) r += 0x100000000;
    return r;
  }

  function s0_512_lo(xh, xl) {
    var c0_lo = rotr64_lo(xh, xl, 28);
    var c1_lo = rotr64_lo(xl, xh, 2); // 34

    var c2_lo = rotr64_lo(xl, xh, 7); // 39

    var r = c0_lo ^ c1_lo ^ c2_lo;
    if (r < 0) r += 0x100000000;
    return r;
  }

  function s1_512_hi(xh, xl) {
    var c0_hi = rotr64_hi(xh, xl, 14);
    var c1_hi = rotr64_hi(xh, xl, 18);
    var c2_hi = rotr64_hi(xl, xh, 9); // 41

    var r = c0_hi ^ c1_hi ^ c2_hi;
    if (r < 0) r += 0x100000000;
    return r;
  }

  function s1_512_lo(xh, xl) {
    var c0_lo = rotr64_lo(xh, xl, 14);
    var c1_lo = rotr64_lo(xh, xl, 18);
    var c2_lo = rotr64_lo(xl, xh, 9); // 41

    var r = c0_lo ^ c1_lo ^ c2_lo;
    if (r < 0) r += 0x100000000;
    return r;
  }

  function g0_512_hi(xh, xl) {
    var c0_hi = rotr64_hi(xh, xl, 1);
    var c1_hi = rotr64_hi(xh, xl, 8);
    var c2_hi = shr64_hi(xh, xl, 7);
    var r = c0_hi ^ c1_hi ^ c2_hi;
    if (r < 0) r += 0x100000000;
    return r;
  }

  function g0_512_lo(xh, xl) {
    var c0_lo = rotr64_lo(xh, xl, 1);
    var c1_lo = rotr64_lo(xh, xl, 8);
    var c2_lo = shr64_lo(xh, xl, 7);
    var r = c0_lo ^ c1_lo ^ c2_lo;
    if (r < 0) r += 0x100000000;
    return r;
  }

  function g1_512_hi(xh, xl) {
    var c0_hi = rotr64_hi(xh, xl, 19);
    var c1_hi = rotr64_hi(xl, xh, 29); // 61

    var c2_hi = shr64_hi(xh, xl, 6);
    var r = c0_hi ^ c1_hi ^ c2_hi;
    if (r < 0) r += 0x100000000;
    return r;
  }

  function g1_512_lo(xh, xl) {
    var c0_lo = rotr64_lo(xh, xl, 19);
    var c1_lo = rotr64_lo(xl, xh, 29); // 61

    var c2_lo = shr64_lo(xh, xl, 6);
    var r = c0_lo ^ c1_lo ^ c2_lo;
    if (r < 0) r += 0x100000000;
    return r;
  }

  var utils$9 = utils$g;
  var SHA512 = _512;

  function SHA384() {
    if (!(this instanceof SHA384)) return new SHA384();
    SHA512.call(this);
    this.h = [0xcbbb9d5d, 0xc1059ed8, 0x629a292a, 0x367cd507, 0x9159015a, 0x3070dd17, 0x152fecd8, 0xf70e5939, 0x67332667, 0xffc00b31, 0x8eb44a87, 0x68581511, 0xdb0c2e0d, 0x64f98fa7, 0x47b5481d, 0xbefa4fa4];
  }

  utils$9.inherits(SHA384, SHA512);
  var _384 = SHA384;
  SHA384.blockSize = 1024;
  SHA384.outSize = 384;
  SHA384.hmacStrength = 192;
  SHA384.padLength = 128;

  SHA384.prototype._digest = function digest(enc) {
    if (enc === 'hex') return utils$9.toHex32(this.h.slice(0, 12), 'big');else return utils$9.split32(this.h.slice(0, 12), 'big');
  };

  sha.sha1 = _1;
  sha.sha224 = _224;
  sha.sha256 = _256;
  sha.sha384 = _384;
  sha.sha512 = _512;

  var ripemd = {};

  var utils$8 = utils$g;
  var common = common$5;
  var rotl32 = utils$8.rotl32;
  var sum32 = utils$8.sum32;
  var sum32_3 = utils$8.sum32_3;
  var sum32_4 = utils$8.sum32_4;
  var BlockHash = common.BlockHash;

  function RIPEMD160() {
    if (!(this instanceof RIPEMD160)) return new RIPEMD160();
    BlockHash.call(this);
    this.h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
    this.endian = 'little';
  }

  utils$8.inherits(RIPEMD160, BlockHash);
  ripemd.ripemd160 = RIPEMD160;
  RIPEMD160.blockSize = 512;
  RIPEMD160.outSize = 160;
  RIPEMD160.hmacStrength = 192;
  RIPEMD160.padLength = 64;

  RIPEMD160.prototype._update = function update(msg, start) {
    var A = this.h[0];
    var B = this.h[1];
    var C = this.h[2];
    var D = this.h[3];
    var E = this.h[4];
    var Ah = A;
    var Bh = B;
    var Ch = C;
    var Dh = D;
    var Eh = E;

    for (var j = 0; j < 80; j++) {
      var T = sum32(rotl32(sum32_4(A, f(j, B, C, D), msg[r[j] + start], K(j)), s[j]), E);
      A = E;
      E = D;
      D = rotl32(C, 10);
      C = B;
      B = T;
      T = sum32(rotl32(sum32_4(Ah, f(79 - j, Bh, Ch, Dh), msg[rh[j] + start], Kh(j)), sh[j]), Eh);
      Ah = Eh;
      Eh = Dh;
      Dh = rotl32(Ch, 10);
      Ch = Bh;
      Bh = T;
    }

    T = sum32_3(this.h[1], C, Dh);
    this.h[1] = sum32_3(this.h[2], D, Eh);
    this.h[2] = sum32_3(this.h[3], E, Ah);
    this.h[3] = sum32_3(this.h[4], A, Bh);
    this.h[4] = sum32_3(this.h[0], B, Ch);
    this.h[0] = T;
  };

  RIPEMD160.prototype._digest = function digest(enc) {
    if (enc === 'hex') return utils$8.toHex32(this.h, 'little');else return utils$8.split32(this.h, 'little');
  };

  function f(j, x, y, z) {
    if (j <= 15) return x ^ y ^ z;else if (j <= 31) return x & y | ~x & z;else if (j <= 47) return (x | ~y) ^ z;else if (j <= 63) return x & z | y & ~z;else return x ^ (y | ~z);
  }

  function K(j) {
    if (j <= 15) return 0x00000000;else if (j <= 31) return 0x5a827999;else if (j <= 47) return 0x6ed9eba1;else if (j <= 63) return 0x8f1bbcdc;else return 0xa953fd4e;
  }

  function Kh(j) {
    if (j <= 15) return 0x50a28be6;else if (j <= 31) return 0x5c4dd124;else if (j <= 47) return 0x6d703ef3;else if (j <= 63) return 0x7a6d76e9;else return 0x00000000;
  }

  var r = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13];
  var rh = [5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11];
  var s = [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6];
  var sh = [8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11];

  var utils$7 = utils$g;
  var assert$7 = minimalisticAssert;

  function Hmac(hash, key, enc) {
    if (!(this instanceof Hmac)) return new Hmac(hash, key, enc);
    this.Hash = hash;
    this.blockSize = hash.blockSize / 8;
    this.outSize = hash.outSize / 8;
    this.inner = null;
    this.outer = null;

    this._init(utils$7.toArray(key, enc));
  }

  var hmac = Hmac;

  Hmac.prototype._init = function init(key) {
    // Shorten key, if needed
    if (key.length > this.blockSize) key = new this.Hash().update(key).digest();
    assert$7(key.length <= this.blockSize); // Add padding to key

    for (var i = key.length; i < this.blockSize; i++) key.push(0);

    for (i = 0; i < key.length; i++) key[i] ^= 0x36;

    this.inner = new this.Hash().update(key); // 0x36 ^ 0x5c = 0x6a

    for (i = 0; i < key.length; i++) key[i] ^= 0x6a;

    this.outer = new this.Hash().update(key);
  };

  Hmac.prototype.update = function update(msg, enc) {
    this.inner.update(msg, enc);
    return this;
  };

  Hmac.prototype.digest = function digest(enc) {
    this.outer.update(this.inner.digest());
    return this.outer.digest(enc);
  };

  (function (exports) {
    var hash = exports;
    hash.utils = utils$g;
    hash.common = common$5;
    hash.sha = sha;
    hash.ripemd = ripemd;
    hash.hmac = hmac; // Proxy hash functions to the main object

    hash.sha1 = hash.sha.sha1;
    hash.sha256 = hash.sha.sha256;
    hash.sha224 = hash.sha.sha224;
    hash.sha384 = hash.sha.sha384;
    hash.sha512 = hash.sha.sha512;
    hash.ripemd160 = hash.ripemd.ripemd160;
  })(hash$2);

  (function (exports) {

    var curves = exports;
    var hash = hash$2;
    var curve$1 = curve;
    var utils = utils$m;
    var assert = utils.assert;

    function PresetCurve(options) {
      if (options.type === 'short') this.curve = new curve$1.short(options);else if (options.type === 'edwards') this.curve = new curve$1.edwards(options);else this.curve = new curve$1.mont(options);
      this.g = this.curve.g;
      this.n = this.curve.n;
      this.hash = options.hash;
      assert(this.g.validate(), 'Invalid curve');
      assert(this.g.mul(this.n).isInfinity(), 'Invalid curve, G*N != O');
    }

    curves.PresetCurve = PresetCurve;

    function defineCurve(name, options) {
      Object.defineProperty(curves, name, {
        configurable: true,
        enumerable: true,
        get: function () {
          var curve = new PresetCurve(options);
          Object.defineProperty(curves, name, {
            configurable: true,
            enumerable: true,
            value: curve
          });
          return curve;
        }
      });
    }

    defineCurve('p192', {
      type: 'short',
      prime: 'p192',
      p: 'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff',
      a: 'ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc',
      b: '64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1',
      n: 'ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831',
      hash: hash.sha256,
      gRed: false,
      g: ['188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012', '07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811']
    });
    defineCurve('p224', {
      type: 'short',
      prime: 'p224',
      p: 'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001',
      a: 'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe',
      b: 'b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4',
      n: 'ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d',
      hash: hash.sha256,
      gRed: false,
      g: ['b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21', 'bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34']
    });
    defineCurve('p256', {
      type: 'short',
      prime: null,
      p: 'ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff',
      a: 'ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc',
      b: '5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b',
      n: 'ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551',
      hash: hash.sha256,
      gRed: false,
      g: ['6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296', '4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5']
    });
    defineCurve('p384', {
      type: 'short',
      prime: null,
      p: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' + 'fffffffe ffffffff 00000000 00000000 ffffffff',
      a: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' + 'fffffffe ffffffff 00000000 00000000 fffffffc',
      b: 'b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f ' + '5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef',
      n: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 ' + 'f4372ddf 581a0db2 48b0a77a ecec196a ccc52973',
      hash: hash.sha384,
      gRed: false,
      g: ['aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 ' + '5502f25d bf55296c 3a545e38 72760ab7', '3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 ' + '0a60b1ce 1d7e819d 7a431d7c 90ea0e5f']
    });
    defineCurve('p521', {
      type: 'short',
      prime: null,
      p: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ' + 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' + 'ffffffff ffffffff ffffffff ffffffff ffffffff',
      a: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ' + 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' + 'ffffffff ffffffff ffffffff ffffffff fffffffc',
      b: '00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b ' + '99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd ' + '3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00',
      n: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ' + 'ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 ' + 'f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409',
      hash: hash.sha512,
      gRed: false,
      g: ['000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 ' + '053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 ' + 'a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66', '00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 ' + '579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 ' + '3fad0761 353c7086 a272c240 88be9476 9fd16650']
    });
    defineCurve('curve25519', {
      type: 'mont',
      prime: 'p25519',
      p: '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed',
      a: '76d06',
      b: '1',
      n: '1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed',
      hash: hash.sha256,
      gRed: false,
      g: ['9']
    });
    defineCurve('ed25519', {
      type: 'edwards',
      prime: 'p25519',
      p: '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed',
      a: '-1',
      c: '1',
      // -121665 * (121666^(-1)) (mod P)
      d: '52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3',
      n: '1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed',
      hash: hash.sha256,
      gRed: false,
      g: ['216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a', // 4/5
      '6666666666666666666666666666666666666666666666666666666666666658']
    });
    var pre;

    try {
      pre = require('./precomputed/secp256k1');
    } catch (e) {
      pre = undefined;
    }

    defineCurve('secp256k1', {
      type: 'short',
      prime: 'k256',
      p: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f',
      a: '0',
      b: '7',
      n: 'ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141',
      h: '1',
      hash: hash.sha256,
      // Precomputed endomorphism
      beta: '7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee',
      lambda: '5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72',
      basis: [{
        a: '3086d221a7d46bcde86c90e49284eb15',
        b: '-e4437ed6010e88286f547fa90abfe4c3'
      }, {
        a: '114ca50f7a8e2f3f657c1108d9d44cfd8',
        b: '3086d221a7d46bcde86c90e49284eb15'
      }],
      gRed: false,
      g: ['79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798', '483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8', pre]
    });
  })(curves$2);

  var hash$1 = hash$2;
  var utils$6 = utils$l;
  var assert$6 = minimalisticAssert;

  function HmacDRBG$1(options) {
    if (!(this instanceof HmacDRBG$1)) return new HmacDRBG$1(options);
    this.hash = options.hash;
    this.predResist = !!options.predResist;
    this.outLen = this.hash.outSize;
    this.minEntropy = options.minEntropy || this.hash.hmacStrength;
    this._reseed = null;
    this.reseedInterval = null;
    this.K = null;
    this.V = null;
    var entropy = utils$6.toArray(options.entropy, options.entropyEnc || 'hex');
    var nonce = utils$6.toArray(options.nonce, options.nonceEnc || 'hex');
    var pers = utils$6.toArray(options.pers, options.persEnc || 'hex');
    assert$6(entropy.length >= this.minEntropy / 8, 'Not enough entropy. Minimum is: ' + this.minEntropy + ' bits');

    this._init(entropy, nonce, pers);
  }

  var hmacDrbg = HmacDRBG$1;

  HmacDRBG$1.prototype._init = function init(entropy, nonce, pers) {
    var seed = entropy.concat(nonce).concat(pers);
    this.K = new Array(this.outLen / 8);
    this.V = new Array(this.outLen / 8);

    for (var i = 0; i < this.V.length; i++) {
      this.K[i] = 0x00;
      this.V[i] = 0x01;
    }

    this._update(seed);

    this._reseed = 1;
    this.reseedInterval = 0x1000000000000; // 2^48
  };

  HmacDRBG$1.prototype._hmac = function hmac() {
    return new hash$1.hmac(this.hash, this.K);
  };

  HmacDRBG$1.prototype._update = function update(seed) {
    var kmac = this._hmac().update(this.V).update([0x00]);

    if (seed) kmac = kmac.update(seed);
    this.K = kmac.digest();
    this.V = this._hmac().update(this.V).digest();
    if (!seed) return;
    this.K = this._hmac().update(this.V).update([0x01]).update(seed).digest();
    this.V = this._hmac().update(this.V).digest();
  };

  HmacDRBG$1.prototype.reseed = function reseed(entropy, entropyEnc, add, addEnc) {
    // Optional entropy enc
    if (typeof entropyEnc !== 'string') {
      addEnc = add;
      add = entropyEnc;
      entropyEnc = null;
    }

    entropy = utils$6.toArray(entropy, entropyEnc);
    add = utils$6.toArray(add, addEnc);
    assert$6(entropy.length >= this.minEntropy / 8, 'Not enough entropy. Minimum is: ' + this.minEntropy + ' bits');

    this._update(entropy.concat(add || []));

    this._reseed = 1;
  };

  HmacDRBG$1.prototype.generate = function generate(len, enc, add, addEnc) {
    if (this._reseed > this.reseedInterval) throw new Error('Reseed is required'); // Optional encoding

    if (typeof enc !== 'string') {
      addEnc = add;
      add = enc;
      enc = null;
    } // Optional additional data


    if (add) {
      add = utils$6.toArray(add, addEnc || 'hex');

      this._update(add);
    }

    var temp = [];

    while (temp.length < len) {
      this.V = this._hmac().update(this.V).digest();
      temp = temp.concat(this.V);
    }

    var res = temp.slice(0, len);

    this._update(add);

    this._reseed++;
    return utils$6.encode(res, enc);
  };

  var BN$3 = bn.exports;
  var utils$5 = utils$m;
  var assert$5 = utils$5.assert;

  function KeyPair$3(ec, options) {
    this.ec = ec;
    this.priv = null;
    this.pub = null; // KeyPair(ec, { priv: ..., pub: ... })

    if (options.priv) this._importPrivate(options.priv, options.privEnc);
    if (options.pub) this._importPublic(options.pub, options.pubEnc);
  }

  var key$1 = KeyPair$3;

  KeyPair$3.fromPublic = function fromPublic(ec, pub, enc) {
    if (pub instanceof KeyPair$3) return pub;
    return new KeyPair$3(ec, {
      pub: pub,
      pubEnc: enc
    });
  };

  KeyPair$3.fromPrivate = function fromPrivate(ec, priv, enc) {
    if (priv instanceof KeyPair$3) return priv;
    return new KeyPair$3(ec, {
      priv: priv,
      privEnc: enc
    });
  };

  KeyPair$3.prototype.validate = function validate() {
    var pub = this.getPublic();
    if (pub.isInfinity()) return {
      result: false,
      reason: 'Invalid public key'
    };
    if (!pub.validate()) return {
      result: false,
      reason: 'Public key is not a point'
    };
    if (!pub.mul(this.ec.curve.n).isInfinity()) return {
      result: false,
      reason: 'Public key * N != O'
    };
    return {
      result: true,
      reason: null
    };
  };

  KeyPair$3.prototype.getPublic = function getPublic(compact, enc) {
    // compact is optional argument
    if (typeof compact === 'string') {
      enc = compact;
      compact = null;
    }

    if (!this.pub) this.pub = this.ec.g.mul(this.priv);
    if (!enc) return this.pub;
    return this.pub.encode(enc, compact);
  };

  KeyPair$3.prototype.getPrivate = function getPrivate(enc) {
    if (enc === 'hex') return this.priv.toString(16, 2);else return this.priv;
  };

  KeyPair$3.prototype._importPrivate = function _importPrivate(key, enc) {
    this.priv = new BN$3(key, enc || 16); // Ensure that the priv won't be bigger than n, otherwise we may fail
    // in fixed multiplication method

    this.priv = this.priv.umod(this.ec.curve.n);
  };

  KeyPair$3.prototype._importPublic = function _importPublic(key, enc) {
    if (key.x || key.y) {
      // Montgomery points only have an `x` coordinate.
      // Weierstrass/Edwards points on the other hand have both `x` and
      // `y` coordinates.
      if (this.ec.curve.type === 'mont') {
        assert$5(key.x, 'Need x coordinate');
      } else if (this.ec.curve.type === 'short' || this.ec.curve.type === 'edwards') {
        assert$5(key.x && key.y, 'Need both x and y coordinate');
      }

      this.pub = this.ec.curve.point(key.x, key.y);
      return;
    }

    this.pub = this.ec.curve.decodePoint(key, enc);
  }; // ECDH


  KeyPair$3.prototype.derive = function derive(pub) {
    if (!pub.validate()) {
      assert$5(pub.validate(), 'public point not validated');
    }

    return pub.mul(this.priv).getX();
  }; // ECDSA


  KeyPair$3.prototype.sign = function sign(msg, enc, options) {
    return this.ec.sign(msg, this, enc, options);
  };

  KeyPair$3.prototype.verify = function verify(msg, signature) {
    return this.ec.verify(msg, signature, this);
  };

  KeyPair$3.prototype.inspect = function inspect() {
    return '<Key priv: ' + (this.priv && this.priv.toString(16, 2)) + ' pub: ' + (this.pub && this.pub.inspect()) + ' >';
  };

  var BN$2 = bn.exports;
  var utils$4 = utils$m;
  var assert$4 = utils$4.assert;

  function Signature$3(options, enc) {
    if (options instanceof Signature$3) return options;
    if (this._importDER(options, enc)) return;
    assert$4(options.r && options.s, 'Signature without r or s');
    this.r = new BN$2(options.r, 16);
    this.s = new BN$2(options.s, 16);
    if (options.recoveryParam === undefined) this.recoveryParam = null;else this.recoveryParam = options.recoveryParam;
  }

  var signature$1 = Signature$3;

  function Position() {
    this.place = 0;
  }

  function getLength(buf, p) {
    var initial = buf[p.place++];

    if (!(initial & 0x80)) {
      return initial;
    }

    var octetLen = initial & 0xf; // Indefinite length or overflow

    if (octetLen === 0 || octetLen > 4) {
      return false;
    }

    var val = 0;

    for (var i = 0, off = p.place; i < octetLen; i++, off++) {
      val <<= 8;
      val |= buf[off];
      val >>>= 0;
    } // Leading zeroes


    if (val <= 0x7f) {
      return false;
    }

    p.place = off;
    return val;
  }

  function rmPadding(buf) {
    var i = 0;
    var len = buf.length - 1;

    while (!buf[i] && !(buf[i + 1] & 0x80) && i < len) {
      i++;
    }

    if (i === 0) {
      return buf;
    }

    return buf.slice(i);
  }

  Signature$3.prototype._importDER = function _importDER(data, enc) {
    data = utils$4.toArray(data, enc);
    var p = new Position();

    if (data[p.place++] !== 0x30) {
      return false;
    }

    var len = getLength(data, p);

    if (len === false) {
      return false;
    }

    if (len + p.place !== data.length) {
      return false;
    }

    if (data[p.place++] !== 0x02) {
      return false;
    }

    var rlen = getLength(data, p);

    if (rlen === false) {
      return false;
    }

    var r = data.slice(p.place, rlen + p.place);
    p.place += rlen;

    if (data[p.place++] !== 0x02) {
      return false;
    }

    var slen = getLength(data, p);

    if (slen === false) {
      return false;
    }

    if (data.length !== slen + p.place) {
      return false;
    }

    var s = data.slice(p.place, slen + p.place);

    if (r[0] === 0) {
      if (r[1] & 0x80) {
        r = r.slice(1);
      } else {
        // Leading zeroes
        return false;
      }
    }

    if (s[0] === 0) {
      if (s[1] & 0x80) {
        s = s.slice(1);
      } else {
        // Leading zeroes
        return false;
      }
    }

    this.r = new BN$2(r);
    this.s = new BN$2(s);
    this.recoveryParam = null;
    return true;
  };

  function constructLength(arr, len) {
    if (len < 0x80) {
      arr.push(len);
      return;
    }

    var octets = 1 + (Math.log(len) / Math.LN2 >>> 3);
    arr.push(octets | 0x80);

    while (--octets) {
      arr.push(len >>> (octets << 3) & 0xff);
    }

    arr.push(len);
  }

  Signature$3.prototype.toDER = function toDER(enc) {
    var r = this.r.toArray();
    var s = this.s.toArray(); // Pad values

    if (r[0] & 0x80) r = [0].concat(r); // Pad values

    if (s[0] & 0x80) s = [0].concat(s);
    r = rmPadding(r);
    s = rmPadding(s);

    while (!s[0] && !(s[1] & 0x80)) {
      s = s.slice(1);
    }

    var arr = [0x02];
    constructLength(arr, r.length);
    arr = arr.concat(r);
    arr.push(0x02);
    constructLength(arr, s.length);
    var backHalf = arr.concat(s);
    var res = [0x30];
    constructLength(res, backHalf.length);
    res = res.concat(backHalf);
    return utils$4.encode(res, enc);
  };

  var BN$1 = bn.exports;
  var HmacDRBG = hmacDrbg;
  var utils$3 = utils$m;
  var curves$1 = curves$2;
  var rand = brorand.exports;
  var assert$3 = utils$3.assert;
  var KeyPair$2 = key$1;
  var Signature$2 = signature$1;

  function EC(options) {
    if (!(this instanceof EC)) return new EC(options); // Shortcut `elliptic.ec(curve-name)`

    if (typeof options === 'string') {
      assert$3(Object.prototype.hasOwnProperty.call(curves$1, options), 'Unknown curve ' + options);
      options = curves$1[options];
    } // Shortcut for `elliptic.ec(elliptic.curves.curveName)`


    if (options instanceof curves$1.PresetCurve) options = {
      curve: options
    };
    this.curve = options.curve.curve;
    this.n = this.curve.n;
    this.nh = this.n.ushrn(1);
    this.g = this.curve.g; // Point on curve

    this.g = options.curve.g;
    this.g.precompute(options.curve.n.bitLength() + 1); // Hash for function for DRBG

    this.hash = options.hash || options.curve.hash;
  }

  var ec = EC;

  EC.prototype.keyPair = function keyPair(options) {
    return new KeyPair$2(this, options);
  };

  EC.prototype.keyFromPrivate = function keyFromPrivate(priv, enc) {
    return KeyPair$2.fromPrivate(this, priv, enc);
  };

  EC.prototype.keyFromPublic = function keyFromPublic(pub, enc) {
    return KeyPair$2.fromPublic(this, pub, enc);
  };

  EC.prototype.genKeyPair = function genKeyPair(options) {
    if (!options) options = {}; // Instantiate Hmac_DRBG

    var drbg = new HmacDRBG({
      hash: this.hash,
      pers: options.pers,
      persEnc: options.persEnc || 'utf8',
      entropy: options.entropy || rand(this.hash.hmacStrength),
      entropyEnc: options.entropy && options.entropyEnc || 'utf8',
      nonce: this.n.toArray()
    });
    var bytes = this.n.byteLength();
    var ns2 = this.n.sub(new BN$1(2));

    for (;;) {
      var priv = new BN$1(drbg.generate(bytes));
      if (priv.cmp(ns2) > 0) continue;
      priv.iaddn(1);
      return this.keyFromPrivate(priv);
    }
  };

  EC.prototype._truncateToN = function _truncateToN(msg, truncOnly) {
    var delta = msg.byteLength() * 8 - this.n.bitLength();
    if (delta > 0) msg = msg.ushrn(delta);
    if (!truncOnly && msg.cmp(this.n) >= 0) return msg.sub(this.n);else return msg;
  };

  EC.prototype.sign = function sign(msg, key, enc, options) {
    if (typeof enc === 'object') {
      options = enc;
      enc = null;
    }

    if (!options) options = {};
    key = this.keyFromPrivate(key, enc);
    msg = this._truncateToN(new BN$1(msg, 16)); // Zero-extend key to provide enough entropy

    var bytes = this.n.byteLength();
    var bkey = key.getPrivate().toArray('be', bytes); // Zero-extend nonce to have the same byte size as N

    var nonce = msg.toArray('be', bytes); // Instantiate Hmac_DRBG

    var drbg = new HmacDRBG({
      hash: this.hash,
      entropy: bkey,
      nonce: nonce,
      pers: options.pers,
      persEnc: options.persEnc || 'utf8'
    }); // Number of bytes to generate

    var ns1 = this.n.sub(new BN$1(1));

    for (var iter = 0;; iter++) {
      var k = options.k ? options.k(iter) : new BN$1(drbg.generate(this.n.byteLength()));
      k = this._truncateToN(k, true);
      if (k.cmpn(1) <= 0 || k.cmp(ns1) >= 0) continue;
      var kp = this.g.mul(k);
      if (kp.isInfinity()) continue;
      var kpX = kp.getX();
      var r = kpX.umod(this.n);
      if (r.cmpn(0) === 0) continue;
      var s = k.invm(this.n).mul(r.mul(key.getPrivate()).iadd(msg));
      s = s.umod(this.n);
      if (s.cmpn(0) === 0) continue;
      var recoveryParam = (kp.getY().isOdd() ? 1 : 0) | (kpX.cmp(r) !== 0 ? 2 : 0); // Use complement of `s`, if it is > `n / 2`

      if (options.canonical && s.cmp(this.nh) > 0) {
        s = this.n.sub(s);
        recoveryParam ^= 1;
      }

      return new Signature$2({
        r: r,
        s: s,
        recoveryParam: recoveryParam
      });
    }
  };

  EC.prototype.verify = function verify(msg, signature, key, enc) {
    msg = this._truncateToN(new BN$1(msg, 16));
    key = this.keyFromPublic(key, enc);
    signature = new Signature$2(signature, 'hex'); // Perform primitive values validation

    var r = signature.r;
    var s = signature.s;
    if (r.cmpn(1) < 0 || r.cmp(this.n) >= 0) return false;
    if (s.cmpn(1) < 0 || s.cmp(this.n) >= 0) return false; // Validate signature

    var sinv = s.invm(this.n);
    var u1 = sinv.mul(msg).umod(this.n);
    var u2 = sinv.mul(r).umod(this.n);
    var p;

    if (!this.curve._maxwellTrick) {
      p = this.g.mulAdd(u1, key.getPublic(), u2);
      if (p.isInfinity()) return false;
      return p.getX().umod(this.n).cmp(r) === 0;
    } // NOTE: Greg Maxwell's trick, inspired by:
    // https://git.io/vad3K


    p = this.g.jmulAdd(u1, key.getPublic(), u2);
    if (p.isInfinity()) return false; // Compare `p.x` of Jacobian point with `r`,
    // this will do `p.x == r * p.z^2` instead of multiplying `p.x` by the
    // inverse of `p.z^2`

    return p.eqXToP(r);
  };

  EC.prototype.recoverPubKey = function (msg, signature, j, enc) {
    assert$3((3 & j) === j, 'The recovery param is more than two bits');
    signature = new Signature$2(signature, enc);
    var n = this.n;
    var e = new BN$1(msg);
    var r = signature.r;
    var s = signature.s; // A set LSB signifies that the y-coordinate is odd

    var isYOdd = j & 1;
    var isSecondKey = j >> 1;
    if (r.cmp(this.curve.p.umod(this.curve.n)) >= 0 && isSecondKey) throw new Error('Unable to find sencond key candinate'); // 1.1. Let x = r + jn.

    if (isSecondKey) r = this.curve.pointFromX(r.add(this.curve.n), isYOdd);else r = this.curve.pointFromX(r, isYOdd);
    var rInv = signature.r.invm(n);
    var s1 = n.sub(e).mul(rInv).umod(n);
    var s2 = s.mul(rInv).umod(n); // 1.6.1 Compute Q = r^-1 (sR -  eG)
    //               Q = r^-1 (sR + -eG)

    return this.g.mulAdd(s1, r, s2);
  };

  EC.prototype.getKeyRecoveryParam = function (e, signature, Q, enc) {
    signature = new Signature$2(signature, enc);
    if (signature.recoveryParam !== null) return signature.recoveryParam;

    for (var i = 0; i < 4; i++) {
      var Qprime;

      try {
        Qprime = this.recoverPubKey(e, signature, i);
      } catch (e) {
        continue;
      }

      if (Qprime.eq(Q)) return i;
    }

    throw new Error('Unable to find valid recovery factor');
  };

  var utils$2 = utils$m;
  var assert$2 = utils$2.assert;
  var parseBytes$2 = utils$2.parseBytes;
  var cachedProperty$1 = utils$2.cachedProperty;
  /**
  * @param {EDDSA} eddsa - instance
  * @param {Object} params - public/private key parameters
  *
  * @param {Array<Byte>} [params.secret] - secret seed bytes
  * @param {Point} [params.pub] - public key point (aka `A` in eddsa terms)
  * @param {Array<Byte>} [params.pub] - public key point encoded as bytes
  *
  */

  function KeyPair$1(eddsa, params) {
    this.eddsa = eddsa;
    this._secret = parseBytes$2(params.secret);
    if (eddsa.isPoint(params.pub)) this._pub = params.pub;else this._pubBytes = parseBytes$2(params.pub);
  }

  KeyPair$1.fromPublic = function fromPublic(eddsa, pub) {
    if (pub instanceof KeyPair$1) return pub;
    return new KeyPair$1(eddsa, {
      pub: pub
    });
  };

  KeyPair$1.fromSecret = function fromSecret(eddsa, secret) {
    if (secret instanceof KeyPair$1) return secret;
    return new KeyPair$1(eddsa, {
      secret: secret
    });
  };

  KeyPair$1.prototype.secret = function secret() {
    return this._secret;
  };

  cachedProperty$1(KeyPair$1, 'pubBytes', function pubBytes() {
    return this.eddsa.encodePoint(this.pub());
  });
  cachedProperty$1(KeyPair$1, 'pub', function pub() {
    if (this._pubBytes) return this.eddsa.decodePoint(this._pubBytes);
    return this.eddsa.g.mul(this.priv());
  });
  cachedProperty$1(KeyPair$1, 'privBytes', function privBytes() {
    var eddsa = this.eddsa;
    var hash = this.hash();
    var lastIx = eddsa.encodingLength - 1;
    var a = hash.slice(0, eddsa.encodingLength);
    a[0] &= 248;
    a[lastIx] &= 127;
    a[lastIx] |= 64;
    return a;
  });
  cachedProperty$1(KeyPair$1, 'priv', function priv() {
    return this.eddsa.decodeInt(this.privBytes());
  });
  cachedProperty$1(KeyPair$1, 'hash', function hash() {
    return this.eddsa.hash().update(this.secret()).digest();
  });
  cachedProperty$1(KeyPair$1, 'messagePrefix', function messagePrefix() {
    return this.hash().slice(this.eddsa.encodingLength);
  });

  KeyPair$1.prototype.sign = function sign(message) {
    assert$2(this._secret, 'KeyPair can only verify');
    return this.eddsa.sign(message, this);
  };

  KeyPair$1.prototype.verify = function verify(message, sig) {
    return this.eddsa.verify(message, sig, this);
  };

  KeyPair$1.prototype.getSecret = function getSecret(enc) {
    assert$2(this._secret, 'KeyPair is public only');
    return utils$2.encode(this.secret(), enc);
  };

  KeyPair$1.prototype.getPublic = function getPublic(enc) {
    return utils$2.encode(this.pubBytes(), enc);
  };

  var key = KeyPair$1;

  var BN = bn.exports;
  var utils$1 = utils$m;
  var assert$1 = utils$1.assert;
  var cachedProperty = utils$1.cachedProperty;
  var parseBytes$1 = utils$1.parseBytes;
  /**
  * @param {EDDSA} eddsa - eddsa instance
  * @param {Array<Bytes>|Object} sig -
  * @param {Array<Bytes>|Point} [sig.R] - R point as Point or bytes
  * @param {Array<Bytes>|bn} [sig.S] - S scalar as bn or bytes
  * @param {Array<Bytes>} [sig.Rencoded] - R point encoded
  * @param {Array<Bytes>} [sig.Sencoded] - S scalar encoded
  */

  function Signature$1(eddsa, sig) {
    this.eddsa = eddsa;
    if (typeof sig !== 'object') sig = parseBytes$1(sig);

    if (Array.isArray(sig)) {
      sig = {
        R: sig.slice(0, eddsa.encodingLength),
        S: sig.slice(eddsa.encodingLength)
      };
    }

    assert$1(sig.R && sig.S, 'Signature without R or S');
    if (eddsa.isPoint(sig.R)) this._R = sig.R;
    if (sig.S instanceof BN) this._S = sig.S;
    this._Rencoded = Array.isArray(sig.R) ? sig.R : sig.Rencoded;
    this._Sencoded = Array.isArray(sig.S) ? sig.S : sig.Sencoded;
  }

  cachedProperty(Signature$1, 'S', function S() {
    return this.eddsa.decodeInt(this.Sencoded());
  });
  cachedProperty(Signature$1, 'R', function R() {
    return this.eddsa.decodePoint(this.Rencoded());
  });
  cachedProperty(Signature$1, 'Rencoded', function Rencoded() {
    return this.eddsa.encodePoint(this.R());
  });
  cachedProperty(Signature$1, 'Sencoded', function Sencoded() {
    return this.eddsa.encodeInt(this.S());
  });

  Signature$1.prototype.toBytes = function toBytes() {
    return this.Rencoded().concat(this.Sencoded());
  };

  Signature$1.prototype.toHex = function toHex() {
    return utils$1.encode(this.toBytes(), 'hex').toUpperCase();
  };

  var signature = Signature$1;

  var hash = hash$2;
  var curves = curves$2;
  var utils = utils$m;
  var assert = utils.assert;
  var parseBytes = utils.parseBytes;
  var KeyPair = key;
  var Signature = signature;

  function EDDSA(curve) {
    assert(curve === 'ed25519', 'only tested with ed25519 so far');
    if (!(this instanceof EDDSA)) return new EDDSA(curve);
    curve = curves[curve].curve;
    this.curve = curve;
    this.g = curve.g;
    this.g.precompute(curve.n.bitLength() + 1);
    this.pointClass = curve.point().constructor;
    this.encodingLength = Math.ceil(curve.n.bitLength() / 8);
    this.hash = hash.sha512;
  }

  var eddsa = EDDSA;
  /**
  * @param {Array|String} message - message bytes
  * @param {Array|String|KeyPair} secret - secret bytes or a keypair
  * @returns {Signature} - signature
  */

  EDDSA.prototype.sign = function sign(message, secret) {
    message = parseBytes(message);
    var key = this.keyFromSecret(secret);
    var r = this.hashInt(key.messagePrefix(), message);
    var R = this.g.mul(r);
    var Rencoded = this.encodePoint(R);
    var s_ = this.hashInt(Rencoded, key.pubBytes(), message).mul(key.priv());
    var S = r.add(s_).umod(this.curve.n);
    return this.makeSignature({
      R: R,
      S: S,
      Rencoded: Rencoded
    });
  };
  /**
  * @param {Array} message - message bytes
  * @param {Array|String|Signature} sig - sig bytes
  * @param {Array|String|Point|KeyPair} pub - public key
  * @returns {Boolean} - true if public key matches sig of message
  */


  EDDSA.prototype.verify = function verify(message, sig, pub) {
    message = parseBytes(message);
    sig = this.makeSignature(sig);
    var key = this.keyFromPublic(pub);
    var h = this.hashInt(sig.Rencoded(), key.pubBytes(), message);
    var SG = this.g.mul(sig.S());
    var RplusAh = sig.R().add(key.pub().mul(h));
    return RplusAh.eq(SG);
  };

  EDDSA.prototype.hashInt = function hashInt() {
    var hash = this.hash();

    for (var i = 0; i < arguments.length; i++) hash.update(arguments[i]);

    return utils.intFromLE(hash.digest()).umod(this.curve.n);
  };

  EDDSA.prototype.keyFromPublic = function keyFromPublic(pub) {
    return KeyPair.fromPublic(this, pub);
  };

  EDDSA.prototype.keyFromSecret = function keyFromSecret(secret) {
    return KeyPair.fromSecret(this, secret);
  };

  EDDSA.prototype.makeSignature = function makeSignature(sig) {
    if (sig instanceof Signature) return sig;
    return new Signature(this, sig);
  };
  /**
  * * https://tools.ietf.org/html/draft-josefsson-eddsa-ed25519-03#section-5.2
  *
  * EDDSA defines methods for encoding and decoding points and integers. These are
  * helper convenience methods, that pass along to utility functions implied
  * parameters.
  *
  */


  EDDSA.prototype.encodePoint = function encodePoint(point) {
    var enc = point.getY().toArray('le', this.encodingLength);
    enc[this.encodingLength - 1] |= point.getX().isOdd() ? 0x80 : 0;
    return enc;
  };

  EDDSA.prototype.decodePoint = function decodePoint(bytes) {
    bytes = utils.parseBytes(bytes);
    var lastIx = bytes.length - 1;
    var normed = bytes.slice(0, lastIx).concat(bytes[lastIx] & ~0x80);
    var xIsOdd = (bytes[lastIx] & 0x80) !== 0;
    var y = utils.intFromLE(normed);
    return this.curve.pointFromY(y, xIsOdd);
  };

  EDDSA.prototype.encodeInt = function encodeInt(num) {
    return num.toArray('le', this.encodingLength);
  };

  EDDSA.prototype.decodeInt = function decodeInt(bytes) {
    return utils.intFromLE(bytes);
  };

  EDDSA.prototype.isPoint = function isPoint(val) {
    return val instanceof this.pointClass;
  };

  (function (exports) {

    var elliptic = exports;
    elliptic.version = require$$0.version;
    elliptic.utils = utils$m;
    elliptic.rand = brorand.exports;
    elliptic.curve = curve;
    elliptic.curves = curves$2; // Protocols

    elliptic.ec = ec;
    elliptic.eddsa = eddsa;
  })(elliptic);

  var _a, _b;

  var Prefix;

  (function (Prefix) {
    Prefix["TZ1"] = "tz1";
    Prefix["TZ2"] = "tz2";
    Prefix["TZ3"] = "tz3";
    Prefix["KT"] = "KT";
    Prefix["KT1"] = "KT1";
    Prefix["EDSK2"] = "edsk2";
    Prefix["SPSK"] = "spsk";
    Prefix["P2SK"] = "p2sk";
    Prefix["EDPK"] = "edpk";
    Prefix["SPPK"] = "sppk";
    Prefix["P2PK"] = "p2pk";
    Prefix["EDESK"] = "edesk";
    Prefix["SPESK"] = "spesk";
    Prefix["P2ESK"] = "p2esk";
    Prefix["EDSK"] = "edsk";
    Prefix["EDSIG"] = "edsig";
    Prefix["SPSIG"] = "spsig";
    Prefix["P2SIG"] = "p2sig";
    Prefix["SIG"] = "sig";
    Prefix["NET"] = "Net";
    Prefix["NCE"] = "nce";
    Prefix["B"] = "b";
    Prefix["O"] = "o";
    Prefix["LO"] = "Lo";
    Prefix["LLO"] = "LLo";
    Prefix["P"] = "P";
    Prefix["CO"] = "Co";
    Prefix["ID"] = "id";
    Prefix["EXPR"] = "expr";
    Prefix["TZ"] = "TZ";
  })(Prefix || (Prefix = {}));

  var prefix = (_a = {}, _a[Prefix.TZ1] = new Uint8Array([6, 161, 159]), _a[Prefix.TZ2] = new Uint8Array([6, 161, 161]), _a[Prefix.TZ3] = new Uint8Array([6, 161, 164]), _a[Prefix.KT] = new Uint8Array([2, 90, 121]), _a[Prefix.KT1] = new Uint8Array([2, 90, 121]), _a[Prefix.EDSK] = new Uint8Array([43, 246, 78, 7]), _a[Prefix.EDSK2] = new Uint8Array([13, 15, 58, 7]), _a[Prefix.SPSK] = new Uint8Array([17, 162, 224, 201]), _a[Prefix.P2SK] = new Uint8Array([16, 81, 238, 189]), _a[Prefix.EDPK] = new Uint8Array([13, 15, 37, 217]), _a[Prefix.SPPK] = new Uint8Array([3, 254, 226, 86]), _a[Prefix.P2PK] = new Uint8Array([3, 178, 139, 127]), _a[Prefix.EDESK] = new Uint8Array([7, 90, 60, 179, 41]), _a[Prefix.SPESK] = new Uint8Array([0x09, 0xed, 0xf1, 0xae, 0x96]), _a[Prefix.P2ESK] = new Uint8Array([0x09, 0x30, 0x39, 0x73, 0xab]), _a[Prefix.EDSIG] = new Uint8Array([9, 245, 205, 134, 18]), _a[Prefix.SPSIG] = new Uint8Array([13, 115, 101, 19, 63]), _a[Prefix.P2SIG] = new Uint8Array([54, 240, 44, 52]), _a[Prefix.SIG] = new Uint8Array([4, 130, 43]), _a[Prefix.NET] = new Uint8Array([87, 82, 0]), _a[Prefix.NCE] = new Uint8Array([69, 220, 169]), _a[Prefix.B] = new Uint8Array([1, 52]), _a[Prefix.O] = new Uint8Array([5, 116]), _a[Prefix.LO] = new Uint8Array([133, 233]), _a[Prefix.LLO] = new Uint8Array([29, 159, 109]), _a[Prefix.P] = new Uint8Array([2, 170]), _a[Prefix.CO] = new Uint8Array([79, 179]), _a[Prefix.ID] = new Uint8Array([153, 103]), _a[Prefix.EXPR] = new Uint8Array([13, 44, 64, 27]), // Legacy prefix
  _a[Prefix.TZ] = new Uint8Array([2, 90, 121]), _a);
  (_b = {}, _b[Prefix.TZ1] = 20, _b[Prefix.TZ2] = 20, _b[Prefix.TZ3] = 20, _b[Prefix.KT] = 20, _b[Prefix.KT1] = 20, _b[Prefix.EDPK] = 32, _b[Prefix.SPPK] = 33, _b[Prefix.P2PK] = 33, _b[Prefix.EDSIG] = 64, _b[Prefix.SPSIG] = 64, _b[Prefix.P2SIG] = 64, _b[Prefix.SIG] = 64, _b[Prefix.NET] = 4, _b[Prefix.B] = 32, _b[Prefix.P] = 32, _b[Prefix.O] = 32, _b);

  require('bs58check');

  var ValidationResult;

  (function (ValidationResult) {
    ValidationResult[ValidationResult["NO_PREFIX_MATCHED"] = 0] = "NO_PREFIX_MATCHED";
    ValidationResult[ValidationResult["INVALID_CHECKSUM"] = 1] = "INVALID_CHECKSUM";
    ValidationResult[ValidationResult["INVALID_LENGTH"] = 2] = "INVALID_LENGTH";
    ValidationResult[ValidationResult["VALID"] = 3] = "VALID";
  })(ValidationResult || (ValidationResult = {}));

  [Prefix.TZ1, Prefix.TZ2, Prefix.TZ3];
  [Prefix.KT1];
  [Prefix.EDSIG, Prefix.P2SIG, Prefix.SPSIG, Prefix.SIG];
  [Prefix.EDPK, Prefix.SPPK, Prefix.P2PK];
  /* tslint:enable */

  /**
   * @packageDocumentation
   * @module @taquito/utils
   */

  require('blakejs');

  var bs58check = require('bs58check');
  /**
   *
   * @description Base58 encode a string or a Uint8Array and append a prefix to it
   *
   * @param value Value to base58 encode
   * @param prefix prefix to append to the encoded string
   */


  function b58cencode(value, prefix) {
    var payloadAr = typeof value === 'string' ? Uint8Array.from(buffer.Buffer.from(value, 'hex')) : value;
    var n = new Uint8Array(prefix.length + payloadAr.length);
    n.set(prefix);
    n.set(payloadAr, prefix.length);
    return bs58check.encode(buffer.Buffer.from(n.buffer));
  }

  const isBase64UrlFormatSupported = buffer.Buffer.isEncoding('base64url');
  const decode = function (base64String) {
    let format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'base64';
    if (format !== 'base64' && format !== 'base64url') return '';

    if (!isBase64UrlFormatSupported) {
      format = 'base64';
      base64String = base64UrlPreprocessor.prepareValueForDecoding(base64String);
    }

    return buffer.Buffer.from(base64String, format).toString('utf8');
  };
  const encode = function (value) {
    let format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'base64';
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
  const stringToBytes = value => buffer.Buffer.from(value, 'utf8').toString('hex');
  const tokensAmountToNat = (tokensAmount, decimals) => {
    return new BigNumber(tokensAmount).multipliedBy(10 ** decimals).integerValue();
  };
  const tezToMutez = tez => tokensAmountToNat(tez, 6);

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


  const memoize = function (func) {
    let equalityCheck = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultEqualityCheck;
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

  const stringPad = function (string, isStart, maxLength) {
    let fillString = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ' ';
    if (String.prototype.padStart !== undefined) return string.padStart(maxLength, fillString);
    const stringLength = string.length; // eslint-disable-next-line eqeqeq

    if (maxLength <= stringLength || fillString == '') return string;
    const fillLength = maxLength - stringLength;
    let filler = fillString.repeat(Math.ceil(fillLength / fillString.length));
    if (filler.length > fillLength) filler = filler.slice(0, fillLength);
    return isStart ? filler + string : string + filler;
  };

  const padStart = function (string, maxLength) {
    let fillString = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ' ';
    return String.prototype.padStart !== undefined ? string.padStart(maxLength, fillString) : stringPad(string, true, maxLength, fillString);
  };

  var IconId;

  (function (IconId) {
    IconId[IconId["Common"] = 0] = "Common";
    IconId[IconId["Email"] = 1] = "Email";
    IconId[IconId["Telegram"] = 2] = "Telegram";
    IconId[IconId["Facebook"] = 3] = "Facebook";
    IconId[IconId["Twitter"] = 4] = "Twitter";
    IconId[IconId["Instagram"] = 5] = "Instagram";
    IconId[IconId["GitHub"] = 6] = "GitHub";
    IconId[IconId["Reddit"] = 7] = "Reddit";
  })(IconId || (IconId = {}));

  const getInvalidLinkInfo = link => ({
    rawLink: link,
    formattedLink: '#',
    displayLink: 'Invalid Link',
    icon: IconId.Common
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

  const telegramLinkInfoProvider = link => socialMediaLinkInfoProvider(link, 'https://t.me/', IconId.Telegram);

  const facebookLinkInfoProvider = link => socialMediaLinkInfoProvider(link, 'https://facebook.com/', IconId.Facebook);

  const twitterLinkInfoProvider = link => socialMediaLinkInfoProvider(link, 'https://twitter.com/', IconId.Twitter);

  const instagramLinkInfoProvider = link => socialMediaLinkInfoProvider(link, 'https://instagram.com/', IconId.Instagram);

  const gitHubLinkInfoProvider = link => socialMediaLinkInfoProvider(link, 'https://github.com/', IconId.GitHub);

  const redditLinkInfoProvider = link => socialMediaLinkInfoProvider(link, 'https://www.reddit.com/', IconId.Reddit); // This regex should not use for email validation


  const emailCheckingRegEx = /^[^\s/@]+@[^\s@/]+$/;

  const emailLinkInfoProvider = link => {
    const preparedFormattedLink = prepareFormattedLink(link);
    return emailCheckingRegEx.test(preparedFormattedLink) && {
      rawLink: link,
      formattedLink: "mailto:".concat(preparedFormattedLink),
      displayLink: prepareDisplayLink(link),
      icon: IconId.Email
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
      icon: IconId.Common
    };
  };

  const editLinkInfoProvider = link => {
    const formattedLink = prepareFormattedLink(link);
    return {
      rawLink: link,
      formattedLink,
      displayLink: prepareDisplayLink(link),
      icon: IconId.Common
    };
  };

  class ServiceLinkHelper {
    // Order is important
    getLinkInfo(link) {
      let isEditMode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

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

  _defineProperty$1(ServiceLinkHelper, "linkInfoProviders", [// Disallowed
  javascriptLinkInfoProvider, // Allowed
  telegramLinkInfoProvider, facebookLinkInfoProvider, twitterLinkInfoProvider, instagramLinkInfoProvider, gitHubLinkInfoProvider, emailLinkInfoProvider, redditLinkInfoProvider, commonLinkInfoProvider]);

  var PaymentType;

  (function (PaymentType) {
    PaymentType[PaymentType["Payment"] = 1] = "Payment";
    PaymentType[PaymentType["Donation"] = 2] = "Donation";
  })(PaymentType || (PaymentType = {}));

  class PaymentValidatorBase {
    validate(payment) {
      let bail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
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
    mainnet: {
      id: 'NetXdQprcVkpaWU',
      name: 'mainnet'
    },
    hangzhounet: {
      id: 'NetXZSsxBpMQeAT',
      name: 'hangzhounet'
    }
  };
  const networks = networksInternal;
  const networksCollection = Object.values(networksInternal);
  const networkIdRegExp = /^[a-zA-Z]\w*$/;
  const networkNameRegExp = networkIdRegExp;
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
    network: networks.hangzhounet,
    type: 'fa1.2',
    contractAddress: 'KT19sYK89XKYTeGHekWK9wL5iDHVF4YYf26t',
    metadata: {
      decimals: 6,
      symbol: 'FA12',
      name: 'Test FA 1.2',
      thumbnailUri: 'https://dashboard.tezospayments.com/tokens/unknown.png'
    }
  }, {
    network: networks.hangzhounet,
    type: 'fa2',
    contractAddress: 'KT1EKo1Eihucz9N4cQyaDKeYRoMzTEoiZRAT',
    id: 0,
    metadata: {
      decimals: 6,
      symbol: 'FA20',
      name: 'Test FA 2.0',
      thumbnailUri: 'https://dashboard.tezospayments.com/tokens/unknown.png'
    }
  }];
  new Map(networksCollection.map(nc => [nc, new Map(tokenWhitelist.filter(t => t.network === nc).map(t => [t.contractAddress, t]))]));

  const contractAddressPrefixes = ['KT'];
  const implicitAddressPrefixes = ['tz1', 'tz2', 'tz3'];
  const addressPrefixes = [...contractAddressPrefixes, ...implicitAddressPrefixes];
  const tezosInfo = {
    addressLength: 36,
    contractAddressPrefixes,
    implicitAddressPrefixes,
    addressPrefixes
  };

  var KeyType;

  (function (KeyType) {
    KeyType["Ed25519"] = "Ed25519";
    KeyType["Secp256k1"] = "Secp256k1";
    KeyType["P256"] = "P256";
  })(KeyType || (KeyType = {}));

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
    constructor() {
      super(...arguments);

      _defineProperty$1(this, "validationMethods", [payment => payment.type !== PaymentType.Payment ? [PaymentValidator.errors.invalidType] : undefined, payment => validateTargetAddress(payment.targetAddress, PaymentValidator.errors), payment => validateId(payment.id, PaymentValidator.errors), payment => validateAmount(payment.amount, PaymentValidator.errors), payment => validatePaymentAsset(payment.asset, PaymentValidator.errors), payment => validateData(payment.data, PaymentValidator.errors), payment => validateUrl(payment.successUrl, PaymentValidator.successUrlErrors), payment => validateUrl(payment.cancelUrl, PaymentValidator.cancelUrlErrors), payment => validateCreatedDate(payment.created, PaymentValidator.errors), payment => validateExpiredDate(payment.expired, payment.created, PaymentValidator.minimumPaymentLifetime, PaymentValidator.errors)]);

      _defineProperty$1(this, "invalidPaymentObjectError", PaymentValidator.errors.invalidPaymentObject);
    }

  }

  _defineProperty$1(PaymentValidator, "errors", {
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

  _defineProperty$1(PaymentValidator, "minimumPaymentLifetime", 600000);

  _defineProperty$1(PaymentValidator, "successUrlErrors", {
    invalidUrl: PaymentValidator.errors.invalidSuccessUrl,
    invalidProtocol: PaymentValidator.errors.successUrlHasInvalidProtocol
  });

  _defineProperty$1(PaymentValidator, "cancelUrlErrors", {
    invalidUrl: PaymentValidator.errors.invalidCancelUrl,
    invalidProtocol: PaymentValidator.errors.cancelUrlHasInvalidProtocol
  });

  class DonationValidator extends PaymentValidatorBase {
    constructor() {
      super(...arguments);

      _defineProperty$1(this, "validationMethods", [donation => donation.type !== PaymentType.Donation ? [DonationValidator.errors.invalidType] : undefined, donation => validateData(donation.data, DonationValidator.errors), donation => validateTargetAddress(donation.targetAddress, DonationValidator.errors), donation => validateDesiredAmount(donation.desiredAmount, DonationValidator.errors), donation => validateDonationAsset(donation.desiredAsset, DonationValidator.errors), donation => validateUrl(donation.successUrl, DonationValidator.successUrlErrors), donation => validateUrl(donation.cancelUrl, DonationValidator.cancelUrlErrors)]);

      _defineProperty$1(this, "invalidPaymentObjectError", DonationValidator.errors.invalidDonationObject);
    }

  }

  _defineProperty$1(DonationValidator, "errors", {
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

  _defineProperty$1(DonationValidator, "successUrlErrors", {
    invalidUrl: DonationValidator.errors.invalidSuccessUrl,
    invalidProtocol: DonationValidator.errors.successUrlHasInvalidProtocol
  });

  _defineProperty$1(DonationValidator, "cancelUrlErrors", {
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
        return encode(jsonString, 'base64url');
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
          const serializedValueString = decode(serializedValue, 'base64url');
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
  .set('a', 'string') // target
  .set('t', 'string') // asset
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
        a: payment.amount.toString(10),
        t: payment.targetAddress,
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

  _defineProperty$1(PaymentSerializer, "serializedPaymentBase64Serializer", new Base64Serializer(serializedPaymentFieldTypes));

  class PaymentDeserializer {
    deserialize(serializedPaymentBase64) {
      try {
        const serializedPayment = PaymentDeserializer.serializedPaymentBase64Deserializer.deserialize(serializedPaymentBase64);
        return serializedPayment ? this.mapSerializedPaymentToPayment(serializedPayment) : null;
      } catch {
        return null;
      }
    }

    mapSerializedPaymentToPayment(serializedPayment) {
      return {
        type: PaymentType.Payment,
        id: serializedPayment.i,
        amount: new BigNumber(serializedPayment.a),
        targetAddress: serializedPayment.t,
        asset: serializedPayment.as ? this.mapSerializedPaymentAssetToPaymentAsset(serializedPayment.as) : undefined,
        data: serializedPayment.d,
        successUrl: serializedPayment.su ? new URL(serializedPayment.su) : undefined,
        cancelUrl: serializedPayment.cu ? new URL(serializedPayment.cu) : undefined,
        created: new Date(serializedPayment.c),
        expired: serializedPayment.e ? new Date(serializedPayment.e) : undefined,
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

  _defineProperty$1(PaymentDeserializer, "serializedPaymentBase64Deserializer", new Base64Deserializer(serializedPaymentFieldTypes));

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
        da: (_donation$desiredAmou = donation.desiredAmount) === null || _donation$desiredAmou === void 0 ? void 0 : _donation$desiredAmou.toString(10),
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

  _defineProperty$1(DonationSerializer, "serializedDonationBase64Serializer", new Base64Serializer(serializedDonationFieldTypes));

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
        type: PaymentType.Donation,
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

  _defineProperty$1(DonationDeserializer, "serializedDonationBase64Deserializer", new Base64Deserializer(serializedDonationFieldTypes));

  class Payment extends StateModel {
    static validate(payment) {
      return Payment.defaultValidator.validate(payment);
    }

    static deserialize(serializedPayment) {
      return Payment.defaultDeserializer.deserialize(serializedPayment);
    }

  }

  _defineProperty$1(Payment, "defaultDeserializer", new PaymentDeserializer());

  _defineProperty$1(Payment, "defaultValidator", new PaymentValidator());

  class Donation extends StateModel {
    static validate(donation) {
      return Donation.defaultValidator.validate(donation);
    }

    static deserialize(serializedDonation, nonSerializedDonationSlice) {
      return Donation.defaultDeserializer.deserialize(serializedDonation, nonSerializedDonationSlice);
    }

  }

  _defineProperty$1(Donation, "defaultDeserializer", new DonationDeserializer());

  _defineProperty$1(Donation, "defaultValidator", new DonationValidator());

  exports.PaymentUrlType = void 0;

  (function (PaymentUrlType) {
    PaymentUrlType[PaymentUrlType["Base64"] = 0] = "Base64";
  })(exports.PaymentUrlType || (exports.PaymentUrlType = {}));

  const encodedPaymentUrlTypeMap = new Map(Object.keys(exports.PaymentUrlType).filter(value => !isNaN(+value)).map(value => [+value, padStart(value, 2, '0')]));
  const getEncodedPaymentUrlType = paymentUrlType => encodedPaymentUrlTypeMap.get(paymentUrlType) || '';

  var ServiceOperationType;

  (function (ServiceOperationType) {
    ServiceOperationType[ServiceOperationType["Payment"] = 1] = "Payment";
    ServiceOperationType[ServiceOperationType["Donation"] = 2] = "Donation";
    ServiceOperationType[ServiceOperationType["All"] = 3] = "All";
  })(ServiceOperationType || (ServiceOperationType = {}));

  ({
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
    allowedOperationType: ServiceOperationType.Payment,
    owner: '',
    paused: false,
    deleted: false,
    network: networks.mainnet,
    signingKeys: optimization.emptyMap
  });

  var OperationType;

  (function (OperationType) {
    OperationType[OperationType["Payment"] = 1] = "Payment";
    OperationType[OperationType["Donation"] = 2] = "Donation";
  })(OperationType || (OperationType = {}));

  var OperationDirection;

  (function (OperationDirection) {
    OperationDirection[OperationDirection["Incoming"] = 0] = "Incoming";
    OperationDirection[OperationDirection["Outgoing"] = 1] = "Outgoing";
  })(OperationDirection || (OperationDirection = {}));

  var OperationStatus;

  (function (OperationStatus) {
    OperationStatus[OperationStatus["Pending"] = 0] = "Pending";
    OperationStatus[OperationStatus["Success"] = 1] = "Success";
    OperationStatus[OperationStatus["Cancelled"] = 2] = "Cancelled";
  })(OperationStatus || (OperationStatus = {}));

  // 'Tezos Signed Message: '
  const tezosSignedMessagePrefixBytes = '54657a6f73205369676e6564204d6573736167653a20'; // 'Payment Client Data: '

  const tezosPaymentsClientSignedMessagePrefixBytes = '5061796d656e7420436c69656e7420446174613a20';

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
      var _payment$successUrl, _payment$cancelUrl;

      const clientSignPayload = {
        data: payment.data,
        successUrl: (_payment$successUrl = payment.successUrl) === null || _payment$successUrl === void 0 ? void 0 : _payment$successUrl.href,
        cancelUrl: (_payment$cancelUrl = payment.cancelUrl) === null || _payment$cancelUrl === void 0 ? void 0 : _payment$cancelUrl.href
      };
      const serializedClientSignPayload = JSON.stringify(clientSignPayload, (_key, value) => value !== undefined && value !== null && value !== '' ? value : undefined);
      if (serializedClientSignPayload === '{}') return null;
      const serializedClientSignPayloadBytes = stringToBytes(serializedClientSignPayload);
      const signedMessageBytes = tezosSignedMessagePrefixBytes + tezosPaymentsClientSignedMessagePrefixBytes + serializedClientSignPayloadBytes;
      const messageLength = padStart((signedMessageBytes.length / 2).toString(16), 8, '0');
      const result = '0x0501' + messageLength + signedMessageBytes;
      return result;
    }

  }

  _defineProperty$1(PaymentSignPayloadEncoder, "contractPaymentInTezSignPayloadMichelsonType", contractPaymentInTezSignPayloadMichelsonType);

  _defineProperty$1(PaymentSignPayloadEncoder, "contractPaymentInAssetSignPayloadMichelsonType", contractPaymentInAssetSignPayloadMichelsonType);

  class EllipticCurveKeyGenerator {
    constructor(curveName) {
      this.ec = new elliptic.ec(curveName);
      this.curveInfo = EllipticCurveKeyGenerator.curveInfo[curveName];
    }

    generate() {
      const keyPair = this.ec.genKeyPair();
      console.log(keyPair);
      const publicBasePoint = keyPair.getPublic();
      const publicPointX = publicBasePoint.getX().toArray();
      const publicPointY = publicBasePoint.getY().toArray(); // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

      const firstByte = publicPointY[publicPointY.length - 1] % 2 ? 3 : 2;
      const privateKey = new Uint8Array(keyPair.getPrivate().toArray());
      const pad = new Array(32).fill(0);
      const publicKey = new Uint8Array([firstByte].concat(pad.concat(publicPointX).slice(-32)));
      const raw = {
        keyType: KeyType.P256,
        privateKey,
        publicKey
      };
      const encoded = {
        keyType: this.curveInfo.keyType,
        privateKey: b58cencode(privateKey, this.curveInfo.privateKeyPrefix),
        publicKey: b58cencode(publicKey, this.curveInfo.publicKeyPrefix)
      };
      return {
        raw,
        encoded
      };
    }

  }

  _defineProperty$1(EllipticCurveKeyGenerator, "curveInfo", {
    secp256k1: {
      name: 'secp256k1',
      keyType: KeyType.Secp256k1,
      privateKeyPrefix: prefix['spsk'],
      publicKeyPrefix: prefix['sppk']
    },
    p256: {
      name: 'p256',
      keyType: KeyType.P256,
      privateKeyPrefix: prefix['p2sk'],
      publicKeyPrefix: prefix['p2pk']
    }
  });

  const getErrorMessageByValidationErrors = function (validationErrors) {
    let brief = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    return validationErrors.reduce((result, error, index) => "".concat(result, "\n\t").concat(index + 1, ". ").concat(error, ";"), brief);
  };

  class TezosPaymentsError extends Error {
    constructor(message) {
      super(message);
      this.name = this.constructor.name;
    }

  }
  class InvalidTezosPaymentsOptionsError extends TezosPaymentsError {
    constructor(messageOrValidationErrors) {
      super(guards.isReadonlyArray(messageOrValidationErrors) ? InvalidTezosPaymentsOptionsError.getMessage(messageOrValidationErrors) : messageOrValidationErrors);
    }

    static getMessage(validationErrors) {
      return getErrorMessageByValidationErrors(validationErrors, 'options are invalid, see details below:');
    }

  }
  class InvalidPaymentCreateParametersError extends TezosPaymentsError {}
  class InvalidPaymentError extends TezosPaymentsError {
    constructor(messageOrValidationErrors) {
      super(guards.isReadonlyArray(messageOrValidationErrors) ? InvalidPaymentError.getMessage(messageOrValidationErrors) : messageOrValidationErrors);
    }

    static getMessage(validationErrors) {
      return getErrorMessageByValidationErrors(validationErrors, 'payment is invalid, see details below:');
    }

  }
  class UnsupportedPaymentUrlTypeError extends TezosPaymentsError {}
  class PaymentUrlError extends TezosPaymentsError {}
  class DonationUrlError extends TezosPaymentsError {}

  var errors = /*#__PURE__*/Object.freeze({
    __proto__: null,
    TezosPaymentsError: TezosPaymentsError,
    InvalidTezosPaymentsOptionsError: InvalidTezosPaymentsOptionsError,
    InvalidPaymentCreateParametersError: InvalidPaymentCreateParametersError,
    InvalidPaymentError: InvalidPaymentError,
    UnsupportedPaymentUrlTypeError: UnsupportedPaymentUrlTypeError,
    PaymentUrlError: PaymentUrlError,
    DonationUrlError: DonationUrlError
  });

  class PaymentUrlFactory {
    constructor(urlType) {
      this.urlType = urlType;
    }

  }

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

  class Base64PaymentUrlFactory extends PaymentUrlFactory {
    constructor() {
      let baseUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Base64PaymentUrlFactory.baseUrl;
      super(exports.PaymentUrlType.Base64);

      _defineProperty(this, "paymentSerializer", new PaymentSerializer());

      _defineProperty(this, "donationSerializer", new DonationSerializer());

      this.baseUrl = baseUrl;
    }

    createPaymentUrl(paymentOrDonation, network) {
      return paymentOrDonation.type === PaymentType.Payment ? this.createPaymentUrlInternal(paymentOrDonation, network) : this.createDonationUrlInternal(paymentOrDonation, network);
    }

    createPaymentUrlInternal(payment, network) {
      const serializedPaymentBase64 = this.paymentSerializer.serialize(payment);
      if (!serializedPaymentBase64) throw new PaymentUrlError('It\'s impossible to serialize the payment');

      try {
        const url = new index.URL(this.baseUrl);
        return this.createUrl(url, serializedPaymentBase64, network);
      } catch (error) {
        throw new PaymentUrlError('It\'s impossible to create an URL for the payment');
      }
    }

    createDonationUrlInternal(donation, network) {
      const serializedDonationBase64 = this.donationSerializer.serialize(donation);
      if (!serializedDonationBase64 && serializedDonationBase64 !== '') throw new DonationUrlError('It\'s impossible to serialize the donation');

      try {
        const url = new index.URL("".concat(donation.targetAddress, "/donation"), this.baseUrl);
        return this.createUrl(url, serializedDonationBase64, network);
      } catch (error) {
        throw new DonationUrlError('It\'s impossible to create an URL for the donation');
      }
    }

    createUrl(baseUrl, serializedPaymentOrDonationBase64, network) {
      if (serializedPaymentOrDonationBase64 !== '') baseUrl.hash = getEncodedPaymentUrlType(this.urlType) + serializedPaymentOrDonationBase64;
      if (network.name !== constants.defaultNetworkName) baseUrl.searchParams.append('network', network.name);
      return baseUrl.href;
    }

  }

  _defineProperty(Base64PaymentUrlFactory, "baseUrl", constants.paymentAppBaseUrl);

  var paymentUrlFactories = /*#__PURE__*/Object.freeze({
    __proto__: null,
    PaymentUrlFactory: PaymentUrlFactory,
    Base64PaymentUrlFactory: Base64PaymentUrlFactory
  });

  class TezosPaymentsSigner {
    constructor(signingType) {
      this.signingType = signingType;
    }

  }

  exports.SigningType = void 0;

  (function (SigningType) {
    SigningType[SigningType["ApiSecretKey"] = 0] = "ApiSecretKey";
    SigningType[SigningType["Wallet"] = 1] = "Wallet";
    SigningType[SigningType["Custom"] = 2] = "Custom";
  })(exports.SigningType || (exports.SigningType = {}));

  class ApiSecretKeySigner extends TezosPaymentsSigner {
    constructor(apiSecretKey) {
      super(exports.SigningType.ApiSecretKey);

      _defineProperty(this, "paymentSignPayloadEncoder", new PaymentSignPayloadEncoder());

      this.apiSecretKey = apiSecretKey;
      this.inMemorySigner = new signer.InMemorySigner(this.apiSecretKey);
    }

    async sign(payment) {
      var _signatures$;

      const signPayload = this.paymentSignPayloadEncoder.encode(payment);
      const contractSigningPromise = this.inMemorySigner.sign(signPayload.contractSignPayload);
      const signingPromises = signPayload.clientSignPayload ? [contractSigningPromise, this.inMemorySigner.sign(signPayload.clientSignPayload)] : [contractSigningPromise];
      const signatures = await Promise.all(signingPromises);
      return {
        signingPublicKey: await this.inMemorySigner.publicKey(),
        contract: signatures[0].prefixSig,
        client: (_signatures$ = signatures[1]) === null || _signatures$ === void 0 ? void 0 : _signatures$.prefixSig
      };
    }

  }

  class WalletSigner extends TezosPaymentsSigner {
    constructor(signingPublicKey, walletSignCallback) {
      super(exports.SigningType.Wallet);

      _defineProperty(this, "paymentSignPayloadEncoder", new PaymentSignPayloadEncoder());

      this.signingPublicKey = signingPublicKey;
      this.walletSignCallback = walletSignCallback;
    }

    async sign(payment) {
      const signPayload = this.paymentSignPayloadEncoder.encode(payment);
      const walletContractSignPayload = signPayload.contractSignPayload.substring(2);
      const contractSigningPromise = this.walletSignCallback(walletContractSignPayload);
      const signingPromises = signPayload.clientSignPayload ? [contractSigningPromise, this.walletSignCallback(signPayload.clientSignPayload)] : [contractSigningPromise];
      const signatures = await Promise.all(signingPromises);
      return {
        signingPublicKey: this.signingPublicKey,
        contract: signatures[0],
        client: signatures[1]
      };
    }

  }

  class CustomSigner extends TezosPaymentsSigner {
    constructor(customSigning) {
      super(exports.SigningType.Custom);
      this.customSigning = customSigning;
    }

    sign(payment) {
      return this.customSigning(payment);
    }

  }

  var signers = /*#__PURE__*/Object.freeze({
    __proto__: null,
    TezosPaymentsSigner: TezosPaymentsSigner,
    ApiSecretKeySigner: ApiSecretKeySigner,
    WalletSigner: WalletSigner,
    CustomSigner: CustomSigner
  });

  let nanoid = function () {
    let size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 21;
    let id = '';
    let bytes = crypto.getRandomValues(new Uint8Array(size));

    while (size--) {
      let byte = bytes[size] & 63;

      if (byte < 36) {
        id += byte.toString(36);
      } else if (byte < 62) {
        id += (byte - 26).toString(36).toUpperCase();
      } else if (byte < 63) {
        id += '_';
      } else {
        id += '-';
      }
    }

    return id;
  };

  class TezosPaymentsOptionsValidator {
    validateOptions(options) {
      return [this.validateServiceContractAddress(options.serviceContractAddress), this.validateNetwork(options.network), this.validateSigningOptions(options.signing), this.validateDefaultPaymentParameters(options.defaultPaymentParameters)].reduce((result, currentErrors) => currentErrors ? (result || []).concat(currentErrors) : result, undefined);
    }

    validateServiceContractAddress(serviceContractAddress) {
      if (!serviceContractAddress || typeof serviceContractAddress !== 'string') return [TezosPaymentsOptionsValidator.errors.invalidServiceContractAddressType];
      if (serviceContractAddress.length !== tezosInfo.addressLength) return [TezosPaymentsOptionsValidator.errors.serviceContractAddressHasInvalidLength];
      if (!tezosInfo.contractAddressPrefixes.some(prefix => serviceContractAddress.startsWith(prefix))) return [TezosPaymentsOptionsValidator.errors.serviceContractAddressIsNotContractAddress];
    }

    validateNetwork(network) {
      if (network === undefined || network === null) return;
      if (typeof network !== 'object') return [TezosPaymentsOptionsValidator.errors.invalidNetwork];
      if (network.name === undefined || network.name === '') return [TezosPaymentsOptionsValidator.errors.emptyNetworkName];
      if (typeof network.name !== 'string' || !networkNameRegExp.test(network.name)) return [TezosPaymentsOptionsValidator.errors.invalidNetworkName];
      if (network.id && (typeof network.id !== 'string' || !networkIdRegExp.test(network.id))) return [TezosPaymentsOptionsValidator.errors.invalidNetworkId];
    }

    validateSigningOptions(signingOptions) {
      if (typeof signingOptions !== 'object') return [TezosPaymentsOptionsValidator.errors.invalidSigningOption];
      if (!('apiSecretKey' in signingOptions) && !('wallet' in signingOptions) && !('custom' in signingOptions)) return [TezosPaymentsOptionsValidator.errors.invalidSigningOption];
      if ('apiSecretKey' in signingOptions) return this.validateApiSecretKeySigningOptions(signingOptions);
      if ('wallet' in signingOptions) return this.validateWalletSigningOptions(signingOptions);
      if ('custom' in signingOptions) return this.validateCustomSigningOptions(signingOptions);
    }

    validateApiSecretKeySigningOptions(signingOptions) {
      if (typeof signingOptions.apiSecretKey !== 'string') return [TezosPaymentsOptionsValidator.errors.invalidApiSecretKeyType];
      if (!signingOptions.apiSecretKey) return [TezosPaymentsOptionsValidator.errors.emptyApiSecretKey];
    }

    validateWalletSigningOptions(signingOptions) {
      if (typeof signingOptions.wallet !== 'object') return [TezosPaymentsOptionsValidator.errors.invalidWalletSigningOption];
      if (typeof signingOptions.wallet.signingPublicKey !== 'string') return [TezosPaymentsOptionsValidator.errors.invalidWalletSigningPublicKey];
      if (!signingOptions.wallet.signingPublicKey) return [TezosPaymentsOptionsValidator.errors.emptyWalletSigningPublicKey];
      if (typeof signingOptions.wallet.sign !== 'function') return [TezosPaymentsOptionsValidator.errors.invalidWalletSignFunctionType];
    }

    validateCustomSigningOptions(signingOptions) {
      if (typeof signingOptions.custom !== 'function') return [TezosPaymentsOptionsValidator.errors.invalidCustomSigningOption];
    }

    validateDefaultPaymentParameters(defaultPaymentParameters) {
      if (defaultPaymentParameters === undefined) return;
      if (typeof defaultPaymentParameters !== 'object') return [TezosPaymentsOptionsValidator.errors.invalidDefaultPaymentParameters];
      if ('urlType' in defaultPaymentParameters && defaultPaymentParameters.urlType !== exports.PaymentUrlType.Base64) return [TezosPaymentsOptionsValidator.errors.invalidUrlType];
    }

  }

  _defineProperty(TezosPaymentsOptionsValidator, "errors", {
    // serviceContractAddress
    invalidServiceContractAddressType: 'Type of the serviceContractAddress option is invalid',
    serviceContractAddressHasInvalidLength: 'The serviceContractAddress option has an invalid address',
    serviceContractAddressIsNotContractAddress: 'The serviceContractAddress option isn\'t a contract address',
    // signing
    invalidSigningOption: 'The signing option is invalid',
    // signing.apiSecretKey
    invalidApiSecretKeyType: 'The API secret key has an invalid type, it should be a string',
    emptyApiSecretKey: 'The API secret key is empty',
    // signing.wallet
    invalidWalletSigningOption: 'The "signing.wallet" option is invalid',
    invalidWalletSigningPublicKey: 'The wallet signing public key has an invalid type, it should be a string',
    emptyWalletSigningPublicKey: 'The wallet signing public key is empty',
    invalidWalletSignFunctionType: 'The wallet sign function has an invalid type, it should be a function',
    // signing.custom
    invalidCustomSigningOption: 'The "signing.custom" option has an invalid type, it should be a function',
    // network
    emptyNetworkName: 'The network name is empty',
    invalidNetwork: 'The network is invalid',
    invalidNetworkName: 'The network name is invalid',
    invalidNetworkId: 'The network id is invalid',
    // defaultPaymentParameters
    invalidDefaultPaymentParameters: 'The default payment parameters are invalid',
    // defaultPaymentParameters.urlType
    invalidUrlType: 'The url type is invalid'
  });

  class TezosPayments {
    constructor(options) {
      _defineProperty(this, "optionsValidator", new TezosPaymentsOptionsValidator());

      _defineProperty(this, "paymentValidator", new PaymentValidator());

      _defineProperty(this, "paymentUrlFactories", new Map());

      const errors = this.optionsValidator.validateOptions(options);
      if (errors) throw new InvalidTezosPaymentsOptionsError(errors);
      this.serviceContractAddress = options.serviceContractAddress;
      this.network = options.network || networks.mainnet;
      this.defaultPaymentParameters = options.defaultPaymentParameters ? {
        urlType: options.defaultPaymentParameters.urlType || TezosPayments.defaultPaymentParameters.urlType
      } : TezosPayments.defaultPaymentParameters;
      this.signer = this.createSigner(options.signing);
      this.getPaymentUrlFactory(this.defaultPaymentParameters.urlType);
    }

    async createPayment(createParameters) {
      if (!createParameters) throw new InvalidPaymentCreateParametersError(createParameters);
      let errors;

      if (createParameters.urlType) {
        errors = this.optionsValidator.validateDefaultPaymentParameters(createParameters);
        if (errors) throw new InvalidPaymentError(errors);
      }

      const unsignedPayment = this.createPaymentByCreateParameters(createParameters);
      errors = this.paymentValidator.validate(unsignedPayment, true);
      if (errors) throw new InvalidPaymentError(errors);
      const signedPayment = await this.getSignedPayment(unsignedPayment);
      errors = this.paymentValidator.validate(signedPayment, true);
      if (errors) throw new InvalidPaymentError(errors);
      const paymentUrl = await this.getPaymentUrl(signedPayment, createParameters.urlType);
      const payment = this.applyPaymentUrl(signedPayment, paymentUrl);
      return payment;
    }

    getPaymentUrl(payment) {
      let urlType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.defaultPaymentParameters.urlType;
      return this.getPaymentUrlFactory(urlType).createPaymentUrl(payment, this.network);
    }

    applyPaymentUrl(payment, url) {
      payment.url = url;
      return payment;
    }

    getPaymentUrlFactory(paymentUrlType) {
      let paymentUrlFactory = this.paymentUrlFactories.get(paymentUrlType);

      if (!paymentUrlFactory) {
        paymentUrlFactory = this.createPaymentUrlFactory(paymentUrlType);
        this.paymentUrlFactories.set(paymentUrlType, paymentUrlFactory);
      }

      return paymentUrlFactory;
    }

    async getSignedPayment(unsignedPayment) {
      unsignedPayment.signature = await this.signer.sign(unsignedPayment);
      return unsignedPayment;
    }

    createSigner(signingOptions) {
      if ('apiSecretKey' in signingOptions) return new ApiSecretKeySigner(signingOptions.apiSecretKey);
      if ('wallet' in signingOptions) return new WalletSigner(signingOptions.wallet.signingPublicKey, signingOptions.wallet.sign);
      return new CustomSigner(signingOptions.custom);
    }

    createPaymentUrlFactory(paymentUrlType) {
      switch (paymentUrlType) {
        case exports.PaymentUrlType.Base64:
          return new Base64PaymentUrlFactory();

        default:
          throw new UnsupportedPaymentUrlTypeError("This payment url type is not supported: ".concat(paymentUrlType));
      }
    }

    createPaymentByCreateParameters(createParameters) {
      // TODO: check decimals
      // TODO: floor amount to decimals count: new BigNumber(amount).toFixed(asset.decimals)
      const payment = {
        type: PaymentType.Payment,
        id: createParameters.id || nanoid(),
        targetAddress: this.serviceContractAddress,
        amount: new BigNumber(createParameters.amount),
        data: createParameters.data,
        created: createParameters.created ? new Date(createParameters.created) : new Date()
      };
      if (createParameters.asset) payment.asset = createParameters.asset;
      if (createParameters.expired) payment.expired = new Date(createParameters.expired);
      if (createParameters.successUrl) payment.successUrl = new index.URL(createParameters.successUrl);
      if (createParameters.cancelUrl) payment.cancelUrl = new index.URL(createParameters.cancelUrl);
      return payment;
    }

  }

  _defineProperty(TezosPayments, "defaultPaymentParameters", {
    urlType: exports.PaymentUrlType.Base64
  });

  const internal = {
    constants,
    errors,
    paymentUrlFactories,
    signers
  };

  exports.TezosPayments = TezosPayments;
  exports.internal = internal;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.umd.js.map
