import 'react-native';
import React from 'react';
import AddLifeEvent from '../../screens/Memories/AddLifeEvent';
 
import { cleanup, render, fireEvent } from '@testing-library/react-native';

afterEach(cleanup);

describe('Check that the add new life event is rendered and elements are displayed and updateable.', () => {
  const extraData = { 'id': 1, 'name': 'Stephen James' };
  const addLifeEventRender = render(<AddLifeEvent  extraData={extraData} />).toJSON();
  
  
  it('Checks to see if the Home page renders', () => {
      expect(addLifeEventRender).toMatchSnapshot();
  });

  jest.mock("@react-navigation/native", () => {
    const actualNav = jest.requireActual("@react-navigation/native")
    return {
      ...actualNav,
      useFocusEffect: () => jest.fn(),
      useNavigation: () => ({
        navigate: jest.fn(),
      }),
    }
  })

  it('Checks to see if the moods are displayed.', () => {
    const {getByTestId} = render(<AddLifeEvent extraData={extraData} />);
    const renderHappy = getByTestId('happy');
    const renderConfused = getByTestId('confused');
    const renderSad = getByTestId('sad');
    const renderAngry = getByTestId('angry');
    const renderLoved = getByTestId('loved');
    const renderScared = getByTestId('scared');
    const renderFunny = getByTestId('funny');

    expect(renderHappy.type).toBe('Image');
    expect(renderConfused.type).toBe('Image');
    expect(renderSad.type).toBe('Image');
    expect(renderAngry.type).toBe('Image');
    expect(renderLoved.type).toBe('Image');
    expect(renderScared.type).toBe('Image');
    expect(renderFunny.type).toBe('Image');
    
  });

  it('Checks to see if the story and title inputs are displayed.', () => {
    const {getByTestId} = render(<AddLifeEvent extraData={extraData} />);

    const titleID = getByTestId('titleInput');
    const storyID = getByTestId('storyInput');

    const titlePlaceholder = 'Title';
    const storyPlaceholder = 'Write your story here! ';
    
    expect(titleID.props.placeholder).toBe(titlePlaceholder);
    expect(storyID.props.placeholder).toBe(storyPlaceholder);


  });

  it('Checks to see if the date is displayed and set to the current date.', () => {
    const {getByTestId} = render(<AddLifeEvent extraData={extraData} />);
    const date = new Date();
    const displayDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric'});
    const dateRendered = getByTestId('dateID');

    expect(dateRendered.props.children[1]).toBe(displayDate);
  });

  it('Checks to see if the submit button is accessible via ID.', () => {
    const {getByTestId} = render(<AddLifeEvent extraData={extraData} />);
    const buttonID = getByTestId('buttonSubmit');

    expect(buttonID).toBeTruthy();
  });

  it('Update the story entry and title entry to contain text.', () => {
    const {getByTestId} = render(<AddLifeEvent extraData={extraData} />);
    const titleInput = getByTestId('titleInput');
    const storyInput = getByTestId('storyInput');
    // Expect a blank entry when first loading the page.
    expect(titleInput.props.value).toEqual('');
    expect(storyInput.props.value).toEqual('');

    // Add values to inputs.
    fireEvent.changeText(titleInput, 'Test title entry');
    fireEvent.changeText(storyInput, 'Test story entry');

    // Expect values to be stored in the inputs.
    expect(titleInput.props.value).toEqual('Test title entry');
    expect(storyInput.props.value).toEqual('Test story entry');
  });

});