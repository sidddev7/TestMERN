import API from "../../api";
const BASEURLTODO = "/todo";

export const getTodos = async () => {
  try {
    const result = await API.get(BASEURLTODO);
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
export const getAllTodos = async () => {
  try {
    const response = await API.get(BASEURLTODO + "/all");
    if (response.status === 200) {
      return { data: response.data, status: true };
    }
  } catch (err) {}
};
