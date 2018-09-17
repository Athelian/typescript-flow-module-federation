// @flow
import * as React from 'react';
import faTimes from '@fortawesome/fontawesome-pro-solid/faTimes';
import faCheck from '@fortawesome/fontawesome-pro-solid/faCheck';
import faChevron from '@fortawesome/fontawesome-pro-solid/faChevronDown';
import Downshift from 'downshift';
import matchSorter from 'match-sorter';
import HoverWrapper from 'components/common/HoverWrapper';
import Editable from 'components/common/Editable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import EntityType from 'components/EntityType';
import { HoverStyle } from 'components/common/HoverWrapper/style';
import {
  WrapperStyle,
  SelectionWrapperStyle,
  ListWrapperStyle,
  InputStyle,
  RemoveStyle,
  ExpandButtonStyle,
  ArrowDownStyle,
  ItemStyle,
  SelectedWrapperStyle,
} from 'components/Form/EntityTypesInput/style';

import type { Props } from './type.js.flow';

type State = {
  focused: boolean,
};

export default class EntityTypesInput extends React.Component<Props, State> {
  static defaultProps = {
    isWrite: true,
    multiSelect: true,
  };

  state = {
    focused: false,
  };

  handleChange = (entityTypes: Array<string>) => {
    const { name, onChange } = this.props;

    if (onChange) {
      onChange(name, entityTypes);
    }
  };

  handleBlur = () => {
    const { name, onBlur } = this.props;
    if (onBlur) {
      onBlur(name, true);
    }
  };

  handleAdd = (entityType: string) => {
    const { values, multiSelect } = this.props;

    if (multiSelect && values) {
      this.handleChange([...values, entityType]);
    } else {
      this.handleChange([entityType]);
    }
  };

  handleRemove = (entityTypes: string) => {
    const { values } = this.props;

    if (values) this.handleChange(values.filter(t => t !== entityTypes));
  };

  handleDownshiftChange = (selectedItem: string) => {
    const { values } = this.props;

    if (values && values.includes(selectedItem)) {
      this.handleRemove(selectedItem);
    } else {
      this.handleAdd(selectedItem);
    }
  };

  handleStateChange = ({ isOpen }: Object) => {
    if (isOpen === false) {
      this.handleBlur();
    }
  };

  stateReducer = (state: Object, changes: Object) => {
    switch (changes.type) {
      case Downshift.stateChangeTypes.keyDownEnter:
      case Downshift.stateChangeTypes.clickItem:
        return {
          ...changes,
          isOpen: true,
          inputValue: '',
        };
      default:
        return changes;
    }
  };

  computeFilteredOptions = (input: string): Array<string> => {
    const { entityTypes } = this.props;

    return matchSorter(entityTypes, input);
  };

  handleInputFocus = () => {
    this.setState({ focused: true });
  };

  handleInputBlur = () => {
    this.setState({ focused: false });
    this.handleBlur();
  };

  isReadOnly = (isWrite?: boolean, isEditable: boolean) => !isWrite || !isEditable;

  render() {
    const { isWrite, editable, disabled, readOnly, values, entityTypes, multiSelect } = this.props;
    const { focused } = this.state;

    return (
      <Editable editable={!!editable}>
        {isEditable => (
          <HoverWrapper>
            {isHover => (
              <div className={HoverStyle(isHover && isWrite)}>
                <Downshift
                  itemCount={entityTypes.length}
                  selectedItem={null}
                  onChange={this.handleDownshiftChange}
                  onStateChange={this.handleStateChange}
                  stateReducer={this.stateReducer}
                >
                  {({
                    getInputProps,
                    getToggleButtonProps,
                    getItemProps,
                    isOpen,
                    inputValue,
                    highlightedIndex,
                    clearSelection,
                    reset,
                  }) => (
                    <div
                      className={WrapperStyle(
                        focused,
                        !!disabled,
                        readOnly || this.isReadOnly(isWrite, isEditable)
                      )}
                    >
                      <div className={SelectionWrapperStyle}>
                        {values &&
                          values.map(entityType => (
                            <EntityType
                              key={entityType}
                              name={entityType}
                              suffix={
                                isWrite && (
                                  <button
                                    type="button"
                                    className={RemoveStyle}
                                    onClick={() => {
                                      this.handleRemove(entityType);
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faTimes} fixedWidth />
                                  </button>
                                )
                              }
                            />
                          ))}
                        {isWrite && (
                          <div className={InputStyle(isHover)}>
                            {(multiSelect || !values || values.length === 0) && (
                              <input
                                type="text"
                                {...getInputProps({
                                  spellCheck: false,
                                  disabled,
                                  onKeyDown: e => {
                                    switch (e.key) {
                                      case 'Backspace':
                                        if (
                                          !inputValue &&
                                          values &&
                                          values.length > 0 &&
                                          !e.repeat
                                        ) {
                                          this.handleRemove(values[values.length - 1]);
                                        }
                                        break;
                                      default:
                                    }
                                  },
                                  onFocus: this.handleInputFocus,
                                  onBlur: () => {
                                    this.handleInputBlur();
                                    reset();
                                    clearSelection();
                                  },
                                })}
                              />
                            )}
                            {isWrite && (
                              <button
                                {...getToggleButtonProps()}
                                type="button"
                                className={ExpandButtonStyle}
                                disabled={disabled}
                              >
                                <FontAwesomeIcon
                                  className={ArrowDownStyle(isOpen)}
                                  icon={faChevron}
                                  fixedWidth
                                />
                              </button>
                            )}
                            {isOpen && (
                              <div className={ListWrapperStyle}>
                                {this.computeFilteredOptions(inputValue).map(
                                  (entityType, index) => {
                                    const isActive = highlightedIndex === index;
                                    const isSelected = values && values.includes(entityType);
                                    return (
                                      <div
                                        key={entityType}
                                        className={ItemStyle(isActive)}
                                        {...getItemProps({ item: entityType })}
                                      >
                                        <div className={SelectedWrapperStyle(isActive)}>
                                          {isSelected && (
                                            <FontAwesomeIcon icon={faCheck} fixedWidth />
                                          )}
                                        </div>
                                        <EntityType name={entityType} />
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Downshift>
              </div>
            )}
          </HoverWrapper>
        )}
      </Editable>
    );
  }
}
