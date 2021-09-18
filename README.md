#json2jsdoc

I wrote this module when I have not yet known to typescript.

Advise: Learn `typescript`, do not use this module

#usage

```js
const converter = new Json2JSDoc(json, {
  namespace: namespace === '' ? 'json2JSDoc' : namespace,
  memberOf,
  break_line: '\r\n',
  add_content_as_description: active_description
});
const jsdoc = converter.convert().export();
```
