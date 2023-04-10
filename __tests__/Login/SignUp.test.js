import 'react-native';
import React from 'react';
import SignUp, { passwordValid, emailValid } from '../../screens/Login/SignUp';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

import { cleanup, render, fireEvent } from '@testing-library/react-native';

afterEach(cleanup);

describe('Test to check Sign Up page and its functions', () => {

  const fakeNavigation = {
    navigate: jest.fn(),
  };

  it('Test to check Sign Up page is rendered', () => {
    const tree = renderer.create(<SignUp />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Greeting Message', () => {
    const title = 'Welcome to My Story, My Life';
    const { getByText } = render(<SignUp />); 

    const foundTitleText = getByText(title);
    expect(foundTitleText.props.children).toEqual(title);
  });

  it('Find button from  testID', () => {
    const {  getByTestId } = render(<SignUp />);
    const testIdName = 'signUpButton';
    const buttonID = getByTestId(testIdName);

    expect(buttonID).toBeTruthy();
  });

  it('Checks if text inputs recieve data.', () => {
    const { getByTestId } = render(<SignUp />);
    const idTestName = 'inputName';
    const idTestEmail= 'inputEmail';
    const idTestPassword = 'inputPassword';
    const inputName = getByTestId(idTestName);
    const inputEmail = getByTestId(idTestEmail);
    const inputPassword = getByTestId(idTestPassword);

    // Expect a blank entry when first loading the page.
    expect(inputName.props.value).toEqual('');
    expect(inputEmail.props.value).toEqual('');
    expect(inputPassword.props.value).toEqual('');

    // Add values to inputs.
    fireEvent.changeText(inputName, 'Stephen James');
    fireEvent.changeText(inputEmail, 'test@example.com');
    fireEvent.changeText(inputPassword, 'password');
    
    // Expect values to be stored in the inputs.
    expect(inputName.props.value).toEqual('Stephen James');
    expect(inputEmail.props.value).toEqual('test@example.com');
    expect(inputPassword.props.value).toEqual('password');
  });

  it('Checks that a password is valid', () => {
    const passwordBad = 'hello';
    const passwordGood = '@HelloHi1';
    expect(passwordValid(passwordBad)).toBeFalsy();
    expect(passwordValid(passwordGood)).toBeTruthy();
  });

  it('Checks that an email is valid', () => {
    const emailBad = 'hello';
    const emailGood = 'test@test.com';
    expect(emailValid(emailBad)).toBeFalsy();
    expect(emailValid(emailGood)).toBeTruthy();
  });

  it('Test Welcome page navigation', () => {
    const idLogin = 'loginLink';
    const { getByTestId } = render(<SignUp navigation={fakeNavigation} />);

    fireEvent(getByTestId(idLogin), 'press');
    expect(fakeNavigation.navigate).toBeCalledWith('Welcome');
  });

});