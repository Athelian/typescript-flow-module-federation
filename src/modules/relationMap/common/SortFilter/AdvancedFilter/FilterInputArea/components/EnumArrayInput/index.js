// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import EnumProvider from 'providers/enum';
import { NewButton } from 'components/Buttons';
import messages from '../messages';
import EnumInput from './components/EnumInput';
import { EnumArrayInputWrapperStyle } from './style';

type OptionalProps = {
  values: Array<Object>,
  onChange: Function,
};

type Props = OptionalProps & {
  enumType: 'Seaport' | 'Airport' | 'Country',
};

const defaultProps = {
  values: [],
  onChange: () => {},
};

export default function EnumArrayInput({ enumType, values, onChange }: Props) {
  return (
    <div className={EnumArrayInputWrapperStyle}>
      <EnumProvider enumType={enumType}>
        {({ loading, error, data }) => {
          if (loading) return null;
          if (error) return `Error!: ${error}`;

          return values.map((value, index) => (
            <EnumInput
              data={data}
              value={value}
              onChange={inputValue => {
                const newValues = [...values];
                newValues.splice(index, 1, inputValue);
                onChange(newValues);
              }}
              onRemove={() => {
                const newValues = [...values];
                newValues.splice(index, 1);
                onChange(newValues);
              }}
            />
          ));
        }}
      </EnumProvider>

      <NewButton
        label={<FormattedMessage {...messages.add} />}
        onClick={() => onChange([...values, { name: '', description: '' }])}
      />
    </div>
  );
}

EnumArrayInput.defaultProps = defaultProps;
