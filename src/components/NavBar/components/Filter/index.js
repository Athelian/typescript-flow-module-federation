// @flow
import * as React from 'react';
import { FormattedMessage, injectIntl, type IntlShape, type MessageDescriptor } from 'react-intl';
import Dialog from 'components/Dialog';
import Icon from 'components/Icon';
import { Tooltip } from 'components/Tooltip';
import { BaseButton, SaveButton, ResetButton } from 'components/Buttons';
import { DefaultOptions, DefaultSelect, SelectInput, Label, Display } from 'components/Form';
import { volumeMetrics, areaMetrics, distanceMetrics, weightMetrics } from 'utils/metric';
import Archived from './Inputs/Archived';
import DateRange from './Inputs/DateRange';
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
import MetricRange from './Inputs/MetricRange';
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
  staticFilters?: Filters,
  onChange: Filters => void,
  intl: IntlShape,
};

const inputs = {
  archived: Archived,
  date_range: DateRange,
  volume_range: MetricRange(volumeMetrics),
  area_range: MetricRange(areaMetrics),
  distance_range: MetricRange(distanceMetrics),
  weight_range: MetricRange(weightMetrics),
};

const intersectFilters = (a: Filters, b: Filters): Filters =>
  Object.keys(a || {}).reduce((filters, key) => {
    const filteredFilters = { ...filters };
    delete filteredFilters[key];
    return filteredFilters;
  }, b);

const computeFilterStates = (
  config: Array<FilterConfig>,
  filters: Filters,
  staticFilters: Filters
): Array<FilterState> => {
  const filteredFilters = intersectFilters(staticFilters, filters);

  return Object.keys(filteredFilters).map(field => {
    return {
      ...config.find(c => c.field === field),
      value: filteredFilters[field],
    };
  });
};

const Filter = ({ config, filters, staticFilters, onChange, intl }: Props) => {
  const buttonRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);

  const [filterStates, setFilterStates] = React.useState<Array<FilterState>>([]);

  React.useEffect(() => {
    setFilterStates(computeFilterStates(config, filters, staticFilters || {}));
  }, [config, filters, staticFilters, open]);

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
      ...staticFilters,
    });

    setOpen(false);
    setFilterStates(states);
  };

  const onReset = () => {
    setFilterStates(computeFilterStates(config, filters, staticFilters || {}));
  };

  const onClearAll = () => {
    setFilterStates([]);
  };

  const isActive =
    Object.getOwnPropertyNames(filters || {}).length > 0 ||
    Object.getOwnPropertyNames(staticFilters || {}).length > 0;
  const hasWeakFilter = !!filterStates.find(f => !f.entity || !f.field || !f.type);
  const availableConfig = config.filter(
    c => !filterStates.find(f => f.entity === c.entity && f.field === c.field && f.type === c.type)
  );

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
            {staticFilters &&
              Object.keys(staticFilters).map(field => {
                const staticFilterConfig = config.find(c => c.field === field);

                return (
                  <div key={field} className={FilterWrapperStyle}>
                    <div className={InputsWrapperStyle}>
                      <div>
                        <Label height="30px" required>
                          <FormattedMessage {...messages.category} />
                        </Label>
                        <SelectInput
                          value={staticFilterConfig?.entity}
                          name="entity"
                          itemToString={i => i}
                          itemToValue={i => i}
                          readOnly
                        />
                      </div>
                      <div>
                        <Label height="30px" required>
                          <FormattedMessage {...messages.filter} />
                        </Label>
                        <SelectInput
                          value={staticFilterConfig?.field}
                          name="field"
                          itemToString={i => {
                            const message = staticFilterConfig?.message;
                            return message ? intl.formatMessage(message) : i;
                          }}
                          itemToValue={i => i}
                          readOnly
                        />
                      </div>
                      <div>
                        {/* $FlowFixMe */}
                        {React.createElement(inputs[(staticFilterConfig?.type)], {
                          value: staticFilters[field],
                          readonly: true,
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            {filterStates.map((state, index) => {
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

              const entities = new Set(availableConfig.map(c => c.entity));
              if (state.entity) {
                entities.add(state.entity);
              }

              const fields = new Set(
                availableConfig.filter(c => c.entity === state.entity).map(c => c.field)
              );
              if (state.field) {
                fields.add(state.field);
              }

              return (
                // eslint-disable-next-line
                <div key={`${state.field || ''}-${index}`} className={FilterWrapperStyle}>
                  <div className={InputsWrapperStyle}>
                    <div>
                      <Label height="30px" required>
                        <FormattedMessage {...messages.category} />
                      </Label>
                      <SelectInput
                        value={state.entity}
                        onChange={onEntityChange}
                        name="entity"
                        itemToString={i => i}
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
                            return message ? intl.formatMessage(message) : i;
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
