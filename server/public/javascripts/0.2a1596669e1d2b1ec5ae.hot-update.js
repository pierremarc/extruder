webpackHotUpdate(0,{

/***/ "./extruder.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_point__ = __webpack_require__(\"../lib/point.js\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lib_ctx_canvas__ = __webpack_require__(\"../lib/ctx-canvas.js\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lib_message__ = __webpack_require__(\"../lib/message.js\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__lib_dom__ = __webpack_require__(\"../lib/dom.js\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__lib_state__ = __webpack_require__(\"../lib/state.js\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__lib_slider__ = __webpack_require__(\"../lib/slider.js\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__extrude__ = __webpack_require__(\"./extrude.js\");\n/* harmony export (immutable) */ __webpack_exports__[\"a\"] = main;\n\n\n\n\n\n\n\n\n\nvar debug = __webpack_require__(\"../node_modules/debug/src/browser.js\")('extruder');\n\nfunction mouseEventPos(e) {\n    var rect = e.currentTarget.getBoundingClientRect();\n    var p = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lib_point__[\"a\" /* default */])(e.clientX - rect.left, e.clientY - rect.top);\n    return p;\n}\n\nfunction startMoving(e) {\n    var current = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lib_point__[\"a\" /* default */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__lib_state__[\"c\" /* getState */])('x'), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__lib_state__[\"c\" /* getState */])('y'));\n    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__lib_state__[\"b\" /* setState */])(['isMoving', 'startPos'], [true, mouseEventPos(e).minus(current)]);\n}\n\nfunction isMoving(e) {\n    var startPos = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__lib_state__[\"c\" /* getState */])('startPos');\n    var isMovingState = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__lib_state__[\"c\" /* getState */])('isMoving');\n\n    if (isMovingState && startPos !== null) {\n        // console.log('isMoving', e.clientX, e.clientY);\n        var move = mouseEventPos(e).minus(startPos);\n        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__lib_state__[\"b\" /* setState */])(['x', 'y'], [move.x, move.y]);\n    }\n}\n\nfunction stopMoving(e) {\n    // console.log('stopMoving', e.clientX, e.clientY);\n    var startPos = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__lib_state__[\"c\" /* getState */])('startPos');\n    var isMovingState = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__lib_state__[\"c\" /* getState */])('isMoving');\n    var move = mouseEventPos(e).minus(startPos);\n\n    if (isMovingState && startPos !== null && (move.x !== 0 || move.y !== 0)) {\n        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__lib_state__[\"b\" /* setState */])(['x', 'y', 'isMoving', 'startPos'], [move.x, move.y, false, null]);\n    }\n}\n\nfunction xyTool() {\n    var box = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lib_dom__[\"b\" /* createElement */])('div', { class: 'tool-xy' });\n    var xBox = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lib_dom__[\"b\" /* createElement */])('div', { class: 'tool-xy-box tool-xy-x' });\n    var yBox = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lib_dom__[\"b\" /* createElement */])('div', { class: 'tool-xy-box tool-xy-y' });\n    xBox.appendChild(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__lib_slider__[\"a\" /* default */])('x', -300, 300, Math.ceil));\n    yBox.appendChild(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__lib_slider__[\"a\" /* default */])('y', -300, 300, Math.ceil));\n    box.appendChild(xBox);\n    box.appendChild(yBox);\n    return box;\n}\n\nfunction extentTool() {\n    var box = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lib_dom__[\"b\" /* createElement */])('div', { class: 'tool-size' });\n    var widthBox = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lib_dom__[\"b\" /* createElement */])('div', { class: 'tool-extent-box tool-extent-width' });\n    var heightBox = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lib_dom__[\"b\" /* createElement */])('div', { class: 'tool-extent-box tool-extent-height' });\n\n    widthBox.appendChild(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__lib_slider__[\"a\" /* default */])('width', 100, 4000, Math.ceil));\n    heightBox.appendChild(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__lib_slider__[\"a\" /* default */])('height', 100, 4000, Math.ceil));\n    box.appendChild(widthBox);\n    box.appendChild(heightBox);\n    return box;\n}\n\nfunction xyLay(box, rect) {\n    var s = box.style;\n    s.position = 'absolute';\n    s.top = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lib_dom__[\"d\" /* px */])(0);\n    s.left = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lib_dom__[\"d\" /* px */])(rect.left);\n    s.width = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lib_dom__[\"d\" /* px */])(rect.width * 0.5);\n}\n\nfunction sizeLay(box, rect) {\n    var s = box.style;\n    s.position = 'absolute';\n    s.bottom = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lib_dom__[\"d\" /* px */])(0);\n    s.right = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lib_dom__[\"d\" /* px */])(0);\n    s.width = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lib_dom__[\"d\" /* px */])(rect.width * 0.5);\n}\n\nfunction getContext(canvas) {\n    var context = new __WEBPACK_IMPORTED_MODULE_1__lib_ctx_canvas__[\"a\" /* default */](canvas);\n    var bg = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__lib_state__[\"c\" /* getState */])('backgroundColor', 'white');\n    var offset = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__lib_state__[\"c\" /* getState */])('offset', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lib_point__[\"a\" /* default */])(0, 0));\n\n    context.clear();\n    // few visual niceties for on screen rendering\n    var rawCtx = context.ctx;\n    rawCtx.setTransform(0.9, 0, 0, 0.9, canvas.width * 0.05, canvas.height * 0.05);\n    rawCtx.save();\n\n    rawCtx.strokeStyle = '#60A8FF';\n    rawCtx.fillStyle = bg;\n    rawCtx.lineWidth = 0.5;\n    rawCtx.strokeRect(offset.x, offset.y, context.width, context.height);\n    rawCtx.fillRect(offset.x, offset.y, context.width, context.height);\n\n    rawCtx.restore();\n\n    return context;\n}\n\nfunction main() {\n    var container = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lib_dom__[\"b\" /* createElement */])('div', { class: 'extruder-box' });\n    var canvas = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lib_dom__[\"b\" /* createElement */])('canvas');\n    var xyBox = xyTool();\n    var sizeBox = extentTool();\n    container.appendChild(canvas);\n    container.appendChild(xyBox);\n    container.appendChild(sizeBox);\n    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lib_dom__[\"c\" /* body */])().appendChild(container);\n\n    var rect = container.getBoundingClientRect();\n\n    canvas.width = rect.width;\n    canvas.height = rect.height;\n    canvas.addEventListener('mousedown', startMoving, false);\n    canvas.addEventListener('mouseup', stopMoving, false);\n    canvas.addEventListener('mousemove', isMoving, false);\n\n    var keys = ['x', 'y', 'width', 'height', 'font', 'text', 'knockout'];\n    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__lib_state__[\"d\" /* onStateChange */])(function (state) {\n        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__extrude__[\"a\" /* default */])(getContext(canvas), state);\n    }, keys);\n\n    xyLay(xyBox, rect);\n    sizeLay(sizeBox, rect);\n}\n\n//////////////////\n// WEBPACK FOOTER\n// ./extruder.js\n// module id = ./extruder.js\n// module chunks = 0\n\n//# sourceURL=webpack:///./extruder.js?");

/***/ })

})