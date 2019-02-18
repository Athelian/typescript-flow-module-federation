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
import { getByPathWithDefault } from 'utils/fp';
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
      <Query query={fieldDefinitionsQuery} variables={{ entityType }} fetchPolicy="network-only">
        {({ loading, data, error, refetch }) => {
          if (error) {
            if (error.message && error.message.includes('403')) {
              navigate('/403');
            }
            return error.message;
          }

          if (loading) return <LoadingIcon />;
          const fieldDefinitions = getByPathWithDefault([], 'fieldDefinitions', data);

          return (
            <Mutation mutation={updateFieldDefinitionsMutation} onCompleted={() => refetch()}>
              {(saveFieldDefinitions, { loading: isLoading, error: apiError }) => (
                <>
                  {isLoading && <LoadingIcon />}
                  {apiError && <p>Error: Please try again.</p>}

                  <Subscribe to={[FieldDefinitionsContainer, FormContainer]}>
                    {({ initDetailValues, state, isDirty, onSuccess }, form) => (
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
                            />
                          )}
                        </div>
                        <div className={FieldDefinitionsBodyStyle}>
                          <FieldDefinitionsForm
                            fieldDefinitions={fieldDefinitions}
                            onFormReady={() => {
                              initDetailValues({ fieldDefinitions });
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </Subscribe>
                </>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default FieldDefinitionsFormWrapper;
