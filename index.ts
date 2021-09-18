type BreakLine = '\n' | '\r\n' | string

type Json2JSDocOptions = {
  /**
   * namespace
   * @example Default
   */
  namespace?: string
  /**
   * parent of this namespace
   * @example Parent.NameSpace
   */
  memberOf?: string
  /**
   * breaks line: \r\n or \n
   * @default "\n"
   */
  breakLine?: BreakLine
  /**
   * use value of input object's key as description on jsdoc params
   * @default false
   */
  useInputValueAsDescription?: boolean
}
type JsonBodyObject = {
  type: string,
  name: string,
  isArray?: boolean,
  value?: string
}
type JsonList = {
  namespace: string
  memberOf: string | null
  body: JsonBodyObject[]
}

function correctNamespace(namespace) {
  return namespace.replace(/[^a-zA-Z0-9_]/g, '_')
}

export default class Json2JSDoc {
  private input: object
  private namespace: string
  private memberOf: null | string
  private readonly breakLine: BreakLine
  private useInputValueAsDescription: boolean
  private jsonList: JsonList[]

  constructor(input: object, { namespace = 'Default', memberOf, breakLine = '\n', useInputValueAsDescription = false }: Json2JSDocOptions = {}) {
    if (typeof input !== 'object' || input == null) throw new Error(`Only support non-null object as input`)

    this.input = Array.isArray(input) ? input[0] : input
    this.namespace = namespace
    this.memberOf = memberOf || null
    this.breakLine = breakLine
    this.useInputValueAsDescription = useInputValueAsDescription
    this.jsonList = []
  }

  convert({ input = this.input, namespace = this.namespace, memberOf = this.memberOf } = {}) {
    const body: JsonBodyObject[] = Object.keys(input).map(key => {
      const isArray = Array.isArray(input[key])
      const value = isArray ? input[key][0] : input[key]

      const valueType = typeof value
      switch (valueType) {
        case 'undefined':
          return {
            type: '*',
            name: key,
            isArray
          }
        case 'number':
        case 'string':
        case 'boolean':
        case 'function':
          return {
            type: valueType,
            name: key,
            isArray,
            value: JSON.stringify(value)
          }
        case 'object':
          if (value == null) {
            return {
              type: 'null|*',
              name: key
            }
          }
          this.convert({
            input: value,
            namespace: correctNamespace(key),
            memberOf: `${memberOf == null ? '' : `${memberOf}.`}${namespace}`
          })
          return {
            type: `${memberOf == null ? '' : `${memberOf}.`}${namespace}.${correctNamespace(key)}`,
            isArray,
            name: key
          }
        default:
          console.warn(`New value type '${valueType}'`)
          return null
      }
    }).filter(x => x != null) as JsonBodyObject[]

    this.jsonList.unshift({
      namespace,
      memberOf,
      body
    })
    return this
  }

  export(): string {
    return this.jsonList.map(({ namespace, memberOf, body }) => {
      const jsdoc: string[] = []
      jsdoc.push(`/** @namespace ${namespace}`)
      if (memberOf != null) jsdoc.push(` * @memberOf ${memberOf}`)
      body
        .filter(x => x != null)
        .forEach(({ type, name, isArray, value }) => {
          if (value != null && this.useInputValueAsDescription) {
            jsdoc.push(` * @property {${type}${isArray === true ? '[]' : ''}} ${name} - ${value}`)
          } else {
            jsdoc.push(` * @property {${type}${isArray === true ? '[]' : ''}} ${name}`)
          }
        })
      jsdoc.push(' */')
      return jsdoc.join(this.breakLine)
    }).join(this.breakLine)
  }
}
