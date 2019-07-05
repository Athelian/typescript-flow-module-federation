// @flow
import * as React from 'react';
import { ApolloConsumer } from 'react-apollo';
import emitter from 'utils/emitter';
import { BooleanValue } from 'react-values';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import { isNotFound } from 'utils/data';
import RemoveDialog from 'components/Dialog/RemoveDialog';
import PartnerPermissionsWrapper from 'components/PartnerPermissionsWrapper';
import { TAG_CREATE, TAG_DELETE } from 'modules/permission/constants/tag';
import { encodeId } from 'utils/id';
import GridView from 'components/GridView';
import { TagCard, CardAction } from 'components/Cards';
import { deleteTagMutation } from './mutation';

type OptionalProps = {
  renderItem: Function,
};

type Props = OptionalProps & {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
};

function onClone(tagId: string) {
  navigate(`/tags/clone/${encodeId(tagId)}`);
}

const defaultRenderItem = (item: Object) => (
  <PartnerPermissionsWrapper key={item.id} data={item}>
    {permissions => {
      const canCreate = permissions.includes(TAG_CREATE);
      const canDelete = permissions.includes(TAG_DELETE);
      return (
        <ApolloConsumer>
          {client => (
            <BooleanValue>
              {({ value: isOpen, set: toggleDialog }) => (
                <>
                  <RemoveDialog
                    isOpen={isOpen}
                    onRequestClose={() => toggleDialog(false)}
                    onCancel={() => toggleDialog(false)}
                    onRemove={async () => {
                      await client.mutate({
                        mutation: deleteTagMutation,
                        variables: {
                          id: item.id,
                        },
                      });
                      toggleDialog(false);
                      emitter.emit('DELETE_TAG');
                    }}
                    message={
                      <>
                        <FormattedMessage
                          id="modules.tags.deleteTagWarning"
                          defaultMessage="Are you sure you want to delete this tag?"
                        />
                        <FormattedMessage
                          id="modules.tags.deleteTagMessage"
                          defaultMessage="Doing this will remove it from all data that is using it."
                        />
                      </>
                    }
                  />
                  <TagCard
                    tag={item}
                    actions={[
                      canCreate && (
                        <CardAction
                          icon="CLONE"
                          hoverColor="BLUE"
                          onClick={() => onClone(item.id)}
                        />
                      ),
                      canDelete && (
                        <CardAction
                          icon="REMOVE"
                          hoverColor="RED"
                          onClick={() => toggleDialog(true)}
                        />
                      ),
                    ].filter(Boolean)}
                    showActionsOnHover
                  />
                </>
              )}
            </BooleanValue>
          )}
        </ApolloConsumer>
      );
    }}
  </PartnerPermissionsWrapper>
);

const defaultProps = {
  renderItem: defaultRenderItem,
};

const TagGridView = ({ items, onLoadMore, hasMore, isLoading, renderItem }: Props) => {
  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="195px"
      isEmpty={items.length === 0}
      emptyMessage={<FormattedMessage id="modules.Tags.noItem" defaultMessage="No tags found" />}
    >
      {items.filter(item => !isNotFound(item)).map(renderItem)}
    </GridView>
  );
};

TagGridView.defaultProps = defaultProps;

export default TagGridView;
