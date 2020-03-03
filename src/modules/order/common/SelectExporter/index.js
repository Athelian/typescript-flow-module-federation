// @flow
import * as React from 'react';
import { partnersQuery } from 'graphql/partner/query';
import { isNullOrUndefined } from 'utils/fp';
import { cleanUpData } from 'utils/data';
import useFilterSort from 'hooks/useFilterSort';
import useQueryList from 'hooks/useQueryList';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import ConfirmDialog from 'components/Dialog/ConfirmDialog';
import { SaveButton, CancelButton } from 'components/Buttons';
import Selector from 'components/Selector';
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

  const { nodes, loading, hasMore, loadMore } = useQueryList(
    partnersQuery,
    {
      variables: { filterBy: { query, ...filterBy }, sortBy, page: 1, perPage: 10 },
      fetchPolicy: 'network-only',
    },
    'viewer.user.organization.partners'
  );

  return (
    <Selector.Single selected={selected} required={isRequired}>
      {({ value, dirty, getItemProps }) => (
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
              disabled={!dirty}
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
              onLoadMore={loadMore}
              items={nodes}
              renderItem={item => (
                <PartnerCard
                  key={item.id}
                  data-testid="partnerCard"
                  {...getItemProps(cleanUpData(item))}
                  partner={item}
                />
              )}
            />
          </Content>
        </SlideViewLayout>
      )}
    </Selector.Single>
  );
};

SelectExporter.defaultProps = defaultProps;

export default SelectExporter;
