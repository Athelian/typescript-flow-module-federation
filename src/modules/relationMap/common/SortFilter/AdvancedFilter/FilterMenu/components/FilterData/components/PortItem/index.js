// @flow
import * as React from 'react';
import { uuid } from 'utils/id';
import Icon from 'components/Icon';
import { FilterDataStyle } from 'modules/relationMap/common/SortFilter/AdvancedFilter/FilterMenu/components/FilterData/style';

type Props = {
  ports: Array<Object>,
  label: React.Node,
  name: string,
  onRemove: Function,
};

const PortItem = ({ ports, name, label, onRemove }: Props): Array<React.Node> =>
  ports.map(
    (port, index) =>
      port && (
        <button
          key={uuid()}
          className={FilterDataStyle}
          type="button"
          onClick={() => {
            const newPorts = [...ports];
            newPorts.splice(index, 1);
            onRemove(newPorts, name);
          }}
        >
          {label} : {port.description}
          <Icon icon="CLEAR" />
        </button>
      )
  );

export default PortItem;
