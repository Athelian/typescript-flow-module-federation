// @flow
import * as React from 'react';
import { uuid } from 'utils/id';
import Icon from 'components/Icon';
import { FilterDataStyle } from 'modules/relationMap/common/SortFilter/AdvancedFilter/FilterMenu/components/FilterData/style';

type Props = {
  ports: Array<Object>,
  label: React.Node,
};

const PortItem = ({ ports, label }: Props): Array<React.Node> =>
  ports.map(
    port =>
      port && (
        <button
          key={uuid()}
          className={FilterDataStyle}
          type="button"
          onClick={() => console.log(port)}
        >
          {label} : {port.name}
          <Icon icon="CLEAR" />
        </button>
      )
  );

export default PortItem;
