class Json2JSDoc {
  /**
   * @param {object} input
   * @param {string} namespace
   * @param {string} memberOf
   * @param {string} break_line
   * @param {boolean} add_content_as_description
   */
  constructor(input, {namespace = 'Default', memberOf, break_line = '\n', add_content_as_description = false} = {}) {
    if (typeof input !== 'object') throw new Error(`Only support object as input`);
    this.input = Array.isArray(input) ? input[0] : input;
    this.namespace = namespace;
    this.memberOf = memberOf === '' ? null: memberOf;
    this.break_line = break_line;
    this.add_content_as_description = add_content_as_description;
    this.json_list = [];
  }
  /**
   * @return {typeof Json2JSDoc}
   */
  convert({input = this.input, namespace = this.namespace, memberOf = this.memberOf}={}) {
    const body = Object.keys(input).map(key=>{
      const is_array = Array.isArray(input[key]);
      const value = is_array ? input[key][0] : input[key];

      const value_type = typeof value;
      switch (value_type) {
        case "undefined":
          return {
            type: '*',
            name: key,
            is_array
          };
        case "number":
        case "string":
        case "boolean":
        case "function":
          return {
            type: value_type,
            name: key,
            is_array,
            value: value.toString()
          };
        case "object":
          if (value == null) {
            return {
              type: 'null|*',
              name: key
            }
          }
          this.convert({
            input: value,
            namespace: key,
            memberOf: `${memberOf == null ? '' : `${memberOf}.`}${namespace}`
          });
          return {
            type: `${memberOf == null ? '' : `${memberOf}.`}${namespace}.${key}`,
            is_array,
            name: key
          };
        default:
          console.warn(`New value type '${value_type}'`)
      }
    });

    this.json_list.unshift({
      namespace,
      memberOf,
      body
    });
    return this;
  }
  export() {
    return this.json_list.map(({namespace, memberOf, body, value}) => {
      const jsdoc = [];
      jsdoc.push(`/** @namespace ${namespace}`);
      if (memberOf != null) jsdoc.push(` * @memberOf ${memberOf}`);
      body.forEach(({type, name, is_array}) => {
        if (value != null && this.add_content_as_description) {
          jsdoc.push(` * @property {${type}${is_array === true?'[]':''}} ${name} - ${value}`);
        } else {
          jsdoc.push(` * @property {${type}${is_array === true?'[]':''}} ${name}`);
        }
      });
      jsdoc.push(' */');
      return jsdoc.join(this.break_line);
    }).join(this.break_line);
  }
}

module.exports = Json2JSDoc;
