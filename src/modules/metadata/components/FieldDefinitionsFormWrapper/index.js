// @flow
import * as React from 'react';
import { toast } from 'react-toastify';
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

const FieldDefinitionsFormWrapper = ({ entityType }: Props) => (
  <Subscribe to={[FieldDefinitionsContainer, FormContainer]}>
    {({ state, originalValues, initDetailValues, isDirty, onSuccess, ...fieldHelpers }, form) => (
      <Query
        query={fieldDefinitionsQuery}
        variables={{ entityType }}
        key={entityType}
        fetchPolicy="network-only"
        onCompleted={data => {
          if (
            !isEquals(getByPathWithDefault([], 'fieldDefinitions', data), state.fieldDefinitions) &&
            originalValues.fieldDefinitions.length === 0
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
                          onClick={async () => {
                            const formData = {
                              entityType,
                              fieldDefinitions: state.fieldDefinitions,
                            };
                            const input = {
                              entityType: formData.entityType,
                              fieldDefinitions: formData.fieldDefinitions
                                .filter(item => item.name !== '')
                                .map(({ id, name, isNew = false }) =>
                                  isNew ? { name } : { id, name }
                                ),
                            };

                            const result: any = await saveFieldDefinitions({
                              variables: { input },
                            });

                            if (!result) {
                              toast.error('There was an error. Please try again later');
                              return;
                            }
                            const { data } = result;
                            const {
                              fieldDefinitionsUpdate: { violations },
                            } = data;
                            if (violations && violations.length) {
                              form.onErrors(violations);
                            } else {
                              onSuccess();
                              form.onReset();
                            }
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

export default FieldDefinitionsFormWrapper;
