import {Dialog, DialogProps} from './index'
import {Button} from '@radix-ui/themes'

interface Props extends DialogProps {
  onCancel?: ()=> void
  onConfirm?: ()=> void
}

export const AlertDialog = ({onCancel, onConfirm, children, ...rest}: Props) => {
  const handleCancel=(e: any)=> {
    (onCancel || rest.onClose)?.(e)
  }

  return (
    <Dialog
      {...rest}
      onClose={handleCancel}
      actions={
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="solid" color="indigo" onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      }
    >
      {children}
    </Dialog>
  );
};
