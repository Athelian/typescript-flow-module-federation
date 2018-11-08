// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import SlideView from 'components/SlideView';
import { FieldItem, Label } from 'components/Form';
import Icon from 'components/Icon';

import { ShowAllButtonStyle } from './style';

const metadataInputFactory = () => (
  <FieldItem
    label={
      <Label>
        <Icon icon="METADATA" />
        <FormattedMessage id="modules.form.customFields" defaultMessage="CUSTOM FIELDS" />({'12'})
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
              {isOpen && 'metadata slide view'}
            </SlideView>
          </>
        )}
      </BooleanValue>
    }
  />
);

export default metadataInputFactory;
