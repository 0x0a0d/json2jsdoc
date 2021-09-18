"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function correctNamespace(namespace) {
    return namespace.replace(/[^a-zA-Z0-9_]/g, '_');
}
var Json2JSDoc = /** @class */ (function () {
    function Json2JSDoc(input, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.namespace, namespace = _c === void 0 ? 'Default' : _c, memberOf = _b.memberOf, _d = _b.breakLine, breakLine = _d === void 0 ? '\n' : _d, _e = _b.useInputValueAsDescription, useInputValueAsDescription = _e === void 0 ? false : _e;
        if (typeof input !== 'object' || input == null)
            throw new Error("Only support non-null object as input");
        this.input = Array.isArray(input) ? input[0] : input;
        this.namespace = namespace;
        this.memberOf = memberOf || null;
        this.breakLine = breakLine;
        this.useInputValueAsDescription = useInputValueAsDescription;
        this.jsonList = [];
    }
    Json2JSDoc.prototype.convert = function (_a) {
        var _this = this;
        var _b = _a === void 0 ? {} : _a, _c = _b.input, input = _c === void 0 ? this.input : _c, _d = _b.namespace, namespace = _d === void 0 ? this.namespace : _d, _e = _b.memberOf, memberOf = _e === void 0 ? this.memberOf : _e;
        var body = Object.keys(input).map(function (key) {
            var isArray = Array.isArray(input[key]);
            var value = isArray ? input[key][0] : input[key];
            var valueType = typeof value;
            switch (valueType) {
                case 'undefined':
                    return {
                        type: '*',
                        name: key,
                        isArray: isArray
                    };
                case 'number':
                case 'string':
                case 'boolean':
                case 'function':
                    return {
                        type: valueType,
                        name: key,
                        isArray: isArray,
                        value: JSON.stringify(value)
                    };
                case 'object':
                    if (value == null) {
                        return {
                            type: 'null|*',
                            name: key
                        };
                    }
                    _this.convert({
                        input: value,
                        namespace: correctNamespace(key),
                        memberOf: "" + (memberOf == null ? '' : memberOf + ".") + namespace
                    });
                    return {
                        type: "" + (memberOf == null ? '' : memberOf + ".") + namespace + "." + correctNamespace(key),
                        isArray: isArray,
                        name: key
                    };
                default:
                    console.warn("New value type '" + valueType + "'");
                    return null;
            }
        }).filter(function (x) { return x != null; });
        this.jsonList.unshift({
            namespace: namespace,
            memberOf: memberOf,
            body: body
        });
        return this;
    };
    Json2JSDoc.prototype.export = function () {
        var _this = this;
        return this.jsonList.map(function (_a) {
            var namespace = _a.namespace, memberOf = _a.memberOf, body = _a.body;
            var jsdoc = [];
            jsdoc.push("/** @namespace " + namespace);
            if (memberOf != null)
                jsdoc.push(" * @memberOf " + memberOf);
            body
                .filter(function (x) { return x != null; })
                .forEach(function (_a) {
                var type = _a.type, name = _a.name, isArray = _a.isArray, value = _a.value;
                if (value != null && _this.useInputValueAsDescription) {
                    jsdoc.push(" * @property {" + type + (isArray === true ? '[]' : '') + "} " + name + " - " + value);
                }
                else {
                    jsdoc.push(" * @property {" + type + (isArray === true ? '[]' : '') + "} " + name);
                }
            });
            jsdoc.push(' */');
            return jsdoc.join(_this.breakLine);
        }).join(this.breakLine);
    };
    return Json2JSDoc;
}());
exports.default = Json2JSDoc;
