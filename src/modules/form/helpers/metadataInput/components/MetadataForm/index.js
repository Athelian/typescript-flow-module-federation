// @flow
import React from 'react';

import DefaultMetadataStyle from 'components/Form/Inputs/Styles/DefaultStyle/DefaultMetadataStyle';

type Props = {
  values: Array<Object>,
  setFieldArrayValue: Function,
};

const MetadataEditForm = ({ values, setFieldArrayValue }: Props) => (
  <div>
    {values.map((metadata, index) => (
      <DefaultMetadataStyle
        key={metadata.key}
        isKeyReadOnly={false}
        targetName={`metadata.${index}`}
        metadata={metadata}
        setFieldArrayValue={setFieldArrayValue}
        onRemove={() => {}}
      />
    ))}
  </div>
);

export default MetadataEditForm;
