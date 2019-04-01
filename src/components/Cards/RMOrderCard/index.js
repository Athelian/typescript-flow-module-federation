// @flow
import * as React from 'react';
import BaseCard from 'components/Cards';
import Icon from 'components/Icon';
import { Display } from 'components/Form';
import QuantityChartMini from 'components/QuantityChartMini';
import {
  RMOrderCardWrapperStyle,
  InfoWrapperStyle,
  PONoWrapperStyle,
  ExporterWrapperStyle,
  ChartWrapperStyle,
} from './style';

type Props = {
  order: {
    poNo: string | React.Node,
    exporter: { name: string },
    orderedQuantity: number,
    batchedQuantity: number,
    shippedQuantity: number,
  },
};

export default class RMOrderCard extends React.PureComponent<Props> {
  render() {
    const {
      order: { poNo, exporter, orderedQuantity, batchedQuantity, shippedQuantity },
    } = this.props;

    return (
      <BaseCard icon="ORDER" color="ORDER" actions={[]}>
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
            />
          </div>
        </div>
      </BaseCard>
    );
  }
}
