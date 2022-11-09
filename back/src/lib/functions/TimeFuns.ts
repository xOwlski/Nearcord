const Time = {
  Gen: (SEC: number) => Date.now() + SEC * 1000,

  Check: (TIME: number) => {
    if (Date.now() > TIME) {
      return false;
    }

    return true;
  },
};

export default Time;
