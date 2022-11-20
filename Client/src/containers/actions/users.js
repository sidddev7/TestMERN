import API from "../../api";
const BASEURLUSERS = "/users";

export const getMe = async () => {
  try {
    const response = await API.get(BASEURLUSERS + "/me");
    if (response.status === 200) {
      return { data: response.data, status: true };
    }
  } catch (err) {}
};
export const login = async (body) => {
  try {
    const response = await API.post(BASEURLUSERS + "/login", body);
    if (response.status === 200) {
      return { data: response.data, status: true };
    }
  } catch (err) {}
};

export const getUsers = async () => {
  try {
    const result = await API.get(BASEURLUSERS);
    if (result.status === 200) {
      return { data: result.data, status: true };
    }
  } catch (err) {}
};
export const editUser = async (data) => {
  try {
    const result = await API.put(BASEURLUSERS + `/${data._id}`, data);
    if (result.status === 200) {
      return { message: result.data, status: true };
    } else {
      return { status: false };
    }
  } catch (err) {}
};

export const deleteUser = async (id) => {
  try {
    const res = await API.delete(BASEURLUSERS + `/${id}`);
    if (res.status === 200) {
      return { message: res.data.message, status: true };
    } else {
      return { status: false };
    }
  } catch (err) {}
};
export const createUser = async (data) => {
  try {
    const result = await API.post(BASEURLUSERS, data);
    if (result.status === 200) {
      return { message: result.data, status: true };
    } else {
      return { status: false };
    }
  } catch (err) {}
};
