// @flow
import * as React from 'react';
import { useQuery } from '@apollo/react-hooks';
import LoadingIcon from 'components/LoadingIcon';
import { DashedPlusButton, Label } from 'components/Form';
import { SelectionWrapperStyle } from './style';

export type SelectorProps = {
  open: boolean,
  onClose: () => void,
  selected: Array<string>,
  setSelected: (Array<string>) => void,
};

type Props = {
  value: Array<string>,
  readonly: boolean,
  onChange: (Array<string>) => void,
  title: any,
  selector: SelectorProps => React.Node,
  query: any,
  getItems: Object => Array<Object>,
  renderItem: Object => React.Node,
};

const Ids = ({
  value,
  readonly,
  onChange,
  title,
  selector,
  query,
  getItems,
  renderItem,
}: Props) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const { data, loading } = useQuery(query, {
    variables: { ids: value },
    fetchPolicy: 'cache-and-network',
  });

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
          if (loading && value.length > 0) {
            return <LoadingIcon size={20} />;
          }

          const items = loading ? [] : getItems(data);

          if (items.length === 0 && !readonly) {
            return <DashedPlusButton width="200px" height="30px" onClick={() => setOpen(true)} />;
          }

          return items.map(item => <div key={item?.id}>{renderItem(item)}</div>);
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

export default Ids;
