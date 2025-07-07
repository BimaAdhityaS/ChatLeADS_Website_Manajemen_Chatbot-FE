// Add this helper function at the top of your component file
import React from 'react';

// src/Components/Helper/trackerFormatter.js
export const formatTextWithLineBreaks = (text) => {
    if (!text) return null;

    return text.split('\n').map((line, i, arr) => (
        <React.Fragment key={i}>
            {line}
            {i !== arr.length - 1 && <br />}
        </React.Fragment>
    ));
};