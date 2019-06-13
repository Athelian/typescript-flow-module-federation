// @flow
import React, { Suspense, lazy } from 'react';
import { Subscribe } from 'unstated';
import { FormattedMessage } from 'react-intl';
import { getByPath, isEquals } from 'utils/fp';
import AutoDateBinding from 'modules/task/common/AutoDateBinding';
import { SectionWrapper, SectionHeader, LastModified, FormTooltip } from 'components/Form';
import { OrderItemInfoContainer, OrderItemTasksContainer } from 'modules/orderItem/form/containers';
import Icon from 'components/Icon';
import LoadingIcon from 'components/LoadingIcon';
import ItemSection from './components/ItemSection';
import { FormWrapperStyle, StatusStyle, StatusLabelStyle } from './style';

type OptionalProps = {
  onFormReady: () => void,
  isSlideView: boolean,
};

type Props = OptionalProps & {
  orderItem: Object,
};

const defaultProps = {
  onFormReady: () => {},
  isSlideView: false,
};

const AsyncTaskSection = lazy(() => import('modules/task/common/TaskSection'));
const AsyncBatchesSection = lazy(() => import('./components/BatchesSection'));
const AsyncShipmentsSection = lazy(() => import('./components/ShipmentsSection'));
const AsyncDocumentsSection = lazy(() => import('./components/DocumentsSection'));

export default class ItemForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onFormReady } = this.props;
    if (onFormReady) onFormReady();
  }

  shouldComponentUpdate(nextProps: Props) {
    const { orderItem, isSlideView } = this.props;
    return (
      !isEquals(orderItem, nextProps.orderItem) || !isEquals(isSlideView, nextProps.isSlideView)
    );
  }

  render() {
    const { orderItem, isSlideView } = this.props;
    return (
      <Suspense fallback={<LoadingIcon />}>
        <div className={FormWrapperStyle}>
          <SectionWrapper id="orderItem_itemSection">
            <SectionHeader
              icon="ORDER_ITEM"
              title={<FormattedMessage id="modules.OrderItems.orderItem" defaultMessage="ITEM" />}
            >
              {orderItem.updatedAt && (
                <>
                  <LastModified updatedAt={orderItem.updatedAt} updatedBy={orderItem.updatedBy} />
                  <div className={StatusStyle(orderItem.archived)}>
                    <Icon icon={orderItem.archived ? 'ARCHIVED' : 'ACTIVE'} />
                    <div className={StatusLabelStyle}>
                      {orderItem.order.archived ? (
                        <FormattedMessage
                          id="modules.OrderItems.archived"
                          defaultMessage="Archived"
                        />
                      ) : (
                        <FormattedMessage id="modules.OrderItems.active" defaultMessage="Active" />
                      )}
                    </div>
                    <FormTooltip
                      infoMessage={
                        <FormattedMessage
                          id="modules.OrderItems.order.archived.tooltip.infoMessage"
                          defaultMessage="The status is the same as the Order's status"
                        />
                      }
                      position="bottom"
                    />
                  </div>
                </>
              )}
            </SectionHeader>
            <ItemSection isSlideView={isSlideView} />
          </SectionWrapper>

          <Subscribe to={[OrderItemInfoContainer]}>
            {({ state: itemInfo }) => (
              <AsyncBatchesSection
                itemInfo={itemInfo}
                itemIsArchived={orderItem.archived}
                isSlideView={isSlideView}
              />
            )}
          </Subscribe>

          <AsyncDocumentsSection />

          <AsyncTaskSection
            groupIds={[
              getByPath('order.importer.id', orderItem),
              getByPath('order.exporter.id', orderItem),
            ].filter(Boolean)}
            entityId={orderItem.id}
            type="OrderItem"
          />

          <AsyncShipmentsSection />

          <Subscribe to={[OrderItemTasksContainer]}>
            {({
              state: {
                todo: { tasks },
              },
              setFieldValue,
            }) => (
              <AutoDateBinding
                type="OrderItem"
                values={orderItem.order || {}}
                tasks={tasks}
                setTaskValue={setFieldValue}
              />
            )}
          </Subscribe>
        </div>
      </Suspense>
    );
  }
}
