// @flow
import * as React from 'react';
// import { Input } from 'antd';
// import { Button } from 'antd';
import { useEffect, useState } from 'react';
import Dialog from 'components/Dialog';
import { FormattedMessage, useIntl } from 'react-intl';
import { Tooltip } from 'components/Tooltip';
import { ApplyButton, ClearAllButton } from 'components/Buttons';
import { CheckboxInput, Label, SelectInput, DefaultOptions, DefaultSelect } from 'components/Form';
import Icon from 'components/Icon';
import type { FilterBy } from 'types';
import BulkFilterConfig from './configs';

import {
  ButtonContainer,
  RightButtonsContainer,
  CheckboxWrapper,
  InputWrapper,
  Container,
  StyledTextArea,
  SelectWrapper,
} from './styles';

type Props = {
  isModalOpen: boolean,
  closeModal: () => void,
  filterBy: FilterBy,
  setFilterBy: FilterBy => void,
  type: 'SHIPMENT' | 'ORDER' | 'PRODUCT',
};

const BulkFilterModal = ({ isModalOpen, closeModal, filterBy, setFilterBy, type }: Props) => {
  const [value, setValue] = useState('');
  const [exact, setExact] = useState(false);
  const [filterType, setFilterType] = useState();
  const [options, setOptions] = useState([]);

  const intl = useIntl();

  // Set value if filter exists
  useEffect(() => {
    if (!isModalOpen) {
      setFilterType(null);
    }

    // Set options for select
    setOptions(BulkFilterConfig.filter(c => c.entity === type));

    if (filterBy?.keywords?.values) {
      const displayValues = filterBy?.keywords?.values.join(';').replace(/;/g, '\n');
      setValue(displayValues);
    }
  }, [filterBy, type, isModalOpen]);

  const toggleExact = () => {
    setExact(!exact);
  };

  const handleClearAll = () => {
    setFilterBy({});
    setValue('');
    closeModal();
  };

  const handleApply = () => {
    const selectedFilter = (filterType: any);
    const data = {
      // Replace new lines with semi-colon and split into array
      // Filter any empty strings that may of be added
      bulkFilter: {
        [selectedFilter]: {
          values: value
            .replace(/(\r\n|\n|\r|\t)/gm, ';')
            .split(';')
            .filter((e: string) => e),
          matchMode: exact ? 'Exactly' : 'Partial',
        },
      },
    };
    setFilterBy(data);
    closeModal();
  };

  console.log(filterBy);
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
    } else if (type === 'PRODUCT') {
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

  const fields = BulkFilterConfig.filter(c => c.entity === type).map(c => c.value);

  return (
    <Dialog isOpen={isModalOpen} onRequestClose={closeModal} width="490px">
      <div className={Container}>
        <InputWrapper>
          <div className={SelectWrapper}>
            <div>
              <Label height="30px" required>
                Filter
              </Label>
              <SelectInput
                value={filterType}
                items={[...fields]}
                onChange={i => setFilterType(i)}
                name="filter"
                itemToString={i => {
                  const message = options.find(c => c.entity === type && c.value === i)?.message;
                  const itemValue = message ? intl.formatMessage(message) : i;

                  return itemValue?.toUpperCase() ?? '';
                }}
                itemToValue={i => i}
                renderSelect={({ ...rest }) => <DefaultSelect hideClearIcon {...rest} />}
                renderOptions={({ ...rest }) => <DefaultOptions {...rest} width="220px" />}
              />
            </div>
          </div>
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
            disabled={!filterType}
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
            <ClearAllButton onClick={handleClearAll} />
            <ApplyButton borderRadius="5px" hideIcon onClick={handleApply} disabled={!filterType} />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default BulkFilterModal;
