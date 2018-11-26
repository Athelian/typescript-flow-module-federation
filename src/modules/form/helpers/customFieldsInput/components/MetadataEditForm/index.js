// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
// import { Location } from '@reach/router';
import { BooleanValue } from 'react-values';
import { Subscribe } from 'unstated';
import Divider from 'components/Divider';
import { Label, DashedPlusButton } from 'components/Form';
import { DefaultCustomFieldStyle } from 'components/Form/Inputs/Styles';
import CustomFieldsContainer from 'modules/form/helpers/customFieldsInput/container';
import SelectMask from 'modules/form/helpers/customFieldsInput/components/SelectMask';
import GridColumn from 'components/GridColumn';
import SlideView from 'components/SlideView';

import { MaskCard } from 'components/Cards';

import { MetadataSectionWrapperStyle } from './style';

type Props = {
  entityType: string,
};

const MetadataEditForm = ({ entityType }: Props) => (
  <Subscribe to={[CustomFieldsContainer]}>
    {({ originalValues, state, setFieldArrayValue }) => {
      const values = { ...originalValues, ...state };
      const { mask, fieldValues } = values;
      return (
        <div className={MetadataSectionWrapperStyle}>
          <div>
            <Label required>
              <FormattedMessage id="modules.form.template" defaultMessage="TEMPLATE" />
            </Label>
            <BooleanValue>
              {({ value: opened, set: slideToggle }) => (
                <>
                  {!mask ? (
                    <DashedPlusButton
                      width="195px"
                      height="217px"
                      onClick={() => slideToggle(true)}
                    />
                  ) : (
                    <MaskCard selectable mask={mask} onSelect={() => slideToggle(true)} readOnly />
                  )}

                  <SlideView
                    isOpen={opened}
                    onRequestClose={() => slideToggle(false)}
                    options={{ width: '980px' }}
                  >
                    {opened && (
                      <SelectMask
                        entityType={entityType}
                        selected={mask}
                        onCancel={() => slideToggle(false)}
                        onSave={item => {
                          setFieldArrayValue('mask', item);
                          setFieldArrayValue('fieldDefinitions', item.fieldDefinitions);
                          setFieldArrayValue(
                            'fieldValues',
                            item.fieldDefinitions.map(fieldDefinition => ({
                              value: {},
                              fieldDefinition,
                              entityType,
                            }))
                          );
                          slideToggle(false);
                        }}
                      />
                    )}
                  </SlideView>
                </>
              )}
            </BooleanValue>
          </div>

          <Divider />
          <GridColumn gap="10px">
            {fieldValues &&
              fieldValues.map(({ value, fieldDefinition }, index) => (
                <DefaultCustomFieldStyle
                  key={fieldDefinition.id}
                  isKeyReadOnly
                  targetName={`fieldValues.${index}`}
                  fieldName={fieldDefinition.name}
                  value={value}
                  setFieldArrayValue={setFieldArrayValue}
                />
              ))}
          </GridColumn>
        </div>
      );
    }}
  </Subscribe>
);

export default MetadataEditForm;
