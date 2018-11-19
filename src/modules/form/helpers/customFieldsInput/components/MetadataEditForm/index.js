// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
// import { Location } from '@reach/router';
import { BooleanValue } from 'react-values';
import { Subscribe } from 'unstated';
import Divider from 'components/Divider';
import { Label, DashedPlusButton } from 'components/Form';
import DefaultMetadataStyle from 'components/Form/Inputs/Styles/DefaultStyle/DefaultMetadataStyle';
import MetadataFormContainer from 'modules/form/helpers/customFieldsInput/container';
import GridColumn from 'components/GridColumn';
import SlideView from 'components/SlideView';
import { uuid } from 'utils/id';
import { MetadataTemplateCard } from 'components/Cards';
import SelectMetadataTemplate from '../SelectMetadataTemplate';
import { MetadataSectionWrapperStyle } from './style';

const MetadataEditForm = () => (
  <Subscribe to={[MetadataFormContainer]}>
    {({ originalValues, state, setFieldValue, setFieldArrayValue, removeArrayItem }) => {
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
                        selected={mask}
                        onCancel={() => slideToggle(false)}
                        onSave={item => {
                          setFieldValue('mask', item);
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
              fieldValues.map((fieldValue, index) => (
                <DefaultMetadataStyle
                  key={uuid()}
                  isKeyReadOnly
                  targetName={`metadata.${index}`}
                  // FIXME: this is dummy data
                  metadata={{ key: '123', value: '123' }}
                  setFieldArrayValue={setFieldArrayValue}
                  onRemove={() => removeArrayItem(`metadata.${index}`)}
                />
              ))}
          </GridColumn>
        </div>
      );
    }}
  </Subscribe>
);

export default MetadataEditForm;
