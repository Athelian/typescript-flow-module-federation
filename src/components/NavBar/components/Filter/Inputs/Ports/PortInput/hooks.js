// @flow
import * as React from 'react';
import useEnum from 'hooks/useEnum';

export type PortOption = {
  code: string,
  name: string,
  transportType: 'Sea' | 'Air',
};

export default function usePortOptions(): Array<PortOption> {
  const { enums: seaports } = useEnum('Seaport');
  const { enums: airports } = useEnum('Airport');
  const [options, setOptions] = React.useState<Array<PortOption>>([]);

  React.useEffect(() => {
    setOptions(
      [
        ...seaports.map(seaport => ({
          code: seaport.name,
          name: seaport.description,
          transportType: 'Sea',
        })),
        ...airports.map(airport => ({
          code: airport.name,
          name: airport.description,
          transportType: 'Air',
        })),
      ].sort((a, b) => a.name.localeCompare(b.name))
    );
  }, [seaports, airports]);

  return options;
}
