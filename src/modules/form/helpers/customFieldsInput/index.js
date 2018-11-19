// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import FormattedNumber from 'components/FormattedNumber';
import Icon from 'components/Icon';
import { FieldItem, Label } from 'components/Form';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import SlideView from 'components/SlideView';
import MetadataEditFormWrapper from './components/MetadataEditFormWrapper';
import MetadataFormContainer from './container';
import { ShowAllButtonStyle, MetadataIconStyle } from './style';

type Props = {
  customFields: {
    mask: Object,
    fieldValues: Array<Object>,
    fieldDefinitions: Array<Object>,
  },
};

const metadataInputFactory = ({ customFields }: Props) => (
  <FieldItem
    label={
      <Label>
        <FormattedMessage id="modules.form.customFields" defaultMessage="CUSTOM FIELDS" />
        {' ('}
        <FormattedNumber value={customFields.fieldValues.length} />
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
                <Subscribe to={[MetadataFormContainer]}>
                  {({ initDetailValues, originalValues, state }) => {
                    const values = { ...originalValues, ...state };
                    console.log(values);
                    return (
                      <MetadataEditFormWrapper
                        customFields={values.customFields}
                        onCancel={() => slideToggle(false)}
                        onSave={() => {
                          slideToggle(false);
                          // TODO:
                          // setFieldValue()
                        }}
                        onFormReady={() => {
                          initDetailValues(customFields);
                        }}
                      />
                    );
                  }}
                </Subscribe>
              )}
            </SlideView>
          </>
        )}
      </BooleanValue>
    }
  />
);

export default metadataInputFactory;
