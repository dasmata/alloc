import { html, LitElement } from 'lit';

class HomePage extends LitElement {
  render() {
    return html`<main>homepage</main>`
  }
}

customElements.define('home-page', HomePage)
