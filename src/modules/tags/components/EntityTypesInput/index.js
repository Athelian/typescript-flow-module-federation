// @flow
import * as React from 'react';
import Icon from 'components/Icon';

import { WrapperStyle, ItemStyle } from './style';

const EntityTypes = [
  {
    name: 'Product',
    icon: 'PRODUCT',
    color: 'PRODUCT',
  },
  {
    name: 'Order',
    icon: 'ORDER',
    color: 'ORDER',
  },
  {
    name: 'Batch',
    icon: 'BATCH',
    color: 'BATCH',
  },
  {
    name: 'Shipment',
    icon: 'SHIPMENT',
    color: 'SHIPMENT',
  },
  {
    name: 'User',
    icon: 'STAFF',
    color: 'STAFF',
  },
];

type Props = {
  values: Array<string>,
  onChange: string => void,
};

export default class EntityTypesInput extends React.PureComponent<Props> {
  render() {
    const { values, onChange } = this.props;

    return (
      <div className={WrapperStyle}>
        {EntityTypes.map(item => {
          const selected = values.includes(item.name);
          return (
            <div
              key={item.name}
              className={selected ? ItemStyle(item.color) : ItemStyle('WHITE')}
              onClick={() => onChange(item.name)}
              role="presentation"
            >
              {item.name}
              <div>
                <Icon icon={item.icon} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
