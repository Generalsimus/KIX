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
export interface RouteParamsType {
  readonly [key: string]: string
}
export const Router: {
  readonly getPathParams: (path: string) => RouteParamsType
  readonly getGlobalParams: () => RouteParamsType
  readonly history: typeof window.history
}
/// END EXPORT ROUTE PARAMS ////////////////////////////////////////////////////

/// START PROPERTY LISTENER /////////////////////////////////////////
export declare type ListenerCallback<T extends string, U extends Record<any, any>> = (value: U[T], propertyName: T, object: U) => any;
export interface ListenerReturnType<T extends string, U extends Record<any, any>> {
  addCallback: (callback: ListenerCallback<T, U>) => ListenerReturnType<T, U>;
  addChildListener: (callback: ListenerCallback<T, U>) => ListenerReturnType<T, U>;
  close: () => ListenerReturnType<T, U>;
  open: () => ListenerReturnType<T, U>;
  init: () => ListenerReturnType<T, U>;
  isOpen: () => boolean;
  getValue: () => U[T];
}
export declare const useListener: <T extends string, U extends Record<any, any>>(objectValue: U, propertyName: T, callback: ListenerCallback<T, U>) => ListenerReturnType<T, U>;
/// END PROPERTY LISTENER ///////////////////////////////////////////

/// START ABSTRACT NODE ///////////////////////////////////////// 
export declare const createElement: <T extends string>(tagName: T, renderCallback: (
  objectNode: { [K: T]: any } & Record<any, any>,
  tagName: T,
  kix: typeof kix,
  createElement: (tagName: string) => NODE,
  setAttribute: (node: HTMLElement, attributeName: string, value: string) => NODE,
  createObjectElement: (objectNode: Record<any, any>) => NODE,
) => any) => void
/// END ABSTRACT NODE ///////////////////////////////////////////

/// START ABSTRACT ATTRIBUTE ///////////////////////////////////////// 
export declare const createAttribute: <A extends string>(
  attributeName: A,
  setCallback: (node: HTMLElement, attributeName: A, value: string, setAttribute: (node: HTMLElement, attributeName: A, value: string) => void) => any,
  autoSet?: boolean
) => void
/// END ABSTRACT ATTRIBUTE ///////////////////////////////////////////




declare global {

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
      [EventName in keyof HTMLElementEventMap as `on${Capitalize<EventName>}`]: (
        this: HTMLElements[TagName],
        event: HTMLElementEventMap[EventName],
        element: HTMLElements[TagName]
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
    type EL<Props = {}> = (props: Props & { children?: any }) => any;
    type ElementClass = Component
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