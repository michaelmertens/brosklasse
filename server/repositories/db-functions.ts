export function resolveQuery(resolve, reject) {
  return (err, dbResults) => {
    if (err) {
      reject(err);
    } else {
      resolve(dbResults);
    }
  };
}

export function like(value) {
  return new RegExp(`.*${value}.*`, 'i');
}
