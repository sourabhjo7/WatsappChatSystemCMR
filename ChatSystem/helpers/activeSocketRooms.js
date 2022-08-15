module.exports = async (io) => {
  const arr = Array.from(io.sockets.adapter.rooms);//getting map of current active rooms from socket

  let filtered = arr.filter(room => !room[1].has(room[0]))//filtering rooms that have more that user joined in

  const rooms = filtered.map(i => i[0])//mapping the array with the name of the rooms

  return rooms;
}
