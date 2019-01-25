// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import FormattedDate from 'components/FormattedDate';
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

type Props = OptionalProps & {};

const defaultProps = {
  containers: [],
};

const TimelineDateContainers = ({ containers }: Props) => {
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
            <FormattedDate value={new Date(minAgreedDate)} />
          ) : (
            <FormattedMessage id="modules.Shipments.noDate" defaultMessage="No date" />
          )}
          {' - '}
          {maxAgreedDate ? (
            <FormattedDate value={new Date(maxAgreedDate)} />
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
            <FormattedDate value={new Date(minActualDate)} />
          ) : (
            <FormattedMessage id="modules.Shipments.noDate" defaultMessage="No date" />
          )}
          {' - '}
          {maxActualDate ? (
            <FormattedDate value={new Date(maxActualDate)} />
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
