import React, { useEffect, useState } from "react";
import { Card, Layout, Menu, Popover, Table, Tooltip } from "antd";
import CustomRoutes from "./customRoutes";
import { useNavigate } from "react-router";
import { getMe } from "../actions/users";
const { Header, Content, footer } = Layout;
export default function Authenticated(props) {
  const navigate = useNavigate();
  const [meData, setmeData] = useState({});
  const items1 = [
    {
      label: "Users",
      link: "/users",
      disabled: meData.role !== 1,
    },
    {
      label: "Todo",
      link: "/todo",
    },
  ];
  useEffect(() => {
    const fetchMe = async () => {
      const result = await getMe();
      if (result.status) {
        setmeData(result.data);
      }
    };
    fetchMe();
  }, []);
  return (
    <>
      <Layout>
        <Header>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
            {items1.map((item, i) => (
              <>
                <Menu.Item
                  disabled={item.disabled}
                  key={i}
                  onClick={() => navigate(item.link)}
                >
                  <Popover
                    title={
                      item.disabled
                        ? "You are not authorized for this operations"
                        : null
                    }
                  >
                    {item.label}
                  </Popover>
                </Menu.Item>
              </>
            ))}{" "}
            <Menu.Item
              disabled={meData.role !== 1}
              key={3}
              onClick={() => navigate("/all-todos")}
            >
              <Tooltip
                title={
                  meData.role !== 1
                    ? "You are not authorized for this operations"
                    : null
                }
              >
                {"View All todos"}
              </Tooltip>
            </Menu.Item>{" "}
            <Menu.Item style={{ marginLeft: "auto" }}>
              <Popover content={()=>popupContent(props)}>{meData.name}</Popover>
            </Menu.Item>
          </Menu>
        </Header>

        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            borderRadius: "15px",
          }}
        >
          {<CustomRoutes me={meData} />}
        </Content>
      </Layout>
    </>
  );
}

const popupContent = (props) => {
  return (
    <>
      <p
        style={{ cursor: "pointer" }}
        onClick={() => {
          sessionStorage.removeItem("token");
          props.setauthState(false)
        }}
      >
        Logout
      </p>
    </>
  );
};
