import API from "../../api";
const BASEURLTODO = "/todo";

export const getTodos = async (params) => {
  try {
    const result = await API.get(BASEURLTODO, { params: params });
    if (result.status === 200) {
      return { data: result.data, status: true };
    }
  } catch (err) {}
};
export const edittodo = async (data) => {
  try {
    const result = await API.put(BASEURLTODO + `/${data._id}`, data);
    if (result.status === 200) {
      return { message: result.data, status: true };
    } else {
      return { status: false };
    }
  } catch (err) {}
};

export const deleteTodo = async (id) => {
  try {
    const res = await API.delete(BASEURLTODO + `/${id}`);
    if (res.status === 200) {
      return { message: res.data.message, status: true };
    } else {
      return { status: false };
    }
  } catch (err) {}
};
export const createtodo = async (data) => {
  try {
    const result = await API.post(BASEURLTODO, data);
    if (result.status === 200) {
      return { message: result.data, status: true };
    } else {
      return { status: false };
    }
  } catch (err) {}
};
export const getAllTodos = async (params) => {
  try {
    const response = await API.get(BASEURLTODO + "/all", { params: params });
    if (response.status === 200) {
      return { data: response.data, status: true };
    }
  } catch (err) {}
};
