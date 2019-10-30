// @flow
import * as React from 'react';
import { WrapperStyle } from './style';
import TabItem from './components/TabItem';

type OptionalProps = {
  activeIndex: number,
};
type Props = OptionalProps & {
  tabs: Array<{ id: string, icon: string, label: string | React.Node, disabled?: boolean }>,
  disabled?: boolean,
  onChange?: number => void,
};

type State = {
  activeIndex: number,
};

class Tabs extends React.Component<Props, State> {
  static defaultProps = {
    disabled: false,
    activeIndex: 0,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      activeIndex: props.activeIndex,
    };
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.activeIndex !== state.activeIndex) {
      return { activeIndex: props.activeIndex };
    }
    return null;
  }

  handleChange = (index: number) => {
    this.setState({ activeIndex: index });
    const { onChange } = this.props;
    if (onChange) onChange(index);
  };

  render() {
    const { tabs, ...rest } = this.props;
    const { activeIndex } = this.state;
    return (
      <div className={WrapperStyle}>
        {tabs.map((tab, index) => (
          <TabItem
            key={tab.id}
            active={index === activeIndex}
            onClick={() => this.handleChange(index)}
            {...tab}
            {...rest}
            {...(tab.disabled ? { disabled: tab.disabled } : {})}
          />
        ))}
      </div>
    );
  }
}

export default Tabs;
