import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';

import '../../src/components/ButtonComponent/ButtonComponent.js';

describe('ButtonComponent', () => {
  let element;
  const slotNames = [
    'icon',
  ]
  beforeEach(async () => {
    element = await fixture(html`<button-component label="test"></button-component>`);
  });

  it('renders the slots', async () => {
    slotNames.forEach(name => {
      const slots = element.shadowRoot.querySelector(`slot[name=${name}]`);
      expect(slots).to.exist;
    })

  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
