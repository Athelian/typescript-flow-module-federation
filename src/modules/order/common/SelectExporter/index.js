// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Query } from 'react-apollo';
import { partnersQuery } from 'graphql/partner/query';
import { ObjectValue } from 'react-values';
import { isNullOrUndefined, getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import { cleanUpData } from 'utils/data';
import useFilter from 'hooks/useFilter';
import { Content, SlideViewLayout } from 'components/Layout';
import ConfirmDialog from 'components/Dialog/ConfirmDialog';
import FilterToolBar from 'components/common/FilterToolBar';
import { SlideViewNavBar } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import { PartnerCard } from 'components/Cards';
import PartnerGridView from 'modules/partner/list/PartnerGridView';
import messages from 'modules/partner/messages';

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
  intl: IntlShape,
};

const defaultProps = {
  cacheKey: 'SelectExporter',
  isRequired: false,
};

const isEquals = (value: ?Object, selected: ?Object): boolean => {
  const { id: newId } = value || {};
  const { id: oldId } = selected || {};
  return newId === oldId;
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

const getInitFilter = {
  filter: {
    types: ['Exporter'],
  },
  sort: {
    field: 'updatedAt',
    direction: 'DESCENDING',
  },
  page: 1,
  perPage: 10,
};

const partnerPath = 'viewer.user.group.partners';

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
  intl,
}: Props) => {
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
  const { filterAndSort, queryVariables, onChangeFilter } = useFilter(getInitFilter, cacheKey);
  const sortFields = [
    { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
    { title: intl.formatMessage(messages.name), value: 'name' },
    { title: intl.formatMessage(messages.code), value: 'code' },
  ];
  return (
    <Query fetchPolicy="network-only" query={partnersQuery} variables={queryVariables}>
      {({ loading, data, fetchMore, error }) => {
        if (error) {
          return error.message;
        }
        const items = getByPathWithDefault([], `${partnerPath}.nodes`, data).map(item => ({
          ...item.group,
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
                  <FilterToolBar
                    icon="PARTNER"
                    sortFields={sortFields}
                    filtersAndSort={filterAndSort}
                    onChange={onChangeFilter}
                    canSearch
                  />
                  <CancelButton onClick={onCancel} />
                  <SaveButton
                    data-testid="btnSaveExporter"
                    disabled={isEquals(value, selected)}
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
                    onLoadMore={() => loadMore({ fetchMore, data }, filterAndSort, partnerPath)}
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

export default injectIntl(SelectExporter);
