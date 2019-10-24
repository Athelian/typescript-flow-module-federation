// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { partnersQuery } from 'graphql/partner/query';
import { ObjectValue } from 'react-values';
import { isNullOrUndefined, getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import { cleanUpData } from 'utils/data';
import useFilterSort from 'hooks/useFilterSort';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import ConfirmDialog from 'components/Dialog/ConfirmDialog';
import { SaveButton, CancelButton } from 'components/Buttons';
import {
  EntityIcon,
  Filter,
  PartnerFilterConfig,
  PartnerSortConfig,
  Search,
  Sort,
} from 'components/NavBar';
import { PartnerCard } from 'components/Cards';
import PartnerGridView from 'modules/partner/list/PartnerGridView';

type OptionalProps = {
  cacheKey: string,
  isRequired: boolean,
  selected: {
    id: string,
    name: string,
  },
  selectMessage?: React.Node,
  changeMessage?: React.Node,
  deselectMessage?: React.Node,
};

type Props = OptionalProps & {
  warningMessage: React.Node,
  onSelect: (item: Object) => void,
  onCancel: Function,
};

const defaultProps = {
  cacheKey: 'SelectExporter',
  isRequired: false,
};

const chooseMessage = ({
  selected,
  value,
  selectMessage,
  changeMessage,
  deselectMessage,
  warningMessage,
}: {
  selected: Object,
  value: Object,
  selectMessage?: React.Node,
  changeMessage?: React.Node,
  deselectMessage?: React.Node,
  warningMessage: React.Node,
}) => {
  if (selected) {
    if (value) {
      return changeMessage || warningMessage;
    }
    return deselectMessage || warningMessage;
  }
  return selectMessage || warningMessage;
};

const partnerPath = 'viewer.user.organization.partners';

const SelectExporter = ({
  cacheKey,
  isRequired,
  selected,
  onCancel,
  onSelect,
  selectMessage,
  changeMessage,
  deselectMessage,
  warningMessage,
}: Props) => {
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '', types: ['Exporter'] },
    { updatedAt: 'DESCENDING' },
    cacheKey
  );

  const queryVariables = { filterBy: { query, ...filterBy }, sortBy, page: 1, perPage: 10 };

  return (
    <Query fetchPolicy="network-only" query={partnersQuery} variables={queryVariables}>
      {({ loading, data, fetchMore, error }) => {
        if (error) {
          return error.message;
        }
        const items = getByPathWithDefault([], `${partnerPath}.nodes`, data).map(item => ({
          ...item.organization,
          code: item.code,
        }));
        const nextPage = getByPathWithDefault(1, `${partnerPath}.page`, data) + 1;
        const totalPage = getByPathWithDefault(1, `${partnerPath}.totalPage`, data);
        const hasMore = nextPage <= totalPage;
        return (
          <ObjectValue defaultValue={selected}>
            {({ value, set }) => (
              <SlideViewLayout>
                <SlideViewNavBar>
                  <EntityIcon icon="PARTNER" color="PARTNER" />

                  <Filter
                    config={PartnerFilterConfig}
                    filterBy={filterBy}
                    onChange={setFilterBy}
                    staticFilters={['types']}
                  />
                  <Search query={query} onChange={setQuery} />
                  <Sort config={PartnerSortConfig} sortBy={sortBy} onChange={setSortBy} />
                  <CancelButton onClick={onCancel} />
                  <SaveButton
                    data-testid="btnSaveExporter"
                    disabled={value?.id === selected?.id}
                    onClick={() => {
                      if (isRequired) {
                        if (!isNullOrUndefined(selected)) {
                          setOpenConfirmDialog(true);
                        } else {
                          onSelect(value);
                        }
                      } else {
                        setOpenConfirmDialog(true);
                      }
                    }}
                  />
                  <ConfirmDialog
                    isOpen={openConfirmDialog}
                    onRequestClose={() => setOpenConfirmDialog(false)}
                    onCancel={() => setOpenConfirmDialog(false)}
                    onConfirm={() => {
                      onSelect(value);
                      setOpenConfirmDialog(false);
                    }}
                    message={chooseMessage({
                      selected,
                      value,
                      selectMessage,
                      changeMessage,
                      deselectMessage,
                      warningMessage,
                    })}
                  />
                </SlideViewNavBar>

                <Content>
                  <PartnerGridView
                    hasMore={hasMore}
                    isLoading={loading}
                    onLoadMore={() => loadMore({ fetchMore, data }, queryVariables, partnerPath)}
                    items={items}
                    renderItem={item => (
                      <PartnerCard
                        key={item.id}
                        data-testid="partnerCard"
                        partner={item}
                        onSelect={() => {
                          if (!isRequired && (value && value.id === item.id)) {
                            set(null);
                          } else {
                            set(cleanUpData(item));
                          }
                        }}
                        selectable
                        selected={value && value.id === item.id}
                      />
                    )}
                  />
                </Content>
              </SlideViewLayout>
            )}
          </ObjectValue>
        );
      }}
    </Query>
  );
};

SelectExporter.defaultProps = defaultProps;

export default SelectExporter;
