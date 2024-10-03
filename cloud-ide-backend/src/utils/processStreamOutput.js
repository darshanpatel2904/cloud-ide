export function processStreamOutput(stream, ws) {
  let pendingDataType = null;
  let pendingDataLength = null;
  let buffer = Buffer.alloc(0);

  const sliceBuffer = (length) => {
    const sliced = buffer.slice(0, length);
    buffer = buffer.slice(length);
    return sliced;
  };

  // Main function to handle incoming data
  const handleData = (incomingData) => {
    if (incomingData) {
      buffer = Buffer.concat([buffer, incomingData]);
    }
    while (true) {
      if (!pendingDataType && buffer.length >= 8) {
        const header = sliceBuffer(8);
        pendingDataType = header.readUInt8(0);
        pendingDataLength = header.readUInt32BE(4);
      }

      if (pendingDataType && buffer.length >= pendingDataLength) {
        const messageContent = sliceBuffer(pendingDataLength);
        console.log(messageContent.toString());
        ws.send(messageContent);

        pendingDataType = null;
        pendingDataLength = null;
      } else {
        break;
      }
    }
  };
  stream.on("data", handleData);
}
