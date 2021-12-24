// SPDX-License-Identifier: MIT
pragma solidity >= 0.5.0;

struct Task {
    uint id;
    string content;
    bool completed;
}

contract TodoList {
    uint public taskCount = 0;
    mapping(uint => Task) public tasks;

    event TaskCreated(
        uint id,
        string content,
        bool completed
    );

    constructor() {
        createTask("Check out pacheco.io");
    }

    function createTask(string memory _content) public {
        taskCount ++;
        tasks[taskCount] = Task(taskCount, _content, false);
        emit TaskCreated(taskCount, _content, false);
    }

    function changeCompleted(uint _id) public {
        tasks[_id].completed = !tasks[_id].completed;
    }
}