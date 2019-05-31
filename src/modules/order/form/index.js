// @flow

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { navigate } from '@reach/router';
import { BooleanValue } from 'react-values';
import { CloneButton } from 'components/Buttons';
import MainSectionPlaceholder from 'components/PlaceHolder/MainSectionPlaceHolder';
import { ORDER_CREATE, ORDER_UPDATE } from 'modules/permission/constants/order';
import { isEquals } from 'utils/fp';
import { encodeId } from 'utils/id';
import { SectionHeader, SectionWrapper, LastModified, StatusToggle } from 'components/Form';
import { OrderActivateDialog, OrderArchiveDialog } from 'modules/order/common/Dialog';
import AutoDateBinding from 'modules/task/common/AutoDateBinding';
import { PermissionConsumer } from 'modules/permission';
import OrderSection from './components/OrderSection';
import ItemsSection from './components/ItemsSection';
import DocumentsSection from './components/DocumentsSection';
import ShipmentsSection from './components/ShipmentsSection';
import ContainersSection from './components/ContainersSection';
import OrderTasksSection from './components/OrderTasksSection';
import { OrderInfoContainer, OrderTasksContainer } from './containers';
import { OrderFormWrapperStyle } from './style';

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
      <PermissionConsumer>
        {hasPermission => {
          const canCreate = hasPermission(ORDER_CREATE);
          const canUpdate = hasPermission(ORDER_UPDATE);

          return (
            <div className={OrderFormWrapperStyle}>
              <SectionWrapper id="order_orderSection">
                <MainSectionPlaceholder height={866} isLoading={loading}>
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

                  <OrderSection isNew={isNew} isClone={isClone} />
                </MainSectionPlaceholder>
              </SectionWrapper>

              <SectionWrapper id="order_itemsSection">
                <ItemsSection
                  isNew={isNew}
                  entityId={!isClone && order.id ? order.id : ''}
                  isLoading={loading}
                  orderIsArchived={order.archived}
                />
              </SectionWrapper>

              <SectionWrapper id="order_documentsSection">
                <DocumentsSection
                  entityId={!isClone && order.id ? order.id : ''}
                  isLoading={loading}
                />
              </SectionWrapper>

              <SectionWrapper id="order_taskSection">
                <Subscribe to={[OrderTasksContainer]}>
                  {({ initDetailValues }) => (
                    <OrderTasksSection
                      initValues={initDetailValues}
                      isLoading={loading}
                      entityId={!isClone && order.id ? order.id : ''}
                    />
                  )}
                </Subscribe>
              </SectionWrapper>

              {!isNew && (
                <SectionWrapper id="order_shipmentsSection">
                  <ShipmentsSection entityId={order.id} isLoading={loading} />
                </SectionWrapper>
              )}

              {!isNew && (
                <SectionWrapper id="order_containersSection">
                  <ContainersSection entityId={order.id} isLoading={loading} />
                </SectionWrapper>
              )}

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
    );
  }
}
