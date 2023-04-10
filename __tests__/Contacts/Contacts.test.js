import 'react-native';
import React from 'react';
import Contacts from '../../screens/Contacts/Contacts';

import { cleanup, render } from '@testing-library/react-native';

afterEach(cleanup);

describe('Test to check Contacts page is rendered and if user can press help and advice', () => {
  const extraData = { 'id': 1, 'name': 'Stephen James' };
  const contactsRender = render(<Contacts extraData={extraData} />).toJSON();
  
  it('Checks to see if the Contacts page renders', () => {
      expect(contactsRender).toMatchSnapshot();
  });

});