// @flow
import { useContext } from 'react';
import { getByPathWithDefault } from 'utils/fp';
import { EnumsContext } from 'providers/enums';

const useEnums = (enumType: 'Currency' | 'Incoterm' | 'LoadType' | 'TransportType') => {
  const enums = useContext(EnumsContext);

  return getByPathWithDefault([], `${enumType}.enumValues`, enums);
};

export default useEnums;
