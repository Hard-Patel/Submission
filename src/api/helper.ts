import client from "./index";
import { CancelToken } from "apisauce";

const cancelRequestList = {};

const cancelRequests = (...keys) => {
  keys.forEach((key) => {
    if (cancelRequestList[key]) {
      cancelRequestList[key]();
    }
  });
};

const getErrorMessage = (response: any) => {
  let errorMessage = response.problem || response.data?.message;
  if (errorMessage === "NETWORK_ERROR") {
    errorMessage = "Network error";
  } else if (errorMessage === "TIMEOUT_ERROR") {
    errorMessage = "Something went wrong. Please try again later";
  } else if (errorMessage === "SERVER_ERROR") {
    errorMessage = "Server error";
  } else if (errorMessage === "UNKNOWN_ERROR") {
    errorMessage = "Something went wrong";
  }
  return errorMessage;
};

var counter = 0;

const successStatusCodes = [200, 201, 202, 203, 204, 205, 206];

const processResponse = async (response: any) => {
  const status = successStatusCodes.includes(response.status);
  const data = response.data || {
    status: status,
    message: getErrorMessage(response),
  };

  return {
    ...data,
    status,
    cancel: response.problem === "CANCEL_ERROR",
    statusCode: response.status,
  };
};

const get = async (data: any) => {
  const { url, headers } = data;
  var res = await client.get(url);
  var response = await processResponse(res);
  if (response?.data?.tag == "INVALID_TOKEN") {
    res = await client.get(url);
    return res;
  } else {
    return await processResponse(res);
  }
};

const put = async (data: any) => {
  const { url, cancelKey, params, headers } = data;
  const res = await client.put(url, params, {
    cancelToken: new CancelToken((c) => (cancelRequestList[cancelKey] = c)),
    headers,
  });
  return await processResponse(res);
};

const post = async (req: any) => {
  const { url, data, headers } = req;
  const res = await client.post(`${url}`, data, {
    headers: headers,
    validateStatus: function (status) {
      return status <= 500; // Resolve only if the status code is less than 500
    },
  });
  return await processResponse(res);
};

const patch = async (req: any) => {
  const { url, cancelKey, data, headers } = req;
  const res = await client.patch(`${url}`, data, { headers: headers });
  return await processResponse(res);
};

const del = async (data: any) => {
  const { url, cancelKey, params, data: reqData, headers } = data;
  const res = await client.delete(url, params, {
    cancelToken: new CancelToken((c) => (cancelRequestList[cancelKey] = c)),
    headers,
    data: reqData,
  });
  return await processResponse(res);
};

export { cancelRequests, get, put, post, del, patch };
