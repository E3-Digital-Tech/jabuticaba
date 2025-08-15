export function validateForm(form) {
  return Object.values(form).every((val) => val.trim() !== "");
}
