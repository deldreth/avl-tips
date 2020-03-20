/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';


export namespace Components {
  interface AvlTips {}
  interface AvlTipsCard {
    'cash': string;
    'employer': string;
    'name': string;
    'paypal': string;
    'venmo': string;
  }
}

declare global {


  interface HTMLAvlTipsElement extends Components.AvlTips, HTMLStencilElement {}
  var HTMLAvlTipsElement: {
    prototype: HTMLAvlTipsElement;
    new (): HTMLAvlTipsElement;
  };

  interface HTMLAvlTipsCardElement extends Components.AvlTipsCard, HTMLStencilElement {}
  var HTMLAvlTipsCardElement: {
    prototype: HTMLAvlTipsCardElement;
    new (): HTMLAvlTipsCardElement;
  };
  interface HTMLElementTagNameMap {
    'avl-tips': HTMLAvlTipsElement;
    'avl-tips-card': HTMLAvlTipsCardElement;
  }
}

declare namespace LocalJSX {
  interface AvlTips {}
  interface AvlTipsCard {
    'cash'?: string;
    'employer'?: string;
    'name'?: string;
    'paypal'?: string;
    'venmo'?: string;
  }

  interface IntrinsicElements {
    'avl-tips': AvlTips;
    'avl-tips-card': AvlTipsCard;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements {
      'avl-tips': LocalJSX.AvlTips & JSXBase.HTMLAttributes<HTMLAvlTipsElement>;
      'avl-tips-card': LocalJSX.AvlTipsCard & JSXBase.HTMLAttributes<HTMLAvlTipsCardElement>;
    }
  }
}


