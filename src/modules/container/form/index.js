// @flow
import React from 'react';

import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import containerFormContainer from 'modules/container/form/container';
import Icon from 'components/Icon';

import { FormTooltip, SectionHeader, LastModified, SectionWrapper } from 'components/Form';
import OrdersSection from 'modules/shipment/form/components/OrdersSection';
import { uniqueOrders } from 'modules/container/utils';
import { ContainerSection, ShipmentSection, BatchSection } from './components';

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
        <SectionWrapper id="ContainerSection">
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
        <SectionWrapper id="ShipmentSection">
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
                <SectionWrapper id="BatchSection">
                  <SectionHeader
                    icon="BATCH"
                    title={
                      <>
                        <FormattedMessage id="modules.container.batch" defaultMessage="BATCHES" /> (
                        {batches.length})
                      </>
                    }
                  />
                  <BatchSection />
                </SectionWrapper>
                <SectionWrapper id="OrderSection">
                  <SectionHeader
                    icon="ORDER"
                    title={
                      <>
                        <FormattedMessage id="modules.container.order" defaultMessage="ORDERS" /> (
                        {orders.length})
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
