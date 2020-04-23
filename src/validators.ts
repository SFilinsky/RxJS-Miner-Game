
interface ValidatorsContainer {
  validateNumberInput: (min: number, max: number) => (value: string) => number
}

export const Validators: ValidatorsContainer = {

  validateNumberInput: (min: number, max: number) => (value: string) => {
    let num = parseInt(value);
    return Math.min(
      max,
      Math.max(
        min,
        num
      )
    )
  },

};
