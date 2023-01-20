exports.userDataPipelining = (userData) => {
  const { _id, email, phoneNumber, firstName, lastName, address } = userData;
  return {
    _id,
    email,
    phoneNumber,
    firstName,
    lastName,
    address,
  };
};
