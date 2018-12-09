// @flow
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import EnumProvider from 'providers/enum';
import { NewButton } from 'components/Buttons';
import messages from '../messages';
import EnumInput from './components/EnumInput';
import { EnumArrayInputWrapperStyle } from './style';

type OptionalProps = {
  values: Array<string>,
};

type Props = OptionalProps & {
  enumType: 'Seaport' | 'Airport' | 'Country',
};

const defaultProps = {
  values: [],
};

export default function EnumArrayInput({ enumType, values }: Props) {
  const [currentValues, setValues] = useState(values);

  // TODO:
  return (
    <div className={EnumArrayInputWrapperStyle}>
      <EnumProvider enumType={enumType}>
        {({ loading, error, data }) => {
          if (loading) return null;
          if (error) return `Error!: ${error}`;

          return currentValues.map(value => <EnumInput data={data} value={value} />);
        }}
      </EnumProvider>
      <NewButton
        label={<FormattedMessage {...messages.add} />}
        onClick={() => setValues([...currentValues, ''])}
      />
    </div>
  );
}

EnumArrayInput.defaultProps = defaultProps;
