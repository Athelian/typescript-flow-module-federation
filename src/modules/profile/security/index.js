// @flow
import * as React from 'react';
import { Mutation } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import { Subscribe } from 'unstated';
import { SectionWrapper, SectionHeader, PasswordInputFactory } from 'components/Form';
import { FormField, FormContainer } from 'modules/form';
import GridColumn from 'components/GridColumn';
import { BaseButton } from 'components/Buttons';
import SaveFormButton from 'components/SaveFormButton';
import { FormWrapperStyle, SectionWrapperStyle, ButtonWrapperStyle } from './style';
import { changePasswordMutation, requestResetPasswordMutation } from './mutation';
import { ChangePasswordContainer } from './containers';
import validator from './validator';

export default function Security() {
  return (
    <div className={FormWrapperStyle}>
      <SectionWrapper id="reset_password_section">
        <SectionHeader
          icon="PASSWORD"
          title={
            <FormattedMessage
              id="modules.profile.changePassword"
              defaultMessage="CHANGE PASSWORD"
            />
          }
        />
        <div className={SectionWrapperStyle}>
          <Subscribe to={[ChangePasswordContainer, FormContainer]}>
            {({ state: values, setFieldValue, onSuccess }, formContainer) => (
              <Mutation
                mutation={changePasswordMutation}
                onCompleted={({ changePassword }) => {
                  if (changePassword !== null) {
                    formContainer.onErrors(changePassword.violations);
                  } else {
                    onSuccess();
                    formContainer.onReset();
                    toast.success(
                      <FormattedMessage
                        id="modules.profile.passwordUpdated"
                        defaultMessage="Password successfully updated!"
                      />
                    );
                  }
                }}
              >
                {(changePassword, { loading }) => (
                  <GridColumn>
                    <FormField
                      name="currentPassword"
                      initValue={values.currentPassword}
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
                              id="modules.profile.currentPassword"
                              defaultMessage="CURRENT PASSWORD"
                            />
                          }
                        />
                      )}
                    </FormField>
                    <FormField
                      name="newPassword"
                      initValue={values.newPassword}
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
                              id="modules.profile.newPassword"
                              defaultMessage="NEW PASSWORD"
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
                              id="modules.profile.confirmPassword"
                              defaultMessage="CONFIRM PASSWORD"
                            />
                          }
                        />
                      )}
                    </FormField>
                    <div className={ButtonWrapperStyle}>
                      <SaveFormButton
                        disabled={!formContainer.isReady(values, validator)}
                        isLoading={loading}
                        onClick={() => {
                          const { currentPassword, newPassword } = values;

                          changePassword({
                            variables: { input: { currentPassword, newPassword } },
                          });
                        }}
                      />
                    </div>
                  </GridColumn>
                )}
              </Mutation>
            )}
          </Subscribe>
        </div>
      </SectionWrapper>

      <SectionWrapper id="forgot_password_section">
        <SectionHeader
          icon="FORGOT"
          title={
            <FormattedMessage
              id="modules.profile.forgotPassword"
              defaultMessage="FORGOT PASSWORD"
            />
          }
        />
        <div className={SectionWrapperStyle}>
          <FormattedMessage
            id="modules.profile.resetPassword"
            defaultMessage="Forgot your password? You can request to reset it. An email will be sent to your email address of your zenport account, follow the link to reset your password."
          />
          <div className={ButtonWrapperStyle}>
            <Mutation
              mutation={requestResetPasswordMutation}
              onCompleted={() => {
                toast.info(
                  <FormattedMessage
                    id="modules.profile.requestSent"
                    defaultMessage="An email will sent shortly"
                  />
                );
              }}
            >
              {(requestResetPassword, { loading }) => (
                <BaseButton
                  label={
                    <FormattedMessage
                      id="modules.profile.requestResetPassword"
                      defaultMessage="REQUEST TO RESET PASSWORD"
                    />
                  }
                  isLoading={loading}
                  backgroundColor="TEAL"
                  hoverBackgroundColor="TEAL_DARK"
                  onClick={() => requestResetPassword()}
                />
              )}
            </Mutation>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
