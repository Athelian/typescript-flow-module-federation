// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue, ObjectValue } from 'react-values';
import { injectIntl, intlShape } from 'react-intl';
import OrderFormContainer from 'modules/order/form/container';
import InputGroup from 'components/Form/InputGroup';
import { SectionNavBar, FilterInput, SortInput, SearchInput } from 'components/NavBar';
import { OrderItemCard, OrderBatchCard } from 'components/Cards';
import NewButton from 'components/NavButtons/NewButton';
import SlideView from 'components/SlideView';
import Icon from 'components/Icon';
import messages from 'modules/order/messages';
import ExpandButtons from './components/ExpandButtons';
import {
  ItemsSectionWrapperStyle,
  ItemsSectionBodyStyle,
  ItemGridStyle,
  ItemStyle,
  BatchAreaStyle,
  BatchAreaHeaderStyle,
  TitleWrapperStyle,
  TitleStyle,
  IconStyle,
  BatchGridStyle,
  BatchStyle,
  EmptyMessageStyle,
} from './style';
import SelectProducts from '../SelectProducts';

type Props = {
  intl: intlShape,
  initialValues: {
    orderItems: Array<any>,
    exporter: {
      id: string,
    },
  },
  isNew: boolean,
  onSelectItems: Function,
};

function ItemSection({ intl, isNew, initialValues, onSelectItems }: Props) {
  const fields = [
    { title: intl.formatMessage(messages.poSort), value: 'PO' },
    { title: intl.formatMessage(messages.updatedAtSort), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAtSort), value: 'createdAt' },
  ];
  const { orderItems = [], exporter = {} } = initialValues;

  const defaultValues = {
    perPage: 12,
    filterBy: { exporterId: exporter.id },
    sort: { field: 'updatedAt', direction: 'DESC' },
  };

  return (
    <ObjectValue defaultValue={defaultValues}>
      {({ value: filtersAndSort, set: onChangeFilter }) => (
        <BooleanValue>
          {({ value: allItemsExpanded, toggle: toggleExpand }) => (
            <div className={ItemsSectionWrapperStyle}>
              <SectionNavBar>
                <SortInput
                  sort={fields.find(item => item.value === filtersAndSort.sort.field) || fields[0]}
                  ascending={filtersAndSort.sort.direction !== 'DESC'}
                  fields={fields}
                  onChange={({ field: { value }, ascending }) =>
                    onChangeFilter({
                      sort: {
                        field: value,
                        direction: ascending ? 'ASC' : 'DESC',
                      },
                    })
                  }
                />
                <FilterInput
                  initialFilter={{}}
                  onChange={newFilter => onChangeFilter({ ...newFilter })}
                  width={400}
                >
                  {({ values, setFieldValue }) => (
                    <InputGroup fieldGap={16}>
                      <SearchInput
                        name="search"
                        value={values.query}
                        onClear={() => setFieldValue('query', '')}
                        onChange={newValue => setFieldValue('query', newValue)}
                      />
                    </InputGroup>
                  )}
                </FilterInput>

                <SearchInput
                  value={filtersAndSort.query}
                  name="search"
                  onClear={() => onChangeFilter({ query: '' })}
                  onChange={newQuery => onChangeFilter({ query: newQuery })}
                />

                <ExpandButtons expanded={allItemsExpanded} onClick={toggleExpand} />

                <BooleanValue>
                  {({ value: opened, toggle }) => (
                    <React.Fragment>
                      <Subscribe to={[OrderFormContainer]}>
                        {({ state }) => (
                          <NewButton
                            title={intl.formatMessage(messages.newItems)}
                            disabled={!((state.exporter && state.exporter.id) || !isNew)}
                            onClick={toggle}
                          />
                        )}
                      </Subscribe>
                      <SlideView
                        isOpen={opened}
                        onRequestClose={toggle}
                        options={{ width: '1030px' }}
                      >
                        {opened && (
                          <SelectProducts
                            onSelect={selectedItems => {
                              onSelectItems(selectedItems);
                              toggle();
                            }}
                            exporter={exporter && exporter.id}
                            onCancel={toggle}
                          />
                        )}
                      </SlideView>
                    </React.Fragment>
                  )}
                </BooleanValue>
              </SectionNavBar>
              <div className={ItemsSectionBodyStyle}>
                {orderItems.length > 0 ? (
                  <div className={ItemGridStyle}>
                    {orderItems.map(item => (
                      <div className={ItemStyle} key={item.id}>
                        <OrderItemCard item={{ id: item.id, quantity: 100 }} />
                        {allItemsExpanded && (
                          // TODO: add this condition item.batchItems.length > 0 && (
                          <div className={BatchAreaStyle}>
                            <div className={BatchAreaHeaderStyle}>
                              <div className={TitleWrapperStyle}>
                                <div className={IconStyle}>
                                  <Icon icon="BATCH" />
                                </div>
                                <div className={TitleStyle}>BATCHES (4)</div>
                              </div>
                              <Subscribe to={[OrderFormContainer]}>
                                {state => (
                                  <NewButton
                                    title="NEW BATCH"
                                    disabled={!(state.exporter && state.exporter.id)}
                                    onClick={toggleExpand}
                                  />
                                )}
                              </Subscribe>
                            </div>

                            <div className={BatchGridStyle}>
                              <div className={BatchStyle}>
                                <OrderBatchCard batch={{ id: item.id }} />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={EmptyMessageStyle}>{intl.formatMessage(messages.noItems)}</div>
                )}
              </div>
            </div>
          )}
        </BooleanValue>
      )}
    </ObjectValue>
  );
}

export default injectIntl(ItemSection);
