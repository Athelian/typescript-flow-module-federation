// @flow

import React, {
  // $FlowFixMe not has type yet
  unstable_ConcurrentMode as ConcurrentMode,
} from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { navigate } from '@reach/router';
import { BooleanValue } from 'react-values';
import { CloneButton } from 'components/Buttons';
import MainSectionPlaceholder from 'components/PlaceHolder/MainSectionPlaceHolder';
import ListCardPlaceHolder from 'components/PlaceHolder/ListCardPlaceHolder';
import DocumentPlaceHolder from 'components/PlaceHolder/DocumentPlaceHolder';
import RelatedPlaceHolder from 'components/PlaceHolder/RelatedPlaceHolder';
import { ORDER_CREATE, ORDER_UPDATE } from 'modules/permission/constants/order';
import { isEquals } from 'utils/fp';
import { encodeId } from 'utils/id';
import { SectionHeader, SectionWrapper, LastModified, StatusToggle } from 'components/Form';
import { OrderActivateDialog, OrderArchiveDialog } from 'modules/order/common/Dialog';
import AutoDateBinding from 'modules/task/common/AutoDateBinding';
import { PermissionConsumer } from 'modules/permission';
import TaskSection from 'modules/task/common/TaskSection';
import OrderSection from './components/OrderSection';
import ItemsSection from './components/ItemsSection';
import DocumentsSection from './components/DocumentsSection';
import ShipmentsSection from './components/ShipmentsSection';
import ContainersSection from './components/ContainersSection';
import { OrderFormWrapperStyle } from './style';
import { OrderInfoContainer, OrderFilesContainer, OrderTasksContainer } from './containers';

type OptionalProps = {
  isNew: boolean,
  loading: boolean,
  isClone: boolean,
  order: Object,
};

type Props = OptionalProps & {};

const defaultProps = {
  isNew: false,
  isClone: false,
  loading: false,
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
    const { isNew, isClone, order, loading } = this.props;
    const { updatedAt, updatedBy, archived } = order;
    return (
      <ConcurrentMode>
        <PermissionConsumer>
          {hasPermission => {
            const canCreate = hasPermission(ORDER_CREATE);
            const canUpdate = hasPermission(ORDER_UPDATE);

            return (
              <div className={OrderFormWrapperStyle}>
                <MainSectionPlaceholder id="order_orderSection" isLoading={loading}>
                  <SectionWrapper>
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
                </MainSectionPlaceholder>

                <ListCardPlaceHolder id="order_itemsSection" isLoading={loading}>
                  <ItemsSection isNew={isNew} orderIsArchived={order.archived} />
                </ListCardPlaceHolder>

                <DocumentPlaceHolder id="order_documentsSection" isLoading={loading}>
                  <SectionWrapper>
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
                    <DocumentsSection />
                  </SectionWrapper>
                </DocumentPlaceHolder>

                <ListCardPlaceHolder id="order_taskSection" isLoading={loading}>
                  <TaskSection entityId={order.id} type="order" />
                </ListCardPlaceHolder>

                <RelatedPlaceHolder id="order_shipmentsSection" isLoading={loading}>
                  <SectionWrapper>
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
                          <ShipmentsSection shipments={shipments} />
                        </>
                      )}
                    </Subscribe>
                  </SectionWrapper>
                </RelatedPlaceHolder>

                <RelatedPlaceHolder id="order_containersSection" isLoading={loading}>
                  <SectionWrapper>
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
                          <ContainersSection containers={containers} />
                        </>
                      )}
                    </Subscribe>
                  </SectionWrapper>
                </RelatedPlaceHolder>

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
      </ConcurrentMode>
    );
  }
}
