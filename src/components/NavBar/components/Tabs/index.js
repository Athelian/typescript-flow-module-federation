// @flow
import * as React from 'react';
import { WrapperStyle } from './style';
import TabItem from './components/TabItem';

type Props = {
  tabs: Array<{ label: string | React.Node }>,
  disabled?: boolean,
  onChange: number => void,
};

type State = {
  activeIndex: number,
};

class Tabs extends React.Component<Props, State> {
  static defaultProps = {
    disabled: false,
  };

  state = {
    activeIndex: 0,
  };

  handleChange = (index: number) => {
    this.setState({ activeIndex: index });

    const { onChange } = this.props;
    onChange(index);
  };

  render() {
    const { tabs, ...rest } = this.props;
    const { activeIndex } = this.state;
    return (
      <div className={WrapperStyle}>
        {tabs.map(({ label }, index) => (
          <TabItem
            label={label}
            active={index === activeIndex}
            onActive={() => this.handleChange(index)}
            {...rest}
          />
        ))}
      </div>
    );
  }
}

export default Tabs;
