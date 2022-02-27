declare const kix: (parent: Element, child: any) => any
export { kix };
export default kix;

declare global {
  declare module "kix" {
    export { kix };
    export default kix;
  }
}
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
