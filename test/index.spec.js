"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
var input = {
    _id: 'xyz',
    sides: [],
    retail_price: 39.99,
    sku: '',
    title: 'One Size',
    weight: 0,
    currency: 'USD',
    options: [{
            is_preselected: false,
            position: 0,
            slug: 'one-size',
            value: 'One Size',
            name: 'One Size',
            attribute: 'abc'
        }],
    attributes: ['one-size'],
    image: 'https://xxx.abc.net/hishawk.com/products/1234/front/thumb.jpg'
};
describe('Json2JSDoc', function () {
    it('should pass: non description', function () {
        var jsdoc = (0, index_1.json2JSDoc)(input, {
            memberOf: 'Single.Product',
            namespace: 'Variant'
        });
        expect(jsdoc).toBe('/** @namespace Variant\n * @memberOf Single.Product\n * @property {string} _id\n * @property {*[]} sides\n * @property {number} retail_price\n * @property {string} sku\n * @property {string} title\n * @property {number} weight\n * @property {string} currency\n * @property {Single.Product,Variant,options[]} options\n * @property {string[]} attributes\n * @property {string} image\n */\n/** @namespace options\n * @memberOf Single.Product.Variant\n * @property {boolean} is_preselected\n * @property {number} position\n * @property {string} slug\n * @property {string} value\n * @property {string} name\n * @property {string} attribute\n */');
    });
    it('should pass: with description', function () {
        var jsdoc = (0, index_1.json2JSDoc)(input, {
            memberOf: 'Single.Product',
            namespace: 'Variant',
            useInputValueAsDescription: true
        });
        expect(jsdoc).toBe('/** @namespace Variant\n * @memberOf Single.Product\n * @property {string} _id - "xyz"\n * @property {*[]} sides\n * @property {number} retail_price - 39.99\n * @property {string} sku - ""\n * @property {string} title - "One Size"\n * @property {number} weight - 0\n * @property {string} currency - "USD"\n * @property {Single.Product,Variant,options[]} options\n * @property {string[]} attributes - "one-size"\n * @property {string} image - "https://xxx.abc.net/hishawk.com/products/1234/front/thumb.jpg"\n */\n/** @namespace options\n * @memberOf Single.Product.Variant\n * @property {boolean} is_preselected - false\n * @property {number} position - 0\n * @property {string} slug - "one-size"\n * @property {string} value - "One Size"\n * @property {string} name - "One Size"\n * @property {string} attribute - "abc"\n */');
    });
});
