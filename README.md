# json2jsdoc

> If you have time, should learn both `jsdoc`, `typescript`

# usage

```js
import { json2JSDoc } from 'index'

const jsdoc = new json2JSDoc(json, {
  namespace: 'Default',
  memberOf: 'Parent.Namespace',
  break_line: '\r\n', // optional
  add_content_as_description: active_description // optional
});
// input 
//  {
//    "_id": "xyz",
//    "sides": [],
//    "retail_price": 39.99,
//    "sku": "",
//    "title": "One Size",
//    "weight": 0,
//    "currency": "USD",
//    "options": [{
//      "is_preselected": false,
//      "position": 0,
//      "slug": "one-size",
//      "value": "One Size",
//      "name": "One Size",
//      "attribute": "abc"
//    }],
//    "attributes": ["one-size"],
//    "image": "https://xxx.abc.net/hishawk.com/products/1234/front/thumb.jpg"
//  }

// output
//   /** @namespace Variant
//   * @memberOf Single.Product
//   * @property {string} _id
//   * @property {*[]} sides
//   * @property {number} retail_price
//   * @property {string} sku
//   * @property {string} title
//   * @property {number} weight
//   * @property {string} currency
//   * @property {Single.Product,Variant,options[]} options
//   * @property {string[]} attributes
//   * @property {string} image
//   */
//  /** @namespace options
//   * @memberOf Single.Product.Variant
//   * @property {boolean} is_preselected
//   * @property {number} position
//   * @property {string} slug
//   * @property {string} value
//   * @property {string} name
//   * @property {string} attribute
//   */
```

# demo
[https://0x0a0d.github.io](https://0x0a0d.github.io)
