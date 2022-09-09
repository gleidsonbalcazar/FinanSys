export interface ModalConfig {
  modalTitle: string
  dismissButtonLabel?: string
  closeButtonLabel?: string
  saveButtonLabel?: string
  shouldClose?(): Promise<boolean> | boolean
  shouldDismiss?(): Promise<boolean> | boolean
  shouldSave?(): Promise<boolean> | boolean
  onClose?(): Promise<boolean> | boolean
  onDismiss?(): Promise<boolean> | boolean
  onSave?(): Promise<boolean> | boolean
  disableCloseButton?(): boolean
  disableDismissButton?(): boolean
  disableSaveButton?(): boolean
  hideCloseButton?(): boolean
  hideDismissButton?(): boolean
  hideSaveButton?(): boolean
  showConfirmation?:boolean
}

