// @flow
import React, { Suspense, lazy } from 'react';
import { FormattedMessage } from 'react-intl';
import { isEquals } from 'utils/fp';
import { SectionWrapper, SectionHeader, LastModified, FormTooltip } from 'components/Form';
import Icon from 'components/Icon';
import LoadingIcon from 'components/LoadingIcon';

import ItemSection from './components/ItemSection';
import BatchesSection from './components/BatchesSection';
import { FormWrapperStyle, StatusStyle, StatusLabelStyle } from './style';
import DocumentsSection from './components/DocumentsSection';
import ShipmentsSection from './components/ShipmentsSection';

type Props = {
  orderItem: Object,
  onFormReady: () => void,
};

const AsyncTaskSection = lazy(() => import('modules/task/common/TaskSection'));

export default class ItemForm extends React.Component<Props> {
  componentDidMount() {
    const { onFormReady } = this.props;
    if (onFormReady) onFormReady();
  }

  shouldComponentUpdate(nextProps: Props) {
    const { orderItem } = this.props;
    return !isEquals(orderItem, nextProps.orderItem);
  }

  render() {
    const { orderItem } = this.props;
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
                  <div className={StatusStyle(orderItem.order.archived)}>
                    <Icon icon={orderItem.order.archived ? 'ARCHIVED' : 'ACTIVE'} />
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
            <ItemSection />
          </SectionWrapper>

          <BatchesSection />
          <DocumentsSection />
          <AsyncTaskSection type="orderItem" />
          <ShipmentsSection />
        </div>
      </Suspense>
    );
  }
}
