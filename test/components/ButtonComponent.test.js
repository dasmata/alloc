import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';

import '../../src/components/ButtonComponent/ButtonComponent.js';

describe('ButtonComponent', () => {
  let element;
  const slotNames = [
    'prefix-icon',
    'label',
    'sufix-icon'
  ]
  beforeEach(async () => {
    element = await fixture(html`<button-component><span slot='label'>test</span></button-component>`);
  });

  it('renders a button', async () => {
    const btn = element.shadowRoot.querySelector('button');
    expect(btn).to.exist;
  });

  it('renders the label', async () => {
    const label = element.querySelector('span[slot=label]');
    expect(label.innerText).to.be.equal('test')
    expect(label).to.exist;
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
