// @flow
import * as React from 'react';
import { partnersQuery } from 'graphql/partner/query';
import { cleanUpData } from 'utils/data';
import useFilterSort from 'hooks/useFilterSort';
import useQueryList from 'hooks/useQueryList';
import Selector from 'components/Selector';
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

type Props = {|
  partnerTypes: Array<string>,
  selected?: ?{
    id: string,
    name: string,
  },
  onSelect: (item: Object) => void,
  onCancel: Function,
  confirmationDialogMessage?: ?string | React.Node,
  deselectDialogMessage?: ?string | React.Node,
  isRequired?: boolean,
|};

const SelectPartner = ({
  partnerTypes,
  selected,
  onCancel,
  onSelect,
  confirmationDialogMessage,
  deselectDialogMessage,
  isRequired,
}: Props) => {
  const [confirmationDialogIsOpen, setConfirmationDialogIsOpen] = React.useState(false);
  const [deselectDialogIsOpen, setDeselectDialogIsOpen] = React.useState(false);

  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '', types: partnerTypes },
    { updatedAt: 'DESCENDING' }
  );

  const { nodes, loading, hasMore, loadMore } = useQueryList(
    partnersQuery,
    {
      variables: { filterBy: { query, ...filterBy }, sortBy, page: 1, perPage: 10 },
      fetchPolicy: 'network-only',
    },
    'viewer.user.organization.partners'
  );

  const partners = React.useMemo(
    () =>
      nodes.map(item => ({
        ...item,
        ...item.organization,
      })),
    [nodes]
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
              disabled={!dirty}
              onClick={() => {
                if (!value) {
                  if (!!deselectDialogMessage && dirty) {
                    setDeselectDialogIsOpen(true);
                  } else {
                    onSelect(value);
                  }
                } else if (!!confirmationDialogMessage && dirty) {
                  setConfirmationDialogIsOpen(true);
                } else {
                  onSelect(value);
                }
              }}
            />

            {!!confirmationDialogMessage && (
              <ConfirmDialog
                isOpen={confirmationDialogIsOpen}
                onRequestClose={() => setConfirmationDialogIsOpen(false)}
                onCancel={() => setConfirmationDialogIsOpen(false)}
                onConfirm={() => {
                  onSelect(value);
                  setConfirmationDialogIsOpen(false);
                }}
                message={confirmationDialogMessage}
              />
            )}

            {!!deselectDialogMessage && (
              <ConfirmDialog
                isOpen={deselectDialogIsOpen}
                onRequestClose={() => setDeselectDialogIsOpen(false)}
                onCancel={() => setDeselectDialogIsOpen(false)}
                onConfirm={() => {
                  onSelect(value);
                  setDeselectDialogIsOpen(false);
                }}
                message={deselectDialogMessage}
              />
            )}
          </SlideViewNavBar>

          <Content>
            <PartnerGridView
              hasMore={hasMore}
              isLoading={loading}
              onLoadMore={loadMore}
              items={partners}
              renderItem={item => (
                <PartnerCard key={item.id} partner={item} {...getItemProps(cleanUpData(item))} />
              )}
            />
          </Content>
        </SlideViewLayout>
      )}
    </Selector.Single>
  );
};

export default SelectPartner;
