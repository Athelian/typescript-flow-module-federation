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

class FilterInput extends React.PureComponent<Props, State> {
  constructor() {
    super();
    this.state = {
      isOpen: false,
      isActive: false,
    };

    this.filterButtonRef = React.createRef();
  }

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

  filterButtonRef: any;

  render() {
    const { initialFilter, children } = this.props;
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
          ignoreElements={[this.filterButtonRef && this.filterButtonRef.current]}
        >
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
                resetForm,
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
                    <button
                      className={ResetButtonStyle}
                      type="button"
                      onClick={() => {
                        resetForm();
                        this.reset(values);
                      }}
                    >
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
