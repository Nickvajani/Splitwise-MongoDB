import React, { Component } from 'react'

const Suggestions = (props) => {
    let options;
    if(props.isPersonName){
        options = props.settlePersonResults.map(r => (
            <li key={r.payer_id}>
                {r.name}
            </li>
        ))
    }
    else{
        
        options = props.settleGroupNameResults.map(r => (
            <li key={r.g_id}>
                {r.name}
            </li>
        ))    
    }
    
    return <ul>{options}</ul>
}

export default Suggestions
