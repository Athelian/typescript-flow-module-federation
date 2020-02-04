// @flow
import React, { lazy, Suspense } from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { isEquals, getByPathWithDefault, getByPath } from 'utils/fp';
import { ContainerBatchesContainer } from 'modules/container/form/containers';
import LoadingIcon from 'components/LoadingIcon';
import { SectionHeader, SectionWrapper } from 'components/Form';
import { uniqueOrders } from 'modules/container/utils';
import { ContainerSection, ShipmentSection } from './components';
import { FormWrapperStyle } from './style';

const AsyncBatchesSection = lazy(() => import('./components/BatchesSection'));
const AsyncOrdersSection = lazy(() => import('./components/OrdersSection'));

type OptionalProps = {
  isSlideView: boolean,
};

type Props = OptionalProps & {
  container: Object,
};

const defaultProps = {
  isSlideView: false,
};

export default class ContainerForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  shouldComponentUpdate(nextProps: Props) {
    const { container } = this.props;
    return !isEquals(container, nextProps.container);
  }

  render() {
    const { container, isSlideView } = this.props;
    return (
      <Suspense fallback={<LoadingIcon />}>
        <div className={FormWrapperStyle}>
          <SectionWrapper id="container_containerSection">
            <ContainerSection container={container} />
          </SectionWrapper>

          {!isSlideView && (
            <SectionWrapper id="container_shipmentSection">
              <SectionHeader
                icon="SHIPMENT"
                title={
                  <FormattedMessage id="modules.container.shipment" defaultMessage="SHIPMENT" />
                }
              />
              <ShipmentSection shipment={container.shipment} />
            </SectionWrapper>
          )}

          <AsyncBatchesSection
            exporterId={getByPath('shipment.exporter.id', container)}
            importerId={getByPathWithDefault('', 'shipment.importer.id', container)}
            containerIsArchived={container.archived}
            isSlideView={isSlideView}
          />

          <Subscribe to={[ContainerBatchesContainer]}>
            {({ state: values }) => {
              const { batches = [] } = values;
              const orders = uniqueOrders(batches);
              return <AsyncOrdersSection orders={orders} />;
            }}
          </Subscribe>
        </div>
      </Suspense>
    );
  }
}
