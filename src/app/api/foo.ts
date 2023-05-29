export async function getFoo() {
  await new Promise((resolve) => {
    setTimeout(() => {
      const mess = 'fooo fetched!!';

      resolve(mess);
      console.log(mess);
    }, 3000);
  });

  return {
    foo: 'foooo fooo foo',
  };
}

export default getFoo;
