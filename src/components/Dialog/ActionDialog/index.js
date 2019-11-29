// @flow
import * as React from 'react';
import { CancelButton } from 'components/Buttons';
import Dialog from 'components/Dialog';
import LoadingIcon from 'components/LoadingIcon';
import { Label } from 'components/Form';
import LabelIcon from './LabelIcon';
import BatchesLabelIcon from './LabelIcon/BatchesLabelIcon';
import BatchLabelIcon from './LabelIcon/BatchLabelIcon';
import ContainerLabelIcon from './LabelIcon/ContainerLabelIcon';
import ContainersLabelIcon from './LabelIcon/ContainersLabelIcon';
import EndProductLabelIcon from './LabelIcon/EndProductLabelIcon';
import EndProductsLabelIcon from './LabelIcon/EndProductsLabelIcon';
import ItemLabelIcon from './LabelIcon/ItemLabelIcon';
import ItemsLabelIcon from './LabelIcon/ItemsLabelIcon';
import OrderLabelIcon from './LabelIcon/OrderLabelIcon';
import OrdersLabelIcon from './LabelIcon/OrdersLabelIcon';
import ShipmentLabelIcon from './LabelIcon/ShipmentLabelIcon';
import ShipmentsLabelIcon from './LabelIcon/ShipmentsLabelIcon';
import TagLabelIcon from './LabelIcon/TagLabelIcon';
import TagsLabelIcon from './LabelIcon/TagsLabelIcon';
import {
  ActionDialogWrapperStyle,
  DialogMessageStyle,
  DialogSubMessageStyle,
  ButtonsWrapperStyle,
} from './style';

type Props = {
  isOpen: boolean,
  isProcessing?: boolean,
  onCancel?: Function,
  title: React.Node,
  dialogMessage: React.Node,
  dialogSubMessage?: React.Node,
  buttons?: React.Node,
  children?: React.Node,
};

export default function ActionDialog({
  isOpen,
  isProcessing,
  onCancel,
  title,
  dialogMessage,
  dialogSubMessage,
  buttons,
  children,
}: Props) {
  return (
    <Dialog
      isOpen={isOpen}
      onRequestClose={isProcessing ? () => {} : onCancel}
      showCancelButton={!isProcessing}
      onCancel={onCancel}
      width="min-content"
    >
      {isOpen && (
        <div className={ActionDialogWrapperStyle}>
          <Label height="30px" align="center">
            {title}
          </Label>

          {dialogMessage && <div className={DialogMessageStyle}>{dialogMessage}</div>}

          {dialogSubMessage && <div className={DialogSubMessageStyle}>{dialogSubMessage}</div>}

          {isProcessing ? (
            <LoadingIcon />
          ) : (
            <>
              {children}
              <div className={ButtonsWrapperStyle}>
                <CancelButton onClick={onCancel} />
                {buttons}
              </div>
            </>
          )}
        </div>
      )}
    </Dialog>
  );
}

export {
  LabelIcon,
  BatchesLabelIcon,
  BatchLabelIcon,
  ContainerLabelIcon,
  ContainersLabelIcon,
  EndProductLabelIcon,
  EndProductsLabelIcon,
  ItemLabelIcon,
  ItemsLabelIcon,
  OrderLabelIcon,
  OrdersLabelIcon,
  ShipmentLabelIcon,
  ShipmentsLabelIcon,
  TagLabelIcon,
  TagsLabelIcon,
};
