// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { Query } from 'react-apollo';
import { getByPathWithDefault, contains } from 'utils/fp';
import FormattedNumber from 'components/FormattedNumber';
import LoadingIcon from 'components/LoadingIcon';
import Icon from 'components/Icon';
import { FieldItem, Label } from 'components/Form';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import SlideView from 'components/SlideView';
import { fieldDefinitionsQuery } from 'modules/metadata/query';
import MetadataEditForm from './components/MetadataEditForm';
import CustomFieldsContainer from './container';
import { ShowAllButtonStyle, MetadataIconStyle } from './style';

type Props = {
  entityType: string,
  customFields: {
    mask: Object,
    fieldValues: Array<Object>,
    fieldDefinitions: Array<Object>,
  },
  setFieldValue: Function,
};

export const list2Map = (list: Array<Object>): Map<string, Object> => {
  const map = new Map();
  list.forEach(({ fieldDefinition, ...rest }) => {
    map.set(fieldDefinition.id, { fieldDefinition, ...rest });
  });
  return map;
};

const customFieldsInputFactory = ({ entityType, customFields, setFieldValue }: Props) => (
  <FieldItem
    label={
      <Label>
        <FormattedMessage id="modules.form.customFields" defaultMessage="CUSTOM FIELDS" />
        {' ('}
        <FormattedNumber
          value={(customFields.fieldValues && customFields.fieldValues.length) || 0}
        />
        {')'}
      </Label>
    }
    tooltip={
      <div className={MetadataIconStyle}>
        <Icon icon="METADATA" />
      </div>
    }
    input={
      <BooleanValue>
        {({ value: isOpen, set: slideToggle }) => (
          <>
            <button onClick={() => slideToggle(true)} className={ShowAllButtonStyle} type="button">
              <FormattedMessage id="modules.form.showAll" defaultMessage="Show All" />
            </button>
            <SlideView
              isOpen={isOpen}
              onRequestClose={() => slideToggle(false)}
              options={{ width: '1030px' }}
            >
              {isOpen && (
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
                    const {
                      // fieldDefinitions: originalFieldDefinitions,
                      fieldValues: originalFieldValues,
                    } = customFields;

                    const fieldValueMap = list2Map(originalFieldValues);
                    const fieldValues = fieldDefinitions.map(fieldDefinition =>
                      fieldValueMap.get(fieldDefinition.id)
                        ? fieldValueMap.get(fieldDefinition.id)
                        : {
                            value: { string: '' },
                            fieldDefinition,
                            entity: entityType,
                          }
                    );

                    return (
                      <Subscribe to={[CustomFieldsContainer]}>
                        {({ initDetailValues, originalValues, state }) => {
                          const values = { ...originalValues, ...state };
                          return (
                            <MetadataEditForm
                              entityType={entityType}
                              fieldDefinitions={fieldDefinitions}
                              onCancel={() => slideToggle(false)}
                              onSave={() => {
                                if (values.mask) {
                                  setFieldValue('customFields', {
                                    mask: values.mask,
                                    fieldDefinitions: values.fieldDefinitions,
                                    fieldValues: values.fieldValues.filter(fieldValue =>
                                      contains(
                                        fieldValue.fieldDefinition,
                                        values.mask.fieldDefinitions
                                      )
                                    ),
                                  });
                                } else {
                                  setFieldValue('customFields', values);
                                }
                                slideToggle(false);
                              }}
                              onFormReady={() => {
                                initDetailValues({
                                  mask: customFields.mask,
                                  fieldDefinitions,
                                  fieldValues,
                                });
                              }}
                            />
                          );
                        }}
                      </Subscribe>
                    );
                  }}
                </Query>
              )}
            </SlideView>
          </>
        )}
      </BooleanValue>
    }
  />
);

export default customFieldsInputFactory;
