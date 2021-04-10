import React, { Component } from 'react'

const Suggestions = (props) => {
    let options;
        options = props.joinedGroupNames.map(r => (
            <li key={r.g_id}>
                {r.name}
            </li>
        ))    
    
    return <ul>{options}</ul>
}

export default Suggestions
