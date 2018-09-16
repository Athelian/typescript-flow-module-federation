// @flow
import * as React from 'react';

type Props = {
  name: string,
  items: Array<string>,
  value: Array<string>,
  onChange: Object => void,
  onBlur?: (string, boolean) => void,
};

const defaultProps = {
  value: [],
};

export default class EntityTypesInput extends React.Component<Props> {
  static defaultProps = defaultProps;

  handleClick = (evt: Event) => {
    const { name, value, onChange } = this.props;

    if (!(evt.target instanceof HTMLInputElement)) {
      return;
    }

    const { value: currentValue } = evt.target;
    const selectedItems = value instanceof Array ? value : [];
    const index = selectedItems.indexOf(currentValue);
    if (index === -1) {
      selectedItems.push(currentValue);
    } else {
      selectedItems.splice(index, 1);
    }

    const event = { ...evt, target: { name, value: selectedItems } };
    onChange(event);
  };

  handleBlur = () => {
    const { name, onBlur } = this.props;
    if (onBlur) {
      onBlur(name, true);
    }
  };

  render() {
    const { name, items, value } = this.props;

    return (
      <div>
        {items.map(item => (
          <div>
            <input
              name={name}
              type="checkbox"
              checked={value.includes(item)}
              key={item}
              value={item}
              onClick={this.handleClick}
            />
            {item}
          </div>
        ))}
      </div>
    );
  }
}
