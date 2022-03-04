declare const kix: (parent?: Element | null, child: any) => any
export { kix };
export default kix;

declare global {
  declare module "kix" {
    export { kix };
    export default kix;
  }
  declare var module: { exports: any }

  interface Object extends Object {
    addEventListener: (e: string, callBack: () => any) => any
  }
  interface Array extends Array {
    addEventListener: (e: string, callBack: () => any) => any
  }
}
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
