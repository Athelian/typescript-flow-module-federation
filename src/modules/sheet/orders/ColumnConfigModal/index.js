// @flow
import * as React from 'react';
import Dialog from 'components/Dialog';
import Icon from 'components/Icon';
import { SaveButton, ResetButton, BaseButton } from 'components/Buttons';
import {
  ColumnConfigModalWrapperStyle,
  EntityBlocksWrapperStyle,
  EntityBlockWrapperStyle,
  ColorStripStyle,
  IconAndButtonsWrapperStyle,
  EntityIconStyle,
  FieldsWrapperStyle,
  DummyColumnsPlaceholderStyle,
  SaveResetWrapperStyle,
  GroupDefaultWrapperStyle,
} from './style';

const Block = ({ entity }: { entity: string }) => {
  return (
    <div className={EntityBlockWrapperStyle}>
      <div className={ColorStripStyle(entity)} />

      <div className={IconAndButtonsWrapperStyle}>
        <div className={EntityIconStyle(entity)}>
          <Icon icon={entity} />
        </div>

        <div className={GroupDefaultWrapperStyle}>
          <BaseButton
            label="GROUP"
            // icon="ORDER"
            textColor="TEAL"
            hoverTextColor="WHITE"
            backgroundColor="GRAY_SUPER_LIGHT"
            hoverBackgroundColor="TEAL"
          />
          <BaseButton
            label="DEFAULT"
            // icon="ORDER"
            textColor="GRAY_DARK"
            hoverTextColor="WHITE"
            backgroundColor="GRAY_SUPER_LIGHT"
            hoverBackgroundColor="GRAY_LIGHT"
          />
        </div>
      </div>

      <div className={FieldsWrapperStyle}>
        <div className={DummyColumnsPlaceholderStyle} />
      </div>
    </div>
  );
};

const ColumnConfigModal = () => {
  const [isColumnConfigModalOpen, setColumnConfigModalOpen] = React.useState(false);

  return (
    <>
      <button onClick={() => setColumnConfigModalOpen(true)} type="button">
        config
      </button>
      <Dialog
        isOpen={isColumnConfigModalOpen}
        onRequestClose={() => setColumnConfigModalOpen(false)}
      >
        <div className={ColumnConfigModalWrapperStyle}>
          <div className={EntityBlocksWrapperStyle}>
            <Block entity="ORDER" />
            <Block entity="ORDER_ITEM" />
            <Block entity="BATCH" />
            <Block entity="CONTAINER" />
            <Block entity="SHIPMENT" />
          </div>

          <div>
            <div className={SaveResetWrapperStyle}>
              <SaveButton />
              <ResetButton />
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ColumnConfigModal;
