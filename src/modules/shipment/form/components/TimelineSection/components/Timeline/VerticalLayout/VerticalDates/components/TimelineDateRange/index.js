// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import FormattedDate from 'components/FormattedDate';
import { TimelineDateWrapperStyle, LabelStyle, DateStyle, ApprovedIconStyle } from './style';

type OptionalProps = {
  minDate: ?(string | Date),
  maxDate: ?(string | Date),
  approved: boolean,
  color: string,
};

type Props = OptionalProps & {};

const defaultProps = {
  minDate: null,
  maxDate: null,
  approved: false,
  color: 'BLACK',
};

const TimelineDate = ({ minDate, maxDate, approved, color }: Props) => (
  <div className={TimelineDateWrapperStyle}>
    <div>
      <div className={LabelStyle}>
        <FormattedMessage id="modules.Shipments.from" defaultMessage="FROM" />
      </div>
      <div className={LabelStyle}>
        <FormattedMessage id="modules.Shipments.to" defaultMessage="TO" />
      </div>
    </div>
    <div>
      <div className={DateStyle(!!minDate, color)}>
        {minDate ? (
          <FormattedDate value={new Date(minDate)} />
        ) : (
          <FormattedMessage id="modules.Shipments.noDate" defaultMessage="No date" />
        )}
      </div>

      <div className={DateStyle(!!maxDate, color)}>
        {maxDate ? (
          <FormattedDate value={new Date(maxDate)} />
        ) : (
          <FormattedMessage id="modules.Shipments.noDate" defaultMessage="No date" />
        )}
      </div>
    </div>

    <div className={ApprovedIconStyle(approved)}>
      <Icon icon="CHECKED" />
    </div>
  </div>
);

TimelineDate.defaultProps = defaultProps;

export default TimelineDate;
