// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import FormattedNumber from 'components/FormattedNumber';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import SlideView from 'components/SlideView';
import { FieldItem, Label } from 'components/Form';
import Icon from 'components/Icon';
import { injectUid } from 'utils/id';
import MetadataEditFormWrapper from './components/MetadataEditFormWrapper';
import MetadataFormContainer from './container';
import { ShowAllButtonStyle, MetadataIconStyle } from './style';

type Props = {
  metadata: Array<Object>,
  setFieldValue: Function,
};

const metadataInputFactory = ({ metadata, setFieldValue }: Props) => (
  <FieldItem
    label={
      <Label>
        <FormattedMessage id="modules.form.customFields" defaultMessage="CUSTOM FIELDS" />
        {' ('}
        <FormattedNumber value={metadata.length} />
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
                    return (
                      <MetadataEditFormWrapper
                        metadata={values.metadata}
                        onCancel={() => slideToggle(false)}
                        onSave={() => {
                          slideToggle(false);
                          setFieldValue('metadata', values.metadata);
                        }}
                        onFormReady={() => {
                          initDetailValues({ metadata: metadata.map(item => injectUid(item)) });
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
