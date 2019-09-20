// @flow
import * as React from 'react';
import { FormattedMessage, injectIntl, type IntlShape } from 'react-intl';
import { navigate } from '@reach/router';
import { Query, Mutation } from 'react-apollo';
import { Subscribe } from 'unstated';
import { showToastError } from 'utils/errors';
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
  intl: IntlShape,
};

const FieldDefinitionsFormWrapper = ({ entityType, intl }: Props) => (
  <Subscribe to={[FieldDefinitionsContainer, FormContainer]}>
    {({ state, originalValues, initDetailValues, isDirty, onSuccess, ...fieldHelpers }, form) => (
      <Query
        key={entityType}
        query={fieldDefinitionsQuery}
        variables={{ entityType }}
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
                          id="metadata_form_save_button"
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

                            if (showToastError({ intl, result, entity: 'fieldDefinitions' })) {
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
                      {loading ? (
                        <LoadingIcon />
                      ) : (
                        <FieldDefinitionsForm
                          {...fieldHelpers}
                          fieldDefinitions={state.fieldDefinitions}
                        />
                      )}
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

export default injectIntl(FieldDefinitionsFormWrapper);
