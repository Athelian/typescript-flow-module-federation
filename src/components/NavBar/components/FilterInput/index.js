// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import OutsideClickHandler from 'components/OutsideClickHandler';

import {
  WrapperStyle,
  ButtonStyle,
  ActiveStyle,
  ContentStyle,
  FormStyle,
  InputWrapperStyle,
  ResetButtonStyle,
  SubmitButtonStyle,
  ButtonsWrapper,
} from './style';
import messages from './messages';

type Props = {
  initialFilter: Object,
  onChange: (filters: Object) => void,
  children: ({
    values: Object,
    setFieldValue: Function,
  }) => React.Node,
};

type State = {
  isOpen: boolean,
  isActive: boolean,
};

class FilterInput extends React.Component<Props, State> {
  state = {
    isOpen: false,
    isActive: false,
  };

  filterButtonRef: { current: HTMLButtonElement | null } = React.createRef();

  componentDidMount() {
    const { initialFilter } = this.props;
    const isActive = this.hasAnyFilter(initialFilter);
    this.setState({ isActive });
  }

  hasAnyFilter = (values: Object) => Object.values(values).some(value => !!value);

  open = () => {
    this.setState({ isOpen: true });
  };

  close = () => {
    this.setState({ isOpen: false });
  };

  toggle = () => {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };

  submit = (values: Object) => {
    const { onChange } = this.props;
    const isActive = this.hasAnyFilter(values);
    onChange(values);
    this.setState({ isActive });
    this.close();
  };

  reset = (values: Object) => {
    const { onChange } = this.props;

    this.setState({ isActive: false });

    const resetFilter = {};

    Object.keys(values).forEach(key => {
      resetFilter[key] = null;
    });

    onChange(resetFilter);
    this.close();
  };

  render() {
    const { initialFilter, children, onChange } = this.props;
    const { isOpen, isActive } = this.state;

    return (
      <div className={WrapperStyle}>
        <button
          type="button"
          className={ButtonStyle}
          onClick={this.toggle}
          ref={this.filterButtonRef}
        >
          {(isActive || this.hasAnyFilter(initialFilter)) && <span className={ActiveStyle} />}
          <Icon icon="FILTER" />
        </button>
        <OutsideClickHandler
          onOutsideClick={this.close}
          ignoreElements={
            this.filterButtonRef && this.filterButtonRef.current
              ? [this.filterButtonRef.current]
              : []
          }
        >
          <div className={ContentStyle(isOpen)}>
            <form className={FormStyle}>
              <div className={InputWrapperStyle}>
                {children({
                  values: initialFilter,
                  setFieldValue: onChange,
                })}
              </div>
              <div className={ButtonsWrapper}>
                <button
                  className={ResetButtonStyle}
                  type="button"
                  onClick={() => {
                    this.reset({});
                  }}
                >
                  <FormattedMessage {...messages.reset} />
                </button>
                <button className={SubmitButtonStyle} type="submit">
                  <FormattedMessage {...messages.apply} />
                </button>
              </div>
            </form>
          </div>
        </OutsideClickHandler>
      </div>
    );
  }
}

export default FilterInput;
