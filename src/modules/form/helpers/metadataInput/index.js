// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import SlideView from 'components/SlideView';
import { FieldItem, Label } from 'components/Form';
import Icon from 'components/Icon';

import MetadataEditFormWrapper from './components/MetadataEditFormWrapper';

import { ShowAllButtonStyle } from './style';

type Props = {
  values: Array<Object>,
  setFieldArrayValue: Function,
};

const metadataInputFactory = ({ values, setFieldArrayValue }: Props) => (
  <FieldItem
    label={
      <Label>
        <Icon icon="METADATA" />
        <FormattedMessage id="modules.form.customFields" defaultMessage="CUSTOM FIELDS" />(
        {values.length})
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
                <MetadataEditFormWrapper
                  values={values}
                  onCancel={() => slideToggle(false)}
                  onSave={() => slideToggle(false)}
                  setFieldArrayValue={setFieldArrayValue}
                />
              )}
            </SlideView>
          </>
        )}
      </BooleanValue>
    }
  />
);

export default metadataInputFactory;
