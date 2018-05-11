import React, { Component } from 'react'
import routes from './routes'
import { Route, Switch } from 'react-router-dom'


class App extends Component {
    render(){
        return(
            <Switch>
                {routes.map(({path, exact, component: C, ...rest}) => (
                    <Route 
                        key={path}
                        path={path}
                        exact={exact}
                        render={(props) => (
                            <C {...props} {...rest} />
                        )}
                    />
            ))}
        </Switch>     
        )
    }
}

export default App