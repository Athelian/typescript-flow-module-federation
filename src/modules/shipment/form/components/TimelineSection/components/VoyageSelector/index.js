// @flow
import * as React from 'react';
import { VoyageSelectorWrapperStyle } from './style';

type Props = {
  shipment: any,
};

const VoyageSelector = ({ shipment }: Props) => (
  <div className={VoyageSelectorWrapperStyle}>{shipment.voyages.length}</div>
);

export default VoyageSelector;
