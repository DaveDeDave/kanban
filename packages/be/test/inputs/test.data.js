const data = {
  user: [
    {
      _id: "638cc51c245edcb714841181",
      email: "test@test.it",
      password: "$2a$10$uy/s.pVavzI01Qm9HVZnvueTPXgQUBtuk8LRz5kMMGs.y5/IVdOQO" // Password12.
    },
    {
      _id: "638ccbee03a8ef059bc63554",
      email: "test2@test.it",
      password: "$2a$10$uy/s.pVavzI01Qm9HVZnvueTPXgQUBtuk8LRz5kMMGs.y5/IVdOQO"
    }
  ],
  board: [
    {
      _id: "638ccbee03a8ef059bc63555",
      ownerId: "638cc51c245edcb714841181",
      name: "Board 1"
    },
    {
      _id: "638ccbee03a8ef059bc63556",
      ownerId: "638cc51c245edcb714841181",
      name: "Board 2"
    },
    {
      _id: "638ccbee03a8ef059bc63557",
      ownerId: "638ccbee03a8ef059bc63554",
      name: "Board 3"
    }
  ],
  column: [
    {
      _id: "638ccbee03a8ef059bc63558",
      ownerId: "638cc51c245edcb714841181",
      boardId: "638ccbee03a8ef059bc63555",
      name: "Column 1",
      color: "#ffffff"
    },
    {
      _id: "638ccbee03a8ef059bc63559",
      ownerId: "638cc51c245edcb714841181",
      boardId: "638ccbee03a8ef059bc63555",
      name: "Column 2",
      color: "#ffffff"
    },
    {
      _id: "638ccbee03a8ef059bc63560",
      ownerId: "638ccbee03a8ef059bc63554",
      boardId: "638ccbee03a8ef059bc63556",
      name: "Column 3",
      color: "#ffffff"
    }
  ],
  task: [
    {
      _id: "638ccbee03a8ef059bc63561",
      ownerId: "638cc51c245edcb714841181",
      boardId: "638ccbee03a8ef059bc63555",
      columnId: "638ccbee03a8ef059bc63558",
      title: "Task 1",
      description: "Task 1 description",
      status: "TODO"
    },
    {
      _id: "638ccbee03a8ef059bc63562",
      ownerId: "638cc51c245edcb714841181",
      boardId: "638ccbee03a8ef059bc63555",
      columnId: "638ccbee03a8ef059bc63558",
      title: "Task 2",
      description: "Task 2 description",
      status: "DOING"
    },
    {
      _id: "638ccbee03a8ef059bc63563",
      ownerId: "638ccbee03a8ef059bc63554",
      boardId: "638ccbee03a8ef059bc63556",
      columnId: "638ccbee03a8ef059bc63560",
      title: "Task 3",
      description: "Task 3 description",
      status: "COMPLETED"
    }
  ],
  subtask: [
    {
      _id: "638ccbee03a8ef059bc63564",
      ownerId: "638cc51c245edcb714841181",
      boardId: "638ccbee03a8ef059bc63555",
      columnId: "638ccbee03a8ef059bc63558",
      taskId: "638ccbee03a8ef059bc63561",
      description: "Subtask 1 description",
      completed: false
    },
    {
      _id: "638ccbee03a8ef059bc63565",
      ownerId: "638cc51c245edcb714841181",
      boardId: "638ccbee03a8ef059bc63555",
      columnId: "638ccbee03a8ef059bc63558",
      taskId: "638ccbee03a8ef059bc63561",
      description: "Subtask 2 description",
      completed: true
    },
    {
      _id: "638ccbee03a8ef059bc63566",
      ownerId: "638ccbee03a8ef059bc63554",
      boardId: "638ccbee03a8ef059bc63556",
      columnId: "638ccbee03a8ef059bc63560",
      taskId: "638ccbee03a8ef059bc63563",
      description: "Subtask 3 description",
      completed: true
    }
  ]
};

const token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjJvSzBPSzV1SWFwWHVOTEZyZEZqTUJnbFFoM1VuWWZnOVpOYWYwU3g4NFUifQ.eyJlbWFpbCI6InRlc3RAdGVzdC5pdCIsIl9pZCI6IjYzOGNjNTFjMjQ1ZWRjYjcxNDg0MTE4MSJ9.jUp4jlAeWiasWpd2gTaH5qhcl7ovNqjF20ZEozBZuZl_iNFsawxRF87iC7Sr8yUcVEf-Ffc0Tbx1iDYEmFnarV1bZ9QwbONrgtO91tga1noEC2hRu5bNkQahUGv6SXdC10tyCW5tE5UCn9bzRWJXhhHWsFcVJox3zvWCGJNWUaeMUKniNLuwGdNWVwnaVT_M0vI2zLCDR2VtYC7B0zFEq7SXniqb6K4wcWyMHXylWElbeWXO5Jss1nmjxfKpEOwRRTKK1Q-GRKrTD7BLHaqHRLAKc20_qDDOeTNsPgl8Hg7z0Lk4qN3wbV2_gXl29l19uz6oOd7YxXjPBEf9DGCODg";

export { data, token };
