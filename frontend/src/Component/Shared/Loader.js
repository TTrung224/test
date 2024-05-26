import React from 'react';
import '../componentStyle.css';

export default function Loader(){
    return(
        <div id='loader-container'>
            <div className="text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    )
}