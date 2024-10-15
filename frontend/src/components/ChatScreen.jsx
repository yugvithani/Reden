const ChatScreen = () => {
    return (
        <>
        <div className="flex-1 flex flex-col bg-gray-900">
        {/* Chat Header */}
        <div className="flex justify-between items-center p-4 bg-black border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <img
              src="https://via.placeholder.com/40"
              alt="receiver"
              className="w-10 h-10 rounded-full"
            />
            <h2 className="text-xl font-semibold">Archit Kandu</h2>
          </div>
          <button className="text-gray-300 hover:text-white transition duration-300">
            👤
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-800">
          <div className="flex flex-col space-y-4">
            {/* Received Messages */}
            <div className="flex justify-start items-start space-x-2">
              <div className="bg-gray-700 p-3 rounded-lg max-w-xs text-sm text-gray-200">
                <p>How are you?</p>
              </div>
            </div>

            <div className="flex justify-start items-start space-x-2">
              <div className="bg-gray-700 p-3 rounded-lg max-w-xs text-sm text-gray-200">
                <p>How are you?</p>
              </div>
            </div><div className="flex justify-start items-start space-x-2">
              <div className="bg-gray-700 p-3 rounded-lg max-w-xs text-sm text-gray-200">
                <p>How are you?</p>
              </div>
            </div><div className="flex justify-start items-start space-x-2">
              <div className="bg-gray-700 p-3 rounded-lg max-w-xs text-sm text-gray-200">
                <p>How are you?</p>
              </div>
            </div><div className="flex justify-start items-start space-x-2">
              <div className="bg-gray-700 p-3 rounded-lg max-w-xs text-sm text-gray-200">
                <p>How are you?</p>
              </div>
            </div><div className="flex justify-start items-start space-x-2">
              <div className="bg-gray-700 p-3 rounded-lg max-w-xs text-sm text-gray-200">
                <p>How are you?</p>
              </div>
            </div><div className="flex justify-start items-start space-x-2">
              <div className="bg-gray-700 p-3 rounded-lg max-w-xs text-sm text-gray-200">
                <p>How are you?</p>
              </div>
            </div><div className="flex justify-start items-start space-x-2">
              <div className="bg-gray-700 p-3 rounded-lg max-w-xs text-sm text-gray-200">
                <p>How are you?</p>
              </div>
            </div><div className="flex justify-start items-start space-x-2">
              <div className="bg-gray-700 p-3 rounded-lg max-w-xs text-sm text-gray-200">
                <p>How are you?</p>
              </div>
            </div><div className="flex justify-start items-start space-x-2">
              <div className="bg-gray-700 p-3 rounded-lg max-w-xs text-sm text-gray-200">
                <p>How are you?</p>
              </div>
            </div><div className="flex justify-start items-start space-x-2">
              <div className="bg-gray-700 p-3 rounded-lg max-w-xs text-sm text-gray-200">
                <p>How are you?</p>
              </div>
            </div><div className="flex justify-start items-start space-x-2">
              <div className="bg-gray-700 p-3 rounded-lg max-w-xs text-sm text-gray-200">
                <p>How are you?</p>
              </div>
            </div><div className="flex justify-start items-start space-x-2">
              <div className="bg-gray-700 p-3 rounded-lg max-w-xs text-sm text-gray-200">
                <p>How are you?</p>
              </div>
            </div><div className="flex justify-start items-start space-x-2">
              <div className="bg-gray-700 p-3 rounded-lg max-w-xs text-sm text-gray-200">
                <p>How are you?</p>
              </div>
            </div><div className="flex justify-start items-start space-x-2">
              <div className="bg-gray-700 p-3 rounded-lg max-w-xs text-sm text-gray-200">
                <p>How are you?</p>
              </div>
            </div><div className="flex justify-start items-start space-x-2">
              <div className="bg-gray-700 p-3 rounded-lg max-w-xs text-sm text-gray-200">
                <p>How are you?</p>
              </div>
            </div><div className="flex justify-start items-start space-x-2">
              <div className="bg-gray-700 p-3 rounded-lg max-w-xs text-sm text-gray-200">
                <p>How are you?</p>
              </div>
            </div><div className="flex justify-start items-start space-x-2">
              <div className="bg-gray-700 p-3 rounded-lg max-w-xs text-sm text-gray-200">
                <p>How are you?</p>
              </div>
            </div><div className="flex justify-start items-start space-x-2">
              <div className="bg-gray-700 p-3 rounded-lg max-w-xs text-sm text-gray-200">
                <p>How are you?</p>
              </div>
            </div><div className="flex justify-start items-start space-x-2">
              <div className="bg-gray-700 p-3 rounded-lg max-w-xs text-sm text-gray-200">
                <p>How are you?</p>
              </div>
            </div><div className="flex justify-start items-start space-x-2">
              <div className="bg-gray-700 p-3 rounded-lg max-w-xs text-sm text-gray-200">
                <p>How are you?</p>
              </div>
            </div>

            <div className="flex justify-start items-start space-x-2">
              <div className="bg-gray-700 p-3 rounded-lg max-w-xs text-sm text-gray-200">
                <p>Does this work?</p>
              </div>
            </div>

            {/* Sent Messages */}
            <div className="flex justify-end items-start space-x-2">
              <div className="bg-cyan-600 p-3 rounded-lg max-w-xs text-sm text-gray-900">
                <p>Yes, it does!</p>
              </div>
            </div>

            <div className="flex justify-end items-start space-x-2">
              <div className="bg-cyan-600 p-3 rounded-lg max-w-xs text-sm text-gray-900">
                <p>Testing one more time!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Message Input and Send Button */}
        <div className="p-4 bg-black border-t border-gray-800 flex items-center">
          <input
            type="text"
            placeholder="Enter a Message..."
            className="flex-grow p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button className="ml-2 bg-cyan-600 p-2 rounded-lg hover:bg-cyan-500 transition duration-300">
            ➤
          </button>
        </div>
      </div>
      </>
    );
};

export default ChatScreen;