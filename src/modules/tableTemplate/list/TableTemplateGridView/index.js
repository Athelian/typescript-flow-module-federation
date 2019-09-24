// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import SlideView from 'components/SlideView';
import GridView from 'components/GridView';
import { TemplateCard } from 'components/Cards';
import TemplateFormWrapper from 'modules/tableTemplate/common/TemplateFormWrapper';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: (item: Object) => React.Node,
};

const defaultRenderItem = (item: Object) => (
  <BooleanValue key={item.id}>
    {({ value: isOpen, set: toggle }) => (
      <>
        <TemplateCard
          onClick={() => toggle(true)}
          key={item.id}
          template={{
            id: item.id,
            title: item.name,
            description: item.memo,
            count: (item.fields || []).length,
          }}
          type="EDIT_TABLE"
          actions={[]}
          showActionsOnHover
        />
        <SlideView
          isOpen={isOpen}
          onRequestClose={() => toggle(false)}
          shouldConfirm={() => {
            const button = document.getElementById('table_template_form_save_button');
            return button;
          }}
        >
          {isOpen && <TemplateFormWrapper template={item} onCancel={() => toggle(false)} />}
        </SlideView>
      </>
    )}
  </BooleanValue>
);

const defaultProps = {
  renderItem: defaultRenderItem,
};

const TableTemplateGridView = (props: Props) => {
  const { items, onLoadMore, hasMore, isLoading, renderItem = defaultRenderItem } = props;

  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="195px"
      isEmpty={items.length === 0}
      emptyMessage={
        <FormattedMessage id="modules.TableTemplates.noItem" defaultMessage="No template found" />
      }
    >
      {items.map(item => renderItem(item))}
    </GridView>
  );
};

TableTemplateGridView.defaultProps = defaultProps;

export default TableTemplateGridView;
