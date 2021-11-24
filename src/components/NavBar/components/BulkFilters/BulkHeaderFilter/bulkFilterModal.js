// @flow
import * as React from 'react';
import { useEffect, useState } from 'react';
import Dialog from 'components/Dialog';
import { FormattedMessage, useIntl } from 'react-intl';
import { ApplyButton, ClearAllButton } from 'components/Buttons';
import { CheckboxInput, Label } from 'components/Form';
import type { FilterBy } from 'types';
import BulkFilterConfig from './configs';

import {
  ButtonContainer,
  RightButtonsContainer,
  CheckboxWrapper,
  InputWrapper,
  Container,
  StyledTextArea,
} from './styles';
import messages from './messages';

type Props = {
  isModalOpen: boolean,
  closeModal: () => void,
  filterBy: FilterBy,
  setFilterBy: FilterBy => void,
  type?: 'SHIPMENT' | 'ORDER' | 'PRODUCT' | 'CONTAINER' | 'MAP',
};

const BulkFilterModal = ({ isModalOpen, closeModal, filterBy, setFilterBy, type }: Props) => {
  const [value, setValue] = useState('');
  const [exact, setExact] = useState(false);

  const intl = useIntl();

  useEffect(() => {
    // Clear out filters
    if (!isModalOpen) {
      setValue('');
    }

    // Set value if filter exists
    let currentBulkFilter = {};
    if (type === 'MAP' && filterBy?.keywords) {
      currentBulkFilter = (filterBy?.keywords: Object) || {};
    }

    if (type !== 'MAP' && filterBy?.bulkFilter) {
      currentBulkFilter = (Object.values(filterBy?.bulkFilter)?.[0]: Object) || {};
    }

    if (currentBulkFilter?.values) {
      const displayValues = currentBulkFilter?.values.join(';').replace(/;/g, '\n');
      const matchMode = currentBulkFilter?.matchMode;
      setExact(matchMode === 'Exactly');
      setValue(displayValues);
    }
  }, [filterBy, type, isModalOpen]);

  const toggleExact = () => {
    setExact(!exact);
  };

  // Clear out filter
  const handleClearAll = () => {
    const currentFilters = { ...filterBy };
    if (type === 'MAP') {
      delete currentFilters.keywords;
    }
    if (type !== 'MAP') {
      delete currentFilters.bulkFilter;
    }
    setFilterBy(currentFilters);
    setValue('');
    closeModal();
  };

  const handleApply = () => {
    const currentFilters = { ...filterBy };

    // Replace new lines with semi-colon and split into array
    // Filter any empty strings that may of be added
    const newParsedValue = value
      .replace(/(\r\n|\n|\r|\t)/gm, ';')
      .split(';')
      .filter((e: string) => e);

    const newMatchMode = exact ? 'Exactly' : 'Partial';

    let data = {};
    // If type is not map, we need to pass values to bulkFilter
    if (type !== 'MAP') {
      const fields = BulkFilterConfig.filter(c => c.entity === type).map(c => c.value);
      const newBulkFilterParams = fields.reduce((arr, field) => {
        // eslint-disable-next-line
        arr[field] = {
          values: newParsedValue,
          matchMode: newMatchMode,
        };
        return arr;
      }, {});

      data = {
        ...currentFilters,
        bulkFilter: {
          ...newBulkFilterParams,
        },
      };
    }
    // If type is map, we need to pass values to keywords
    if (type === 'MAP') {
      data = {
        ...currentFilters,
        keywords: {
          matchMode: newMatchMode,
          values: newParsedValue,
        },
      };
    }

    setFilterBy(data);
    closeModal();
  };

  return (
    <Dialog isOpen={isModalOpen} onRequestClose={closeModal} width="490px">
      <div className={Container}>
        <InputWrapper>
          <Label required>
            <FormattedMessage {...messages.value} />
          </Label>
          <textarea
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
            <ApplyButton borderRadius="5px" hideIcon onClick={handleApply} />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default BulkFilterModal;
