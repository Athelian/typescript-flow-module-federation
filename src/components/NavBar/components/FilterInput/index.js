// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Formik, type FormikActions } from 'formik';
import Icon from 'components/Icon';
import {
  WrapperStyle,
  ButtonStyle,
  ActiveStyle,
  ContentStyle,
  FormStyle,
  ResetButtonStyle,
  SubmitButtonStyle,
  ButtonsWrapper,
} from './style';
import messages from './messages';
import InputGroup from './components/InputGroup';

type Props = {
  initialFilter: Object,
  onChange: (filters: Object) => void,
  fixed?: boolean,
  children: ({
    values: Object,
    errors: Object,
    touched: Object,
    handleChange: Function,
    handleBlur: Function,
    setFieldValue: Function,
  }) => React.Node,
  isExpanded: boolean,
};

type State = {
  isOpen: boolean,
  isActive: boolean,
};

class FilterInput extends React.Component<Props, State> {
  static defaultProps = {
    fixed: true,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      isOpen: false,
      isActive: false,
    };
  }

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

  submit = (values: Object, form: FormikActions) => {
    const { onChange } = this.props;
    this.handleIsActive(values);
    onChange(values);
    form.setSubmitting(false);
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
  };

  wrapperRef: ?HTMLDivElement;

  render() {
    const { initialFilter, children, isExpanded, fixed } = this.props;
    const { isOpen, isActive } = this.state;

    return (
      <div
        className={WrapperStyle}
        ref={ref => {
          this.wrapperRef = ref;
        }}
      >
        <button className={ButtonStyle} onClick={this.toggle}>
          {isActive && <span className={ActiveStyle} />}
          <Icon icon="faFilter" />
        </button>
        <div className={ContentStyle(!!fixed, isOpen, isExpanded)}>
          <Formik
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
                <InputGroup>
                  {children({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    setFieldValue,
                    setFieldTouched,
                  })}
                </InputGroup>
                <div className={ButtonsWrapper}>
                  <button className={ResetButtonStyle} type="reset">
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
