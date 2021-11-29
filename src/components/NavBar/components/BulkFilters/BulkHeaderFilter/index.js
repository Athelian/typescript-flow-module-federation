// @flow
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Tooltip } from 'components/Tooltip';
import Icon from 'components/Icon';
import type { FilterBy } from 'types';

import BulkFilterModal from './bulkFilterModal';
import { ActiveStyle, StyledButton } from './styles';

type Props = {
  filterBy: FilterBy,
  setFilterBy: FilterBy => void,
  type?: 'SHIPMENT' | 'ORDER' | 'PRODUCT' | 'CONTAINER' | 'MAP',
};

const HeaderFilter = ({ filterBy, setFilterBy, type }: Props) => {
  const [open, setOpen] = useState(false);
  const isActive = filterBy?.bulkFilter || filterBy.keywords;
  const intl = useIntl();

  const handleModal = () => {
    setOpen(!open);
  };

  return (
    <>
      <button className={StyledButton} type="button" onClick={handleModal}>
        {isActive && <div className={ActiveStyle} />}
        <Tooltip
          message={intl.formatMessage({
            id: 'components.Header.bulkFilter.paste',
            defaultMessage: 'Paste values from Excel',
          })}
        >
          <div>
            <Icon icon="PASTE" />
          </div>
        </Tooltip>
      </button>
      <BulkFilterModal
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
