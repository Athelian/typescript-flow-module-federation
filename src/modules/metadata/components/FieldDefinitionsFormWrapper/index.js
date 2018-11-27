// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { Query, Mutation } from 'react-apollo';
import { Subscribe } from 'unstated';
import LoadingIcon from 'components/LoadingIcon';
import { SaveButton } from 'components/Buttons';
import FieldDefinitionsForm from 'modules/metadata/components/FieldDefinitionsForm';
import { FormContainer } from 'modules/form';
import { getByPathWithDefault } from 'utils/fp';
import { fieldDefinitionsQuery } from 'modules/metadata/query';
import { updateFieldDefinitionsMutation } from 'modules/metadata/mutation';

import FormHeader from '../FormHeader';
import FieldDefinitionsContainer from './container';
import { WrapperStyle, HeaderStyle, ContainerWrapperStyle } from './style';

type Props = {
  entityType: string,
};

class FieldDefinitionsFormWrapper extends React.Component<Props> {
  onSaveFieldDefinitions = async (
    formData: Object,
    saveFieldDefinitions: Function,
    onSuccess: Function = () => {},
    onErrors: Function = () => {}
  ) => {
    const input = {
      entityType: formData.entityType,
      fieldDefinitions: formData.fieldDefinitions
        .filter(item => item.name !== '')
        .map(({ id, name, isNew = false }) => (isNew ? { name } : { id, name })),
    };

    const { data } = await saveFieldDefinitions({ variables: { input } });
    const {
      fieldDefinitionsUpdate: { violations },
    } = data;
    if (violations && violations.length) {
      onErrors(violations);
    } else {
      onSuccess();
    }
  };

  render() {
    const { entityType } = this.props;
    return (
      <Mutation mutation={updateFieldDefinitionsMutation}>
        {(saveFieldDefinitions, { loading: isLoading, error: apiError }) => (
          <>
            {isLoading && <LoadingIcon />}
            {apiError && <p>Error: Please try again.</p>}

            <Query
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
                const fieldDefinitions = getByPathWithDefault([], 'fieldDefinitions', data);

                return (
                  <Subscribe to={[FieldDefinitionsContainer, FormContainer]}>
                    {(
                      {
                        initDetailValues,
                        originalValues,
                        state,
                        setFieldArrayValue,
                        removeArrayItem,
                        isDirty,
                        onSuccess,
                      },
                      form
                    ) => {
                      const value = { ...originalValues, ...state };

                      return (
                        <div className={WrapperStyle}>
                          <div className={HeaderStyle}>
                            <FormHeader
                              name={
                                <FormattedMessage
                                  id="modules.metadata.customFields"
                                  defaultMessage="CUSTOM FIELDS"
                                />
                              }
                            >
                              {isDirty() && (
                                <SaveButton
                                  onClick={() => {
                                    this.onSaveFieldDefinitions(
                                      {
                                        entityType,
                                        fieldDefinitions: value.fieldDefinitions,
                                      },
                                      saveFieldDefinitions,
                                      () => {
                                        onSuccess();
                                        form.onReset();
                                      },
                                      form.onErrors
                                    );
                                  }}
                                />
                              )}
                            </FormHeader>
                          </div>
                          <div className={ContainerWrapperStyle}>
                            <FieldDefinitionsForm
                              fieldDefinitions={value.fieldDefinitions}
                              setFieldArrayValue={setFieldArrayValue}
                              removeArrayItem={removeArrayItem}
                              onFormReady={() => {
                                initDetailValues({ fieldDefinitions });
                              }}
                            />
                          </div>
                        </div>
                      );
                    }}
                  </Subscribe>
                );
              }}
            </Query>
          </>
        )}
      </Mutation>
    );
  }
}

export default FieldDefinitionsFormWrapper;
