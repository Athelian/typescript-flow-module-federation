// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { encodeId } from 'utils/id';
import GridView from 'components/GridView';
import { ContainerCard } from 'components/Cards';
import messages from 'modules/container/messages';
import PartnerPermissionsWrapper from 'components/PartnerPermissionsWrapper';
import { CONTAINER_FORM } from 'modules/permission/constants/container';

type OptionalProps = {
  renderItem?: (item: Object) => React.Node,
};

type Props = OptionalProps & {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
};

const defaultRenderItem = (item: Object) => (
  <PartnerPermissionsWrapper key={item.id} data={item}>
    {permissions => (
      <ContainerCard
        container={item}
        onClick={() => {
          if (permissions.includes(CONTAINER_FORM)) {
            navigate(`/container/${encodeId(item.id)}`);
          }
        }}
      />
    )}
  </PartnerPermissionsWrapper>
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
  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="195px"
      isEmpty={items.length === 0}
      emptyMessage={<FormattedMessage {...messages.noContainerFound} />}
    >
      {items.map(renderItem)}
    </GridView>
  );
};

ContainerGridView.defaultProps = defaultProps;

export default ContainerGridView;
