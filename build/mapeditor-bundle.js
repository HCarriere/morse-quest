/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
var MorseQuest;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/MapEditor.ts":
/*!**************************!*\
  !*** ./src/MapEditor.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    };\n    return function (d, b) {\n        if (typeof b !== \"function\" && b !== null)\n            throw new TypeError(\"Class extends value \" + String(b) + \" is not a constructor or null\");\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.MapEditor = void 0;\nvar Engine_1 = __webpack_require__(/*! ./core/Engine */ \"./src/core/Engine.ts\");\nvar MapEditor = /** @class */ (function (_super) {\n    __extends(MapEditor, _super);\n    function MapEditor(canvasid) {\n        if (canvasid === void 0) { canvasid = 'mapeditor'; }\n        return _super.call(this, canvasid) || this;\n    }\n    MapEditor.prototype.onLoop = function () {\n        // TODO\n    };\n    return MapEditor;\n}(Engine_1.Engine));\nexports.MapEditor = MapEditor;\n\n\n//# sourceURL=webpack://MorseQuest/./src/MapEditor.ts?");

/***/ }),

/***/ "./src/core/Engine.ts":
/*!****************************!*\
  !*** ./src/core/Engine.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Engine = void 0;\nvar EngineGraphics_1 = __webpack_require__(/*! ./EngineGraphics */ \"./src/core/EngineGraphics.ts\");\nvar EngineController_1 = __webpack_require__(/*! ./EngineController */ \"./src/core/EngineController.ts\");\nvar Engine = /** @class */ (function () {\n    function Engine(canvasid) {\n        if (!this.initCanvas(canvasid))\n            return;\n        this.loop();\n    }\n    Engine.prototype.initCanvas = function (canvasid) {\n        var _this = this;\n        EngineGraphics_1.EngineGraphics.canvas = document.getElementById(canvasid);\n        if (!EngineGraphics_1.EngineGraphics.canvas) {\n            console.log('canvas no found');\n            return false;\n        }\n        window.addEventListener('resize', function () { _this.resize(); }, false);\n        window.addEventListener('keydown', function (e) { _this.keyPressed(e); });\n        window.addEventListener('mousemove', function (e) { _this.mouseMove(e); });\n        EngineGraphics_1.EngineGraphics.canvas.addEventListener('mousedown', function (e) { _this.mousePressed(e); });\n        EngineGraphics_1.EngineGraphics.ctx = EngineGraphics_1.EngineGraphics.canvas.getContext(\"2d\");\n        if (!EngineGraphics_1.EngineGraphics.ctx) {\n            console.log('2d context setup error');\n            return false;\n        }\n        this.engineObjects = [];\n        return true;\n    };\n    Engine.prototype.loop = function () {\n        var _this = this;\n        EngineGraphics_1.EngineGraphics.ctx.clearRect(0, 0, EngineGraphics_1.EngineGraphics.canvas.width, EngineGraphics_1.EngineGraphics.canvas.height);\n        // background test\n        EngineGraphics_1.EngineGraphics.ctx.fillStyle = '#111';\n        EngineGraphics_1.EngineGraphics.ctx.fillRect(0, 0, EngineGraphics_1.EngineGraphics.canvas.width, EngineGraphics_1.EngineGraphics.canvas.height);\n        for (var _i = 0, _a = this.engineObjects; _i < _a.length; _i++) {\n            var obj = _a[_i];\n            obj.display();\n        }\n        this.onLoop();\n        requestAnimationFrame(function () { _this.loop(); });\n    };\n    Engine.prototype.resize = function () {\n        EngineGraphics_1.EngineGraphics.canvas.width = EngineGraphics_1.EngineGraphics.canvas.parentElement.clientWidth;\n        EngineGraphics_1.EngineGraphics.canvas.height = EngineGraphics_1.EngineGraphics.canvas.parentElement.clientHeight;\n        for (var _i = 0, _a = this.engineObjects; _i < _a.length; _i++) {\n            var obj = _a[_i];\n            obj.resize();\n        }\n    };\n    Engine.prototype.keyPressed = function (e) {\n        for (var _i = 0, _a = this.engineObjects; _i < _a.length; _i++) {\n            var obj = _a[_i];\n            obj.keyPressed(EngineController_1.EngineController.KeyMapping[e.key]);\n        }\n    };\n    Engine.prototype.mousePressed = function (e) {\n        var rect = EngineGraphics_1.EngineGraphics.canvas.getBoundingClientRect();\n        var x = e.clientX - rect.left;\n        var y = e.clientY - rect.top;\n        for (var _i = 0, _a = this.engineObjects; _i < _a.length; _i++) {\n            var obj = _a[_i];\n            // obj.mousePressed(e.offsetX, e.offsetY);\n            obj.mousePressed(x, y);\n        }\n    };\n    Engine.prototype.mouseMove = function (e) {\n        var rect = EngineGraphics_1.EngineGraphics.canvas.getBoundingClientRect();\n        EngineController_1.EngineController.mouseX = e.clientX - rect.left;\n        EngineController_1.EngineController.mouseY = e.clientY - rect.top;\n    };\n    return Engine;\n}());\nexports.Engine = Engine;\n\n\n//# sourceURL=webpack://MorseQuest/./src/core/Engine.ts?");

/***/ }),

/***/ "./src/core/EngineController.ts":
/*!**************************************!*\
  !*** ./src/core/EngineController.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.EngineController = void 0;\nvar EngineController = /** @class */ (function () {\n    function EngineController() {\n    }\n    EngineController.KEY_UP = 1;\n    EngineController.KEY_DOWN = 2;\n    EngineController.KEY_LEFT = 3;\n    EngineController.KEY_RIGHT = 4;\n    EngineController.KeyMapping = {\n        'z': EngineController.KEY_UP,\n        's': EngineController.KEY_DOWN,\n        'q': EngineController.KEY_LEFT,\n        'd': EngineController.KEY_RIGHT,\n        'ArrowUp': EngineController.KEY_UP,\n        'ArrowDown': EngineController.KEY_DOWN,\n        'ArrowLeft': EngineController.KEY_LEFT,\n        'ArrowRight': EngineController.KEY_RIGHT,\n    };\n    EngineController.mousePressed = false;\n    return EngineController;\n}());\nexports.EngineController = EngineController;\n\n\n//# sourceURL=webpack://MorseQuest/./src/core/EngineController.ts?");

/***/ }),

/***/ "./src/core/EngineGraphics.ts":
/*!************************************!*\
  !*** ./src/core/EngineGraphics.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.EngineGraphics = void 0;\nvar EngineGraphics = /** @class */ (function () {\n    function EngineGraphics() {\n    }\n    return EngineGraphics;\n}());\nexports.EngineGraphics = EngineGraphics;\n\n\n//# sourceURL=webpack://MorseQuest/./src/core/EngineGraphics.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/MapEditor.ts");
/******/ 	MorseQuest = __webpack_exports__;
/******/ 	
/******/ })()
;