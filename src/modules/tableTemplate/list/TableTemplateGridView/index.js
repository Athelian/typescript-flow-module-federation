// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import SlideView from 'components/SlideView';
import GridView from 'components/GridView';
import { TableTemplateCard } from 'components/Cards';
import TableTemplateForm from 'modules/tableTemplate/form';
import TemplateFormContainer from 'modules/tableTemplate/form/container';

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
        <TableTemplateCard
          onClick={() => toggle(true)}
          key={item.id}
          template={item}
          actions={[]}
          showActionsOnHover
        />
        <SlideView
          isOpen={isOpen}
          onRequestClose={() => toggle(false)}
          options={{ width: '1030px' }}
        >
          <Subscribe to={[TemplateFormContainer]}>
            {({ initDetailValues, onCleanUp }) => (
              <TableTemplateForm
                onFormReady={() => {
                  if (isOpen) {
                    initDetailValues(item);
                  } else {
                    onCleanUp();
                  }
                }}
                template={item}
                onCancel={() => toggle(false)}
              />
            )}
          </Subscribe>
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
      itemWidth="200px"
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
