// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { contains } from 'utils/fp';
import { list2Map } from 'utils/customFields';
import Icon from 'components/Icon';
import { FieldItem, Label } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import SlideView from 'components/SlideView';
import CustomFieldsForm from '../CustomFieldsForm';
import CustomFieldsContainer from '../container';
import { ShowAllButtonStyle, CustomFieldsIconStyle } from './style';

const defaultProps = {
  loading: false,
};

const CustomFieldsInput = ({
  loading,
  entityType,
  fieldDefinitions,
  mask,
  fieldValues: originalFieldValues,
  setFieldValue,
  editable,
}: {
  loading: boolean,
  entityType: string,
  fieldDefinitions: Array<Object>,
  mask: Object,
  fieldValues: Array<Object>,
  setFieldValue: Function,
  editable: Object,
}) => (
  <FieldItem
    label={
      <Label height="30px">
        <FormattedMessage id="modules.form.customFields" defaultMessage="CUSTOM FIELDS" />
        {!loading && (
          <>
            {' ('}
            <FormattedNumber value={mask ? originalFieldValues.length : fieldDefinitions.length} />
            {')'}
          </>
        )}
      </Label>
    }
    tooltip={
      <div className={CustomFieldsIconStyle}>
        <Icon icon="METADATA" />
      </div>
    }
    input={
      loading ? (
        <div className={ShowAllButtonStyle}>
          <FormattedMessage id="modules.form.showAll" defaultMessage="Show All" />
        </div>
      ) : (
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
                  <Subscribe to={[CustomFieldsContainer]}>
                    {({ initDetailValues }) => {
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
                        <CustomFieldsForm
                          entityType={entityType}
                          onSave={(value: Object) => {
                            if (value.mask) {
                              setFieldValue('customFields', {
                                mask: value.mask,
                                fieldDefinitions: value.fieldDefinitions,
                                fieldValues: value.fieldValues.filter(fieldValue =>
                                  contains(fieldValue.fieldDefinition, value.mask.fieldDefinitions)
                                ),
                              });
                            } else {
                              setFieldValue('customFields', value);
                            }
                            slideToggle(false);
                          }}
                          onFormReady={() => {
                            initDetailValues({
                              mask,
                              fieldDefinitions,
                              fieldValues,
                            });
                          }}
                          editable={editable}
                        />
                      );
                    }}
                  </Subscribe>
                )}
              </SlideView>
            </>
          )}
        </BooleanValue>
      )
    }
  />
);

CustomFieldsInput.defaultProps = defaultProps;

export default CustomFieldsInput;
