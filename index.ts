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
  memberOf: string[]
  body: JsonBodyObject[]
}

function correctNamespace(namespace) {
  return namespace.replace(/[^a-zA-Z0-9_]/g, '_')
}

const convert = (input: object, namespace: string, memberOf: string[], jsonList: JsonList[] = []): JsonList[] => {
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
      case 'object': {
        if (value == null) {
          return {
            type: 'null|*',
            name: key
          }
        }
        convert(value, correctNamespace(key), memberOf.concat(namespace), jsonList)
        return {
          type: memberOf.concat(namespace, correctNamespace(key)),
          isArray,
          name: key
        }
      }
      default:
        console.warn(`New value type '${valueType}'`)
        return null
    }
  }).filter(x => x != null) as JsonBodyObject[]

  jsonList.unshift({
    namespace,
    memberOf: memberOf,
    body
  })
  return jsonList
}

export const json2JSDoc = (input: object, options: Json2JSDocOptions = {}): string => {
  if (typeof input !== 'object' || input == null) throw new Error(`Only support non-null object as input`)

  const breakLine = options.breakLine || '\n'

  if (!Array.isArray(input)) {
    input = [input]
  }
  const jsonList: JsonList[] = ([] as JsonList[]).concat(...(input as object[]).map(item => convert(item, options.namespace || 'Default', options.memberOf ? [options.memberOf] : [])))
  return jsonList
    .map(({ namespace, memberOf, body }) => {
      const jsdoc: string[] = []
      jsdoc.push(`/** @namespace ${namespace}`)
      if (Array.isArray(memberOf) && memberOf.length) jsdoc.push(` * @memberOf ${memberOf.join('.')}`)
      body
        .filter(x => x != null)
        .forEach(({ type, name, isArray, value }) => {
          if (value != null && options.useInputValueAsDescription) {
            jsdoc.push(` * @property {${type}${isArray === true ? '[]' : ''}} ${name} - ${value}`)
          } else {
            jsdoc.push(` * @property {${type}${isArray === true ? '[]' : ''}} ${name}`)
          }
        })
      jsdoc.push(' */')
      return jsdoc.join(breakLine)
    })
    .join(breakLine)
}
