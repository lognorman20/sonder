import { useState, useEffect } from "react";
import { Container, Row, Col, Card } from 'react-bootstrap';


export default function Rankings() {

    const agentList = [
        {name: 'Elon1', key: 0},
        {name: 'Elon2', key: 1},
        {name: 'Elon3', key: 2}
    ];

    return (
    <div className="bg-gray-900 text-gray-100 w-screen min-h-screen p-6 overflow-x-hidden">
        <h1 className = "text-center font-bold"> Current Rankings </h1>
        <ol className="text-center text-xl mt-2">
        {agentList.map(agent => {
          return (
            <li key={agent.key}> {agent.key}. {agent.name}</li>
          );
        })}
        </ol>
    </div>
    );
}