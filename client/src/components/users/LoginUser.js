import React from 'react'
import { withRouter } from 'react-router-dom'
import { graphql, compose } from 'react-apollo'
import { Form, Icon, Input, Button, Checkbox, Card } from 'antd';
import { userQueries } from '../../queries/UserQueries';

const FormItem = Form.Item;

class LoginUser extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields( (err, values) => {
      if (!err) {
        this.props.authenticateUserMutation({
          variables: {
            email: values.email,
            password: values.password,
          }
        }).then( res => {
          const token = res.data.authenticateUser.token;
          localStorage.setItem('id_token', token)
          window.location.reload()
        })
      }
    });
  }

  render () {
    const { getFieldDecorator } = this.props.form;

    return (
      <Card title="Login" style={{ width: 300 }}>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
            {getFieldDecorator('email', {
              rules: [{ required: true, message: 'Please input your email!' }],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="email" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox>Remember me</Checkbox>
            )}
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
          </FormItem>
        </Form>
      </Card>
    )
  }
}

export default compose(
  graphql(userQueries.authenticate, {name: 'authenticateUserMutation'})
)(withRouter(Form.create()(LoginUser)))