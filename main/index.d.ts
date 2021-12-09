/// <reference lib="DOM" />

declare module "kix" {
  const kix: any;
  export default kix;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
