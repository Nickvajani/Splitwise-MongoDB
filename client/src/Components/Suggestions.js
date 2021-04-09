import React, { Component } from 'react'

const Suggestions = (props) => {
    let options;
    if(props.isEmail){
        options = props.results.map(r => (
            <li key={r.id}>
                {r.email}
            </li>
        ))    
    }
    else{
        options = props.results.map(r => (
            <li key={r.id}>
                {r.name}
            </li>
        ))    
    }
    return <ul>{options}</ul>
}

export default Suggestions
