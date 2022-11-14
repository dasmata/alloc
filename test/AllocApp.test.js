import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';

import '../src/AllocApp';

describe('AllocApp', () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<alloc-app></alloc-app>`);
  });

  it('renders the loader', () => {
    const div = element.shadowRoot.querySelector('div');
    expect(div).to.exist;
    expect(div.textContent).to.equal('Loading...');
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
