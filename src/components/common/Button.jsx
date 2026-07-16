import React from 'react';
import { useState } from 'react';
import "./Button.css";


export default function Button({value, onClick}){
   
    return (
        <div className="btn-container">
                <button
                    type="button"
                    className="btn"
                    onClick={onClick}>
                        {value}
                </button>
        </div>
    );
}