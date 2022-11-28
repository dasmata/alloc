import {css, html, LitElement} from "lit";

class PageTemplate extends LitElement {
  static get styles(){
    return css`
      :host {
        display:flex;
        width: 100vw;
        height: 100vh;
      }

      aside {
        width: 27vh;
        background: var(--color-base-white-100);
        box-shadow: 0 0 15px rgba(0,0,0, 0.12);
      }

      slot {
        padding: var(--size-5x);
        display: block;
      }
    `
  }

  render() {
    return html`
      <aside>
        <slot name="logo">CompanyLogo</slot>
        <slot name="menu">

        </slot>
      </aside>
      <main>
        <slot name="content"></slot>
      </main>
    `
  }
}

customElements.define('page-template', PageTemplate);
