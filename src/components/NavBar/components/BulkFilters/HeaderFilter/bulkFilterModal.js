// @flow
import * as React from 'react';
// import { Input } from 'antd';
// import { Button } from 'antd';
import { useEffect, useState } from 'react';
import Dialog from 'components/Dialog';
import { FormattedMessage, useIntl } from 'react-intl';
import { Tooltip } from 'components/Tooltip';
import { ApplyButton, ClearAllButton } from 'components/Buttons';
import { CheckboxInput, Label } from 'components/Form';
import Icon from 'components/Icon';

// import Modal from 'components/Modal';
import type { FilterBy } from 'types';

// import { InputWrapper } from './styles';
import {
  ButtonContainer,
  RightButtonsContainer,
  CheckboxWrapper,
  InputWrapper,
  Container,
  StyledTextArea,
} from './styles';

type Props = {
  isModalOpen: boolean,
  closeModal: () => void,
  filterBy: FilterBy,
  setFilterBy: FilterBy => void,
  type: 'SHIPMENT' | 'ORDER',
};

const BulkFilterModal = ({
  isModalOpen,
  closeModal,
  filterBy,
  // setFilterBy,
  type,
}: Props) => {
  const [value, setValue] = useState('');
  const [exact, setExact] = useState(false);

  const intl = useIntl();

  // Set value if filter exists
  useEffect(() => {
    if (filterBy?.keywords?.values) {
      const displayValues = filterBy?.keywords?.values.join(';').replace(/;/g, '\n');
      setValue(displayValues);
    }
  }, [filterBy]);

  const toggleExact = () => {
    setExact(!exact);
  };

  // const handleClearAll = () => {
  //   setFilterBy((oldFilters: FilterBy) => {
  //     const currentFilters = { ...oldFilters };
  //     if ('keywords' in currentFilters) {
  //       delete currentFilters.keywords;
  //     }
  //     return currentFilters;
  //   });
  //   setValue('');
  //   closeModal();
  // };

  // const handleApply = () => {
  //   setFilterBy((oldFilters: FilterBy) => {
  //     const currentFilters = { ...oldFilters };
  //     const keywords = {
  //       // Replace new lines with semi-colon and split into array
  //       // Filter any empty strings that may of be added
  //       values: value
  //         .replace(/(\r\n|\n|\r|\t)/gm, ';')
  //         .split(';')
  //         .filter((e: string) => e),
  //       matchMode: exact ? 'Exactly' : 'Partial',
  //     };
  //     return { ...currentFilters, keywords };
  //   });
  //   closeModal();
  // };

  const getTooltip = () => {
    let message = null;
    // let tooltip = null;
    if (type === 'SHIPMENT') {
      message = {
        id: 'components.Header.bulkFilter.shipmentTooltip',
        defaultMessage:
          'You can paste the following values from Excel: Shipment ID, Container No., Product Name, Product Serial, Order PoNo, Batch ID, Order Item No.',
      };
    } else if (type === 'ORDER') {
      message = {
        id: 'components.Header.bulkFilter.shipmentTooltip',
        defaultMessage:
          'You can paste the following values from Excel: Shipment ID, Container No., Product Name, Product Serial, Order PoNo, Batch ID, Order Item No.',
      };
    }
    if (message) {
      return (
        <Tooltip message={<FormattedMessage {...message} />}>
          <Icon icon="INFO" />
        </Tooltip>
      );
    }

    return null;
  };

  console.log(getTooltip());

  // const modalFooter = [
  //   <CheckboxWrapper key="exact-input" onClick={toggleExact}>
  //     <CheckboxInput checked={exact} />
  //     <Label>
  //       {intl.formatMessage({
  //         id: 'components.Header.bulkFilter.exactMatches',
  //         defaultMessage: 'Exact matches only',
  //       })}
  //     </Label>
  //   </CheckboxWrapper>,
  //   <div key="buttons">
  //     <Button type="text" onClick={handleClearAll}>
  //       {intl
  //         .formatMessage({
  //           id: 'components.NavBar.Filter.clearAll',
  //           defaultMessage: 'Clear All',
  //         })
  //         .toUpperCase()}
  //     </Button>
  //     <Button type="primary" onClick={handleApply} disabled={value === ''}>
  //       {intl
  //         .formatMessage({
  //           id: 'components.button.apply',
  //           defaultMessage: 'Apply',
  //         })
  //         .toUpperCase()}
  //     </Button>
  //   </div>,
  // ];
  return (
    <Dialog
      // footer={modalFooter}
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      // closable={false}
      // modalContainer={modalContainer}
      width="490px"
      // hideFooterBorder
      // buttonsRight
      // padding="0"
    >
      <div className={Container}>
        <InputWrapper>
          <Label>
            {intl.formatMessage({
              id: 'modules.Products.metadataValue',
              defaultMessage: 'Value',
            })}
            {/* {
            getTooltip()
          } */}
          </Label>
          <textarea
            className={StyledTextArea}
            value={value}
            placeholder={intl.formatMessage({
              id: 'components.Header.bulkFilter.pasteHere',
              defaultMessage: 'Paste values from Excel here',
            })}
            rows={4}
            onChange={e => setValue(e.target.value)}
          />
        </InputWrapper>
        <div className={ButtonContainer}>
          <div className={CheckboxWrapper}>
            <CheckboxInput checked={exact} onToggle={toggleExact} />
            <Label>
              {intl.formatMessage({
                id: 'components.Header.bulkFilter.exactMatches',
                defaultMessage: 'Exact matches only',
              })}
            </Label>
          </div>
          <div className={RightButtonsContainer}>
            <ClearAllButton />
            <ApplyButton borderRadius="5px" hideIcon />
            {/* {intl
            .formatMessage({
              id: 'components.NavBar.Filter.clearAll',
              defaultMessage: 'Clear All',
            })
            .toUpperCase()} */}
            {/* <button type="primary" disabled={value === ''}>
          {intl
            .formatMessage({
              id: 'components.button.apply',
              defaultMessage: 'Apply',
            })
            .toUpperCase()}
        </button> */}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default BulkFilterModal;
