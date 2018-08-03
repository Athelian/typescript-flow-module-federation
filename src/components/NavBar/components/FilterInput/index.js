// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Form } from 'components/Form';
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
    this.setState(previous => ({ isOpen: !previous.isOpen }));
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
    const { initialFilter, children } = this.props;
    const { isOpen, isActive } = this.state;

    return (
      <div className={WrapperStyle}>
        <button type="button" className={ButtonStyle} onClick={this.toggle}>
          {(isActive || this.hasAnyFilter(initialFilter)) && <span className={ActiveStyle} />}
          <Icon icon="faFilter" />
        </button>
        <OutsideClickHandler onOutsideClick={this.close}>
          <div className={ContentStyle(isOpen)}>
            <Form
              initialValues={initialFilter}
              enableReinitialize
              onSubmit={this.submit}
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
                    <button className={ResetButtonStyle} type="button" onClick={this.reset}>
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
        </OutsideClickHandler>
      </div>
    );
  }
}

export default FilterInput;
