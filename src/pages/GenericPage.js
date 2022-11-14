import { css, html, LitElement } from 'lit';

export class GenericPage extends LitElement {
  static get styles() {
    return css`
      :host {
        color: black
      }
    `;
  }

  render() {
    return html`
      <div>Generic page</div>
    `;
  }
}
