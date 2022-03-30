

/// <reference lib="dom" />

declare const kix: (parent?: HTMLElement | null | undefined, child: any) => any

export { kix };
export default kix;


export let Component = class Component { } as new <
  Model extends {
    [key: string]: any;
  } = {}
  >() => Model & {
    children: any;
    ____$$$$$$$$$$$Props: Model;
  };


/// START CLASS COMPONENT DECLARATION //////////////////////////////////////////
abstract class AbstractComponent<Model extends Record<string, any>> {
  children: any;
  private ____$$$$$$$$$$$Props: Model;
}

export let Component = class Component { } as new <
  Model extends Record<string, any> = {}
  >() => Model & AbstractComponent<Model>;
/// END CLASS COMPONENT DECLARATION ////////////////////////////////////////////



/// START EXPORT ROUTE PARAMS //////////////////////////////////////////////////
export var routeParams: { readonly [key: string | number | symbol]: any } = {}
/// END EXPORT ROUTE PARAMS ////////////////////////////////////////////////////

/// START PROPERTY LISTENER /////////////////////////////////////////
export declare type ListenerCallback<T extends string, U extends Record<any, any>> = (value: U[T], propertyName: T) => any;
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


  namespace JSX {
    interface ElementClass {
      render: () => any;
    }
    interface ElementAttributesProperty {
      ____$$$$$$$$$$$Props: Omit<this, "____$$$$$$$$$$$Props">;
    }
    type IntrinsicElements = {
      [TagName in keyof HTMLElements]: Partial<{
        e: Partial<{
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
        }> & Record<string, any>;
    };
    interface Element { }
  }
  ///END JSX TYPE ////////////////////////////////////////////////////// 



}
// // // HTMLElement
// export { kix };
// export * from "kix"
// export { default as default } from "kix"


