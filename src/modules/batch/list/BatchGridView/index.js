// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { encodeId } from 'utils/id';
import type { UserPayload } from 'generated/graphql';
import useUser from 'hooks/useUser';
import GridView from 'components/GridView';
import { BatchCard } from 'components/Cards';
import PartnerPermissionsWrapper from 'components/PartnerPermissionsWrapper';
import { BATCH_FORM } from 'modules/permission/constants/batch';

type Props = {|
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem: Function,
|};

const defaultRenderItem = (item: Object, user: UserPayload) => (
  <PartnerPermissionsWrapper data={item} key={item.id}>
    {permissions => (
      <BatchCard
        batch={item}
        onClick={() => {
          if (permissions.includes(BATCH_FORM)) {
            navigate(`/batch/${encodeId(item.id)}`);
          }
        }}
        user={user}
      />
    )}
  </PartnerPermissionsWrapper>
);

const defaultProps = {
  renderItem: defaultRenderItem,
};

const BatchGridView = (props: Props) => {
  const { user } = useUser();
  const { items, onLoadMore, hasMore, isLoading, renderItem, ...rest } = props;

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
      {items.map(item => renderItem(item, user))}
    </GridView>
  );
};

BatchGridView.defaultProps = defaultProps;

export default BatchGridView;
