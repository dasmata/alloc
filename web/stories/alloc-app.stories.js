import { html } from 'lit';
import '../src/AllocApp.js';

export default {
  title: 'AllocApp',
  component: 'alloc-app',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

function Template({ title, backgroundColor }) {
  return html`
    <alloc-app></alloc-app>
  `;
}

export const App = Template.bind({});
App.args = {
  title: 'My app',
};
