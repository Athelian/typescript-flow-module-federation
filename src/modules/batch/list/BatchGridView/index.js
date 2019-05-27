// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { BATCH_CREATE } from 'modules/permission/constants/batch';
import usePermission from 'hooks/usePermission';
import GridView from 'components/GridView';
import { encodeId } from 'utils/id';
import { BatchCard, CardAction } from 'components/Cards';

type OptionalProps = {
  renderItem?: Function,
};

type Props = OptionalProps & {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
};

const defaultRenderItem = (item: Object, allowCreate: boolean) => (
  <BatchCard
    key={item.id}
    actions={[
      ...(allowCreate
        ? [
            <CardAction
              icon="CLONE"
              onClick={() => navigate(`/batch/clone/${encodeId(item.id)}`)}
            />,
          ]
        : []),
    ]}
    batch={item}
    showActionsOnHover
  />
);

const defaultProps = {
  renderItem: defaultRenderItem,
};

const BatchGridView = (props: Props) => {
  const { items, onLoadMore, hasMore, isLoading, renderItem = defaultRenderItem, ...rest } = props;

  const { hasPermission } = usePermission();
  const allowCreate = hasPermission(BATCH_CREATE);

  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="195px"
      isEmpty={items.length === 0}
      emptyMessage={
        <FormattedMessage id="modules.Batches.noBatchesFound" defaultMessage="No batches found" />
      }
      {...rest}
    >
      {items.map(item => renderItem(item, allowCreate))}
    </GridView>
  );
};

BatchGridView.defaultProps = defaultProps;

export default BatchGridView;
