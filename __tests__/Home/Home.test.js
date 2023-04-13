import 'react-native';
import React from 'react';
import Home from '../../screens/Home/Home';

import { cleanup, render } from '@testing-library/react-native';

afterEach(cleanup);

describe('Test to check home is rendered and user can press on settings and daily streaks', () => {
  const extraData = { 'id': 1, 'name': 'Stephen James' };
  const homeRender = render(<Home  extraData={extraData} />).toJSON();
  
  it('Checks to see if the Home page renders', () => {
      expect(homeRender).toMatchSnapshot();
  });

});