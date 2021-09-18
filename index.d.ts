declare type BreakLine = '\n' | '\r\n' | string;
declare type Json2JSDocOptions = {
    /**
     * namespace
     * @example Default
     */
    namespace?: string;
    /**
     * parent of this namespace
     * @example Parent.NameSpace
     */
    memberOf?: string;
    /**
     * breaks line: \r\n or \n
     * @default "\n"
     */
    breakLine?: BreakLine;
    /**
     * use value of input object's key as description on jsdoc params
     * @default false
     */
    useInputValueAsDescription?: boolean;
};
export default class Json2JSDoc {
    private input;
    private namespace;
    private memberOf;
    private readonly breakLine;
    private useInputValueAsDescription;
    private jsonList;
    constructor(input: object, { namespace, memberOf, breakLine, useInputValueAsDescription }?: Json2JSDocOptions);
    convert({ input, namespace, memberOf }?: {
        input?: object | undefined;
        namespace?: string | undefined;
        memberOf?: string | null | undefined;
    }): this;
    export(): string;
}
export {};
