declare const kix: (parent?: Element | null, child: any) => any
export { kix };
export default kix;

declare global {
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
  }
  declare var module: { exports: any }

  namespace JSX {
    interface ElementAttributesProperty {
      ____$$$$$$$$$$$Props: Omit<this, "____$$$$$$$$$$$Props">;
    }
    type IntrinsicElements = {
      [TagName in keyof HTMLElementTagNameMap]: Partial<
        {
          e: Partial<{
            [EventName in keyof HTMLElementEventMap]: (
              this: HTMLElementTagNameMap[TagName],
              event: HTMLElementEventMap[EventName]
            ) => any;
          }>;
        } & {
          [EventName in keyof HTMLElementEventMap as `on${Capitalize<EventName>}`]: (
            this: HTMLElementTagNameMap[TagName],
            event: HTMLElementEventMap[EventName]
          ) => any;
        }
      >;
    };
    interface Element { }
  }

}



