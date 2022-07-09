/// <reference lib="dom" />


declare const kix: (parent?: HTMLElement | null | undefined, child: any) => any

export { kix };
export default kix;




/// START CLASS COMPONENT DECLARATION //////////////////////////////////////////
abstract class AbstractComponent<Model extends Record<string, any>> {
  children: any;
  private ____$$$$$$$$$$$Props: Model;
}

export let Component = class Component { } as new <
  Model extends any = {}
>() => Model & AbstractComponent<Model>;
/// END CLASS COMPONENT DECLARATION ////////////////////////////////////////////

type JSXElementConstructor<P> = ((props: P) => any) | (typeof Component<P>);

export type ComponentProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
  T extends JSXElementConstructor<infer P>
  ? P
  : T extends keyof JSX.IntrinsicElements
  ? JSX.IntrinsicElements[T]
  : {};


/// START EXPORT ROUTE PARAMS //////////////////////////////////////////////////
export const Router: {
  readonly params: { readonly [key: string]: string }
  readonly history: typeof window.history
}
/// END EXPORT ROUTE PARAMS ////////////////////////////////////////////////////

/// START PROPERTY LISTENER /////////////////////////////////////////
export declare type ListenerCallback<T extends string, U extends Record<any, any>> = (value: U[T], propertyName: T, object: U) => any;
export interface ListenerReturnType<T extends string, U extends Record<any, any>> {
  addCallback: (callback: ListenerCallback<T, U>) => ListenerReturnType<T, U>;
  removeCallback: (callback: ListenerCallback<T, U>) => ListenerReturnType<T, U>;
  close: () => void;
  open: () => void;
}
export declare const useListener: <T extends string, U extends Record<any, any>>(objectValue: U, propertyName: T, callback: ListenerCallback<T, U>) => ListenerReturnType<T, U>;
/// END PROPERTY LISTENER ///////////////////////////////////////////


declare global {

  /// START KIX MODULE //////////////////////////////////////////////////
  // declare module "kix" {

  // }
  /// END KIX MODULE //////////////////////////////////////////////////


  /// START GLOBAL DECLARED VARIABLES /////////////////////////////////
  declare var exports: Record<any, any>
  declare var module: { exports: exports }
  /// END GLOBAL DECLARED VARIABLES /////////////////////////////////


  ///START JSX TYPE ////////////////////////////////////////////////////

  type HTMLElements = HTMLElementTagNameMap &
    SVGElementTagNameMap &
    Record<string, {
      prototype: HTMLElement;
      new(): HTMLElement;
    }>;

  type JSXHtmlElementsList = {
    [TagName in keyof HTMLElements]: Partial<{
      $E: Partial<{
        [EventName in keyof HTMLElementEventMap]: (
          this: HTMLElements[TagName],
          event: HTMLElementEventMap[EventName]
        ) => any;
      }>;
    } & {
        [EventName in keyof HTMLElementEventMap as `on${Capitalize<EventName>}`]: (
          this: HTMLElements[TagName],
          event: HTMLElementEventMap[EventName]
        ) => any;
      }> & Record<string, ((element: HTMLElements[TagName]) => any)> | Record<string, any>
  }


  interface JSXElementsMap extends JSXHtmlElementsList {
    "route-link": JSXHtmlElementsList["a"],
    "route-switch": {
      path: string,
      unique?: boolean,
      component: any
    },
    "route-block": {
      ifEmptyComponent?: any
    }

  }

  namespace JSX {
    interface ElementClass {
      render: () => any;
    }
    interface ElementAttributesProperty {
      ____$$$$$$$$$$$Props: Omit<this, "____$$$$$$$$$$$Props">;
    }
    type IntrinsicElements = JSXElementsMap

    interface Element { }
  }
  ///END JSX TYPE ////////////////////////////////////////////////////// 

  declare module '*.svg' {
    const Component: JSX.Element;
    export default Component;
    export const url: string;
  }

  declare module '*.scss' {
    export default Text;
  }
  declare module '*.sass' {
    export default Text;
  }
  declare module '*.css' {
    export default Text;
  }

  declare module "*" {
    const url: string;
    export default url;
  }

} 