// @flow
import * as React from 'react';
import { useQuery } from '@apollo/react-hooks';
import LoadingIcon from 'components/LoadingIcon';
import { DashedPlusButton, Label } from 'components/Form';
import { SelectionWrapperStyle } from './style';

type Props = {
  value: ?string,
  readonly: boolean,
  onChange: (?string) => void,
  title: any,
  selector: ({
    open: boolean,
    onClose: () => void,
    selected: ?string,
    setSelected: (?string) => void,
  }) => React.Node,
  query: any,
  getItem: Object => Object,
  renderItem: Object => React.Node,
};

type ItemProps = {
  id: string,
  query: any,
  getItem: Object => Object,
  renderItem: Object => React.Node,
};

const Item = ({ id, query, getItem, renderItem }: ItemProps) => {
  const { data, loading } = useQuery(query, {
    variables: { id },
    fetchPolicy: 'cache-and-network',
  });

  if (loading) {
    return <LoadingIcon size={20} />;
  }

  const item = getItem(data);

  return renderItem(item);
};

const Id = ({ value, readonly, onChange, title, selector, query, getItem, renderItem }: Props) => {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <>
      <Label height="30px">{title}</Label>

      <div
        className={SelectionWrapperStyle}
        role="presentation"
        onClick={() => {
          if (!readonly) {
            setOpen(true);
          }
        }}
      >
        {(() => {
          if (value) {
            return <Item id={value} query={query} getItem={getItem} renderItem={renderItem} />;
          }

          if (readonly) {
            return null;
          }

          return <DashedPlusButton width="200px" height="30px" onClick={() => setOpen(true)} />;
        })()}
      </div>

      {selector({
        open,
        onClose: () => setOpen(false),
        selected: value,
        setSelected: newValue => {
          onChange(newValue);
          setOpen(false);
        },
      })}
    </>
  );
};

export default Id;
