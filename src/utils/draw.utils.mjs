export const getHoleStatus = (dStatus, position) =>
  !dStatus || position < 0 || Math.floor(position / 5) >= dStatus.length
    ? false
    : ((parseInt(dStatus[dStatus.length - 1 - Math.floor(position / 5)], 32) >>
        position % 5) &
        1) ===
      1;
