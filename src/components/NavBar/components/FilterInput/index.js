// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Form } from 'components/Form';
import Icon from 'components/Icon';
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
    errors: Object,
    touched: Object,
    handleChange: Function,
    handleBlur: Function,
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

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    const { initialFilter } = this.props;
    this.handleIsActive(initialFilter);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.handleIsActive(nextProps.initialFilter);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = (event: MouseEvent) => {
    const { isOpen } = this.state;
    if (
      this.wrapperRef &&
      event.target instanceof Node &&
      !this.wrapperRef.contains(event.target) &&
      isOpen
    ) {
      this.close();
    }
  };

  handleIsActive = (values: Object) => {
    let isActive = false;
    Object.values(values).forEach(value => {
      if (value) {
        isActive = true;
        return false;
      }
      return true;
    });

    this.setState({ isActive });
  };

  open = () => {
    this.setState({ isOpen: true });
  };

  close = () => {
    this.setState({ isOpen: false });
  };

  toggle = () => {
    this.setState(previous => ({ isOpen: !previous.isOpen }));
  };

  submit = (values: Object) => {
    const { onChange } = this.props;
    this.handleIsActive(values);
    onChange(values);
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

  wrapperRef: ?HTMLDivElement;

  render() {
    const { initialFilter, children } = this.props;
    const { isOpen, isActive } = this.state;

    return (
      <div
        className={WrapperStyle}
        ref={ref => {
          this.wrapperRef = ref;
        }}
      >
        <button type="button" className={ButtonStyle} onClick={this.toggle}>
          {isActive && <span className={ActiveStyle} />}
          <Icon icon="faFilter" />
        </button>
        <div className={ContentStyle(isOpen)}>
          <Form
            initialValues={initialFilter}
            enableReinitialize
            onSubmit={this.submit}
            onReset={this.reset}
            render={({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              handleReset,
              setFieldValue,
              setFieldTouched,
              isSubmitting,
            }) => (
              <form className={FormStyle} onSubmit={handleSubmit} onReset={handleReset}>
                <div className={InputWrapperStyle}>
                  {children({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    setFieldValue,
                    setFieldTouched,
                  })}
                </div>
                <div className={ButtonsWrapper}>
                  <button className={ResetButtonStyle} type="button">
                    <FormattedMessage {...messages.reset} />
                  </button>
                  <button className={SubmitButtonStyle} type="submit" disabled={isSubmitting}>
                    <FormattedMessage {...messages.apply} />
                  </button>
                </div>
              </form>
            )}
          />
        </div>
      </div>
    );
  }
}

export default FilterInput;
