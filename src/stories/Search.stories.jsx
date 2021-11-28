import React from 'react';

import Page from '../App';

export default {
  title: 'Example/App',
  component: Page,
};

const Template = (args) => <Page {...args} />;

export const SearchDemo = Template.bind({});
SearchDemo.args = {};

