import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';

import '../src/AllocApp';

describe('AllocApp', () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<alloc-app></alloc-app>`);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
