import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';

import '../../src/components/ToastMessage/ToastMessage.js';

describe('ToastMessage', () => {
  it('renders a toast message', async () => {
    await fixture(html`<toast-message message='test' type='error' visible></toast-message>`);
    const container = document.querySelector('toast-container');
    const toasthtml = container.shadowRoot.querySelector('.toast-message');
    expect(toasthtml).to.exist;
    container.shadowRoot.querySelector('.toast-container').removeChild(toasthtml)
  });

  it('auto-removes a toast message', async () => {
    await fixture(html`<toast-message message='test' type='error' visible .autoClose=${1}></toast-message>`);
    const container = document.querySelector('toast-container');
    expect(container.shadowRoot.querySelector('.toast-message')).to.exist;
    await (new Promise(r => {setTimeout(() => r(), 1500)}))
    expect(container.shadowRoot.querySelector('.toast-message')).to.not.exist;
  });

  it('renders all message types', async () => {
    const types = ['error', 'warning', 'info', 'success']
    await Promise.all(
        types.map(async type => await fixture(
          html`<toast-message message='test' type='${type}' visible .autoClose=${0}></toast-message>`)
        )
    )

    const container = document.querySelector('toast-container');
    const messages = container.shadowRoot.querySelectorAll('.toast-message');
    expect(messages).to.have.length(4)
    messages.forEach(el => {
      expect(types).to.contain(Array.from(el.classList)[0])
    })
  });

  it('passes the a11y audit', async () => {
    await fixture(html`<toast-message message='test' type='error' visible></toast-message>`);
    const container = document.querySelector('toast-container');
    await expect(container).shadowDom.to.be.accessible();
  });
});
