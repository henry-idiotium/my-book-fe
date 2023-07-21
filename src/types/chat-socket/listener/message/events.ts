/** Notify other clients that a user has seen a message. */
export const READ_RECEIPT = 'message_read_receipt';
/** Notify other clients a new message is sent. */
export const RECEIVE = 'message_receive';
/** To notify clients that a message has been updated. */
export const UPDATE_NOTIFY = 'message_update_notify';
/** Notify clients that a message has been deleted. */
export const DELETE_NOTIFY = 'message_delete_notify';

/** When a message is successfully sent. @deprecated replaced by ack */
export const SEND_SUCCESS = 'message_send_success';
/** When a message is failed to sent. @deprecated replaced by exception */
export const SEND_FAILURE = 'message_send_failure';
/** When a message is failed to update. @deprecated replaced by exception */
export const UPDATE_FAILURE = 'message_update_failure';
/** When a message is failed to delete. @deprecated replaced by exception */
export const DELETE_FAILURE = 'message_delete_failure';
