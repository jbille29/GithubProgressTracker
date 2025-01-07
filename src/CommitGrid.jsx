import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css'; // Make sure to import the CSS file

const CommitGrid = ({ user, label }) => {
    const [commits, setCommits] = useState([]);

    const fetchCommits = async () => {
        const { data } = await axios.get('https://githubprogresstrackerapi.onrender.com/commits', { params: { user } });
        setCommits(data);
    };

    useEffect(() => {
        
        fetchCommits();

        // Set up an interval to fetch commits periodically
        const interval = setInterval(fetchCommits, 60000); // refresh every 60 seconds
        return () => clearInterval(interval); // Clear interval on component unmount
    }, [user]);

    const handleCommit = async () => {
        await axios.post('https://githubprogresstrackerapi.onrender.com/commit', { user });
        fetchCommits(); // Fetch commits immediately after making a commit
    };

    // Month labels and their calculations
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthPositions = {};
    let currentDate = new Date(new Date().getFullYear(), 0, 1);
    for (let i = 0; i < 12; i++) {
        const week = Math.floor((currentDate - new Date(currentDate.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));
        monthPositions[months[i]] = week + 1;
        currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return (
        <div>
            <div className="commit-label">{label}</div>
            <button onClick={handleCommit} style={{ margin: '10px' }}>Commit 25 Minutes of Work</button>
            <p className="commit-explanation">
                Each commit represents 25 minutes of focused work.
            </p>
            <div className="grid-container">
                <div></div> {/* Empty corner cell */}
                {months.map((month, index) => (
                    <div key={month} className="grid-header" style={{ gridColumnStart: monthPositions[month], gridColumnEnd: monthPositions[month] }}>
                        {month}
                    </div>
                ))}
                {Array.from({ length: 7 }).map((_, day) => (
                    <div key={day} className="grid-header" style={{ gridRowStart: day + 2 }}>
                        {day === 1 ? 'M' : day === 3 ? 'W' : day === 5 ? 'F' : ''}
                    </div>
                ))}
                {Array.from({ length: 365 }).map((_, index) => {
                    const date = new Date(new Date().getFullYear(), 0, index);
                    const day = date.getDay();
                    const week = Math.floor(index / 7);
                    const commitData = commits.find(c => new Date(c.date).setHours(0, 0, 0, 0) === date.setHours(0, 0, 0, 0));
                    const commitCount = commitData ? commitData.commits : 0;
                    const opacity = commitCount ? Math.min(commitCount / 10 + 0.1, 1) : 0.1; // Ensures a visible difference
                    const backgroundColor = commitCount ? `rgba(0, 128, 0, ${opacity})` : `rgba(128, 128, 128, 0.1)`; // Gray if no commits
                    return (
                        <div key={index} className="grid-cell" style={{
                            gridRow: day + 2,
                            gridColumn: week + 2,
                            backgroundColor
                        }}></div>
                    );
                })}
            </div>
        </div>
    );
};

export default CommitGrid;
