// @flow
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue, ObjectValue } from 'react-values';
import emitter from 'utils/emitter';
import Icon from 'components/Icon';
import { CancelButton, ApplyButton } from 'components/Buttons';
import { Label } from 'components/Form';
import { Tooltip } from 'components/Tooltip';
import Dialog from 'components/Dialog';
import ConfirmDialog from 'components/Dialog/ConfirmDialog';
import OutsideClickHandler from 'components/OutsideClickHandler';
import GridRow from 'components/GridRow';
import InlineSelectEnumInput from 'modules/relationMap/order/components/TableInlineEdit/components/TableItem/components/InlineSelectEnumInput';
import {
  BatchQuantityHelperWandStyle,
  BatchQuantityHelperWrapperStyle,
  BatchQuantityHelperButtonStyle,
  ChangeTypeDialogWrapperStyle,
  ChangeTypeDialogMessageStyle,
  ChangeTypeDialogInputWrapperStyle,
} from './style';

type Props = {
  index: number,
};

export default function BatchQuantityHelper({ index }: Props) {
  const [quantityType, setQuantityType] = useState('Other');

  return (
    <BooleanValue>
      {({ value: helperIsShown, set: toggleHelperIsShown }) => {
        if (!helperIsShown) {
          return (
            <Tooltip
              message={
                <FormattedMessage
                  id="modules.RelationalMap.batchAdjustmentWandButton"
                  defaultMessage="Create New Quantities or change the New Quantity Type for all cells in this column."
                />
              }
            >
              <button
                className={BatchQuantityHelperWandStyle}
                onClick={() => toggleHelperIsShown(true)}
                type="button"
              >
                <Icon icon="MAGIC" />
              </button>
            </Tooltip>
          );
        }

        return (
          <ObjectValue
            defaultValue={{ changeTypeDialogIsShown: false, createQuantityDialogIsShown: false }}
          >
            {({ value: dialogShownValues, set: setDialogShown }) => {
              const { changeTypeDialogIsShown, createQuantityDialogIsShown } = dialogShownValues;
              const toggleChangeTypeDialog = (value: boolean) =>
                setDialogShown({ ...dialogShownValues, changeTypeDialogIsShown: value });
              const toggleCreateQuantityDialog = (value: boolean) =>
                setDialogShown({ ...dialogShownValues, createQuantityDialogIsShown: value });

              return (
                <>
                  <OutsideClickHandler
                    onOutsideClick={() => {
                      toggleHelperIsShown(false);
                    }}
                    ignoreClick={
                      !helperIsShown || changeTypeDialogIsShown || createQuantityDialogIsShown
                    }
                  >
                    <div className={BatchQuantityHelperWrapperStyle}>
                      <Tooltip
                        message={
                          <FormattedMessage
                            id="modules.RelationalMap.changeTypeTooltipMessage"
                            defaultMessage="Choose a Type to change the New Quantity Type for all cells in this column."
                          />
                        }
                      >
                        <button
                          className={BatchQuantityHelperButtonStyle}
                          onClick={() => toggleChangeTypeDialog(true)}
                          type="button"
                        >
                          <FormattedMessage
                            id="components.button.changeType"
                            defaultMessage="CHANGE TYPE"
                          />
                        </button>
                      </Tooltip>

                      <Label align="center">
                        <FormattedMessage id="components.global.or" defaultMessage="OR" />
                      </Label>

                      <Tooltip
                        message={
                          <FormattedMessage
                            id="modules.RelationalMap.createQuantityTooltipMessage"
                            defaultMessage="Create New Quantities for all cells in this column. Note: This will also create New Quantities in previous columns if they do not yet exist."
                          />
                        }
                      >
                        <button
                          className={BatchQuantityHelperButtonStyle}
                          onClick={() => toggleCreateQuantityDialog(true)}
                          type="button"
                        >
                          <FormattedMessage id="components.button.create" defaultMessage="CREATE" />
                        </button>
                      </Tooltip>
                    </div>
                  </OutsideClickHandler>

                  <Dialog
                    isOpen={changeTypeDialogIsShown}
                    onRequestClose={() => toggleChangeTypeDialog(false)}
                    message={
                      <FormattedMessage
                        id="modules.RelationalMap.changeTypeDialogMessage"
                        defaultMessage="Choose a Type to change the New Quantity Type for all cells in this column."
                      />
                    }
                    width="400px"
                  >
                    <div className={ChangeTypeDialogWrapperStyle}>
                      <div className={ChangeTypeDialogMessageStyle}>
                        <FormattedMessage
                          id="modules.RelationalMap.changeTypeDialogMessage"
                          defaultMessage="Choose a Type to change the New Quantity Type for all cells in this column."
                        />
                      </div>

                      <div className={ChangeTypeDialogInputWrapperStyle}>
                        <InlineSelectEnumInput
                          id="batchQuantityRevisions"
                          name="batchQuantityRevisions.type"
                          value={quantityType}
                          enumType="BatchQuantityRevisionType"
                          width="200px"
                          height="30px"
                          forceHoverStyle
                          onChange={type => setQuantityType(type)}
                          onBlur={() => {}}
                        />
                      </div>

                      <GridRow>
                        <CancelButton onClick={() => toggleChangeTypeDialog(false)} />

                        <ApplyButton
                          onClick={() => {
                            emitter.emit('INLINE_CHANGE', {
                              name: 'batches.-1.batchQuantityRevisionsHeader.apply',
                              value: { index, type: quantityType },
                              hasError: false,
                            });
                            toggleChangeTypeDialog(false);
                            toggleHelperIsShown(false);
                          }}
                        />
                      </GridRow>
                    </div>
                  </Dialog>

                  <ConfirmDialog
                    isOpen={createQuantityDialogIsShown}
                    onRequestClose={() => toggleCreateQuantityDialog(false)}
                    onCancel={() => toggleCreateQuantityDialog(false)}
                    onConfirm={() => {
                      emitter.emit('INLINE_CHANGE', {
                        name: 'batches.-1.batchQuantityRevisionsHeader.create',
                        value: index,
                        hasError: false,
                      });
                      toggleCreateQuantityDialog(false);
                      toggleHelperIsShown(false);
                    }}
                    message={
                      <FormattedMessage
                        id="modules.RelationalMap.createQuantityDialogMessage"
                        defaultMessage="Are you sure you want to create New Quantities for all cells in this column? Note: This will also create New Quantities in previous columns if they do not yet exist."
                      />
                    }
                  />
                </>
              );
            }}
          </ObjectValue>
        );
      }}
    </BooleanValue>
  );
}
