webpackHotUpdate(0,{

/***/ "../lib/ctx-canvas.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ctx_base__ = __webpack_require__(\"../lib/ctx-base.js\");\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\n\n\nvar ContextCanvas = function (_BaseContext) {\n    _inherits(ContextCanvas, _BaseContext);\n\n    function ContextCanvas(canvasElement) {\n        _classCallCheck(this, ContextCanvas);\n\n        var _this = _possibleConstructorReturn(this, (ContextCanvas.__proto__ || Object.getPrototypeOf(ContextCanvas)).call(this));\n\n        Object.defineProperty(_this, 'ctx', {\n            value: canvasElement.getContext('2d')\n        });\n        Object.defineProperty(_this, 'canvasElement', {\n            value: canvasElement\n        });\n        return _this;\n    }\n\n    _createClass(ContextCanvas, [{\n        key: 'clear',\n        value: function clear() {\n            this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);\n        }\n    }, {\n        key: 'bezierCurveTo',\n        value: function bezierCurveTo() {\n            var _ctx;\n\n            (_ctx = this.ctx).bezierCurveTo.apply(_ctx, arguments);\n        }\n    }, {\n        key: 'quadraticCurveTo',\n        value: function quadraticCurveTo() {\n            var _ctx2;\n\n            (_ctx2 = this.ctx).quadraticCurveTo.apply(_ctx2, arguments);\n        }\n    }, {\n        key: 'save',\n        value: function save() {\n            this.ctx.save();\n        }\n    }, {\n        key: 'restore',\n        value: function restore() {\n            this.ctx.restore();\n        }\n    }, {\n        key: 'begin',\n        value: function begin() {\n            this.ctx.beginPath();\n        }\n    }, {\n        key: 'moveTo',\n        value: function moveTo(p) {\n            this.ctx.moveTo(p.x, p.y);\n        }\n    }, {\n        key: 'lineTo',\n        value: function lineTo(p) {\n            this.ctx.lineTo(p.x, p.y);\n        }\n    }, {\n        key: 'cubicTo',\n        value: function cubicTo(c1, c2, p) {\n            this.ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, p.x, p.y);\n        }\n    }, {\n        key: 'quadraticTo',\n        value: function quadraticTo(c1, p) {\n            this.ctx.quadraticCurveTo(c1.x, c1.y, p.x, p.y);\n        }\n    }, {\n        key: 'closePath',\n        value: function closePath() {\n            this.ctx.closePath();\n        }\n    }, {\n        key: 'set',\n        value: function set(k, v) {\n            this.ctx[k] = v;\n        }\n    }, {\n        key: 'stroke',\n        value: function stroke() {\n            this.ctx.stroke();\n        }\n    }, {\n        key: 'fill',\n        value: function fill() {\n            this.ctx.fill();\n        }\n    }, {\n        key: 'fillAndStroke',\n        value: function fillAndStroke() {\n            this.fill();\n            this.stroke();\n        }\n    }, {\n        key: 'width',\n        get: function get() {\n            return this.canvasElement.width;\n        }\n    }, {\n        key: 'height',\n        get: function get() {\n            return this.canvasElement.height;\n        }\n    }]);\n\n    return ContextCanvas;\n}(__WEBPACK_IMPORTED_MODULE_0__ctx_base__[\"a\" /* default */]);\n\n/* harmony default export */ __webpack_exports__[\"a\"] = ContextCanvas;\n\n//////////////////\n// WEBPACK FOOTER\n// ../lib/ctx-canvas.js\n// module id = ../lib/ctx-canvas.js\n// module chunks = 0\n\n//# sourceURL=webpack:///../lib/ctx-canvas.js?");

/***/ })

})