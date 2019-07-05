// @flow
import * as React from 'react';
import BaseCard from 'components/Cards';
import Icon from 'components/Icon';
import { Display } from 'components/Form';
import TaskRing from 'components/TaskRing';
import QuantityChartMini from 'components/QuantityChartMini';
import useUser from 'hooks/useUser';
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
    importer: { name: string },
    orderedQuantity: number,
    batchedQuantity: number,
    shippedQuantity: number,
    batched: number,
    shipped: number,
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

const RMOrderCard = ({
  order: {
    archived,
    poNo,
    exporter,
    importer,
    orderedQuantity,
    batchedQuantity,
    shippedQuantity,
    batched,
    shipped,
    todo,
  },
}: Props) => {
  const { isExporter } = useUser();

  return (
    <BaseCard icon="ORDER" color="ORDER" isArchived={archived}>
      <div className={RMOrderCardWrapperStyle}>
        <div className={InfoWrapperStyle}>
          <div className={PONoWrapperStyle}>
            <Display align="left">{poNo}</Display>
          </div>

          {/* TODO: ask Kenvin about this logic when we redesign */}
          {isExporter() ? (
            <div className={ExporterWrapperStyle}>
              <Icon icon="IMPORTER" />
              {importer.name}
            </div>
          ) : (
            <div className={ExporterWrapperStyle}>
              <Icon icon="EXPORTER" />
              {exporter.name}
            </div>
          )}
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
};
export default RMOrderCard;
