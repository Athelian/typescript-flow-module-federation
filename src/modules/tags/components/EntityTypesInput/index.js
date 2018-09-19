// @flow
import * as React from 'react';
import Icon from 'components/Icon';

import { LabelStyle, IconStyle, SelectedStyle } from './style';

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
  name: string,
  values: Array<string>,
  onChange?: (string, Array<string>) => void,
  onBlur?: (event: any) => void,
};

const defaultProps = {
  onChange: () => {},
  onBlur: () => {},
};

export default class EntityTypesInput extends React.Component<Props> {
  static defaultProps = defaultProps;

  handleClick = (name: string, value: string) => {
    const { values, onChange } = this.props;

    const selectedItems = values instanceof Array ? values : [];
    const index = selectedItems.indexOf(value);
    if (index === -1) {
      values.push(value);
    } else {
      values.splice(index, 1);
    }
    if (onChange) {
      onChange(name, values);
    }

    this.handleBlur();
  };

  handleBlur = () => {
    const { onBlur } = this.props;
    if (onBlur) {
      onBlur({});
    }
  };

  render() {
    const { name, values } = this.props;

    const selectedItems = values instanceof Array ? values : [];

    return (
      <div>
        {EntityTypes.map(item => {
          const selected = selectedItems.includes(item.name);
          return (
            <div
              key={item.name}
              className={selected ? SelectedStyle(item.color) : SelectedStyle('GRAY')}
            >
              <div className={LabelStyle}>{item.name}</div>
              <div className={selected ? IconStyle(item.color) : IconStyle('Gray')}>
                <button type="button" onClick={() => this.handleClick(name, item.name)}>
                  <Icon icon={item.icon} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
