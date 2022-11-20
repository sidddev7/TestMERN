import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Input, Select, Form } from "antd";
import { createUser, deleteUser, editUser, getUsers } from "../actions/users";
import NotificationMessage from "./common/notificationMessage";

export default function Users(props) {
  const [data, setdata] = useState([]);
  const [misc, setmisc] = useState({
    userModalvisible: false,
    userData: {},
  });
  async function fetchData() {
    const response = await getUsers();
    setdata(response.data.data);
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
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
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
                setmisc({ ...misc, userModalvisible: true, userData: record })
              }
              style={{ marginRight: "0.5em" }}
            >
              Edit
            </Button>
            <Button
              disabled={
                props.me.role === 1
                  ? props.me.id === record._id
                    ? true
                    : false
                  : props.me.id !== record._id
              }
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
              setmisc({ ...misc, userModalvisible: true, userData: {} })
            }
            style={{ rigth: "0" }}
          >
            Add new User
          </Button>
        </div>
      )}
      <Table columns={columns} dataSource={data} />
      <UserModal data={misc} setData={setmisc} refreshUsers={fetchData} />
      <DeleteModal
        data={misc}
        setData={setmisc}
        refreshUsers={fetchData}
      ></DeleteModal>
    </>
  );
}

const UserModal = ({ data, setData, refreshUsers }) => {
  try {
    const [formData, setformData] = useState({});
    const [form] = Form.useForm();
    useEffect(() => {
      if (data?.userData?._id) {
        form.setFieldValue({
          name: data.userData.name,
          email: data.userData.email,
          role: data.userData.role,
        });
        setformData({ ...data.userData });
      } else {
        form.resetFields();
        setformData({});
      }
    }, [data.userData]);
    const handleSave = async () => {
      try {
        if (data?.userData?._id) {
          const result = await editUser(formData);
          if (result.status) {
            setData({ ...data, userModalvisible: false, userData: {} });
            NotificationMessage("success", result.message.message);
            await refreshUsers();
          } else {
          }
        } else {
          const result = await createUser(formData);
          if (result.status) {
            setData({ ...data, userModalvisible: false, userData: {} });
            NotificationMessage("success", result.message.message);
            await refreshUsers();
          }
        }
      } catch (err) {}
    };
    return (
      <>
        <Modal
          open={data.userModalvisible}
          onCancel={() =>
            setData({ ...data, userModalvisible: false, userData: {} })
          }
          okText={data.userData._id ? "Edit user" : "Add User"}
          title={data.userData._id ? "Edit user" : "Add User"}
          onOk={() => form.submit()}
        >
          <Form form={form} onFinish={(data) => handleSave(data)}>
            <Input
              value={formData && formData.name}
              name="name"
              className="inputs"
              placeholder="Enter user name"
              onChange={(e) =>
                setformData({ ...formData, name: e.target.value })
              }
            ></Input>
            <Input
              value={formData && formData.email}
              name="email"
              className="inputs"
              placeholder="Enter user email"
              onChange={(e) =>
                setformData({ ...formData, email: e.target.value })
              }
            ></Input>
            {!data?.userData?._id && (
              <Input.Password
                placeholder="Enter password"
                className="inputs"
                onChange={(e) =>
                  setformData({ ...formData, password: e.target.value })
                }
              ></Input.Password>
            )}
            <Select
              placeholder="Select Role"
              value={formData && formData.role}
              name="role"
              style={{ width: "470px" }}
              onSelect={(value) => setformData({ ...formData, role: value })}
            >
              <Select.Option key={1} value={"Admin"}>
                Admin
              </Select.Option>
              <Select.Option key={2} value={"user"}>
                User
              </Select.Option>
            </Select>
          </Form>
        </Modal>
      </>
    );
  } catch (err) {
    console.log(err);
  }
};

const DeleteModal = ({ data, setData, refreshUsers }) => {
  try {
    const handleDelete = async () => {
      try {
        const result = await deleteUser(data.id);
        if (result.status) {
          setData({ ...data, deleteModal: false });
          NotificationMessage("success", result.message);
          refreshUsers();
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
        Are you sure you want to delete this user?
      </Modal>
    );
  } catch (err) {}
};
