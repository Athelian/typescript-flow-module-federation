// @flow
import * as React from 'react';
import EnumProvider from 'providers/enum';

type Props = {
  value: string,
  enumType: string | Array<string>,
};

const FormattedEnum = ({ enumType, value }: Props) => (
  <EnumProvider enumType={Array.isArray(enumType) ? enumType[0] : enumType}>
    {({ data }) => {
      const found = data.find(e => e.name === value);
      if (found) {
        const stringValue = found.description || found.name;
        return stringValue;
      }
      return '';
    }}
  </EnumProvider>
);

export default FormattedEnum;
