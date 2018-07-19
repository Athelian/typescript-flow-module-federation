import React from 'react';
import 'jest-dom/extend-expect';
import { render, cleanup, fireEvent } from 'react-testing-library';
import { MemoryRouter } from 'react-router-dom';
import LanguageProvider from 'modules/language';
import LoginForm from '../index';

afterEach(cleanup);

describe('<LoginForm />', () => {
  it('should render without crash', () => {
    const onLoginFn = jest.fn();
    const { getByTestId, container } = render(
      <MemoryRouter initialEntries={['/login']}>
        <LanguageProvider>
          <LoginForm onLogin={onLoginFn} />
        </LanguageProvider>
      </MemoryRouter>
    );
    const emailElement = getByTestId('email');
    const passwordElement = getByTestId('password');
    const submitButtonElement = getByTestId('submitButton');

    expect(container).toMatchSnapshot();
    expect(emailElement).not.toBeNull();
    expect(passwordElement).not.toBeNull();
    expect(submitButtonElement).not.toBeNull();
    expect(submitButtonElement).toHaveAttribute('disabled');
  });

  it('should allow to click on submit button on valid data', () => {
    const onLoginFn = jest.fn();
    const { getByTestId, container } = render(
      <MemoryRouter initialEntries={['/login']}>
        <LanguageProvider>
          <LoginForm onLogin={onLoginFn} />
        </LanguageProvider>
      </MemoryRouter>
    );
    const emailElement = getByTestId('email');
    const passwordElement = getByTestId('password');
    const submitButtonElement = getByTestId('submitButton');

    expect(container).toMatchSnapshot();
    emailElement.value = 'test@example.com';
    passwordElement.value = 'demo';
    fireEvent.change(emailElement);
    fireEvent.change(passwordElement);
    expect(submitButtonElement).not.toHaveAttribute('disabled');
    fireEvent.click(submitButtonElement);
    expect(container).toMatchSnapshot();
    // FIXME: There is a bug when testing submit form between formik and react-testing-library
    // Refer: https://spectrum.chat/react-testing-library?thread=2062f0a2-f137-4c94-b911-4b98f4703876
    // expect(onLoginFn).toHaveBeenCalledTimes(1);
  });
});
