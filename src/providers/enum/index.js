// @flow
import * as React from 'react';
import useEnum from 'hooks/useEnum';

type Props = {
  enumType: string,
  children: ({ loading: boolean, error: any, data: any }) => React.Node,
};

const EnumProvider = ({ enumType, children }: Props) => {
  const { enums, loading } = useEnum(enumType);

  return children({
    loading,
    error: null,
    data: enums,
  });
};

export default EnumProvider;
