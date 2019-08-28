// @flow
import React from 'react';
import { Hits } from 'modules/relationMapV2/store';

type Props = {|
  isEnable: boolean,
  onChange: mixed => void,
  filter: Object,
|};

const filterMapping = {
  '0': {},
  '1': {
    shipmentArchived: true,
  },
};

export default function CustomFiler({ isEnable, onChange, filter }: Props) {
  const store = Hits.useContainer();
  console.warn({
    filter,
    store,
  });
  if (!isEnable) return null;
  return (
    <div>
      <select onChange={evt => onChange(filterMapping[evt.target.value])}>
        <option value={0}>N/A</option>
        <option value={1}>Shipment Archived</option>
      </select>
    </div>
  );
}
