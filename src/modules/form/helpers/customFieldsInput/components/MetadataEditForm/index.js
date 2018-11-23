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
import GridColumn from 'components/GridColumn';
import SlideView from 'components/SlideView';

import { MetadataTemplateCard } from 'components/Cards';
import SelectMetadataTemplate from '../SelectMetadataTemplate';
import { MetadataSectionWrapperStyle } from './style';

type Props = {
  entityType: string,
};

const list2Map = (list: Array<Object>): Map<string, string> => {
  const map = new Map();

  list.forEach(item => {
    map.set(item.id, item.name);
  });
  return map;
};

const MetadataEditForm = ({ entityType }: Props) => (
  <Subscribe to={[CustomFieldsContainer]}>
    {({ originalValues, state, setFieldArrayValue }) => {
      const values = { ...originalValues, ...state };
      const { mask, fieldValues, fieldDefinitions } = values;
      const fieldDefinitionMap = list2Map(fieldDefinitions);

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
                    <MetadataTemplateCard
                      selectable
                      metadataTemplate={mask}
                      onSelect={() => slideToggle(true)}
                      readOnly
                    />
                  )}

                  <SlideView
                    isOpen={opened}
                    onRequestClose={() => slideToggle(false)}
                    options={{ width: '980px' }}
                  >
                    {opened && (
                      <SelectMetadataTemplate
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
                  fieldName={fieldDefinitionMap.get(fieldDefinition.id)}
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
