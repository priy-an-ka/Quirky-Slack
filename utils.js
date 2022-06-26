// Removed keys set by JSONBox from the object
const sanitizedObj = (obj) => {
  const newObj = obj;
  ['_id', '_createdOn', '_updatedOn'].forEach((e) => delete newObj[e]);
  return newObj;
};

module.exports = {
  sanitizedObj,
};
