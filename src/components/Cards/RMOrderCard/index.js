// @flow
import * as React from 'react';
import BaseCard from 'components/Cards';
import Icon from 'components/Icon';
import { Display } from 'components/Form';
import TaskRing from 'components/TaskRing';
import QuantityChartMini from 'components/QuantityChartMini';
import {
  RMOrderCardWrapperStyle,
  InfoWrapperStyle,
  PONoWrapperStyle,
  ExporterWrapperStyle,
  ChartWrapperStyle,
  TaskRingWrapperStyle,
} from './style';

type Props = {
  order: {
    archived: boolean,
    poNo: string | React.Node,
    exporter: { name: string },
    orderedQuantity: number,
    batchedQuantity: number,
    shippedQuantity: number,
    batched: number,
    shipped: number,
    todo: {
      completedCount: number,
      inProgressCount: number,
      remainingCount: number,
    },
  },
};

export default class RMOrderCard extends React.PureComponent<Props> {
  render() {
    const {
      order: {
        archived,
        poNo,
        exporter,
        orderedQuantity,
        batchedQuantity,
        shippedQuantity,
        batched,
        shipped,
        todo,
      },
    } = this.props;

    return (
      <BaseCard icon="ORDER" color="ORDER" isArchived={archived}>
        <div className={RMOrderCardWrapperStyle}>
          <div className={InfoWrapperStyle}>
            <div className={PONoWrapperStyle}>
              <Display align="left">{poNo}</Display>
            </div>

            <div className={ExporterWrapperStyle}>
              <Icon icon="EXPORTER" />
              {exporter.name}
            </div>
          </div>

          <div className={ChartWrapperStyle}>
            <QuantityChartMini
              orderedQuantity={orderedQuantity}
              batchedQuantity={batchedQuantity}
              shippedQuantity={shippedQuantity}
              batched={batched}
              shipped={shipped}
            />
          </div>

          <div className={TaskRingWrapperStyle}>
            <TaskRing {...todo} size={18} />
          </div>
        </div>
      </BaseCard>
    );
  }
}
