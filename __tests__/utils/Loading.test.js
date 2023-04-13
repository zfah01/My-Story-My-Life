import 'react-native';
import React from 'react';
import Loading from '../../utils/Loading';

import renderer from 'react-test-renderer';

it('Test to check that Loading is rendered', () => {
  const tree = renderer.create(<Loading />).toJSON();
  expect(tree).toMatchSnapshot();
});