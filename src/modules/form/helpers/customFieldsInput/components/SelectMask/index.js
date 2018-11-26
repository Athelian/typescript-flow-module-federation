// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { ObjectValue } from 'react-values';
import { isEquals, getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import MaskGridView from 'modules/metadata/components/MaskGridView';
import { MaskCard } from 'components/Cards';
import Layout from 'components/Layout';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import { masksQuery } from 'modules/metadata/query';

type OptionalProps = {
  entityType: string,
  selected: {
    id: string,
  },
};

type Props = OptionalProps & {
  onCancel: Function,
  onSave: Function,
};

const defaultProps = {
  selected: {
    id: '',
    name: '',
  },
};

const SelectMask = ({ entityType, selected, onCancel, onSave }: Props) => (
  <Query
    query={masksQuery}
    variables={{
      page: 1,
      perPage: 10,
      filter: { entityTypes: entityType },
    }}
    fetchPolicy="network-only"
  >
    {({ loading, data, fetchMore, error }) => {
      if (error) {
        return error.message;
      }

      const nextPage = getByPathWithDefault(1, 'masks.page', data) + 1;
      const totalPage = getByPathWithDefault(1, 'masks.totalPage', data);
      const hasMore = nextPage <= totalPage;

      return (
        <ObjectValue defaultValue={selected}>
          {({ value, set }) => (
            <Layout
              navBar={
                <SlideViewNavBar>
                  <EntityIcon icon="TEMPLATE" color="TEMPLATE" />
                  <CancelButton onClick={onCancel} />
                  <SaveButton
                    data-testid="saveButtonOnSelectMask"
                    disabled={isEquals(value, selected)}
                    onClick={() => onSave(value)}
                  />
                </SlideViewNavBar>
              }
            >
              <MaskGridView
                entityType={entityType}
                items={getByPathWithDefault([], 'masks.nodes', data)}
                onLoadMore={() => loadMore({ fetchMore, data }, { filterBy: entityType }, 'masks')}
                hasMore={hasMore}
                isLoading={loading}
                renderItem={item => (
                  <MaskCard
                    mask={item}
                    onSelect={() => set(item)}
                    selectable
                    selected={value && item.id === value.id}
                    key={item.id}
                  />
                )}
              />
            </Layout>
          )}
        </ObjectValue>
      );
    }}
  </Query>
);

SelectMask.defaultProps = defaultProps;

export default SelectMask;
