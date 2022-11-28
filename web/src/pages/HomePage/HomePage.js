import {css, html, LitElement} from 'lit';
import '../../components/PageTemplate/PageTemplate.js'

class HomePage extends LitElement {
  render() {
    return html`
      <page-template>
        <div slot="content">Homepage Content</div>
      </page-template>
    `
  }
}

customElements.define('home-page', HomePage);
