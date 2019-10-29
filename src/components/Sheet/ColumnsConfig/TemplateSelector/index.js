// @flow
import * as React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { FormattedMessage } from 'react-intl';
import GridView from 'components/GridView';
import SlideView from 'components/SlideView';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import {
  EntityIcon,
  Filter,
  Search,
  Sort,
  MaskEditFilterConfig,
  MaskEditSortConfig,
} from 'components/NavBar';
import { CancelButton, SaveButton } from 'components/Buttons';
import { TemplateCard } from 'components/Cards';
import useFilterSort from 'hooks/useFilterSort';
import loadMore from 'utils/loadMore';
import { tableTemplateQuery } from './query';

type RenderProps = {
  onClick: () => void,
};

type Props = {
  onChange: (?Object) => void,
  children: RenderProps => React.Node,
  templateType: string,
};

type ListProps = {
  variables: Object,
  selected: ?Object,
  setSelected: (?Object) => void,
};

const TemplateList = ({ variables, selected, setSelected }: ListProps) => {
  const { data, loading, fetchMore } = useQuery(tableTemplateQuery, { variables });

  const templates = data?.maskEdits?.nodes ?? [];
  const hasMore = (data?.maskEdits?.page ?? 1) < (data?.maskEdits?.totalPage ?? 1);

  return (
    <GridView
      onLoadMore={() => loadMore({ fetchMore, data }, {}, 'maskEdits')}
      hasMore={hasMore}
      isLoading={loading}
      itemWidth="195px"
      isEmpty={templates.length === 0}
      emptyMessage={
        <FormattedMessage id="modules.TableTemplates.noItem" defaultMessage="No template found" />
      }
    >
      {templates.map(template => (
        <TemplateCard
          onSelect={() => setSelected(template)}
          key={template.id}
          template={{
            id: template.id,
            title: template.name,
            description: template.memo,
            count: (template.fields || []).length,
          }}
          type="EDIT_TABLE"
          selectable
          selected={selected && selected.id === template.id}
        />
      ))}
    </GridView>
  );
};

const TemplateSelector = ({ onChange, children, templateType }: Props) => {
  const [selected, setSelected] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '', type: templateType },
    { createdAt: 'DESCENDING' }
  );

  const handleSave = () => {
    onChange(selected);
    setOpen(false);
    setSelected(null);
  };
  const handleCancel = () => {
    setOpen(false);
    setSelected(null);
  };

  return (
    <>
      {children({ onClick: () => setOpen(true) })}

      <SlideView isOpen={open} onRequestClose={() => setOpen(false)}>
        <SlideViewLayout>
          <SlideViewNavBar>
            <EntityIcon icon="TEMPLATE" color="TEMPLATE" invert />

            <Filter
              config={MaskEditFilterConfig}
              filterBy={filterBy}
              onChange={setFilterBy}
              staticFilters={['type']}
            />
            <Search query={query} onChange={setQuery} />
            <Sort config={MaskEditSortConfig} sortBy={sortBy} onChange={setSortBy} />

            <CancelButton onClick={handleCancel} />
            <SaveButton disabled={!selected} onClick={handleSave} />
          </SlideViewNavBar>

          <Content>
            <TemplateList
              variables={{ filterBy: { ...filterBy, query }, sortBy, page: 1, perPage: 20 }}
              selected={selected}
              setSelected={setSelected}
            />
          </Content>
        </SlideViewLayout>
      </SlideView>
    </>
  );
};

export default TemplateSelector;
