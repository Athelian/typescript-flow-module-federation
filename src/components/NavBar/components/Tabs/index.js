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
  onChange: number => void,
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
        {tabs.map((tab, index) => (
          <TabItem
            key={tab.id}
            active={index === activeIndex}
            onClick={() => this.handleChange(index)}
            {...tab}
            {...rest}
          />
        ))}
      </div>
    );
  }
}

export default Tabs;
