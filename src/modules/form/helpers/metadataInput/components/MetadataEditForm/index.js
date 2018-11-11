// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import DefaultMetadataStyle from 'components/Form/Inputs/Styles/DefaultStyle/DefaultMetadataStyle';
import { NewButton } from 'components/Buttons';
import { uuid } from 'utils/id';
import MetadataFormContainer from '../../container';

import { AddButtonWrapperStyle } from './style';

const MetadataEditForm = () => (
  <Subscribe to={[MetadataFormContainer]}>
    {({ originalValues, state, setFieldArrayValue, removeArrayItem }) => {
      const values = { ...originalValues, ...state };
      return (
        <div>
          <div>
            {values &&
              values.metadata.map((metadata, index) => (
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
                <FormattedMessage
                  id="modules.order.addCustomFieldB"
                  defaultMessage="ADD CUSTOM FIELDS"
                />
              }
              onClick={() => {
                setFieldArrayValue(`metadata.${values.metadata.length}`, { key: '', value: '' });
              }}
            />
          </div>
        </div>
      );
    }}
  </Subscribe>
);

export default MetadataEditForm;
