// for testing purposes
export async function getDelay(duration = 3000) {
  await new Promise((resolve) => {
    setTimeout(() => {
      const mess = 'LoginStatus fetched!!';

      resolve(mess);
      console.log(mess);
    }, duration);
  });

  return { foo: 'fooo' };
}

export default getDelay;
