// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import FormattedDateTZ from 'components/FormattedDateTZ';
import { getContainerDatesRange } from 'modules/shipment/form/components/TimelineSection/components/Timeline/helpers';
import {
  TimelineDateContainersWrapperStyle,
  TimelineDateWrapperStyle,
  LabelStyle,
  AgreedDateStyle,
  ActualDateStyle,
  ApprovedIconStyle,
} from './style';

type OptionalProps = {
  containers: Array<Object>,
};

type Props = OptionalProps & {
  user: UserPayload,
};

const defaultProps = {
  containers: [],
};

const TimelineDateContainers = ({ containers, user }: Props) => {
  const {
    minAgreedDate,
    maxAgreedDate,
    agreedApproved,
    minActualDate,
    maxActualDate,
    actualApproved,
  } = getContainerDatesRange(containers);

  return (
    <div className={TimelineDateContainersWrapperStyle}>
      <div className={TimelineDateWrapperStyle}>
        <div className={LabelStyle}>
          <FormattedMessage id="modules.Shipments.agreedDateLabel" defaultMessage="AGREED" />
        </div>

        <div className={AgreedDateStyle(!!minAgreedDate)}>
          {minAgreedDate ? (
            <FormattedDateTZ value={minAgreedDate} user={user} />
          ) : (
            <FormattedMessage id="modules.Shipments.noDate" defaultMessage="No date" />
          )}
          {' - '}
          {maxAgreedDate ? (
            <FormattedDateTZ value={maxAgreedDate} user={user} />
          ) : (
            <FormattedMessage id="modules.Shipments.noDate" defaultMessage="No date" />
          )}
        </div>

        <div className={ApprovedIconStyle(agreedApproved)}>
          <Icon icon="CHECKED" />
        </div>
      </div>

      <div className={TimelineDateWrapperStyle}>
        <div className={LabelStyle}>
          <FormattedMessage id="modules.Shipments.actualDateLabel" defaultMessage="ACTUAL" />
        </div>

        <div className={ActualDateStyle(!!minActualDate)}>
          {minActualDate ? (
            <FormattedDateTZ value={minActualDate} user={user} />
          ) : (
            <FormattedMessage id="modules.Shipments.noDate" defaultMessage="No date" />
          )}
          {' - '}
          {maxActualDate ? (
            <FormattedDateTZ value={maxActualDate} user={user} />
          ) : (
            <FormattedMessage id="modules.Shipments.noDate" defaultMessage="No date" />
          )}
        </div>

        <div className={ApprovedIconStyle(actualApproved)}>
          <Icon icon="CHECKED" />
        </div>
      </div>
    </div>
  );
};

TimelineDateContainers.defaultProps = defaultProps;

export default TimelineDateContainers;
