declare global {
  declare module "kix" {
    // function  ()=>any;
    type kix = (parent: Element, child: any) => any;

    export default kix;
  }
}
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
