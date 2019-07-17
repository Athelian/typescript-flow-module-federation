// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Mutation, Query } from 'react-apollo';
import { navigate } from '@reach/router';
import { Subscribe, Provider } from 'unstated';
import { getByPathWithDefault } from 'utils/fp';
import { SlideViewLayout } from 'components/Layout';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton, ResetButton } from 'components/Buttons';
import LoadingIcon from 'components/LoadingIcon';
import { FormContainer, resetFormState } from 'modules/form';
import MaskForm from 'modules/metadata/components/MaskForm';
import MaskContainer from 'modules/metadata/components/MaskForm/container';
import { fieldDefinitionsQuery } from 'modules/metadata/query';
import validator from './validator';
import { maskQuery } from './query';
import { createMaskMutation, updateMaskMutation } from './mutation';

type OptionalProps = {
  isNew: boolean,
  id: string,
};

type Props = OptionalProps & {
  entityType: string,
  onCancel: Function,
  onSave: Function,
};

const defaultProps = {
  isNew: false,
  id: '',
};

const formContainer = new FormContainer();

class MaskFormWrapper extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentWillUnmount() {
    formContainer.onReset();
  }

  onSave = async (
    formData: Object,
    saveMask: Function,
    onSuccess: Function = () => {},
    onErrors: Function = () => {}
  ) => {
    const { isNew, entityType, id } = this.props;

    const input = isNew
      ? {
          entityType,
          name: formData.name,
          memo: formData.memo,
          fieldDefinitionIDs: formData.fieldDefinitionIDs,
        }
      : {
          entityType,
          name: formData.name,
          memo: formData.memo,
          fieldDefinitionIDs: formData.fieldDefinitionIDs,
        };

    if (isNew) {
      const { data } = await saveMask({ variables: { input } });
      const {
        maskCreate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        onSuccess();
      }
    } else {
      const { data } = await saveMask({ variables: { input, id } });
      const {
        maskUpdate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        onSuccess();
      }
    }
  };

  onReset = (maskContainer: Object, form: Object) => {
    resetFormState(maskContainer);
    form.onReset();
  };

  render() {
    const { entityType, isNew, id, onSave, onCancel } = this.props;

    return (
      <Provider inject={[formContainer]}>
        <Subscribe to={[MaskContainer]}>
          {maskContainer => (
            <Query
              key={entityType}
              query={fieldDefinitionsQuery}
              variables={{ entityType }}
              fetchPolicy="network-only"
            >
              {({ loading, data, error }) => {
                if (error) {
                  if (error.message && error.message.includes('403')) {
                    navigate('/403');
                  }
                  return error.message;
                }

                if (loading) return <LoadingIcon />;
                const allFieldDefinitions = getByPathWithDefault([], 'fieldDefinitions', data);
                return (
                  <Mutation
                    mutation={isNew ? createMaskMutation : updateMaskMutation}
                    onCompleted={() => onSave()}
                  >
                    {(saveMask, { loading: isLoading, error: apiError }) => (
                      <>
                        {apiError && <p>Error: Please try again.</p>}
                        <SlideViewLayout>
                          <SlideViewNavBar>
                            <EntityIcon icon="TEMPLATE" color="TEMPLATE" invert />
                            <JumpToSection>
                              <SectionTabs
                                link="metadata_templateSection"
                                label={
                                  <FormattedMessage
                                    id="modules.metadata.template"
                                    defaultMessage="TEMPLATE"
                                  />
                                }
                                icon="TEMPLATE"
                              />
                              <SectionTabs
                                link="metadata_customFieldsSection"
                                label={
                                  <FormattedMessage
                                    id="modules.metadata.customFieldsSection"
                                    defaultMessage="CUSTOM FIELDS"
                                  />
                                }
                                icon="METADATA"
                              />
                            </JumpToSection>

                            {isNew && <CancelButton onClick={() => onCancel()} />}

                            {!isNew && maskContainer.isDirty() && (
                              <ResetButton
                                onClick={() => this.onReset(maskContainer, formContainer)}
                              />
                            )}

                            {(isNew || maskContainer.isDirty()) && (
                              <SaveButton
                                disabled={!formContainer.isReady(maskContainer.state, validator)}
                                onClick={() => {
                                  this.onSave(
                                    maskContainer.state,
                                    saveMask,
                                    () => {
                                      maskContainer.onSuccess();
                                      formContainer.onReset();
                                    },
                                    formContainer.onErrors
                                  );
                                }}
                                isLoading={isLoading}
                              />
                            )}
                          </SlideViewNavBar>
                          {isNew ? (
                            <MaskForm
                              isNew
                              fieldDefinitions={allFieldDefinitions}
                              onFormReady={() =>
                                maskContainer.initDetailValues({
                                  name: '',
                                  memo: '',
                                  fieldDefinitionIDs: [],
                                })
                              }
                            />
                          ) : (
                            <Query
                              key={id}
                              query={maskQuery}
                              variables={{ id }}
                              fetchPolicy="network-only"
                            >
                              {({ loading: maskLoading, data: maskData, error: maskError }) => {
                                if (maskError) {
                                  if (maskError.message && maskError.message.includes('403')) {
                                    navigate('/403');
                                  }
                                  return maskError.message;
                                }

                                if (maskLoading) return <LoadingIcon />;

                                const name = getByPathWithDefault({}, 'mask.name', maskData);
                                const memo = getByPathWithDefault({}, 'mask.memo', maskData);

                                const fieldDefinitions = getByPathWithDefault(
                                  {},
                                  'mask.fieldDefinitions',
                                  maskData
                                );

                                const mask = {
                                  name,
                                  memo,
                                  fieldDefinitionIDs: fieldDefinitions.map(item => item.id),
                                };

                                return (
                                  <MaskForm
                                    fieldDefinitions={allFieldDefinitions}
                                    onFormReady={() => maskContainer.initDetailValues(mask)}
                                  />
                                );
                              }}
                            </Query>
                          )}
                        </SlideViewLayout>
                      </>
                    )}
                  </Mutation>
                );
              }}
            </Query>
          )}
        </Subscribe>
      </Provider>
    );
  }
}

export default MaskFormWrapper;
