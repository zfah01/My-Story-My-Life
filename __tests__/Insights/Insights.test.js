import 'react-native';
import React from 'react';
import Insights from '../../screens/Insights/Insights';

import { cleanup, render } from '@testing-library/react-native';

afterEach(cleanup);

describe('Test to check Insights is rendered', () => {
  const extraData = { 'id': 1, 'name': 'Stephen James' };
  const insightsRender = render(<Insights  extraData={extraData} />).toJSON();
  
  it('Checks to see if the Home page renders', () => {
      expect(insightsRender).toMatchSnapshot();
  });

});