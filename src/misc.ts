export const extractInput = (event: Event) => (event.currentTarget as HTMLInputElement);

export const getElement = <T>(array: Array<T>, length: number) => (x: number, y: number ) => {
  return array[x * length  + y];
};

export const getIndexes = (index: number, length: number) => {
  return {
    x: Math.floor(index / length),
    y: index % length
  }
};
