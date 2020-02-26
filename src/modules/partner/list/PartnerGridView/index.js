// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import GridView from 'components/GridView';
import { PartnerCard } from 'components/Cards';
import { encodeId } from 'utils/id';
import usePermission from 'hooks/usePermission';
import { PARTNER_FORM } from 'modules/permission/constants/partner';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: (item: Object) => React.Node,
};

const defaultRenderItem = ({ item, allowViewForm }: { item: Object, allowViewForm: boolean }) => {
  return (
    <PartnerCard
      key={item.id}
      partner={item}
      onClick={allowViewForm ? () => navigate(`/partner/${encodeId(item.id)}`) : null}
    />
  );
};

const defaultProps = {
  renderItem: defaultRenderItem,
};

const PartnerGridView = (props: Props) => {
  const { items, onLoadMore, hasMore, isLoading, renderItem = defaultRenderItem } = props;
  const { hasPermission } = usePermission();
  const allowViewForm = hasPermission(PARTNER_FORM);

  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="195px"
      isEmpty={items.length === 0}
      emptyMessage={
        <FormattedMessage
          id="modules.Partners.noPartnersFound"
          defaultMessage="No partners found"
        />
      }
    >
      {items.map(item => renderItem({ item, allowViewForm }))}
    </GridView>
  );
};

PartnerGridView.defaultProps = defaultProps;

export default PartnerGridView;
