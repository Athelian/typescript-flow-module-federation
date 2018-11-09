// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';

import DefaultMetadataStyle from 'components/Form/Inputs/Styles/DefaultStyle/DefaultMetadataStyle';
import { NewButton } from 'components/Buttons';
import { uuid } from 'utils/id';

import { AddButtonWrapperStyle } from './style';

type Props = {
  values: Array<Object>,
  setFieldArrayValue: Function,
  removeArrayItem: Function,
};

const MetadataEditForm = ({ values, setFieldArrayValue, removeArrayItem }: Props) => (
  <div>
    <div>
      {values.map((metadata, index) => (
        <DefaultMetadataStyle
          key={uuid()}
          isKeyReadOnly={false}
          targetName={`metadata.${index}`}
          metadata={metadata}
          setFieldArrayValue={setFieldArrayValue}
          onRemove={() => removeArrayItem(`metadata.${index}`)}
        />
      ))}
    </div>
    <div className={AddButtonWrapperStyle}>
      <NewButton
        label={
          <FormattedMessage id="modules.order.addCustomFieldB" defaultMessage="ADD CUSTOM FIELDS" />
        }
        onClick={() => {
          setFieldArrayValue(`metadata.${values.length}`, { key: '', value: '' });
        }}
      />
    </div>
  </div>
);

export default MetadataEditForm;
