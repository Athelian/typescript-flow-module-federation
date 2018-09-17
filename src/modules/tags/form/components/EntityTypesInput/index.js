// @flow
import * as React from 'react';

type OptionalProps = {
  onBlur: (event: any) => void,
  onFocus: (event: any) => void,
};

type Props = OptionalProps & {
  name: string,
  items: Array<string>,
  value: Array<string>,
  onChange: Object => void,
};

const defaultProps = {
  value: [],
  onBlur: () => {},
  onFocus: () => {},
};

export default class EntityTypesInput extends React.Component<Props> {
  static defaultProps = defaultProps;

  handleClick = (evt: SyntheticInputEvent<*>) => {
    const { name, value, onChange } = this.props;

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
    this.handleBlur();
  };

  handleBlur = () => {
    const { onBlur } = this.props;
    if (onBlur) {
      onBlur({});
    }
  };

  render() {
    const { name, items, value, onFocus } = this.props;

    return (
      <div>
        {items.map(item => (
          <div>
            <input
              name={name}
              onFocus={onFocus}
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
