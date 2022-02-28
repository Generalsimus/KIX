declare const kix: (parent?: Element | null, child: any) => any
export { kix };
export default kix;

declare global {
  declare module "kix" {
    export { kix };
    export default kix;
  }
  declare var module: { exports: any }
}
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
