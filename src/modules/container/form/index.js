// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import containerFormContainer from 'modules/container/form/container';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import { FormTooltip, SectionHeader, LastModified, SectionWrapper } from 'components/Form';
import { uniqueOrders } from 'modules/container/utils';
import { ContainerSection, ShipmentSection, BatchesSection, OrdersSection } from './components';
import { FormWrapperStyle, StatusStyle, StatusLabelStyle } from './style';

type OptionalProps = {
  onFormReady: () => void,
};

type Props = OptionalProps & {
  container: Object,
};

const defaultProps = {
  onFormReady: () => {},
};

export default class containerForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onFormReady } = this.props;

    if (onFormReady) onFormReady();
  }

  render() {
    const { container } = this.props;
    return (
      <div className={FormWrapperStyle}>
        <SectionWrapper id="container_containerSection">
          <SectionHeader
            icon="CONTAINER"
            title={<FormattedMessage id="modules.container.container" defaultMessage="CONTAINER" />}
          >
            <>
              <LastModified updatedAt={container.updatedAt} updatedBy={container.updatedBy} />

              <div className={StatusStyle(container.archived)}>
                <Icon icon={container.archived ? 'ARCHIVED' : 'ACTIVE'} />
                <div className={StatusLabelStyle}>
                  {container.archived ? (
                    <FormattedMessage id="modules.container.archived" defaultMessage="Archived" />
                  ) : (
                    <FormattedMessage id="modules.container.active" defaultMessage="Active" />
                  )}
                </div>
                <FormTooltip
                  infoMessage={
                    <FormattedMessage
                      id="modules.container.archived.tooltip.infoMessage"
                      defaultMessage="The status is the same as the Shipment's status"
                    />
                  }
                  position="bottom"
                />
              </div>
            </>
          </SectionHeader>
          <ContainerSection />
        </SectionWrapper>
        <SectionWrapper id="container_shipmentSection">
          <SectionHeader
            icon="SHIPMENT"
            title={<FormattedMessage id="modules.container.shipment" defaultMessage="SHIPMENT" />}
          />
          <ShipmentSection shipment={container.shipment} />
        </SectionWrapper>
        <Subscribe to={[containerFormContainer]}>
          {({ state: values }) => {
            const { batches = [] } = values;
            const orders = uniqueOrders(batches);
            return (
              <>
                <SectionWrapper id="container_batchesSection">
                  <SectionHeader
                    icon="BATCH"
                    title={
                      <>
                        <FormattedMessage id="modules.container.batches" defaultMessage="BATCHES" />{' '}
                        (<FormattedNumber value={batches.length} />)
                      </>
                    }
                  />
                  <BatchesSection />
                </SectionWrapper>
                <SectionWrapper id="container_ordersSection">
                  <SectionHeader
                    icon="ORDER"
                    title={
                      <>
                        <FormattedMessage id="modules.container.orders" defaultMessage="ORDERS" /> (
                        <FormattedNumber value={orders.length} />)
                      </>
                    }
                  />
                  <OrdersSection orders={orders} />
                </SectionWrapper>
              </>
            );
          }}
        </Subscribe>
      </div>
    );
  }
}
