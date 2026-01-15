//mock database
let messages = [
  {
    id: 1,
    text: "hello welcome to real chat application bootcamp",
    user: "Moses",
    timestamp: new Date().toISOString(),
  },
  {
    id: 2,
    text: "welcome to real chat application bootcamp",
    user: "Fadhili",
    timestamp: new Date().toISOString(),
  },
];

//Get all messages
const getMessages = (req, res) => {
  try {
    res.json({
      sucess: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "server Error",
      error: error.message,
    });
  }
};

//post the messsages

const createMessages = (req, res) => {
  try {
    const { text, user } = req.body;

    //validation
    if (!text || !user) {
      return res.status(400).json({
        success: false,
        message: "please provide text for the message",
      });
    }

    //if validation is given

    const newMessage = {
      id: messages.length + 1,
      text,
      user,
      timestamp: new Date().toISOString(),
    };
    messages.push(newMessage);
    res.status(201).json({
      success: true,
      message: "Message created",
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({
      sucess: false,
      message: "Internal server Error",
      error: error.message,
    });
  }
};

//Delete Messages
const deleteAllMessages = (req, res) => {
  try {
    messages = [];
    res.json({
      sucess: true,
      message: "All messages Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

//Adding new messages
const addMessage = (messageData) => {
  const newMessage = {
    id: messages.length + 1,
    text: messageData.text,
    user: messageData.user,
    timestamp: new Date().toISOString(),
  };
  messages.push(newMessage);
  return newMessage;
};

module.exports = {
  getMessages,
  createMessages,
  deleteAllMessages,
  addMessage,
};
