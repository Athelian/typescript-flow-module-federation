// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import FormattedDateTZ from 'components/FormattedDateTZ';
import type { UserPayload } from 'generated/graphql';
import { TimelineDateWrapperStyle, LabelStyle, DateStyle, ApprovedIconStyle } from './style';

type OptionalProps = {
  minDate: ?string,
  maxDate: ?string,
  approved: boolean,
  color: string,
};

type Props = OptionalProps & {
  user: UserPayload,
};

const defaultProps = {
  minDate: null,
  maxDate: null,
  approved: false,
  color: 'BLACK',
};

const TimelineDate = ({ minDate, maxDate, approved, color, user }: Props) => (
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
          <FormattedDateTZ value={minDate} user={user} />
        ) : (
          <FormattedMessage id="modules.Shipments.noDate" defaultMessage="No date" />
        )}
      </div>

      <div className={DateStyle(!!maxDate, color)}>
        {maxDate ? (
          <FormattedDateTZ value={maxDate} user={user} />
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
