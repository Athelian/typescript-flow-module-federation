// @flow
import * as React from 'react';
import { useEffect, useState } from 'react';
import Dialog from 'components/Dialog';
import { FormattedMessage, useIntl } from 'react-intl';
import { ApplyButton, ClearAllButton } from 'components/Buttons';
import { CheckboxInput, Label, SelectInput, DefaultOptions, DefaultSelect } from 'components/Form';
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
import messages from './messages';

type Props = {
  isModalOpen: boolean,
  closeModal: () => void,
  filterBy: FilterBy,
  setFilterBy: FilterBy => void,
  type: 'SHIPMENT' | 'ORDER' | 'PRODUCT' | 'CONTAINER',
};

const BulkFilterModal = ({ isModalOpen, closeModal, filterBy, setFilterBy, type }: Props) => {
  const [value, setValue] = useState('');
  const [exact, setExact] = useState(false);
  const [filterType, setFilterType] = useState();
  const [options, setOptions] = useState([]);

  const intl = useIntl();

  useEffect(() => {
    // Set options for select
    setOptions(BulkFilterConfig.filter(c => c.entity === type));
  }, [type]);

  const toggleExact = () => {
    setExact(!exact);
  };

  // Clear out filter
  const handleClearAll = () => {
    const currentFilters = { ...filterBy };
    delete currentFilters.bulkFilter;
    setFilterBy(currentFilters);
    setValue('');
    closeModal();
  };

  const handleApply = () => {
    const selectedFilter = (filterType: any);
    const currentFilters = { ...filterBy };
    const data = {
      // Replace new lines with semi-colon and split into array
      // Filter any empty strings that may of be added
      ...currentFilters,
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

  const fields = BulkFilterConfig.filter(c => c.entity === type).map(c => c.value);

  return (
    <Dialog isOpen={isModalOpen} onRequestClose={closeModal} width="490px">
      <div className={Container}>
        <InputWrapper>
          <div className={SelectWrapper}>
            <div>
              <Label height="30px" required>
                <FormattedMessage {...messages.filter} />
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
          <Label required>
            <FormattedMessage {...messages.value} />
          </Label>
          <textarea
            disabled={!filterType}
            className={StyledTextArea}
            value={value}
            placeholder={intl.formatMessage(messages.pasteHere)}
            rows={4}
            onChange={e => setValue(e.target.value)}
          />
        </InputWrapper>
        <div className={ButtonContainer}>
          <div className={CheckboxWrapper}>
            <CheckboxInput checked={exact} onToggle={toggleExact} />
            <Label>
              <FormattedMessage {...messages.exactMatches} />
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
