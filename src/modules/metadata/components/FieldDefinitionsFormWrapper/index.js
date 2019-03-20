// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { Query, Mutation } from 'react-apollo';
import { Subscribe } from 'unstated';
import LoadingIcon from 'components/LoadingIcon';
import { SaveButton } from 'components/Buttons';
import { Label } from 'components/Form';
import FieldDefinitionsForm from 'modules/metadata/components/FieldDefinitionsForm';
import { FormContainer } from 'modules/form';
import { getByPathWithDefault, isEquals } from 'utils/fp';
import { fieldDefinitionsQuery } from 'modules/metadata/query';
import { updateFieldDefinitionsMutation } from 'modules/metadata/mutation';
import FieldDefinitionsContainer from './container';
import {
  FieldDefinitionsWrapperStyle,
  FieldDefinitionsHeaderStyle,
  FieldDefinitionsBodyStyle,
} from './style';

type Props = {
  entityType: string,
};

class FieldDefinitionsFormWrapper extends React.PureComponent<Props> {
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
      <Subscribe to={[FieldDefinitionsContainer, FormContainer]}>
        {({ state, initDetailValues, isDirty, onSuccess, ...fieldHelpers }, form) => (
          <Query
            query={fieldDefinitionsQuery}
            variables={{ entityType }}
            fetchPolicy="network-only"
            onCompleted={data => {
              if (
                !isEquals(
                  getByPathWithDefault([], 'fieldDefinitions', data),
                  state.fieldDefinitions
                ) &&
                state.fieldDefinitions.length === 0
              ) {
                initDetailValues({
                  fieldDefinitions: getByPathWithDefault([], 'fieldDefinitions', data),
                });
              }
            }}
          >
            {({ loading, error, refetch }) => {
              if (error) {
                if (error.message && error.message.includes('403')) {
                  navigate('/403');
                }
                return error.message;
              }

              if (loading) return <LoadingIcon />;

              return (
                <Mutation mutation={updateFieldDefinitionsMutation} onCompleted={() => refetch()}>
                  {(saveFieldDefinitions, { loading: isLoading, error: apiError }) => (
                    <>
                      {apiError && <p>Error: Please try again.</p>}

                      <div className={FieldDefinitionsWrapperStyle}>
                        <div className={FieldDefinitionsHeaderStyle}>
                          <Label>
                            <FormattedMessage
                              id="modules.metadata.customFields"
                              defaultMessage="CUSTOM FIELDS"
                            />
                          </Label>

                          {isDirty() && (
                            <SaveButton
                              onClick={() => {
                                this.onSaveFieldDefinitions(
                                  {
                                    entityType,
                                    fieldDefinitions: state.fieldDefinitions,
                                  },
                                  saveFieldDefinitions,
                                  () => {
                                    onSuccess();
                                    form.onReset();
                                  },
                                  form.onErrors
                                );
                              }}
                              isLoading={isLoading}
                            />
                          )}
                        </div>
                        <div className={FieldDefinitionsBodyStyle}>
                          <FieldDefinitionsForm
                            {...fieldHelpers}
                            fieldDefinitions={state.fieldDefinitions}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </Mutation>
              );
            }}
          </Query>
        )}
      </Subscribe>
    );
  }
}

export default FieldDefinitionsFormWrapper;
