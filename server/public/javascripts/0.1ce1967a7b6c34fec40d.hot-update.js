webpackHotUpdate(0,{

/***/ "../lib/ctx-store.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ctx_base__ = __webpack_require__(\"../lib/ctx-base.js\");\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\n\n\nvar ContextStore = function (_BaseContext) {\n    _inherits(ContextStore, _BaseContext);\n\n    function ContextStore(width, height) {\n        _classCallCheck(this, ContextStore);\n\n        var _this = _possibleConstructorReturn(this, (ContextStore.__proto__ || Object.getPrototypeOf(ContextStore)).call(this));\n\n        Object.defineProperty(_this, 'operations', { value: [] });\n        Object.defineProperty(_this, 'width', { value: width });\n        Object.defineProperty(_this, 'height', { value: height });\n        return _this;\n    }\n\n    _createClass(ContextStore, [{\n        key: 'bezierCurveTo',\n        value: function bezierCurveTo() {\n            this.curveTo.apply(this, arguments);\n        }\n    }, {\n        key: 'quadraticCurveTo',\n        value: function quadraticCurveTo() {\n            this.quadraticTo.apply(this, arguments);\n        }\n    }, {\n        key: 'save',\n        value: function save(op) {\n            this.operations.push(op);\n        }\n    }, {\n        key: 'restore',\n        value: function restore(op) {\n            this.operations.push(op);\n        }\n    }, {\n        key: 'begin',\n        value: function begin(op) {\n            this.operations.push(op);\n        }\n    }, {\n        key: 'moveTo',\n        value: function moveTo(p, op) {\n            this.operations.push(op);\n        }\n    }, {\n        key: 'lineTo',\n        value: function lineTo(p, op) {\n            this.operations.push(op);\n        }\n    }, {\n        key: 'cubicTo',\n        value: function cubicTo(c1, c2, p, op) {\n            this.operations.push(op);\n        }\n    }, {\n        key: 'quadraticTo',\n        value: function quadraticTo(c1, p, op) {\n            this.operations.push(op);\n        }\n    }, {\n        key: 'closePath',\n        value: function closePath(op) {\n            this.operations.push(op);\n        }\n    }, {\n        key: 'set',\n        value: function set(k, v, op) {\n            this.operations.push(op);\n        }\n    }, {\n        key: 'stroke',\n        value: function stroke(op) {\n            this.operations.push(op);\n        }\n    }, {\n        key: 'fill',\n        value: function fill(op) {\n            this.operations.push(op);\n        }\n    }, {\n        key: 'fillAndStroke',\n        value: function fillAndStroke(op) {\n            this.operations.push(op);\n        }\n    }]);\n\n    return ContextStore;\n}(__WEBPACK_IMPORTED_MODULE_0__ctx_base__[\"a\" /* default */]);\n\n/* harmony default export */ __webpack_exports__[\"a\"] = ContextStore;\n\n//////////////////\n// WEBPACK FOOTER\n// ../lib/ctx-store.js\n// module id = ../lib/ctx-store.js\n// module chunks = 0\n\n//# sourceURL=webpack:///../lib/ctx-store.js?");

/***/ })

})