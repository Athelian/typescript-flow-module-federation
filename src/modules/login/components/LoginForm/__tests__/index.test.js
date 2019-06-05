import React from 'react';
import { Provider } from 'unstated';
import 'jest-dom/extend-expect';
import { render, cleanup, fireEvent } from '@testing-library/react';
import LanguageProvider from 'modules/language';
import LoginForm from '../index';

afterEach(cleanup);

describe('<LoginForm />', () => {
  it('should render without crash', () => {
    const onLoginFn = jest.fn();
    const { getByTestId, container } = render(
      <Provider>
        <LanguageProvider>
          <LoginForm onLogin={onLoginFn} />
        </LanguageProvider>
      </Provider>
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
      <Provider>
        <LanguageProvider>
          <LoginForm onLogin={onLoginFn} />
        </LanguageProvider>
      </Provider>
    );
    const emailElement = getByTestId('email');
    const passwordElement = getByTestId('password');
    const submitButtonElement = getByTestId('submitButton');

    expect(container).toMatchSnapshot();
    emailElement.value = 'test@example.com';
    passwordElement.value = 'demo';
    fireEvent.change(emailElement);
    fireEvent.change(passwordElement);
    fireEvent.click(submitButtonElement);
    expect(container).toMatchSnapshot();
  });
});
