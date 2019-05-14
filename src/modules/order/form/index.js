// @flow

import React, { lazy, Suspense } from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { navigate } from '@reach/router';
import { BooleanValue } from 'react-values';
import { CloneButton } from 'components/Buttons';
import LoadingIcon from 'components/LoadingIcon';
import { ORDER_CREATE, ORDER_UPDATE } from 'modules/permission/constants/order';
import { isEquals } from 'utils/fp';
import { encodeId } from 'utils/id';
import { SectionHeader, SectionWrapper, LastModified, StatusToggle } from 'components/Form';
import { OrderActivateDialog, OrderArchiveDialog } from 'modules/order/common/Dialog';
import AutoDateBinding from 'modules/task/common/AutoDateBinding';
import { PermissionConsumer } from 'modules/permission';
import OrderSection from './components/OrderSection';
import { OrderFormWrapperStyle } from './style';
import { OrderInfoContainer, OrderFilesContainer, OrderTasksContainer } from './containers';

const AsyncItemsSection = lazy(() => import('./components/ItemsSection'));
const AsyncDocumentsSection = lazy(() => import('./components/DocumentsSection'));
const AsyncTaskSection = lazy(() => import('modules/task/common/TaskSection'));
const AsyncShipmentsSection = lazy(() => import('./components/ShipmentsSection'));
const AsyncContainersSection = lazy(() => import('./components/ContainersSection'));

type OptionalProps = {
  isNew: boolean,
  isClone: boolean,
  order: Object,
};

type Props = OptionalProps & {};

const defaultProps = {
  isNew: false,
  isClone: false,
  order: {},
};

export default class OrderForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  shouldComponentUpdate(nextProps: Props) {
    const { order } = this.props;

    return !isEquals(order, nextProps.order);
  }

  onClone = () => {
    const { order } = this.props;
    navigate(`/order/clone/${encodeId(order.id)}`);
  };

  render() {
    const { isNew, isClone, order } = this.props;
    const { updatedAt, updatedBy, archived } = order;
    return (
      <Suspense fallback={<LoadingIcon />}>
        <PermissionConsumer>
          {hasPermission => {
            const canCreate = hasPermission(ORDER_CREATE);
            const canUpdate = hasPermission(ORDER_UPDATE);

            return (
              <div className={OrderFormWrapperStyle}>
                <SectionWrapper id="order_orderSection">
                  <SectionHeader
                    icon="ORDER"
                    title={<FormattedMessage id="modules.Orders.order" defaultMessage="ORDER" />}
                  >
                    {!isNew && (
                      <>
                        <LastModified updatedAt={updatedAt} updatedBy={updatedBy} />
                        {!isClone && canCreate && <CloneButton onClick={this.onClone} />}
                        <BooleanValue>
                          {({ value: isDialogOpen, set: dialogToggle }) => (
                            <StatusToggle
                              readOnly={!canUpdate}
                              archived={archived}
                              openStatusDialog={() => dialogToggle(true)}
                              activateDialog={
                                <OrderActivateDialog
                                  order={order}
                                  isOpen={isDialogOpen && !!archived}
                                  onRequestClose={() => dialogToggle(false)}
                                />
                              }
                              archiveDialog={
                                <OrderArchiveDialog
                                  order={order}
                                  isOpen={isDialogOpen && !archived}
                                  onRequestClose={() => dialogToggle(false)}
                                />
                              }
                            />
                          )}
                        </BooleanValue>
                      </>
                    )}
                  </SectionHeader>

                  <OrderSection isNew={isNew} />
                </SectionWrapper>

                <AsyncItemsSection isNew={isNew} orderIsArchived={order.archived} />

                <SectionWrapper id="order_documentsSection">
                  <Subscribe to={[OrderFilesContainer]}>
                    {({ state: values }) => (
                      <SectionHeader
                        icon="DOCUMENT"
                        title={
                          <>
                            <FormattedMessage
                              id="modules.Orders.documents"
                              defaultMessage="DOCUMENTS"
                            />{' '}
                            ({values.files.length})
                          </>
                        }
                      />
                    )}
                  </Subscribe>
                  <AsyncDocumentsSection />
                </SectionWrapper>

                <AsyncTaskSection entityId={order.id} type="order" />

                <SectionWrapper id="order_shipmentsSection">
                  <Subscribe to={[OrderInfoContainer]}>
                    {({ state: { shipments } }) => (
                      <>
                        <SectionHeader
                          icon="SHIPMENT"
                          title={
                            <>
                              <FormattedMessage
                                id="modules.Orders.shipments"
                                defaultMessage="SHIPMENTS"
                              />{' '}
                              ({shipments.length})
                            </>
                          }
                        />
                        <AsyncShipmentsSection shipments={shipments} />
                      </>
                    )}
                  </Subscribe>
                </SectionWrapper>

                <SectionWrapper id="order_containersSection">
                  <Subscribe to={[OrderInfoContainer]}>
                    {({ state: { containers } }) => (
                      <>
                        <SectionHeader
                          icon="CONTAINER"
                          title={
                            <>
                              <FormattedMessage
                                id="modules.Orders.containers"
                                defaultMessage="CONTAINERS"
                              />{' '}
                              ({containers.length})
                            </>
                          }
                        />
                        <AsyncContainersSection containers={containers} />
                      </>
                    )}
                  </Subscribe>
                </SectionWrapper>

                <Subscribe to={[OrderTasksContainer, OrderInfoContainer]}>
                  {(
                    {
                      state: {
                        todo: { tasks },
                      },
                      setFieldValue,
                    },
                    { state }
                  ) => (
                    <AutoDateBinding
                      type="order"
                      values={state}
                      tasks={tasks}
                      setTaskValue={setFieldValue}
                    />
                  )}
                </Subscribe>
              </div>
            );
          }}
        </PermissionConsumer>
      </Suspense>
    );
  }
}
