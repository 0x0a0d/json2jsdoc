class Json2JSDoc {
  constructor(input, {namespace = 'Default', memberOf, break_line = '\n'} = {}) {
    this.input = input;
    this.namespace = namespace;
    this.memberOf = memberOf === '' ? null: memberOf;
    this.break_line = break_line;
    this.json_list = [];
    this.convert();
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
            is_array
          };
        case "object":
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
        debugger
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
    return this.json_list.map(({namespace, memberOf, body}) => {
      const jsdoc = [];
      jsdoc.push(`/** @namespace ${namespace}`);
      if (memberOf != null) jsdoc.push(` * @memberOf ${memberOf}`);
      body.forEach(({type, name, is_array}) => {
        jsdoc.push(` * @property {${type}${is_array === true?'[]':''}} ${name}`)
      });
      jsdoc.push(' */');
      return jsdoc.join(this.break_line);
    }).join(this.break_line);
  }
}

module.exports = Json2JSDoc;
