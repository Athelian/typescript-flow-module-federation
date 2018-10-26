// @flow
import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import Icon from 'components/Icon';
import OutsideClickHandler from 'components/OutsideClickHandler';
import ActionSelectorPrimary from 'modules/relationMap/common/ActionsSection/ActionSelectorPrimary';

import {
  WrapperStyle,
  ButtonStyle,
  ActiveStyle,
  ContentStyle,
  FilterFormWrapperStyle,
  ResetButtonStyle,
  SubmitButtonStyle,
} from './style';
import messages from './messages';

type Props = {
  initialFilter: Object,
  onApply: (filters: Object) => void,
  children: ({
    onChangeFilter: Function,
  }) => React.Node,
  intl: IntlShape,
};

type filterType = {
  query: ?string,
};

type State = {
  isOpen: boolean,
  isActive: boolean,
  filter: filterType,
};

class AdvanceFilterInput extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    const { initialFilter = {} } = props;
    this.state = {
      isOpen: false,
      isActive: false,
      filter: {
        ...initialFilter,
        query: initialFilter.query || '',
      },
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

  onChangeFilter = (filter: filterType) => {
    this.setState({ filter });
  };

  submit = () => {
    const { onApply } = this.props;
    const { filter } = this.state;
    const isActive = this.hasAnyFilter(filter);
    onApply(filter);
    this.setState({ isActive });
    // this.close();
  };

  reset = () => {
    this.setState({ isActive: false, filter: { query: '' } });

    this.close();
  };

  filterButtonRef: any;

  render() {
    const { initialFilter, children, intl } = this.props;
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
            <ActionSelectorPrimary directive={intl.formatMessage(messages.filterBy)}>
              <button
                className={ResetButtonStyle}
                type="button"
                onClick={() => {
                  this.reset();
                }}
              >
                <FormattedMessage {...messages.reset} />
              </button>
              <button
                className={SubmitButtonStyle}
                type="submit"
                onClick={() => {
                  this.submit();
                }}
              >
                <FormattedMessage {...messages.apply} />
              </button>
            </ActionSelectorPrimary>
            <div className={FilterFormWrapperStyle}>
              {children({
                onChangeFilter: this.onChangeFilter,
              })}
            </div>
          </div>
        </OutsideClickHandler>
      </div>
    );
  }
}

export default injectIntl(AdvanceFilterInput);
