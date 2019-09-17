// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { BaseButton, SaveButton, ResetButton } from 'components/Buttons';
import { DefaultOptions, DefaultSelect, SelectInput, Label, Display } from 'components/Form';
import OutsideClickHandler from 'components/OutsideClickHandler';
import useFixedCompanion from 'hooks/useFixedCompanion';
import ArchivedFilterInput from './Inputs/ArchivedFilterInput';
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
} from './style';

type Config = {
  entity: string,
  field: string,
  type: string,
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
  config: Array<Config>,
  filters: Filters,
  staticFilters?: Filters,
  onChange: Filters => void,
};

const inputs = {
  archived: ArchivedFilterInput,
};

const intersectFilters = (a: Filters, b: Filters): Filters =>
  Object.keys(a || {}).reduce((filters, key) => {
    const filteredFilters = { ...filters };
    delete filteredFilters[key];
    return filteredFilters;
  }, b);

const computeFilterStates = (
  config: Array<Config>,
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

const Filter = ({ config, filters, staticFilters, onChange }: Props) => {
  const buttonRef = React.useRef(null);
  const offset = useFixedCompanion(buttonRef, 'bottom');
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

  return (
    <OutsideClickHandler ignoreClick={!open} onOutsideClick={() => setOpen(false)}>
      <button ref={buttonRef} className={ButtonStyle} type="button" onClick={() => setOpen(!open)}>
        {isActive && <span className={ActiveStyle} />}
        <Icon icon="FILTER" />
      </button>

      <div className={WrapperStyle(offset, open)}>
        <div className={ActionsStyle}>
          <BaseButton
            icon="REMOVE"
            label="CLEAR ALL"
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
                        Category
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
                        Filter
                      </Label>
                      <SelectInput
                        value={staticFilterConfig?.field}
                        name="field"
                        itemToString={i => i}
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

            return (
              // eslint-disable-next-line
              <div key={`${state.field || ''}-${index}`} className={FilterWrapperStyle}>
                <div className={InputsWrapperStyle}>
                  <div>
                    <Label height="30px" required>
                      Category
                    </Label>
                    <SelectInput
                      value={state.entity}
                      onChange={onEntityChange}
                      name="entity"
                      itemToString={i => i}
                      itemToValue={i => i}
                      items={[...new Set(config.map(c => c.entity))]}
                      renderSelect={({ ...rest }) => <DefaultSelect hideClearIcon {...rest} />}
                      renderOptions={({ ...rest }) => <DefaultOptions {...rest} width="200px" />}
                    />
                  </div>

                  <div>
                    <Label height="30px" required>
                      Filter
                    </Label>

                    {state.entity ? (
                      <SelectInput
                        value={state.field}
                        onChange={onFieldChange}
                        name="field"
                        itemToString={i => i}
                        itemToValue={i => i}
                        items={[
                          ...new Set(
                            config.filter(c => c.entity === state.entity).map(c => c.field)
                          ),
                        ]}
                        renderSelect={({ ...rest }) => <DefaultSelect hideClearIcon {...rest} />}
                        renderOptions={({ ...rest }) => <DefaultOptions {...rest} width="200px" />}
                      />
                    ) : (
                      <Display>Please choose a category first</Display>
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
                      <Display>Please choose a filter first</Display>
                    )}
                  </div>
                </div>

                <button type="button" className={DeleteButtonStyle} onClick={onDelete}>
                  <Icon icon="REMOVE" />
                </button>
              </div>
            );
          })}

          <BaseButton
            icon="ADD"
            label="ADD FILTER"
            backgroundColor="TEAL"
            hoverBackgroundColor="TEAL_DARK"
            onClick={() =>
              setFilterStates([
                ...filterStates,
                { entity: null, field: null, type: null, value: null },
              ])
            }
          />
        </div>
      </div>
    </OutsideClickHandler>
  );
};

export default Filter;
