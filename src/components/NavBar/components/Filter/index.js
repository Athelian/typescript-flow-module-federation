// @flow
import * as React from 'react';
import { FormattedMessage, injectIntl, type IntlShape, type MessageDescriptor } from 'react-intl';
import Dialog from 'components/Dialog';
import Icon from 'components/Icon';
import { Tooltip } from 'components/Tooltip';
import { BaseButton, SaveButton, ResetButton } from 'components/Buttons';
import { DefaultOptions, DefaultSelect, SelectInput, Label, Display } from 'components/Form';
import Archived from './Inputs/Archived';
import DateRange from './Inputs/DateRange';
import { VolumeRange, AreaRange, LengthRange, MassRange } from './Inputs/MetricRange';
import Ports from './Inputs/Ports';
import Users from './Inputs/Users';
import OrganizationTypes from './Inputs/OrganizationTypes';
import OrderIds from './Inputs/OrderIds';
import WarehouseIds from './Inputs/WarehouseIds';
import { CompletelyBatched, CompletelyShipped } from './Inputs/Bool';
import {
  ImporterIds,
  ExporterIds,
  SupplierIds,
  ForwarderIds,
  WarehouserIds,
} from './Inputs/PartnerIds';
import {
  ProductTags,
  BatchTags,
  ContainerTags,
  OrderItemTags,
  OrderTags,
  ProjectTags,
  ShipmentTags,
  TaskTags,
  UserTags,
} from './Inputs/Tags';
import {
  ActionsStyle,
  ActiveStyle,
  ButtonStyle,
  DeleteButtonStyle,
  FiltersListStyle,
  FilterWrapperStyle,
  InputsWrapperStyle,
  ResetActionStyle,
  WrapperStyle,
  AddFilterButtonWrapperStyle,
} from './style';
import messages from './messages';

export type FilterConfig = {
  entity: string,
  field: string,
  type: string,
  message: MessageDescriptor,
  defaultValue?: any,
};

type FilterState = {
  entity: string | null,
  field: string | null,
  type: string | null,
  value: any,
};

type Filters = { [string]: any };

type Props = {
  config: Array<FilterConfig>,
  filters: Filters,
  staticFilters?: Array<string>,
  onChange: Filters => void,
  intl: IntlShape,
};

const inputs = {
  archived: Archived,
  date_range: DateRange,
  volume_range: VolumeRange,
  area_range: AreaRange,
  length_range: LengthRange,
  mass_range: MassRange,
  order_ids: OrderIds,
  warehouse_ids: WarehouseIds,
  importer_ids: ImporterIds,
  exporter_ids: ExporterIds,
  supplier_ids: SupplierIds,
  forwarder_ids: ForwarderIds,
  warehouser_ids: WarehouserIds,
  users: Users,
  product_tags: ProductTags,
  order_tags: OrderTags,
  order_item_tags: OrderItemTags,
  batch_tags: BatchTags,
  shipment_tags: ShipmentTags,
  container_tags: ContainerTags,
  project_tags: ProjectTags,
  task_tags: TaskTags,
  user_tags: UserTags,
  organization_types: OrganizationTypes,
  completely_batched: CompletelyBatched,
  completely_shipped: CompletelyShipped,
  ports: Ports,
};

const computeFilterStates = (config: Array<FilterConfig>, filters: Filters): Array<FilterState> => {
  return Object.keys(filters).map(field => {
    return {
      ...config.find(c => c.field === field),
      value: filters[field],
    };
  });
};

const Filter = ({ config, filters, staticFilters, onChange, intl }: Props) => {
  const buttonRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);

  const [filterStates, setFilterStates] = React.useState<Array<FilterState>>([]);

  React.useEffect(() => {
    setFilterStates(computeFilterStates(config, filters));
  }, [config, filters, open]);

  const onSave = () => {
    const states = filterStates.filter(s => !!s.entity && !!s.field && !!s.type);

    onChange({
      ...states.reduce(
        (f, state) => ({
          ...f,
          [state.field || '']: state.value,
        }),
        {}
      ),
    });

    setOpen(false);
    setFilterStates(states);
  };

  const onReset = () => {
    setFilterStates(computeFilterStates(config, filters));
  };

  const onClearAll = () => {
    setFilterStates([]);
  };

  const isActive = filterStates.length > 0;
  const hasWeakFilter = !!filterStates.find(f => !f.entity || !f.field || !f.type);
  const availableConfig = config.filter(
    c => !filterStates.find(f => f.entity === c.entity && f.field === c.field)
  );
  const readonlyFilters = filterStates.filter(fs => (staticFilters || []).includes(fs.field));
  const canAddFilter = availableConfig.length > 0 && !hasWeakFilter;

  return (
    <>
      <button ref={buttonRef} className={ButtonStyle} type="button" onClick={() => setOpen(!open)}>
        {isActive && <span className={ActiveStyle} />}
        <Icon icon="FILTER" />
      </button>

      <Dialog isOpen={open} onRequestClose={() => setOpen(false)} width="720px">
        <div className={WrapperStyle}>
          <div className={ActionsStyle}>
            <BaseButton
              icon="REMOVE"
              label={<FormattedMessage {...messages.clearAll} />}
              textColor="GRAY_DARK"
              hoverTextColor="WHITE"
              backgroundColor="GRAY_SUPER_LIGHT"
              hoverBackgroundColor="GRAY_LIGHT"
              onClick={onClearAll}
            />
            <ResetButton className={ResetActionStyle} onClick={onReset} />
            <SaveButton onClick={onSave} />
          </div>

          <div className={FiltersListStyle}>
            {readonlyFilters.map(state => {
              return (
                <div
                  key={`${state.entity || ''}-${state.field || ''}`}
                  className={FilterWrapperStyle}
                >
                  <div className={InputsWrapperStyle}>
                    <div>
                      <Label height="30px" required>
                        <FormattedMessage {...messages.category} />
                      </Label>
                      <SelectInput
                        value={state.entity}
                        items={[state.entity]}
                        name="entity"
                        // $FlowFixMe: Flow does not yet support method or property calls in optional chains.
                        itemToString={i => i?.toUpperCase() ?? ''}
                        itemToValue={i => i}
                        readOnly
                        readOnlyWidth="200px"
                        readOnlyHeight="30px"
                      />
                    </div>
                    <div>
                      <Label height="30px" required>
                        <FormattedMessage {...messages.filter} />
                      </Label>
                      <SelectInput
                        value={state.field}
                        items={[state.field]}
                        name="field"
                        itemToString={i => {
                          const message = config.find(
                            c => c.entity === state.entity && c.field === i
                          )?.message;
                          const value = message ? intl.formatMessage(message) : i;
                          // $FlowFixMe: Flow does not yet support method or property calls in optional chains.
                          return value?.toUpperCase() ?? '';
                        }}
                        itemToValue={i => i}
                        readOnly
                        readOnlyWidth="200px"
                        readOnlyHeight="30px"
                      />
                    </div>
                    <div>
                      {state.type &&
                        React.createElement(inputs[state.type], {
                          value: state.value,
                          onChange: () => {},
                          readonly: true,
                        })}
                    </div>
                  </div>
                </div>
              );
            })}
            {filterStates.map((state, index) => {
              if ((staticFilters || []).includes(state.field)) {
                return null;
              }

              const onEntityChange = entity => {
                setFilterStates(
                  filterStates.map((fs, i) =>
                    i === index
                      ? {
                          entity,
                          field: null,
                          type: null,
                          value: null,
                        }
                      : fs
                  )
                );
              };

              const onFieldChange = field => {
                setFilterStates(
                  filterStates.map((fs, i) =>
                    i === index
                      ? {
                          ...fs,
                          field,
                          type: config.find(c => c.field === field)?.type,
                          value: config.find(c => c.field === field)?.defaultValue ?? null,
                        }
                      : fs
                  )
                );
              };

              const onValueChange = value => {
                setFilterStates(
                  filterStates.map((fs, i) =>
                    i === index
                      ? {
                          ...fs,
                          value,
                        }
                      : fs
                  )
                );
              };

              const onDelete = () => {
                const newStates = [...filterStates];
                newStates.splice(index, 1);
                setFilterStates(newStates);
              };

              const entities = new Set(
                config
                  .filter(
                    c =>
                      c.entity === state.entity ||
                      !filterStates.find(f => f.entity === c.entity && f.field === c.field)
                  )
                  .map(c => c.entity)
              );

              const fields = config
                .filter(
                  c =>
                    c.entity === state.entity &&
                    (c.field === state.field ||
                      !filterStates.find(f => f.entity === c.entity && f.field === c.field))
                )
                .map(c => c.field);

              return (
                <div
                  key={`${state.entity || ''}-${state.field || ''}`}
                  className={FilterWrapperStyle}
                >
                  <div className={InputsWrapperStyle}>
                    <div>
                      <Label height="30px" required>
                        <FormattedMessage {...messages.category} />
                      </Label>
                      <SelectInput
                        value={state.entity}
                        onChange={onEntityChange}
                        name="entity"
                        // $FlowFixMe: Flow does not yet support method or property calls in optional chains.
                        itemToString={i => i?.toUpperCase() ?? ''}
                        itemToValue={i => i}
                        items={[...entities]}
                        renderSelect={({ ...rest }) => <DefaultSelect hideClearIcon {...rest} />}
                        renderOptions={({ ...rest }) => <DefaultOptions {...rest} width="200px" />}
                      />
                    </div>

                    <div>
                      <Label height="30px" required>
                        <FormattedMessage {...messages.filter} />
                      </Label>

                      {state.entity ? (
                        <SelectInput
                          value={state.field}
                          onChange={onFieldChange}
                          name="field"
                          itemToString={i => {
                            const message = config.find(
                              c => c.entity === state.entity && c.field === i
                            )?.message;
                            const value = message ? intl.formatMessage(message) : i;
                            // $FlowFixMe: Flow does not yet support method or property calls in optional chains.
                            return value?.toUpperCase() ?? '';
                          }}
                          itemToValue={i => i}
                          items={[...fields]}
                          renderSelect={({ ...rest }) => <DefaultSelect hideClearIcon {...rest} />}
                          renderOptions={({ ...rest }) => (
                            <DefaultOptions {...rest} width="200px" />
                          )}
                        />
                      ) : (
                        <Display height="30px" color="GRAY_LIGHT">
                          <FormattedMessage {...messages.chooseCategory} />
                        </Display>
                      )}
                    </div>

                    <div>
                      {state.type ? (
                        React.createElement(inputs[state.type], {
                          value: state.value,
                          onChange: onValueChange,
                          readonly: false,
                        })
                      ) : (
                        <>
                          <Label height="30px" />
                          <Display height="30px" color="GRAY_LIGHT">
                            <FormattedMessage {...messages.chooseFilter} />
                          </Display>
                        </>
                      )}
                    </div>
                  </div>

                  <button type="button" className={DeleteButtonStyle} onClick={onDelete}>
                    <Icon icon="REMOVE" />
                  </button>
                </div>
              );
            })}

            {canAddFilter ? (
              <BaseButton
                icon="ADD"
                label={<FormattedMessage {...messages.addFilter} />}
                backgroundColor="TEAL"
                hoverBackgroundColor="TEAL_DARK"
                onClick={() =>
                  setFilterStates([
                    ...filterStates,
                    { entity: null, field: null, type: null, value: null },
                  ])
                }
              />
            ) : (
              <Tooltip message={<FormattedMessage {...messages.disabledAddMessage} />}>
                <div className={AddFilterButtonWrapperStyle}>
                  <BaseButton
                    icon="ADD"
                    label={<FormattedMessage {...messages.addFilter} />}
                    backgroundColor="TEAL"
                    hoverBackgroundColor="TEAL_DARK"
                    disabled
                  />
                </div>
              </Tooltip>
            )}
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default injectIntl(Filter);
