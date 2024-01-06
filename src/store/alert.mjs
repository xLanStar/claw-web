import { reactive } from "vue";

export const alertState = reactive([]);

export const removeAlert = (alert) => {
  const index = alertState.indexOf(alert);
  if (index < 0) return;
  clearTimeout(alertState[index].timeout);
  alertState.splice(index, 1);
};

export const showAlert = (type, message, duration = 5000) => {
  const alert = {
    type,
    message,
    duration,
    timeout: setTimeout(() => removeAlert(alert), duration),
  };
  alertState.push(alert);
};
