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
  readonly getPathParams: <R extends RouteParamsType>(path: string) => R
  readonly getGlobalParams: <R extends RouteParamsType>() => R
  readonly history: typeof window.history
}
/// END EXPORT ROUTE PARAMS ////////////////////////////////////////////////////

/// START PROPERTY LISTENER /////////////////////////////////////////
export declare type ListenerCallback<O extends Record<any, any>, K extends keyof O> = (value: O[K], propertyName: K, object: O) => void;
export interface ListenerReturnType<O extends Record<any, any>, K extends keyof O> {
  addCallback: (callback: ListenerCallback<O, K>) => ListenerReturnType<O, K>;
  addChildListener: (callback: ListenerCallback<O, K>) => ListenerReturnType<O, K>;
  close: () => ListenerReturnType<O, K>;
  open: () => ListenerReturnType<O, K>;
  init: () => ListenerReturnType<O, K>;
  isOpen: () => boolean;
  getValue: () => O[K];
}
export declare const useListener: <O extends Record<any, any>, K extends keyof O>(objectValue: O, propertyName: K, callback?: ListenerCallback<O, K>) => ListenerReturnType<O, K>;
/// END PROPERTY LISTENER ///////////////////////////////////////////

/// START OBJECT LISTENER /////////////////////////////////////////
export declare type ObjectListenerCallback<O extends Record<any, any>, K extends keyof O> = (object: O, propertyName: K, value: O[K]) => void;
export interface ObjectListenerReturnType<O extends Record<any, any>, K extends keyof O> {
  addCallback: (callback: ObjectListenerCallback<O, K>) => ObjectListenerReturnType<O, K>;
  addChildListener: (callback: ObjectListenerCallback<O, K>) => ObjectListenerReturnType<O, K>;
  close: () => ObjectListenerReturnType<O, K>;
  open: () => ObjectListenerReturnType<O, K>;
  initEach: (eachProperties?: K[]) => ObjectListenerReturnType<O, K>;
  isOpen: () => boolean;
  getValue: () => O;
}
export declare const useObjectListener: <O extends Record<any, any>, K extends keyof O>(
  object: O,
  callback: ObjectListenerCallback<O, K>,
  listenKeys?: K[],
) => ObjectListenerReturnType<O, K>;
/// END OBJECT LISTENER ///////////////////////////////////////////

/// START ABSTRACT NODE ///////////////////////////////////////// 
export declare const createElement: <T extends Lowercase<string>>(tagName: T, renderCallback: (
  objectNode: { [K in T]: any } & Record<any, any>,
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
  setCallback: (node: HTMLElement, attributeName: A, value: any, setAttribute: (node: HTMLElement, attributeName: A, value: string) => void) => any,
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



} 