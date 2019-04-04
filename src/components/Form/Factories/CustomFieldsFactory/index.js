// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { Query } from 'react-apollo';
import { getByPathWithDefault, contains } from 'utils/fp';
import { list2Map } from 'utils/customFields';
import FormattedNumber from 'components/FormattedNumber';
import LoadingIcon from 'components/LoadingIcon';
import Icon from 'components/Icon';
import { FieldItem, Label } from 'components/Form';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import SlideView from 'components/SlideView';
import { fieldDefinitionsQuery } from 'modules/metadata/query';
import CustomFieldsForm from './CustomFieldsForm';
import CustomFieldsContainer from './container';
import { ShowAllButtonStyle, CustomFieldsIconStyle } from './style';

type OptionalProps = {
  editable: {
    values: boolean,
    mask: boolean,
  },
};

type Props = OptionalProps & {
  entityType: string,
  customFields: {
    mask: ?Object,
    fieldValues: Array<Object>,
    fieldDefinitions: Array<Object>,
  },
  setFieldValue: Function,
};

const CustomFieldsFactory = ({
  entityType,
  customFields,
  setFieldValue,
  editable,
}: Props): React.Node => {
  return (
    <FieldItem
      label={
        <Label height="30px">
          <FormattedMessage id="modules.form.customFields" defaultMessage="CUSTOM FIELDS" />
          {' ('}
          <FormattedNumber value={customFields.fieldValues ? customFields.fieldValues.length : 0} />
          {')'}
        </Label>
      }
      tooltip={
        <div className={CustomFieldsIconStyle}>
          <Icon icon="METADATA" />
        </div>
      }
      input={
        <BooleanValue>
          {({ value: isOpen, set: slideToggle }) => (
            <>
              <button
                onClick={() => slideToggle(true)}
                className={ShowAllButtonStyle}
                type="button"
              >
                <FormattedMessage id="modules.form.showAll" defaultMessage="Show All" />
              </button>
              <SlideView isOpen={isOpen} onRequestClose={() => slideToggle(false)}>
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
                      const { fieldValues: originalFieldValues } = customFields;

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
                          {({ initDetailValues }) => (
                            <CustomFieldsForm
                              entityType={entityType}
                              onSave={(value: Object) => {
                                if (value.mask) {
                                  setFieldValue('customFields', {
                                    mask: value.mask,
                                    fieldDefinitions: value.fieldDefinitions,
                                    fieldValues: value.fieldValues.filter(fieldValue =>
                                      contains(
                                        fieldValue.fieldDefinition,
                                        value.mask.fieldDefinitions
                                      )
                                    ),
                                  });
                                } else {
                                  setFieldValue('customFields', value);
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
                              editable={editable}
                            />
                          )}
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
};

export default CustomFieldsFactory;
