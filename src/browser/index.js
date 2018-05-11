import React from 'react'
import { hydrate } from 'react-dom'
import App from '../shared/App'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.scss'
hydrate(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById('app')
)