// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { encodeId } from 'utils/id';
import GridView from 'components/GridView';
import { BatchCard } from 'components/Cards';
import PartnerPermissionsWrapper from 'components/PartnerPermissionsWrapper';
import { BATCH_FORM } from 'modules/permission/constants/batch';

type OptionalProps = {
  renderItem: Function,
};

type Props = OptionalProps & {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
};

const defaultRenderItem = (item: Object) => (
  <PartnerPermissionsWrapper data={item} key={item.id}>
    {permissions => (
      <BatchCard
        batch={item}
        onClick={() => {
          if (permissions.includes(BATCH_FORM)) {
            navigate(`/batch/${encodeId(item.id)}`);
          }
        }}
      />
    )}
  </PartnerPermissionsWrapper>
);

const defaultProps = {
  renderItem: defaultRenderItem,
};

const BatchGridView = (props: Props) => {
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
      {items.map(renderItem)}
    </GridView>
  );
};

BatchGridView.defaultProps = defaultProps;

export default BatchGridView;
