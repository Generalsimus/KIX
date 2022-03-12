
export type JSXElement = any
declare const kix: (parent?: HTMLElement | null | undefined, child: JSXElement) => any
// HTMLElement
export { kix };
export default kix;


/// <reference lib="dom" />
declare global {
  /// START KIX MODULE //////////////////////////////////////////////////
  declare module "kix" {
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
  }
  /// END KIX MODULE //////////////////////////////////////////////////


  /// START GLOBAL DECLARED VARIABLES /////////////////////////////////
  declare var exports: Record<any, any>
  declare var module: { exports: exports }
  /// END GLOBAL DECLARED VARIABLES /////////////////////////////////


  ///START JSX TYPE ////////////////////////////////////////////////////
  abstract class AbstractComponent<Model extends Record<string, any>> {
    children: any;
    private ____$$$$$$$$$$$Props: Model;
  }
  export let Component = class Component { } as new <
    Model extends Record<string, any> = {}
    >() => Model & AbstractComponent<Model>;

  type HTMLElements = HTMLElementTagNameMap &
    SVGElementTagNameMap &
    Record<string, {
      prototype: HTMLElement;
      new(): HTMLElement;
    }>;


  namespace JSX {
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



