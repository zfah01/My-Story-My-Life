import 'react-native';
import React from 'react';
import Welcome, { emailValid } from '../../screens/Login/Welcome';

import renderer from 'react-test-renderer';

import { cleanup, render, fireEvent } from '@testing-library/react-native';

afterEach(cleanup);

describe('Testing components and functions of Welcome', () => {

  const fakeNavigation = {
    navigate: jest.fn(),
  };

  it('Checks to see if the Welcome page renders', () => {
    const tree = renderer.create(<Welcome />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Test for displaying greetings message', () => {
    const title = 'Welcome to My Story, My Life';
    const { getByText } = render(<Welcome />);
    const foundTitleText = getByText(title);

    expect(foundTitleText.props.children).toEqual(title);
  });

  it('Find button from testID', () => {
    const { getByTestId } = render(<Welcome />);
    const testIdName = 'buttonLogin';
    const buttonID = getByTestId(testIdName);

    expect(buttonID).toBeTruthy();
  });

  it('Test to see if email and password inputs receive data', async () => {
    const { getByTestId } = render(<Welcome />);
    const testIdEmail = 'inputEmail';
    const testIdPassword = 'inputPassword';
    const inputEmail = getByTestId(testIdEmail);
    const inputPassword = getByTestId(testIdPassword);

    fireEvent.changeText(inputEmail, 'test@example.com');
    fireEvent.changeText(inputPassword, 'password');

    expect(inputEmail.props.value).toEqual('test@example.com');
    expect(inputPassword.props.value).toEqual('password');
  });

  it('Checks that an email is valid', () => {
    const emailBad = 'hello';
    const emailGood = 'test@test.com';
    expect(emailValid(emailBad)).toBeFalsy();
    expect(emailValid(emailGood)).toBeTruthy();
  });

  it('Testing Sign Up page navigation', () => {
    const idSignUp = 'signUpLink';
    const { getByTestId } = render(<Welcome navigation={fakeNavigation} />);

    fireEvent(getByTestId(idSignUp), 'press');
    expect(fakeNavigation.navigate).toBeCalledWith('SignUp');
  });


});