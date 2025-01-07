import React from 'react';
import CommitGrid from './CommitGrid';

const App = () => {
    return (
        <div>
            <h1>Commit Grids</h1>
            <CommitGrid user="Joe" label="Joe - GoodnightHoney" />
            <CommitGrid user="Logan" label="Logan - Cards" />
        </div>
    );
};

export default App;
