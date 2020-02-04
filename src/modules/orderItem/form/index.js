// @flow
import React, { Suspense, lazy } from 'react';
import { Subscribe } from 'unstated';
import { getByPath, isEquals } from 'utils/fp';
import AutoDateBinding from 'modules/task/common/AutoDateBinding';
import { SectionWrapper } from 'components/Form';
import { OrderItemInfoContainer, OrderItemTasksContainer } from 'modules/orderItem/form/containers';
import LoadingIcon from 'components/LoadingIcon';
import ItemSection from './components/ItemSection';
import { FormWrapperStyle } from './style';

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
            <ItemSection isSlideView={isSlideView} orderItem={orderItem} />
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

          <AsyncDocumentsSection entityOwnedBy={orderItem.ownedBy} />

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
