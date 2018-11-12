// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import SlideView from 'components/SlideView';
import { FieldItem, Label } from 'components/Form';
import Icon from 'components/Icon';

import MetadataEditFormWrapper from './components/MetadataEditFormWrapper';
import MetadataFormContainer from './container';
import { ShowAllButtonStyle } from './style';

type Props = {
  metadata: Array<Object>,
  setFieldValue: Function,
};

const metadataInputFactory = ({ metadata, setFieldValue }: Props) => (
  <FieldItem
    label={
      <Label>
        <Icon icon="METADATA" />
        <FormattedMessage id="modules.form.customFields" defaultMessage="CUSTOM FIELDS" />(
        {metadata.length})
      </Label>
    }
    input={
      <BooleanValue>
        {({ value: isOpen, set: slideToggle }) => (
          <>
            <button type="button" onClick={() => slideToggle(true)}>
              <div className={ShowAllButtonStyle}>
                <FormattedMessage id="modules.form.showAll" defaultMessage="Show All" />
              </div>
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
                    return (
                      <MetadataEditFormWrapper
                        metadata={values.metadata}
                        onCancel={() => slideToggle(false)}
                        onSave={() => {
                          slideToggle(false);
                          setFieldValue('metadata', values.metadata);
                        }}
                        onFormReady={() => {
                          initDetailValues({ metadata });
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
