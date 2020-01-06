import React from 'react';
import { Provider } from 'unstated';
import '@testing-library/jest-dom';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import LanguageProvider from 'contexts/Language';
import LoginForm from '../index';

afterEach(cleanup);

describe('<LoginForm />', () => {
  it('should render without crash', () => {
    const onLoginFn = jest.fn();
    render(
      <Provider>
        <LanguageProvider>
          <LoginForm onLogin={onLoginFn} />
        </LanguageProvider>
      </Provider>
    );
    const emailElement = screen.getByTestId('email');
    const passwordElement = screen.getByTestId('password');
    const submitButtonElement = screen.getByTestId('submitButton');

    expect(screen).toMatchSnapshot();
    expect(emailElement).not.toBeNull();
    expect(passwordElement).not.toBeNull();
    expect(submitButtonElement).not.toBeNull();
    expect(submitButtonElement.hasAttribute('disabled')).toBeTruthy();
  });

  it('should allow to click on submit button on valid data', () => {
    const onLoginFn = jest.fn();
    render(
      <Provider>
        <LanguageProvider>
          <LoginForm onLogin={onLoginFn} />
        </LanguageProvider>
      </Provider>
    );
    const emailElement = screen.getByTestId('email');
    const passwordElement = screen.getByTestId('password');
    const submitButtonElement = screen.getByTestId('submitButton');

    expect(screen).toMatchSnapshot();
    emailElement.value = 'test@example.com';
    passwordElement.value = 'demo';
    fireEvent.change(emailElement);
    fireEvent.change(passwordElement);
    fireEvent.click(submitButtonElement);
    expect(screen).toMatchSnapshot();
  });
});
