// @flow
import * as React from 'react';
import { BooleanValue, ObjectValue } from 'react-values';
import { injectIntl, intlShape } from 'react-intl';
import InputGroup from 'components/Form/InputGroup';
import { SectionNavBar, FilterInput, SortInput, SearchInput } from 'components/NavBar';
import { PartnerSelectInput } from 'components/Form';
import { OrderItemCard, OrderBatchCard } from 'components/Cards';
import NewButton from 'components/NavButtons/NewButton';
import SlideView from 'components/SlideView';
import messages from 'modules/order/messages';
import logger from 'utils/logger';
import ExpandButtons from './components/ExpandButtons';
import {
  ItemsSectionWrapperStyle,
  ItemsSectionBodyStyle,
  ItemGridStyle,
  ItemStyle,
  BatchAreaStyle,
  BatchAreaHeaderStyle,
  EmptyMessageStyle,
} from './style';
import SelectProducts from '../SelectProducts';

type Props = {
  isReady: boolean,
  intl: intlShape,
};

function ItemSection({ isReady, intl }: Props) {
  const fields = [
    { title: intl.formatMessage(messages.poSort), value: 'PO' },
    { title: intl.formatMessage(messages.exporterSort), value: 'exporter' },
    { title: intl.formatMessage(messages.updatedAtSort), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAtSort), value: 'createdAt' },
  ];

  return (
    <ObjectValue defaultValue={{ perPage: 12, sort: { field: 'updatedAt', direction: 'DESC' } }}>
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
                      <PartnerSelectInput
                        title={intl.formatMessage(messages.exporter)}
                        label={intl.formatMessage(messages.exporter)}
                        types={['Exporter']}
                        value={values.exporterId}
                        onChange={v => setFieldValue('exporterId', v ? v.id : null)}
                      />
                      <PartnerSelectInput
                        title={intl.formatMessage(messages.supplier)}
                        label={intl.formatMessage(messages.supplier)}
                        types={['Supplier']}
                        value={values.supplierId}
                        onChange={v => setFieldValue('supplierId', v ? v.id : null)}
                      />
                      <PartnerSelectInput
                        title={intl.formatMessage(messages.forwarder)}
                        label={intl.formatMessage(messages.forwarder)}
                        types={['Forwarder']}
                        value={values.userId}
                        onChange={v => setFieldValue('userId', v ? v.id : null)}
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
                <BooleanValue>
                  {({ value: opened, toggle }) => (
                    <React.Fragment>
                      <NewButton
                        title={intl.formatMessage(messages.newItems)}
                        disabled={!isReady}
                        onClick={toggle}
                      />
                      <SlideView
                        isOpen={opened}
                        onRequestClose={toggle}
                        options={{ width: '1030px' }}
                      >
                        {opened && (
                          <SelectProducts
                            onSelect={logger.warn}
                            filtersAndSort={filtersAndSort}
                            onLoadMore={logger.warn}
                          />
                        )}
                      </SlideView>
                    </React.Fragment>
                  )}
                </BooleanValue>

                <ExpandButtons expanded={allItemsExpanded} onClick={toggleExpand} />
              </SectionNavBar>
              <div className={ItemsSectionBodyStyle}>
                {/* items.length > 0 */}
                {true ? (
                  <div className={ItemGridStyle}>
                    {/* items.map */}
                    {[...Array(10).keys()].map(index => (
                      <div className={ItemStyle}>
                        <OrderItemCard item={{ id: index, quantity: 100 }} />
                        {allItemsExpanded && (
                          // item.batchItems.length > 0 && (
                          <div className={BatchAreaStyle}>
                            <div className={BatchAreaHeaderStyle}>
                              {intl.formatMessage(messages.batch)}
                              <NewButton
                                title={intl.formatMessage(messages.newItems)}
                                disabled={!isReady}
                                onClick={toggleExpand}
                              />
                            </div>
                            <div className={ItemGridStyle}>
                              <div className={ItemStyle}>
                                <OrderBatchCard batch={{ id: index }} />
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
