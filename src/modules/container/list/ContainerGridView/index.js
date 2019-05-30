// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { encodeId } from 'utils/id';
import GridView from 'components/GridView';
import usePermission from 'hooks/usePermission';
import usePartnerPermission from 'hooks/usePartnerPermission';
import { ContainerCard } from 'components/Cards';
import messages from 'modules/container/messages';
import { WAREHOUSE_FORM } from 'modules/permission/constants/warehouse';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: Function,
};

const defaultRenderItem = (item: Object, permission: Object) => (
  <ContainerCard
    key={item.id}
    container={item}
    permission={permission}
    onClick={() => navigate(`/container/${encodeId(item.id)}`)}
  />
);

const defaultProps = {
  renderItem: defaultRenderItem,
};

const ContainerGridView = ({
  items,
  onLoadMore,
  hasMore,
  isLoading,
  renderItem = defaultRenderItem,
}: Props) => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

  const viewWarehouse = hasPermission(WAREHOUSE_FORM);

  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="195px"
      isEmpty={items.length === 0}
      emptyMessage={<FormattedMessage {...messages.noContainerFound} />}
    >
      {items.map(item => renderItem(item, { viewWarehouse }))}
    </GridView>
  );
};

ContainerGridView.defaultProps = defaultProps;

export default ContainerGridView;
