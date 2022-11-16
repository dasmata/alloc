import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';

import '../../src/components/SpinnerLoader/SpinnerLoader.js';

describe('SpinnerLoader', () => {
  it('renders the loader', async () => {
    const element = await fixture(html`<spinner-loader visible></spinner-loader>`);
    const err = element.shadowRoot.querySelector('div');
    expect(err).to.exist;
  });

  it('does not render the loader', async () => {
    const element = await fixture(html`<spinner-loader></spinner-loader>`);
    const err = element.shadowRoot.querySelector('div');
    expect(err).to.not.exist;
  });

  it('passes the a11y audit', async () => {
    const element = await fixture(html`<spinner-loader visible></spinner-loader>`);
    await expect(element).shadowDom.to.be.accessible();
  });
});
