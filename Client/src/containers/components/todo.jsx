import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Input, Select, Form, Switch } from "antd";
import NotificationMessage from "./common/notificationMessage";
import { createtodo, deleteTodo, edittodo, getTodos } from "../actions/todo";

export default function todos(props) {
  const [data, setdata] = useState([]);
  const [misc, setmisc] = useState({
    todoModalVisible: false,
    todoData: {},
  });
  async function fetchData() {
    const response = await getTodos();
    setdata(response.data.todos);
  }
  useEffect(() => {
    fetchData();
  }, []);
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      fixed: "right",
      width: "20%",
      render: (record, index) => {
        return (
          <>
            <Button
              onClick={() =>
                setmisc({ ...misc, todoModalVisible: true, todoData: record })
              }
              style={{ marginRight: "0.5em" }}
            >
              Edit
            </Button>
            <Button
              onClick={() =>
                setmisc({ ...misc, deleteModal: true, id: record._id })
              }
            >
              Delete
            </Button>
          </>
        );
      },
    },
  ];
  return (
    <>
      {props.me.role === 1 && (
        <div style={{ width: "100%", textAlign: "right", marginBottom: "1em" }}>
          <Button
            onClick={() =>
              setmisc({ ...misc, todoModalVisible: true, todoData: {} })
            }
            style={{ rigth: "0" }}
          >
            Add new todo
          </Button>
        </div>
      )}
      <Table columns={columns} dataSource={data} />
      <TodoModal data={misc} setData={setmisc} refreshtodos={fetchData} />
      <DeleteModal
        data={misc}
        setData={setmisc}
        refreshtodos={fetchData}
      ></DeleteModal>
    </>
  );
}

const TodoModal = ({ data, setData, refreshtodos }) => {
  try {
    const [formData, setformData] = useState({});
    const [form] = Form.useForm();
    useEffect(() => {
      if (data?.todoData?._id) {
        form.setFieldValue({
          name: data.todoData.name,
          email: data.todoData.email,
          role: data.todoData.role,
        });
        setformData({ ...data.todoData });
      } else {
        form.resetFields();
        setformData({});
      }
    }, [data.todoData]);
    const handleSave = async () => {
      try {
        if (data?.todoData?._id) {
          const result = await edittodo(formData);
          if (result.status) {
            setData({ ...data, todoModalVisible: false, todoData: {} });
            NotificationMessage("success", result.message.message);
            await refreshtodos();
          } else {
          }
        } else {
          const result = await createtodo(formData);
          if (result.status) {
            setData({ ...data, todoModalVisible: false, todoData: {} });
            NotificationMessage("success", result.message.message);
            await refreshtodos();
          }
        }
      } catch (err) {}
    };
    return (
      <>
        <Modal
          open={data.todoModalVisible}
          onCancel={() =>
            setData({ ...data, todoModalVisible: false, todoData: {} })
          }
          onOk={form.submit}
          okText={data.todoData._id ? "Edit Todo" : "Add Todo"}
          title={data.todoData._id ? "Edit Todo" : "Add Todo"}
        >
          <Form form={form} onFinish={handleSave}>
            <Input
              value={formData && formData.name}
              onChange={(e) =>
                setformData({ ...formData, name: e.target.value })
              }
              className="inputs"
              placeholder="Enter Todo name"
            ></Input>
            <label>Status:</label>{" "}
            <Switch
              checked={formData && formData.status === "active" ? true : false}
              onChange={(value) =>
                setformData({
                  ...formData,
                  status: value ? "active" : "inactive",
                })
              }
            />
          </Form>
        </Modal>
      </>
    );
  } catch (err) {
    console.log(err);
  }
};

const DeleteModal = ({ data, setData, refreshtodos }) => {
  try {
    const handleDelete = async () => {
      try {
        const result = await deleteTodo(data.id);
        if (result.status) {
          setData({ ...data, deleteModal: false });
          NotificationMessage("success", result.message);
          refreshtodos();
        }
      } catch (err) {}
    };
    return (
      <Modal
        open={data.deleteModal}
        onCancel={() => setData({ ...data, deleteModal: false })}
        okText="Delete"
        onOk={handleDelete}
      >
        Are you sure you want to delete this todo?
      </Modal>
    );
  } catch (err) {}
};
