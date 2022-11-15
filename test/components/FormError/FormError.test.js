import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';

import '../../../src/components/FormError/FormError.js';

describe('FormError', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<form-error message='test'></form-error>`);
  });

  it('renders a button', async () => {
    const err = element.shadowRoot.querySelector('div');
    expect(err).to.exist;
    expect(err.textContent).to.be.equal('test');
  });


  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
