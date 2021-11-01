// @flow
import React, { useState } from 'react';
// import { useIntl } from 'react-intl';
// import { Tooltip } from 'components/Tooltip';
import Icon from 'components/Icon';
import type { FilterBy } from 'types';

import BulkFilterModal from './bulkFilterModal';
import { StyledButton } from './styles';
// import { ActiveStyle, StyledButton } from './styles';

type Props = {
  filterBy: FilterBy => void,
  setFilterBy: FilterBy => void,
  type: 'SHIPMENT' | 'ORDER' | 'PRODUCT',
};

const HeaderFilter = ({ filterBy, setFilterBy, type }: Props) => {
  const [open, setOpen] = useState(false);
  // const isActive = filterBy?.keywords;
  // const intl = useIntl();

  const handleModal = () => {
    setOpen(!open);
  };

  return (
    <>
      <button className={StyledButton} type="button" onClick={handleModal}>
        {/* {isActive && <ActiveStyle />} */}
        {/* <Tooltip
          message={intl.formatMessage({
            id: 'components.Header.bulkFilter.paste',
            defaultMessage: 'Paste values from Excel',
          })}
        > */}
        <Icon icon="PASTE" />
        {/* </Tooltip> */}
      </button>
      <BulkFilterModal
        // modalContainer={modalContainer}
        isModalOpen={open}
        closeModal={handleModal}
        filterBy={filterBy}
        setFilterBy={setFilterBy}
        type={type}
      />
    </>
  );
};

export default HeaderFilter;
