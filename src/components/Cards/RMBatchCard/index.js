// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import BaseCard from 'components/Cards';
import FormattedDate from 'components/FormattedDate';
import FormattedNumber from 'components/FormattedNumber';
import { Display, Label } from 'components/Form';
import TaskRing from 'components/TaskRing';
import Icon from 'components/Icon';
import type { MetricValue } from 'types';
import {
  RMBatchCardWrapperStyle,
  InfoWrapperStyle,
  NameWrapperStyle,
  DeliveryWrapperStyle,
  DataWrapperStyle,
  DataRowStyle,
  RelatedWrapperStyle,
  RelatedIconStyle,
  TaskRingWrapperStyle,
} from './style';

type Props = {
  batch: {
    archived: boolean,
    no: string,
    batchedQuantity: number,
    totalVolume: ?MetricValue,
    deliveredAt: ?string,
    shipment: ?Object,
    container: ?Object,
    todo: {
      taskCount: {
        completed: number,
        inProgress: number,
        remain: number,
        skipped: number,
      },
    },
  },
};

export default class RMBatchCard extends React.PureComponent<Props> {
  render() {
    const {
      batch: { no, archived, batchedQuantity, totalVolume, deliveredAt, shipment, container, todo },
    } = this.props;

    return (
      <BaseCard icon="BATCH" color="BATCH" isArchived={archived}>
        <div className={RMBatchCardWrapperStyle}>
          <div className={InfoWrapperStyle}>
            <div className={NameWrapperStyle}>
              <Display align="left">{no}</Display>
            </div>

            <div className={DeliveryWrapperStyle}>
              <Label>
                <FormattedMessage id="components.cards.delivery" defaultMessage="DELIVERY" />
              </Label>
              {deliveredAt ? (
                <FormattedDate value={deliveredAt} />
              ) : (
                <FormattedMessage id="components.cards.na" defaultMessage="N/A" />
              )}
            </div>
          </div>

          <div className={DataWrapperStyle}>
            <div className={DataRowStyle}>
              <Label>
                <FormattedMessage id="components.cards.qty" defaultMessage="QTY" />
              </Label>
              <Display align="left">
                <FormattedNumber value={batchedQuantity} />
              </Display>
            </div>

            <div className={DataRowStyle}>
              <Label>
                <FormattedMessage id="components.cards.vol" defaultMessage="VOL" />
              </Label>
              <Display align="left">
                {totalVolume ? (
                  <>
                    <FormattedNumber value={totalVolume.value} />
                    {` ${totalVolume.metric}`}
                  </>
                ) : (
                  <FormattedMessage id="components.cards.na" defaultMessage="N/A" />
                )}
              </Display>
            </div>
          </div>

          <div className={RelatedWrapperStyle}>
            <div className={RelatedIconStyle(!!shipment)}>
              <Icon icon="SHIPMENT" />
            </div>

            <div className={RelatedIconStyle(!!container)}>
              <Icon icon="CONTAINER" />
            </div>
          </div>

          <div className={TaskRingWrapperStyle}>
            <TaskRing {...todo} size={18} />
          </div>
        </div>
      </BaseCard>
    );
  }
}
