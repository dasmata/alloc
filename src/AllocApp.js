import { LitElement, html } from 'lit';
import './pages/Login/LoginPage'
import di from './DI'

class AllocApp extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      pageElement: { type: HTMLElement}
    };
  }

  constructor() {
    super();
    this.title = 'My app';
  }

  setPage(pageElement){
    this.pageElement = pageElement;
  }

  async connectedCallback() {
    super.connectedCallback();
    di().init(this)
    const router = await di('router');
    router.init()
  }

  render() {
    return this.pageElement || html`<div>Loading...</div>`;
  }
}

customElements.define('alloc-app', AllocApp);
