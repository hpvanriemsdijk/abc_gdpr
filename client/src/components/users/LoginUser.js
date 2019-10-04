import React from 'react';
import { useMutation } from 'react-apollo';
import { AUTHENTICATE_USER } from '../../queries/UserQueries';
import { Form, Icon, Input, Button, Card, Spin } from 'antd';

export default function LoginUser() {
  const [authenticateUser, { loading }] = useMutation(
    AUTHENTICATE_USER,
    {
      onCompleted({ authenticateUser }) {   
        console.log(authenticateUser);
        const token = authenticateUser.token;
        localStorage.setItem('id_token', token)
        window.location.reload();
      }    
    }
  );

  if (loading) return <Spin />;
  return <WrappedLoginForm login={authenticateUser} />;
}

class LoginForm extends React.Component {
  onSubmit = event => {
    event.preventDefault();
    this.props.form.validateFields( (err, values) => {
      if (!err) {
        this.props.login({
          variables: {
            email: values.email,
            password: values.password,
          }
        })
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Card title="Login" style={{ width: 300 }}>
        <Form onSubmit={this.onSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator('email', {
              rules: [{ required: true, message: 'Please input your email!' }],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="email" />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    )
  }
}

const WrappedLoginForm = Form.create()(LoginForm);