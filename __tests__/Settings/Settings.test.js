import 'react-native';
import React from 'react';
import Settings from '../../screens/Settings/Settings';

import renderer from 'react-test-renderer';

it('Test to check Settings is rendered', () => {
  const tree = renderer.create(<Settings />).toJSON();
  expect(tree).toMatchSnapshot();
});