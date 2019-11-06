// @flow
import * as React from 'react';
import PartnerDisplay from '../PartnerDisplay';

type Props = {
  value: Array<Object>,
};

function PartnersDisplay({ value }: Props): React$Node {
  return value.map(item => <PartnerDisplay key={item.id} value={item} />);
}

export default PartnersDisplay;
