// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FixedSizeList } from 'react-window';
import Downshift from 'downshift';
import { useQuery } from '@apollo/react-hooks';
import Tag from 'components/Tag';
import Icon from 'components/Icon';
import usePortalSlot from 'hooks/usePortalSlot';
import { tagsQuery } from './query';
import { OptionStyle, OptionsWrapperStyle, SelectedStyle } from './style';

type Item = {
  id: string,
  name: string,
  color: string,
};

export type RenderInputProps = {
  isOpen: boolean,
  disabled?: boolean,
  selectedItems: Array<Item>,
  getInputProps: Object => Object,
  remove: Item => void,
};

type Props = {
  entityType: string,
  value: Array<Item>,
  disabled?: boolean,
  onChange: (Array<Item>) => void,
  onFocus?: (SyntheticFocusEvent<any>) => void,
  onBlur?: (SyntheticFocusEvent<any>) => void,
  optionWidth: number,
  inputRef?: { current: any },
  renderInput: RenderInputProps => React.Node,
};

type OptionsProps = {
  entityType: string,
  selectedItems: Array<Item>,
  isOpen: boolean,
  inputValue: ?string,
  highlightedIndex: ?number,
  closeMenu: () => any,
  optionWidth: number,
  getMenuProps: Object => Object,
  getItemProps: Object => Object,
};

type OptionProps = {
  index: number,
  style: Object,
  data: {
    tags: Array<Item>,
    getItemProps: Object => Object,
    highlightedIndex: ?number,
    selectedItems: Array<Item>,
  },
};

const TagOption = ({ index, style, data }: OptionProps) => {
  const tag: Item = data.tags[index];
  const selected = data.selectedItems.map(t => t.id).includes(tag.id);
  const highlighted = data.highlightedIndex === index;

  return (
    <div
      className={OptionStyle(selected, highlighted)}
      {...data.getItemProps({
        index,
        item: tag,
        style,
      })}
    >
      <div className={SelectedStyle}>{selected && <Icon icon="CONFIRM" />}</div>
      <Tag tag={tag} />
    </div>
  );
};

const TagOptions = ({
  entityType,
  selectedItems,
  inputValue,
  highlightedIndex,
  isOpen,
  closeMenu,
  optionWidth,
  getMenuProps,
  getItemProps,
}: OptionsProps) => {
  const { data, loading } = useQuery(tagsQuery, {
    fetchPolicy: 'cache-and-network',
    variables: {
      entityType,
      query: inputValue,
      page: 1,
      perPage: 100,
    },
  });

  const slot = usePortalSlot();
  const companionRef = React.useRef<HTMLDivElement | null>(null);
  const optionsRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!isOpen || !companionRef.current || !optionsRef.current) {
      return;
    }

    const viewportOffset: ClientRect = companionRef.current.getBoundingClientRect();
    // $FlowFixMe
    optionsRef.current.style.top = `${viewportOffset.top + viewportOffset.height}px`;
    // $FlowFixMe
    optionsRef.current.style.left = `${viewportOffset.left}px`;
  }, [companionRef, optionsRef, isOpen]);

  React.useEffect(() => {
    const opts = { capture: false, passive: true };
    const listener: WheelEventHandler = e => {
      // $FlowFixMe
      if (optionsRef.current && !optionsRef.current.contains(e.target)) {
        closeMenu();
      }
    };

    document.addEventListener('wheel', listener, opts);
    return () => document.removeEventListener('wheel', listener, opts);
  }, [closeMenu]);

  const tags = loading ? [] : data?.tags?.nodes ?? [];
  const height = Math.min(tags.length * 30, 200);

  return (
    <>
      <div ref={companionRef} />
      {ReactDOM.createPortal(
        <div
          className={OptionsWrapperStyle(optionWidth, height)}
          {...getMenuProps({
            ref: ref => {
              optionsRef.current = ref;
            },
          })}
        >
          <FixedSizeList
            width={optionWidth}
            height={height}
            itemCount={tags.length}
            itemSize={30}
            itemData={{
              tags,
              getItemProps,
              highlightedIndex,
              selectedItems,
            }}
          >
            {TagOption}
          </FixedSizeList>
        </div>,
        slot
      )}
    </>
  );
};

const itemToString = i => i?.name ?? '';
const stateReducer = (state: Object, changes: Object) => {
  switch (changes.type) {
    case Downshift.stateChangeTypes.keyDownEnter:
    case Downshift.stateChangeTypes.clickItem:
      return {
        ...changes,
        highlightedIndex: state.highlightedIndex,
        isOpen: true,
        inputValue: '',
      };
    default:
      return changes;
  }
};

const TagsInput = ({
  entityType,
  value,
  disabled,
  onChange,
  onFocus,
  onBlur,
  optionWidth,
  inputRef,
  renderInput,
}: Props) => {
  const internalInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleAdd = (tag: Item) => onChange([...value, tag]);
  const handleRemove = (tag: Item) => onChange(value.filter(t => t.id !== tag.id));
  const handleChange = (selectedItem: ?Item) => {
    if (!selectedItem) {
      return;
    }

    if (value.map(t => t.id).includes(selectedItem.id)) {
      handleRemove(selectedItem);
    } else {
      handleAdd(selectedItem);
    }
  };

  return (
    <Downshift
      selectedItem={null}
      onChange={handleChange}
      stateReducer={stateReducer}
      itemToString={itemToString}
    >
      {({
        getInputProps,
        getItemProps,
        getMenuProps,
        highlightedIndex,
        inputValue,
        openMenu,
        closeMenu,
        isOpen,
      }) => (
        <div>
          {React.createElement(renderInput, {
            isOpen,
            disabled,
            selectedItems: value,
            remove: tag => {
              handleRemove(tag);
              if (internalInputRef.current) {
                // $FlowFixMe refer prevent scroll on https://developer.mozilla.org/en-US/docs/Web/API/HTMLOrForeignElement/focus
                internalInputRef.current.focus({
                  preventScroll: true,
                });
              }
            },
            getInputProps: inputProps =>
              getInputProps({
                ...inputProps,
                ref: ref => {
                  if (inputRef) {
                    // eslint-disable-next-line no-param-reassign
                    inputRef.current = ref;
                  }
                  internalInputRef.current = ref;
                },
                onClick: () => {
                  openMenu();
                },
                onKeyDown: e => {
                  if (e.key === 'Backspace') {
                    if (!inputValue && value.length > 0 && !e.repeat) {
                      handleRemove(value[value.length - 1]);
                    }
                  }

                  if (inputProps.onKeyDown) {
                    inputProps.onKeyDown(e);
                  }
                },
                onFocus,
                onBlur,
                disabled,
              }),
          })}
          {isOpen && (
            <TagOptions
              entityType={entityType}
              selectedItems={value}
              highlightedIndex={highlightedIndex}
              inputValue={inputValue}
              isOpen={isOpen}
              closeMenu={closeMenu}
              optionWidth={optionWidth}
              getMenuProps={getMenuProps}
              getItemProps={getItemProps}
            />
          )}
        </div>
      )}
    </Downshift>
  );
};

export default TagsInput;
