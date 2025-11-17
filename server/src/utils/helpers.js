// server/src/utils/helpers.js
export const responseSuccess = (res, data, message = "Success") => {
  res.status(200).json({ success: true, message, data });
};
export const responseError = (res, message = "Error", status = 500) => {
  res.status(status).json({ success: false, message });
};
