// @flow
import React from 'react';

type Props = {|
  isEnable: boolean,
  onChange: mixed => void,
|};

const filterMapping = {
  '0': {},
  '1': {
    shipmentArchived: true,
  },
};

export default function CustomFiler({ isEnable, onChange }: Props) {
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
