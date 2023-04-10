import 'react-native';
import React from 'react';
import MoodCalendar from '../../screens/MoodCalendar/MoodCalendar';

import { cleanup, render } from '@testing-library/react-native';

afterEach(cleanup);

describe('Testing that mood journal is rendered', () => {
  const extraData = { 'id': 1, 'name': 'Stephen James' };
  const moodCalendarRender = render(<MoodCalendar extraData={extraData} />).toJSON();

  it('Test to check if home page is rendered', () => {
    expect(moodCalendarRender).toMatchSnapshot();
  });

  it('Test to check mood key is rendered', () => {
    const {getByTestId} = render(<MoodCalendar extraData={extraData} />);
    const textCalendarKey = getByTestId('calendarKeyID');
    expect(textCalendarKey.props.children).toEqual('Mood Key:');
  });

  it('Test to check if calendar is rendered', () => {
  const {getByTestId} = render(<MoodCalendar extraData={extraData} />);
  const calendar = getByTestId('idMoodCalendar');
  expect(calendar.type).toEqual('View');
  });

});