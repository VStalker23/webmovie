import React, { Component } from 'react'
import { NavLink, Navigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { movieApi } from '../misc/MovieApi'
import { parseJwt, getSocialLoginUrl, handleLogError } from '../misc/Helpers'
import { Button, Form, Grid, Icon, Segment, Menu, Message, Divider, Header } from 'semantic-ui-react'
import "../styles/settings.css"
import "../styles/login.css"

class Login extends Component {
  static contextType = AuthContext

  state = {
    username: '',
    password: '',
    isLoggedIn: false,
    isError: false
  }

  componentDidMount() {
    const Auth = this.context
    const isLoggedIn = Auth.userIsAuthenticated()
    this.setState({ isLoggedIn })
  }

  handleInputChange = (e, { name, value }) => {
    this.setState({ [name]: value })
  }



  handleSubmit = (e) => {
    e.preventDefault()

    const { username, password } = this.state
    if (!(username && password)) {
      this.setState({ isError: true })
      return
    }

    movieApi.authenticate(username, password)
      .then(response => {
        const { accessToken } = response.data
        const data = parseJwt(accessToken)
        const user = { data, accessToken }

        const Auth = this.context
        Auth.userLogin(user)

        this.setState({
          username: '',
          password: '',
          isLoggedIn: true,
          isError: false
        })
      })
      .catch(error => {
        handleLogError(error)
        this.setState({ isError: true })
      })
  }

  render() {
    const { isLoggedIn, isError } = this.state
    if (isLoggedIn) {
      return <Navigate to={'/'} />
    } else {
      return (
        <>

          <Grid className="me-auto  p-5 mb-4 view" textAlign="center" >
            <Grid.Column style={{ maxWidth: 450 }}>
              <Form size='large' onSubmit={this.handleSubmit} autoComplete="off">
                <Segment>
                  <Header as='h2' color='teal' textAlign='center'>
                    Log-in to your account
                  </Header>
                  <Form.Input
                    fluid
                    autoFocus
                    name='username'
                    icon='user'
                    iconPosition='left'
                    placeholder='Username'
                    onChange={this.handleInputChange}
                  />
                  <Form.Input
                    fluid
                    name='password'
                    icon='lock'
                    iconPosition='left'
                    placeholder='Password'
                    type='password'
                    onChange={this.handleInputChange}
                  />
                  <Button color='purple' fluid size='large'>Login</Button>
                </Segment>
              </Form>
              <Message>{`Don't have already an account? `}
                <a href='/signup' color='purple' as={NavLink} to="/signup">Sign Up</a>
              </Message>
              {isError && <Message negative>The username or password provided are incorrect!</Message>}

              <Divider horizontal>or connect with</Divider>

              <Menu compact icon='labeled'>
                <Menu.Item name='github' href={getSocialLoginUrl('github')}>
                  <Icon name='github' />Github
                </Menu.Item>
                <Menu.Item name='facebook'>
                  <Icon name='facebook' disabled />Facebook
                </Menu.Item>
                <Menu.Item name='twitter'>
                  <Icon name='twitter' disabled />Twitter
                </Menu.Item>
                <Menu.Item name='instagram'>
                  <Icon name='instagram' disabled />Instagram
                </Menu.Item>
              </Menu>
            </Grid.Column>
          </Grid>
        </>

      )
    }
  }
}

export default Login