const ValidAccountId = (ACCOUNTID: string) => {
  try {
    if (ACCOUNTID.length > 64 || ACCOUNTID.length < 2) {
      throw 'Account id length!';
    }

    if (!/^[a-z0-9._-]+$/.test(ACCOUNTID)) {
      throw `Lowercase characters (a-z)
               Digits (0-9)
               Characters (_-) can be used as separators`;
    }

    return true;
  } catch (error) {
    console.error('VAlid Account id check => ', error, ACCOUNTID);
    return false;
  }
};

export default ValidAccountId;
