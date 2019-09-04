// @flow
import * as React from 'react';
import { Mutation } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { Link } from '@reach/router';
import { Provider, Subscribe } from 'unstated';
import GradientContainer from 'components/GradientContainer';
import { TextInputFactory } from 'components/Form';
import { BaseButton } from 'components/Buttons';
import GridColumn from 'components/GridColumn';
import { FormContainer, FormField } from 'modules/form';
import {
  BoxStyle,
  ContainerStyle,
  CopyrightStyle,
  FormWrapperStyle,
  ButtonsStyle,
  LinkStyle,
} from './style';
import { requestResetPasswordMutation } from './mutation';
import ForgotPasswordFormContainer from './container';
import validator from './validator';

export default function ForgotPasswordModule() {
  const [requestSent, setRequestSent] = React.useState(false);

  return (
    <GradientContainer className={ContainerStyle}>
      <div className={FormWrapperStyle}>
        <div className={BoxStyle}>
          <Provider>
            <Subscribe to={[ForgotPasswordFormContainer, FormContainer]}>
              {({ state: values, setFieldValue, onSuccess }, formContainer) => (
                <Mutation
                  mutation={requestResetPasswordMutation}
                  onCompleted={() => {
                    setRequestSent(true);
                    onSuccess();
                  }}
                >
                  {requestResetPassword => (
                    <>
                      {requestSent ? (
                        <FormattedMessage
                          id="modules.forgotPassword.requestSent"
                          defaultMessage="An email will be sent shortly, follow the link to reset your password."
                        />
                      ) : (
                        <GridColumn>
                          <FormField
                            name="email"
                            initValue={values.email}
                            validator={validator}
                            values={values}
                            setFieldValue={setFieldValue}
                          >
                            {inputHandlers => (
                              <TextInputFactory
                                isNew
                                vertical
                                required
                                forceHoverStyle
                                editable
                                {...inputHandlers}
                                label={
                                  <FormattedMessage
                                    id="modules.forgotPassword.email"
                                    defaultMessage="EMAIL"
                                  />
                                }
                              />
                            )}
                          </FormField>
                        </GridColumn>
                      )}
                      <div className={ButtonsStyle}>
                        {!requestSent && (
                          <BaseButton
                            icon="SAVE"
                            label={
                              <FormattedMessage
                                id="modules.forgotPassword.requestResetPassword"
                                defaultMessage="REQUEST TO RESET PASSWORD"
                              />
                            }
                            backgroundColor="TEAL"
                            hoverBackgroundColor="TEAL_DARK"
                            disabled={!formContainer.isReady(values, validator)}
                            type="submit"
                            onClick={() => requestResetPassword({ variables: { input: values } })}
                          />
                        )}
                        <Link to="/login" className={LinkStyle}>
                          <FormattedMessage
                            id="modules.forgotPassword.login"
                            defaultMessage="Back to login"
                          />
                        </Link>
                      </div>
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
