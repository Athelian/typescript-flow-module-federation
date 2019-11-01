// @flow
import * as React from 'react';
import { Mutation } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { Link } from '@reach/router';
import { Provider, Subscribe } from 'unstated';
import GradientContainer from 'components/GradientContainer';
import { PasswordInputFactory } from 'components/Form';
import { BaseButton } from 'components/Buttons';
import GridColumn from 'components/GridColumn';
import { FormContainer, FormField } from 'modules/form';
import { BoxStyle, ContainerStyle, CopyrightStyle, FormWrapperStyle, LinkStyle } from './style';
import { resetPasswordMutation } from './mutation';
import ResetPasswordFormContainer from './container';
import validator from './validator';

type Props = {
  token?: string,
};

export default function ResetPasswordModule({ token }: Props) {
  const [passwordChanged, setPasswordChanged] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  return (
    <GradientContainer className={ContainerStyle}>
      <div className={FormWrapperStyle}>
        <div className={BoxStyle}>
          <Provider>
            <Subscribe to={[ResetPasswordFormContainer, FormContainer]}>
              {({ state: values, setFieldValue, onSuccess }, formContainer) => (
                <Mutation
                  mutation={resetPasswordMutation}
                  onCompleted={({ resetPassword }) => {
                    if (resetPassword !== null) {
                      setHasError(true);
                    } else {
                      setPasswordChanged(true);
                    }
                    onSuccess();
                  }}
                >
                  {requestResetPassword => (
                    <>
                      {passwordChanged && (
                        <FormattedMessage
                          id="modules.resetPassword.passwordChanged"
                          defaultMessage="Password successfully reset"
                        />
                      )}

                      {hasError && (
                        <FormattedMessage
                          id="modules.resetPassword.requestInvalid"
                          defaultMessage="Reset request is invalid or expired."
                        />
                      )}

                      {(passwordChanged || hasError) && (
                        // $FlowFixMe Flow typed is not updated yet
                        <Link to="/login" className={LinkStyle}>
                          <FormattedMessage
                            id="modules.resetPassword.login"
                            defaultMessage="Back to login"
                          />
                        </Link>
                      )}

                      {!passwordChanged && !hasError && (
                        <>
                          <GridColumn>
                            <FormField
                              name="password"
                              initValue={values.password}
                              validator={validator}
                              values={values}
                              setFieldValue={setFieldValue}
                            >
                              {inputHandlers => (
                                <PasswordInputFactory
                                  required
                                  forceHoverStyle
                                  editable
                                  {...inputHandlers}
                                  label={
                                    <FormattedMessage
                                      id="modules.resetPassword.password"
                                      defaultMessage="PASSWORD"
                                    />
                                  }
                                />
                              )}
                            </FormField>
                            <FormField
                              name="confirmPassword"
                              initValue={values.confirmPassword}
                              validator={validator}
                              values={values}
                              setFieldValue={setFieldValue}
                            >
                              {inputHandlers => (
                                <PasswordInputFactory
                                  required
                                  forceHoverStyle
                                  editable
                                  {...inputHandlers}
                                  label={
                                    <FormattedMessage
                                      id="modules.resetPassword.confirmPassword"
                                      defaultMessage="CONFIRM PASSWORD"
                                    />
                                  }
                                />
                              )}
                            </FormField>
                          </GridColumn>
                          <BaseButton
                            icon="SAVE"
                            label={
                              <FormattedMessage
                                id="modules.resetPassword.requestResetPassword"
                                defaultMessage="SAVE"
                              />
                            }
                            backgroundColor="TEAL"
                            hoverBackgroundColor="TEAL_DARK"
                            disabled={!formContainer.isReady(values, validator)}
                            type="submit"
                            onClick={() =>
                              requestResetPassword({
                                variables: {
                                  input: {
                                    token,
                                    password: values.password,
                                  },
                                },
                              })
                            }
                          />
                        </>
                      )}
                    </>
                  )}
                </Mutation>
              )}
            </Subscribe>
          </Provider>
        </div>
      </div>
      <footer className={CopyrightStyle}>
        <span>© {new Date().getFullYear()} Zenport Inc.</span>
      </footer>
    </GradientContainer>
  );
}
